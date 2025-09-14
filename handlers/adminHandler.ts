// src/handlers/admin.ts
import TelegramBot from "node-telegram-bot-api";
import type { Message } from "node-telegram-bot-api";

import {
  ADMIN_CHAT_ID,
  API_URL,
  getCurrentModel,
  patchSettings,
} from "../config";
import { getSettings } from "../db";

import type {
  OpenAIChatCompletionRequest,
  OpenAIChatCompletionResponse,
} from "../types";
import { escapeHtml } from "../utils";
import { openai } from "../utils/openai";

/* ────────────────────────────────────────────────────────── helpers ── */

import type { InlineKeyboardButton } from "node-telegram-bot-api";

async function pingModel(model: string) {
  const body: OpenAIChatCompletionRequest = {
    model,
    messages: [],
    stream: false,
  };

  const res = await fetch(`${API_URL}chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30000), // 30 секунд таймаут
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }
  const json = (await res.json()) as
    | OpenAIChatCompletionResponse
    | { error: string };

  if ("error" in json) throw new Error(json.error);
}

export async function listChatModels(): Promise<string[]> {
  const res = await openai.models.list(); // GET /v1/models
  return (
    res.data
      .map((m) => m.id)
      // оставляем только chat-friendly варианты и убираем «вижу, но не могу»
      .sort((a, b) => a.localeCompare(b))
  );
}

export function chunk<T>(arr: T[], n = 2): T[][] {
  return arr.reduce<T[][]>(
    (acc, el) => {
      (acc.at(-1)?.length ?? n) < n ? acc.at(-1)!.push(el) : acc.push([el]);
      return acc;
    },
    [[]]
  );
}

export async function buildModelKeyboard(): Promise<InlineKeyboardButton[][]> {
  const ids = await listChatModels();
  return chunk(
    ids.map((id) => ({
      text: id,
      callback_data: `setModel:${id}`, // «сигнал» для callback_query
    })),
    3
  );
}

/* ────────────────────────────────────────────────────────── handler ── */

export default function adminHandler(bot: TelegramBot) {
  bot.on("message", async (msg: Message) => {
    /* отвечаем только в личке админа */
    if (msg.chat.id !== ADMIN_CHAT_ID) return;

    /* ⇢ отдали file_id, если прислали файл/видео */
    if (msg.video || msg.document) {
      await bot.sendMessage(
        msg.chat.id,
        `📎 file_id: <code>${escapeHtml(
          msg.video?.file_id || msg.document?.file_id || "no file"
        )}</code>`,
        { reply_to_message_id: msg.message_id, parse_mode: "HTML" }
      );
      return;
    }

    /* дальше — работа со строковыми командами */
    if (!msg.text) return;
    const text = msg.text.trim();
    if (!text.startsWith("/")) return; // не команда

    const [cmd, ...restArr] = text.split(" ");
    const rest = restArr.join(" ").trim();

    /* ---------------------------------------------------------------- */
    /* /model */
    if (cmd === "/model") {
      if (!rest) {
        // выводим меню выбора
        const kb = await buildModelKeyboard();
        await bot.sendMessage(msg.chat.id, "Выбери модель:", {
          reply_markup: { inline_keyboard: kb },
          parse_mode: "HTML",
        });
        return; // больше ничего
      }

      /* ↓ поддерживаем старый «ручной» способ
           /model gpt-4o-mini ...
      */
      const requested = rest;
      try {
        await pingModel(requested);
        await patchSettings({ model: requested });
        await bot.sendMessage(
          msg.chat.id,
          `✅ Модель обновлена: <code>${escapeHtml(requested)}</code>`,
          { reply_to_message_id: msg.message_id, parse_mode: "HTML" }
        );
      } catch (err) {
        /* … */
      }
      return;
    }

    /* ---------------------------------------------------------------- */
    /* /prompt */
    if (cmd === "/prompt") {
      const settings = await getSettings();

      if (!rest) {
        await bot.sendMessage(
          msg.chat.id,
          `ℹ️ Текущий system prompt:\n<code>${escapeHtml(
            settings.systemPrompt
          )}</code>`,
          { reply_to_message_id: msg.message_id, parse_mode: "HTML" }
        );
        return;
      }

      await patchSettings({ systemPrompt: rest });
      await bot.sendMessage(msg.chat.id, "✅ System prompt обновлён.", {
        reply_to_message_id: msg.message_id,
      });
      return;
    }

    /* ---------------------------------------------------------------- */
    /* /cooldown */
    if (cmd === "/cooldown") {
      const settings = await getSettings();

      if (!rest) {
        await bot.sendMessage(
          msg.chat.id,
          `ℹ️ Текущий COOLDOWN_MS: <code>${settings.cooldownMs}</code>`,
          { reply_to_message_id: msg.message_id, parse_mode: "HTML" }
        );
        return;
      }

      const value = Number(rest);
      if (!Number.isFinite(value) || value < 0) {
        await bot.sendMessage(
          msg.chat.id,
          "❌ Укажите положительное число миллисекунд, напр. /cooldown 300000",
          { reply_to_message_id: msg.message_id }
        );
        return;
      }

      await patchSettings({ cooldownMs: value });
      await bot.sendMessage(
        msg.chat.id,
        `✅ COOLDOWN_MS установлен: <code>${value}</code>`,
        { reply_to_message_id: msg.message_id, parse_mode: "HTML" }
      );
      return;
    }
  });

  bot.on("callback_query", async (cq) => {
    if (cq.from.id !== ADMIN_CHAT_ID) return; // безопасность

    const data = cq.data ?? "";
    if (!data.startsWith("setModel:")) return;

    const requested = data.slice("setModel:".length);
    try {
      // await pingModel(requested);
      await patchSettings({ model: requested });

      await bot.editMessageText(
        `✅ Модель обновлена: <code>${escapeHtml(requested)}</code>`,
        {
          chat_id: cq.message!.chat.id,
          message_id: cq.message!.message_id,
          parse_mode: "HTML",
        }
      );
      await bot.answerCallbackQuery(cq.id, { text: "Готово!" });
    } catch (err) {
      console.error("Ошибка проверки модели:", err);
      await bot.answerCallbackQuery(cq.id, {
        text: `Не удалось использовать ${requested}`,
        show_alert: true,
      });
    }
  });
}
