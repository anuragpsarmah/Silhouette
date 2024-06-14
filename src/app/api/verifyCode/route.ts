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
    const { identifier, verificationCode } = await request.json();
    const updatedIdentifier = identifier.replace("%40", "@");  

    const user = await UserModel.findOne({
      $or: [
        { email: updatedIdentifier },
        { username: updatedIdentifier },
      ],
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Invalid username or email.",
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
      user.verificationCode === verificationCode;
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
    console.error("Error verifying user.", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user.",
      },
      { status: 500 }
    );
  }
}
