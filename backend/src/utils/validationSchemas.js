const { z } = require("zod");

// ============ Auth Schemas ============

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Please provide a valid email address")
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
});

// ============ Feeling Schemas ============

const objectIdSchema = z
  .string({ required_error: "ID is required" })
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

const createFeelingSchema = z.object({
  slug: z
    .string({ required_error: "Slug is required" })
    .min(1, "Slug cannot be empty")
    .toLowerCase()
    .trim()
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),
  title: z
    .string({ required_error: "Title is required" })
    .min(1, "Title cannot be empty")
    .trim(),
  emoji: z.string().trim().optional().default(""),
  preview: z
    .string({ required_error: "Preview is required" })
    .min(1, "Preview cannot be empty")
    .trim(),
  reminder: z
    .string({ required_error: "Reminder is required" })
    .min(1, "Reminder cannot be empty")
    .trim(),
  verseId: objectIdSchema,
  duaId: objectIdSchema,
  actions: z
    .array(z.string().trim().min(1, "Action cannot be empty"))
    .min(1, "At least one action is required"),
});

const updateFeelingSchema = createFeelingSchema.partial();

// ============ Sura Schemas ============

const createSuraSchema = z.object({
  suraNumber: z
    .number({ required_error: "Sura number is required" })
    .int("Sura number must be an integer")
    .min(1, "Sura number must be at least 1")
    .max(114, "Sura number cannot exceed 114"),
  nameArabic: z.string().trim().optional().default(""),
  nameEnglish: z.string().trim().optional().default(""),
  transliteration: z.string().trim().optional().default(""),
  totalVerses: z
    .number()
    .int()
    .min(1, "Total verses must be at least 1")
    .optional()
    .nullable(),
});

const updateSuraSchema = createSuraSchema.partial().omit({ suraNumber: true });

// ============ Verse Schemas ============

const createVerseSchema = z.object({
  suraNumber: z
    .number({ required_error: "Sura number is required" })
    .int("Sura number must be an integer")
    .min(1, "Sura number must be at least 1")
    .max(114, "Sura number cannot exceed 114"),
  verseNumber: z
    .number({ required_error: "Verse number is required" })
    .int("Verse number must be an integer")
    .min(1, "Verse number must be at least 1"),
  arabicText: z
    .string({ required_error: "Arabic text is required" })
    .min(1, "Arabic text cannot be empty")
    .trim(),
  translationText: z
    .string({ required_error: "Translation text is required" })
    .min(1, "Translation text cannot be empty")
    .trim(),
  transliteration: z.string().trim().optional().default(""),
  reference: z.string().trim().optional().default(""),
});

const updateVerseSchema = createVerseSchema
  .partial()
  .omit({ suraNumber: true, verseNumber: true });

// ============ Param Schemas ============

const mongoIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
});

const slugParamSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
});

const suraNumberParamSchema = z.object({
  suraNumber: z
    .string()
    .regex(/^\d+$/, "Sura number must be a number")
    .transform(Number),
});

const verseNumberParamSchema = z.object({
  suraNumber: z
    .string()
    .regex(/^\d+$/, "Sura number must be a number")
    .transform(Number),
  verseNumber: z
    .string()
    .regex(/^\d+$/, "Verse number must be a number")
    .transform(Number),
});

module.exports = {
  loginSchema,
  createFeelingSchema,
  updateFeelingSchema,
  createSuraSchema,
  updateSuraSchema,
  createVerseSchema,
  updateVerseSchema,
  mongoIdParamSchema,
  slugParamSchema,
  suraNumberParamSchema,
  verseNumberParamSchema,
};
