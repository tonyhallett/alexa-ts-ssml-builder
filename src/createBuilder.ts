import { RestrictedBuilder } from "./restrictedBuilder";
import {
  AllBuilderMethods,
  Default,
  LangOrDefault,
  SSMLBuilder,
  VoiceNamesOrDefault,
} from "./ssmlBuilder";
import {
  ConversationalBuilderMethods,
  EmotionBuilderMethods,
  EmphasisBuilderMethods,
  FunBuilderMethods,
  LangBuilderMethods,
  LongFormBuilderMethods,
  MusicBuilderMethods,
  NewsBuilderMethods,
  ParagraphBuilderMethods,
  ProsodyPitchBuilderMethods,
  ProsodySafeBuilderMethods,
  SentenceBuilderMethods,
  VoiceBuilderMethods,
  WhisperBuilderMethods,
  WordBuilderMethods,
} from "./ssmlBuilder-config";
import {
  Emotion,
  EmotionIntensity,
  BreakStrength,
  WordRole,
  SoundbankSound,
  EmphasisLevel,
  ProsodyRate,
  ProsodyVolume,
  ProsodyPitch,
  SayAsDateFormat,
  AllSpeechcons,
  IpaPhonemes,
  XSampaPhonemes,
} from "./ssmlTypes";
import { TextOrBuilderCallback } from "./textOrBuilderCallback";
import { AllVoiceNames, LangLocale } from "./voices";

export type RootBuilder<TSkillLocale extends LangLocale> = RestrictedBuilder<
  AllBuilderMethods,
  TSkillLocale,
  Default,
  Default,
  Default,
  "Build"
>;

interface TextNode{
  isText:true,
  text:string
}

interface Attribute{
  name:string,
  value:string
}

interface ElementNode{
  isText:false,
  elementName:string,
  attributes?:Attribute[]
  getChildren?:() => Node[]
}

type Node = TextNode | ElementNode;

// from Alexa.escapeXmlCharacters

//todo
// is there an attribute value that needs escaping ?
// preferable (for readability ) not to escape double quoutes in text content.
// assumption - does not matter if escape double quotation marks.  But for a sentence 
// with single quotes could they be considered two apostrophes ?
// the first is not preceded by a letter so should not be considered.
// that then should make the second a quotation when it could have been deemed a plural ?
// example - 'this is in quotes' 
// can the backtick be used as an apostrophe ? Tony`s


/*
  https://docs.aws.amazon.com/polly/latest/dg/escapees.html
  For the &, <, and > symbols, escape codes are always necessary when you use SSML. 
  Additionallty, when you use the apostrophe/single quotation mark (') as an apostrophe, you must also use the escape code.

However, when you use the double quotation mark ("), or the apostrophe/single quotation mark (') as a quotation mark, 
then whether or not you use the escape code is dependent on context.

Double quotation marks

  Must be escaped when in a attribute value delimited by double quotes.
  Do not need to be escaped when in textual context
  Do not need to be escaped when in a attribute value delimited by single quotes.

Single quotation marks

  Must be escaped when used as an apostrophe. 
  Do not need to be escaped when in textual context.
  Do not need to be escaped when in a code attribute delimited by double quotes.


*/
const invalidXmlCharactersMapping = {
  '&' : '&amp;',
  '<' : '&lt;',
  '>' : '&gt;',
  '"' : '&quot;',
  "'" : '&apos;',
};

const invalidXmlCharactersMappingReverse = {
  '&amp;':'&',
  '&lt;':'<',
  '&gt;':'>',
  '&quot;':'"',
  '&apos;':"'",
};

/**
 * return the string with all invalid XML characters escaped
 * @param input
 */
export function escapeXmlCharacters(input : string) : string {
  // sanitize any already escaped character to ensure they are not escaped more than once
  const sanitizedInput = input.replace(/&amp;|&lt;|&gt;|&quot;|&apos;]/g, (c) => invalidXmlCharactersMappingReverse[c as keyof typeof invalidXmlCharactersMappingReverse ]);

  return sanitizedInput.replace(/[&'"><]/g, (c) => invalidXmlCharactersMapping[c as keyof typeof invalidXmlCharactersMapping]);
}

// implement when finished
export class AlexaSSMLBuilder
  implements
    SSMLBuilder<
      LangLocale,
      VoiceNamesOrDefault,
      LangOrDefault,
      "default",
      AlexaSSMLBuilder
    >
{
  private nodes:Node[] = [];
  constructor(private escapeInvalidXML = true, private isRoot = false){
    
  }
  
  private domain(name:string,textOrCallback:any){
    return this.handleTextOrCallback(textOrCallback,"amazon:domain",[{name:"name",value:name}]);
  }

  private handleTextOrCallback(textOrCallback:string|any,elementName:string,attributes?:Attribute[]){
    if (typeof textOrCallback === "string") {
      this.nodes.push({isText:false,attributes,elementName,getChildren:() =>[this.getTextNode(textOrCallback)]})
    } else {
      const newBuilder = new AlexaSSMLBuilder();
      this.nodes.push({isText:false,attributes,elementName,getChildren:() =>{
        return newBuilder.nodes;
      }})
      textOrCallback(newBuilder);
    }
    return this;
  }

  private getNodeSSML(node:Node){
    if(node.isText){
      let text = node.text;
      if(this.escapeInvalidXML){
        text = escapeXmlCharacters(text);
      }
      return text;
    }

    let attributes = "";
    if(node.attributes){
      node.attributes.forEach(attribute =>{
        let attValue = attribute.value;
        if(this.escapeInvalidXML){
          attValue = escapeXmlCharacters(attValue);
        }
        attributes+=` ${attribute.name}="${attValue}"`
      })
    }
    if(node.getChildren){
      const childrenSSML = this.getNodesSSML(node.getChildren());
      return `<${node.elementName}${attributes}>${childrenSSML}</${node.elementName}>`
    }
    
    return `<${node.elementName}${attributes}/>`
  }

  private getNodesSSML(nodes:Node[]):string{
    let ssml = "";    
    nodes.forEach(node =>{
      ssml += this.getNodeSSML(node);
    })
    return ssml;
  }

  private getTextNode(text:string):TextNode{
    return {isText:true,text};
  }

  private prosodyRateAttribute(rate:ProsodyRate):Attribute{
    let rateValue:string;
    if (typeof rate === "number") {
      rateValue = `${rate}%`;
    } else{
      rateValue = rate;
    }
    return {name:"rate", value:rateValue}
  }

  private prosodyPitchAttribute(pitch:ProsodyPitch):Attribute{
    let pitchValue:string;
    if (typeof pitch === "number") {
      pitchValue = `${pitch}%`;
    } else{
      pitchValue = pitch;
    }
    return {name:"pitch", value:pitchValue}
  }

  private prosodyVolumeAttribute(volume:ProsodyVolume):Attribute{
    let rateValue:string;
    if (typeof volume === "number") {
      rateValue = `${volume}dB`;
    } else{
      rateValue = volume;
    }
    return {name:"volume", value:rateValue}
  }

  build() :string {    
    if(!this.isRoot){
      throw new Error("Build to only be called from the root builder");
    }
    return  `<speak>${this.getNodesSSML(this.nodes)}</speak>`
  }

  text(text: string): AlexaSSMLBuilder {
    this.nodes.push(this.getTextNode(text));
    return this;
  }
  
  voice<TNewVoice extends AllVoiceNames>(
    name: TNewVoice,
    textOrCallback: TextOrBuilderCallback<
      VoiceBuilderMethods,
      LangLocale,
      TNewVoice,
      LangOrDefault,
      "default"
    >
  ): AlexaSSMLBuilder {
    return this.handleTextOrCallback(textOrCallback,"voice",[{name:"name",value:name}]);
  }
  voiceFromSkillLocale<TNewVoice extends AllVoiceNames>(
    name: TNewVoice,
    textOrCallback: TextOrBuilderCallback<
      VoiceBuilderMethods,
      LangLocale,
      TNewVoice,
      LangOrDefault,
      "default"
    >
  ): AlexaSSMLBuilder {
    return this.voice(name,textOrCallback);
  }
  lang<TNewLang extends LangLocale>(
    locale: TNewLang,
    textOrCallback: TextOrBuilderCallback<
      LangBuilderMethods,
      LangLocale,
      VoiceNamesOrDefault,
      TNewLang,
      "default"
    >
  ): AlexaSSMLBuilder {
    return this.handleTextOrCallback(textOrCallback,"lang",[{name:"xml:lang",value:locale}]);
  }
  
  fun(
    textOrCallback: TextOrBuilderCallback<
      FunBuilderMethods,
      LangLocale,
      VoiceNamesOrDefault,
      LangOrDefault,
      "default"
    >
  ): AlexaSSMLBuilder {
    return this.domain("fun", textOrCallback);
  }
  conversational(
    textOrCallback: TextOrBuilderCallback<
      ConversationalBuilderMethods,
      LangLocale,
      VoiceNamesOrDefault,
      LangOrDefault,
      "default"
    >
  ): AlexaSSMLBuilder {
    return this.domain("conversational", textOrCallback);
  }
  longForm(
    textOrCallback: TextOrBuilderCallback<
      LongFormBuilderMethods,
      LangLocale,
      VoiceNamesOrDefault,
      LangOrDefault,
      "default"
    >
  ): AlexaSSMLBuilder {
    return this.domain("long-form", textOrCallback);
  }
  music(
    textOrCallback: TextOrBuilderCallback<
      MusicBuilderMethods,
      LangLocale,
      VoiceNamesOrDefault,
      LangOrDefault,
      "default"
    >
  ): AlexaSSMLBuilder {
    return this.domain("music", textOrCallback);
  }
  news(
    textOrCallback: TextOrBuilderCallback<
      NewsBuilderMethods,
      LangLocale,
      VoiceNamesOrDefault,
      LangOrDefault,
      "default"
    >
  ): AlexaSSMLBuilder {
    return this.domain("news", textOrCallback);
  }
  emotion(
    name: Emotion,
    intensity: EmotionIntensity,
    textOrCallback: TextOrBuilderCallback<
      EmotionBuilderMethods,
      LangLocale,
      VoiceNamesOrDefault,
      LangOrDefault,
      "default"
    >
  ): AlexaSSMLBuilder {
    return this.handleTextOrCallback(textOrCallback,"amazon:emotion",[{name:"name",value:name},{name:"intensity",value:intensity}])
  }
  whisper(
    textOrCallback: TextOrBuilderCallback<
      WhisperBuilderMethods,
      LangLocale,
      VoiceNamesOrDefault,
      LangOrDefault,
      "default"
    >
  ): AlexaSSMLBuilder {
    return this.handleTextOrCallback(textOrCallback,"amazon:effect",[{name:"name", value:"whisper"}])  
  }
  
  break(
    strengthOrMs?: BreakStrength | number
  ): AlexaSSMLBuilder {
    const attributes:Attribute[] = [];
    if(strengthOrMs !== undefined){
      if (typeof strengthOrMs === "string") {
        attributes.push({name:"strength", value:strengthOrMs})
      }else{
        attributes.push({name:"time",value:`${strengthOrMs}ms`})
      }
    }
    this.nodes.push({isText:false,elementName:"break",attributes})
    return this;
  }
  paragraph(
    textOrCallback: TextOrBuilderCallback<
      ParagraphBuilderMethods,
      LangLocale,
      VoiceNamesOrDefault,
      LangOrDefault,
      "default"
    >
  ): AlexaSSMLBuilder {
    return this.handleTextOrCallback(textOrCallback,"p");
  }
  sentence(
    textOrCallback: TextOrBuilderCallback<
      SentenceBuilderMethods,
      LangLocale,
      VoiceNamesOrDefault,
      LangOrDefault,
      "default"
    >
  ): AlexaSSMLBuilder {
    return this.handleTextOrCallback(textOrCallback,"s");
  }

  word(
    role: WordRole,
    textOrCallback: TextOrBuilderCallback<
      WordBuilderMethods,
      LangLocale,
      VoiceNamesOrDefault,
      LangOrDefault,
      "default"
    >
  ): AlexaSSMLBuilder {
    return this.handleTextOrCallback(textOrCallback,"w", [{name:"role", value:role.toString()}]);
  }

  sub(alias: string, aliased: string): AlexaSSMLBuilder {
    this.nodes.push({
      isText:false,
      elementName:"sub", 
      attributes:[{name:"alias", value:alias}], 
      getChildren:()=> [this.getTextNode(aliased)]
    });
    return this;
  }

  audio(src: string): AlexaSSMLBuilder {
    this.nodes.push({isText:false,elementName:"audio",attributes:[{name:"src", value:src}]});
    return this;
  }
  audioSoundbank(soundBankSound: SoundbankSound): AlexaSSMLBuilder {
    return this.audio(soundBankSound.soundbankUrl);
  }

  emphasis(
    level: EmphasisLevel,
    textOrCallback: TextOrBuilderCallback<
      EmphasisBuilderMethods,
      LangLocale,
      VoiceNamesOrDefault,
      LangOrDefault,
      "default"
    >
  ): AlexaSSMLBuilder {
    return this.handleTextOrCallback(textOrCallback, "emphasis", [{name:"level", value:level}]);
  }
  emphasisDefault(
    textOrCallback: TextOrBuilderCallback<
      EmphasisBuilderMethods,
      LangLocale,
      VoiceNamesOrDefault,
      LangOrDefault,
      "default"
    >
  ): AlexaSSMLBuilder {
    return this.handleTextOrCallback(textOrCallback, "emphasis");
  }

  prosodyRate(
    rate: ProsodyRate,
    textOrCallback: TextOrBuilderCallback<
      ProsodySafeBuilderMethods,
      LangLocale,
      VoiceNamesOrDefault,
      LangOrDefault,
      "default"
    >
  ): AlexaSSMLBuilder {
    return this.handleTextOrCallback(textOrCallback,"prosody",[this.prosodyRateAttribute(rate)])
  }
  prosodyVolume(
    volume: ProsodyVolume,
    textOrCallback: TextOrBuilderCallback<
      ProsodySafeBuilderMethods,
      LangLocale,
      VoiceNamesOrDefault,
      LangOrDefault,
      "default"
    >
  ): AlexaSSMLBuilder {
    return this.handleTextOrCallback(textOrCallback,"prosody",[this.prosodyVolumeAttribute(volume)]);
  }
  prosodyRateVolume(
    rate: ProsodyRate,
    volume: ProsodyVolume,
    textOrCallback: TextOrBuilderCallback<
      ProsodySafeBuilderMethods,
      LangLocale,
      VoiceNamesOrDefault,
      LangOrDefault,
      "default"
    >
  ): AlexaSSMLBuilder {
    return this.handleTextOrCallback(textOrCallback,"prosody",[
      this.prosodyRateAttribute(rate),
      this.prosodyVolumeAttribute(volume)])
  }
  prosodyPitch(
    pitch: ProsodyPitch,
    textOrCallback: TextOrBuilderCallback<
      ProsodyPitchBuilderMethods,
      LangLocale,
      VoiceNamesOrDefault,
      LangOrDefault,
      "default"
    >
  ): AlexaSSMLBuilder {
    return this.handleTextOrCallback(textOrCallback,"prosody",[this.prosodyPitchAttribute(pitch)]);
  }
  prosodyPitchAndRate(
    pitch: ProsodyPitch,
    rate: ProsodyRate,
    textOrCallback: TextOrBuilderCallback<
      ProsodyPitchBuilderMethods,
      LangLocale,
      VoiceNamesOrDefault,
      LangOrDefault,
      "default"
    >
  ): AlexaSSMLBuilder {
    return this.handleTextOrCallback(textOrCallback,"prosody",[this.prosodyPitchAttribute(pitch),this.prosodyRateAttribute(rate)]);
  }
  prosodyPitchAndVolume(
    pitch: ProsodyPitch,
    volume: ProsodyVolume,
    textOrCallback: TextOrBuilderCallback<
      ProsodyPitchBuilderMethods,
      LangLocale,
      VoiceNamesOrDefault,
      LangOrDefault,
      "default"
    >
  ): AlexaSSMLBuilder {
    return this.handleTextOrCallback(textOrCallback,"prosody",[this.prosodyPitchAttribute(pitch),this.prosodyVolumeAttribute(volume)]);
  }
  prosodyPitchRateVolume(
    pitch: ProsodyPitch,
    rate: ProsodyRate,
    volume: ProsodyVolume,
    textOrCallback: TextOrBuilderCallback<
      ProsodyPitchBuilderMethods,
      LangLocale,
      VoiceNamesOrDefault,
      LangOrDefault,
      "default"
    >
  ): AlexaSSMLBuilder {
    return this.handleTextOrCallback(textOrCallback,"prosody",[
      this.prosodyPitchAttribute(pitch),
      this.prosodyRateAttribute(rate),
      this.prosodyVolumeAttribute(volume)
    ]);
  }

  private phoneme(phonetic: string, ipa:boolean, text?: string | undefined){
    const alphabet = ipa ? "ipa" : "x-sampa";
    const node:ElementNode = {isText:false,elementName:"phoneme", attributes:[{name:"alphabet", value:alphabet},{name:"ph", value:phonetic}]};
    if(text!==undefined){
      node.getChildren = () => [this.getTextNode(text)]
    }
    this.nodes.push(node);
    return this;
  }
  phonemeIPA(phonetic: string, text?: string | undefined): AlexaSSMLBuilder {
    return this.phoneme(phonetic,true,text);
  }
  phonemeXSampa(phonetic: string, text?: string | undefined): AlexaSSMLBuilder {
    return this.phoneme(phonetic,false,text);
  }
  phonemeAnyLanguageIPA(text:string,...phonemes: IpaPhonemes[]): AlexaSSMLBuilder {
    return this.phonemeLanguageIPA(text,...phonemes);
  }
  phonemeAnyLanguageXSampa(text:string,...phonemes: XSampaPhonemes[]): AlexaSSMLBuilder {
    return this.phonemeLanguageXSampa(text,...phonemes);
  }
  phonemeLanguageIPA(text:string,...phonemes: IpaPhonemes[]): AlexaSSMLBuilder {
    return this.phonemeIPA(phonemes.join(""),text);
  }
  phonemeLanguageXSampa(text:string,...phonemes: XSampaPhonemes[]): AlexaSSMLBuilder {
    return this.phonemeXSampa(phonemes.join(""),text);
  }
  

  private sayAs(as:string, saidAs:string, additionalAttributes:Attribute[] = []){
    additionalAttributes.push({name:"interpret-as",value:as});
    this.nodes.push({isText:false,elementName:"say-as",attributes:additionalAttributes,getChildren:() => [this.getTextNode(saidAs)]});
    return this;
  }
  sayAsExpletive(text: string): AlexaSSMLBuilder {
    return this.sayAs("expletive", text);
  }
  sayAsAddress(text: string): AlexaSSMLBuilder {
    return this.sayAs("address", text);
  }
  sayAsTelephone(text: string): AlexaSSMLBuilder {
    /*
       Interpret a value as a 7-digit or 10-digit telephone number. This can also handle extensions (for example, 2025551212x345).
    */
    return this.sayAs("telephone", text);
  
  }
  sayAsTime(text: string): AlexaSSMLBuilder {
    return this.sayAs("time", text);
  }
  sayAsUnit(text: string): AlexaSSMLBuilder {
    return this.sayAs("unit", text);
  }
  sayAsFraction(text: string): AlexaSSMLBuilder {
    return this.sayAs("fraction", text);
  }
  sayAsDigits(text: string): AlexaSSMLBuilder {
    return this.sayAs("digits", text);
  }
  sayAsOrdinal(text: string): AlexaSSMLBuilder {
    return this.sayAs("ordinal", text);
  }
  sayAsCardinal(text: string): AlexaSSMLBuilder {
    return this.sayAs("cardinal", text);
  }
  sayAsCharacters(text: string): AlexaSSMLBuilder {
    return this.sayAs("characters", text);
  }
  sayAsDate(text: string, format: SayAsDateFormat): AlexaSSMLBuilder {
    return this.sayAs("date", text,[{name:"format", value:format}]);
  }
  sayAsInterjection<TSpeechcon extends AllSpeechcons>(
    speechcon: TSpeechcon,
    suffix: string = ""
  ): AlexaSSMLBuilder {
    return this.sayAs("interjection", `${speechcon}${suffix}`);
  }
}

export function createBuilder<
  TSkillLocale extends LangLocale
>(escapeInvalidXml = true): RootBuilder<TSkillLocale> {
  return new AlexaSSMLBuilder(escapeInvalidXml, true) as unknown as RootBuilder<TSkillLocale>;
}
