import { api } from "./client";

export type ClinicUserRole = "admin" | "doctor" | "receptionist" | "accountant" | string;

export interface ClinicUser {
  userId: string;
  clinicId: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  role: ClinicUserRole;
  isActive: boolean;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface QueryClinicUsersParams {
  search?: string;
  role?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface PaginatedClinicUsersResponse {
  data: ClinicUser[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
}

/**
 * Fetch paginated clinic staff users (GET /clinic-users)
 */
export async function getClinicUsers(
  params?: QueryClinicUsersParams
): Promise<PaginatedClinicUsersResponse> {
  const { data } = await api.get<PaginatedClinicUsersResponse>("/clinic-users", {
    params,
  });
  return data;
}
