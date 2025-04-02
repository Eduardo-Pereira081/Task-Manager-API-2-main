import { z } from "zod";

export function UUIDSchema() {
  return z.object({
    id: z.string().uuid({ message: "Invalid UUID" }),
  });
}
