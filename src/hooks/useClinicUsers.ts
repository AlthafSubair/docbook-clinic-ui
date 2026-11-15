import { useQuery } from "@tanstack/react-query";
import {
  getClinicUsers,
  type QueryClinicUsersParams,
  type PaginatedClinicUsersResponse,
} from "../lib/api/clinicUsers";
import { useAuthStore } from "../stores/authStore";

export const CLINIC_USERS_QUERY_KEYS = {
  all: ["clinic-users"] as const,
  list: (params?: QueryClinicUsersParams) => ["clinic-users", "list", params] as const,
};

/**
 * Hook to fetch paginated clinic staff users (GET /clinic-users)
 */
export function useClinicUsers(params?: QueryClinicUsersParams) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<PaginatedClinicUsersResponse, Error>({
    queryKey: CLINIC_USERS_QUERY_KEYS.list(params),
    queryFn: () => getClinicUsers(params),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 3, // 3 minutes
    retry: 1,
  });
}
