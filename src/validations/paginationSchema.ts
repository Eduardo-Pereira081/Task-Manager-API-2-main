import { z } from "zod";

export const paginationSchema = z
  .object({
    limit: z
      .string()
      .max(255, "max 255 characters")
      .regex(/^\d+$/, "limit must be a number")
      .optional(),

    offset: z
      .string()
      .max(255, "max 255 characters")
      .regex(/^\d+$/, "offset must be a number")
      .optional(),

    filter: z.enum(["completed", "pending", "late", "all"]).optional(),
  })
  .strict();

export type PaginationDataTypes = z.infer<typeof paginationSchema>;
