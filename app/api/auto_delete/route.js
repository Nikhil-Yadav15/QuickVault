import { NextResponse } from 'next/server';
import cloudinary from "@/lib/cloudinary_setup";
import clientPromise from "@/lib/mongodb";

async function deleteOldFiles() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collections = db.collection(process.env.MONGODB_COLLECTION_FILE_INFO);

    const tendaysago = new Date();
    tendaysago.setDate(tendaysago.getDate() - 10);

    const oldRecords = await collections.find({ uploadedAt: { $lt: tendaysago } }).toArray();

    if (oldRecords.length === 0) {
      return { message: "No old files to delete." };
    }

    for (const record of oldRecords) {
      const allPublicIds = record.files.flatMap(file => file.public_ids);

      if (allPublicIds.length === 0) {
        continue;
      }

      const deletionPromises = allPublicIds.map(publicID => {

        return cloudinary.uploader.destroy(publicID, {
          resource_type: 'raw'
        })
          .then(() => console.log(`Deleted file from Cloudinary`))
          .catch(error => {
            console.error(`Error deleting file from Cloudinary: ${publicID}`, error);
            throw error;
          });
      });

      await Promise.all(deletionPromises);

      await collections.deleteOne({ _id: record._id });
    }

    return { message: "Old files deleted successfully!" };
  } catch (error) {
    console.error("Error in deleteOldFiles:", error);
    throw error;
  }
};

export async function GET(request) {
  console.log("ISNIDE API ROUTE: ", request.headers)
  const authHeader = request.headers.get('authorization');
  const secret = process.env.CRON_SECRET;

  if (!authHeader || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  };

  try {
    const result = await deleteOldFiles();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete files' }, { status: 500 });
  };
};
export const dynamic = 'force-dynamic';
