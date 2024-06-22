import { resend } from "@/lib/resend";
import VerificationEmail from "@/emails/verificationEmail";
import { apiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verificationCode: string
): Promise<apiResponse> {
  try {
    await resend.emails.send({
      from: "anurag@onclique.tech",
      to: email,
      subject: "Verification Code | Silhouette",
      react: VerificationEmail({
        username,
        verificationCode,
      }),
    });

    return { success: true, message: "Verification email sent successfully" };
  } catch (error) {
    console.error("Error sending verification email", error);
    return { success: false, message: "Failed to send verification email" };
  }
}
