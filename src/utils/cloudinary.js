import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary using .env variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload local file to Cloudinary
const uploadOnCloudinary = async (localfilePath) => {
    try {

        // If no file path is provided, return null
        if (!localfilePath) return null;

        // Upload file to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(
            localfilePath,
            {
                resource_type: "auto" // auto-detect image/video/etc.
            }
        );

        // Upload successful
        console.log("File uploaded successfully:", uploadResult.url);

        return uploadResult;

    } catch (error) {

        // Remove temporary local file if upload fails
        if (localfilePath) {
            fs.unlinkSync(localfilePath);
        }

        return null;
    }
};

export { uploadOnCloudinary };