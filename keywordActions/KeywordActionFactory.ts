import type { KeywordAction } from "../types";
import { SendVideoAction } from "./SendVideoAction";

export default class KeywordActionFactory {
  private readonly actions: KeywordAction[];

  constructor() {
    this.actions = [
      new SendVideoAction(
        ["красив", "красот"],
        "BAACAgIAAxkBAAMIZ3dXD8q8OrjA4vlvqDL4qBF5f9kAAnx8AAKxy7lLX6OwoNvF2zY2BA",
        {
          caption: "Вот это действительно красиво!",
        }
      ),
      new SendVideoAction(
        ["ооо"],
        "BAACAgIAAxkBAAOBaC9fQItVzP_VpN_wSM9SwqvMJwYAAu5mAALXuIFJMGe16ix7fjk2BA"
      ),
      new SendVideoAction(
        [/(^|[^а-яА-Я])вор([^а-яА-Я]|$)/g],
        "BAACAgIAAxkBAAODaC9fyg2zFbmv3aah__kB0ZwCA7kAApJeAAIb5AlLIBf7YcfJMMQ2BA"
      ),
      new SendVideoAction(
        ["музык"],
        "BAACAgIAAxkBAAOFaC9gjX6qe4mFtdJAeuitMcFdcwoAAnFzAALszoFJ7p3ZeXnw-0M2BA"
      ),
      new SendVideoAction(
        ["ветеран", "ветерин", "ветена"],
        "BAACAgIAAxkBAAOHaC9ksyUAAac_otf-eBnqPX9qGHLTAAJYZwAC17iBSZyI3C1u86nnNgQ"
      ),
      new SendVideoAction(
        ["пять", "десять", "пятнад", "четыре", /(^|[^0-9])\d+([^0-9]|$)/g],
        "BAACAgIAAxkBAAOJaC9k76-HO6B6soKeUs2xNpsO7fAAAt1-AAK5tnlJkRisN-Ko-IY2BA"
      ),
      new SendVideoAction(
        ["страш", "страх"],
        "BAACAgIAAxkBAAOYaC9mEtUX8285jz57CInruP7dAZoAArxuAAKWe3hJv9Ctu_6zD1Q2BA"
      ),
      new SendVideoAction(
        ["дума"],
        "BAACAgIAAxkBAAOgaC9mUrqizjeFbqD9DRrC1r2kY-sAAmlnAALXuIFJtKWyRJbvcwABNgQ"
      ),
      new SendVideoAction(
        ["сделаю"],
        "BAACAgIAAxkBAAOiaC9mbwABmr9d25-Nongd5K9EbsyiAAJsZwAC17iBSeCouTZ8I3P3NgQ"
      ),
      new SendVideoAction(
        ["хочу"],
        "BAACAgIAAxkBAAOkaC9oAfVi0nI8OKKuyS6d0quGGkUAAoFnAALXuIFJQRG3_kIJ_JU2BA"
      ),
      new SendVideoAction(
        ["всего", "хорошего", "русские", "идут"],
        "BAACAgIAAxkBAAOmaC9oc_L7MjnHL_ozu7AKV_78UvAAAiN0AALszoFJw90Ff54GXyc2BA"
      ),
      new SendVideoAction(
        ["пахне", "пахнэ", "нажарив", "окорочок"],
        "BAACAgIAAxkBAAOoaC9oePNJWwj5Uwcu-r3x243q6ZgAAiJ0AALszoFJusbG3zy8u282BA"
      ),
      new SendVideoAction(
        ["посуд"],
        "BAACAgIAAxkBAAOqaC9pToSI_2yBxpmoiaWdoHTYF-wAAoVzAALszoFJtknme8LT-C02BA"
      ),
      new SendVideoAction(
        ["пасха"],
        "BAACAgIAAxkBAAOsaC9px0Zq85W3pXYX8eavQPfUZhIAAmZvAALDRClIJ593fAXPmN42BA",
        {
          caption: "Христос воскрес!",
        }
      ),
      new SendVideoAction(
        ["спасибо"],
        "BAACAgIAAxkBAAOuaC9q0I1IzEp4GicfenNpsKk7AzEAAlB0AALszoFJGXFckwSqQPo2BA",
        {
          caption: "Храни вас бог!",
        }
      ),
      new SendVideoAction(
        ["торопись"],
        "BAACAgIAAxkBAAOwaC9q-wdesr0AAZj4RcIOT1qYO5u3AAJTdAAC7M6BSR0k31PKfJlaNgQ"
      ),
      new SendVideoAction(
        ["ахаха"],
        "BAACAgIAAxkBAAOyaC9rs_nFuXflrq73RwPhsArlHO4AAmF0AALszoFJRP6HyIDAM5Q2BA"
      ),
      new SendVideoAction(
        ["пу-пу", "пупу"],
        "BAACAgIAAxkBAAO5aC9sP1bEpElB9Qtb_haXkgAB02iJAAJwdAAC7M6BSSHQoE1g4vq9NgQ"
      ),
      new SendVideoAction(
        ["привет"],
        "BAACAgIAAxkBAAO7aC9tJhd6TF2dgK8e7gaKLjujzcUAAtRnAALXuIFJc5Psik7E7zM2BA"
      ),
      new SendVideoAction(
        ["как дела"],
        "BAACAgIAAxkBAAO9aC9tei-XRfrKp6NMIRUX8APW5PUAAthnAALXuIFJ5B3lgqF9zmo2BA"
      ),
      new SendVideoAction(
        [/(^|[^а-яА-Я])да([^а-яА-Я]|$)/g, "да-да", "дада"],
        "BAACAgIAAxkBAAO_aC9tnaXPiRhNM13kl9AP5LSTtSgAAnt0AALszoFJNMg2R_3p7IM2BA"
      ),
      new SendVideoAction(
        ["боже"],
        "BAACAgIAAxkBAAPBaC9txGzNcSzAbDtsBvLvSHV1ItAAAnx0AALszoFJuOYsBtqUW6w2BA"
      ),
      new SendVideoAction(
        ["мясо"],
        "BAACAgIAAxkBAAPDaC9w-fX-cV2FyRc9ZZ9QL6tb_PsAAglbAAIIaRlKT9H23a6rJ-g2BA"
      ),
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
