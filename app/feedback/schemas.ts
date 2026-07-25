import { z } from "zod";

export const MESSAGE_MAX_LENGTH = 2000;
export const AUTHOR_NAME_MAX_LENGTH = 60;

export const feedbackSchema = z.object({
  targetLeaderId: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : null)),
  authorName: z
    .string()
    .trim()
    .max(AUTHOR_NAME_MAX_LENGTH, `Numele poate avea maximum ${AUTHOR_NAME_MAX_LENGTH} de caractere.`)
    .optional()
    .transform((value) => (value ? value : null)),
  message: z
    .string()
    .trim()
    .min(3, "Scrie un mesaj de cel puțin 3 caractere.")
    .max(MESSAGE_MAX_LENGTH, `Mesajul poate avea maximum ${MESSAGE_MAX_LENGTH} de caractere.`),
});
