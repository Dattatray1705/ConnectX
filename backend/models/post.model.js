//Post Model to store post information.

import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
        },
  body:{
    type:String,
    default:""
  },
  
likes: {
  type: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  default: [],
},
    createdAt:{
        type: Date,
        default: Date.now
        },
    updatedAt:{
        type:Date, 
        default: Date.now

        },
    media:{
        type: String
        },
    active:{
        type: Boolean, 
        default:true
        },
    fileType:{
        type: String
        },
});
const Post = mongoose.model("Post", postSchema);
    export default Post;