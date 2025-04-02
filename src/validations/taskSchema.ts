import { z } from "zod";

export const taskSchema = z
  .object({
    title: z.string().min(3).max(255, "max 255 characters"),
    description: z.string().min(3).max(255, "max 255 characters"),
    date: z.string().datetime("date poorly formatted"),
    status: z.enum(["pending", "completed"]).optional(),
  })
  .strict();

export type TaskDataTypes = z.infer<typeof taskSchema>;
