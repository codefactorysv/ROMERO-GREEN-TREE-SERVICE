import { z } from "zod";
import { propertyTypeOptions, serviceOptions } from "@/lib/content";

export const MAX_FILES = 4;
export const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB per file
export const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];

// Shared schema for the text fields of the Free Estimate form. Used on the
// client for inline validation and on the server as the source of truth.
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(120, "That name looks too long"),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number")
    .max(20, "That phone number looks too long")
    .regex(/^[0-9()+\-.\s]+$/, "Please use numbers, spaces, and ()+- only"),
  email: z
    .string()
    .trim()
    .max(200)
    .email("Please enter a valid email")
    .optional()
    .or(z.literal("")),
  address: z.string().trim().max(200).optional().or(z.literal("")),
  service: z.enum(serviceOptions, {
    message: "Please select the service you need",
  }),
  propertyType: z.enum(propertyTypeOptions).optional(),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  // Honeypot — must always arrive empty from a real visitor.
  company: z.string().max(0).optional().or(z.literal("")),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export type ContactFieldErrors = Partial<Record<keyof ContactFormValues, string>>;
