import express from "express";
import { getPrivateChatMessages, sendMessage } from "./controllers";
import { validateJWTToken, validateQueryId } from "@/middlewares/validation";
import { upload } from "@/config/multer";
export const messageRouter = express.Router();

messageRouter.get(
  "/messages/private-chat",
  validateJWTToken,
  validateQueryId("receiver_id"),
  getPrivateChatMessages
);
messageRouter.post(
  "/messages/send-message",
  upload.single("image"),
  validateJWTToken,
  sendMessage
);
