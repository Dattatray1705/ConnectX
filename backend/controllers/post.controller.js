import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comments.model.js";

/* ================= ACTIVE CHECK ================= */
export const activeCheak = (req, res) => {
  return res.status(200).json({ message: "route is active" });
};

/* ================= CREATE POST ================= */
export const createPost = async (req, res) => {
  try {
  

     if (!req.body.body && !req.file) {
      return res.status(400).json({
        message: "Post must contain text or media",
      });
    }
    // ✅ TOKEN FROM HEADER
   const user = await User.findById(req.userId);

if (!user) {
  return res.status(404).json({
    message: "User not found"
  });
}

const post = new Post({
  userId: user._id,
  body: req.body.body,
  media: req.file ? req.file.path : "",
  fileType: req.file ? req.file.mimetype : "",
});

    await post.save();
    
    const newPost = await Post.findById(post._id)
.populate(
  "userId",
  "name username email profilePicture"
)

   return res.status(201).json(newPost);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL POSTS ================= */
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "name username email profilePicture")
      .sort({ createdAt: -1 });
       const postsWithCommentsCount = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await Comment.countDocuments({
          postId: post._id,
        });

        return {
          ...post._doc,
          commentsCount,
        };
      })
    );
 return res.status(200).json(postsWithCommentsCount);
// ✅ array directly
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ================= DELETE POST ================= */
export const deletePost = async (req, res) => {
  try {
    const { post_id } = req.body;

const user = await User.findById(req.userId).select("_id");    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Post.deleteOne({ _id: post_id });
    return res.status(200).json({ message: "Post deleted" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ================= GET COMMENTS BY POST ================= */
export const get_comment_by_post = async (req, res) => {
  try {
    const { post_id } = req.query;

    const comments = await Comment.find({ postId: post_id })
      .populate("userId", "name username ");

    return res.status(200).json(comments);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ================= DELETE COMMENT ================= */
export const delete_comment_of_user = async (req, res) => {
  try {
    const {comment_id } = req.body;

    const user = await User.findById(req.userId).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const comment = await Comment.findById(comment_id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Comment.deleteOne({ _id: comment_id });
    return res.status(200).json({ message: "Comment deleted" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ================= LIKE POST ================= */
export const increment_like = async (req, res) => {
  try {

    const { post_id } = req.body;

    const userId = req.userId;

    const post = await Post.findById(post_id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    // Check if this user already liked the post
   const alreadyLiked = post.likes.some(
    (id) => id.toString() === userId
);

if (alreadyLiked) {
    return res.status(400).json({
        message: "You already liked this post"
    });
}

    // Add the user's ID
    post.likes.push(userId);

    await post.save();

    return res.status(200).json({
      message: "Post liked successfully",
      totalLikes: post.likes.length
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }
};

/* ================= COMMENT ON POST ================= */
export const commentPost = async (req, res) => {
  try {
    const {post_id, commentBody } = req.body;

const user = await User.findById(req.userId).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = new Comment({
      userId: user._id,
      postId: post._id,
      body: commentBody,
    });

    await comment.save();
    return res.status(200).json({ message: "Comment added" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
