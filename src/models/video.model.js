import mongoose, {Schema} from "mongoose";


const userSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        videoFile: {
            type: String, // cloudinary url
            required: true,
        },
        thumbnail: {
            type: String, // cloudinary url
            required: true,
        },
        duration: {
            type: Number, // cloudinary url
        },
        views:{
            type:Number,
            default:0,
        },
        owner: {
            type: Schema.Types.ObjectId,
            reef:"User",
        },
        isPublished: {
            type: Boolean,
        }

    },
    {
        timestamps: true
    }
)



export const User = mongoose.model("User",userSchema)