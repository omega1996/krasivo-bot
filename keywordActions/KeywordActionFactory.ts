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
        "BAACAgIAAxkBAAIBKGgv-0Pcs2m3lfd1TJ52Eyb2H2aAAALeZwACixOBSTf1R21_nF1FNgQ"
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
        ["мясо", "кушать"],
        "BAACAgIAAxkBAAPTaC_zciqqJgj4AhupeemBOkD6PB8AApZnAAKLE4FJvEuxyjC-QEQ2BA"
      ),
      new SendVideoAction(
        ["нихуя", "ебал"],
        "BAACAgIAAxkBAAPVaC_zkWWbSQ3IPMnZozesONBHlYsAApdnAAKLE4FJoOdcYtO2mB02BA"
      ),
      new SendVideoAction(
        ["В С Ё", "конец"],
        "BAACAgIAAxkBAAPXaC_0ZtNlkG11bszW0W7VP2dgqxwAAppnAAKLE4FJJbFHfkqXRKg2BA"
      ),
      new SendVideoAction(
        ["момент", "скоро"],
        "BAACAgIAAxkBAAPZaC_0kRgmBSJCcliwxj-ZvYzk1lcAApxnAAKLE4FJEKZbaprbNZM2BA"
      ),
      new SendVideoAction(
        ["поворот"],
        "BAACAgIAAxkBAAPbaC_0uD6p9enQ8yb_3srpV3SnCAQAAp5nAAKLE4FJuq7QyL-wSI02BA"
      ),
      new SendVideoAction(
        ["можно"],
        "BAACAgIAAxkBAAPdaC_08FCelHv1g4YuRk9u_oiNRisAAqBnAAKLE4FJ-8O2gX5Rm1M2BA"
      ),
      new SendVideoAction(
        ["работ"],
        "BAACAgIAAxkBAAPfaC_1UNvqfJzswBVNuGbx4VUEclkAAqNnAAKLE4FJjPRC6WLSxV02BA"
      ),
      new SendVideoAction(
        ["чего"],
        "BAACAgIAAxkBAAPhaC_1gMNx9Rnm6_7D3SuphFpyFnQAAqZnAAKLE4FJ6J7nsHTAvVE2BA"
      ),
      new SendVideoAction(
        ["найс", "nice"],
        "BAACAgIAAxkBAAPjaC_1miNJGKQePm6FpBElO1iTKBgAAqhnAAKLE4FJAAHNkh88BezgNgQ"
      ),
      new SendVideoAction(
        ["транс", "оу май", "оу, май"],
        "BAACAgIAAxkBAAPlaC_1wJwQOMvvP7NUbAxAb_TVKf4AAqpnAAKLE4FJvdZgvDCZrxI2BA"
      ),
      new SendVideoAction(
        ["понял", "интересно"],
        "BAACAgIAAxkBAAPnaC_1-OZGM7Pz3rJROxL7mMZ9ImgAAqtnAAKLE4FJqBHt5qvYTcU2BA"
      ),
      new SendVideoAction(
        ["сомне", "сомни"],
        "BAACAgIAAxkBAAPpaC_2J2-yOV_MrAABrTSqZoM4Wa1TAAKsZwACixOBSeO8ZXsPAeX3NgQ"
      ),
      new SendVideoAction(
        ["четко", "чётко", "умеете"],
        "BAACAgIAAxkBAAPraC_2UkRqvdIhs-5oiN3Wi4R-0hsAAq1nAAKLE4FJyzr6Mwgtotc2BA"
      ),
      new SendVideoAction(
        ["сказочный", "долбоеб", "долбоёб"],
        "BAACAgIAAxkBAAPtaC_2f7tS0d-kov1PZQjLmNiEgw4AAtlnAAKWe4BJkVDDamLc95o2BA"
      ),
      new SendVideoAction(
        ["ладно"],
        "BAACAgIAAxkBAAPvaC_2rrvpzL_btPZMBs2lh8FZy00AArBnAAKLE4FJWO6wQ71qwIQ2BA"
      ),
      new SendVideoAction(
        ["крыса"],
        "BAACAgIAAxkBAAPxaC_21rqSqxTmNH5r9Bl_h_Q4by4AArJnAAKLE4FJa9tWaxVtbBU2BA"
      ),
      new SendVideoAction(
        ["естественно"],
        "BAACAgIAAxkBAAPzaC_29Man9wFzHK2WC6vASO04GrMAArNnAAKLE4FJGibfvDoQ2hM2BA"
      ),
      new SendVideoAction(
        ["испуг"],
        "BAACAgIAAxkBAAP1aC_3F5cibjbSr5a_PmygT3PhOqEAArdnAAKLE4FJx_GP74jwOGU2BA"
      ),
      new SendVideoAction(
        [/(^|[^а-яА-Я])вау([^а-яА-Я]|$)/g],
        "BAACAgIAAxkBAAP3aC_3MBQEZPwyMTWnlMorHkdU_HoAArhnAAKLE4FJAAF1fZUylCb0NgQ"
      ),
      new SendVideoAction(
        [/(^|[^а-яА-Я])сто([^а-яА-Я]|$)/g, "миллион", "100", "тыщу", "тысяч"],
        "BAACAgIAAxkBAAP5aC_3ZWeJrC9vSVVwiQG7QB9_FRoAAuNnAAKWe4BJRU6ipi1lUw82BA"
      ),
      new SendVideoAction(
        ["хуйня"],
        "BAACAgIAAxkBAAP7aC_3r-fcg-qWsjckjyLwDR0S8FwAArtnAAKLE4FJ0P3JnP5iq9w2BA"
      ),
      new SendVideoAction(
        ["серьезно", "серьёзно"],
        "BAACAgIAAxkBAAP9aC_3w49wCgr9L6b6wqbHcoDYHpsAArxnAAKLE4FJmDH9-d8nDjk2BA"
      ),
      new SendVideoAction(
        ["нет"],
        "BAACAgIAAxkBAAP_aC_4AAEgzpZ1LPfY1hr8GH5dGNLsAAK-ZwACixOBSfdMyfdR6HKiNgQ"
      ),
      new SendVideoAction(
        [/н(е)+т/g],
        "BAACAgIAAxkBAAIBAWgv-EPnTrsUHd5-9KwXqTEZiwp7AALrZwAClnuASVnzrCld6a3dNgQ"
      ),
      new SendVideoAction(
        ["внимание"],
        "BAACAgIAAxkBAAIBA2gv-GhG8gjPDdn5wUp-sBajSqByAALCZwACixOBSYl6mZD6umQnNgQ"
      ),
      new SendVideoAction(
        ["сойдет", "и так"],
        "BAACAgIAAxkBAAIBBWgv-KicJu5B7ejNrG-I6J0PMWOQAALEZwACixOBSQp_3SW7tdqCNgQ"
      ),
      new SendVideoAction(
        ["другая", "история"],
        "BAACAgIAAxkBAAIBB2gv-NhNky2FzHxZ5spgmUqv_FoeAALFZwACixOBSf4jKgUo2xkwNgQ"
      ),
      new SendVideoAction(
        ["умер", "жаль", "добряк"],
        "BAACAgIAAxkBAAIBCWgv-PGVWr2KAScaSKYV7wiCOYYoAALGZwACixOBScGk4OF-zkicNgQ"
      ),
      new SendVideoAction(
        ["успех", "получилось"],
        "BAACAgIAAxkBAAIBC2gv-SAuPOEcnFEig8BLVDpaWI9fAALIZwACixOBSVH-zhnaHBpaNgQ"
      ),
      new SendVideoAction(
        ["дичь", "втираешь"],
        "BAACAgIAAxkBAAIBDWgv-VZYWP_RSfGYY6ymGRYukYeSAALKZwACixOBSX1CLj_hljPHNgQ"
      ),
      new SendVideoAction(
        ["кто", "нахуй", "на хуй"],
        "BAACAgIAAxkBAAIBD2gv-XI9UQ7544rHJWvSAnJnD7GZAALLZwACixOBSSD2T7oR56FFNgQ"
      ),
      new SendVideoAction(
        ["охуел"],
        "BAACAgIAAxkBAAIBEWgv-aVY9cXJOqyWfjfe2pbQ_QzRAALPZwACixOBScbBT66doBU3NgQ"
      ),
      new SendVideoAction(
        ["заявление"],
        "BAACAgIAAxkBAAIBE2gv-cKlabkEuX3M3QWY1MwrEl9wAALSZwACixOBSbmrwzeUeXMJNgQ"
      ),
      new SendVideoAction(
        ["охуенно", "офигенно", "офигеть"],
        "BAACAgIAAxkBAAIBFWgv-eT10nj6S3K-cIy60f3FSWTPAALTZwACixOBSf9RGbuIfEQqNgQ"
      ),
      new SendVideoAction(
        ["ха-ха"],
        "BAACAgIAAxkBAAIBF2gv-gxOQPW1AevocTcwk6qSaGzBAALVZwACixOBSScBgrjrsLuXNgQ"
      ),
      new SendVideoAction(
        ["перепутал"],
        "BAACAgIAAxkBAAIBGWgv-irrE5z5eiDCB1r41S8WiogDAAL2ZwAClnuASaiAo5VHbj7iNgQ"
      ),
      new SendVideoAction(
        ["гениальн", "шедевр"],
        "BAACAgIAAxkBAAIBG2gv-kMf29yOmqkoqQKzy2c_uC6SAALYZwACixOBSWfvFetRO4NINgQ"
      ),
      new SendVideoAction(
        ["беги"],
        "BAACAgIAAxkBAAIBHWgv-mMiuYrOclXKCyR275-QafmiAALZZwACixOBSU793mlogrcpNgQ"
      ),
      new SendVideoAction(
        ["несешь", "несёшь"],
        "BAACAgIAAxkBAAIBH2gv-ot4M6Oyr8q8bsxPCKnCqm-AAALaZwACixOBSalWWcZ6UqIoNgQ"
      ),
      new SendVideoAction(
        ["не точно"],
        "BAACAgIAAxkBAAIBIWgv-rAOg4ocG7i88rUBmnrUhV9NAALbZwACixOBSajnsg5vMmQwNgQ"
      ),
      new SendVideoAction(
        ["дерьм"],
        "BAACAgIAAxkBAAIBI2gv-uCobaySamNlP2Lod28ofb3GAALdZwACixOBSY-h8oZEswKENgQ"
      ),
      new SendVideoAction(
        ["происходи"],
        "BAACAgIAAxkBAAIBKmgv-19U5P8wWUe6sM4jCRTioam-AALfZwACixOBSS1Cr_qvJnjxNgQ"
      ),
      new SendVideoAction(
        ["шутил", "шутка"],
        "BAACAgIAAxkBAAIBLGgv-32Rs8gRzsjHEmyRmyBk4JVhAALhZwACixOBSUFtkesibdxFNgQ"
      ),
      new SendVideoAction(
        ["с ума", "сумасшед"],
        "BAACAgIAAxkBAAIBLmgv-6I5Zh9m3ir4Ll1OgVbtE4IcAALiZwACixOBSUVOV1byj4yGNgQ"
      ),
      new SendVideoAction(
        ["хорошен"],
        "BAACAgIAAxkBAAIBMGgv-9IpKMhBiBaQFNW1q3bMnRr4AALjZwACixOBSdr5gqfbyD5gNgQ"
      ),
      new SendVideoAction(
        ["что такое"],
        "BAACAgIAAxkBAAIBMmgv-_Y0kduxstpyiSPkgWvwaEdKAALkZwACixOBSegzmNp7Z0psNgQ"
      ),
      new SendVideoAction(
        ["полномочия", "окончены"],
        "BAACAgIAAxkBAAIBNGgv_BiOahFhF2dC46WuijibMQMEAALmZwACixOBSXjrW2IU3R2WNgQ"
      ),
      new SendVideoAction(
        ["жостка", "жеска", "жоска", "жестка"],
        "BAACAgIAAxkBAAIBNmgv_DtYkvOSvtasqqDiNGM1Vf0FAALnZwACixOBSV13B2B-oW0KNgQ"
      ),
      new SendVideoAction(
        ["не нужн"],
        "BAACAgIAAxkBAAIBOGgv_GvmB3pyvJtxU0JG00qyC7XRAALrZwACixOBSTWEvDpPvYRZNgQ"
      ),
      new SendVideoAction(
        ["не понимаю"],
        "BAACAgIAAxkBAAIBOmgv_JQCCi-fnztF8MmbLbq55kbvAALuZwACixOBSaaAPFT8Jal0NgQ"
      ),
      new SendVideoAction(
        ["нет слов"],
        "BAACAgIAAxkBAAIBPGgv_Lc9aPVLxqvf9L535zSqA3vMAAIeaAAClnuASY3EzR8JWzsvNgQ"
      ),
      new SendVideoAction(
        ["ловко", "придумал", "не понял"],
        "BAACAgIAAxkBAAIBPmgv_Ns7TGfU11fd9Q-zHEeyzT7uAALyZwACixOBSWBpJsKP2eldNgQ"
      ),
      new SendVideoAction(
        ["спори"],
        "BAACAgIAAxkBAAIBQGgv_QABGsyPgLAAAVYqT73tC36oMbcAAvRnAAKLE4FJ9MVCFhIDRj02BA"
      ),
      new SendVideoAction(
        ["психушку", "угара", "угора", "сумасшед"],
        "BAACAgIAAxkBAAIBQmgv_Stj-ai_5g-hntz4Avx9WZNzAAL1ZwACixOBSTpm8U89BuF9NgQ"
      ),
      new SendVideoAction(
        ["повар", "повор"],
        "BAACAgIAAxkBAAIBRGgv_W3g-fK88N2SkPKigx_rmFh1AAL6ZwACixOBSdBMHGJ-8k4LNgQ"
      ),
      new SendVideoAction(
        ["идея"],
        "BAACAgIAAxkBAAIBRmgv_Z0faQyOfn2UzQ9huvfp70hLAAL_ZwACixOBSSDTLT_LQIDBNgQ"
      ),
      new SendVideoAction(
        ["во-первых", "список"],
        "BAACAgIAAxkBAAIBSGgv_d137zjFCgZDBSnR7fp9-OAkAAIEaAACixOBSdES_QE-MPNcNgQ"
      ),
      new SendVideoAction(
        ["вставай", "ержан", "работ"],
        "BAACAgIAAxkBAAIBSmgv_gaJDlEXzwzzPG0U-ikaYoUDAAIFaAACixOBSUfGqG7c1cAcNgQ"
      ),
      new SendVideoAction(
        ["смешно", "понял", "росси"],
        "BAACAgIAAxkBAAIBTGgv_jGVcGFNiel4-x40V64jUO1sAAIHaAACixOBSV82YMGz1jmoNgQ"
      ),
      new SendVideoAction(
        ["пидор", "пидар"],
        "BAACAgIAAxkBAAIBTmgwAsD198DWjMnH85DPF8TQuzbIAAJJaAACixOBSQpSvoIHP_vfNgQ"
      ),
      new SendVideoAction(
        ["улыб", "негр"],
        "BAACAgIAAxkBAAIBUGgwAvcZP75lWDEwVKY6TCnY72NoAAJPaAACixOBScswnnvzZF68NgQ"
      ),
      new SendVideoAction(
        ["нормально"],
        "BAACAgIAAxkBAAIBUmgwAxORbn0ty08q6YKoRtnfNP1FAAJTaAACixOBSRt2m1xkl1-VNgQ"
      ),
      new SendVideoAction(
        ["шутка"],
        "BAACAgIAAxkBAAIBVGgwAzhauRBVylGHO6-zqrcMNcqhAAJXaAACixOBSdjiEYnX4tlzNgQ"
      ),
      new SendVideoAction(
        ["заебал"],
        "BAACAgIAAxkBAAIBVmgwBCRNUQaK55_sOMOWWond-rakAAJvaAACixOBSWFZNxE-_merNgQ"
      ),
      new SendVideoAction(
        ["бомбит"],
        "BAACAgIAAxkBAAIBWGgwBFa6pYZOaR0cdJQScDz1RX1fAAJ1aAACixOBSV-BzhTXhsGVNgQ"
      ),
      new SendVideoAction(
        ["совпадение"],
        "BAACAgIAAxkBAAIBWmgwBHhTfilYjo-fiJ6lfOumE6uOAAJ2aAACixOBScJ4VWnKXtxmNgQ"
      ),
      new SendVideoAction(
        ["преми", "гениа"],
        "BAACAgIAAxkBAAIBXGgwBKgatceZYTZII5_FWY886pRQAAJ_aAACixOBScGyqz7CPBrNNgQ"
      ),
      new SendVideoAction(
        ["смекаешь"],
        "BAACAgIAAxkBAAIBXmgwBMmQmHY8he_lrYWXIZNbC3BEAAKDaAACixOBSagBi6AmU2LMNgQ"
      ),
      new SendVideoAction(
        ["печаль"],
        "BAACAgIAAxkBAAIBYGgwBOT8VMrYLXzZ4zJ3XTjoDqxlAAKIaAACixOBSRjanOBM7OtiNgQ"
      ),
      new SendVideoAction(
        ["представл", "вообра"],
        "BAACAgIAAxkBAAIBYmgwBQE1eN-GLhi9uS5ow3xXTKzxAAKNaAACixOBSUJ-0FG0Czy9NgQ"
      ),
      new SendVideoAction(
        ["пиздец", "нахуй", "блять", "блядь"],
        "BAACAgIAAxkBAAIBZGgwBSeitZNkQ9WyRMNzw9dwNri3AAKQaAACixOBSQFsSnci9ZhcNgQ"
      ),
      new SendVideoAction(
        ["дима", "димон", "диму", "диме", /дим(о)+н/g],
        "BAACAgIAAxkBAAIBZmgwBWBU1irPNJnxmSMdxxneMkDMAAKVaAACixOBSXTdAAFJ6i0RUDYE"
      ),
      new SendVideoAction(
        ["вкус"],
        "BAACAgIAAxkBAAIBaGgwBdPgOePB9PPcIwdsQjKPOdhOAAKfaAACixOBSX9dDJb4OfZtNgQ"
      ),
      new SendVideoAction(
        ["аааа"],
        "BAACAgIAAxkBAAIBamgwBf9tZ1g2paoS96JGzQugviDjAAKkaAACixOBSXnMI5D7nbo6NgQ"
      ),
      new SendVideoAction(
        ["похуй", "похую", "чувствую"],
        "BAACAgIAAxkBAAIBbGgwBibbiEnwUvnZFwywT3zyqfLpAAKnaAACixOBSYi2CWnNwEh_NgQ"
      ),
      new SendVideoAction(
        ["погнали"],
        "BAACAgIAAxkBAAIBbmgwBlG_nIkEuV6JOdAsgtz40DRAAAKqaAACixOBSTeo-UtBU-EmNgQ"
      ),
      new SendVideoAction(
        ["ужас"],
        "BAACAgIAAxkBAAIBcGgwBo_mFRpGNJCZ2bqXbl6qAjEbAAKRaAAClnuASWB_g1bTppkINgQ"
      ),
      new SendVideoAction(
        ["хах"],
        "BAACAgIAAxkBAAIBcmgwBq6TmFbuyOKOgFXqDOL4e7kOAAKuaAACixOBSZ332B6rWiVSNgQ"
      ),
      new SendVideoAction(
        ["ммм", "хуета", "хуита"],
        "BAACAgIAAxkBAAIBdGgwBtos4ApiKREhR0r8PU6Qh1cHAAKyaAACixOBSbvNfs1hEcTCNgQ"
      ),
      new SendVideoAction(
        ["дебил", "дибил", "ооой"],
        "BAACAgIAAxkBAAIBdmgwBxJ21pJAic1t12Y-N2R10_2XAAK2aAACixOBSYrmNg4TAXFrNgQ"
      ),
      new SendVideoAction(
        ["кто ты", "гений", "плейбой", "филантроп", "миллиа"],
        "BAACAgIAAxkBAAIBeGgwBzfwW0IsvzFzP1fqhHw7jCUpAAK4aAACixOBSYUgOiWiuk6HNgQ"
      ),
      new SendVideoAction(
        ["как так"],
        "BAACAgIAAxkBAAIBemgwB2-2htHmBdXRr0TWA5kgrbi9AAK6aAACixOBSTVu6Sn4T8KaNgQ"
      ),
      new SendVideoAction(
        ["погнали"],
        "BAACAgIAAxkBAAIBfGgwB5UZohakYmVCFCTnxbb2GtwEAAK8aAACixOBSaJj_G719pyVNgQ"
      ),
      new SendVideoAction(
        ["не говори"],
        "BAACAgIAAxkBAAIBfmgwB8PFj6SQEL0G0VlToGITR9SQAAK-aAACixOBSbg72YHjBdC_NgQ"
      ),
      new SendVideoAction(
        ["фейспалм", "кринж", "стыд"],
        "BAACAgIAAxkBAAIBgGgwB9ztrL1qv9Ug0p2tjpE4AAFk3QACv2gAAosTgUkvGJoOKaTNRzYE"
      ),
      new SendVideoAction(
        ["а не я", "почему"],
        "BAACAgIAAxkBAAIBgmgwCAOQPGDFiFhC8boBbNma5g12AALBaAACixOBSczhRH9CipzDNgQ"
      ),
    ];
  }

  getAction(text: string): KeywordAction | null {
    const lowered = text.toLowerCase();

    const matches = this.actions.filter((action) =>
      action.patterns.some((pattern) => {
        // Если у шаблона есть флаг g (или y), сбросим указатель
        if (pattern.global || pattern.sticky) {
          pattern.lastIndex = 0;
        }
        return pattern.test(lowered);
      })
    );

    if (matches.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * matches.length);
    return matches[randomIndex];
  }
}
