import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { userNameValidationSchema } from "@/schemas/userNameValidationSchema";

export async function POST(request: Request) {
  return Response.json(
    {
      success: false,
      message: "Invalid request method. Only GET requests are allowed.",
    },
    { status: 405 }
  );
}

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };

    const result = userNameValidationSchema.safeParse(queryParams); //zod validation

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

    const { username } = result.data;

    const user = await UserModel.findOne({
      username,
    });

    if (user) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 200 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is unique",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username uniqueness.", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username uniqueness",
      },
      { status: 500 }
    );
  }
}
