import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.models.js";
import mongoose from "mongoose";

//addComment
const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { videoId } = req.params;

  if (!content) {
    throw new ApiError(400, "All fields are required");
  }

  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(404, "All fields are required");
  }

  const newComment = await Comment.create({
    content,
    video: videoId,
    owner: req.user?._id,
  });

  if (!newComment) {
    throw new ApiError(404, "failed to add comment");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, newComment, "comment add successfully"));
});

//getVideoComment
const getVideoComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10, sortBy = "createdAt" } = req.query;

  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID...");
  }

  const sortOption = {};
  sortOption[sortBy] = -1; // descending order

  const comments = await Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $sort: sortOption,
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $unwind: "$userDetails",
    },
  ]);

  const paginate = await Comment.aggregatePaginate(comments, {
    page: parseInt(page),
    limit: parseInt(limit),
  });

  res.status(200).json(201, paginate, "Comments fetched successfully");
});

//updateComment
const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Invalid comment id...");
  }
  const existingComment = await Comment.findById(commentId);
  if (!existingComment) {
    throw new ApiError(404, "Invalid comment id...");
  }
  if (existingComment.owner.toString() !== req.user.id.toString()) {
    throw new ApiError(
      403,
      "you are not authorized to update the comment of other users"
    );
  }

  const newComment = await Comment.findByIdAndUpdate(
    commentId,
    { content },
    { new: true }
  );

  if (!newComment) {
    throw new ApiError(404, "failed to update comment");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, newComment, "comment updated successfully"));
});

//deleteComment
const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;

  if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(404, "Invalid comment id...", {});
  }

  const existingComment = await Comment.findById(commentId);
  if (!existingComment) {
    throw new ApiError(404, "comment not found", {});
  }

  if (existingComment.owner.toString() !== req.user.id.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to delete this comment",
      {}
    );
  }

  const deletedComment = await Comment.findByIdAndDelete(commentId);
  if (!deletedComment) {
    throw new ApiError(400, "comment deleted unscessfully");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "comment deleted successfully", {}));
});

export { addComment, getVideoComment, updateComment, deleteComment };
