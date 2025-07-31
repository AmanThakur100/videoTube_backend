import { Router } from "express";
import {
  getLikedVideos,
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
} from "../controllers/like.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const like = Router();

like.post("/like-video/:videoId", verifyJWT, toggleVideoLike);
like.post("/like-comment/:commentId", verifyJWT, toggleCommentLike);
like.post("/toggle-tweet-like/:tweetId", verifyJWT, toggleTweetLike);
like.get("/get-liked-videos", verifyJWT, getLikedVideos);
export default like;
