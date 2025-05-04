import env from "@/env";
import { v2 as Cloudinary } from "cloudinary";
import { Readable } from "stream";

Cloudinary.config({
  cloud_name: env.CLOUDINARY_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export default Cloudinary;

export const uploadToCloudinary = (
  fileBuffer: Buffer,
  fileName: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = Cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        public_id: fileName,
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result?.secure_url)
          return reject(new Error("file upload to cloudinary failed"));
        return resolve(result.secure_url);
      }
    );

    Readable.from(fileBuffer).pipe(stream);
  });
};
