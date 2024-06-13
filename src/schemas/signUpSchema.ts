import { z } from "zod";

export const signUpSchema = z.object({
  username: z
    .string()
    .min(3, "username must be atleast 2 characters long")
    .max(15, "username cannot be more than 15 characters long")
    .regex(/^[a-zA-Z0-9_-]+$/, "username must not contain special characters"),
  email: z.string().email({ message: "Invalid email address" }),
  profileImageUrl: z.string().url(),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "password must be atleast 8 characters long and must contain atleast one uppercase letter, one lowercase letter, one number and one special character"
    ),
});
