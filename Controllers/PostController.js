import PostModel from "../Models/postModel.js";
import mongoose from "mongoose";
import UserModel from "../Models/userModel.js";


// Creat new Post


export const createPost = async (req, res) => {
  const { userId, desc } = req.body;

  console.log(req.file);

  if (!userId) return res.status(400).json({ error: "userId is mandatory" });
  if (!desc) return res.status(400).json({ error: "desc is necessary" });
  console.log(req.file);

  try {
    // The image file is already uploaded and available as req.file
    const newPost = await PostModel.create({
      userId: userId,
      desc: desc,
      image: req.file.path,
    });
    res.status(200).json({ post: newPost });
  } catch (err) {
    res.status(500).json({ status: "fail", message: "server error" });
  }
};








// Get a post

export const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await PostModel.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Update a post
export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { userId ,desc } = req.body;


  try {
    const post = await PostModel.findById(postId);
    if (post.userId === userId) {
     await post.updateOne({ $set: req.body });
      res.status(200).json({message:"Post Updated"});
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  const id = req.params.id;
  const  userId  = req.params.userId;
  console.log(req.body);

  try {
    const post = await PostModel.findById(id);
    
    if (post.userId === userId) {
      await post.deleteOne();
      res.status(200).json("POst deleted successfully");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// like/dislike a post
export const likePost = async (req, res) => {
  const PostId = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(PostId); // Use findById instead of find

    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json({ message: "post Liked" });
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json({ message: "post disliked" });
    }
  } catch (err) {
    res.status(500).json("server error"); // Use status(500) instead of json(500)
  }
};


export const getAllPost=async(req,res)=>
{
 
    const userId=req.params.id;
   
  
     
    if(userId===null) return res.status(404).json({message:'Invalid Route'});
 
    try{
      const currentUserPosts = await PostModel.find({userId:userId});
 
  
      console.log(currentUserPosts);
      res.status(200).json({status:true,allPost:currentUserPosts});

    }catch(err){
      res.status(500).json({message:'Server error'});
    }
    

}

// Get Timeline POsts
export const getTimelinePosts = async (req, res) => {
  const userId = req.params.id
  try {
    const currentUserPosts = await PostModel.find({ userId: userId });

    const followingPosts = await UserModel.aggregate([
      { 
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "followingPosts",
        },
      },
      {
        $project: {
          followingPosts: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json(
      currentUserPosts
        .concat(...followingPosts[0].followingPosts)
        .sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        })
    );
  } catch (error) {
    res.status(500).json(error);
  }
};;
