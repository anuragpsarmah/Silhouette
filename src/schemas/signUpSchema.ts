import { z } from "zod";

export const signUpSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be atleast 2 characters long.")
    .max(15, "Username cannot be more than 15 characters long.")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username must not contain special characters."),
  email: z.string().email({ message: "Invalid email address." }),
  profileImageUrl: z.string().url(),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Enter a strong passowrd."
    ),
});
