import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import Connection from "../models/connections.model.js";

const convertUserDataToPDF =(userData) =>{
    const doc= new PDFDocument();
    const outputPath=crypto.randomBytes(16).toString('hex') + '.pdf';
    const stream=fs.createWriteStream("uploads/"+ outputPath);
    doc.pipe(stream);
    doc.image('uploads/'+userData.userId.profilePicture,50,50,{width:100,height:100});
    doc.fontSize(20).text(`Name: ${userData.userId.name}`, 50, 160);
    doc.fontSize(14).text(`Email: ${userData.userId.email}`, 50, 190);
    doc.fontSize(14).text(`Username: ${userData.userId.username}`, 50, 210);    
    doc.fontSize(16).text('Bio:',50,240);
    doc.fontSize(12).text(userData.bio,50,260,{width:500});
    let yPosition=300;

    doc.end();
    return outputPath;
}
export const register = async (req, res) => {
    try {
        const { name, email, password, username } = req.body;
        if (!name || !email || !password || !username) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        // Check if user already exists (Mongoose syntax)
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        
        // Check if username already exists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already taken" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new user with Mongoose
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            username
        });
        
        await newUser.save();

        const profile = new Profile({ userId: newUser._id });
        await profile.save();

        // Generate token (same as login)
        const token = crypto.randomBytes(32).toString('hex');
        await User.updateOne({ _id: newUser._id }, { $set: { token } });

        return res.status(201).json({
            message: "User registered successfully",
            token: token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ message: "Error registering user", error: error.message });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
    
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = crypto.randomBytes(32).toString('hex');

        await User.updateOne({ _id: user._id }, { $set: { token } });

        return res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                username: user.username
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Error logging in", error: error.message });
    }
}

export const uploadProfilePic = async (req, res) => {
    const { token } = req.body;

    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded. Please select a profile picture." });
        }

        // Validate token
        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }

        // Find user by token
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found or invalid token" });
        }

        // Update user's profile picture
        user.profilePicture = req.file.filename;
        await user.save();

        return res.status(200).json({ 
            message: "Profile picture uploaded successfully", 
            filename: req.file.filename,
            profilePicture: req.file.filename
        });

    } catch (error) {
        console.error("Profile picture upload error:", error);
        return res.status(500).json({ message: "Error uploading profile picture", error: error.message });
    }
}

export const userUpdate = async (req, res) => {
    try {
        const { token, ...newUserData } = req.body;

        // Validate token
        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }

        // Find user by token
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found or invalid token" });
        }
        
        const existingUser= await User.findOne({$or:[{username},{email}]});
        
        if(existingUser){
            if(existingUser|| existingUser._id.toString() !== user._id.toString())
            {
                return res.status(400).json({ message: "Username or Email already taken" });
            }
        }
Object.assign(user, newUserData);
        await user.save();      
        return res.status(200).json({ 
            message: "User updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                username: user.username
            }
        }); 
    } catch (error) {
        console.error("User update error:", error);
        return res.status(500).json({ message: "Error updating user", error: error.message });
    }
}

export const getUserAndProfile = async (req, res) => {

    try {
        const { token } = req.body;

        // Validate token
        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }
        const user=await User.findOne({token: token});
        if(!user){
            return res.status(404).json({ message: "User not found or invalid token" });
        }

        const userProfile=await Profile.findOne({userId: user._id}).populate("userId","name email username profilePicture");
        return res.status(200).json({ 
            message: "User and profile fetched successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                profilePicture: user.profilePicture
            },
            profile: userProfile
        });

    } catch (error) {
        console.error("Error fetching user and profile:", error);
        return res.status(500).json({ message: "Error fetching user and profile", error: error.message });
    }
}


export const updateProfiledata= async (req,res)=>{
    try {
        const { token, ...newprofileData } = req.body;
        const userProfile=await User.findOne({token:token});
        if(!userProfile){
            return res.status(404).json({ message: "User not found or invalid token" });
        }

        const profile_to_update=await Profile.findOne({userId:userProfile._id});
        Object.assign(profile_to_update,newprofileData);
        await profile_to_update.save();
        return res.status(200).json({ 
            message: "Profile updated successfully",
            profile: profile_to_update
        });
    } catch (error) {
        console.error("Profile update error:", error);
        return res.status(500).json({ message: "Error updating profile", error: error.message });
    }
}


export const getallusers=async (req,res)=>{
    try {
        const profiles=await Profile.find().populate("userId","name email username profilePicture");
        return res.status(200).json({ 
            message: "All profiles fetched successfully",
            profiles: profiles
        });
    } catch (error) {
        console.error("Error fetching all users:", error);
        return res.status(500).json({ message: "Error fetching all users", error: error.message });
    }
}

export const downloadProfile=async (req,res)=>{

    const user_id=req.query.id;

    const userProfile= await Profile.findOne({userId:user_id}).populate("userId","name email username profilePicture");

    let outputPath= await convertUserDataToPDF(userProfile);
   return res.json({"message": "Profile PDF generated successfully", "filePath": outputPath});
}


export const sendConnectionRequest=async (req,res)=>{
    const { token, targetUserId } = req.body;
try {
    const user=await User.findOne({token});
    if(!user){
        return res.status(404).json({ message: "User not found or invalid token" });
    }   

    const targetUser=await User.findById(targetUserId);
    if(!targetUser){
        return res.status(404).json({ message: "Target user not found" });
    }
    const existingRequest=await Connection.findOne({userId: user._id, connectedUserId: targetUserId});

    if(existingRequest){
        return res.status(400).json({ message: "Connection request already sent or you are already connected" });
    }
    console.log('Creating connection request from', user._id, 'to', targetUserId);
    const request=new Connection({
        userId: user._id,
        connectedUserId: targetUserId,
        status_accepted: false
    });

    await request.save();
    console.log('Connection request saved:', request);
    return res.status(200).json({ message: "Connection request sent successfully", connection: request });
} catch (error) {
   console.error("Error sending connection request:", error);
   return res.status(500).json({ message: "Error sending connection request", error: error.message });
}
}

export const getmyConnections=async (req,res)=>{
    const { token } = req.query;
try {
    const user=await User.findOne({token});
    if(!user){
        return res.status(404).json({ message: "User not found or invalid token" });
    }
    console.log('Fetching connections for user:', user._id);
    const connections=await Connection.find({userId: user._id, status_accepted: true}).populate("connectedUserId","name email username profilePicture");
    console.log('Found accepted connections:', connections.length);
    return res.status(200).json({ message: "Connections fetched successfully", connections  });
} catch (error) {
   console.error("Error fetching connections:", error);
   return res.status(500).json({ message: "Error fetching connections", error: error.message });
}
}

export const getAllMyConnectionsIncludingPending=async (req,res)=>{
    const { token } = req.query;
try {
    const user=await User.findOne({token});
    if(!user){
        return res.status(404).json({ message: "User not found or invalid token" });
    }
    console.log('Fetching ALL connections (including pending) for user:', user._id);
    // Get all connections where I am the sender
    const connections=await Connection.find({userId: user._id}).populate("connectedUserId","name email username profilePicture");
    console.log('Found all connections:', connections.length);
    return res.status(200).json({ message: "All connections fetched successfully", connections  });
} catch (error) {
   console.error("Error fetching all connections:", error);
   return res.status(500).json({ message: "Error fetching all connections", error: error.message });
}
}

export const whataremyConnections=async (req,res)=>{
    const { token } = req.query;
try {
    const user=await User.findOne({token}); 
    if(!user){
        return res.status(404).json({ message: "User not found or invalid token" });
    }
    console.log('Fetching connection requests for user:', user._id);
    // Include both false and null as pending (for old records)
    const connections=await Connection.find({
        connectedUserId: user._id, 
        $or: [{ status_accepted: false }, { status_accepted: null }]
    }).populate("userId","name email username profilePicture");  
    console.log('Found connection requests:', connections.length);
    return res.status(200).json({ message: "Connections fetched successfully", connections  }); 

} catch (error) {
   console.error("Error fetching connections:", error);
   return res.status(500).json({ message: "Error fetching connections", error: error.message });
}
}

export const acceptconnectionRequest=async (req,res)=>{
    const { token, requestId, action_type } = req.body;
    try {
        const user=await User.findOne({token}); 
        if(!user){
            return res.status(404).json({ message: "User not found or invalid token" });
        }
        console.log('Finding connection request:', requestId);
        const connectionRequest=await Connection.findById(requestId);
        if(!connectionRequest){
            return res.status(404).json({ message: "Connection request not found" });
        }
        console.log('Connection request found:', connectionRequest);
        
        if(action_type==="accept"){
            // Set the original request as accepted
            connectionRequest.status_accepted=true;
            await connectionRequest.save();
            
            // Create a reverse connection so both users have each other in their connections
            const reverseConnection = new Connection({
                userId: user._id, // The person accepting
                connectedUserId: connectionRequest.userId, // The person who sent the request
                status_accepted: true
            });
            await reverseConnection.save();
            
            console.log('Connection accepted and reverse connection created');
            return res.status(200).json({ message: `Connection request accepted successfully` });
        } else if(action_type==="reject"){
            await Connection.findByIdAndDelete(requestId);
            return res.status(200).json({ message: `Connection request rejected and deleted successfully` });
        }

    } catch (error) {
        console.error("Error accepting/rejecting connection:", error);
        return res.status(500).json({ message: "Error processing connection request", error: error.message });
    }
}


