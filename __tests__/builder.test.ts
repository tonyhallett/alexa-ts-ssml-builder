import { AlexaSSMLBuilder, createBuilder } from "../src/createBuilder"
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
        const ssml = builder.break(1000).build();
        expect(ssml).toEqual(`<speak><break time="1000ms"/></speak>`)
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

        const builder2 = createBuilder();
        const ssml2 = builder2.word(WordRole.PastParticiple,"thing").build();
        expect(ssml2).toEqual(`<speak><w role="amazon:VBD">thing</w></speak>`);

        const builder3 = createBuilder();
        const ssml3 = builder3.word(WordRole.Verb,"thing").build();
        expect(ssml3).toEqual(`<speak><w role="amazon:VB">thing</w></speak>`);

        const builder4 = createBuilder();
        const ssml4 = builder4.word(WordRole.NonDefaultSense,"thing").build();
        expect(ssml4).toEqual(`<speak><w role="amazon:SENSE_1">thing</w></speak>`)
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

    it("should work with voice", ()=>{
        const builder = createBuilder();
        const ssml = builder.voice("Amy","New voice").build();
        expect(ssml).toEqual(`<speak><voice name="Amy">New voice</voice></speak>`);

        const builder2 = createBuilder();
        const ssml2 = builder2.voiceFromSkillLocale("Amy","New voice").build();
        expect(ssml2).toEqual(`<speak><voice name="Amy">New voice</voice></speak>`)
    });

    it("should work with lang", ()=>{
        const builder = createBuilder();
        const ssml = builder.lang("en-GB","in english").build();
        expect(ssml).toEqual(`<speak><lang xml:lang="en-GB">in english</lang></speak>`)
    });

    it("should work with domain fun", () =>{
        const builder = createBuilder();
        const ssml = builder.fun("this is fun").build();
        expect(ssml).toEqual(`<speak><amazon:domain name="fun">this is fun</amazon:domain></speak>`)
    });

    it("should work with domain news", () =>{
        //todo - how is fun allowed but news requires locale ?
        const builder = createBuilder<"en-US">();
        const ssml = builder.news("this is the news").build();
        expect(ssml).toEqual(`<speak><amazon:domain name="news">this is the news</amazon:domain></speak>`)
    });

    it("should work with domain conversational", () =>{
        const builder = createBuilder<"en-US">();
        const ssml = builder.conversational("this is conversational").build();
        expect(ssml).toEqual(`<speak><amazon:domain name="conversational">this is conversational</amazon:domain></speak>`)
    });

    
    it("should work with domain long-form", () =>{
        const builder = createBuilder<"en-US">();
        const ssml = builder.longForm("this is long-form").build();
        expect(ssml).toEqual(`<speak><amazon:domain name="long-form">this is long-form</amazon:domain></speak>`)
    });

    it("should work with domain music", () =>{
        const builder = createBuilder<"en-US">();
        const ssml = builder.music("this is about music").build();
        expect(ssml).toEqual(`<speak><amazon:domain name="music">this is about music</amazon:domain></speak>`)
    });

    it("should work with emotion", () =>{
        const builder = createBuilder<"en-US">();
        const ssml = builder.emotion("disappointed","high","high disappointment").build();
        expect(ssml).toEqual(`<speak><amazon:emotion name="disappointed" intensity="high">high disappointment</amazon:emotion></speak>`);

        const builder2 = createBuilder<"en-US">();
        const ssml2 = builder2.emotion("disappointed","medium","medium disappointment").build();
        expect(ssml2).toEqual(`<speak><amazon:emotion name="disappointed" intensity="medium">medium disappointment</amazon:emotion></speak>`);
        
        const builder3 = createBuilder<"en-US">();
        const ssml3 = builder3.emotion("excited","low","low excitement").build();
        expect(ssml3).toEqual(`<speak><amazon:emotion name="excited" intensity="low">low excitement</amazon:emotion></speak>`);
    });

    it("should work with whisper effect", () =>{
        const builder = createBuilder<"en-US">();
        const ssml = builder.whisper("this is whispered").build();
        expect(ssml).toEqual(`<speak><amazon:effect name="whisper">this is whispered</amazon:effect></speak>`)
    });


    it("should work with emphasis", () =>{
        const builder = createBuilder();
        const ssml = builder.emphasis("moderate","moderate emphasis").build();
        expect(ssml).toEqual(`<speak><emphasis level="moderate">moderate emphasis</emphasis></speak>`);

        const builder2 = createBuilder();
        const ssml2 = builder2.emphasis("reduced","reduced emphasis").build();
        expect(ssml2).toEqual(`<speak><emphasis level="reduced">reduced emphasis</emphasis></speak>`);

        const builder3 = createBuilder();
        const ssml3 = builder3.emphasis("strong","strong emphasis").build();
        expect(ssml3).toEqual(`<speak><emphasis level="strong">strong emphasis</emphasis></speak>`);
    });

    it("should work with emphasis without level", () =>{
        const builder = createBuilder();
        const ssml = builder.emphasisDefault("default emphasis").build();
        expect(ssml).toEqual(`<speak><emphasis>default emphasis</emphasis></speak>`);
    });

    it("should work with phoneme IPA", () =>{
        const builder = createBuilder();
        const ssml = builder.phonemeIPA("phonetic").build();
        expect(ssml).toEqual(`<speak><phoneme alphabet="ipa" ph="phonetic"/></speak>`);

        const builder2 = createBuilder();
        const ssml2 = builder2.phonemeIPA("phonetic","for").build();
        expect(ssml2).toEqual(`<speak><phoneme alphabet="ipa" ph="phonetic">for</phoneme></speak>`);
    });

    it("should work with phoneme XSampa", () =>{
        const builder = createBuilder();
        const ssml = builder.phonemeXSampa("phonetic").build();
        expect(ssml).toEqual(`<speak><phoneme alphabet="x-sampa" ph="phonetic"/></speak>`);
    });

    it("should work with phoneme arguments", () =>{
        const builder = createBuilder();
        const ssml = builder.phonemeAnyLanguageIPA("text","E","J").build();
        expect(ssml).toEqual(`<speak><phoneme alphabet="ipa" ph="EJ">text</phoneme></speak>`);

        const builder2 = createBuilder();
        const ssml2 = builder2.phonemeLanguageIPA("text","E","J").build();
        expect(ssml2).toEqual(`<speak><phoneme alphabet="ipa" ph="EJ">text</phoneme></speak>`);

        const builder3 = createBuilder();
        const ssml3 = builder3.phonemeAnyLanguageXSampa("text","E","J").build();
        expect(ssml3).toEqual(`<speak><phoneme alphabet="x-sampa" ph="EJ">text</phoneme></speak>`);

        const builder4 = createBuilder();
        const ssml4 = builder4.phonemeLanguageXSampa("text","E","J").build();
        expect(ssml4).toEqual(`<speak><phoneme alphabet="x-sampa" ph="EJ">text</phoneme></speak>`);
    });

    it("should work with prosody rate", () =>{
        const builder = createBuilder();
        const ssml = builder.prosodyRate("fast","this is fast").build();
        expect(ssml).toEqual(`<speak><prosody rate="fast">this is fast</prosody></speak>`);

        const builder2 = createBuilder();
        const ssml2 = builder2.prosodyRate(80,"this is 80%").build();
        expect(ssml2).toEqual(`<speak><prosody rate="80%">this is 80%</prosody></speak>`);
    });

    it("should work with prosody volume", () =>{
        const builder = createBuilder();
        const ssml = builder.prosodyVolume("loud","this is loud").build();
        expect(ssml).toEqual(`<speak><prosody volume="loud">this is loud</prosody></speak>`);

        const builder2 = createBuilder();
        const ssml2 = builder2.prosodyVolume(80,"this is 80dB").build();
        expect(ssml2).toEqual(`<speak><prosody volume="80dB">this is 80dB</prosody></speak>`);
    });

    it("should work with prosody rate amd volume", () =>{
        const builder = createBuilder();
        const ssml = builder.prosodyRateVolume("x-slow","x-soft","this is x-slow and x-soft").build();
        expect(ssml).toEqual(`<speak><prosody rate="x-slow" volume="x-soft">this is x-slow and x-soft</prosody></speak>`);
    });

    it("should work with prosody pitch", () =>{
        const builder = createBuilder();
        const ssml = builder.prosodyPitch("high","this is high pitched").build();
        expect(ssml).toEqual(`<speak><prosody pitch="high">this is high pitched</prosody></speak>`);

        const builder2 = createBuilder();
        const ssml2 = builder2.prosodyPitch(-10,"this is pitched down 10%").build();
        expect(ssml2).toEqual(`<speak><prosody pitch="-10%">this is pitched down 10%</prosody></speak>`);
    });

    it("should work with prosody pitch and rate", () =>{
        const builder = createBuilder();
        const ssml = builder.prosodyPitchAndRate("high","slow","this is high pitched and slow").build();
        expect(ssml).toEqual(`<speak><prosody pitch="high" rate="slow">this is high pitched and slow</prosody></speak>`);
    });
    
    it("should work with prosody pitch and volume", () =>{
        const builder = createBuilder();
        const ssml = builder.prosodyPitchAndVolume("high","medium","this is high pitched and medium loudness").build();
        expect(ssml).toEqual(`<speak><prosody pitch="high" volume="medium">this is high pitched and medium loudness</prosody></speak>`);
    });

    it("should work with prosody pitch, rate and volume", () =>{
        const builder = createBuilder();
        const ssml = builder.prosodyPitchRateVolume("high","slow","medium","this is high pitched, slow and medium loudness").build();
        expect(ssml).toEqual(`<speak><prosody pitch="high" rate="slow" volume="medium">this is high pitched, slow and medium loudness</prosody></speak>`);
    });

    it("should throw if build from a subbuilder", () =>{
        const builder = createBuilder();
        let subBuilder:AlexaSSMLBuilder | undefined;
        builder.paragraph(paragraphBuilder => {
            subBuilder = paragraphBuilder as AlexaSSMLBuilder;
        });
        expect(() => subBuilder!.build()).toThrowError("Build to only be called from the root builder");
    });

    it("should by default escape in text content", () => {
        const builder = createBuilder();
        const ssml = builder.sayAsUnit(`<>&'"`).build();
        expect(ssml).toEqual(`<speak><say-as interpret-as="unit">&lt;&gt;&amp;&apos;&quot;</say-as></speak>`)
    });

    it("should not escape text content when told not to do so", () => {
        const builder = createBuilder(false);
        const ssml = builder.sayAsUnit(`<>&'"`).build();
        expect(ssml).toEqual(`<speak><say-as interpret-as="unit"><>&'"</say-as></speak>`)
    });

    it("should by default escape attribute values", () => {
        const builder = createBuilder();
        const ssml = builder.sub(`<>&'"`,"isaliased").build();
        expect(ssml).toEqual(`<speak><sub alias="&lt;&gt;&amp;&apos;&quot;">isaliased</sub></speak>`)
    });

    it("should not escape attributes when requested not to do so", () => {
        const builder = createBuilder(false);
        const ssml = builder.sub(`<>&'`,"isaliased").build();
        expect(ssml).toEqual(`<speak><sub alias="<>&'">isaliased</sub></speak>`)
    })
})