import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

/* ================= GET ALL POSTS ================= */
export const getAllPosts = createAsyncThunk(
  "post/getAllPosts",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/api/posts/posts");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch posts"
      );
    }
  }
);

/* ================= CREATE POST ================= */
export const createPost = createAsyncThunk(
  "post/createPost",
  async ({ file, body }, thunkAPI) => {
    try {


      const formData = new FormData();
      formData.append("body", body);
      if (file) formData.append("media", file);

      const response = await clientServer.post(
        "/api/posts/create_post",
        formData
        
      );

      return response.data;

    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Error creating post"
      );
    }
  }
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (post_id, thunkAPI) => {
try{
  const responce = await clientServer.delete("/api/posts/delete_post", {
    data: { 
      
        post_id: post_id
     }
  })
  return thunkAPI.fulfillWithValue(responce.data)
}catch(err){
  return thunkAPI.rejectWithValue(
    err.response?.data?.message || "Error deleting post"
  );  

     }
  });
export const incrementPostLike = createAsyncThunk(
  "post/incrementLike",
  async (post, thunkAPI) => {
try{
  const responce = await clientServer.post("/api/posts/increment_post_like", {
post_id: post.post_id,
  })
  return thunkAPI.fulfillWithValue(responce.data)
}catch(err){
  return thunkAPI.rejectWithValue(
    err.response?.data?.message || "Error incrementing like"
  );
}
});

export const getAllComments = createAsyncThunk(
  "post/getAllComments",
  async (postData, thunkAPI) => {
    try {
      const response = await clientServer.get("/api/posts/get_comment_by_post", {
        params: {
          post_id: postData.post_id
        }
      });

      return {
        comments: response.data,
        post_id: postData.post_id
      };

    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch comments"
      );
    }
  }
);

export const postComment = createAsyncThunk(
  "post/postComment",
  async (commentData, thunkAPI) =>{
 try{
   const response = await clientServer.post("/api/posts/user/comment_post",{
     post_id : commentData.post_id,
     commentBody: commentData.comment
   });

   return response.data;

 }catch(error){
  return thunkAPI.rejectWithValue("Something went wrong!")
 }
}
)
