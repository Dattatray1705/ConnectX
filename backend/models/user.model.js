//User Model to store user information

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required: true
    },

    username:{
        type:String,
        required: true,
        unique: true
    },

    email:{
        type:String,
        required: true,
        unique: true
    },

    password:{
        type:String,
        required: true
    },

    // ✅ ADD THESE
    resetOTP:{
        type:String,
        default:null
    },

    otpExpiry:{
        type:Date,
        default:null
    },

    profilePicture:{
        type: String,
        default: "default.jpg"
    },

    coverImage: {
        type: String,
        default: "",
    },

    createdAt:{
        type: Date,
        default: Date.now
    },

    updatedAt:{
        type: Date,
        default: Date.now
    },

    active:{
        type: Boolean,
        default:true
    },
    isOnline:{
    type:Boolean,
    default:false
},

lastSeen:{
    type:Date,
    default:null
}

});

const User = mongoose.model("User", userSchema);

export default User;