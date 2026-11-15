import { api } from "./client";

export interface ClinicDetails {
  clinicId: string;
  clinicName: string;
  slug: string;
  clinicPhone: string;
  clinicEmail: string;
  address: string;
  latitude?: string | null;
  longitude?: string | null;
  timezone: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface UpdateClinicPayload {
  clinicName?: string;
  clinicPhone?: string;
  clinicEmail?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  timezone?: string;
}

/**
 * Fetch current clinic profile and settings (GET /clinics/me)
 */
export async function getClinicMe(): Promise<ClinicDetails> {
  const { data } = await api.get<ClinicDetails>("/clinics/me");
  return data;
}

/**
 * Update current clinic settings (PATCH /clinics/me)
 */
export async function updateClinicMe(
  payload: UpdateClinicPayload
): Promise<ClinicDetails> {
  const { data } = await api.patch<ClinicDetails>("/clinics/me", payload);
  return data;
}
