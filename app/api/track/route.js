import clientPromise from "@/lib/mongodb";
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const ip = request.headers.get('x-forwarded-for') || request.ip || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const timestamp = new Date();

    const visitData = {
      ip,         
      userAgent,
      timestamp,  
    };

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const collection = db.collection(process.env.MONGODB_COLLECTION_VISITS);
        await collection.insertOne(visitData);
        return NextResponse.json({ message: 'Visited' }, { status: 200 });
    }catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'visited' }, { status: 200 });
      }
}