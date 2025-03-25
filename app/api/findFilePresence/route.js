import clientPromise from "@/lib/mongodb";
import { NextResponse } from 'next/server';
export async function POST(request) {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collections = db.collection(process.env.MONGODB_COLLECTION_FILE_INFO);
    // 
    const data = await request.json();
    // 
    const ifany = await collections.findOne({customUrl: data.CustomEmail});
    if (ifany) {
        return NextResponse.json({success: false, message: "Chosen url already exists!"});
    }
    return NextResponse.json({success: true, message: "Good choice!"});
}