import { ExcludeDependentMethodExclusions } from "./domainRestrictions"
import { AllBuilderMethods, VoiceNamesOrDefault, Default, LangOrDefault, SSMLBuilder } from "./ssmlBuilder"
import { LangLocale } from "./voices"

type BuilderLevel =  "Build" | "NoBuild"


type AddBuild<T,TBuilderLevel extends BuilderLevel> = 
    TBuilderLevel extends "Build" ?
        T & {build():string} :
        T

export type Builder<
    TPickMethods extends AllBuilderMethods,
    TSkillLocale extends LangLocale,
    TVoice extends VoiceNamesOrDefault,
    TLang extends LangOrDefault,
    TBuilderLevel extends BuilderLevel
> = 
    Pick<
        SSMLBuilder<TSkillLocale,TVoice,TLang,
            AddBuild<
                Builder<TPickMethods,TSkillLocale,TVoice,TLang,TBuilderLevel>,
                TBuilderLevel
            >
        >
        ,TPickMethods
    >

export type RestrictedBuilder<
    TPickMethods extends AllBuilderMethods,
    TSkillLocale extends LangLocale,
    TVoice extends VoiceNamesOrDefault,
    TLang extends LangOrDefault,
    TBuilderLevel extends BuilderLevel = "NoBuild"
> = 
    Builder<
        ExcludeDependentMethodExclusions<
            TVoice,
            TSkillLocale,
            TPickMethods | "text"
        >,
        TSkillLocale,
        TVoice,
        TLang,
        TBuilderLevel
    >