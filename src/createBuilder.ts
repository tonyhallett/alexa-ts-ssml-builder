import { RestrictedBuilder } from "./restrictedBuilder";
import { AllBuilderMethods, Default, LangOrDefault, SSMLBuilder, VoiceNamesOrDefault } from "./ssmlBuilder";
import { ConversationalBuilderMethods, EmotionBuilderMethods, EmphasisBuilderMethods, FunBuilderMethods, LangBuilderMethods, LongFormBuilderMethods, MusicBuilderMethods, NewsBuilderMethods, ParagraphBuilderMethods, ProsodyPitchBuilderMethods, ProsodySafeBuilderMethods, SentenceBuilderMethods, VoiceBuilderMethods, WhisperBuilderMethods, WordBuilderMethods } from "./ssmlBuilder-config";
import { Emotion, EmotionIntensity, BreakStrength, WordRole, SoundbankSound, EmphasisLevel, ProsodyRate, ProsodyVolume, ProsodyPitch, SayAsDateFormat, AllSpeechcons, IpaPhonemes, XSampaPhonemes } from "./ssmlTypes";
import { TextOrBuilderCallback } from "./textOrBuilderCallback";
import { AllVoiceNames, LangLocale } from "./voices";

export type RootBuilder<TSkillLocale extends LangLocale> 
=  RestrictedBuilder<
    AllBuilderMethods,
    TSkillLocale,
    Default,
    Default,
    Default,
    "Build"
>




// implement when finished
 class AlexaSSMLBuilder implements SSMLBuilder<
    LangLocale,
    VoiceNamesOrDefault,
    LangOrDefault, 
    "default",
    AlexaSSMLBuilder
>{
     text(text: string): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     voice<TNewVoice extends AllVoiceNames>(name: TNewVoice, textOrCallback: TextOrBuilderCallback<VoiceBuilderMethods, LangLocale, TNewVoice, LangOrDefault,"default">): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     voiceFromSkillLocale<TNewVoice extends AllVoiceNames>(name: TNewVoice, textOrCallback: TextOrBuilderCallback<VoiceBuilderMethods, LangLocale, TNewVoice, LangOrDefault,"default">): AlexaSSMLBuilder {
         if(typeof textOrCallback === "string"){

         }else{
            textOrCallback(this as any);
         }
         return this;
     }
     lang<TNewLang extends LangLocale>(locale: TNewLang, textOrCallback: TextOrBuilderCallback<LangBuilderMethods, LangLocale, VoiceNamesOrDefault, TNewLang,"default">): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     fun(textOrCallback: TextOrBuilderCallback<FunBuilderMethods, LangLocale, VoiceNamesOrDefault, LangOrDefault,"default">): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     conversational(textOrCallback: TextOrBuilderCallback<ConversationalBuilderMethods, LangLocale, VoiceNamesOrDefault, LangOrDefault,"default">): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     longForm(textOrCallback: TextOrBuilderCallback<LongFormBuilderMethods, LangLocale, VoiceNamesOrDefault, LangOrDefault,"default">): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     music(textOrCallback: TextOrBuilderCallback<MusicBuilderMethods, LangLocale, VoiceNamesOrDefault, LangOrDefault,"default">): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     news(textOrCallback: TextOrBuilderCallback<NewsBuilderMethods, LangLocale, VoiceNamesOrDefault, LangOrDefault,"default">): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     emotion(name: Emotion, intensity: EmotionIntensity, textOrCallback: TextOrBuilderCallback<EmotionBuilderMethods, LangLocale, VoiceNamesOrDefault, LangOrDefault,"default">): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     whisper(textOrCallback: TextOrBuilderCallback<WhisperBuilderMethods, LangLocale, VoiceNamesOrDefault, LangOrDefault,"default">): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     break(strength?: BreakStrength | undefined, milliseconds?: number | undefined): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     paragraph(textOrCallback: TextOrBuilderCallback<ParagraphBuilderMethods, LangLocale, VoiceNamesOrDefault, LangOrDefault,"default">): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     sentence(textOrCallback: TextOrBuilderCallback<SentenceBuilderMethods, LangLocale, VoiceNamesOrDefault, LangOrDefault,"default">): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     word(role: WordRole, textOrCallback: TextOrBuilderCallback<WordBuilderMethods, LangLocale, VoiceNamesOrDefault, LangOrDefault,"default">): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     sub(alias: string, aliased: string): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     audio(src: string): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     audioSoundbank(soundBankSound: SoundbankSound): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     emphasis(level: EmphasisLevel, textOrCallback: TextOrBuilderCallback<EmphasisBuilderMethods, LangLocale, VoiceNamesOrDefault, LangOrDefault,"default">): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     emphasisDefault(textOrCallback: TextOrBuilderCallback<EmphasisBuilderMethods, LangLocale, VoiceNamesOrDefault, LangOrDefault,"default">): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     prosodyRate(rate: ProsodyRate, textOrCallback: TextOrBuilderCallback<ProsodySafeBuilderMethods, LangLocale, VoiceNamesOrDefault, LangOrDefault,"default">): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     prosodyVolume(volume: ProsodyVolume, textOrCallback: TextOrBuilderCallback<ProsodySafeBuilderMethods, LangLocale, VoiceNamesOrDefault, LangOrDefault,"default">): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     prosodyRateVolume(rate: ProsodyRate, volume: ProsodyVolume, textOrCallback: TextOrBuilderCallback<ProsodySafeBuilderMethods, LangLocale, VoiceNamesOrDefault, LangOrDefault,"default">): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     prosodyPitch(pitch: ProsodyPitch, textOrCallback: TextOrBuilderCallback<ProsodyPitchBuilderMethods, LangLocale, VoiceNamesOrDefault, LangOrDefault,"default">): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     prosodyPitchAndRate(pitch: ProsodyPitch, rate: ProsodyRate, textOrCallback: TextOrBuilderCallback<ProsodyPitchBuilderMethods, LangLocale, VoiceNamesOrDefault, LangOrDefault,"default">): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     prosodyPitchRateVolume(pitch: ProsodyPitch, rate: ProsodyRate, volume: ProsodyVolume, textOrCallback: TextOrBuilderCallback<ProsodyPitchBuilderMethods, LangLocale, VoiceNamesOrDefault, LangOrDefault,"default">): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     phonemeIPA(phonetic: string, text?: string | undefined): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     phonemeXSampa(phonetic: string, text?: string | undefined): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     phonemeAnyLanguageIPA(...phonemes:IpaPhonemes[]): AlexaSSMLBuilder {
        throw new Error("Method not implemented.");
     }
     phonemeAnyLanguageXSampa(...phonemes:XSampaPhonemes[]): AlexaSSMLBuilder {
        throw new Error("Method not implemented.");
     }
     phonemeLanguageIPA(...phonemes: IpaPhonemes[]): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     phonemeLanguageXSampa(...phonemes: XSampaPhonemes[]): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     sayAsExpletive(text: string): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     sayAsAddress(text: string): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     sayAsTelephone(text: string): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     sayAsTime(text: string): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     sayAsUnit(text: string): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     sayAsFraction(text: string): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     sayAsDigits(text: string): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     sayAsOrdinal(text: string): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     sayAsCardinal(text: string): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     sayAsCharacters(text: string): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     sayAsDate(text: string, format: SayAsDateFormat): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
     sayAsInterjection<TSpeechcon extends AllSpeechcons>(speechcon: TSpeechcon, suffix?: string | undefined): AlexaSSMLBuilder {
         throw new Error("Method not implemented.");
     }
    
}

export function createBuilder<TSkillLocale extends LangLocale>() : RootBuilder<TSkillLocale>{
    return new AlexaSSMLBuilder() as unknown as RootBuilder<TSkillLocale>
}