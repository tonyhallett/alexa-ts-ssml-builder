import { RestrictedBuilder } from "./restrictedBuilder";
import {
  AllBuilderMethods,
  LangOrDefault,
  VoiceNamesOrDefault,
} from "./ssmlBuilder";
import { Restrictions } from "./treeRestrictions";
import { LangLocale } from "./voices";

export type TextOrBuilderCallback<
  TPicks extends AllBuilderMethods,
  TSkillLocale extends LangLocale,
  TVoice extends VoiceNamesOrDefault,
  TLang extends LangOrDefault,
  TRestrictions extends Restrictions
> =
  | string
  | ((
      builder: RestrictedBuilder<
        TPicks,
        TSkillLocale,
        TVoice,
        TLang,
        TRestrictions
      >
    ) => void);
