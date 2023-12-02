import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinaryFileUpload.js";
import jwt from "jsonwebtoken";
const { sign } = jwt;
const registerUser = asyncHandler(async (req, res) => {
  //accept data from frontend
  const { fullName, email, userName, password } = req.body;
  const files = req.files;

  //validate the data

  if (
    [fullName, email, userName, password].some(
      (field) => field === undefined || field?.trim() === ""
    ) ||
    files.avatar === undefined ||
    files.coverImage === undefined
  ) {
    throw new ApiError(400, "All fields are required");
  } else {
    let existingUsr = await User.findOne({
      $or: [{ email }, { userName }],
    });

    if (existingUsr) {
      throw new ApiError(400, "User already exists");
    }
    //upload the photo on cloudinary
    const avatarPath = files.avatar[0].path;
    const coverImagePath = files.coverImage[0].path;
    let remoteAvatar = await uploadOnCloudinary(avatarPath);
    let remoteCover = await uploadOnCloudinary(coverImagePath);

    if (!remoteAvatar || !remoteCover) {
      throw new ApiError(500, "File upload failed");
    } else {
      const usr = await User.create({
        fullName,
        email,
        userName,
        password,
        avatar: remoteAvatar.url,
        coverImage: remoteCover.url,
      });
      //remove password and refresh token from usr

      const createdUser = await User.findById(usr._id).select(
        "-password -refreshToken"
      );
      if (usr) {
        const token = usr.generateAccessToken();
        res.cookie("token", token);

        res.status(201).json(
          new ApiResponse({
            statusCode: 201,
            data: createdUser,
            accessToken: token,
            message: "User registered successfully",
          })
        );
      } else {
        throw new ApiError(400, "User creation failed");
      }
    }
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const searchedUser = await User.findOne({ email });
  if (!searchedUser) {
    throw new ApiError(400, "User with that email not found");
  } else {
    const isPasswordCorrect = await searchedUser.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      throw new ApiError(400, "Either email or password is incorrect");
    } else {
      res.json({
        message: "User logged in successfully",
      });
    }
  }
});

export { registerUser, loginUser };
