import { AllBuilderMethods, Default } from "./ssmlBuilder";

export type Restrictions = "voice" | "emotion" | "emphasis" | "prosodyPitch" | "domain" | Default;
const treeRestrictions = {
  emotion: {
    sayAsInterjection: true,
    voice:true,
    voiceFromSkillLocale:true,
    emphasis:true,
    emphasisDefault:true,
    prosodyPitch:true,
    prosodyPitchAndRate:true,
    prosodyPitchRateVolume:true,
    fun:true,
    conversational:true,
    longForm:true,
    music:true,
    news:true
  },
  voice: {
    sayAsInterjection: true,
    emotion:true,
    emphasis:true,
    emphasisDefault:true,
    prosodyPitch:true,
    prosodyPitchAndRate:true,
    prosodyPitchRateVolume:true,
    fun:true,
    conversational:true,
    longForm:true,
    music:true,
    news:true
  },
  emphasis: {
    sayAsInterjection: true,
    emotion:true,
    voice:true,
    voiceFromSkillLocale:true,
    prosodyPitch:true,
    prosodyPitchAndRate:true,
    prosodyPitchRateVolume:true,
    fun:true,
    conversational:true,
    longForm:true,
    music:true,
    news:true

  },
  prosodyPitch: {
    sayAsInterjection: true,
    emotion:true,
    voice:true,
    voiceFromSkillLocale:true,
    emphasis:true,
    emphasisDefault:true,
    fun:true,
    conversational:true,
    longForm:true,
    music:true,
    news:true
  },
  domain: {
    sayAsInterjection: true,
    emotion:true,
    voice:true,
    voiceFromSkillLocale:true,
    emphasis:true,
    emphasisDefault:true,
  }

} satisfies Record<
  Exclude<Restrictions, Default>,
  Partial<Record<AllBuilderMethods, boolean>>
>;
export type TreeRestrictions = typeof treeRestrictions;
