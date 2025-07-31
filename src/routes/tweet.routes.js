import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  createTweet,
  deleteTweetById,
  getUserTweetsById,
  updateTweetById,
} from "../controllers/tweet.controllers.js";

const tweet = Router();
tweet.post("/create-tweet", verifyJWT, createTweet);
tweet.get("/get-tweet-by-id", verifyJWT, getUserTweetsById);
tweet.patch("/update-tweet-by-id/:tweetId", verifyJWT, updateTweetById);
tweet.put("/delete-tweet-by-id/:tweetId", verifyJWT, deleteTweetById);
export default tweet;
