import { AllBuilderMethods, Default, VoiceNamesOrDefault } from "./ssmlBuilder";
import {
  AllVoiceNames,
  Amy,
  Joanna,
  LangLocale,
  Lupe,
  Matthew,
  Takumi,
} from "./voices";

export const skillLocaleVoiceDependentBuilderMethods = [
  "conversational",
  "news",
] as const satisfies Readonly<AllBuilderMethods[]>;
type SkillLocaleVoiceDependentBuilderMethods =
  (typeof skillLocaleVoiceDependentBuilderMethods)[number];

const skillLocaleVoiceDependentLookup = {
  conversational: {
    voices: [Matthew, Joanna, /* not in docs*/ Amy, Takumi, Lupe],
    locales: ["en-US", "it-IT", "ja-JP"],
  },
  news: {
    voices: [Matthew, Joanna, Lupe, /* not in docs*/ Amy],
    locales: ["en-US", "en-AU"],
  },
} satisfies Record<
  SkillLocaleVoiceDependentBuilderMethods,
  {
    voices: AllVoiceNames[];
    locales: LangLocale[];
  }
>;
type SkillLocaleVoiceDependentLookup = typeof skillLocaleVoiceDependentLookup;

export type VoiceLocaleExclusions<
  TVoice extends VoiceNamesOrDefault,
  TSkillLocale extends LangLocale
> = TVoice extends Default
  ? keyof {
      // Property could be Domain
      [Property in keyof SkillLocaleVoiceDependentLookup as TSkillLocale extends SkillLocaleVoiceDependentLookup[Property]["locales"][number]
        ? never
        : Property]: SkillLocaleVoiceDependentLookup[Property];
    }
  : keyof {
      [Property in keyof SkillLocaleVoiceDependentLookup as TVoice extends SkillLocaleVoiceDependentLookup[Property]["voices"][number]
        ? never
        : Property]: SkillLocaleVoiceDependentLookup[Property];
    };

const skillLocaleDependentBuilderMethods = [
  "emotion",
  "fun",
  "music",
  "longForm",
] as const satisfies Readonly<AllBuilderMethods[]>;
type SkillLocaleDependentBuilderMethods =
  (typeof skillLocaleDependentBuilderMethods)[number];
const skillLocaleDependentLookup = {
  "ja-JP": ["emotion", "fun"],
  "de-DE": ["emotion"],
  "en-AU": [],
  "en-CA": ["music"],
  "en-GB": ["emotion", "music", "longForm"], // long-form not mentioned in docs
  "en-IN": [],
  "en-US": ["emotion", "music", "longForm"],
  "es-ES": ["longForm"], // long-form not mentioned in docs
  "es-MX": [],
  "es-US": [],
  "fr-CA": [],
  "fr-FR": [],
  "hi-IN": [],
  "it-IT": [],
  "pt-BR": [],
} satisfies Record<LangLocale, SkillLocaleDependentBuilderMethods[]>;

type SkillLocaleDependentLookup = typeof skillLocaleDependentLookup;

type LocaleExclusions<
  TInclusions extends SkillLocaleDependentBuilderMethods,
  TVoice extends VoiceNamesOrDefault
> = TVoice extends Default
  ? Exclude<SkillLocaleDependentBuilderMethods, TInclusions>
  : SkillLocaleDependentBuilderMethods;

type DependentMethodExclusions<
  TSkillLocale extends LangLocale,
  TVoice extends VoiceNamesOrDefault
> =
  | LocaleExclusions<SkillLocaleDependentLookup[TSkillLocale][number], TVoice>
  | VoiceLocaleExclusions<TVoice, TSkillLocale>;

export type ExcludeDependentMethodExclusions<
  TVoice extends VoiceNamesOrDefault,
  TSkillLocale extends LangLocale,
  TInclude extends AllBuilderMethods = AllBuilderMethods
> = Exclude<TInclude, DependentMethodExclusions<TSkillLocale, TVoice>>;
