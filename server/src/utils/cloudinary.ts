import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (filePath: string) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'motoshop/news',
      use_filename: true,
      unique_filename: true,
    });

    // Clean up the local file
    await unlinkAsync(filePath);

    return result;
  } catch (error) {
    // Clean up the local file even if upload fails
    await unlinkAsync(filePath).catch(console.error);
    throw error;
  }
};

export default cloudinary;
