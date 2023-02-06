import * as axios from "axios";
import * as fs from "fs";
import * as path from "path";
import * as cheerio from "cheerio";
import * as ipaSymbols from "./ipa-symbols";

const consonants = ipaSymbols.CONSONANTS;
const vowels = ipaSymbols.VOWELS;

// to do helpers - can probably generalise all of this
async function loadPage(url:string):Promise<string>{
    const {data} = await axios.default(url);
    return data as string;
}

interface Phoneme{
    ipa:string,
    xsampa:string,
    description:string
}

type Category = string;

interface LocaleCategorizedPhonemes {
    locale:string,
    categorizedPhonemes:Record<Category,Phoneme[]>
}

const uncategorizedCategory = getCategoryProperty("uncategorized");

function extract(html:string): LocaleCategorizedPhonemes[]{
    const localePhonemesCategorized:LocaleCategorizedPhonemes[] = [];
    const cheerioAPI = cheerio.load(html);
    cheerioAPI(".tab-pane").each((i,tabPane) => {
        const categorizedPhonemes : Record<Category,Phoneme[]> = {}; 
        const locale = cheerioAPI(tabPane).attr("id")!;

        cheerioAPI("table",tabPane).each((i,tableElement) => {
            let categoryName = uncategorizedCategory;
            const category = cheerioAPI(tableElement).prev(".subheading");
            if(category.length === 1){
                categoryName = cheerioAPI(category).text();
            }
            const phonemes:Phoneme[]  = [];
            cheerioAPI("tbody tr",tableElement).each((i,tr )=> {
                const phoneme:Partial<Phoneme> = {};
                cheerioAPI("td",tr).each((i,td) => {
                    const text =  cheerioAPI(td).text();
                    switch(i){
                        
                        case 0:
                            phoneme.ipa = text;
                            break;
                        case 1:
                            phoneme.xsampa = text;
                            break;
                        case 2:
                            phoneme.description = text;
                            break;
                        default:
                            break;
                    }
                });
                phonemes.push(phoneme as Phoneme);
            });
            categorizedPhonemes[categoryName] = phonemes;
        });

        /* cheerioAPI(".subheading",tabPane).each((i,categoryElement) => {
            const category = cheerioAPI(categoryElement).text();
            const phonemesTableForCategory = cheerioAPI(categoryElement).next("table");
            const phonemes:Phoneme[]  = [];
            cheerioAPI("tbody tr",phonemesTableForCategory).each((i,tr )=> {
                const phoneme:Partial<Phoneme> = {};
                cheerioAPI("td",tr).each((i,td) => {
                    const text =  cheerioAPI(td).text();
                    switch(i){
                        
                        case 0:
                            phoneme.ipa = text;
                            break;
                        case 1:
                            phoneme.xsampa = text;
                            break;
                        case 2:
                            phoneme.description = text;
                            break;
                        default:
                            break;
                    }
                });
                phonemes.push(phoneme as Phoneme);
            });
            categorizedPhonemes[category] = phonemes;
        }) */

        localePhonemesCategorized.push({
            locale,
            categorizedPhonemes
        })

    });
    return localePhonemesCategorized;
}

// to be revisited
function getPhonemeDescriptionProperty(ipa:string,alexaDescription:string):string{
    return alexaDescription;
}

function getSafeLocale(locale:string){
    return locale.replace("-","");
}

function convertStringToCamelCase(sentence:string) {
    return sentence.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g,
    function(camelCaseMatch, i:number) {
       if (+camelCaseMatch === 0)
          return "";
       return i === 0 ? camelCaseMatch.toLowerCase() :
       camelCaseMatch.toUpperCase();
    });
 }

function getCategoryProperty(category:string):string{
    return convertStringToCamelCase(category);
}

function generateCode(localeCategorizedPhonemes:LocaleCategorizedPhonemes[]) : string {
    let code = "";
    function addCode(newCode:string){
        code = code + "\n" + newCode;
    }
    
    function addPhonemesArray(safeLocale:string,isIpa:boolean,phonemes:string[]){
        const ipaOrXSampa = isIpa ? "IPA" : "XSampa";
        const variableName = `${safeLocale}${ipaOrXSampa}Phonemes`;
        addCode(`export const ${variableName} = ${JSON.stringify(phonemes)} as const;`);
        addCode(`export type ${variableName} = typeof ${variableName}[number];`)  
    }

    function addLocalePhonemes(safeLocale:string,isIpa:boolean,localePhonemes:LocalePhonemes){
        const ipaOrXSampa = isIpa ? "IPA" : "XSampa";
        addCode(`export const ${safeLocale}${ipaOrXSampa}Object = ${JSON.stringify(localePhonemes,null,2)};`);
    }

    type LocalePhonemes = Record<string,string | Record<string,string>>;

    function trimPhoneme(phoneme:Phoneme){
        phoneme.ipa = phoneme.ipa.trim(),
        phoneme.xsampa = phoneme.xsampa.trim();
    }

    function getOrAddOject(container:any,propertyName:string){
        let obj:any = {};//todo
        if(container[propertyName] === undefined){
            container[propertyName] = obj;
        }else{
            obj = container[propertyName];
        }
        return obj;
    }

    function addPhoneme(container:any,phoneme:string,phonemeDescription:string){
        container[phoneme] = phoneme;
        //const names = getOrAddOject(container,"names");
        //names[phonemeDescription] = phoneme;
    }

    function addLocalePhoneme(
        localePhonemes:LocalePhonemes,
        categoryProperty:string,
        phonemeDescriptionProperty:string,
        phoneme:string
    ){
        if(categoryProperty !== uncategorizedCategory){
            const categories = getOrAddOject(localePhonemes,"categories");
            const category = getOrAddOject(categories,categoryProperty);

            addPhoneme(category,phoneme,phonemeDescriptionProperty);
        }

        addPhoneme(localePhonemes,phoneme,phonemeDescriptionProperty);
    }

    localeCategorizedPhonemes.forEach(lcp => {
        const safeLocale = getSafeLocale(lcp.locale);
        const ipaLocalePhonemes: LocalePhonemes = {};
        const xsampaLocalePhonemes: LocalePhonemes = {};
        const ipaPhonemes:string[] = [];
        const xSampaPhonemes:string[] = [];
        console.log(`locale - ${safeLocale}`);
        Object.entries(lcp.categorizedPhonemes).forEach(entry => {
            const category = entry[0];
            const categoryProperty = getCategoryProperty(category);
            const phonemes = entry[1];
            phonemes.forEach(phoneme => {
                trimPhoneme(phoneme);
                const phonemeDescriptionProperty = getPhonemeDescriptionProperty(phoneme.ipa,phoneme.description);
                addLocalePhoneme(ipaLocalePhonemes,categoryProperty,phonemeDescriptionProperty,phoneme.ipa);
                addLocalePhoneme(xsampaLocalePhonemes,categoryProperty, phonemeDescriptionProperty,phoneme.xsampa);
                ipaPhonemes.push(phoneme.ipa);
                xSampaPhonemes.push(phoneme.xsampa);
            })
        });
        addLocalePhonemes(safeLocale,true,ipaLocalePhonemes);
        addLocalePhonemes(safeLocale,false,xsampaLocalePhonemes);
        addPhonemesArray(safeLocale,true,ipaPhonemes);
        addPhonemesArray(safeLocale,false,xSampaPhonemes);
    });

    return code;
}

(async () => {
    const html = await loadPage("https://developer.amazon.com/en-US/docs/alexa/custom-skills/speech-synthesis-markup-language-ssml-reference.html");
    const localeCategorizedPhonemes = extract(html);
    const code = generateCode(localeCategorizedPhonemes);
    const phonemePath = path.join(__dirname,"..","src","phonemes.ts");
    fs.writeFileSync(phonemePath,code);

})();

