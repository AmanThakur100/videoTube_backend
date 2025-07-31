import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  addComment,
  deleteComment,
  getVideoComment,
  updateComment,
} from "../controllers/comment.controllers.js";

const comment = Router();

comment.post("/get-video-comments/:videoId", verifyJWT, getVideoComment);
comment.post("/add-comment/:videoId", verifyJWT, addComment);
comment.patch("/update-comment/:commentId", verifyJWT, updateComment);
comment.delete("/delete-comment/:commentId", verifyJWT, deleteComment);

export default comment;
