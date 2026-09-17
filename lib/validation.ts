/**
 * Central strict input validation (zod v4).
 * Policy: REJECT anything that doesn't match — never sanitize/escape and
 * accept. Every schema pins type, length, and format. Server routes must
 * `safeParse` untrusted input and return 400 on failure; client forms reuse
 * the same schemas for instant feedback (defense in depth, not a boundary).
 */
import { z } from "zod";

// Reusable primitives — strict type + length + format.
export const emailSchema = z.string().trim().min(5).max(254).email();
export const passwordSchema = z.string().min(8).max(128);
export const phoneSchema = z.string().trim().min(7).max(20).regex(/^[+\d][\d\s\-()]*$/, "Invalid phone number.");
export const nameSchema = z.string().trim().min(2).max(100).regex(/^[\p{L}\p{M} .'\-]+$/u, "Invalid name.");
export const shortText = (min: number, max: number) => z.string().trim().min(min).max(max);
export const longText = (min: number, max: number) => z.string().trim().min(min).max(max);
export const optionalText = (max: number) => z.string().trim().max(max).optional().default("");
export const slugSchema = z.string().trim().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug.");
export const uuidSchema = z.string().uuid();
export const sortOrderSchema = z.coerce.number().int().min(0).max(100000).default(0);
export const flagSchema = z.coerce.boolean().default(true);
export const urlSchema = z.string().trim().max(2048).refine((v) => v === "" || v === "#" || /^https?:\/\/.+/i.test(v) || v.startsWith("/"), "Invalid URL.");
export const imageUrlSchema = z.string().trim().max(2048).refine((v) => v === "" || /^https?:\/\/.+/i.test(v) || v.startsWith("/"), "Invalid image URL.");

// Public write endpoints (server is the trust boundary).
export const enquirySchema = z.strictObject({
  full_name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  subject: shortText(3, 150),
  message: longText(10, 5000),
});
export const admissionSchema = z.strictObject({
  student_name: nameSchema,
  parent_name: z.string().trim().max(100).regex(/^[\p{L}\p{M} .'\-]*$/u, "Invalid name.").optional().default(""),
  phone: phoneSchema,
  email: z.string().trim().max(254).refine((v) => v === "" || z.string().email().safeParse(v).success, "Invalid email.").optional().default(""),
  class_name: shortText(1, 100),
  course: z.string().trim().max(100).optional().default(""),
  preferred_batch: z.enum(["Morning", "Afternoon", "Evening", "Weekend", ""]).optional().default(""),
  message: z.string().trim().max(2000).optional().default(""),
});
export const testimonialSubmitSchema = z.strictObject({
  name: nameSchema,
  course: shortText(1, 100),
  message: longText(10, 2000),
  rating: z.coerce.number().int().min(1).max(5),
});

// Admin content schemas (validated client-side AND server-side in API routes).
export const batchSchema = z.strictObject({
  name: shortText(2, 100),
  time: shortText(1, 50),
  days: shortText(1, 100),
  level: shortText(1, 100),
  mode: z.enum(["Offline", "Online", "Hybrid"]),
  description: z.string().trim().max(1000).optional().default(""),
  sort_order: sortOrderSchema,
  is_active: flagSchema,
});
export const noticeSchema = z.strictObject({
  title: shortText(3, 200),
  description: z.string().trim().max(5000).optional().default(""),
  category: z.enum(["General", "Admission", "Exam", "Event", "Holiday"]),
});
export const courseSchema = z.strictObject({
  title: shortText(3, 200),
  slug: slugSchema.optional(),
  description: z.string().trim().max(5000).optional().default(""),
  eligibility: z.string().trim().max(1000).optional().default(""),
  duration: z.string().trim().max(100).optional().default(""),
  fees: z.string().trim().max(50).optional().default(""),
  mode: z.enum(["Offline", "Online", "Hybrid"]).optional().default("Offline"),
  image_url: imageUrlSchema.optional().default(""),
  sort_order: sortOrderSchema,
  is_active: flagSchema,
});
export const trainerSchema = z.strictObject({
  name: nameSchema,
  role: shortText(2, 100),
  qualification: z.string().trim().max(500).optional().default(""),
  experience: z.string().trim().max(200).optional().default(""),
  image_url: imageUrlSchema.optional().default(""),
  sort_order: sortOrderSchema,
  is_active: flagSchema,
});
export const faqSchema = z.strictObject({
  question: shortText(5, 500),
  answer: longText(2, 5000),
  sort_order: sortOrderSchema,
  is_active: flagSchema,
});
export const gallerySchema = z.strictObject({
  title: shortText(2, 200),
  image_url: imageUrlSchema.refine((v) => v !== "", "Image URL is required."),
});
export const heroSlideSchema = z.strictObject({
  badge: z.string().trim().max(100).optional().default(""),
  title: shortText(3, 200),
  description: z.string().trim().max(1000).optional().default(""),
  image_url: imageUrlSchema.optional().default(""),
  primary_button_text: z.string().trim().max(50).optional().default(""),
  primary_button_link: urlSchema.optional().default(""),
  secondary_button_text: z.string().trim().max(50).optional().default(""),
  secondary_button_link: urlSchema.optional().default(""),
  sort_order: sortOrderSchema,
  is_active: flagSchema,
});
export const statSchema = z.strictObject({
  label: shortText(2, 100),
  value: z.coerce.number().min(0).max(100000000),
  suffix: z.string().trim().max(10).optional().default(""),
  icon: shortText(1, 50),
  sort_order: sortOrderSchema,
  is_active: flagSchema,
});
export const testimonialAdminSchema = z.strictObject({
  name: nameSchema,
  course: shortText(1, 100),
  message: longText(10, 2000),
  rating: z.coerce.number().int().min(1).max(5),
  avatar: imageUrlSchema.optional().default(""),
  is_active: flagSchema,
});
export const successStorySchema = z.strictObject({
  name: nameSchema,
  achievement: shortText(3, 500),
  story: z.string().trim().max(5000).optional().default(""),
  image_url: imageUrlSchema.optional().default(""),
  sort_order: sortOrderSchema,
  is_active: flagSchema,
});
export const featureSchema = z.strictObject({
  section_slug: slugSchema,
  title: shortText(3, 200),
  description: z.string().trim().max(2000).optional().default(""),
  icon: shortText(1, 50),
  sort_order: sortOrderSchema,
  is_active: flagSchema,
});
export const navLinkSchema = z.strictObject({
  label: shortText(1, 100),
  href: urlSchema,
  sort_order: sortOrderSchema,
  is_active: flagSchema,
});
export const footerLinkSchema = navLinkSchema.extend({ group_name: shortText(1, 50) });
export const socialLinkSchema = z.strictObject({
  platform: shortText(1, 50),
  href: z.string().trim().max(2048).regex(/^https?:\/\/.+/i, "Invalid URL."),
  icon: shortText(1, 50),
  sort_order: sortOrderSchema,
  is_active: flagSchema,
});
export const idSchema = uuidSchema;
export const statusSchema = z.enum(["New", "Contacted", "Enrolled", "Closed"]);

/** Reject-or-return helper for route handlers: 400 with field errors. */
export function validationError(message: string, issues: { path: string; message: string }[]) {
  return { error: message, issues };
}

export function toIssues(e: z.ZodError): { path: string; message: string }[] {
  return e.issues.map((i) => ({ path: i.path.join("."), message: i.message }));
}

// Auth endpoints.
export const loginSchema = z.strictObject({ email: emailSchema, password: passwordSchema });
export const signupSchema = z.strictObject({ email: emailSchema, password: z.string().min(8).max(72) });
export const resetPasswordSchema = z.strictObject({ email: emailSchema });
export const loginIdSchema = z.string().trim().min(2).max(254).regex(/^[A-Za-z0-9._@-]+$/, "Invalid login id.");
