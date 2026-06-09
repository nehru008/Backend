import mongoose , {Schema} from "mongoose";

const TweetSchema = new Schema({
    video:{
        type:Schema.Types.ObjectId,
        ref:"Video",
    },
    tweetBy:{
        type: Schema.Types.ObjectId,
        ref:"User",
    },
    content:{
        type:String,
        required:true,
    }

},{timestamps:true})

export const Like = mongoose.model("Tweet","TweetSchema")