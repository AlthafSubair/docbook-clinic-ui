import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, ArrowLeft } from "lucide-react";
import { Input, Button } from "docbook-ui-package";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

const forgotPasswordSchema = z.object({
  identifier: z
    .string()
    .min(1, "Please enter your username or email")
    .min(3, "Must be at least 3 characters"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onSubmit?: (data: ForgotPasswordFormData) => void;
  isLoading?: boolean;
}

export function ForgotPasswordForm({
  onSubmit,
  isLoading = false,
}: ForgotPasswordFormProps) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      identifier: "",
    },
  });

  const handleFormSubmit = (data: ForgotPasswordFormData) => {
    if (onSubmit) {
      onSubmit(data);
    } else {
      toast.success("Verification code sent to your registered contact!");
      navigate(`/verify-otp?identifier=${encodeURIComponent(data.identifier)}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-4 w-full"
    >
      <Input
        label="Username or Email"
        placeholder="Enter your registered username or email"
        icon={<Mail className="size-5" />}
        error={errors.identifier?.message}
        disabled={isLoading}
        autoComplete="username"
        {...register("identifier")}
      />

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          className="w-full justify-center text-base py-3"
          disabled={isLoading}
        >
          {isLoading ? "Sending Code..." : "Send Verification Code"}
        </Button>
      </div>

      <div className="flex items-center justify-center pt-2">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary-text hover:text-primary transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Sign In
        </Link>
      </div>
    </form>
  );
}

export default ForgotPasswordForm;
