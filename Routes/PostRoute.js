import express from "express";
import multer from 'multer';
import path from "path"
import PostModel from "../Models/postModel.js";
import { createPost, deletePost, getAllPost, getPost, getTimelinePosts, likePost, updatePost } from "../Controllers/PostController.js";
import {verifyToken }from "../middleware/verifyToken.js";
const router = express.Router()



const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
       cb(null,'public/images')
    },
    filename:(req,file,cb)=>{
      cb(null,file.fieldname+"-"+Date.now()+path.extname(file.originalname))
    }
})
  
  const upload = multer({ storage:storage });

router.post('/createPost',upload.single('file'), async (req, res) => {
    const { userId, desc } = req.body;
  
   
  
    
     try {
     const newPost = await PostModel.create({
        userId: userId,
        desc:desc,
        image:req.file?.filename,
      });
    
      res.status(200).json({ post: newPost });
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: "fail", message: "server error" });
    }
  })
router.get('/:id', getPost)
router.get("/:id/allPosts",getAllPost);
router.put('/:id/updatePost', updatePost)
router.delete("/:id/:userId", deletePost)
router.put("/:id/like", likePost)
router.get("/:id/timeline", getTimelinePosts)
export default router;