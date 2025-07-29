import { Router } from "express";
import { getAllVideos } from "../controllers/video.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const video = Router();

video.get("/getallvideo", verifyJWT, getAllVideos);

export default video;
