import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        // Find user from database
        const user = await User.findById(userId);

        // Check if user exists
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Generate JWT tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Save refresh token in database
        user.refreshToken = refreshToken;

        await user.save({
            validateBeforeSave: false,
        });

        // Return generated tokens
        return {
            accessToken,
            refreshToken,
        };
    } catch (error) {
    console.log(error);

    throw new ApiError(
        500,
        "Something went wrong while generating access and refresh tokens"
    );
}
};

const RegisterUser = asyncHandler(async (req, res) => {

    // ==========================================
    // Registration Flow
    // ==========================================
    // 1. Get user details from frontend
    // 2. Validate fields
    // 3. Check if user already exists
    // 4. Check avatar and cover image
    // 5. Upload images to Cloudinary
    // 6. Create user in database
    // 7. Remove sensitive fields
    // 8. Return response

    // Get user details from frontend
    const { fullName, username, email, password } = req.body;

    // Validation - check empty fields
    if (
        [fullName, username, email, password].some(
            (field) => !field?.trim()
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if username or email already exists
    const existedUser = await User.findOne({
        $or: [
            { username: username.toLowerCase() },
            { email }
        ]
    });

    if (existedUser) {
        throw new ApiError(
            409,
            "Username or email already exists"
        );
    }

    // Get avatar path
    const avatarLocalPath =
        req.files?.avatar?.[0]?.path;

    // Get cover image path (optional)
    let coverImageLocalPath;

    if (
        req.files &&
        Array.isArray(req.files.coverImage) &&
        req.files.coverImage.length > 0
    ) {
        coverImageLocalPath =
            req.files.coverImage[0].path;
    }

    // Avatar is mandatory
    if (!avatarLocalPath) {
        throw new ApiError(
            400,
            "Avatar image is required"
        );
    }

    console.log("Avatar Path:", avatarLocalPath);

    // Upload avatar to Cloudinary
    const avatar = await uploadOnCloudinary(
        avatarLocalPath
    );

    // Upload cover image if provided
    const coverImage = coverImageLocalPath
        ? await uploadOnCloudinary(
              coverImageLocalPath
          )
        : null;

    // Check avatar upload success
    if (!avatar) {
        throw new ApiError(
            400,
            "Failed to upload avatar image"
        );
    }

    // Create user in database
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    });

    // Remove password and refresh token
    const createdUser = await User.findById(
        user._id
    ).select("-password -refreshToken");

    // Verify user creation
    if (!createdUser) {
        throw new ApiError(
            500,
            "Something went wrong while registering user"
        );
    }

    // Send success response
    return res.status(201).json(
        new ApiResponse(
            201,
            createdUser,
            "User registered successfully"
        )
    );
});

const LoginUser = asyncHandler(async (req, res) => {

    // ==========================================
    // Login Flow
    // ==========================================
    // 1. Get credentials from request body
    // 2. Check username/email exists
    // 3. Find user in database
    // 4. Verify password
    // 5. Generate access & refresh tokens
    // 6. Save refresh token in DB
    // 7. Send cookies
    // 8. Return response

    // Get credentials
    const { username, email, password } =
        req.body;

    // Password is mandatory
    if (!password) {
        throw new ApiError(
            400,
            "Password is required"
        );
    }

    // At least username or email required
    if (!username && !email) {
        throw new ApiError(
            400,
            "Please enter username or email"
        );
    }

    // Find user
    const user = await User.findOne({
        $or: [
            { username },
            { email }
        ]
    });

    // User not found
    if (!user) {
        throw new ApiError(
            404,
            "User does not exist"
        );
    }

    // Verify password
    const isPasswordValid =
        await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(
            401,
            "Invalid credentials"
        );
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(
            user._id
        );

    // Remove sensitive fields
    const loggedInUser =
        await User.findById(user._id)
            .select("-password -refreshToken");

    // Cookie options
    const options = {
        httpOnly: true,
        secure:
            process.env.NODE_ENV === "production",
    };

    // Send cookies and response
    return res
        .status(200)
        .cookie(
            "accessToken",
            accessToken,
            options
        )
        .cookie(
            "refreshToken",
            refreshToken,
            options
        )
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User logged in successfully"
            )
        );
});

const LogOutUser = asyncHandler(async (req, res) => {

    // Remove refresh token from database
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "User logged out successfully"
            )
        );
});

const RefreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken =
        req.cookies?.refreshToken ||
        req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized access");
    }

    try {

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(
            decodedToken?._id
        );

        if (!user) {
            throw new ApiError(
                401,
                "Invalid refresh token"
            );
        }

        if (
            incomingRefreshToken !==
            user.refreshToken
        ) {
            throw new ApiError(
                401,
                "Refresh token is expired or used"
            );
        }

        const {
            accessToken,
            refreshToken: newRefreshToken
        } = await generateAccessAndRefreshTokens(
            user._id
        );

        const options = {
            httpOnly: true,
            secure: true
        };

        return res
            .status(200)
            .cookie(
                "accessToken",
                accessToken,
                options
            )
            .cookie(
                "refreshToken",
                newRefreshToken,
                options
            )
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken: newRefreshToken
                    },
                    "Access token refreshed"
                )
            );

    } catch (error) {
        throw new ApiError(
            401,
            error?.message ||
            "Invalid refresh token"
        );
    }
});

export {
    RegisterUser,
    LoginUser,
    LogOutUser,
    RefreshAccessToken
};