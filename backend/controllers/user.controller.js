import Profile from "../models/profile.model.js";
import ConnectionRequest from "../models/connection.model.js";
import Post from "../models/post.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import fs from "fs";
import Notification from "../models/notification.model.js";
import { convertUserDataTOPDF } from "../utils/convertUserDataTOPDF.js";
import nodemailer from "nodemailer";


export const register = async (req, res) => {
  try {

    const { name, email, password, username } = req.body ;

    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

const hashedPassword = await bcrypt.hash(password, 10);

const newUser = await User.create({
  email,
  password: hashedPassword,
  name,
  username
});


    // await newUser.save();
    

    const profile = new Profile({
      userId: newUser._id
    });

    await profile.save()

   return res.status(201).json({ message: "User created successfully" });

} catch (error) {
    return res.status(500).json({ message: error.message });
}
};



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    user.isOnline = true;
await user.save();

   const token = jwt.sign(
  {
    id: user._id
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d"
  }
);

res.cookie("token", token, {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000
});

return res.json({
  success: true,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    username: user.username
  }
});

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};




export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.resetOTP = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    const transporter =
      nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "ConnectX Password Reset OTP",
      html: `
        <h2>Password Reset</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>Valid for 5 minutes</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });
  }
};





export const uploadProfilePicture = async (req ,res)=>{


      try{
 const user = await User.findById(req.userId);// Find user by token
        if(!user){
          return res.status(404).json({message:"User not found"});

        }

        user.profilePicture = req.file.path;  // Update profile picture filename it gives from   upload.single("profile_picture").
        await user.save();
 
        return res.json({message:"Profile picture updated successfully"}); 

      }catch (error) {


  return res.status(400).json({
    message: error.message,
  });
}
};


export const uploadCoverImage = async (req, res) => {

  

  try {

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.coverImage = req.file.path;

    await user.save();

    return res.json({
      message: "Cover image updated successfully"
    });

  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }

};


export const updateUserProfile = async (req, res) => {
  try {

    const { ...newUserData } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const { username, email } = newUserData;

    const existingUser = await User.findOne({
      $or: [
        { username },
        { email }
      ]
    });

    if (existingUser) {

      if (
        String(existingUser._id) !==
        String(user._id)
      ) {
        return res.status(400).json({
          message: "User already exists"
        });
      }
    }

    Object.assign(user, newUserData);

    await user.save();

    return res.json({
      message: "Profile updated successfully"
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }
};


export const getUserAndProfile = async (req, res) => {
  try {

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const userProfile = await Profile.findOne({
      userId: user._id
    }).populate(
      "userId",
      "name email username profilePicture coverImage  isOnline lastSeen"
    );

    if (!userProfile) {
      return res.status(404).json({
        message: "Profile not found"
      });
    }

    return res.json(userProfile);

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};



export const updateProfileData = async (req, res) => {
  try {

    console.log("REQ BODY =", req.body);

    const newProfileData = req.body || {};

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const profile = await Profile.findOne({
      userId: user._id
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found"
      });
    }

    Object.assign(profile, newProfileData);

    await profile.save();

    console.log(
      "UPDATED PROFILE =",
      JSON.stringify(profile, null, 2)
    );

    return res.json({
      message: "Profile updated successfully"
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }
};


export const getAllUser = async (req, res) => {
  try {
    const profiles = await Profile.find()
      .populate("userId", "name username email profilePicture bio isOnline lastSeen");

    // ✅ FILTER profiles with missing userId
    const users = profiles
      .filter((p) => p.userId
    
    
    ) // 🔥 IMPORTANT
      .map((p) => ({
        _id: p.userId._id,
        name: p.userId.name,
        username: p.userId.username,
        email: p.userId.email,
        profilePicture: p.userId.profilePicture,
        bio: p.bio,
        isOnline: p.userId.isOnline,
  lastSeen: p.userId.lastSeen,
      }));
 

    return res.status(200).json(users);
  } catch (error) {
    console.error("getAllUser error:", error);
    return res.status(500).json({ message: error.message });
  }
};

 



export const downloadProfile = async (req, res) => {
  try {

    const user_id = req.query.id;

    const userProfile = await Profile.findOne({ userId: user_id })
      .populate("userId", "name email username profilePicture");

console.log(
  "PROFILE PIC IN PDF =",
  userProfile.userId.profilePicture
);

    if (!userProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

const pdfPath = await convertUserDataTOPDF(userProfile);

return res.download(
  pdfPath,
  `${userProfile.userId.name}-Resume.pdf`,
  (err) => {
    if (!err && fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
    }
  }
);

  } catch (error) {
    console.log("PDF ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};


export const sendConnectionRequest = async (req, res) => {

  const { connectionId } = req.body;

  try {
      if (String(req.userId) === String(connectionId)) {
      return res.status(400).json({
        success: false,
        message: "You cannot send connection request to yourself"
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found!"
      });
    }

    const connectionUser = await User.findById(
      connectionId
    );

    if (!connectionUser) {
      return res.status(404).json({
        message: "Connection user not found"
      });
    }

    const existingRequest =
      await ConnectionRequest.findOne({
        userId: user._id,
        connectionId: connectionUser._id,
      });

    if (existingRequest) {
      return res.status(400).json({
        message: "Request already sent"
      });
    }

    const connectionRequest =
      new ConnectionRequest({
        userId: user._id,
        connectionId: connectionUser._id,
      });

    await connectionRequest.save();

console.log("NOTIFICATION CREATE START");
    await Notification.create({
    sender:user._id,
    receiver:connectionUser._id,
    type:"connection_request",
    message:`${user.name} sent you a connection request`
});
console.log("NOTIFICATION CREATED");

    return res.json({
      message: "Request sent"
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }
};



export const getMyConnections = async (req, res) => {
 
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connections = await ConnectionRequest.find({
      status_accepted: true,
      $or: [
        { userId: user._id },
        { connectionId: user._id }
      ]
    })
      .populate(
        "userId",
        "name username email profilePicture"
      )
      .populate(
        "connectionId",
        "name username email profilePicture"
      );

    return res.json({ connections });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const whatAreMyConnections = async (req, res) => {
  try {

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const requests = await ConnectionRequest.find({
      $or: [
    { userId: user._id },
    { connectionId: user._id }
  ]
    })
      .populate(
        "userId",
        "name username email profilePicture"
      )
      .populate(
        "connectionId",
        "name username email profilePicture"
      );

    return res.json({ requests });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};


export const acceptConnectionRequest = async (req, res) => {

  const { requestId, action_type } = req.body;

  try {

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const connection = await ConnectionRequest.findById(
      requestId
    );

    if (!connection) {
      return res.status(404).json({
        message: "Request not found"
      });
    }
if (String(connection.connectionId) !== String(req.userId)) {
  return res.status(403).json({
    message: "Only receiver can accept request"
  });
}
    connection.status_accepted =
      action_type === "accept";

    await connection.save();

    if(action_type === "accept")
{
    await Notification.create({
        sender:user._id,
        receiver:connection.userId,
        type:"connection_accept",
        message:`${user.name} accepted your connection request`
    });
}

    return res.json({
      message: "Request updated"
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }
};


export const getUserProfileAndUserBasedOnUsername = async (req ,res) =>
{
 const {username} = req.query;
 try{
  const user = await User.findOne({username});
  if(!user){
    return res.status(404).json({message:"user not found"})
  }
  const userProfile = await Profile.findOne({userId:user._id})
  .populate('userId','name username email profilePicture coverImage isOnline lastSeen');



  return res.json({"profile":userProfile})
}catch(error){

  return res.status(500).json({message:"get somthing wet wrong"})
}
}


export const deleteAccount = async (req, res) => {
  try {

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Delete profile
    await Profile.deleteOne({
      userId: user._id
    });

    // Delete connections
    await ConnectionRequest.deleteMany({
      $or: [
        { userId: user._id },
        { connectionId: user._id }
      ]
    });

    // Delete posts
    await Post.deleteMany({
      userId: user._id
    });

    // Delete user
    await User.findByIdAndDelete(user._id);

    // Clear JWT Cookie
    res.clearCookie("token");

    return res.json({
      message: "Account deleted successfully"
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }
};


export const logout = async (
  req,
  res
) => {

  try {

    const user = await User.findById(
      req.userId
    );

    if (user) {

      user.isOnline = false;

      user.lastSeen =
        new Date();

      await user.save();
    }

    res.clearCookie("token");

    return res.json({
      success: true,
      message: "Logout successful"
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }
};



export const getNotifications = async(req,res)=>{
    try{

        const notifications =
        await Notification.find({
            receiver:req.userId
        })
        .populate(
            "sender",
            "name username profilePicture"
        )
        .sort({createdAt:-1});

        return res.json(notifications);

    }catch(error){

        return res.status(500).json({
            message:error.message
        });

    }
}

export const resetPassword = async (req, res) => {
  try {

    const {
      email,
      otp,
      password
    } = req.body;

    const user =
      await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.resetOTP !== otp) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        message: "OTP Expired"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    user.resetOTP = null;
    user.otpExpiry = null;

    await user.save();

    return res.json({
      success: true,
      message: "Password reset successful"
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }
};

export const deleteNotification =
async (req,res)=>{
  try{

    const { notificationId } = req.body;

    await Notification.findByIdAndDelete(
      notificationId
    );

    return res.json({
      success:true,
      message:"Notification removed"
    });

  }catch(error){

    return res.status(500).json({
      message:error.message
    });

  }
}