import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { verificationCodeSchema } from "@/schemas/verificationCodeSchema";

export async function GET(request: Request) {
  return Response.json(
    {
      success: false,
      message: "Invalid request method. Only POST requests are allowed.",
    },
    { status: 405 }
  );
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, verificationCode } = await request.json();

    const result = verificationCodeSchema.safeParse({
      username,
      verificationCode,
    });

    if (!result.success) {
      const responseErrorMessage: string[] = result.error.errors.map(
        (obj) => obj.message
      );
      const joinedresponseErrorMessage = responseErrorMessage.join("; ");

      return Response.json(
        {
          success: false,
          message: joinedresponseErrorMessage,
        },
        { status: 400 }
      );
    }

    const validatedUsername = result.data.username;
    const validatedVerificationCode = result.data.verificationCode;

    const user = await UserModel.findOne({
      username: validatedUsername,
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Invalid username",
        },
        { status: 400 }
      );
    }

    if(user.isVerified){
      return Response.json(
        {
          success: true,
          message: "User already verified.",
        },
        { status: 400 }
      );
    }

    const isVerificationCodeCorrect =
      user.verificationCode === validatedVerificationCode;
    const isVerificationCodeExpired = user.verificationCodeExpiry < new Date();

    if (isVerificationCodeCorrect && !isVerificationCodeExpired) {
      user.isVerified = true;

      await user.save();

      return Response.json(
        {
          success: true,
          message: "User verified successfully.",
        },
        { status: 200 }
      );
    }

    if (isVerificationCodeExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification code expired.",
        },
        { status: 400 }
      );
    }

    if (!isVerificationCodeCorrect) {
      return Response.json(
        {
          success: false,
          message: "Invalid verification code.",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying user", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user.",
      },
      { status: 500 }
    );
  }
}
