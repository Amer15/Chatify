import express from "express";
import {
  getAllUsers,
  getUserById,
  getOtherUsers,
  signup,
  login,
  logout,
  updateProfile,
} from "./controllers";
import { validateJWTToken, validateQueryId } from "@/middlewares/validation";
import { upload } from "@/config/multer";
export const userRouter = express.Router();

userRouter.get("/users/all", getAllUsers);
userRouter.get("/users/get", validateQueryId(), validateJWTToken, getUserById);
userRouter.get("/users/all-users", validateJWTToken, getOtherUsers);
userRouter.post("/users/signup", signup);
userRouter.post("/users/login", login);
userRouter.post("/users/logout", logout);
userRouter.put(
  "/users/update-profile",
  upload.single("profile_image"),
  validateJWTToken,
  updateProfile
);
