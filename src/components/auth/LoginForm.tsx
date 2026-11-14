import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Lock } from "lucide-react";
import { Input, PasswordInput, Button } from "docbook-ui-package";
import { Link, useParams } from "react-router";
import { resolveClinicSlug } from "../../utils/clinicSlug";
import { useClinicLogin } from "../../hooks/useClinicAuth";

const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Username or email is required")
    .min(3, "Must be at least 3 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  initialSlug?: string;
  onSubmit?: (data: LoginFormData & { clinicSlug?: string }) => void;
}

export function LoginForm({ initialSlug, onSubmit }: LoginFormProps) {
  const { slug: routeSlug } = useParams<{ slug?: string }>();
  const clinicSlug = resolveClinicSlug(initialSlug || routeSlug);

  const loginMutation = useClinicLogin();
  const isLoading = loginMutation.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const handleFormSubmit = (data: LoginFormData) => {
    const slugToSend = clinicSlug || undefined;

    if (onSubmit) {
      onSubmit({ ...data, clinicSlug: slugToSend });
    } else {
      loginMutation.mutate({
        identifier: data.identifier.trim(),
        password: data.password,
        clinicSlug: slugToSend,
      });
    }
  };

  const onInvalid = (formErrors: unknown) => {
    console.warn("LoginForm validation failed:", formErrors);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit, onInvalid)}
      className="flex flex-col gap-4 w-full"
    >
      {/* Username or Email Input */}
      <Input
        label="Username or Email"
        placeholder="Enter your username or email"
        icon={<User className="size-5" />}
        error={errors.identifier?.message}
        disabled={isLoading}
        autoComplete="username"
        {...register("identifier")}
      />

      {/* Password Input */}
      <PasswordInput
        label="Password"
        placeholder="Enter your password"
        icon={<Lock className="size-5" />}
        error={errors.password?.message}
        disabled={isLoading}
        autoComplete="current-password"
        {...register("password")}
      />

      {/* Forgot Password Link */}
      <div className="flex justify-end -mt-1">
        <Link
          to={clinicSlug ? `/${clinicSlug}/forgot-password` : "/forgot-password"}
          className="text-xs sm:text-sm font-medium text-primary hover:underline hover:text-primary-dark transition-colors"
        >
          Forgot Password?
        </Link>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          className="w-full justify-center text-base py-3"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </div>
    </form>
  );
}

export default LoginForm;
