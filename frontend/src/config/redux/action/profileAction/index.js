import { createAsyncThunk } from "@reduxjs/toolkit";
import clientserver from "@/config";

// Upload profile picture
export const uploadProfilePicture = createAsyncThunk(
    "profile/uploadPicture",
    async (file, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("profile_pic", file);
            formData.append("token", token);

            const response = await clientserver.post('/upload_profile_pic', formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            return response.data;
        } catch (error) {
            console.error("Upload profile picture error:", error.response?.data || error.message);
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Upload failed");
        }
    }
);

// Update profile data (bio, currentPost, education, work)
export const updateProfile = createAsyncThunk(
    "profile/updateProfile",
    async (profileData, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            const response = await clientserver.post('/update_profile_data', {
                token,
                ...profileData
            });
            return response.data;
        } catch (error) {
            console.error("Update profile error:", error.response?.data || error.message);
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Update failed");
        }
    }
);

// Update user data (name, email, username)
export const updateUser = createAsyncThunk(
    "profile/updateUser",
    async (userData, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            const response = await clientserver.post('/user_update', {
                token,
                ...userData
            });
            return response.data;
        } catch (error) {
            console.error("Update user error:", error.response?.data || error.message);
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Update failed");
        }
    }
);

// Get profile by username
export const getProfileByUsername = createAsyncThunk(
    "profile/getByUsername",
    async (username, thunkAPI) => {
        try {
            // Since backend doesn't have a specific endpoint, we fetch all and filter
            const response = await clientserver.get('/user/get_all_users');
            const profiles = response.data?.profiles || [];
            const profile = profiles.find(p => p.userId?.username === username);
            if (profile) {
                return profile;
            } else {
                return thunkAPI.rejectWithValue("Profile not found");
            }
        } catch (error) {
            console.error("Get profile error:", error.response?.data || error.message);
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Fetch failed");
        }
    }
);

// Send connection request
export const sendConnectionRequest = createAsyncThunk(
    "profile/sendConnection",
    async (targetUserId, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            const response = await clientserver.post('/user/send_connection_request', {
                token,
                targetUserId
            });
            return response.data;
        } catch (error) {
            console.error("Send connection error:", error.response?.data || error.message);
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Request failed");
        }
    }
);

// Get my connections (people I've connected with)
export const getMyConnections = createAsyncThunk(
    "profile/getMyConnections",
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            const response = await clientserver.get('/user/get_my_connections', {
                params: { token }
            });
            return response.data;
        } catch (error) {
            console.error("Get connections error:", error.response?.data || error.message);
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Fetch failed");
        }
    }
);

// Get connection requests (people who want to connect with me)
export const getConnectionRequests = createAsyncThunk(
    "profile/getConnectionRequests",
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            const response = await clientserver.get('/user/what_are_my_connections', {
                params: { token }
            });
            return response.data;
        } catch (error) {
            console.error("Get connection requests error:", error.response?.data || error.message);
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Fetch failed");
        }
    }
);

// Accept/reject connection request
export const respondToConnection = createAsyncThunk(
    "profile/respondToConnection",
    async ({ requestId, action_type }, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            const response = await clientserver.post('/user/accept_connection_request', {
                token,
                requestId,
                action_type // "accept" or "reject"
            });
            return response.data;
        } catch (error) {
            console.error("Respond to connection error:", error.response?.data || error.message);
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Action failed");
        }
    }
);
