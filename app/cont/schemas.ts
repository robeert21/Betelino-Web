import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(2, "Introdu prenumele."),
    lastName: z.string().trim().min(2, "Introdu numele."),
    email: z.string().trim().toLowerCase().email("Adresă de email invalidă."),
    password: z.string().min(6, "Parola trebuie să aibă minimum 6 caractere."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Parolele nu coincid.",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Introdu emailul sau numele de utilizator."),
  password: z.string().min(1, "Introdu parola."),
});

export const requestResetSchema = z.object({
  email: z.string().trim().toLowerCase().email("Adresă de email invalidă."),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(6, "Parola trebuie să aibă minimum 6 caractere."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Parolele nu coincid.",
    path: ["confirmPassword"],
  });
