import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { userNameValidationSchema } from "@/schemas/userNameValidationSchema";
import fetch from "node-fetch";

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
      const profileImageUrl = user.profileImageUrl;

      // Fetching the image data from the profileImageUrl
      const imageResponse = await fetch(profileImageUrl);
      if (!imageResponse.ok) {
        throw new Error('Failed to fetch image');
      }

      // Converting the node-fetch response to a native Response
      const imageBuffer = await imageResponse.arrayBuffer();
      const base64Image = Buffer.from(imageBuffer).toString('base64');
      const mimeType = imageResponse.headers.get('content-type') || '';

      return new Response(
        JSON.stringify({
          success: true,
          profileImageUrl: profileImageUrl,
          profileImageData: `data:${mimeType};base64,${base64Image}`,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
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
