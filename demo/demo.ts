import { createBuilder } from "../src/createBuilder";
import {soundbank} from "../src/soundbank"
import { WordRole } from "../src/ssmlTypes";
import { Amy, Joanna, LangLocale, Lupe, Matthew, Salli, Takumi } from "../src/voices";

const jaJpBuilder = createBuilder<"ja-JP">();
const deDEBuilder = createBuilder<"de-DE">();
const enAUBuilder = createBuilder<"en-AU">();
const enCABuilder = createBuilder<"en-CA">();
const enGBBuilder = createBuilder<"en-GB">();
const enINBuilder = createBuilder<"en-IN">();
const enUSBuilder = createBuilder<"en-US">();
const esESBuilder = createBuilder<"es-ES">();
const esMXBuilder = createBuilder<"es-MX">();
const esUSBuilder = createBuilder<"es-US">();
const frCABuilder = createBuilder<"fr-CA">();
const frFRBuilder = createBuilder<"fr-FR">();
const hiINBuilder = createBuilder<"hi-IN">();
const itITBuilder = createBuilder<"it-IT">();
const ptBRBuilder = createBuilder<"pt-BR">();


// #region build availability tests
// @ts-expect-error - build should only be available after added content on the main builder
jaJpBuilder.build
jaJpBuilder.paragraph(subBuilderLevel1 => {
    // @ts-expect-error - build should only be available after added content on the main builder
    subBuilderLevel1.build
    subBuilderLevel1.sentence(subBuilderLevel2 => {
        // @ts-expect-error - build should only be available after added content on the main builder
        subBuilderLevel2.build
    })
}
).build();
// #endregion

// #region LocaleFromLangVoiceOrSkillLocale
// #region interjection tests
// @ts-expect-error - skill locale when no lang or voice
jaJpBuilder.sayAsInterjection("codswallop");
enGBBuilder.sayAsInterjection("codswallop");
jaJpBuilder.lang("en-GB",builder => builder.sayAsInterjection("codswallop")); // lang over skill locale
jaJpBuilder.voiceFromSkillLocale("Mizuki", builder => {
    // @ts-expect-error 
    builder.sayAsInterjection("codswallop")
})
jaJpBuilder.lang("de-DE",builder => {
    builder.voice("Amy",builder2 => {
        // @ts-expect-error 
        builder2.sayAsInterjection("codswallop") // lang over voice
    })
})
// sub builders
jaJpBuilder.paragraph(builder => {
    // @ts-expect-error 
    builder.sayAsInterjection("codswallop");
});
enGBBuilder.paragraph(builder => {
    builder.sayAsInterjection("codswallop");
});

// #endregion
// #region phoneme tests
jaJpBuilder.phonemeLanguageIPA("o:");
// @ts-expect-error 
enGBBuilder.phonemeLanguageIPA("o:");
enGBBuilder.lang("ja-JP",builder => builder.phonemeLanguageIPA("o:")); // lang over skill locale
enGBBuilder.voice("Takumi", builder => builder.phonemeLanguageIPA("o:")) // voice over skill locale
enGBBuilder.voiceFromSkillLocale("Amy",builder => {
    // @ts-expect-error
    builder.phonemeLanguageIPA("o:")
})
jaJpBuilder.lang("en-GB",builder => {
    builder.voice("Takumi",builder2 => {
        // @ts-expect-error 
        builder2.phonemeLanguageIPA("o:")
    })
})
// sub builders
jaJpBuilder.paragraph(builder => {
    builder.phonemeLanguageIPA("o:")
});
enGBBuilder.paragraph(builder => {
    // @ts-expect-error 
    builder.phonemeLanguageIPA("o:")
});
// #endregion
// #endregion


// #region skill locale / voice - dependent methods
//#region skill locale
//#region longForm
//en-GB es-ES not in docs but appears to work
[enUSBuilder,enGBBuilder,esESBuilder].forEach(longFormBuilder => longFormBuilder.longForm);
// @ts-expect-error
jaJpBuilder.longForm
// @ts-expect-error
deDEBuilder.longForm
// @ts-expect-error
enAUBuilder.longForm
// @ts-expect-error
enCABuilder.longForm
// @ts-expect-error
enINBuilder.longForm
// @ts-expect-error
esMXBuilder.longForm
// @ts-expect-error
esUSBuilder.longForm
// @ts-expect-error
frCABuilder.longForm
// @ts-expect-error
frFRBuilder.longForm
// @ts-expect-error
hiINBuilder.longForm
// @ts-expect-error
itITBuilder.longForm
// @ts-expect-error
ptBRBuilder.longForm;
// #endregion

//#region music
[enCABuilder,enGBBuilder,enUSBuilder].forEach(musicBuilder => musicBuilder.music);
// @ts-expect-error
jaJpBuilder.music
// @ts-expect-error
deDEBuilder.music
// @ts-expect-error
enAUBuilder.music
// @ts-expect-error
enINBuilder.music
// @ts-expect-error
esESBuilder.music
// @ts-expect-error
esMXBuilder.music
// @ts-expect-error
esUSBuilder.music
// @ts-expect-error
frCABuilder.music
// @ts-expect-error
frFRBuilder.music
// @ts-expect-error
hiINBuilder.music
// @ts-expect-error
itITBuilder.music
// @ts-expect-error
ptBRBuilder.music
//#endregion

// #region fun
jaJpBuilder.fun
// @ts-expect-error
deDEBuilder.fun
// @ts-expect-error
enAUBuilder.fun
// @ts-expect-error
enCABuilder.fun
// @ts-expect-error
enGBBuilder.fun
// @ts-expect-error
enINBuilder.fun
// @ts-expect-error
enUSBuilder.fun
// @ts-expect-error
esESBuilder.fun
// @ts-expect-error
esMXBuilder.fun
// @ts-expect-error
esUSBuilder.fun
// @ts-expect-error
frCABuilder.fun
// @ts-expect-error
frFRBuilder.fun
// @ts-expect-error
hiINBuilder.fun
// @ts-expect-error
itITBuilder.fun
// @ts-expect-error
ptBRBuilder.fun;

//#endregion

// #region emotion
[jaJpBuilder,deDEBuilder,enGBBuilder,enUSBuilder].forEach(emotionBuilder => emotionBuilder.emotion);
// @ts-expect-error
enAUBuilder.emotion
// @ts-expect-error
enCABuilder.emotion
// @ts-expect-error
enINBuilder.emotion
// @ts-expect-error
esESBuilder.emotion
// @ts-expect-error
esMXBuilder.emotion
// @ts-expect-error
esUSBuilder.emotion
// @ts-expect-error
frCABuilder.emotion
// @ts-expect-error
frFRBuilder.emotion
// @ts-expect-error
hiINBuilder.emotion
// @ts-expect-error
itITBuilder.emotion
// @ts-expect-error
ptBRBuilder.emotion;
// #endregion

// #region cannot use if have switched to a voice
jaJpBuilder.voice("Joanna", builder => {
    // @ts-expect-error
    builder.emotion
});
jaJpBuilder.voiceFromSkillLocale("Mizuki", builder => {
    // @ts-expect-error
    builder.emotion
})
jaJpBuilder.voice("Joanna", builder => {
    // @ts-expect-error
    builder.fun
});
enGBBuilder.voice("Joanna", builder => {
    // @ts-expect-error
    builder.music
});
enUSBuilder.voice("Joanna", builder => {
    // @ts-expect-error
    builder.longForm
});
//#endregion
//#endregion

// #region locale or voice
// #region news
[enUSBuilder,enAUBuilder].forEach(newsBuilder => newsBuilder.news);
// @ts-expect-error
jaJpBuilder.news
// @ts-expect-error
deDEBuilder.news
// @ts-expect-error
enCABuilder.news
// @ts-expect-error
enGBBuilder.news
// @ts-expect-error
enINBuilder.news
// @ts-expect-error
esESBuilder.news
// @ts-expect-error
esMXBuilder.news
// @ts-expect-error
esUSBuilder.news
// @ts-expect-error
frCABuilder.news
// @ts-expect-error
frFRBuilder.news
// @ts-expect-error
hiINBuilder.news
// @ts-expect-error
itITBuilder.news
// @ts-expect-error
ptBRBuilder.news;

// Amy not in docs
([Matthew,Joanna, Lupe, Amy] as const).forEach(newsVoice => {
    jaJpBuilder.voice(newsVoice,builder => builder.news);
});
jaJpBuilder.voiceFromSkillLocale("Mizuki", builder => {
    // @ts-expect-error
    builder.news
})
enUSBuilder.voice(Salli, builder => {
    // @ts-expect-error
    builder.news
});

// #endregion

// #region conversational

[enUSBuilder,itITBuilder,jaJpBuilder].forEach(conversationalBuilder => conversationalBuilder.conversational);
// @ts-expect-error
deDEBuilder.conversational
// @ts-expect-error
enAUBuilder.conversational
// @ts-expect-error
enCABuilder.conversational
// @ts-expect-error
enGBBuilder.conversational
// @ts-expect-error
enINBuilder.conversational
// @ts-expect-error
esESBuilder.conversational
// @ts-expect-error
esMXBuilder.conversational
// @ts-expect-error
esUSBuilder.conversational
// @ts-expect-error
frCABuilder.conversational
// @ts-expect-error
frFRBuilder.conversational
// @ts-expect-error
hiINBuilder.conversational
// @ts-expect-error
ptBRBuilder.conversational;

// Amy not in docs
([Matthew, Joanna, Amy, Takumi, Lupe] as const).forEach(voice => {
    ptBRBuilder.voice(voice, builder => {
        builder.conversational
    })
});

enUSBuilder.voice(Salli, builder => {
    // @ts-expect-error
    builder.conversational
});

enUSBuilder.voiceFromSkillLocale(Salli, builder => {
    // @ts-expect-error
    builder.conversational
});

//#endregion
//#endregion

// #region skill locale dependent / voice  - still disallowed / allowed in sub builders
jaJpBuilder.paragraph(paragraphBuilder => {
    // @ts-expect-error
    paragraphBuilder.longForm
    // @ts-expect-error
    paragraphBuilder.music
    paragraphBuilder.emotion
    paragraphBuilder.fun

    // @ts-expect-error
    paragraphBuilder.news
    paragraphBuilder.conversational
});
jaJpBuilder.voice(Matthew,builder => {
    builder.paragraph(builder2 => {
        // @ts-expect-error
        builder2.fun
        builder2.news
    })
})
// #endregion

// #endregion

// text is always available
jaJpBuilder.text



// testing emotion inside - skill locale dependent
jaJpBuilder
    .paragraph(builder => builder.emotion)
    .sentence(builder => builder.emotion)
    .word(WordRole.Noun, builder => builder.emotion)
    .whisper(builder => builder.emotion)
    .lang("de-DE",builder => builder.emotion)
    .prosodyRate("fast",builder => builder.emotion)
    .prosodyRateVolume("fast","loud",builder => builder.emotion)
    .prosodyPitch("high", builder => {
        // @ts-expect-error
        builder.emotion
    })
    .prosodyPitchAndRate("high", "fast", builder => {
        // @ts-expect-error
        builder.emotion
    })
    .prosodyPitchRateVolume("high","fast","loud", builder => {
        // @ts-expect-error
        builder.emotion
    })
    .emphasis("moderate",builder => {
        // @ts-expect-error
        builder.emotion
    });

// testing emotion builder as ja-JP has it
jaJpBuilder.emotion("disappointed","high", emotionBuilder => {
    emotionBuilder.whisper

    emotionBuilder.text // always available in builder
    emotionBuilder.audio
    emotionBuilder.audioSoundbank
    emotionBuilder.break
    
    emotionBuilder.lang
    emotionBuilder.paragraph
    emotionBuilder.phonemeIPA
    emotionBuilder.phonemeXSampa
    emotionBuilder.phonemeAnyLanguageIPA
    emotionBuilder.phonemeAnyLanguageXSampa
    emotionBuilder.phonemeLanguageIPA
    emotionBuilder.phonemeLanguageXSampa
    
    emotionBuilder.prosodyRate
    emotionBuilder.prosodyRateVolume
    emotionBuilder.prosodyVolume
    emotionBuilder.sayAsAddress
    emotionBuilder.sayAsCardinal
    emotionBuilder.sayAsCharacters
    emotionBuilder.sayAsDate
    emotionBuilder.sayAsDigits
    emotionBuilder.sayAsExpletive
    emotionBuilder.sayAsFraction
    emotionBuilder.sayAsOrdinal
    emotionBuilder.sayAsTelephone
    emotionBuilder.sayAsTime
    emotionBuilder.sayAsUnit
    
    emotionBuilder.sentence
    emotionBuilder.sub
    
    emotionBuilder.word

    // @ts-expect-error
    emotionBuilder.emphasis
    // @ts-expect-error
    emotionBuilder.emphasisDefault
    // @ts-expect-error
    emotionBuilder.prosodyPitch
    // @ts-expect-error
    emotionBuilder.prosodyPitchAndRate
    // @ts-expect-error
    emotionBuilder.prosodyPitchRateVolume
    // @ts-expect-error
    emotionBuilder.sayAsInterjection
    // @ts-expect-error
    emotionBuilder.voice
    // @ts-expect-error
    emotionBuilder.voiceFromSkillLocale
    // @ts-expect-error
    emotionBuilder.fun // and all other domains

    emotionBuilder.emotion
    
    
})
    

// testing longForm inside  - skill locale dependent
enUSBuilder
    .paragraph(builder => builder.longForm)
    .sentence(builder => builder.longForm)
    .word(WordRole.Noun, builder => {
        // @ts-expect-error
        builder.longForm
    })
    .whisper(builder => builder.longForm)
    .lang("de-DE",builder => builder.longForm)
    .prosodyRate("fast",builder => builder.longForm)
    .prosodyRateVolume("fast","loud",builder => builder.longForm)
    .prosodyPitch("high", builder => {
        // @ts-expect-error
        builder.longForm;
    })
    .prosodyPitchAndRate("high", "fast", builder => {
        // @ts-expect-error
        builder.longForm
    })
    .prosodyPitchRateVolume("high","fast","loud", builder => {
        // @ts-expect-error
        builder.longForm
    })
    .emphasis("moderate",builder => {
        // @ts-expect-error
        builder.longForm
    })

// testing music inside  - skill locale dependent
enGBBuilder
    .paragraph(builder => builder.music)
    .sentence(builder => builder.music)
    .word(WordRole.Noun, builder => {
        // @ts-expect-error
        builder.music
    })
    .whisper(builder => builder.music)
    .lang("de-DE",builder => builder.music)
    .prosodyRate("fast",builder => builder.music)
    .prosodyRateVolume("fast","loud",builder => builder.music)
    .prosodyPitch("high", builder => {
        // @ts-expect-error
        builder.music
    })
    .prosodyPitchAndRate("high", "fast", builder => {
        // @ts-expect-error
        builder.music
    })
    .prosodyPitchRateVolume("high","fast","loud", builder => {
        // @ts-expect-error
        builder.music
    })
    .emphasis("moderate",builder => {
        // @ts-expect-error
        builder.music
    })

// testing fun inside  - skill locale dependent
jaJpBuilder
    .paragraph(builder => builder.fun)
    .sentence(builder => builder.fun)
    .word(WordRole.Noun, builder => {
        // @ts-expect-error
        builder.fun
    })
    .whisper(builder => builder.fun)
    .lang("de-DE",builder => builder.fun)
    .prosodyRate("fast",builder => builder.fun)
    .prosodyRateVolume("fast","loud",builder => builder.fun)
    .prosodyPitch("high", builder => {
        // @ts-expect-error
        builder.fun
    })
    .prosodyPitchAndRate("high", "fast", builder => {
        //@ts-expect-error
        builder.fun
    })
    .prosodyPitchRateVolume("high","fast","loud", builder => {
        // @ts-expect-error
        builder.fun
    })
    .emphasis("moderate",builder => {
        // @ts-expect-error
        builder.fun
    })

// testing conversational inside - skill locale and voice
enUSBuilder
    .paragraph(builder => builder.conversational)
    .sentence(builder => builder.conversational)
    .word(WordRole.Noun, builder => {
        // @ts-expect-error
        builder.conversational
    })
    .whisper(builder => builder.conversational)
    .lang("de-DE",builder => builder.conversational)
    .prosodyRate("fast",builder => builder.conversational)
    .prosodyRateVolume("fast","loud",builder => builder.conversational)
    .prosodyPitch("high", builder => {
        // @ts-expect-error
        builder.conversational
    })
    .prosodyPitchAndRate("high", "fast", builder => {
        //@ts-expect-error
        builder.conversational
    })
    .prosodyPitchRateVolume("high","fast","loud", builder => {
        // @ts-expect-error
        builder.conversational
    })
    .emphasis("moderate",builder => {
        // @ts-expect-error
        builder.conversational
    })

// testing news inside - skill locale and voice
enUSBuilder
    .paragraph(builder => builder.news)
    .sentence(builder => builder.news)
    .word(WordRole.Noun, builder => {
        // @ts-expect-error
        builder.news
    })
    .whisper(builder => builder.news)
    .lang("de-DE",builder => builder.news)
    .prosodyRate("fast",builder => builder.news)
    .prosodyRateVolume("fast","loud",builder => builder.news)
    .prosodyPitch("high", builder => {
        // @ts-expect-error
        builder.news
    })
    .prosodyPitchAndRate("high", "fast", builder => {
        //@ts-expect-error
        builder.news
    })
    .prosodyPitchRateVolume("high","fast","loud", builder => {
        // @ts-expect-error
        builder.news
    })
    .emphasis("moderate",builder => {
        // @ts-expect-error
        builder.news
    })


// root level - not including skill locale / voice dependent
// or demonstrating lang typed ( interjection, phoneme)
// as done above

jaJpBuilder
    .audio("url")
    .audioSoundbank(soundbank.air.fire_extinguisher.fire_extinguisher_1)

    .break("medium")
    .emphasis("moderate",emphasisBuilder => {
        emphasisBuilder.whisper

        emphasisBuilder.text // always available in builder
        emphasisBuilder.audio
        emphasisBuilder.audioSoundbank
        emphasisBuilder.break
        emphasisBuilder.emphasis
        emphasisBuilder.emphasisDefault
        emphasisBuilder.lang
        
        emphasisBuilder.phonemeIPA
        emphasisBuilder.phonemeXSampa
        emphasisBuilder.phonemeAnyLanguageIPA
        emphasisBuilder.phonemeAnyLanguageXSampa
        emphasisBuilder.phonemeLanguageIPA
        emphasisBuilder.phonemeLanguageXSampa
        emphasisBuilder.prosodyPitch
        emphasisBuilder.prosodyPitchAndRate
        emphasisBuilder.prosodyPitchRateVolume
        emphasisBuilder.prosodyRate
        emphasisBuilder.prosodyRateVolume
        emphasisBuilder.prosodyVolume
        emphasisBuilder.sayAsAddress
        emphasisBuilder.sayAsCardinal
        emphasisBuilder.sayAsCharacters
        emphasisBuilder.sayAsDate
        emphasisBuilder.sayAsDigits
        emphasisBuilder.sayAsExpletive
        emphasisBuilder.sayAsFraction
        emphasisBuilder.sayAsOrdinal
        emphasisBuilder.sayAsTelephone
        emphasisBuilder.sayAsTime
        emphasisBuilder.sayAsUnit
        emphasisBuilder.sayAsInterjection
        
        emphasisBuilder.sub
        emphasisBuilder.voice
        emphasisBuilder.voiceFromSkillLocale
        emphasisBuilder.word

        // @ts-expect-error
        emphasisBuilder.paragraph
        // @ts-expect-error
        emphasisBuilder.sentence
    })
    .lang("de-DE",langBuilder => {
        langBuilder.whisper

        langBuilder.text // always available in builder
        langBuilder.audio
        langBuilder.audioSoundbank
        langBuilder.break
        langBuilder.emphasis
        langBuilder.emphasisDefault
        langBuilder.lang
        langBuilder.paragraph
        langBuilder.phonemeIPA
        langBuilder.phonemeXSampa
        langBuilder.phonemeAnyLanguageIPA
        langBuilder.phonemeAnyLanguageXSampa
        langBuilder.phonemeLanguageIPA
        langBuilder.phonemeLanguageXSampa
        langBuilder.prosodyPitch
        langBuilder.prosodyPitchAndRate
        langBuilder.prosodyPitchRateVolume
        langBuilder.prosodyRate
        langBuilder.prosodyRateVolume
        langBuilder.prosodyVolume
        langBuilder.sayAsAddress
        langBuilder.sayAsCardinal
        langBuilder.sayAsCharacters
        langBuilder.sayAsDate
        langBuilder.sayAsDigits
        langBuilder.sayAsExpletive
        langBuilder.sayAsFraction
        langBuilder.sayAsOrdinal
        langBuilder.sayAsTelephone
        langBuilder.sayAsTime
        langBuilder.sayAsUnit
        langBuilder.sayAsInterjection
        langBuilder.sentence
        langBuilder.sub
        langBuilder.voice
        langBuilder.voiceFromSkillLocale
        langBuilder.word
    })
    .paragraph(paragraphBuilder => {
        paragraphBuilder.whisper

        paragraphBuilder.text // always available in builder
        paragraphBuilder.audio
        paragraphBuilder.audioSoundbank
        paragraphBuilder.break
        paragraphBuilder.emphasis
        paragraphBuilder.emphasisDefault
        paragraphBuilder.lang
        paragraphBuilder.phonemeIPA
        paragraphBuilder.phonemeXSampa
        paragraphBuilder.phonemeAnyLanguageIPA
        paragraphBuilder.phonemeAnyLanguageXSampa
        paragraphBuilder.phonemeLanguageIPA
        paragraphBuilder.phonemeLanguageXSampa
        paragraphBuilder.prosodyPitch
        paragraphBuilder.prosodyPitchAndRate
        paragraphBuilder.prosodyPitchRateVolume
        paragraphBuilder.prosodyRate
        paragraphBuilder.prosodyRateVolume
        paragraphBuilder.prosodyVolume
        paragraphBuilder.sayAsAddress
        paragraphBuilder.sayAsCardinal
        paragraphBuilder.sayAsCharacters
        paragraphBuilder.sayAsDate
        paragraphBuilder.sayAsDigits
        paragraphBuilder.sayAsExpletive
        paragraphBuilder.sayAsFraction
        paragraphBuilder.sayAsOrdinal
        paragraphBuilder.sayAsTelephone
        paragraphBuilder.sayAsTime
        paragraphBuilder.sayAsUnit
        paragraphBuilder.sayAsInterjection
        paragraphBuilder.sentence
        paragraphBuilder.sub
        paragraphBuilder.voice
        paragraphBuilder.voiceFromSkillLocale
        paragraphBuilder.word
        
        // @ts-expect-error
        paragraphBuilder.paragraph
    })

    .phonemeIPA("an ipa phoneme")
    .phonemeXSampa("an x-sampa phoneme")
    .phonemeAnyLanguageIPA()
    .phonemeAnyLanguageXSampa()
    .phonemeLanguageIPA()
    .phonemeLanguageXSampa()

    .prosodyPitch("high", prosodyPitchBuilder => {
        prosodyPitchBuilder.whisper

        prosodyPitchBuilder.text // always available in builder
        prosodyPitchBuilder.audio
        prosodyPitchBuilder.audioSoundbank
        prosodyPitchBuilder.break
        prosodyPitchBuilder.emphasis
        prosodyPitchBuilder.emphasisDefault
        prosodyPitchBuilder.lang
        prosodyPitchBuilder.paragraph
        prosodyPitchBuilder.phonemeIPA
        prosodyPitchBuilder.phonemeXSampa
        prosodyPitchBuilder.phonemeAnyLanguageIPA
        prosodyPitchBuilder.phonemeAnyLanguageXSampa
        prosodyPitchBuilder.phonemeLanguageIPA
        prosodyPitchBuilder.phonemeLanguageXSampa
        prosodyPitchBuilder.prosodyPitch
        prosodyPitchBuilder.prosodyPitchAndRate
        prosodyPitchBuilder.prosodyPitchRateVolume
        prosodyPitchBuilder.prosodyRate
        prosodyPitchBuilder.prosodyRateVolume
        prosodyPitchBuilder.prosodyVolume
        prosodyPitchBuilder.sayAsAddress
        prosodyPitchBuilder.sayAsCardinal
        prosodyPitchBuilder.sayAsCharacters
        prosodyPitchBuilder.sayAsDate
        prosodyPitchBuilder.sayAsDigits
        prosodyPitchBuilder.sayAsExpletive
        prosodyPitchBuilder.sayAsFraction
        prosodyPitchBuilder.sayAsOrdinal
        prosodyPitchBuilder.sayAsTelephone
        prosodyPitchBuilder.sayAsTime
        prosodyPitchBuilder.sayAsUnit
        prosodyPitchBuilder.sayAsInterjection
        prosodyPitchBuilder.sentence
        prosodyPitchBuilder.sub
        prosodyPitchBuilder.voice
        prosodyPitchBuilder.voiceFromSkillLocale
        prosodyPitchBuilder.word
    })
    .prosodyPitchAndRate("low","fast", prosodyPitchBuilder => {
        prosodyPitchBuilder.whisper

        prosodyPitchBuilder.text // always available in builder
        prosodyPitchBuilder.audio
        prosodyPitchBuilder.audioSoundbank
        prosodyPitchBuilder.break
        prosodyPitchBuilder.emphasis
        prosodyPitchBuilder.emphasisDefault
        prosodyPitchBuilder.lang
        prosodyPitchBuilder.paragraph
        prosodyPitchBuilder.phonemeIPA
        prosodyPitchBuilder.phonemeXSampa
        prosodyPitchBuilder.phonemeAnyLanguageIPA
        prosodyPitchBuilder.phonemeAnyLanguageXSampa
        prosodyPitchBuilder.phonemeLanguageIPA
        prosodyPitchBuilder.phonemeLanguageXSampa
        prosodyPitchBuilder.prosodyPitch
        prosodyPitchBuilder.prosodyPitchAndRate
        prosodyPitchBuilder.prosodyPitchRateVolume
        prosodyPitchBuilder.prosodyRate
        prosodyPitchBuilder.prosodyRateVolume
        prosodyPitchBuilder.prosodyVolume
        prosodyPitchBuilder.sayAsAddress
        prosodyPitchBuilder.sayAsCardinal
        prosodyPitchBuilder.sayAsCharacters
        prosodyPitchBuilder.sayAsDate
        prosodyPitchBuilder.sayAsDigits
        prosodyPitchBuilder.sayAsExpletive
        prosodyPitchBuilder.sayAsFraction
        prosodyPitchBuilder.sayAsOrdinal
        prosodyPitchBuilder.sayAsTelephone
        prosodyPitchBuilder.sayAsTime
        prosodyPitchBuilder.sayAsUnit
        prosodyPitchBuilder.sayAsInterjection
        prosodyPitchBuilder.sentence
        prosodyPitchBuilder.sub
        prosodyPitchBuilder.voice
        prosodyPitchBuilder.voiceFromSkillLocale
        prosodyPitchBuilder.word
    })
    .prosodyPitchRateVolume("low","fast","loud", prosodyPitchBuilder => {
        prosodyPitchBuilder.whisper

        prosodyPitchBuilder.text // always available in builder
        prosodyPitchBuilder.audio
        prosodyPitchBuilder.audioSoundbank
        prosodyPitchBuilder.break
        prosodyPitchBuilder.emphasis
        prosodyPitchBuilder.emphasisDefault
        prosodyPitchBuilder.lang
        prosodyPitchBuilder.paragraph
        prosodyPitchBuilder.phonemeIPA
        prosodyPitchBuilder.phonemeXSampa
        prosodyPitchBuilder.phonemeAnyLanguageIPA
        prosodyPitchBuilder.phonemeAnyLanguageXSampa
        prosodyPitchBuilder.phonemeLanguageIPA
        prosodyPitchBuilder.phonemeLanguageXSampa
        prosodyPitchBuilder.prosodyPitch
        prosodyPitchBuilder.prosodyPitchAndRate
        prosodyPitchBuilder.prosodyPitchRateVolume
        prosodyPitchBuilder.prosodyRate
        prosodyPitchBuilder.prosodyRateVolume
        prosodyPitchBuilder.prosodyVolume
        prosodyPitchBuilder.sayAsAddress
        prosodyPitchBuilder.sayAsCardinal
        prosodyPitchBuilder.sayAsCharacters
        prosodyPitchBuilder.sayAsDate
        prosodyPitchBuilder.sayAsDigits
        prosodyPitchBuilder.sayAsExpletive
        prosodyPitchBuilder.sayAsFraction
        prosodyPitchBuilder.sayAsOrdinal
        prosodyPitchBuilder.sayAsTelephone
        prosodyPitchBuilder.sayAsTime
        prosodyPitchBuilder.sayAsUnit
        prosodyPitchBuilder.sayAsInterjection
        prosodyPitchBuilder.sentence
        prosodyPitchBuilder.sub
        prosodyPitchBuilder.voice
        prosodyPitchBuilder.voiceFromSkillLocale
        prosodyPitchBuilder.word
    })
    .prosodyRate("fast",prosodySafeBuilder => {
        prosodySafeBuilder.whisper

        prosodySafeBuilder.text // always available in builder
        prosodySafeBuilder.audio
        prosodySafeBuilder.audioSoundbank
        prosodySafeBuilder.break
        prosodySafeBuilder.emphasis
        prosodySafeBuilder.emphasisDefault
        prosodySafeBuilder.lang
        prosodySafeBuilder.paragraph
        prosodySafeBuilder.phonemeIPA
        prosodySafeBuilder.phonemeXSampa
        prosodySafeBuilder.phonemeAnyLanguageIPA
        prosodySafeBuilder.phonemeAnyLanguageXSampa
        prosodySafeBuilder.phonemeLanguageIPA
        prosodySafeBuilder.phonemeLanguageXSampa
        prosodySafeBuilder.prosodyPitch
        prosodySafeBuilder.prosodyPitchAndRate
        prosodySafeBuilder.prosodyPitchRateVolume
        prosodySafeBuilder.prosodyRate
        prosodySafeBuilder.prosodyRateVolume
        prosodySafeBuilder.prosodyVolume
        prosodySafeBuilder.sayAsAddress
        prosodySafeBuilder.sayAsCardinal
        prosodySafeBuilder.sayAsCharacters
        prosodySafeBuilder.sayAsDate
        prosodySafeBuilder.sayAsDigits
        prosodySafeBuilder.sayAsExpletive
        prosodySafeBuilder.sayAsFraction
        prosodySafeBuilder.sayAsOrdinal
        prosodySafeBuilder.sayAsTelephone
        prosodySafeBuilder.sayAsTime
        prosodySafeBuilder.sayAsUnit
        prosodySafeBuilder.sayAsInterjection
        prosodySafeBuilder.sentence
        prosodySafeBuilder.sub
        prosodySafeBuilder.voice
        prosodySafeBuilder.voiceFromSkillLocale
        prosodySafeBuilder.word
    })
    .prosodyVolume("loud", prosodySafeBuilder => {
        prosodySafeBuilder.whisper

        prosodySafeBuilder.text // always available in builder
        prosodySafeBuilder.audio
        prosodySafeBuilder.audioSoundbank
        prosodySafeBuilder.break
        prosodySafeBuilder.emphasis
        prosodySafeBuilder.emphasisDefault
        prosodySafeBuilder.lang
        prosodySafeBuilder.paragraph
        prosodySafeBuilder.phonemeIPA
        prosodySafeBuilder.phonemeXSampa
        prosodySafeBuilder.phonemeAnyLanguageIPA
        prosodySafeBuilder.phonemeAnyLanguageXSampa
        prosodySafeBuilder.phonemeLanguageIPA
        prosodySafeBuilder.phonemeLanguageXSampa
        prosodySafeBuilder.prosodyPitch
        prosodySafeBuilder.prosodyPitchAndRate
        prosodySafeBuilder.prosodyPitchRateVolume
        prosodySafeBuilder.prosodyRate
        prosodySafeBuilder.prosodyRateVolume
        prosodySafeBuilder.prosodyVolume
        prosodySafeBuilder.sayAsAddress
        prosodySafeBuilder.sayAsCardinal
        prosodySafeBuilder.sayAsCharacters
        prosodySafeBuilder.sayAsDate
        prosodySafeBuilder.sayAsDigits
        prosodySafeBuilder.sayAsExpletive
        prosodySafeBuilder.sayAsFraction
        prosodySafeBuilder.sayAsOrdinal
        prosodySafeBuilder.sayAsTelephone
        prosodySafeBuilder.sayAsTime
        prosodySafeBuilder.sayAsUnit
        prosodySafeBuilder.sayAsInterjection
        prosodySafeBuilder.sentence
        prosodySafeBuilder.sub
        prosodySafeBuilder.voice
        prosodySafeBuilder.voiceFromSkillLocale
        prosodySafeBuilder.word
    })
    .prosodyRateVolume("fast","loud",prosodySafeBuilder => {
        prosodySafeBuilder.whisper

        prosodySafeBuilder.text // always available in builder
        prosodySafeBuilder.audio
        prosodySafeBuilder.audioSoundbank
        prosodySafeBuilder.break
        prosodySafeBuilder.emphasis
        prosodySafeBuilder.emphasisDefault
        prosodySafeBuilder.lang
        prosodySafeBuilder.paragraph
        prosodySafeBuilder.phonemeIPA
        prosodySafeBuilder.phonemeXSampa
        prosodySafeBuilder.phonemeAnyLanguageIPA
        prosodySafeBuilder.phonemeAnyLanguageXSampa
        prosodySafeBuilder.phonemeLanguageIPA
        prosodySafeBuilder.phonemeLanguageXSampa
        prosodySafeBuilder.prosodyPitch
        prosodySafeBuilder.prosodyPitchAndRate
        prosodySafeBuilder.prosodyPitchRateVolume
        prosodySafeBuilder.prosodyRate
        prosodySafeBuilder.prosodyRateVolume
        prosodySafeBuilder.prosodyVolume
        prosodySafeBuilder.sayAsAddress
        prosodySafeBuilder.sayAsCardinal
        prosodySafeBuilder.sayAsCharacters
        prosodySafeBuilder.sayAsDate
        prosodySafeBuilder.sayAsDigits
        prosodySafeBuilder.sayAsExpletive
        prosodySafeBuilder.sayAsFraction
        prosodySafeBuilder.sayAsOrdinal
        prosodySafeBuilder.sayAsTelephone
        prosodySafeBuilder.sayAsTime
        prosodySafeBuilder.sayAsUnit
        prosodySafeBuilder.sayAsInterjection
        prosodySafeBuilder.sentence
        prosodySafeBuilder.sub
        prosodySafeBuilder.voice
        prosodySafeBuilder.voiceFromSkillLocale
        prosodySafeBuilder.word
    })

    .sayAsAddress("address")
    .sayAsCardinal("cardinal")
    .sayAsCharacters("characters")
    .sayAsDate("date","dmy")
    .sayAsDigits("digits")
    .sayAsExpletive("expletive")
    .sayAsFraction("fraction")
    .sayAsInterjection(null as any)
    .sayAsOrdinal("oridinal")
    .sayAsTelephone("telephone")
    .sayAsTime("time")
    .sayAsUnit("unit")
    
    .sentence(sentenceBuilder => {
        sentenceBuilder.whisper

        sentenceBuilder.text // always available in builder
        sentenceBuilder.audio
        sentenceBuilder.audioSoundbank
        sentenceBuilder.break
        sentenceBuilder.emphasis
        sentenceBuilder.emphasisDefault
        sentenceBuilder.lang
        sentenceBuilder.phonemeIPA
        sentenceBuilder.phonemeXSampa
        sentenceBuilder.phonemeAnyLanguageIPA
        sentenceBuilder.phonemeAnyLanguageXSampa
        sentenceBuilder.phonemeLanguageIPA
        sentenceBuilder.phonemeLanguageXSampa
        sentenceBuilder.prosodyPitch
        sentenceBuilder.prosodyPitchAndRate
        sentenceBuilder.prosodyPitchRateVolume
        sentenceBuilder.prosodyRate
        sentenceBuilder.prosodyRateVolume
        sentenceBuilder.prosodyVolume
        sentenceBuilder.sayAsAddress
        sentenceBuilder.sayAsCardinal
        sentenceBuilder.sayAsCharacters
        sentenceBuilder.sayAsDate
        sentenceBuilder.sayAsDigits
        sentenceBuilder.sayAsExpletive
        sentenceBuilder.sayAsFraction
        sentenceBuilder.sayAsOrdinal
        sentenceBuilder.sayAsTelephone
        sentenceBuilder.sayAsTime
        sentenceBuilder.sayAsUnit
        sentenceBuilder.sayAsInterjection
        sentenceBuilder.sub
        sentenceBuilder.voice
        sentenceBuilder.voiceFromSkillLocale
        sentenceBuilder.word
        
        // @ts-expect-error
        sentenceBuilder.paragraph
        // @ts-expect-error
        sentenceBuilder.sentence
    })
    .sub("alias","aliased")
    .text("text") // always available

    .voice("Amy",voiceBuilder => {
        voiceBuilder.whisper

        voiceBuilder.text // always available in builder
        voiceBuilder.audio
        voiceBuilder.audioSoundbank
        voiceBuilder.break
        voiceBuilder.emphasis
        voiceBuilder.emphasisDefault
        voiceBuilder.lang
        voiceBuilder.paragraph
        voiceBuilder.phonemeIPA
        voiceBuilder.phonemeXSampa
        voiceBuilder.phonemeAnyLanguageIPA
        voiceBuilder.phonemeAnyLanguageXSampa
        voiceBuilder.phonemeLanguageIPA
        voiceBuilder.phonemeLanguageXSampa
        voiceBuilder.prosodyPitch
        voiceBuilder.prosodyPitchAndRate
        voiceBuilder.prosodyPitchRateVolume
        voiceBuilder.prosodyRate
        voiceBuilder.prosodyRateVolume
        voiceBuilder.prosodyVolume
        voiceBuilder.sayAsAddress
        voiceBuilder.sayAsCardinal
        voiceBuilder.sayAsCharacters
        voiceBuilder.sayAsDate
        voiceBuilder.sayAsDigits
        voiceBuilder.sayAsExpletive
        voiceBuilder.sayAsFraction
        voiceBuilder.sayAsOrdinal
        voiceBuilder.sayAsTelephone
        voiceBuilder.sayAsTime
        voiceBuilder.sayAsUnit
        
        voiceBuilder.sentence
        voiceBuilder.sub
        voiceBuilder.voice
        voiceBuilder.voiceFromSkillLocale
        voiceBuilder.word

        // @ts-expect-error - speechcon incompatible tags
        voiceBuilder.sayAsInterjection
    })
    .voiceFromSkillLocale("Mizuki",voiceBuilder => {
        voiceBuilder.whisper

        voiceBuilder.text // always available in builder
        voiceBuilder.audio
        voiceBuilder.audioSoundbank
        voiceBuilder.break
        voiceBuilder.emphasis
        voiceBuilder.emphasisDefault
        voiceBuilder.lang
        voiceBuilder.paragraph
        voiceBuilder.phonemeIPA
        voiceBuilder.phonemeXSampa
        voiceBuilder.phonemeAnyLanguageIPA
        voiceBuilder.phonemeAnyLanguageXSampa
        voiceBuilder.phonemeLanguageIPA
        voiceBuilder.phonemeLanguageXSampa
        voiceBuilder.prosodyPitch
        voiceBuilder.prosodyPitchAndRate
        voiceBuilder.prosodyPitchRateVolume
        voiceBuilder.prosodyRate
        voiceBuilder.prosodyRateVolume
        voiceBuilder.prosodyVolume
        voiceBuilder.sayAsAddress
        voiceBuilder.sayAsCardinal
        voiceBuilder.sayAsCharacters
        voiceBuilder.sayAsDate
        voiceBuilder.sayAsDigits
        voiceBuilder.sayAsExpletive
        voiceBuilder.sayAsFraction
        voiceBuilder.sayAsOrdinal
        voiceBuilder.sayAsTelephone
        voiceBuilder.sayAsTime
        voiceBuilder.sayAsUnit
        voiceBuilder.sayAsInterjection
        voiceBuilder.sentence
        voiceBuilder.sub
        voiceBuilder.voice
        voiceBuilder.voiceFromSkillLocale
        voiceBuilder.word
    })
    
    .whisper(whisperBuilder => {
        // @ts-expect-error
        whisperBuilder.whisper // given that cannot un-whisper - does not make sense to repeat

        whisperBuilder.text // always available in builder
        whisperBuilder.audio
        whisperBuilder.audioSoundbank
        whisperBuilder.break
        whisperBuilder.emphasis // has effect
        whisperBuilder.emphasisDefault // has effect
        whisperBuilder.lang
        whisperBuilder.phonemeIPA
        whisperBuilder.phonemeXSampa
        whisperBuilder.phonemeAnyLanguageIPA
        whisperBuilder.phonemeAnyLanguageXSampa
        whisperBuilder.phonemeLanguageIPA
        whisperBuilder.phonemeLanguageXSampa
        // all prosdy have effect
        whisperBuilder.prosodyPitch 
        whisperBuilder.prosodyPitchAndRate
        whisperBuilder.prosodyPitchRateVolume
        whisperBuilder.prosodyRate
        whisperBuilder.prosodyRateVolume
        whisperBuilder.prosodyVolume
        whisperBuilder.sayAsAddress
        whisperBuilder.sayAsCardinal
        whisperBuilder.sayAsCharacters
        whisperBuilder.sayAsDate
        whisperBuilder.sayAsDigits
        whisperBuilder.sayAsExpletive
        whisperBuilder.sayAsFraction
        whisperBuilder.sayAsOrdinal
        whisperBuilder.sayAsTelephone
        whisperBuilder.sayAsTime
        whisperBuilder.sayAsUnit
        whisperBuilder.sayAsInterjection
        whisperBuilder.sub
        whisperBuilder.voice
        whisperBuilder.voiceFromSkillLocale
        whisperBuilder.word
        whisperBuilder.paragraph
        whisperBuilder.sentence
    })
    .word(WordRole.Noun,wordBuilder => {
        wordBuilder.whisper

        
        wordBuilder.text // always available in builder
        
        wordBuilder.emphasis
        wordBuilder.emphasisDefault
        
        wordBuilder.prosodyPitch
        wordBuilder.prosodyPitchAndRate
        wordBuilder.prosodyPitchRateVolume
        wordBuilder.prosodyRate
        wordBuilder.prosodyRateVolume
        wordBuilder.prosodyVolume
        
        wordBuilder.sub

        // @ts-expect-error
        wordBuilder.audio
        // @ts-expect-error
        wordBuilder.audioSoundbank
        // @ts-expect-error
        wordBuilder.break
        // @ts-expect-error
        wordBuilder.phonemeIPA
        // @ts-expect-error
        wordBuilder.phonemeXSampa
        // @ts-expect-error
        wordBuilder.phonemeLanguageIPA
        // @ts-expect-error
        wordBuilder.phonemeLanguageXSampa
        // @ts-expect-error
        wordBuilder.sayAsAddress
        // @ts-expect-error
        wordBuilder.sayAsCardinal
        // @ts-expect-error
        wordBuilder.sayAsCharacters
        // @ts-expect-error
        wordBuilder.sayAsDate
        // @ts-expect-error
        wordBuilder.sayAsDigits
        // @ts-expect-error
        wordBuilder.sayAsExpletive
        // @ts-expect-error
        wordBuilder.sayAsFraction
        // @ts-expect-error
        wordBuilder.sayAsOrdinal
        // @ts-expect-error
        wordBuilder.sayAsTelephone
        // @ts-expect-error
        wordBuilder.sayAsTime
        // @ts-expect-error
        wordBuilder.sayAsUnit
        // @ts-expect-error
        wordBuilder.sayAsInterjection

        // W3 prohibits
        // @ts-expect-error
        wordBuilder.voice
        // @ts-expect-error
        wordBuilder.voiceFromSkillLocale
        // @ts-expect-error
        wordBuilder.word
        // @ts-expect-error
        wordBuilder.lang
        // @ts-expect-error
        wordBuilder.paragraph
        // @ts-expect-error
        wordBuilder.sentence
    })

// #region incompatible tags - demo that applies at any depth

// #region voice prohibits

    jaJpBuilder.sayAsInterjection
    jaJpBuilder.voice("Amy",builder => {
        // @ts-expect-error
        builder.sayAsInterjection
        builder.paragraph(builder2 => {
            // @ts-expect-error
            builder2.sayAsInterjection
        })
    });

// #endregion

// #endregion
