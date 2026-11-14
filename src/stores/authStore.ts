import { create } from "zustand";
import type { ClinicUser, ClinicProfile, ClinicLoginResponse } from "../lib/api/auth";

interface AuthState {
  user: ClinicUser | null;
  clinic: ClinicProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  setAuth: (response: ClinicLoginResponse) => void;
  logout: () => void;
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

export const useAuthStore = create<AuthState>((set) => ({
  user: getInitialUser(),
  clinic: getInitialClinic(),
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

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("docbook_clinic_access_token");
      localStorage.removeItem("docbook_clinic_user");
      localStorage.removeItem("docbook_clinic_profile");
    }

    set({
      user: null,
      clinic: null,
      accessToken: null,
      isAuthenticated: false,
    });
  },
}));
