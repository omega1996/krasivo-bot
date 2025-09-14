import TelegramBot from "node-telegram-bot-api";
import type { Message, PhotoSize, Document } from "node-telegram-bot-api";
import type { RequestInit }  from "node-fetch";
import fetch from "node-fetch";
import type {
  OpenAIChatCompletionRequest,
  OpenAIChatCompletionResponse,
} from "../types";
import { API_URL, getCurrentModel, getSystemPrompt } from "../config"; // ✨ добавили getSystemPrompt
import { escapeV2, extractImage, log } from "../utils";
import { saveMessage, getChatHistory, findMessageById } from "../db";
import { openai } from "../utils/openai";  


export default function supergroupHandler(bot: TelegramBot) {
  bot.on("message", async (msg: Message) => {
    log("— New message —", {
      chatId: msg.chat.id,
      msgId: msg.message_id,
      text: msg.text || msg.caption,
    });

    try {
      await saveMessage(msg);
    } catch (dbErr) {
      console.error("DB save error", dbErr);
    }

    try {
      console.time("handler_total");

      const chatId = msg.chat.id;
      const threadId = msg.message_thread_id || null;
      const me = await bot.getMe();

      const isChannelDiscussionPost =
        msg.chat.type === "supergroup" && chatId < 0 && threadId === null;
      const isAnonymousChannelMessage =
        !!msg.sender_chat && msg.sender_chat.type === "channel";
      const isReplyToMe = msg.reply_to_message?.from?.id === me.id;

      // Получаем данные о самой группе, чтобы узнать её linked_chat_id
      log("Fetching group chat info…");
      const groupChat = await bot.getChat(msg.chat.id);
      const linkedChatId = (groupChat as any).linked_chat_id;
      log("linkedChatId", linkedChatId);

      const textContent = msg.text || msg.caption || "";
      const directAsk = textContent.toLowerCase().startsWith("бот");
      if (
        (!linkedChatId || msg.sender_chat?.id !== linkedChatId) &&
        !directAsk &&
        !isReplyToMe
      ) {
        log("Not addressed to bot, skipping.");
        return;
      }
      

      console.time("extract_image");
      // Сначала ищем картинку в самом сообщении
      let base64DataUrl: string | null = await extractImage(msg, bot);
      // Если нет — пробуем найти изображение в сообщении, на которое отвечаем
      if (!base64DataUrl && msg.reply_to_message) {
        base64DataUrl = await extractImage(msg.reply_to_message, bot);
      }
      console.timeEnd("extract_image");
      log("base64DataUrl present?", !!base64DataUrl);

      const SYSTEM_PROMPT = await getSystemPrompt();

      const history = await getChatHistory(msg.chat.id, 10);
      // Строим сообщения под chat‑completion
      const messages: any[] = [{ role: "system", content: SYSTEM_PROMPT }];

      for (const h of history.reverse()) {
        console.log("Автор: ", h.authorName);
        const role = h.fromId === me.id ? "assistant" : "user";
        let payloadText =
          role === "user" && h.authorName
            ? `пользователь с именем ${h.authorName} пишет: ${h.text ?? ""}`
            : h.text ?? "";

        if (h.raw.reply_to_message) {
          const parentId = h.raw.reply_to_message.message_id;
          const parentDoc = await findMessageById(chatId, parentId);

          if (parentDoc?.text) {
            const who = parentDoc.authorName ?? "Сообщение";
            payloadText =
              payloadText + `. Пользователь отвечает на сообщение ${who}:\n«${parentDoc.text}»\n\n`
          }
        }
        messages.push({ role, content: payloadText });
      }

      if (base64DataUrl) {
        messages.push({
          role: "user",
          content: [
            { type: "text", text: textContent || "Прокомментируй изображение" },
            { type: "image_url", image_url: { url: base64DataUrl } },
          ],
        });
      } 

      log("Messages for OpenAI", messages);

      const needLLM =
        (isChannelDiscussionPost && isAnonymousChannelMessage) ||
        directAsk ||
        isReplyToMe;

      if (!needLLM) {
        log("No need to call LLM (conditions not met)");
        return;
      }

      // Ставим реакцию 👀, чтобы показать, что ответ обрабатывается
      try {
        const reaction = [{ type: "emoji", emoji: "👀" }];
        // @ts-ignore
        await bot.setMessageReaction(chatId, msg.message_id, { reaction: JSON.stringify(reaction) });
      } catch (reactionErr) {
        console.error("Не удалось добавить реакцию", reactionErr);
      }

      // Делаем запрос к OpenAI


      let replyText = "Тсссс, я сплю, не буди";
      try {
        const stream = await openai.chat.completions.create({
          model: await getCurrentModel(),
          messages,
          stream: true,
        });

        for await (const chunk of stream) {
          const token = chunk.choices?.[0]?.delta?.content;
          console.log("token", token);
          if (token) replyText += token;
        }

      } catch (fetchErr: any) {
        
        console.error("OpenAI fetch error", fetchErr);
        // replyText += ` (ошибка: ${fetchErr.message})`;
      }

      // Отправляем ответ
      try {
        const botReply = await bot.sendMessage(chatId, escapeV2(replyText), {
          reply_to_message_id: msg.message_id,
          parse_mode: "MarkdownV2",
        });

        try {
          await saveMessage(botReply);          // теперь история полная
        } catch (dbErr) {
          console.error("DB save error (bot reply)", dbErr);
        }
      } catch (sendErr) {
        console.error("Ошибка отправки сообщения", sendErr);
      }

      console.timeEnd("handler_total");
    } catch (err) {
      console.error("Ошибка при обработке сообщения (outer)", err);
    }
  });
}
