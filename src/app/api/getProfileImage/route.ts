import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { userNameValidationSchema } from "@/schemas/userNameValidationSchema";

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
  const body = await request.json();
  const username = body.username;  

  const result = userNameValidationSchema.safeParse({username: username});

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

  try {
    const user = await UserModel.findOne({
      username,
    });

    if (user) {
      return Response.json(
        {
          success: true,
          profileImageUrl: user.profileImageUrl,
        },
        { status: 200 }
      );
    }

    return Response.json(
      {
        success: false,
        message: "User not found.",
      },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error getting profile image url.", error);
    return Response.json(
      {
        success: false,
        message: "Error getting profile image url.",
      },
      { status: 500 }
    );
  }
}
