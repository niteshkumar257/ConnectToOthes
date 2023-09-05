import express from "express";
import { loginUser, registerUser } from "../Controllers/AuthController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router()


router.post('/register',registerUser)
router.post('/login', loginUser)
export default router