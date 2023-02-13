import * as speechcons from "./speechcons";
import * as phonemes from "./phonemes";
import { LangLocale, LocaleForVoice } from "./voices";
import { Default, LangOrDefault, VoiceNamesOrDefault } from "./ssmlBuilder";

export type Emotion = "excited" | "disappointed";
export type EmotionIntensity = "low" | "medium" | "high";

export enum WordRole {
  Verb = "amazon:VB",
  PastParticiple = "amazon:VBD",
  Noun = "amazon:NN",
  NonDefaultSense = "amazon:SENSE_1",
}

//#region sayAs
export type SayAsDateFormat =
  | "mdy"
  | "dmy"
  | "ymd"
  | "md"
  | "dm"
  | "ym"
  | "my"
  | "d"
  | "m"
  | "y";

// #region SayAsInterjection
const langSpeechcons = {
  "ja-JP": speechcons.japanese_jpSpeechcons,
  "de-DE": speechcons.german_deSpeechcons,
  "en-AU": speechcons.english_auSpeechcons,
  "en-CA": speechcons.english_caSpeechcons,
  "en-GB": speechcons.english_ukSpeechcons,
  "en-IN": speechcons.english_inSpeechcons,
  "en-US": speechcons.english_usSpeechcons,
  "es-ES": speechcons.spanish_esSpeechcons,
  "es-MX": speechcons.spanish_mxSpeechcons,
  "es-US": speechcons.spanish_usSpeechcons,
  "fr-CA": speechcons.french_caSpeechcons,
  "fr-FR": speechcons.french_frSpeechcons,
  "hi-IN": speechcons.hindi_inSpeechcons,
  "it-IT": speechcons.italian_itSpeechcons,
  "pt-BR": speechcons.portugese_brSpeechcons,
} satisfies Record<LangLocale, Readonly<string[]>>;

type LanguageSpeechcons = typeof langSpeechcons;

export type AllSpeechcons =
  LanguageSpeechcons[keyof LanguageSpeechcons][number];

export type LanguageSpeechcon<
  TSkillLocale extends LangLocale,
  TVoice extends VoiceNamesOrDefault,
  TLang extends LangOrDefault
> = LanguageSpeechcons[LocaleFromLangVoiceOrSkillLocale<
  TSkillLocale,
  TVoice,
  TLang
>][number];
//#endregion

// #endregion

// #region phonemes

const ipaLangaugePhonemes = {
  "de-DE": phonemes.dede1IPAPhonemes,
  "en-AU": phonemes.enau1IPAPhonemes,
  "en-CA": phonemes.enca1IPAPhonemes,
  "en-GB": phonemes.engb1IPAPhonemes,
  "en-IN": phonemes.enin1IPAPhonemes,
  "en-US": phonemes.enus1IPAPhonemes,
  "es-ES": [],
  "es-MX": [],
  "es-US": [],
  "fr-CA": phonemes.frca1IPAPhonemes,
  "fr-FR": phonemes.frfr1IPAPhonemes,
  "hi-IN": phonemes.hiin1IPAPhonemes,
  "it-IT": phonemes.itit1IPAPhonemes,
  "ja-JP": phonemes.jajp1IPAPhonemes,
  "pt-BR": phonemes.ptbr1IPAPhonemes,
} satisfies Record<LangLocale, Readonly<string[]>>;

type IpaLanguagePhonemes = typeof ipaLangaugePhonemes;
export type IpaPhonemes =
  IpaLanguagePhonemes[keyof IpaLanguagePhonemes][number];

const xSampaLangaugePhonemes = {
  "de-DE": phonemes.dede1XSampaPhonemes,
  "en-AU": phonemes.enau1XSampaPhonemes,
  "en-CA": phonemes.enca1XSampaPhonemes,
  "en-GB": phonemes.engb1XSampaPhonemes,
  "en-IN": phonemes.enin1XSampaPhonemes,
  "en-US": phonemes.enus1XSampaPhonemes,
  "es-ES": [],
  "es-MX": [],
  "es-US": [],
  "fr-CA": phonemes.frca1XSampaPhonemes,
  "fr-FR": phonemes.frfr1XSampaPhonemes,
  "hi-IN": phonemes.hiin1XSampaPhonemes,
  "it-IT": phonemes.itit1XSampaPhonemes,
  "ja-JP": phonemes.jajp1XSampaPhonemes,
  "pt-BR": phonemes.ptbr1XSampaPhonemes,
} satisfies Record<LangLocale, Readonly<string[]>>;
type XSampaLanguagePhonemes = typeof xSampaLangaugePhonemes;
export type XSampaPhonemes =
  XSampaLanguagePhonemes[keyof XSampaLanguagePhonemes][number];

// issue with Aditi representing two locales ? should be muti-lingual - todo later use TLocale to reduce
type LocaleFromLangVoiceOrSkillLocale<
  TSkillLocale extends LangLocale,
  TVoice extends VoiceNamesOrDefault,
  TLang extends LangOrDefault
> = TLang extends Default
  ? TVoice extends Default
    ? Exclude<TSkillLocale, Default> // use the skill locale
    : LocaleForVoice<Exclude<TVoice, Default>> // find the language for the voice - should VoiceLocales be mapped to an object that can be keyed ?
  : Exclude<TLang, Default>; // if lang been specified then use it

export type IpaLangPhoneme<
  TSkillLocale extends LangLocale,
  TVoice extends VoiceNamesOrDefault,
  TLang extends LangOrDefault
> = IpaLanguagePhonemes[LocaleFromLangVoiceOrSkillLocale<
  TSkillLocale,
  TVoice,
  TLang
>][number];

export type XSampaLangPhoneme<
  TSkillLocale extends LangLocale,
  TVoice extends VoiceNamesOrDefault,
  TLang extends LangOrDefault
> = XSampaLanguagePhonemes[LocaleFromLangVoiceOrSkillLocale<
  TSkillLocale,
  TVoice,
  TLang
>][number];

//#endregion

// should omit equivalent values ?
export type BreakStrength =
  | "none"
  | "x-weak"
  | "weak"
  | "medium" /*default*/
  | "strong"
  | "x-strong";

export type EmphasisLevel = "strong" | "moderate" | "reduced";

//#region Prosody
export type ProsodyPredefinedRate =
  | "x-slow"
  | "slow"
  | "medium"
  | "fast"
  | "x-fast";
export type ProsodyPredefinedPitch =
  | "x-low"
  | "low"
  | "medium"
  | "high"
  | "x-high";
export type ProsodyPredefinedVolume =
  | "silent"
  | "x-soft"
  | "medium"
  | "loud"
  | "x-loud";

export type Percentage = number;
export type Db = number;

export type ProsodyRate = ProsodyPredefinedRate | Percentage;
export type ProsodyVolume = ProsodyPredefinedVolume | Db;
export type ProsodyPitch = ProsodyPredefinedPitch | Percentage;

//#endregion

// console get an error with bad source instead of a fallback
export interface SoundbankSound {
  duration: number;
  soundbankUrl: string;
}
