import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

export async function uploadMedia(
  file: Buffer,
  options: {
    folder: string;
    resource_type: "image" | "video";
    filename?: string;
  },
) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: options.folder,
          resource_type: options.resource_type,
          filename_override: options.filename,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      )
      .end(file);
  });
}
