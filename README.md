# What is it ?

A typescript ssml builder for producing [Alexa conforming SSML.](https://developer.amazon.com/en-US/docs/alexa/custom-skills/speech-synthesis-markup-language-ssml-reference.html)

Character escaping provided.

You do not add `<speak>`


# Usage

1. Create the builder for the skill locale

```
const jaJpBuilder = createBuilder<"ja-JP">();

```

2. Add SSML elements or text.  

Immediate descendants of `<speak>` can be added from the root builder you create.

```
jpBuilder
    .text("This will be spoken.")
    .paragraph("As will this, as a paragraph.")

```

To descendend further into the SSML tree provide a callback ( for those elements that can have child elements)

```
jpBuilder.paragraph(paragraphBuilder => paragraphBuilder.sentence("A sentence in a paragraph."))
```

3. Call build on the root builder to obtain the SSML string.

```
    const ssml = jpBuilder.build();
```

# Features

The available methods are typescript picked from the `SSMLBuilder` interface below.

Do not concern yourself with the generics.  These are used for picking the methods that are available on the root builder and the builders in the callbacks.

Additional helper methods.

`voiceFromSkillLocale` will restrict the voice names available to the skill locale.

`audioSoundbank` is to be used with the exported soundbank object.

```
export const soundbank = 
        {
  "air": {
    "fire_extinguisher": {
      "fire_extinguisher_1": {
        "duration": 1.62,
        "soundbankUrl": "soundbank://soundlibrary/air/fire_extinguisher/fire_extinguisher_01"
      },
```

There are multiple phoneme methods.  There will be one for ipa and one for xsampa.
The methods that take an array are typesafe.  `phonemeAnyLanguageIPA` permits any ipa phoneme from any of the [languages](https://developer.amazon.com/en-US/docs/alexa/custom-skills/speech-synthesis-markup-language-ssml-reference.html#supported-symbols)
whereas `phonemeLanguageIPA` restricts to the phonemes for a locale.
If the lang tag has been specified then the phonemes will be for that locale.  If a voice is in place then the phonemes will be for the locale of the voice. Otherwise the locale is the skill locale.  

There is a "sayAs" method for each of the interpret-as values.

`sayAsInterjection` is retricted to speechcons for the lang or for the skill locale. 

The alexa amazon SSML extensions each have their own method.

Where a method arguments are restricted, there will be a type union or enumeration.

Note that prosody has multiple methods to distinguish pitch which has restrictions.

```
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

    fun(textOrCallback:TextOrBuilderCallback<FunBuilderMethods,TSkillLocale,TVoice,TLang>) : TReturn 
    conversational(textOrCallback:TextOrBuilderCallback<ConversationalBuilderMethods,TSkillLocale,TVoice,TLang>) : TReturn
    longForm(textOrCallback:TextOrBuilderCallback<LongFormBuilderMethods,TSkillLocale,TVoice,TLang>) : TReturn
    music(textOrCallback:TextOrBuilderCallback<MusicBuilderMethods,TSkillLocale,TVoice,TLang>) : TReturn
    news(textOrCallback:TextOrBuilderCallback<NewsBuilderMethods,TSkillLocale,TVoice,TLang>) : TReturn
    emotion(name:Emotion,intensity:EmotionIntensity,textOrCallback:TextOrBuilderCallback<EmotionBuilderMethods,TSkillLocale,TVoice,TLang>) : TReturn
    whisper(textOrCallback:TextOrBuilderCallback<WhisperBuilderMethods,TSkillLocale,TVoice,TLang>) : TReturn

    break(strength?:BreakStrength,milliseconds?:number):TReturn
    paragraph(textOrCallback:TextOrBuilderCallback<ParagraphBuilderMethods,TSkillLocale,TVoice,TLang>) : TReturn
    sentence(textOrCallback:TextOrBuilderCallback<SentenceBuilderMethods,TSkillLocale,TVoice,TLang>) : TReturn
    
    word(role:WordRole,textOrCallback:TextOrBuilderCallback<WordBuilderMethods,TSkillLocale,TVoice,TLang>) : TReturn
    
    sub(alias:string,aliased:string) : TReturn

    audio(src:string):TReturn;
    audioSoundbank(soundBankSound:SoundbankSound) : TReturn

    emphasis(level:EmphasisLevel,textOrCallback:TextOrBuilderCallback<EmphasisBuilderMethods,TSkillLocale,TVoice,TLang>):TReturn;
    emphasisDefault(textOrCallback:TextOrBuilderCallback<EmphasisBuilderMethods,TSkillLocale,TVoice,TLang>):TReturn;

    prosodyRate(rate:ProsodyRate,textOrCallback:TextOrBuilderCallback<ProsodySafeBuilderMethods,TSkillLocale,TVoice,TLang>):TReturn
    prosodyVolume(volume:ProsodyVolume,textOrCallback:TextOrBuilderCallback<ProsodySafeBuilderMethods,TSkillLocale,TVoice,TLang>):TReturn
    prosodyRateVolume(rate:ProsodyRate,volume:ProsodyVolume,textOrCallback:TextOrBuilderCallback<ProsodySafeBuilderMethods,TSkillLocale,TVoice,TLang>):TReturn
    prosodyPitch(pitch:ProsodyPitch,textOrCallback:TextOrBuilderCallback<ProsodyPitchBuilderMethods,TSkillLocale,TVoice,TLang>):TReturn
    prosodyPitchAndRate(pitch:ProsodyPitch,rate:ProsodyRate,textOrCallback:TextOrBuilderCallback<ProsodyPitchBuilderMethods,TSkillLocale,TVoice,TLang>):TReturn
    prosodyPitchRateVolume(pitch:ProsodyPitch,rate:ProsodyRate,volume:ProsodyVolume,textOrCallback:TextOrBuilderCallback<ProsodyPitchBuilderMethods,TSkillLocale,TVoice,TLang>):TReturn

    phonemeIPA(phonetic:string,text?:string):TReturn
    phonemeXSampa(phonetic:string,text?:string):TReturn
    phonemeAnyLanguageIPA(...phonemes:IpaPhonemes[]):TReturn
    phonemeAnyLanguageXSampa(...phonemes:XSampaPhonemes[]):TReturn
    phonemeLanguageIPA(...phonemes:IpaLangPhoneme<TSkillLocale,TVoice,TLang>[]):TReturn
    phonemeLanguageXSampa(...phonemes:XSampaLangPhoneme<TSkillLocale,TVoice,TLang>[]):TReturn
    
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
}
export type AllBuilderMethods = keyof SSMLBuilder<"en-GB">

```

# Incompatible tags

The Alex SSML documentation has a section on [Incompatible tags.](https://developer.amazon.com/en-US/docs/alexa/custom-skills/speech-synthesis-markup-language-ssml-reference.html#incompatible-tags) 

Note that this page has consistencies with regards to amazon domain conversational.

In one section it says 

> you **must** combine conversational with Matthew or Joanna. 

Then later 

> You **can** also use this style with Amazon Polly voices. 


This should be can and the builder works in this way.

## Skill locale / voice

For the amazon tags that are for specified skill locales only - emotion, fun, music and longForm.

These tags will be allowed for the supported locales, disallowed for unsupported locales and disallowed if switched voice.

For tags that can be for defined skill locales or voices - conversational and news. 

These tags will be allowed for supported locales and supported voices and disallowed for unsupported locales and unsupported voices.

```
jaJpBuilder.fun

jaJpBuilder.voice("Joanna", builder => {
    // @ts-expect-error
    builder.fun
});

// @ts-expect-error
deDEBuilder.fun

// @ts-expect-error
jaJpBuilder.news

([Matthew,Joanna, Lupe).forEach(newsVoice => {
    jaJpBuilder.voice(newsVoice,builder => builder.news);
});
```

Note that although it is valid SSML to switch to a supported voice inside an amazon tag it is not currently supported here.

## voice, emphasis, prosody pitch, speechcons, amazon:emotion, amazon:domain

Although the docs state that they cannot be used together some of them do work, but for now the typescript adheres to these rules.



