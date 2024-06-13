import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "User not authenticated.",
      },
      { status: 400 }
    );
  }

  const userId: User = user._id;
  const { messageAcceptFlag } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: messageAcceptFlag },
      { new: true }
    );

    if (!updatedUser) {
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
          message: "Message acceptance toggled successfully.",
          isAcceptingMessage: updatedUser.isAcceptingMessage,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("Failed to toggle message acceptance: ", error);
    return Response.json(
      {
        success: false,
        message: "Failed to toggle message acceptance.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "User not authenticated.",
      },
      { status: 400 }
    );
  }

  try {
    const userId: User = user._id;
    const foundUser = await UserModel.findById(userId);

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
