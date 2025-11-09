import clientserver from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getallPosts = createAsyncThunk(
    "post/getallposts",
    async (_, thunkAPI) => {
        try {
            const response = await clientserver.get('/posts');
            console.log("Fetched posts:", response.data);
            // Backend returns { message, posts }, extract posts array
            return response.data.posts || response.data;
        } catch (error) {
            console.error("Error fetching posts:", error);
            return thunkAPI.rejectWithValue("fetching posts failed");
        }
    }
);

export const createPost = createAsyncThunk(
  "post/createPost",
  async ({ file, body }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("body", body);
      formData.append("token", token);  // Backend expects token in body
      if (file) {
        formData.append("media", file);
      }

      const response = await clientserver.post("/create_post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Post create error:", error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Delete a post
export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (post_id, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await clientserver.post("/delete_post", 
        {
          token: token,
          postId: post_id.post_id,  // Backend expects postId, not post_id
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Something went wrong");
    }
  }
);

// ✅ Like a post
export const incrementPostLike = createAsyncThunk(
  "post/incrementLike",
  async (post, thunkAPI) => {
    try {
      const response = await clientserver.post(
        "/increment_like",
        {
          postId: post.post_id,  // Backend expects postId, not post_id
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Like failed");
    }
  }
);

// ✅ Get all comments for a post
export const getAllComments = createAsyncThunk(
  "post/getAllComments",
  async (postData, thunkAPI) => {
    try {
      const response = await clientserver.post("/get_all_comments", 
        {
          postId: postData.post_id,  // Backend expects postId
        }
      );
      return {
        comments: response.data.comments || response.data, // Extract comments array
        post_id: postData.post_id,
      };
    } catch (err) {
      console.error("Get comments error:", err.response?.data || err.message);
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

// ✅ Post a comment
export const postComment = createAsyncThunk(
  "post/postComment",
  async (commentData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await clientserver.post(
        "/comment_on_post",
        {
          token: token,  // Backend expects token in body
          postId: commentData.post_id,  // Backend expects postId
          comment: commentData.body,  // Backend expects comment field
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Something went wrong");
    }
  }
);

// Reset post state (for closing comment modal)
export const resetPost = () => ({ type: 'post/reset' });
