import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const RegisterUser = asyncHandler(async (req, res) => {

    // Get user details from frontend
    const { fullName, username, email, password } = req.body;

    // Validation
    if (
        [fullName, username, email, password].some(
            (field) => !field?.trim()
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if user already exists
    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existedUser) {
        throw new ApiError(
            409,
            "Username or email already exists"
        );
    }

    // Get uploaded file paths
    const avatarLocalPath =
        req.files?.avatar?.[0]?.path;

    // const coverImageLocalPath =
    //     req.files?.coverImage?.[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    // Avatar is mandatory
    if (!avatarLocalPath) {
        throw new ApiError(
            400,
            "Avatar image is required"
        );
    }
    console.log("Avatar Path:", avatarLocalPath);

    // Upload to Cloudinary
    const avatar = await uploadOnCloudinary(
        avatarLocalPath
    );

    const coverImage = coverImageLocalPath
        ? await uploadOnCloudinary(
              coverImageLocalPath
          )
        : null;

    if (!avatar) {
        throw new ApiError(
            400,
            "Failed to upload avatar image"
        );
    }

    // Create user
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    });

    // Remove sensitive fields
    const createdUser = await User.findById(
        user._id
    ).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(
            500,
            "Something went wrong while registering the user"
        );
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            createdUser,
            "User registered successfully"
        )
    );
});

export { RegisterUser };