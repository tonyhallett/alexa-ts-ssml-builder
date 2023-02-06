import * as axios from "axios";
import * as fs from "fs";
import * as path from "path";
import * as cheerio from "cheerio";

async function getSpeechcons(url:string){
    const html = await loadPage(url);
    return extractSpeechcons(html);
}

function extractSpeechcons(html:string){
    const cheerioAPI = cheerio.load(html);
    const speechconsContainer = cheerioAPI("tbody").first();
    const rows = speechconsContainer.children("tr");
    const speechcons:string[] = [];
    rows.each((i,row) => {
        const speechcon = cheerioAPI("td",row).html()!;
        speechcons.push(speechcon.trim());
    });
    return speechcons;
}

function writeSpeechcons(speechcons:string[],language:string){
    const languagePath = path.join(__dirname,"..","src","speechcons",`${language}-speechcons.ts`);
    const arrayAndTypeName = `${language}Speechcons`;
    const code = `
export const ${arrayAndTypeName} = ${JSON.stringify(speechcons)} as const;
export type ${arrayAndTypeName} = typeof ${arrayAndTypeName}[number];
    `
    fs.writeFileSync(languagePath,code);
}

async function loadPage(url:string){
    const {data} = await axios.default(url);
    return data;
}

(async () => {
    interface SpeechconPageDetail {
        url:string,
        language:string
    }
    
    const speechconPageDetails : SpeechconPageDetail[] = [
        {
            language: "english_au",
            url:"https://developer.amazon.com/en-US/docs/alexa/custom-skills/speechcon-reference-interjections-english-australia.html"
        },
        {
            language: "english_ca",
            url:"https://developer.amazon.com/en-US/docs/alexa/custom-skills/speechcon-reference-interjections-english-canada.html"
        },
        {
            language: "english_in",
            url:"https://developer.amazon.com/en-US/docs/alexa/custom-skills/speechcon-reference-interjections-english-india.html"
        },
        {
            language:"english_uk",
            url:"https://developer.amazon.com/en-US/docs/alexa/custom-skills/speechcon-reference-interjections-english-uk.html"
        },
        {
            language:"english_us",
            url:"https://developer.amazon.com/en-US/docs/alexa/custom-skills/speechcon-reference-interjections-english-us.html"
        },
        {
            language:"french_ca",
            url:"https://developer.amazon.com/en-US/docs/alexa/custom-skills/speechcon-reference-interjections-french-ca.html"
        },
        {
            language:"french_fr",
            url:"https://developer.amazon.com/en-US/docs/alexa/custom-skills/speechcon-reference-interjections-french.html"
        },
        {
            language:"german_de",
            url:"https://developer.amazon.com/en-US/docs/alexa/custom-skills/speechcon-reference-interjections-german.html"
        },
        {
            language:"hindi_in",
            url:"https://developer.amazon.com/en-US/docs/alexa/custom-skills/speechcon-reference-interjections-hindi-in.html"
        },
        {
            language:"italian_it",
            url:"https://developer.amazon.com/en-US/docs/alexa/custom-skills/speechcon-reference-interjections-italian.html"
        },
        {
            language:"japanese_jp",
            url:"https://developer.amazon.com/en-US/docs/alexa/custom-skills/speechcon-reference-interjections-japanese.html"
        },
        {
            language:"portugese_br",
            url:"https://developer.amazon.com/en-US/docs/alexa/custom-skills/speechcon-reference-interjections-portuguese-br.html"
        },
        {
            language:"spanish_es",
            url:"https://developer.amazon.com/en-US/docs/alexa/custom-skills/speechcon-reference-interjections-spanish.html"
        },
        {
            language:"spanish_mx",
            url:"https://developer.amazon.com/en-US/docs/alexa/custom-skills/speechcon-reference-interjections-spanish-mx.html"
        },
        {
            language:"spanish_us",
            url:"https://developer.amazon.com/en-US/docs/alexa/custom-skills/speechcon-reference-interjections-spanish-us.html"
        }
    ]
    
    
    speechconPageDetails.forEach(async (speechconPageDetail) => {
        const speechcons = await getSpeechcons(speechconPageDetail.url);
        writeSpeechcons(speechcons,speechconPageDetail.language)
    });
   
})();






