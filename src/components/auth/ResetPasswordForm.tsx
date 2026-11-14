import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, CheckCircle2 } from "lucide-react";
import { PasswordInput, Button } from "docbook-ui-package";
import { Link } from "react-router";
import { useState } from "react";
import { toast } from "sonner";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  onSubmit?: (data: ResetPasswordFormData) => void;
  isLoading?: boolean;
}

export function ResetPasswordForm({
  onSubmit,
  isLoading = false,
}: ResetPasswordFormProps) {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleFormSubmit = async (data: ResetPasswordFormData) => {
    if (onSubmit) {
      onSubmit(data);
    } else {
      toast.success("Password reset successfully!");
      setIsSuccess(true);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-4 text-center py-4">
        <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <CheckCircle2 className="size-9" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold text-slate-800">Password Updated!</h3>
          <p className="text-sm text-secondary-text">
            Your password has been changed. You can now log in with your new credentials.
          </p>
        </div>
        <Link to="/login" className="w-full pt-2">
          <Button variant="primary" className="w-full justify-center py-3">
            Back to Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-4 w-full"
    >
      <PasswordInput
        label="New Password"
        placeholder="Enter your new password"
        icon={<Lock className="size-5" />}
        error={errors.password?.message}
        disabled={isLoading}
        autoComplete="new-password"
        {...register("password")}
      />

      <PasswordInput
        label="Confirm New Password"
        placeholder="Re-enter your new password"
        icon={<Lock className="size-5" />}
        error={errors.confirmPassword?.message}
        disabled={isLoading}
        autoComplete="new-password"
        {...register("confirmPassword")}
      />

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          className="w-full justify-center text-base py-3"
          disabled={isLoading}
        >
          {isLoading ? "Updating Password..." : "Reset Password"}
        </Button>
      </div>

      <div className="flex items-center justify-center pt-2">
        <Link
          to="/login"
          className="text-sm font-medium text-secondary-text hover:text-primary transition-colors"
        >
          Back to Sign In
        </Link>
      </div>
    </form>
  );
}

export default ResetPasswordForm;
