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
        console.log("Uploading:", localfilePath);

        if (!localfilePath) return null;

        const uploadResult = await cloudinary.uploader.upload(
            localfilePath,
            {
                resource_type: "auto",
            }
        );
        console.log("Upload Success:", uploadResult);
        fs.unlinkSync(localfilePath)

        return uploadResult;
    } catch (error) {
        fs.unlinkSync(localfilePath)
        console.log("Cloudinary Error:", error);
        return null;
    }
};
export { uploadOnCloudinary };