import { createSlice } from "@reduxjs/toolkit";
import { getAllPosts,createPost ,getAllComments} from "../../action/postAction"; // ✅ import thunk

const initialState = {
  posts: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  comments: [],
  postId: null,
  postFetched: false,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    reset: () => initialState,

    resetPostId: (state) => {
      state.postId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET ALL POSTS
      .addCase(getAllPosts.pending, (state) => {
        state.isLoading = true;
        state.message = "Fetching all posts...";
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.postFetched = true;
        state.posts = action.payload; // ✅ direct payload
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
})


.addCase(createPost.fulfilled, (state, action) => {
  console.log("CREATE POST PAYLOAD =", action.payload);
  state.isLoading = false;


  state.posts = [action.payload, ...state.posts];
   console.log("AFTER ADD =", state.posts.length);
}) // add new post on top

.addCase(createPost.rejected, (state, action) => {
  state.isLoading = false;
  state.isError = true;
  state.message = action.payload;
})
.addCase(getAllComments.fulfilled, (state, action) => {
  state.comments = action.payload.comments;
  state.postId = action.payload.post_id;
  console.log(state.comments)
})

      
  },
});

export const { reset, resetPostId } = postSlice.actions;
export default postSlice.reducer;
