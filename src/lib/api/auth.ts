import { api } from "./client";

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

export async function logoutClinic(): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>("/auth/clinic/logout");
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
