import { asyncHandler } from "../utils/asyncHandler.js";

const getVideos = asyncHandler(async (req, res) => {
  res.json({
    message: "Get all videos",
  });
});
export { getVideos };
