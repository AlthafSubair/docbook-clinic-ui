import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getClinicUsers,
  createClinicUser,
  type QueryClinicUsersParams,
  type PaginatedClinicUsersResponse,
  type CreateClinicUserPayload,
  type ClinicUser,
} from "../lib/api/clinicUsers";
import { useAuthStore } from "../stores/authStore";
import { getErrorMessage } from "../lib/api/client";

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

/**
 * Hook to create a new clinic staff member (POST /clinic-users)
 */
export function useCreateClinicUser() {
  const queryClient = useQueryClient();

  return useMutation<ClinicUser, Error, CreateClinicUserPayload>({
    mutationFn: createClinicUser,
    onSuccess: (newUser) => {
      queryClient.invalidateQueries({ queryKey: CLINIC_USERS_QUERY_KEYS.all });
      toast.success(`${newUser.fullName} added successfully as ${newUser.role}`);
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, "Failed to create staff member"));
    },
  });
}
