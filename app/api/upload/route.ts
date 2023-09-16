import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import getCurrentUser from "@/actions/getCurrentUser";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id || !currentUser?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const { path } = await request.json();
  if (!path) {
    return NextResponse.json(
      { message: "Image path is required." },
      { status: 400 }
    );
  }
  try {
    const options = {
      use_filename: true,
      unique_filename: true,
      overwrite: true,
      //   transformation: [{ width: 1000, height: 752, crop: "scale" }],
      folder: "messenger-clone",
    };

    const result = await cloudinary.uploader.upload(path, options);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
