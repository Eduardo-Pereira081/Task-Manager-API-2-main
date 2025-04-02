import { z } from "zod";

export const userSchema = z
  .object({
    name: z.string().min(3).max(255, "max 255 characters"),
    email: z.string().email("email poorly formatted").max(255, "max 255 characters"),
    password: z
      .string()
      .min(7, "min 7 characters")
      .max(255, "max 255 characters")
      .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{7,}$/, {
        message:
          "the password must contain at least one capital letter, one number and one special character!",
      }),
  })
  .strict();

export type UserDataTypes = z.infer<typeof userSchema>;
