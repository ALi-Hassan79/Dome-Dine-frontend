import { api } from "@/lib/api";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export function sendChatMessage(
  message: string,
  history: ChatMessage[]
): Promise<{ reply: string }> {
  return api.post<{ reply: string }>("/chatbot", { message, history });
}