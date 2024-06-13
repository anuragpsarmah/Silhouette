import { z } from "zod";

export const verificationCodeSchema = z.object({
  verificationCode: z
    .string()
    .length(6, { message: "verification code must be of 6 characters" }),
  verificationCodeExpiry: z.date()
});
