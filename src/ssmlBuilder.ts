import { LangLocale, VoicesInLocale, AllVoiceNames } from "./voices";
import {
  BreakStrength,
  Emotion,
  EmotionIntensity,
  EmphasisLevel,
  IpaLangPhoneme,
  IpaPhonemes,
  LanguageSpeechcon,
  ProsodyPitch,
  ProsodyRate,
  ProsodyVolume,
  SayAsDateFormat,
  SoundbankSound,
  WordRole,
  XSampaLangPhoneme,
  XSampaPhonemes,
} from "./ssmlTypes";
import {
  FunBuilderMethods,
  ConversationalBuilderMethods,
  LongFormBuilderMethods,
  MusicBuilderMethods,
  NewsBuilderMethods,
  EmotionBuilderMethods,
  WhisperBuilderMethods,
  ParagraphBuilderMethods,
  SentenceBuilderMethods,
  WordBuilderMethods,
  EmphasisBuilderMethods,
  ProsodySafeBuilderMethods,
  ProsodyPitchBuilderMethods,
  VoiceBuilderMethods,
  LangBuilderMethods,
} from "./ssmlBuilder-config";
import { TextOrBuilderCallback } from "./textOrBuilderCallback";
import { Restrictions } from "./treeRestrictions";

export type Default = "default";

export type VoiceNamesOrDefault = AllVoiceNames | Default;
export type LangOrDefault = LangLocale | Default;

type AddRestriction<
  TRestrictions extends Restrictions,
  TNewRestrictions extends Restrictions
> = TRestrictions extends "default"
  ? TNewRestrictions
  : TRestrictions | TNewRestrictions;

export interface SSMLBuilder<
  TSkillLocale extends LangLocale,
  TVoice extends VoiceNamesOrDefault = Default,
  TLang extends LangOrDefault = Default,
  TRestrictions extends Restrictions = Default,
  TReturn = {}
> {
  text(text: string): TReturn;

  voice<TNewVoice extends AllVoiceNames>(
    name: TNewVoice,
    textOrCallback: TextOrBuilderCallback<
      VoiceBuilderMethods,
      TSkillLocale,
      TNewVoice,
      TLang,
      AddRestriction<TRestrictions, "voice">
    >
  ): TReturn;
  voiceFromSkillLocale<TNewVoice extends VoicesInLocale<TSkillLocale>>(
    name: TNewVoice,
    textOrCallback: TextOrBuilderCallback<
      VoiceBuilderMethods,
      TSkillLocale,
      TNewVoice,
      TLang,
      AddRestriction<TRestrictions, "voice">
    >
  ): TReturn;
  lang<TNewLang extends LangLocale>(
    locale: TNewLang,
    textOrCallback: TextOrBuilderCallback<
      LangBuilderMethods,
      TSkillLocale,
      TVoice,
      TNewLang,
      TRestrictions
    >
  ): TReturn;

  //#region amazon
  //#region domain - may prefix with domain
  fun(
    textOrCallback: TextOrBuilderCallback<
      FunBuilderMethods,
      TSkillLocale,
      TVoice,
      TLang,
      AddRestriction<TRestrictions, "domain">
    >
  ): TReturn;
  conversational(
    textOrCallback: TextOrBuilderCallback<
      ConversationalBuilderMethods,
      TSkillLocale,
      TVoice,
      TLang,
      AddRestriction<TRestrictions, "domain">
    >
  ): TReturn;
  longForm(
    textOrCallback: TextOrBuilderCallback<
      LongFormBuilderMethods,
      TSkillLocale,
      TVoice,
      TLang,
      AddRestriction<TRestrictions, "domain">
    >
  ): TReturn;
  music(
    textOrCallback: TextOrBuilderCallback<
      MusicBuilderMethods,
      TSkillLocale,
      TVoice,
      TLang,
      AddRestriction<TRestrictions, "domain">
    >
  ): TReturn;
  news(
    textOrCallback: TextOrBuilderCallback<
      NewsBuilderMethods,
      TSkillLocale,
      TVoice,
      TLang,
      AddRestriction<TRestrictions, "domain">
    >
  ): TReturn;
  //#endregion
  emotion(
    name: Emotion,
    intensity: EmotionIntensity,
    textOrCallback: TextOrBuilderCallback<
      EmotionBuilderMethods,
      TSkillLocale,
      TVoice,
      TLang,
      AddRestriction<TRestrictions, "emotion">
    >
  ): TReturn;
  whisper(
    textOrCallback: TextOrBuilderCallback<
      WhisperBuilderMethods,
      TSkillLocale,
      TVoice,
      TLang,
      TRestrictions
    >
  ): TReturn;
  //#endregion
  break(strengthOrMs?: BreakStrength | number): TReturn;
  paragraph(
    textOrCallback: TextOrBuilderCallback<
      ParagraphBuilderMethods,
      TSkillLocale,
      TVoice,
      TLang,
      TRestrictions
    >
  ): TReturn;
  sentence(
    textOrCallback: TextOrBuilderCallback<
      SentenceBuilderMethods,
      TSkillLocale,
      TVoice,
      TLang,
      TRestrictions
    >
  ): TReturn;

  word(
    role: WordRole,
    textOrCallback: TextOrBuilderCallback<
      WordBuilderMethods,
      TSkillLocale,
      TVoice,
      TLang,
      TRestrictions
    >
  ): TReturn;

  sub(alias: string, aliased: string): TReturn;

  //#region audio
  audio(src: string): TReturn;
  audioSoundbank(soundBankSound: SoundbankSound): TReturn;
  //#endregion

  //#region emphasis
  emphasis(
    level: EmphasisLevel,
    textOrCallback: TextOrBuilderCallback<
      EmphasisBuilderMethods,
      TSkillLocale,
      TVoice,
      TLang,
      AddRestriction<TRestrictions, "emphasis">
    >
  ): TReturn;
  emphasisDefault(
    textOrCallback: TextOrBuilderCallback<
      EmphasisBuilderMethods,
      TSkillLocale,
      TVoice,
      TLang,
      AddRestriction<TRestrictions, "emphasis">
    >
  ): TReturn;
  //#endregion

  //#region prosody
  // percentage minimum is 20%
  prosodyRate(
    rate: ProsodyRate,
    textOrCallback: TextOrBuilderCallback<
      ProsodySafeBuilderMethods,
      TSkillLocale,
      TVoice,
      TLang,
      TRestrictions
    >
  ): TReturn;
  // db - The maximum positive value is about +4.08dB.
  prosodyVolume(
    volume: ProsodyVolume,
    textOrCallback: TextOrBuilderCallback<
      ProsodySafeBuilderMethods,
      TSkillLocale,
      TVoice,
      TLang,
      TRestrictions
    >
  ): TReturn;
  prosodyRateVolume(
    rate: ProsodyRate,
    volume: ProsodyVolume,
    textOrCallback: TextOrBuilderCallback<
      ProsodySafeBuilderMethods,
      TSkillLocale,
      TVoice,
      TLang,
      TRestrictions
    >
  ): TReturn;
  // max +50%, smallest -33.3 ( no exception just capped)
  prosodyPitch(
    pitch: ProsodyPitch,
    textOrCallback: TextOrBuilderCallback<
      ProsodyPitchBuilderMethods,
      TSkillLocale,
      TVoice,
      TLang,
      AddRestriction<TRestrictions, "prosodyPitch">
    >
  ): TReturn;
  prosodyPitchAndRate(
    pitch: ProsodyPitch,
    rate: ProsodyRate,
    textOrCallback: TextOrBuilderCallback<
      ProsodyPitchBuilderMethods,
      TSkillLocale,
      TVoice,
      TLang,
      AddRestriction<TRestrictions, "prosodyPitch">
    >
  ): TReturn;
  prosodyPitchAndVolume(
    pitch: ProsodyPitch,
    volume: ProsodyVolume,
    textOrCallback: TextOrBuilderCallback<
      ProsodyPitchBuilderMethods,
      TSkillLocale,
      TVoice,
      TLang,
      AddRestriction<TRestrictions, "prosodyPitch">
    >
  ): TReturn;
  prosodyPitchRateVolume(
    pitch: ProsodyPitch,
    rate: ProsodyRate,
    volume: ProsodyVolume,
    textOrCallback: TextOrBuilderCallback<
      ProsodyPitchBuilderMethods,
      TSkillLocale,
      TVoice,
      TLang,
      AddRestriction<TRestrictions, "prosodyPitch">
    >
  ): TReturn;
  //#endregion

  //#region phoneme
  phonemeIPA(phonetic: string, text?: string): TReturn;
  phonemeXSampa(phonetic: string, text?: string): TReturn;
  phonemeAnyLanguageIPA(text:string,...phonemes: IpaPhonemes[]): TReturn;
  phonemeAnyLanguageXSampa(text:string,...phonemes: XSampaPhonemes[]): TReturn;
  phonemeLanguageIPA(
    text:string,
    ...phonemes: IpaLangPhoneme<TSkillLocale, TVoice, TLang>[]
  ): TReturn;
  phonemeLanguageXSampa(
    text:string,
    ...phonemes: XSampaLangPhoneme<TSkillLocale, TVoice, TLang>[]
  ): TReturn;
  //#endregion

  //#region sayAs
  sayAsExpletive(text: string): TReturn;
  sayAsAddress(text: string): TReturn;
  sayAsTelephone(text: string): TReturn;
  sayAsTime(text: string): TReturn;
  sayAsUnit(text: string): TReturn;
  sayAsFraction(text: string): TReturn;
  sayAsDigits(text: string): TReturn;
  sayAsOrdinal(text: string): TReturn;
  sayAsCardinal(text: string): TReturn;
  sayAsCharacters(text: string): TReturn;

  sayAsDate(text: string, format: SayAsDateFormat): TReturn;

  sayAsInterjection<
    TSpeechcon extends LanguageSpeechcon<TSkillLocale, TVoice, TLang>
  >(
    speechcon: TSpeechcon,
    suffix?: string
  ): TReturn;
  //#endregion
}
export type AllBuilderMethods = keyof SSMLBuilder<"en-GB">;