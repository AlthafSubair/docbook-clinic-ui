import axios, { type AxiosInstance } from "axios";
import { resolveClinicSlug } from "../../utils/clinicSlug";

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

api.interceptors.request.use(
  (config) => {
    // 1. Attach Access Token if available
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("docbook_clinic_access_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // 2. Attach x-clinic-slug header if resolved and not already set
    if (config.headers && !config.headers["x-clinic-slug"]) {
      const slug = resolveClinicSlug();
      if (slug) {
        config.headers["x-clinic-slug"] = slug;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
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
