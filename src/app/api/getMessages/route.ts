import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
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
    const userMessages = await UserModel.aggregate([
        { $match: { _id: userId } },
        { $unwind: '$messages' },
        { $sort: { 'messages.createdAt': -1 } },
        { $group: { _id: '$_id', messages: { $push: '$messages' } } },
      ]).exec();   
            
      if(!userMessages || userMessages.length === 0){
        return Response.json(
          {
            success: false,
            message: !userMessages ? "User not found." : "No messages found.",
          },
          { status: 404 }
        );
      }

      return Response.json(
        {
          success: true,
          message: `Found ${userMessages[0].messages.length} messages.`,
          messages: userMessages[0].messages,
        },
        { status: 200 }
      );
  } catch (error) {
    console.log("Failed to get messages: ", error);
    return Response.json(
      {
        success: false,
        message: "Failed to get messages",
      },
      { status: 500 }
    );
  }
}
