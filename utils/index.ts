import TelegramBot, { Document, Message, PhotoSize } from "node-telegram-bot-api";

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function toBase64DataUrl(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`image download failed: ${res.status}`);

  const buf = Buffer.from(await res.arrayBuffer());

  // API принимает только png или jpeg.  Если сервер вернул «octet-stream»,
  // берём jpeg по умолчанию.
  const mime = res.headers.get("content-type")?.includes("png")
    ? "image/png"
    : "image/jpeg";

  return `data:${mime};base64,${buf.toString("base64")}`;
}
export async function toBase64String(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`image download failed: ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer).toString("base64"); // без data:префикса
}


export function escapeV2(text: string) {
  return text.replace(/[_*[\]()~>#+\-=|{}.!]/g, "\\$&");
}

const DEBUG = process.env.DEBUG_BOT !== "false";

export const log = (...args: unknown[]) => DEBUG && console.log("[supergroup]", ...args);


export const extractImage = async (m: Message, bot: TelegramBot): Promise<string | null> => {
  try {
    if (m.photo?.length) {
      const largest = m.photo.at(-1) as PhotoSize;
      const link = await bot.getFileLink(largest.file_id);
      log("Found photo", link);
      return toBase64DataUrl(link);
    }
    if (m.document && (m.document as Document).mime_type?.startsWith("image/")) {
      const link = await bot.getFileLink(m.document.file_id);
      log("Found document-image", link);
      return toBase64DataUrl(link);
    }
  } catch (e) {
    console.error("extractImage error", e);
  }
  return null;
};

export function pickAuthorName(msg: Message): string | undefined {
  if (msg.from) {
    return (
      msg.from.username ||                // @username
      [msg.from.first_name, msg.from.last_name].filter(Boolean).join(" ")
    );
  }
  // если сообщение пришло от канала (анонимное), берём title
  if (msg.sender_chat?.title) return msg.sender_chat.title;
  return undefined;
}