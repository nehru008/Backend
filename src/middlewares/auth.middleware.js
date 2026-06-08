import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const VerifyJWT = asyncHandler(async (req, res, next) => {

    // ==========================================
    // JWT Verification Flow
    // ==========================================
    // 1. Get token from cookies or headers
    // 2. Check if token exists
    // 3. Verify token using secret key
    // 4. Extract user id from token payload
    // 5. Find user in database
    // 6. Attach user to request object
    // 7. Pass control to next middleware

    try {

        // Get token from cookie or Authorization header
        const accessToken =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace(
                "Bearer ",
                ""
            );

        // Check if token exists
        if (!accessToken) {
            throw new ApiError(
                401,
                "Unauthorized access"
            );
        }

        // Verify JWT token
        const decodedToken = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );

        // Find user using id stored in token
        const user = await User.findById(
            decodedToken?._id
        ).select("-password -refreshToken");

        // User not found
        if (!user) {
            throw new ApiError(
                401,
                "Invalid access token"
            );
        }

        // Attach user object to request
        req.user = user;

        // Move to next middleware/controller
        next();

    } catch (error) {

        throw new ApiError(
            401,
            error?.message || "Invalid access token"
        );
    }
});

export default VerifyJWT;