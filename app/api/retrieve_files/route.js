import clientPromise from "@/lib/mongodb";
import { NextResponse } from 'next/server';
export async function POST(request) {
  
  const data = await request.json();
  const customUrl = data.CustomUrl;
  if (!customUrl) {
    return NextResponse.json({ success: false, message: "Missing customUrl" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const collections = db.collection(process.env.MONGODB_COLLECTION_FILE_INFO);
  const fileData = await collections.findOne({ customUrl });

  if (!fileData) {
    return NextResponse.json({ success: false, message: "No files found" }, { status: 404 });
  } else {
    if (fileData.password) {
      return NextResponse.json({ success: true, files: fileData.files, password: fileData.password });
    } else {
      return NextResponse.json({ success: true, files: fileData.files, password: null });
    }
  }
  
};
