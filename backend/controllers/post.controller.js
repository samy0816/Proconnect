import User from "../models/user.model.js";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";


export const activeCheck=async(req,res)=>{
return res.status(200).json({message:"active"});
}


export const createPost=async(req,res)=>{
 
    const {token}=req.body;
    try {
        
        const user=await User.findOne({token:token});
        if(!user){
            return res.status(400).json({message:"user not found"});
        }

        const post=new Post({
            userId:user._id,
            body:req.body.body,
            media:req.file!=undefined?req.file.filename:"",
            filetype: req.file!=undefined?req.file.mimetype.split('/')[0]:"",
            
        });
        await post.save();  
return res.status(200).json({message:"post created"});
    } catch (error) {
        return res.status(500).json({message:"internal server error"});
    }

    
}

export const getallPost=async (req,res)=>{
    try {
        const posts=await Post.find().populate("userId","name email username profilePicture");
        return res.status(200).json({ message: "All posts fetched successfully", posts  });
        
    } catch (error) {
        console.error("Error fetching all posts:", error);
        return res.status(500).json({ message: "Error fetching all posts", error: error.message });
        
    }
}

export const deletePost=async(req,res)=>{
    const{token,postId}=req.body;
    try {
        const user=await User.findOne({token:token}).select('_id'); 
        if(!user){
            return res.status(400).json({message:"user not found"});
        }

const post =await Post.findOne({_id:postId});
if(!post){
    return res.status(400).json({message:"post not found"});
}
if(post.userId.toString()!==user._id.toString()){
    return res.status(403).json({message:"unauthorized"});
}
await Post.deleteOne({_id:postId}); 
    } catch (error) {
        return res.status(500).json({message:"internal server error"});
    }
}


export const commentsOnPost=async(req,res)=>{
const {token,postId,comment}=req.body;
    try {
const user=await User.findOne({token:token}).select('_id');
if(!user){
    return res.status(400).json({message:"user not found"});
}
const post=await Post.findOne({_id:postId});
if(!post){
    return res.status(400).json({message:"post not found"});
}
const newComment=new Comment({
    userId:user._id,
    postId:post._id,
    body:comment
});
await newComment.save();
return res.status(200).json({message:"comment added successfully"});    
    } catch (error) {
        console.error("Comment error:", error);
        return res.status(500).json({message:"internal server error"});
    }  
} 


export const getallcomments=async(req,res)=>{
    const {postId}=req.body;  
    try {
        const comments=await Comment.find({postId:postId}).populate("userId","name email username profilePicture");
        return res.status(200).json({message:"comments fetched successfully",comments});
    } catch (error) {
        console.error("Get all comments error:", error);
        return res.status(500).json({message:"internal server error"});
    }
}
export const commentdelete=async(req,res)=>{
    const {token,commentid}=req.body;
    try {

        const user=await User.findOne({token:token}).select('_id');
        if(!user){
            return res.status(400).json({message:"user not found"});
        }
        const comm=await Comment.findOne({_id:comment});
        if(!comm){
            return res.status(400).json({message:"comment not found"});
        }
        if(comm.userId.toString()!==user._id.toString()){
            return res.status(403).json({message:"unauthorized"});
        }
        await Comment.deleteOne({_id:commentid});
        return res.status(200).json({message:"comment deleted successfully"});
    } catch (error) {
        return res.status(500).json({message:"internal server error"});
    }

}


export const incrementlike=async(req,res)=>{
    const {postId}=req.body;
    try {
        const post=await Post.findOne({_id:postId});
        if(!post){
            return res.status(400).json({message:"post not found"});
        }
        post.likes+=1;
        await post.save();
        return res.status(200).json({message:"like incremented"});
    } catch (error) {
        return res.status(500).json({message:"internal server error"});
    }
}