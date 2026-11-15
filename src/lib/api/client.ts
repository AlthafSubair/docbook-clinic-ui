import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  AxiosError,
} from "axios";
import { resolveClinicSlug } from "../../utils/clinicSlug";
import { useAuthStore } from "../../stores/authStore";
import type { ClinicUser, ClinicProfile } from "./auth";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json, */*",
  },
});

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/* Request Interceptor */
api.interceptors.request.use(
  (config) => {
    // 1. Attach Access Token if available (prefer memory state, fallback to localStorage)
    const token =
      useAuthStore.getState().accessToken ||
      (typeof window !== "undefined"
        ? localStorage.getItem("docbook_clinic_access_token")
        : null);

    if (token && config.headers) {
      if (typeof config.headers.set === "function") {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // 2. Attach x-clinic-slug header if resolved and not already set
    const slug = resolveClinicSlug();
    if (slug && config.headers) {
      const hasSlug =
        typeof config.headers.get === "function"
          ? Boolean(config.headers.get("x-clinic-slug"))
          : Boolean(config.headers["x-clinic-slug"]);

      if (!hasSlug) {
        if (typeof config.headers.set === "function") {
          config.headers.set("x-clinic-slug", slug);
        } else {
          config.headers["x-clinic-slug"] = slug;
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* Response Interceptor: Handles 401 & Automatic Refresh Token Rotation */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig | undefined;

    // Check if error is 401 Unauthorized and request has not already been retried
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/clinic/refresh") &&
      !originalRequest.url?.includes("/auth/clinic/login") &&
      !originalRequest.url?.includes("/auth/clinic/logout")
    ) {
      if (isRefreshing) {
        // If a refresh is already in flight, queue this request until completed
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (newToken: string) => {
              if (originalRequest.headers) {
                if (typeof originalRequest.headers.set === "function") {
                  originalRequest.headers.set("Authorization", `Bearer ${newToken}`);
                } else {
                  originalRequest.headers.Authorization = `Bearer ${newToken}`;
                }
              }
              resolve(api(originalRequest));
            },
            reject: (err: unknown) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call backend refresh endpoint with withCredentials: true.
        // The browser automatically transmits the HttpOnly clinicRefreshToken cookie.
        const refreshResponse = await axios.post<{
          message: string;
          accessToken: string;
          user?: ClinicUser;
          clinic?: ClinicProfile;
        }>(
          `${API_BASE_URL}/auth/clinic/refresh`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "*/*",
            },
            withCredentials: true,
          }
        );

        const newAccessToken = refreshResponse.data?.accessToken;

        if (!newAccessToken) {
          throw new Error("No access token returned from clinic refresh endpoint");
        }

        // Update token and session in Zustand & localStorage
        useAuthStore.getState().setAccessToken(
          newAccessToken,
          refreshResponse.data.user,
          refreshResponse.data.clinic
        );

        // Update authorization header on the original request
        if (originalRequest.headers) {
          if (typeof originalRequest.headers.set === "function") {
            originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);
          } else {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
        }

        processQueue(null, newAccessToken);
        isRefreshing = false;

        // Replay original request with fresh access token
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        isRefreshing = false;

        // Revoke state locally and direct user to login
        useAuthStore.getState().logoutLocal();
        if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshErr);
      }
    }

    // Standard error formatting
    let message = "An unexpected error occurred";
    let status = 0;
    let data: unknown = null;

    if (error.response) {
      status = error.response.status;
      data = error.response.data;
      const resData = data as { message?: string | string[] } | undefined;
      if (resData?.message) {
        message = Array.isArray(resData.message)
          ? resData.message.join(", ")
          : resData.message;
      } else if (typeof data === "string") {
        message = data;
      }
    } else if (error.request) {
      message = "Network error. Please check your internet connection.";
    } else if (error.message) {
      message = error.message;
    }

    return Promise.reject(new ApiError(message, status, data));
  }
);

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string | string[] } | undefined;
    if (data?.message) {
      return Array.isArray(data.message) ? data.message.join(", ") : data.message;
    }
    return error.message || "An unexpected network error occurred";
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}
