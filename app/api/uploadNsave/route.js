import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { customUrl, files } = await request.json();

    if (!customUrl || !files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid input" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collections = db.collection(process.env.MONGODB_COLLECTION_FILE_INFO);

    await collections.insertOne({
      customUrl,
      files,
      uploadedAt: new Date(),
    });

    return NextResponse.json({ success: true, message: "Files Added!" });
  } catch (error) {
    console.error("Error saving metadata:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}