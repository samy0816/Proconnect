import { createSlice } from "@reduxjs/toolkit";
import { getallPosts, createPost, deletePost, incrementPostLike, getAllComments, postComment } from "../../../postAction";
const initialState = {
posts: [],
    isError: false,
    postFetched: false,
    isLoading: false,
    LoggedIn: false,
    message: "",
    comments: [],
    postId: "",
};

const postSlice=createSlice({
    name:"post",
    initialState,
    reducers:{
        reset:(state)=>{
            state.postId = "";
            state.comments = [];
        },
        resetPostId:(state)=>{
            state.postId = "";
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(getallPosts.pending,(state)=>{
            state.isLoading = true;
            state.message = "Fetching posts...";
        })
        .addCase(getallPosts.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.posts = action.payload;
            state.postFetched = true;
            state.message = "Posts fetched successfully.";
        })
        .addCase(getallPosts.rejected,(state,action)=>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        // Create Post
        .addCase(createPost.pending,(state)=>{
            state.isLoading = true;
            state.message = "Creating post...";
        })
        .addCase(createPost.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.message = "Post created successfully!";
        })
        .addCase(createPost.rejected,(state,action)=>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        // Delete Post
        .addCase(deletePost.pending,(state)=>{
            state.isLoading = true;
        })
        .addCase(deletePost.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.message = "Post deleted successfully.";
        })
        .addCase(deletePost.rejected,(state,action)=>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        // Increment Like
        .addCase(incrementPostLike.fulfilled,(state)=>{
            state.message = "Post liked!";
        })
        // Get Comments
        .addCase(getAllComments.pending,(state)=>{
            state.isLoading = true;
        })
        .addCase(getAllComments.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.comments = action.payload.comments;
            state.postId = action.payload.post_id;
        })
        .addCase(getAllComments.rejected,(state,action)=>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        // Post Comment
        .addCase(postComment.pending,(state)=>{
            state.isLoading = true;
        })
        .addCase(postComment.fulfilled,(state)=>{
            state.isLoading = false;
            state.message = "Comment posted!";
        })
        .addCase(postComment.rejected,(state,action)=>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
    }
});

export const { reset, resetPostId } = postSlice.actions;
export default postSlice.reducer;