import TelegramBot from "node-telegram-bot-api";
import type { Message } from "node-telegram-bot-api";
import fetch from "node-fetch";
import type {
  OpenAIChatCompletionRequest,
  OpenAIChatCompletionResponse,
} from "../types";
import { API_URL, getCurrentModel } from "../config";

export default function supergroupHandler(bot: TelegramBot) {
  bot.on("message", async (msg: Message) => {
    try {
      const chatId = msg.chat.id;
      const threadId = msg.message_thread_id || null;

      const isChannelDiscussionPost =
        msg.chat.type === "supergroup" && chatId < 0 && threadId === null;

      const isAnonymousChannelMessage =
        !!msg.sender_chat && msg.sender_chat.type === "channel";

      // Получаем данные о самой группе, чтобы узнать её linked_chat_id
      const groupChat = await bot.getChat(msg.chat.id);
      const linkedChatId = groupChat.linked_chat_id;

      if (!linkedChatId) {
        return; // нет привязанного канала
      }

      // Теперь сверяем, что отправитель == привязанный канал
      if (msg.sender_chat?.id !== linkedChatId) {
        // Это сообщение от другого канала, не от официально привязанного
        return;
      }

      if (isChannelDiscussionPost && isAnonymousChannelMessage) {
        const text = msg.text || "";

        const requestBody: OpenAIChatCompletionRequest = {
          model: getCurrentModel(),
          messages: [
            {
              role: "user",
              content: `Отвечай только на русском. ...
              
текст: ${text}`,
            },
          ],
          stream: false,
        };

        const response = await fetch(`${API_URL}chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify(requestBody),
        });

        const data = (await response.json()) as OpenAIChatCompletionResponse;

        if (!data?.choices?.[0]?.message?.content) {
          console.error("Не удалось получить ответ от API", data);
        }

        const replyText =
          data?.choices?.[0]?.message?.content ||
          "Не удалось получить ответ от API";

        await bot.sendMessage(msg.chat.id, replyText, {
          reply_to_message_id: msg.message_id,
        });
      }
    } catch (err) {
      console.error("Ошибка при обработке сообщения:", err);
    }
  });
}
