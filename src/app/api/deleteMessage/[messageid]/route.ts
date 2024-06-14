import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

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
  return Response.json(
    {
      success: false,
      message: "Invalid request method. Only POST requests are allowed.",
    },
    { status: 405 }
  );
}

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  const messageId = new mongoose.Types.ObjectId(params.messageid);
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "User not authenticated.",
      },
      { status: 400 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const updatedResult = await UserModel.updateOne(
      { _id: userId },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updatedResult.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found.",
        },
        { status: 404 }
      );
    } else {
      return Response.json(
        {
          success: true,
          message: "Message deleted successfully.",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Failed to delete message.",
      },
      { status: 500 }
    );
  }
}
