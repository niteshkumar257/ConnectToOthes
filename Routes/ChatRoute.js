import express from "express";
import {createChat,getAllmsg,findChat} from "../Controllers/ChatController.js"

const router=express.Router();

router.post('/createChat',createChat);
router.get('/:userId',getAllmsg);
router.get('/find/:firstId/:secondId',findChat);

export default router;