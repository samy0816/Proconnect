import { createSlice } from "@reduxjs/toolkit";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAboutUser, getallUsers } from "../../../authAction";



import { login,registerUser } from "../../../authAction";
import { act } from "react";
const initialState = {
  user:[],
  iserror:false,
  issuccess:false,
  isloading:false,
  loggedin:false,
    message:"",
    isTokenthere:false,
    profilefetched:false,
    all_profiles_fetched:false,
    all_profiles:[],
    all_users:[],
    connections:[],
    connectionRequest:[]
};


const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
reset:()=>initialState,
handleloginUser:(state)=>{
    state.message="hello"
    },
    setTokenIsthere :(state)=>{
        state.isTokenthere=true;
    },
    setTokenNotthere :(state)=>{
        state.isTokenthere=false;
    },
},

extraReducers:(builder)=>{
    builder
    .addCase(login.pending,(state)=>{
        state.isloading=true;
        state.iserror=false;
        state.message="loading";
    })
    .addCase(login.fulfilled,(state,action)=>{
        state.isloading=false;
        state.issuccess=true;
        state.loggedin=true;
        state.iserror=false;
        state.message="login success";
        // Store user data from backend response
        state.user=action.payload.user;
    })
    .addCase(login.rejected,(state,action)=>{
        state.isloading=false;
        state.iserror=true;
        state.loggedin=false;
        state.issuccess=false;
        state.message=action.payload;
    })
    .addCase(registerUser.pending,(state)=>{
        state.isloading=true;
        state.iserror=false;
        state.message="loading";
    })
    .addCase(registerUser.fulfilled,(state,action)=>{
        state.isloading=false;
        state.issuccess=true;
        state.loggedin=true;
        state.iserror=false;
        state.message="registration success";
        // Store user data from backend response
        state.user=action.payload.user;
    })
    .addCase(registerUser.rejected,(state,action)=>{
        state.isloading=false;
        state.iserror=true;
        state.loggedin=false;
        state.issuccess=false;
        state.message=action.payload;
    })
    .addCase(getAboutUser.pending,(state)=>{
        state.isloading=true;
    })
    .addCase(getAboutUser.fulfilled,(state,action)=>{
        state.isloading=false;
        state.iserror=false;
        state.profilefetched=true;
        // Store complete profile data
        state.user=action.payload.user;
        // Mark user as logged in when profile is successfully fetched from token
        state.loggedin = true;
        state.profile=action.payload.profile;
    })
    .addCase(getAboutUser.rejected,(state,action)=>{
        state.isloading=false;
        state.iserror=true;
        state.message=action.payload;
    })
    .addCase(getallUsers.pending,(state)=>{
        state.isloading = true;
    })
    .addCase(getallUsers.fulfilled,(state,action)=>{
        state.isloading=false;
        state.iserror=false;
        state.all_profiles_fetched=true;
        // backend may return { profiles: [...] } or an array directly
        state.all_users = action.payload?.profiles || action.payload || [];
        state.all_profiles = state.all_users;
    })
    .addCase(getallUsers.rejected,(state,action)=>{
        state.isloading=false;
        state.iserror=true;
        state.message = action.payload;
    })
}
})  
export const{reset,emptyMessage, setTokenIsthere,setTokenNotthere}= authSlice.actions;
export default authSlice.reducer;