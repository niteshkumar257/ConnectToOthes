import express from "express";
import {
  deleteUser,
  followUser,
  getUser,
  UnFollowUser,
  updateUser,
  getAllUser,
} from "../Controllers/UserController.js";
import path from "path";
import { verifyToken } from "../middleware/verifyToken.js";
import multer from "multer";
import UserModel from "../Models/userModel.js";

const router = express.Router();

const storage = multer.diskStorage({
    
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

router.get("/:id/getUserDetails", getUser);

  
router.put("/:id", upload.single("profilePicture"), async (req, res) => {
    const id = req.params.id;
    const { firstname, userId } = req.body;
    
    console.log(req.file);
  
    if (id === userId) {
      try {
        
       
        req.body.profilePicture=req.file.filename;
        const user = await UserModel.findByIdAndUpdate(id, req.body, {
          new: true,
        });
  
        
  
        res.status(200).json(user);
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(403).json("Access Denied! You can only update your own profile.");
    }
  });
  
  
router.delete("/:id", deleteUser);
router.put("/:id/follow", followUser);
router.put("/:id/unfollow", UnFollowUser);
router.get("/allUsers", getAllUser);
export default router;
