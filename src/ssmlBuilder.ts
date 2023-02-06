import { LangLocale, VoicesInLocale, AllVoiceNames  } from "./voices";
import { BreakStrength, Emotion, EmotionIntensity, EmphasisLevel, IpaLangPhoneme, IpaPhonemes, LanguageSpeechcon, ProsodyPitch, ProsodyRate, ProsodyVolume, SayAsDateFormat, SoundbankSound, WordRole, XSampaLangPhoneme, XSampaPhonemes } from "./ssmlTypes";
import { FunBuilderMethods, ConversationalBuilderMethods, LongFormBuilderMethods, MusicBuilderMethods, NewsBuilderMethods, EmotionBuilderMethods, WhisperBuilderMethods, ParagraphBuilderMethods, SentenceBuilderMethods, WordBuilderMethods, EmphasisBuilderMethods, ProsodySafeBuilderMethods, ProsodyPitchBuilderMethods, VoiceBuilderMethods, LangBuilderMethods } from "./ssmlBuilder-config";
import { TextOrBuilderCallback } from "./textOrBuilderCallback";

export type Default = "default";

export type VoiceNamesOrDefault = AllVoiceNames | Default
export type LangOrDefault = LangLocale | Default;



export interface SSMLBuilder<
    TSkillLocale extends LangLocale,
    TVoice extends VoiceNamesOrDefault = Default,
    TLang extends LangOrDefault = Default,
    TReturn = {}
> 
{
    text(text:string):TReturn

    voice<TNewVoice extends AllVoiceNames>(name:TNewVoice,textOrCallback:TextOrBuilderCallback<VoiceBuilderMethods,TSkillLocale,TNewVoice,TLang>):TReturn
    voiceFromSkillLocale<TNewVoice extends VoicesInLocale<TSkillLocale>>(name:TNewVoice,textOrCallback:TextOrBuilderCallback<VoiceBuilderMethods,TSkillLocale,TNewVoice,TLang>):TReturn
    lang<TNewLang extends LangLocale>(locale:TNewLang,textOrCallback:TextOrBuilderCallback<LangBuilderMethods,TSkillLocale,TVoice,TNewLang>) : TReturn

    //#region amazon
    //#region domain - may prefix with domain
    fun(textOrCallback:TextOrBuilderCallback<FunBuilderMethods,TSkillLocale,TVoice,TLang>) : TReturn 
    conversational(textOrCallback:TextOrBuilderCallback<ConversationalBuilderMethods,TSkillLocale,TVoice,TLang>) : TReturn
    longForm(textOrCallback:TextOrBuilderCallback<LongFormBuilderMethods,TSkillLocale,TVoice,TLang>) : TReturn
    music(textOrCallback:TextOrBuilderCallback<MusicBuilderMethods,TSkillLocale,TVoice,TLang>) : TReturn
    news(textOrCallback:TextOrBuilderCallback<NewsBuilderMethods,TSkillLocale,TVoice,TLang>) : TReturn
    //#endregion
    emotion(name:Emotion,intensity:EmotionIntensity,textOrCallback:TextOrBuilderCallback<EmotionBuilderMethods,TSkillLocale,TVoice,TLang>) : TReturn
    whisper(textOrCallback:TextOrBuilderCallback<WhisperBuilderMethods,TSkillLocale,TVoice,TLang>) : TReturn
    //#endregion
    break(strength?:BreakStrength,milliseconds?:number):TReturn
    paragraph(textOrCallback:TextOrBuilderCallback<ParagraphBuilderMethods,TSkillLocale,TVoice,TLang>) : TReturn
    sentence(textOrCallback:TextOrBuilderCallback<SentenceBuilderMethods,TSkillLocale,TVoice,TLang>) : TReturn
    
    word(role:WordRole,textOrCallback:TextOrBuilderCallback<WordBuilderMethods,TSkillLocale,TVoice,TLang>) : TReturn
    
    sub(alias:string,aliased:string) : TReturn

    //#region audio
    audio(src:string):TReturn;
    audioSoundbank(soundBankSound:SoundbankSound) : TReturn
    //#endregion

    //#region emphasis
    emphasis(level:EmphasisLevel,textOrCallback:TextOrBuilderCallback<EmphasisBuilderMethods,TSkillLocale,TVoice,TLang>):TReturn;
    emphasisDefault(textOrCallback:TextOrBuilderCallback<EmphasisBuilderMethods,TSkillLocale,TVoice,TLang>):TReturn;
    //#endregion

    //#region prosody
    // percentage minimum is 20%
    prosodyRate(rate:ProsodyRate,textOrCallback:TextOrBuilderCallback<ProsodySafeBuilderMethods,TSkillLocale,TVoice,TLang>):TReturn
    // db - The maximum positive value is about +4.08dB.
    prosodyVolume(volume:ProsodyVolume,textOrCallback:TextOrBuilderCallback<ProsodySafeBuilderMethods,TSkillLocale,TVoice,TLang>):TReturn
    prosodyRateVolume(rate:ProsodyRate,volume:ProsodyVolume,textOrCallback:TextOrBuilderCallback<ProsodySafeBuilderMethods,TSkillLocale,TVoice,TLang>):TReturn
    // max +50%, smallest -33.3 ( no exception just capped)
    prosodyPitch(pitch:ProsodyPitch,textOrCallback:TextOrBuilderCallback<ProsodyPitchBuilderMethods,TSkillLocale,TVoice,TLang>):TReturn
    prosodyPitchAndRate(pitch:ProsodyPitch,rate:ProsodyRate,textOrCallback:TextOrBuilderCallback<ProsodyPitchBuilderMethods,TSkillLocale,TVoice,TLang>):TReturn
    prosodyPitchRateVolume(pitch:ProsodyPitch,rate:ProsodyRate,volume:ProsodyVolume,textOrCallback:TextOrBuilderCallback<ProsodyPitchBuilderMethods,TSkillLocale,TVoice,TLang>):TReturn
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
export type AllBuilderMethods = keyof SSMLBuilder<"en-GB">



// a) Email - amazon response
// b) Can you add code etc ?


/*
    Note that this works in the developer console even when p cannot have child p
    <speak>
    <p>Paragraph containing language containing paragraph
            <lang xml:lang="fr-FR">
                <p>Does work</p>
            </lang>
    </p>
    </speak>
*/





// in case need
// const conversationalSkillLocales = ["en-US","it-IT","ja-JP"] as const satisfies Readonly<LangLocale[]>;
// type ConversationalSkillLocales = typeof conversationalSkillLocales[number];
// const conversationalVoices = [Matthew,Joanna, /* not in docs*/ Amy,Takumi,Lupe] as const satisfies Readonly<AllVoiceNames[]>;
// type ConversationalVoices = typeof conversationalVoices[number];

// const newsSkillLocales = ["en-US","en-AU"] as const satisfies Readonly<LangLocale[]>;
// type NewsSkillLocales = typeof newsSkillLocales[number];
// const newsVoices = [Matthew,Joanna, Lupe,/* not in docs*/ Amy] as const satisfies Readonly<AllVoiceNames[]>;
// type NewVoices = typeof newsVoices[number];

// note that the builder should be able to perform validation
// my choice of typescript features impacts version that user can use ?
