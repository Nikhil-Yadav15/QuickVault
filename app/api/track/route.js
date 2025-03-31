import { headers } from 'next/headers';
import clientPromise from "@/lib/mongodb";
import { geoIpLookup } from '@/lib/geoip';
import { deviceDetector } from '@/lib/device';
import { getISP } from '@/lib/isp';

export async function POST(request) {
  try {
    const headersList = await headers();
    const url = new URL(request.url);
    const timestamp = new Date();
  const istOffset = 5.5 * 60;
  const istTimestamp = new Date(timestamp.getTime() + istOffset * 60 * 1000);
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] || headersList.get('x-real-ip') || 'Unknown';
    
    console.log("this is the ip going: ", ip);
    const geoData = await geoIpLookup(ip);
    const isp = await getISP(ip);
    const deviceData = deviceDetector(headersList.get('user-agent') || '');

    const visitData = {
      ip,
      isp,
      ...geoData,
      ...deviceData,
      referer: headersList.get('referer') || 'Direct',
      referrerDomain: headersList.get('referer') 
        ? new URL(headersList.get('referer')).hostname 
        : 'Direct',
      page: url.pathname,
      queryParams: Object.fromEntries(url.searchParams),
      timestamp: istTimestamp,
    };
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    await db.collection(process.env.MONGODB_COLLECTION_VISITS).insertOne(visitData);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('user info error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
