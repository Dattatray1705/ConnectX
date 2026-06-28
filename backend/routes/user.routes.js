import { Router } from "express";   
import { 
  login, 
  register, 
   sendOTP,
  uploadProfilePicture, 
  uploadCoverImage,
  updateUserProfile,
  getUserAndProfile,
  updateProfileData,
  getAllUser,
   downloadProfile,
   sendConnectionRequest,
   whatAreMyConnections,
   acceptConnectionRequest,
   getMyConnections ,
   getUserProfileAndUserBasedOnUsername,
    deleteAccount,
    logout,
    getNotifications,
    resetPassword,
    deleteNotification,
 
  
} from "../controllers/user.controller.js";

import auth from "../middleware/auth.js";
import upload from "../middleware/cloudinaryUpload.js";
const router = Router();

// Multer configuration for file uploads



router.post("/register", register);
router.post("/login", login);
router.post("/send-otp", sendOTP);
router.post("/logout",auth,logout);
router.post("/reset-password",resetPassword);
router.post("/user_update", auth ,updateUserProfile);
router.get("/get_user_and_profile",auth, getUserAndProfile);// New route for getting user and profile information
router.post("/update_cover_image",auth,upload.single("cover_image"),uploadCoverImage);
router.post("/update_profile_data",auth, updateProfileData);
router.post( "/update_profile_picture",auth,upload.single("profile_picture"),  uploadProfilePicture );
router.get ("/get_all_user",getAllUser);
router.get("/user/download_profile",downloadProfile);
router.post("/user/send_connection_request",auth, sendConnectionRequest);
router.get("/user/getConnectionRequest", auth,whatAreMyConnections);
router.get("/user/getMyConnections",auth, getMyConnections);
router.post("/user/acceptConnection_Request",auth, acceptConnectionRequest);
router.get("/get_User_Profile_And_User_Based_On_Username",getUserProfileAndUserBasedOnUsername)
router.post("/delete_account",auth, deleteAccount);
router.get(
   "/notifications",
   auth,
   getNotifications
);
router.post(
  "/notifications/delete",
  auth,
  deleteNotification
);
export default router;
