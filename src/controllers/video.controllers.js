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

export { getAllVideos };
