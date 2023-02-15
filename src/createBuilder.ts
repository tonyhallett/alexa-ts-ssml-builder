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
// no way of determining if a single quotation mark is being used for quoting or an apostrophe.
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
class AlexaSSMLBuilder
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
    throw new Error("Method not implemented.");
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
    if (typeof textOrCallback === "string") {
    } else {
      textOrCallback(this as any);
    }
    return this;
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
    throw new Error("Method not implemented.");
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
    throw new Error("Method not implemented.");
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
    throw new Error("Method not implemented.");
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
    throw new Error("Method not implemented.");
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
    throw new Error("Method not implemented.");
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
    throw new Error("Method not implemented.");
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
    throw new Error("Method not implemented.");
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
    throw new Error("Method not implemented.");
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
    this.handleTextOrCallback(textOrCallback,"p");
    return this;
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
    this.handleTextOrCallback(textOrCallback,"s");
    return this;
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
    this.handleTextOrCallback(textOrCallback,"w", [{name:"role", value:role.toString()}]);
    return this;
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
    throw new Error("Method not implemented.");
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
    throw new Error("Method not implemented.");
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
    throw new Error("Method not implemented.");
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
    throw new Error("Method not implemented.");
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
    throw new Error("Method not implemented.");
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
    throw new Error("Method not implemented.");
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
    throw new Error("Method not implemented.");
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
    throw new Error("Method not implemented.");
  }

  phonemeIPA(phonetic: string, text?: string | undefined): AlexaSSMLBuilder {
    throw new Error("Method not implemented.");
  }
  phonemeXSampa(phonetic: string, text?: string | undefined): AlexaSSMLBuilder {
    throw new Error("Method not implemented.");
  }
  phonemeAnyLanguageIPA(...phonemes: IpaPhonemes[]): AlexaSSMLBuilder {
    throw new Error("Method not implemented.");
  }
  phonemeAnyLanguageXSampa(...phonemes: XSampaPhonemes[]): AlexaSSMLBuilder {
    throw new Error("Method not implemented.");
  }
  phonemeLanguageIPA(...phonemes: IpaPhonemes[]): AlexaSSMLBuilder {
    throw new Error("Method not implemented.");
  }
  phonemeLanguageXSampa(...phonemes: XSampaPhonemes[]): AlexaSSMLBuilder {
    throw new Error("Method not implemented.");
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
