import { createBuilder } from "../src/createBuilder"

describe("builder", () =>{
    it("should work with <speak>some text</speak>", () =>{
        const builder = createBuilder();
        const ssml = builder.text("some text").build();
        expect(ssml).toEqual("<speak>some text</speak>");
    })
})