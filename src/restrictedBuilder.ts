import { ExcludeDependentMethodExclusions } from "./domainRestrictions"
import { AllBuilderMethods, VoiceNamesOrDefault, Default, LangOrDefault, SSMLBuilder } from "./ssmlBuilder"
import { Restrictions, TreeRestrictions } from "./treeRestrictions"
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
    TRestrictions extends Restrictions,
    TBuilderLevel extends BuilderLevel
> = 
    Pick<
        SSMLBuilder<TSkillLocale,TVoice,TLang,TRestrictions,
            AddBuild<
                Builder<TPickMethods,TSkillLocale,TVoice,TLang,TRestrictions,TBuilderLevel>,
                TBuilderLevel
            >
        >
        ,TPickMethods
    >


type ExcludeRestrictions<TPickMethods extends AllBuilderMethods,TRestrictions extends Restrictions> =
    TRestrictions extends Default ?
        TPickMethods :
        Exclude<TPickMethods,keyof TreeRestrictions[Exclude<TRestrictions,Default>]>

export type RestrictedBuilder<
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