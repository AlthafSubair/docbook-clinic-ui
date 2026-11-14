import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Lock } from "lucide-react";
import { Input, PasswordInput, Button } from "docbook-ui-package";

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
  onSubmit?: (data: LoginFormData) => void;
  isLoading?: boolean;
}

export function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
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
    onSubmit?.(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4 w-full">
      <Input
        label="Username or Email"
        placeholder="Enter your username or email"
        icon={<User className="size-5" />}
        error={errors.identifier?.message}
        disabled={isLoading}
        autoComplete="username"
        {...register("identifier")}
      />

      <PasswordInput
        label="Password"
        placeholder="Enter your password"
        icon={<Lock className="size-5" />}
        error={errors.password?.message}
        disabled={isLoading}
        autoComplete="current-password"
        {...register("password")}
      />

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          className="w-full justify-center text-base py-3"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </div>
    </form>
  );
}

export default LoginForm;
