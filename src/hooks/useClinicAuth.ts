import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { loginClinic, type ClinicLoginPayload, type ClinicLoginResponse } from "../lib/api/auth";
import { useAuthStore } from "../stores/authStore";
import { getErrorMessage } from "../lib/api/client";

export function useClinicLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<ClinicLoginResponse, Error, ClinicLoginPayload>({
    mutationFn: loginClinic,
    onSuccess: (data) => {
      setAuth(data);
      toast.success(`Welcome back, ${data.user.fullName}!`, {
        description: `Logged in to ${data.clinic.clinicName}`,
      });
      navigate("/");
    },
    onError: (error) => {
      const msg = getErrorMessage(error);
      toast.error("Login failed", { description: msg });
    },
  });
}

export function useClinicLogout() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => {
      toast.success("Logged out successfully");
      navigate("/login");
    },
    onError: () => {
      toast.error("Logout completed with local cleanup");
      navigate("/login");
    },
  });
}
