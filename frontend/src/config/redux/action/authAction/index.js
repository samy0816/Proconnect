
import { createAsyncThunk } from "@reduxjs/toolkit";
import clientserver from "@/config";

export const login = createAsyncThunk(
    "user/login", 
    async (user, thunkAPI) => {
        try {
            const response = await clientserver.post('/login', {
                email: user.email,
                password: user.password
            });
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                return response.data; // Return user data to reducer
            } else {
                return thunkAPI.rejectWithValue("login failed");
            }
        } catch (error) {
            const msg = error?.response?.data?.message || error.message || "login failed";
            return thunkAPI.rejectWithValue(msg);
        }
    }
)

export const registerUser = createAsyncThunk(
    "user/register",
    async (user, thunkAPI) => {
        try {
            console.log("Sending registration request:", user);
            const response = await clientserver.post('/register', {
                name: user.name,
                email: user.email,
                password: user.password,
                username: user.username
            });
            console.log("Registration response:", response.data);
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                return response.data; // Return user data to reducer
            } else {
                return thunkAPI.rejectWithValue("registration failed");
            }
        } catch (error) {
            console.error("Registration error:", error);
            console.error("Error response:", error?.response?.data);
            const msg = error?.response?.data?.message || error.message || "registration failed";
            return thunkAPI.rejectWithValue(msg);
        }
    }
)

export const getAboutUser = createAsyncThunk(
    "user/getAbout",
    async (payload, thunkAPI) => {
        try {
            // expecting payload to include userId or rely on token in headers
            const response = await clientserver.post('/get_user_and_profile', payload || {});
            // return the full data so reducer can pick profile/connections
            return response.data;
        } catch (error) {
            // include server message if available
            const msg = error?.response?.data?.message || error.message || 'fetch failed';
            return thunkAPI.rejectWithValue(msg);
        }
    }
)

export const getallUsers=createAsyncThunk(
    "user/getallUsers",
    async(_,thunkAPI)=>{
        try {
            const response=await clientserver.get('/user/get_all_users');
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            const msg = error?.response?.data?.message || error.message || 'fetch failed';
            return thunkAPI.rejectWithValue(msg);
        }
    })

