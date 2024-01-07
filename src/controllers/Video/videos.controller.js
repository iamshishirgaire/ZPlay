import { asyncHandler } from "../../utils/asyncHandler.js";

const getVideos = asyncHandler(async (req, res) => {
  res.json({
    message: "Get all videos",
    id: req.userId,
  });
});
const postVideo = asyncHandler(async (req, res) => {
  res.json({
    message: "Post all videos",
    data: req.body,
    id: req.userId,
  });
});
export { getVideos, postVideo };
