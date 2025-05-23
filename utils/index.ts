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

