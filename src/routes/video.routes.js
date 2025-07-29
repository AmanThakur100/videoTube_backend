import { Router } from "express";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishVideo,
  updateVideo,
  togglePublishStatus,
} from "../controllers/video.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";

const video = Router();

video.get("/getallvideo", verifyJWT, getAllVideos);
video.post("/uploadVideo", verifyJWT, upload.single("videoFile"), publishVideo);
video.get("/getVideoById", verifyJWT, getVideoById);
video.put("/updateVideo/:videoId", verifyJWT, updateVideo);
video.get("/deleteVideo/:videoId", verifyJWT, deleteVideo);
video.patch("/togglePublishStatus/:videoId", verifyJWT, togglePublishStatus);

export default video;
