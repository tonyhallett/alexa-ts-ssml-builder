import { skillLocaleVoiceDependentBuilderMethods } from "./domainRestrictions";
import { AllBuilderMethods } from "./ssmlBuilder";

type ExcludeBuilderMethod<TFrom extends AllBuilderMethods,TExclude extends AllBuilderMethods> = Exclude<TFrom,TExclude>
type ExcludeFromAllBuilderMethods<TExclude extends AllBuilderMethods> = ExcludeBuilderMethod<AllBuilderMethods, TExclude>


// Note that do not need to specify text
const domainMethodsNames = ["fun","longForm","music","news","conversational"] as const satisfies Readonly<AllBuilderMethods[]>;
type DomainMethodNames = typeof domainMethodsNames[number];
const amazonMethodsNames = ["emotion","whisper",...domainMethodsNames] as const satisfies Readonly<AllBuilderMethods[]>;

const voiceMethodNames = ["voice","voiceFromSkillLocale"] as const satisfies Readonly<AllBuilderMethods[]>;
type VoiceMethodNames = typeof voiceMethodNames[number];
const audioMethodNames = ["audio","audioSoundbank"] as const satisfies Readonly<AllBuilderMethods[]>;
const safeSayAsMethodNames = [
    "sayAsAddress",
    "sayAsCardinal",
    "sayAsCharacters",
    "sayAsDate",
    "sayAsDigits",
    "sayAsExpletive",
    "sayAsFraction",
    "sayAsOrdinal",
    "sayAsTelephone",
    "sayAsTime",
    "sayAsUnit"
] as const satisfies Readonly<AllBuilderMethods[]>;
const sayAsMethodNames = [
        ...safeSayAsMethodNames,
    "sayAsInterjection",
] as const satisfies Readonly<AllBuilderMethods[]>;
const phonemeMethodNames = [
    "phonemeIPA",
    "phonemeXSampa",
    "phonemeAnyLanguageIPA",
    "phonemeAnyLanguageXSampa",
    "phonemeLanguageIPA",
    "phonemeLanguageXSampa"
] as const satisfies Readonly<AllBuilderMethods[]>;
const safeProsodyMethodNames = [
    "prosodyRate",
    "prosodyVolume",
    "prosodyRateVolume"
] as const satisfies Readonly<AllBuilderMethods[]>;
const prosodyPitchMethodNames = [
    "prosodyPitch",
    "prosodyPitchAndRate",
    "prosodyPitchRateVolume",
] as const satisfies Readonly<AllBuilderMethods[]>;
type ProsodyPitchMethodNames = typeof prosodyPitchMethodNames[number];
const prosodyMethodNames = [
    ...prosodyPitchMethodNames,
    ...safeProsodyMethodNames
] as const satisfies Readonly<AllBuilderMethods[]>;
const emphasisMethodNames = [
    "emphasis",
    "emphasisDefault"
] as const satisfies Readonly<AllBuilderMethods[]>;
type EmphasisMethodNames = typeof emphasisMethodNames[number]


const alexaW3SSMLMethodNames = [
    ...audioMethodNames,
    "break",
    ...emphasisMethodNames,
    "lang",
    "paragraph",
    ...phonemeMethodNames,
    ...prosodyMethodNames,
    ...sayAsMethodNames,
    "sub",
    "sentence",
    ...voiceMethodNames,
    "word"
] as const satisfies Readonly<AllBuilderMethods[]>;
type AlexaW3SSMLMethodNames = typeof alexaW3SSMLMethodNames[number];

export type WhisperBuilderMethods = ExcludeFromAllBuilderMethods<"whisper">

export type EmotionBuilderMethods = ExcludeFromAllBuilderMethods<"sayAsInterjection" | EmphasisMethodNames | ProsodyPitchMethodNames | VoiceMethodNames | DomainMethodNames>

const commonDomainBuilderMethods = [
    /*
        amazon domains - can they be nested can use have same in same ?
        conversational
        longForm
        music
        news
        fun

        incompatible possibly
        emotion
        emphasis
        prosody pitch
        interjection
        voice

    */
    ...audioMethodNames,
    "break",
    "lang",
    "paragraph",
    ...phonemeMethodNames,
    ...safeProsodyMethodNames,
    ...safeSayAsMethodNames,
    "sentence",
    "sub",
    "whisper",
    "word"
    // not adding voice
] as const satisfies Readonly<AllBuilderMethods[]>;
const funBuilderMethods = [
    ...commonDomainBuilderMethods

] as const satisfies Readonly<AllBuilderMethods[]>;
export type FunBuilderMethods = typeof funBuilderMethods[number];
const conversationalBuilderMethods = [
    ...commonDomainBuilderMethods
] as const satisfies Readonly<AllBuilderMethods[]>;
export type ConversationalBuilderMethods = typeof conversationalBuilderMethods[number];
const longFormBuilderMethods = [
    ...commonDomainBuilderMethods
] as const satisfies Readonly<AllBuilderMethods[]>;
export type LongFormBuilderMethods = typeof longFormBuilderMethods[number];
const musicBuilderMethods = [
    ...commonDomainBuilderMethods
] as const satisfies Readonly<AllBuilderMethods[]>;
export type MusicBuilderMethods = typeof musicBuilderMethods[number];
const newsBuilderMethods = [
    ...commonDomainBuilderMethods
] as const satisfies Readonly<AllBuilderMethods[]>;
export type NewsBuilderMethods = typeof newsBuilderMethods[number];


export type ParagraphBuilderMethods = ExcludeFromAllBuilderMethods<"paragraph">

export type EmphasisBuilderMethods = ExcludeFromAllBuilderMethods<"paragraph"|"sentence"|"emotion"|DomainMethodNames>

export type SentenceBuilderMethods = Exclude<ParagraphBuilderMethods,"sentence">

const wordBuilderMethods = [
    //...audioMethodNames, is allowed and works but does not make any sense
    // "break", does not work
    ...emphasisMethodNames,
    //...phonemeMethodNames, surely does not make sense
    ...prosodyMethodNames,
    //...sayAsMethodNames, surely does not make sense
    "sub",
    "whisper",
    "emotion"
    // domain does not sound any different with "read" VB, VBD - makes sense to use inside domain

] as const satisfies Readonly<AllBuilderMethods[]>;
export type WordBuilderMethods = typeof wordBuilderMethods[number];


export type ProsodySafeBuilderMethods = AllBuilderMethods;
export type ProsodyPitchBuilderMethods = ExcludeBuilderMethod<ProsodySafeBuilderMethods,"emotion" | DomainMethodNames>

// disagreed with docs
const voiceBuilderMethods = [
    ...alexaW3SSMLMethodNames,
    "whisper",
    // have to add these as allowed and they are then filtered by voice name
    ...skillLocaleVoiceDependentBuilderMethods
] as const satisfies Readonly<AllBuilderMethods[]>;
export type VoiceBuilderMethods = typeof voiceBuilderMethods[number];



export type LangBuilderMethods = AllBuilderMethods;