// src/config.ts
import { BotSettings, getSettings, updateSettings } from "./db";

/* —— единый TTL для всех кэшей — */
const CACHE_TTL_MS = 60_000;

/* —— model (как раньше) — */
let cachedModel         = process.env.MODEL ?? "gemma-3-12b-it";
let modelExpires        = 0;

/* —— cooldown — */
let cachedCooldown      = Number(process.env.COOLDOWN ?? 300_000);
let cooldownExpires     = 0;

/* —— system prompt — */
let cachedPrompt        = process.env.SYSTEM_PROMPT ?? "Ты дружелюбный ассистент.";
let promptExpires       = 0;

/* ———— getters ———— */
export async function getCurrentModel(): Promise<string> {
  const now = Date.now();
  if (now < modelExpires) return cachedModel;
  try { cachedModel = (await getSettings()).model; modelExpires = now + CACHE_TTL_MS; }
  catch (e) { console.error("[MODEL] Mongo err:", e); }
  return cachedModel;
}

export async function getCooldownMs(): Promise<number> {
  const now = Date.now();
  if (now < cooldownExpires) return cachedCooldown;
  try { cachedCooldown = (await getSettings()).cooldownMs; cooldownExpires = now + CACHE_TTL_MS; }
  catch (e) { console.error("[COOLDOWN] Mongo err:", e); }
  return cachedCooldown;
}

export async function getSystemPrompt(): Promise<string> {
  const now = Date.now();
  if (now < promptExpires) return cachedPrompt;
  try { cachedPrompt = (await getSettings()).systemPrompt; promptExpires = now + CACHE_TTL_MS; }
  catch (e) { console.error("[PROMPT] Mongo err:", e); }
  return cachedPrompt;
}

/* ———— централизованный patch ———— */
export async function patchSettings(patch: Partial<BotSettings>) {
  await updateSettings(patch);
  const now = Date.now() + CACHE_TTL_MS;
  if (patch.model        !== undefined) { cachedModel   = patch.model.trim();   modelExpires    = now; }
  if (patch.cooldownMs   !== undefined) { cachedCooldown = patch.cooldownMs;    cooldownExpires = now; }
  if (patch.systemPrompt !== undefined) { cachedPrompt  = patch.systemPrompt;   promptExpires   = now; }
}

/* ———— прочие константы ———— */
export const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || "";
export const API_URL        = process.env.API_URL        || "";
export const ADMIN_CHAT_ID  =
  parseInt(process.env.ADMIN_CHAT_ID || "0", 10) || 0;
