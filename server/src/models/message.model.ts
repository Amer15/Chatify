import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  senderId: Schema.Types.ObjectId;
  receiverId: Schema.Types.ObjectId;
  message: string | null;
  image: string | null;
}

const messageSchema = new Schema<IMessage>({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
  },
  image: {
    type: String,
  },
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);

export default Message;
