import type { KeywordAction } from "../types";
import { SendVideoAction } from "./SendVideoAction";

export default class KeywordActionFactory {
  private readonly actions: KeywordAction[];

  constructor() {
    this.actions = [
      new SendVideoAction(["красив", "красот"], "BAACAgIAAxkBAAMIZ3dXD8q8OrjA4vlvqDL4qBF5f9kAAnx8AAKxy7lLX6OwoNvF2zY2BA", {
        caption: "Вот это действительно красиво!",
      }),
      // 👉 Здесь легко добавить новые действия:
      // new SendVideoAction(["зима"], "<another_video_id>");
    ];
  }

  getAction(text: string): KeywordAction | null {
    return (
      this.actions.find((a) =>
        a.patterns.some((p) => p.test(text.toLowerCase()))
      ) || null
    );
  }
}
