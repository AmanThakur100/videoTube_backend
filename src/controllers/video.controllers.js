import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import mongoose, { isValidObjectId } from "mongoose";

// getAllVideos
const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;

  // Validate userId if provided
  if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid User ID");
  }

  // Match stage
  const matchStage = {};

  if (userId) {
    matchStage.user = new mongoose.Types.ObjectId(userId);
  }

  if (query) {
    matchStage.title = { $regex: query, $options: "i" };
  }

  const aggregate = Video.aggregate([
    { $match: matchStage },
    {
      $sort: {
        [sortBy]: sortType === "asc" ? 1 : -1,
      },
    },
  ]);

  const fetchVideos = await Video.aggregatePaginate(aggregate, {
    limit: Number(limit),
    page: Number(page),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, fetchVideos, "Videos fetched successfully"));
});

// publishVideo
const publishVideo = asyncHandler(async (req, res) => {
  const { title, description, thumbnail } = req.body;

  const isUser = req.user._id;
  if (!isUser) {
    throw new ApiError(404, "user not found");
  }

  const user = await User.findById(isUser);
  if (!user) {
    throw new ApiError(404, "Invalid userId");
  }

  const fileVideoPath = req?.file?.path;

  if (!fileVideoPath) {
    throw new ApiError(404, "file path required");
  }

  const uploadedVideo = await uploadOnCloudinary(fileVideoPath);
  const durationVideo = uploadedVideo.duration.toFixed(0);
  const video = await Video.create({
    title,
    description,
    thumbnail,
    videoFile: uploadedVideo.url,
    owner: user._id,
    duration: durationVideo,
  });

  if (!video) {
    throw new ApiError(404, "failed to published");
  }
  await video.save();
  return res
    .status(201)
    .json(new ApiResponse(201, video, "publish video successfully"));
});

// getVideoById
const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.query;
  // const videoId = "68890ea9b9e1e832a51734ee";
  console.log(videoId);

  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(404, "user not found");
  }

  const video = await Video.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(videoId) },
    },
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "owner",
        as: "userDetails",
      },
    },
    {
      $unwind: "$userDetails",
    },
    {
      $project: {
        username: "$userDetails.username",
        thumbnail: 1,
        description: 1,
        title: 1,
        views: 1,
        duration: 1,
        videoFile: 1,
      },
    },
  ]);

  if (!video) {
    throw new ApiError(404, "video not found");
  }

  return res
    .status(202)
    .json(new ApiResponse(202, video, "video fetched successfully"));
});

export { getAllVideos, publishVideo, getVideoById };
