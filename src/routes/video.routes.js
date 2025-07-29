import { Router } from "express";
import {
  getAllVideos,
  getVideoById,
  publishVideo,
} from "../controllers/video.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";

const video = Router();

video.get("/getallvideo", verifyJWT, getAllVideos);
video.post("/uploadVideo", verifyJWT, upload.single("videoFile"), publishVideo);
video.get("/getVideoById", verifyJWT, getVideoById);

export default video;
