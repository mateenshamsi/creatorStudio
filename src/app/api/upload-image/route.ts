import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import { uploadImage } from "@/libs/upload-image";

interface CloudinaryUploadResult { 
  public_id: string; 
  secure_url: string; 
  folder?: string;
  [key: string]: any; 
}

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Error authenticating user" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    // Using the uploadImage utility function
  

    // If you want to use direct cloudinary upload instead of uploadImage utility:
 
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const res = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "CreatorStudio",
        },
        (err, result) => {
          if (err) {
            console.error("Error uploading to Cloudinary:", err);
            reject(err);
          } else {
            resolve(result as CloudinaryUploadResult);
          }
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      secure_url: res.secure_url,
      public_id: res.public_id,
      folder: res.folder,
    });
  

  } catch (err) {
    console.error("Error uploading image:", err);
    return NextResponse.json(
      { error: "An error occurred during the upload" }, 
      { status: 500 }
    );
  }
}