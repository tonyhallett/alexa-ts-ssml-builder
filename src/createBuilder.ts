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
  constructor(private isRoot = true){
    
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

  private escapeText(text:string){    return text;  }  
  
  private getNodeSSML(node:Node){
    if(node.isText){
      return this.escapeText(node.text);
    }

    let attributes = "";
    if(node.attributes){
      node.attributes.forEach(attribute =>{
        attributes+=` ${attribute.name}="${attribute.value}"`
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
    let ssml = this.getNodesSSML(this.nodes);
    return `<speak>${ssml}</speak>`
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
    throw new Error("Method not implemented.");
  }
  sayAsTelephone(text: string): AlexaSSMLBuilder {
    throw new Error("Method not implemented.");
  }
  sayAsTime(text: string): AlexaSSMLBuilder {
    throw new Error("Method not implemented.");
  }
  sayAsUnit(text: string): AlexaSSMLBuilder {
    throw new Error("Method not implemented.");
  }
  sayAsFraction(text: string): AlexaSSMLBuilder {
    throw new Error("Method not implemented.");
  }
  sayAsDigits(text: string): AlexaSSMLBuilder {
    throw new Error("Method not implemented.");
  }
  sayAsOrdinal(text: string): AlexaSSMLBuilder {
    throw new Error("Method not implemented.");
  }
  sayAsCardinal(text: string): AlexaSSMLBuilder {
    throw new Error("Method not implemented.");
  }
  sayAsCharacters(text: string): AlexaSSMLBuilder {
    throw new Error("Method not implemented.");
  }
  sayAsDate(text: string, format: SayAsDateFormat): AlexaSSMLBuilder {
    throw new Error("Method not implemented.");
  }
  sayAsInterjection<TSpeechcon extends AllSpeechcons>(
    speechcon: TSpeechcon,
    suffix?: string | undefined
  ): AlexaSSMLBuilder {
    throw new Error("Method not implemented.");
  }
}

export function createBuilder<
  TSkillLocale extends LangLocale
>(): RootBuilder<TSkillLocale> {
  return new AlexaSSMLBuilder() as unknown as RootBuilder<TSkillLocale>;
}
