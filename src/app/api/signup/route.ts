import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

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
  if (request.method !== "POST") {
    return Response.json(
      {
        success: false,
        message: "Invalid request method. Only POST requests are allowed.",
      },
      { status: 405 }
    );
  }

  await dbConnect();

  try {
    const { username, email, profileImageUrl, password } = await request.json();

    const verifyUsername = await UserModel.findOne({
      username
    });

    if (verifyUsername) {
      return Response.json(
        {
          success: false,
          message: 'Username is already taken',
        },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ email });

    if (user) {
      if (user.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists. Please login.",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date();
        const sixDigitCode = Math.floor(
          100000 + Math.random() * 900000
        ).toString();
        expiryDate.setHours(expiryDate.getHours() + 1);

        user.password = hashedPassword;
        user.profileImageUrl = profileImageUrl;
        user.verificationCode = sixDigitCode;
        user.verificationCodeExpiry = expiryDate;

        await user.save();

        //verification email
        const emailResponse = await sendVerificationEmail(
          email,
          username,
          sixDigitCode
        );

        if (!emailResponse.success) {
          return Response.json(
            {
              success: false,
              message:
                "User data stored but not verified. Failed to send email.",
            },
            { status: 206 }
          );
        }
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      const sixDigitCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        profileImageUrl,
        password: hashedPassword,
        verificationCode: sixDigitCode,
        verificationCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();

      //verification email
      const emailResponse = await sendVerificationEmail(
        email,
        username,
        sixDigitCode
      );

      if (!emailResponse.success) {
        return Response.json(
          {
            success: false,
            message: "User data stored but not verified. Failed to send email.",
          },
          { status: 206 }
        );
      }
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Pending verification.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error registering user", error);

    return Response.json(
      {
        success: false,
        message: "Error registering user.",
      },
      { status: 500 }
    );
  }
}
