import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";


const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
        fullName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        avatar: {
            type: String, // cloudinary url
            required: true,
        },
        coverImage: {
            type: String, // cloudinary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function () {

    // Run password hashing only when password is modified.
    // This prevents hashing the already-hashed password
    // every time the user document is updated.
    if (!this.isModified("password")) {
        return ;
    }

    // Convert plain text password into a secure hashed password.
    // 10 = salt rounds (cost factor).
    this.password = await bcrypt.hash(this.password, 10);

    // Tell Mongoose that middleware work is complete
    // and continue with the save operation.
    
});

// Compare entered password with hashed password stored in DB
userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
}

// Generate short-lived token used to access protected routes
userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET, // secret key for access token
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY // e.g. 1d, 15m
        }
    )
}

// Generate long-lived token used to get new access tokens
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id // only user id is enough
        },
        process.env.REFRESH_TOKEN_SECRET, // separate secret for refresh token
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY // e.g. 10d, 30d
        }
    )
}


export const User = mongoose.model("User",userSchema)