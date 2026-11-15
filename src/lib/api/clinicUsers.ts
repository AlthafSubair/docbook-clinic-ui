import { api } from "./client";

export const UserRole = {
  DOCTOR: "doctor",
  ADMIN: "admin",
  RECEPTIONIST: "receptionist",
  ACCOUNTANT: "accountant",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export type ClinicUserRole = UserRole | string;

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

export interface CreateClinicUserPayload {
  fullName: string;
  username: string;
  email: string;
  phone?: string;
  role: UserRole;
  password: string;
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

/**
 * Create a new clinic staff member (POST /clinic-users)
 */
export async function createClinicUser(
  payload: CreateClinicUserPayload
): Promise<ClinicUser> {
  const { data } = await api.post<ClinicUser>("/clinic-users", payload);
  return data;
}
