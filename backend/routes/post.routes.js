import { Router } from "express";
import { activeCheak ,createPost, getAllPosts,deletePost,get_comment_by_post ,delete_comment_of_user,increment_like,commentPost,} from "../controllers/post.controller.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/cloudinaryUpload.js";
const router = Router();


router.route("/").get(activeCheak);
router.post("/post", auth,upload.single('media'),createPost);
router.get("/posts", getAllPosts);
router.post("/create_post",auth, upload.single("media"), createPost);
router.delete("/delete_post",auth,deletePost);
router.post("/user/comment_post",auth, commentPost);
router.get("/get_comment_by_post", get_comment_by_post);
router.delete("/delete_comment_of_user",auth, delete_comment_of_user);
router.post("/increment_post_like",auth,increment_like)
export default router;