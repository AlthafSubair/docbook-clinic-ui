import { create } from "zustand";
import axios from "axios";
import { logoutClinic, type ClinicUser, type ClinicProfile, type ClinicLoginResponse } from "../lib/api/auth";
import type { ClinicDetails } from "../lib/api/clinic";
import { API_BASE_URL } from "../lib/api/client";

interface AuthState {
  user: ClinicUser | null;
  clinic: ClinicProfile | null;
  clinicDetails: ClinicDetails | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  setAuth: (response: ClinicLoginResponse) => void;
  setAccessToken: (token: string, user?: ClinicUser, clinic?: ClinicProfile) => void;
  setClinicDetails: (details: ClinicDetails) => void;
  logout: () => Promise<void>;
  logoutLocal: () => void;
  refreshSession: () => Promise<boolean>;
}

const getInitialAccessToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("docbook_clinic_access_token") || null;
  }
  return null;
};

const getInitialUser = (): ClinicUser | null => {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("docbook_clinic_user");
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }
  }
  return null;
};

const getInitialClinic = (): ClinicProfile | null => {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("docbook_clinic_profile");
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }
  }
  return null;
};

const getInitialClinicDetails = (): ClinicDetails | null => {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("docbook_clinic_details");
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }
  }
  return null;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getInitialUser(),
  clinic: getInitialClinic(),
  clinicDetails: getInitialClinicDetails(),
  accessToken: getInitialAccessToken(),
  isAuthenticated: Boolean(getInitialAccessToken()),

  setAuth: (response: ClinicLoginResponse) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("docbook_clinic_access_token", response.accessToken);
      localStorage.setItem("docbook_clinic_user", JSON.stringify(response.user));
      localStorage.setItem("docbook_clinic_profile", JSON.stringify(response.clinic));
    }

    set({
      user: response.user,
      clinic: response.clinic,
      accessToken: response.accessToken,
      isAuthenticated: true,
    });
  },

  setAccessToken: (token: string, user?: ClinicUser, clinic?: ClinicProfile) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("docbook_clinic_access_token", token);
      if (user) {
        localStorage.setItem("docbook_clinic_user", JSON.stringify(user));
      }
      if (clinic) {
        localStorage.setItem("docbook_clinic_profile", JSON.stringify(clinic));
      }
    }

    set((state) => ({
      accessToken: token,
      isAuthenticated: true,
      user: user || state.user,
      clinic: clinic || state.clinic,
    }));
  },

  logoutLocal: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("docbook_clinic_access_token");
      localStorage.removeItem("docbook_clinic_user");
      localStorage.removeItem("docbook_clinic_profile");
      localStorage.removeItem("docbook_clinic_details");
    }

    set({
      user: null,
      clinic: null,
      clinicDetails: null,
      accessToken: null,
      isAuthenticated: false,
    });
  },

  refreshSession: async (): Promise<boolean> => {
    try {
      const res = await axios.post<ClinicLoginResponse>(
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

      if (res.data?.accessToken) {
        const { accessToken, user, clinic } = res.data;
        if (typeof window !== "undefined") {
          localStorage.setItem("docbook_clinic_access_token", accessToken);
          if (user) {
            localStorage.setItem("docbook_clinic_user", JSON.stringify(user));
          }
          if (clinic) {
            localStorage.setItem("docbook_clinic_profile", JSON.stringify(clinic));
          }
        }

        set({
          accessToken,
          user: user || null,
          clinic: clinic || null,
          isAuthenticated: true,
        });

        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  setClinicDetails: (details: ClinicDetails) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("docbook_clinic_details", JSON.stringify(details));
      localStorage.setItem(
        "docbook_clinic_profile",
        JSON.stringify({
          clinicId: details.clinicId,
          clinicName: details.clinicName,
          slug: details.slug,
          timezone: details.timezone,
        })
      );
    }

    set((state) => ({
      clinicDetails: details,
      clinic: state.clinic
        ? {
            ...state.clinic,
            clinicName: details.clinicName,
            slug: details.slug,
            timezone: details.timezone,
          }
        : {
            clinicId: details.clinicId,
            clinicName: details.clinicName,
            slug: details.slug,
            timezone: details.timezone,
          },
    }));
  },

  logout: async () => {
    try {
      // Backend revokes session and clears HttpOnly refresh cookie
      await logoutClinic();
    } catch (err) {
      console.warn("Backend clinic logout request failed:", err);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("docbook_clinic_access_token");
        localStorage.removeItem("docbook_clinic_user");
        localStorage.removeItem("docbook_clinic_profile");
        localStorage.removeItem("docbook_clinic_details");
      }

      set({
        user: null,
        clinic: null,
        clinicDetails: null,
        accessToken: null,
        isAuthenticated: false,
      });
    }
  },
}));
