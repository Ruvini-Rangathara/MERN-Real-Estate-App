import express from "express";
import { updateUser } from "../controller/user.controller.js";
import {verifyToken} from "../util/verifyUser.js";

const router = express.Router();
router.post('/update/:id',verifyToken, updateUser);

export default router;