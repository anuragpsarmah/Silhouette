import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { messageSchema } from "@/schemas/messageSchema";
import { Message } from "@/model/Message";

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

  const { username, content, imageUrl = "" } = await request.json();
  const createdAt = new Date();

  if (imageUrl) {
    const result = messageSchema.safeParse({ username, content, imageUrl, createdAt });
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
  } else {
    const result = messageSchema.safeParse({ username, content, createdAt });
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
  }

  try {
    const user = await UserModel.findOne({
      username
    });
  
    if(!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
  
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User can't handle criticism. Try later.",
        },
        { status: 403 }
      );
    } else {
      const newMessage = { content, imageUrl, createdAt };
      user.messages.push(newMessage as Message);
      await user.save();
  
      return Response.json(
        {
          success: true,
          message: "Message sent successfully",
        },
        { status: 200 }
      );
    }
  } catch(error) {
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }  
}
