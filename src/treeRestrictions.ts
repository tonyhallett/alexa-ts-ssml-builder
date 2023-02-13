import { AllBuilderMethods, Default } from "./ssmlBuilder";

export type Restrictions = "voice" | "emotion" | Default
const treeRestrictions = {
    "emotion":{
        sayAsInterjection:true,
    },
    "voice":{
        sayAsInterjection:true,
    }
} satisfies Record<Exclude<Restrictions,Default>,  Partial<Record<AllBuilderMethods,boolean>>>
export type TreeRestrictions = typeof treeRestrictions;