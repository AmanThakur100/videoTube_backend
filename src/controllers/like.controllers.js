import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/like.models.js";

//togglelike
const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user.id;

  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(404, "Invalid video id...");
  }
  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: userId,
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike?._id);
    return res
      .status(200)
      .json(new ApiResponse(200, existingLike, "video unliked..."));
  }
  const newLike = await Like.create({
    video: videoId,
    likedBy: userId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, newLike, "video liked successfully..."));
});

//toggleCommentlike
const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(404, "Invalid comment id...");
  }

  const commentVideo = await Like.findOne({
    comment: commentId,
    likedBy: userId,
  });
  if (commentVideo) {
    await Like.findByIdAndDelete(commentVideo._id);
    return res
      .status(200)
      .json(new ApiResponse(200, "comment unliked successfully"));
  }
  const newLike = await Like.create({
    comment: commentId,
    likedBy: userId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, newLike, "comment liked successfully"));
});

//toggletweetlike
const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user.id;

  if (!tweetId || !mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(404, "Invalid tweet id...");
  }

  const tweetToggleVideo = await Like.findOne({
    tweet: tweetId,
    likedBy: userId,
  });
  if (tweetToggleVideo) {
    return res
      .status(200)
      .json(new ApiResponse(400, "tweet unliked successfully..."));
  } else {
    await Like.create({
      tweet: tweetId,
      likedBy: userId,
    });
  }
  return res.status(200).json(new ApiResponse(200, "tweet liked successfully"));
});

//getLikedVideo
const getLikedVideos = asyncHandler(async (req, res) => {
  const likedVideoDetails = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(req.user.id),
      },
    },
    {
      $lookup: {
        from: "videos",
        foreignField: "_id",
        localField: "video",
        as: "likeVideoData",
      },
    },
    {
      $unwind: "$likeVideoData",
    },
    {
      $project: {
        _id: 0,
        video: "$likeVideoData",
      },
    },
  ]);

  console.log("liked videos :", likedVideoDetails);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        likedVideoDetails,
        "fetched liked videos successfully"
      )
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
