export type LangLocale = "de-DE" | "en-AU" | "en-CA" | "en-GB" | "en-IN" | "en-US" | "es-ES" | "es-MX" | "es-US" | "fr-CA" | "fr-FR" | "hi-IN" | "it-IT" | "ja-JP" | "pt-BR";

export const Ivy = "Ivy";
export const Joanna = "Joanna";
export const Joey = "Joey";
export const Justin = "Justin";
export const Kendra = "Kendra";
export const Kimberly = "Kimberly";
export const Matthew = "Matthew";
export const Salli = "Salli";
export const enUSVoiceNames = [Ivy, Joanna, Joey, Justin, Kendra, Kimberly, Matthew, Salli] as const
export type EnUSVoiceNames = typeof enUSVoiceNames[number];

export const Nicole = "Nicole";
export const Russell = "Russell";
export const enAUVoiceNames = [Nicole, Russell] as const
export type EnAUVoiceNames = typeof enAUVoiceNames[number];

export const Amy = "Amy";
export const Brian = "Brian";
export const Emma = "Emma";
export const enGBVoiceNames = [Amy, Brian, Emma] as const;
export type EnGBVoiceNames = typeof enGBVoiceNames[number];

export const Aditi = "Aditi";
export const Raveena = "Raveena";
export const enINVoiceNames = [Aditi, Raveena] as const
export type EnINVoiceNames = typeof enINVoiceNames[number];

// todo - put in EnGB
export const Geraint = "Geraint";
export const enGBWLSVoiceNames = [Geraint] as const;
export type EnGBWLSVoiceNames = typeof enGBWLSVoiceNames[number];

export const Chantal = "Chantal";
export const frCAVoiceNames = [Chantal] as const;
export type FrCAVoiceNames = typeof frCAVoiceNames[number];

export const Celine = "Celine";
export const Lea = "Lea";
export const Mathieu = "Mathieu"
export const frFRVoiceNames = [Celine, Lea, Mathieu] as const;
export type FrFRVoiceNames = typeof frFRVoiceNames[number];

export const Hans = "Hans";
export const Marlene = "Marlene";
export const Vicki = "Vicki";
export const deDeVoiceNames = [Hans, Marlene, Vicki] as const;
export type DeDeVoiceNames = typeof deDeVoiceNames[number];

export const hiINVoiceNames = [Aditi] as const;
export type HiINVoiceNames = typeof hiINVoiceNames[number];

export const Carla = "Carla";
export const Giorgio = "Giorgio";
export const Bianca = "Bianca";
export const itITVoiceNames = [Carla, Giorgio, Bianca] as const;
export type ItITVoiceNames = typeof itITVoiceNames[number];

export const Mizuki = "Mizuki";
export const Takumi = "Takumi";
export const jaJPVoiceNames = [Mizuki, Takumi] as const;
export type JaJPVoiceNames = typeof jaJPVoiceNames[number];

export const Vitoria = "Vitoria";
export const Camila = "Camila";
export const Ricardo = "Ricardo";
export const ptBRVoiceNames = [Vitoria, Camila, Ricardo] as const;
export type PtBRVoiceNames = typeof ptBRVoiceNames[number];

export const Conchita = "Conchita";
export const Enrique = "Enrique";
export const Lucia = "Lucia";
export const esESVoiceNames = [Conchita,Enrique,Lucia] as const
export type EsESVoiceNames= typeof esESVoiceNames[number];

export const Mia = "Mia";
export const esMXVoiceNames = [Mia] as const;
export type EsMXVoiceNames = typeof esMXVoiceNames[number];

export const Penelope = "Penelope";
export const Lupe = "Lupe";
export const Miguel = "Miguel";
export const esUSVoiceNames = [Penelope, Lupe, Miguel] as const;
export type EsUSVoiceNames = typeof esUSVoiceNames[number];

export type AllVoiceNames = EnUSVoiceNames | EnAUVoiceNames | EnGBVoiceNames | EnINVoiceNames | EnGBWLSVoiceNames
    | FrCAVoiceNames | FrFRVoiceNames | DeDeVoiceNames | HiINVoiceNames | ItITVoiceNames
    | JaJPVoiceNames | PtBRVoiceNames | EsESVoiceNames | EsMXVoiceNames | EsUSVoiceNames

const voiceLocales = {
    "ja-JP":jaJPVoiceNames,
    "de-DE":deDeVoiceNames,
    "en-AU":enAUVoiceNames,
    "en-CA":[],//*
    "en-GB":enGBVoiceNames,
    "en-IN":enINVoiceNames,
    "en-US":enUSVoiceNames,
    "es-ES":esESVoiceNames,
    "es-MX":esMXVoiceNames,
    "es-US":esUSVoiceNames,
    "fr-CA":frCAVoiceNames,
    "fr-FR":frFRVoiceNames,
    "hi-IN":hiINVoiceNames,
    "it-IT":itITVoiceNames,
    "pt-BR":ptBRVoiceNames
} satisfies Record<LangLocale,Readonly<AllVoiceNames[]>>
    
export type VoiceLocales = typeof voiceLocales;

export type VoicesInLocale<TLocale extends LangLocale> = VoiceLocales[TLocale][number]

export type LocaleForVoice<TVoice extends AllVoiceNames> = 
keyof {
    [Property in keyof VoiceLocales as TVoice extends VoiceLocales[Property][number] ? Property : never]:
        VoiceLocales[Property]
}