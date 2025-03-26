import { headers } from 'next/headers';
import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] || headersList.get('x-real-ip') || 'Unknown';
  const userAgent = headersList.get('user-agent') || 'Unknown';
  const referer = headersList.get('referer') || 'Direct';
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const collections = db.collection(process.env.MONGODB_COLLECTION_VISITS);

  const timestamp = new Date();
  const istOffset = 5.5 * 60;
  const istTimestamp = new Date(timestamp.getTime() + istOffset * 60 * 1000);

  await collections.insertOne({
    ip,
    userAgent,
    referer,
    page: '/',
    timestamp: istTimestamp,
  });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
