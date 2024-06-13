import { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  imageUrl?: string;
  createdAt: Date;
}

export const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  }
});
