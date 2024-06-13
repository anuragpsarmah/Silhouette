import { z } from "zod";

export const verificationCodeSchema = z.object({
  username: z
    .string()
    .min(3, "username must be atleast 2 characters long")
    .max(15, "username cannot be more than 15 characters long")
    .regex(/^[a-zA-Z0-9_-]+$/, "username must not contain special characters"), 
  verificationCode: z
    .string()
    .length(6, { message: "verification code must be of 6 characters" })
});
