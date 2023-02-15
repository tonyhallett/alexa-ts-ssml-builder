import { createBuilder } from "../src/createBuilder"
import { WordRole } from "../src/ssmlTypes";
import { soundbank } from "../src/soundbank"

describe("builder", () =>{
    it("should work with <speak>some text</speak>", () =>{
        const builder = createBuilder();
        const ssml = builder.text("some text").build();
        expect(ssml).toEqual("<speak>some text</speak>");
    });

    it("should work with a child element", () =>{
        const builder = createBuilder();
        const ssml = builder.paragraph("A paragraph").build();
        expect(ssml).toEqual("<speak><p>A paragraph</p></speak>")
    });

    it("should work with a sub builder", () =>{
        const builder = createBuilder();
        const ssml = builder.paragraph(subBuilder => {
            subBuilder.text("Some text.").sentence("A sentence.");
        }).build();
        expect(ssml).toEqual("<speak><p>Some text.<s>A sentence.</s></p></speak>")
    });

    it("should work with break strength", () =>{
        const builder = createBuilder();
        const ssml = builder.break("medium").build();
        expect(ssml).toEqual(`<speak><break strength="medium"/></speak>`)
    });

    it("should work with break time", () =>{
        const builder = createBuilder();
        const ssml = builder.break("medium").build();
        expect(ssml).toEqual(`<speak><break strength="medium"/></speak>`)
    });

    it("should work with default break (medium)", () =>{
        const builder = createBuilder();
        const ssml = builder.break().build();
        expect(ssml).toEqual(`<speak><break/></speak>`)
    });

    it("should work with word", ()=>{
        const builder = createBuilder();
        const ssml = builder.word(WordRole.Noun,"thing").build();
        expect(ssml).toEqual(`<speak><w role="amazon:NN">thing</w></speak>`)
    });

    it("should work with sub", ()=>{
        const builder = createBuilder();
        const ssml = builder.sub("analias","isaliased").build();
        expect(ssml).toEqual(`<speak><sub alias="analias">isaliased</sub></speak>`)
    });

    it("should work with audio", ()=>{
        const builder = createBuilder();
        // need to escape in an attribute ?
        const ssml = builder.audio("thesourceurl").build();
        expect(ssml).toEqual(`<speak><audio src="thesourceurl"/></speak>`)
    });

    it("should work with audio soundbank", ()=>{
        const builder = createBuilder();
        const fireExteniguisher1 = soundbank.air.fire_extinguisher.fire_extinguisher_1;
        const ssml = builder.audioSoundbank(fireExteniguisher1).build();
        expect(ssml).toEqual(`<speak><audio src="${fireExteniguisher1.soundbankUrl}"/></speak>`)
    });

    it("should work with sayAs expletive", ()=>{
        const builder = createBuilder();
        const ssml = builder.sayAsExpletive("as expletive").build();
        expect(ssml).toEqual(`<speak><say-as interpret-as="expletive">as expletive</say-as></speak>`)
    });

    it("should work with sayAs address", ()=>{
        const builder = createBuilder();
        const ssml = builder.sayAsAddress("as address").build();
        expect(ssml).toEqual(`<speak><say-as interpret-as="address">as address</say-as></speak>`)
    });

    it("should work with sayAs telephone", ()=>{
        const builder = createBuilder();
        const ssml = builder.sayAsTelephone("1234567").build();
        expect(ssml).toEqual(`<speak><say-as interpret-as="telephone">1234567</say-as></speak>`)
    });

    it("should work with sayAs time", ()=>{
        const builder = createBuilder();
        const ssml = builder.sayAsTime("time").build();
        expect(ssml).toEqual(`<speak><say-as interpret-as="time">time</say-as></speak>`)
    });

    it("should work with sayAs unit", ()=>{
        const builder = createBuilder();
        const ssml = builder.sayAsUnit("1m").build();
        expect(ssml).toEqual(`<speak><say-as interpret-as="unit">1m</say-as></speak>`)
    });

    it("should work with sayAs fraction", ()=>{
        const builder = createBuilder();
        const ssml = builder.sayAsFraction("3/20").build();
        expect(ssml).toEqual(`<speak><say-as interpret-as="fraction">3/20</say-as></speak>`)
    });

    it("should work with sayAs digits", ()=>{
        const builder = createBuilder();
        const ssml = builder.sayAsDigits("1234567").build();
        expect(ssml).toEqual(`<speak><say-as interpret-as="digits">1234567</say-as></speak>`)
    });

    it("should work with sayAs ordinal", ()=>{
        const builder = createBuilder();
        const ssml = builder.sayAsOrdinal("1").build();
        expect(ssml).toEqual(`<speak><say-as interpret-as="ordinal">1</say-as></speak>`)
    });

    it("should work with sayAs cardinal", ()=>{
        const builder = createBuilder();
        const ssml = builder.sayAsCardinal("1").build();
        expect(ssml).toEqual(`<speak><say-as interpret-as="cardinal">1</say-as></speak>`)
    });

    it("should work with sayAs characters", ()=>{
        const builder = createBuilder();
        const ssml = builder.sayAsCharacters("abc").build();
        expect(ssml).toEqual(`<speak><say-as interpret-as="characters">abc</say-as></speak>`)
    });

    
    it("should work with sayAs interjection", ()=>{
        const builder = createBuilder();
        const ssml = builder.sayAsInterjection("codswallop").build();
        expect(ssml).toEqual(`<speak><say-as interpret-as="interjection">codswallop</say-as></speak>`)
    });

    
    it("should work with sayAs interjection with suffix", ()=>{
        const builder = createBuilder();
        const ssml = builder.sayAsInterjection("codswallop","!").build();
        expect(ssml).toEqual(`<speak><say-as interpret-as="interjection">codswallop!</say-as></speak>`)
    });

    
    it("should work with sayAs date", ()=>{
        const builder = createBuilder();
        const ssml = builder.sayAsDate("date","dmy").build();
        expect(ssml).toEqual(`<speak><say-as format="dmy" interpret-as="date">date</say-as></speak>`)
    });
})