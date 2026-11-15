import axios from "axios";
import { api, API_BASE_URL } from "./client";

export interface ClinicLoginPayload {
  identifier: string;
  password: string;
  clinicSlug?: string;
}

export interface ClinicUser {
  userId: string;
  clinicId: string;
  fullName: string;
  username: string;
  email: string;
  role: string;
}

export interface ClinicProfile {
  clinicId: string;
  clinicName: string;
  slug: string;
  timezone: string;
}

export interface ClinicLoginResponse {
  message: string;
  accessToken: string;
  user: ClinicUser;
  clinic: ClinicProfile;
}

export async function loginClinic(
  payload: ClinicLoginPayload
): Promise<ClinicLoginResponse> {
  const headers: Record<string, string> = {};
  if (payload.clinicSlug) {
    headers["x-clinic-slug"] = payload.clinicSlug;
  }

  const { data } = await api.post<ClinicLoginResponse>(
    "/auth/clinic/login",
    payload,
    { headers }
  );

  return data;
}

/**
 * Log out clinic staff member.
 * Relies on the HttpOnly refresh cookie.
 * POST /api/v1/auth/clinic/logout
 */
export async function logoutClinic(): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>(
    "/auth/clinic/logout",
    {},
    { withCredentials: true }
  );

  return data;
}

export async function getClinicMe(): Promise<{
  user: ClinicUser;
  clinic: ClinicProfile;
}> {
  const { data } = await api.get<{
    user: ClinicUser;
    clinic: ClinicProfile;
  }>("/auth/clinic/me");
  return data;
}

/**
 * Refresh clinic staff session via single-use token rotation.
 * The browser automatically attaches the HttpOnly clinicRefreshToken cookie.
 * POST /api/v1/auth/clinic/refresh
 */
export async function refreshClinicSession(): Promise<ClinicLoginResponse> {
  const { data } = await axios.post<ClinicLoginResponse>(
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
  return data;
}
