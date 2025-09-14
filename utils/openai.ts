import OpenAI from "openai";
import { API_URL } from "../config";


export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "token",
  baseURL: API_URL,
  timeout: 30000, // 30 секунд таймаут
  maxRetries: 2,
});
