import { Message } from "@/model/Message";

export interface apiResponse {
  success: boolean;
  message: string;
  isAcceptingMessage?: boolean;
  messages?: Array<Message>;
  status?: number;
}
