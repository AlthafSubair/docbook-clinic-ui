import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getClinicMe,
  updateClinicMe,
  type ClinicDetails,
  type UpdateClinicPayload,
} from "../lib/api/clinic";
import { useAuthStore } from "../stores/authStore";
import { getErrorMessage } from "../lib/api/client";

export const CLINIC_QUERY_KEYS = {
  me: ["clinic", "me"] as const,
};

/**
 * Hook to fetch current clinic profile & settings (GET /clinics/me)
 * Uses TanStack Query with caching and syncs data to Zustand authStore.
 */
export function useClinicMe() {
  const setClinicDetails = useAuthStore((state) => state.setClinicDetails);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<ClinicDetails, Error>({
    queryKey: CLINIC_QUERY_KEYS.me,
    queryFn: async () => {
      const data = await getClinicMe();
      setClinicDetails(data);
      return data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}

/**
 * Hook to update current clinic settings (PATCH /clinics/me)
 * Invalidates and updates cache, syncs to Zustand, and shows toast feedback.
 */
export function useUpdateClinicMe() {
  const queryClient = useQueryClient();
  const setClinicDetails = useAuthStore((state) => state.setClinicDetails);

  return useMutation<ClinicDetails, Error, UpdateClinicPayload>({
    mutationFn: updateClinicMe,
    onSuccess: (updated) => {
      setClinicDetails(updated);
      queryClient.setQueryData(CLINIC_QUERY_KEYS.me, updated);
      toast.success("Clinic details updated successfully");
    },
    onError: (error) => {
      const msg = getErrorMessage(error);
      toast.error("Failed to update clinic", { description: msg });
    },
  });
}
