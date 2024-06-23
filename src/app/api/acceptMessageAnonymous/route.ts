import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

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
  const { username } = await request.json();

  try {
    const foundUser = await UserModel.findOne({username});

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    } else {      
      return Response.json(
        {
          success: true,
          message: foundUser.isAcceptingMessage
            ? "User is accepting messages."
            : "User is not accepting messages.",
          isAcceptingMessage: foundUser.isAcceptingMessage,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("Failed to get message accetance status: ", error);
    return Response.json(
      {
        success: false,
        message: "Failed to get message accetance status.",
      },
      { status: 500 }
    );
  }
}