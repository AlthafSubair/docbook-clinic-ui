import { z } from "zod";

/**
 * Zod validation schema for clinic information
 */
export const editClinicSchema = z.object({
  clinicName: z
    .string()
    .trim()
    .min(2, "Clinic name must be at least 2 characters")
    .max(150, "Clinic name cannot exceed 150 characters"),
  clinicPhone: z
    .string()
    .trim()
    .min(8, "Please enter a valid phone number")
    .regex(
      /^\+?[0-9\s\-()]{8,20}$/,
      "Please enter a valid phone number (e.g. +91 98765 43210)"
    ),
  clinicEmail: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email address cannot exceed 255 characters"),
  address: z
    .string()
    .trim()
    .min(5, "Clinic address must be at least 5 characters"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

export type EditClinicFormData = z.infer<typeof editClinicSchema>;
