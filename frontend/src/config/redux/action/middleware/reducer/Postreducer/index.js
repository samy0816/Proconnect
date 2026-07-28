import { createSlice } from "@reduxjs/toolkit";
import { getallPosts, createPost, deletePost, incrementPostLike, getAllComments, postComment } from "../../../postAction";
import { DEMO_POSTS, DEMO_COMMENTS } from "@/config/demoData";
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
        },
        // 📌 Load demo posts — no server needed
        loadDemoPosts: (state) => {
            state.posts = DEMO_POSTS;
            state.postFetched = true;
            state.isLoading = false;
            state.isError = false;
            state.message = "Demo posts loaded";
        },
        // 📌 Load demo comments for a specific post
        loadDemoComments: (state, action) => {
            const postId = action.payload;
            state.postId = postId;
            state.comments = DEMO_COMMENTS[postId] || [];
        },
        // 📌 Like a post in demo mode
        likeDemoPost: (state, action) => {
            const postId = action.payload;
            const post = state.posts.find(p => p._id === postId);
            if (post) {
                post.likes = (post.likes || 0) + 1;
            }
        },
        // 📌 Add a comment in demo mode
        addDemoComment: (state, action) => {
            state.comments.push(action.payload);
            if (DEMO_COMMENTS[state.postId]) {
                DEMO_COMMENTS[state.postId].push(action.payload);
            } else {
                DEMO_COMMENTS[state.postId] = [action.payload];
            }
        },
        // 📌 Create a post in demo mode
        addDemoPost: (state, action) => {
            state.posts.unshift(action.payload);
        },
        // 📌 Delete a post in demo mode
        deleteDemoPost: (state, action) => {
            state.posts = state.posts.filter(p => p._id !== action.payload);
        },
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

export const { reset, resetPostId, loadDemoPosts, loadDemoComments, likeDemoPost, addDemoComment, addDemoPost, deleteDemoPost } = postSlice.actions;
export default postSlice.reducer;