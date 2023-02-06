import { ExcludeDependentMethodExclusions } from "./domainRestrictions"
import { VoiceNamesOrDefault, Default, LangOrDefault } from "./ssmlBuilder"
import { VoiceBuilderMethods, LangBuilderMethods, FunBuilderMethods, ConversationalBuilderMethods, LongFormBuilderMethods, MusicBuilderMethods, NewsBuilderMethods, EmotionBuilderMethods, WhisperBuilderMethods, ParagraphBuilderMethods, SentenceBuilderMethods, WordBuilderMethods, EmphasisBuilderMethods, ProsodySafeBuilderMethods, ProsodyPitchBuilderMethods } from "./ssmlBuilder-config"
import { Emotion, EmotionIntensity, BreakStrength, WordRole, SoundbankSound, EmphasisLevel, ProsodyRate, ProsodyVolume, ProsodyPitch, IpaPhonemes, XSampaPhonemes, IpaLangPhoneme, XSampaLangPhoneme, SayAsDateFormat, LanguageSpeechcon } from "./ssmlTypes"
import { LangLocale, AllVoiceNames, VoicesInLocale } from "./voices"

type BuilderLevel =  "Build" | "NoBuild"


type AddBuild<T,TBuilderLevel extends BuilderLevel> = 
    TBuilderLevel extends "Build" ?
        T & {build():string} :
        T

type Builder<
    TPickMethods extends AllBuilderMethods,
    TSkillLocale extends LangLocale,
    TVoice extends VoiceNamesOrDefault,
    TLang extends LangOrDefault,
    TRestrictions extends Restrictions,
    TBuilderLevel extends BuilderLevel
> = 
    Pick<
        SSMLBuilderRestricted<TSkillLocale,TVoice,TLang,TRestrictions,
            AddBuild<
                Builder<TPickMethods,TSkillLocale,TVoice,TLang,TRestrictions,TBuilderLevel>,
                TBuilderLevel
            >
        >
        ,TPickMethods
    >

// could have a restrictions lookup so "overloads" e.g voice/voiceFromSkillLocale
// just pass themeselves and is mapped to voice - Record<AllBuilderMethods,Restrictions> ?
// think of appropriate names for types
type Restrictions = "voice" | "emotion" | Default
const treeRestrictions = {
    "emotion":{
        sayAsInterjection:true,
    },
    "voice":{
        sayAsInterjection:true,
    }
} satisfies Record<Exclude<Restrictions,Default>,  Partial<Record<AllBuilderMethods,boolean>>>
type TreeRestrictions = typeof treeRestrictions;

type ExcludeRestrictions<TPickMethods extends AllBuilderMethods,TRestrictions extends Restrictions> =
    TRestrictions extends Default ?
    TPickMethods :
    Exclude<TPickMethods,keyof TreeRestrictions[Exclude<TRestrictions,Default>]>


type RestrictedBuilder<
    TPickMethods extends AllBuilderMethods,
    TSkillLocale extends LangLocale,
    TVoice extends VoiceNamesOrDefault,
    TLang extends LangOrDefault,
    TRestrictions extends Restrictions,
    TBuilderLevel extends BuilderLevel = "NoBuild"
> = 
    Builder<
        ExcludeRestrictions<
            // any new logic that add goes in here
            ExcludeDependentMethodExclusions<
                TVoice,
                TSkillLocale,
                TPickMethods | "text"
            >,
            TRestrictions
        >,
        TSkillLocale,
        TVoice,
        TLang,
        TRestrictions,
        TBuilderLevel
    >

type TextOrBuilderCallback<
    TPicks extends AllBuilderMethods,
    TSkillLocale extends LangLocale,
    TVoice extends VoiceNamesOrDefault,
    TLang extends LangOrDefault,
    TRestrictions extends Restrictions
> = string | 
((builder:RestrictedBuilder<
    TPicks,
    TSkillLocale,
    TVoice,
    TLang,
    Exclude<TRestrictions,Default>
    >
) => void)



interface SSMLBuilderRestricted<
    TSkillLocale extends LangLocale,
    TVoice extends VoiceNamesOrDefault = Default,
    TLang extends LangOrDefault = Default,
    TRestrictions extends Restrictions = Default,
    TReturn = {}
> 
{
    text(text:string):TReturn

    voice<TNewVoice extends AllVoiceNames>(name:TNewVoice,textOrCallback:TextOrBuilderCallback<VoiceBuilderMethods,TSkillLocale,TNewVoice,TLang, TRestrictions | "voice">):TReturn
    voiceFromSkillLocale<TNewVoice extends VoicesInLocale<TSkillLocale>>(name:TNewVoice,textOrCallback:TextOrBuilderCallback<VoiceBuilderMethods,TSkillLocale,TNewVoice,TLang,TRestrictions | "voice">):TReturn
    lang<TNewLang extends LangLocale>(locale:TNewLang,textOrCallback:TextOrBuilderCallback<LangBuilderMethods,TSkillLocale,TVoice,TNewLang,TRestrictions>) : TReturn

    //#region amazon
    //#region domain - may prefix with domain
    fun(textOrCallback:TextOrBuilderCallback<FunBuilderMethods,TSkillLocale,TVoice,TLang,TRestrictions>) : TReturn 
    conversational(textOrCallback:TextOrBuilderCallback<ConversationalBuilderMethods,TSkillLocale,TVoice,TLang,TRestrictions>) : TReturn
    longForm(textOrCallback:TextOrBuilderCallback<LongFormBuilderMethods,TSkillLocale,TVoice,TLang,TRestrictions>) : TReturn
    music(textOrCallback:TextOrBuilderCallback<MusicBuilderMethods,TSkillLocale,TVoice,TLang,TRestrictions>) : TReturn
    news(textOrCallback:TextOrBuilderCallback<NewsBuilderMethods,TSkillLocale,TVoice,TLang,TRestrictions>) : TReturn
    //#endregion
    emotion(name:Emotion,intensity:EmotionIntensity,textOrCallback:TextOrBuilderCallback<EmotionBuilderMethods,TSkillLocale,TVoice,TLang,TRestrictions | "emotion">) : TReturn
    whisper(textOrCallback:TextOrBuilderCallback<WhisperBuilderMethods,TSkillLocale,TVoice,TLang,TRestrictions>) : TReturn
    //#endregion
    break(strength?:BreakStrength,milliseconds?:number):TReturn
    paragraph(textOrCallback:TextOrBuilderCallback<ParagraphBuilderMethods,TSkillLocale,TVoice,TLang,TRestrictions>) : TReturn
    sentence(textOrCallback:TextOrBuilderCallback<SentenceBuilderMethods,TSkillLocale,TVoice,TLang,TRestrictions>) : TReturn
    
    word(role:WordRole,textOrCallback:TextOrBuilderCallback<WordBuilderMethods,TSkillLocale,TVoice,TLang,TRestrictions>) : TReturn
    
    sub(alias:string,aliased:string) : TReturn

    //#region audio
    audio(src:string):TReturn;
    audioSoundbank(soundBankSound:SoundbankSound) : TReturn
    //#endregion

    //#region emphasis
    emphasis(level:EmphasisLevel,textOrCallback:TextOrBuilderCallback<EmphasisBuilderMethods,TSkillLocale,TVoice,TLang,TRestrictions>):TReturn;
    emphasisDefault(textOrCallback:TextOrBuilderCallback<EmphasisBuilderMethods,TSkillLocale,TVoice,TLang,TRestrictions>):TReturn;
    //#endregion

    //#region prosody
    // percentage minimum is 20%
    prosodyRate(rate:ProsodyRate,textOrCallback:TextOrBuilderCallback<ProsodySafeBuilderMethods,TSkillLocale,TVoice,TLang,TRestrictions>):TReturn
    // db - The maximum positive value is about +4.08dB.
    prosodyVolume(volume:ProsodyVolume,textOrCallback:TextOrBuilderCallback<ProsodySafeBuilderMethods,TSkillLocale,TVoice,TLang,TRestrictions>):TReturn
    prosodyRateVolume(rate:ProsodyRate,volume:ProsodyVolume,textOrCallback:TextOrBuilderCallback<ProsodySafeBuilderMethods,TSkillLocale,TVoice,TLang,TRestrictions>):TReturn
    // max +50%, smallest -33.3 ( no exception just capped)
    prosodyPitch(pitch:ProsodyPitch,textOrCallback:TextOrBuilderCallback<ProsodyPitchBuilderMethods,TSkillLocale,TVoice,TLang,TRestrictions>):TReturn
    prosodyPitchAndRate(pitch:ProsodyPitch,rate:ProsodyRate,textOrCallback:TextOrBuilderCallback<ProsodyPitchBuilderMethods,TSkillLocale,TVoice,TLang,TRestrictions>):TReturn
    prosodyPitchRateVolume(pitch:ProsodyPitch,rate:ProsodyRate,volume:ProsodyVolume,textOrCallback:TextOrBuilderCallback<ProsodyPitchBuilderMethods,TSkillLocale,TVoice,TLang,TRestrictions>):TReturn
    //#endregion

    

    //#region phoneme
    phonemeIPA(phonetic:string,text?:string):TReturn
    phonemeXSampa(phonetic:string,text?:string):TReturn
    phonemeAnyLanguageIPA(...phonemes:IpaPhonemes[]):TReturn
    phonemeAnyLanguageXSampa(...phonemes:XSampaPhonemes[]):TReturn
    phonemeLanguageIPA(...phonemes:IpaLangPhoneme<TSkillLocale,TVoice,TLang>[]):TReturn
    phonemeLanguageXSampa(...phonemes:XSampaLangPhoneme<TSkillLocale,TVoice,TLang>[]):TReturn
    //#endregion

    
    
    //#region sayAs
    sayAsExpletive(text:string):TReturn
    sayAsAddress(text:string):TReturn
    sayAsTelephone(text:string):TReturn
    sayAsTime(text:string):TReturn
    sayAsUnit(text:string):TReturn
    sayAsFraction(text:string):TReturn
    sayAsDigits(text:string):TReturn
    sayAsOrdinal(text:string):TReturn
    sayAsCardinal(text:string):TReturn
    sayAsCharacters(text:string):TReturn

    sayAsDate(text:string,format:SayAsDateFormat):TReturn

    sayAsInterjection<TSpeechcon extends LanguageSpeechcon<TSkillLocale,TVoice,TLang>>(speechcon:TSpeechcon,suffix?:string):TReturn
    //#endregion
}
type AllBuilderMethods = keyof SSMLBuilderRestricted<"en-GB">

type RootBuilder<TSkillLocale extends LangLocale> 
=  RestrictedBuilder<
    AllBuilderMethods,
    TSkillLocale,
    Default,
    Default,
    Default,
    "Build"
>

const jpBuilder : RootBuilder<"ja-JP"> = null as any;
jpBuilder.sayAsInterjection
jpBuilder.voice("Amy",builder => {
    // @ts-expect-error
    builder.sayAsInterjection
    builder.paragraph(builder2 => {
        // @ts-expect-error
        builder2.sayAsInterjection
    })
});