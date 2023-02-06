import { RestrictedBuilder } from "./restrictedBuilder";
import { AllBuilderMethods, LangOrDefault, SSMLBuilder, VoiceNamesOrDefault } from "./ssmlBuilder";
import { LangLocale } from "./voices";

export type TextOrBuilderCallback<
    TPicks extends AllBuilderMethods,
    TSkillLocale extends LangLocale,
    TVoice extends VoiceNamesOrDefault,
    TLang extends LangOrDefault,
> = string | 
((builder:RestrictedBuilder<
    TPicks,
    TSkillLocale,
    TVoice,
    TLang
    >
) => void)