import { z } from "zod";
import { UserRole } from "../api/clinicUsers";

/**
 * Zod schema for adding a clinic staff user
 */
export const addStaffSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters"),
  username: z
    .string()
    .trim()
    .min(1, "Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username cannot exceed 50 characters")
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      "Username can only contain letters, numbers, dots, and hyphens"
    ),
  phone: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || /^\+?[0-9\s\-()]{8,20}$/.test(val),
      "Please enter a valid phone number (e.g. +91 98765 43210)"
    ),
  email: z
    .string()
    .trim()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),
  role: z.enum([
    UserRole.DOCTOR,
    UserRole.ADMIN,
    UserRole.RECEPTIONIST,
    UserRole.ACCOUNTANT,
  ]),
  password: z
    .string()
    .min(1, "Initial password is required")
    .min(8, "Password must be at least 8 characters long"),
});

export type AddStaffFormData = z.infer<typeof addStaffSchema>;
