import { Router } from "express";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylist,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const playlist = Router();

playlist.post("/create-playlist", verifyJWT, createPlaylist);
playlist.get("/get-user-playlist/:userId", verifyJWT, getUserPlaylist);
playlist.get("/get-playlist-byId/:playlistId", verifyJWT, getPlaylistById);
playlist.patch(
  "/add-video-playlist/:playlistId/:videoId",
  verifyJWT,
  addVideoToPlaylist
);
playlist.patch(
  "/remove-video-from-playlist/:playlistId/:videoId",
  verifyJWT,
  removeVideoFromPlaylist
);

playlist.put("/delete-playlist/:playlistId", verifyJWT, deletePlaylist);
playlist.patch("/update-playlist/:playlistId", verifyJWT, updatePlaylist);

export default playlist;
