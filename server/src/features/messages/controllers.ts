import Message from "@/models/message.model";
import { CustomError } from "@/utils/custom_error";
import { validateSchema } from "@/utils/validation";
import { Request, Response } from "express";
import { sendMessageSchema } from "./validators";
import { uploadToCloudinary } from "@/config/cloudinary";
import { getSocketIO, userSocketMap } from "@/utils/socket";

export const getPrivateChatMessages = async (req: Request, res: Response) => {
  if (!req.user_id) {
    throw new CustomError("unauthorized", 403);
  }
  const receiver_id = req.query.receiver_id;
  // console.log(receiver_id)
  const page = Number(req.query.page) || 1;
  const limit = 20;
  const offset = limit * (page - 1);
  const totalRecords = await Message.countDocuments({
    $or: [
      {
        senderId: req.user_id,
        receiverId: receiver_id,
      },
      {
        senderId: receiver_id,
        receiverId: req.user_id,
      },
    ],
  });
  const total_pages = Math.ceil(totalRecords / limit);

  const messages = await Message.find({
    $or: [
      {
        senderId: req.user_id,
        receiverId: receiver_id,
      },
      {
        senderId: receiver_id,
        receiverId: req.user_id,
      },
    ],
  })
    .skip(offset)
    .limit(limit);

  res.status(200).json({
    message: "successfully fetched chat messages",
    total_pages,
    current_page: page,
    items_per_page: limit,
    current_page_items: messages.length,
    messages,
  });
};

export const sendMessage = async (req: Request, res: Response) => {
  const payload = validateSchema(sendMessageSchema, {
    ...req.body,
    image: req.file ?? null,
  });

  if (!req.user_id) {
    throw new CustomError("unauthorized", 403);
  }

  let imageUrl = null;

  if (payload.image) {
    imageUrl = await uploadToCloudinary(
      payload.image.buffer,
      payload.image.filename
    );
  }

  const newMessage = new Message({
    senderId: req.user_id,
    receiverId: payload.receiverId,
    message: payload.message,
    image: imageUrl,
  });

  await newMessage.save();

  const receiver = userSocketMap.get(payload.receiverId);
  console.log(`is receiver online: ${receiver}`);
  if (receiver) {
    const io = getSocketIO();

    io.to(receiver).emit("new-chat-msg", {
      receiverId: receiver,
      senderId: req.user_id,
      image: imageUrl,
      message: payload.message,
      createdAt: new Date().toISOString()
    });
  }

  res.status(200).json({
    message: "successfully sent the message",
  });
};
