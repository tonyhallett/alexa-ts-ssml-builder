import * as axios from "axios";
import * as fs from "fs";
import * as path from "path";

// "https://developer.amazon.com/en-US/docs/alexa/custom-skills/ask-soundlibrary.html";
// "https://d3qhmae9zx9eb.cloudfront.net/";// xml truncated
/*
    <ListBucketResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
        <Name>alexa-soundlibrary</Name>
        <Prefix/>
        <Marker/>
        <MaxKeys>1000</MaxKeys>
        <IsTruncated>true</IsTruncated>
        <Contents>
            <Key>air/fire_extinguisher/fire_extinguisher_01.mp3</Key>
            <LastModified>2019-06-11T23:14:07.000Z</LastModified>
            <ETag>"baa7f409ac4d8fb288d2ce27b9997b65"</ETag>
            <Size>9717</Size>
            <Owner>
            <ID>0183d592c46e412af1b70fe96323ec026018c88a42444e951500b0ab660ed868</ID>
            <DisplayName>alexa-builder-backend-dev</DisplayName>
            </Owner>
            <StorageClass>STANDARD</StorageClass>
        </Contents>
    */

/*
    from script tag in webPage
*/
const soundLibraryJson =
  "https://m.media-amazon.com/images/G/01/mobile-apps/dex/ask-tech-docs/ask-soundlibrary._TTH_.json";
async function loadJson() {
  const { data } = await axios.default(soundLibraryJson);
  return data;
}

interface Sound {
  audioFilePath: string;
  category: string;
  duration: number;
  name: string;
  tags: unknown[];
}

interface SoundDetail {
  path: string;
  duration: number;
}

/*
    Dot notation must be a valid JavaScript identifier which can also be a reserved word.
    See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#identifiers
*/
const names: string[] = [];
function getSoundPropertyName(name: string) {
  name = name.toLowerCase();
  name = name.replace(/[\(\) ]/g, "_");
  name = name.replace(/__/g, "_");
  if (name.endsWith("_")) {
    name = name.substring(0, name.length - 1);
  }
  names.push(name);
  return name;
}

const charsSet = new Set<string>();
function checkPropertyNames() {
  names.forEach((name) => {
    for (let i = 0; i < name.length; i++) {
      charsSet.add(name[i]);
    }
  });
  Array.from(charsSet.values()).forEach((char) => {
    console.log(char);
  });
}

// could read from json - baseUrl.soundBankUrl
const soundbankUrl = "soundbank://soundlibrary/";

function createSoundbank(sounds: Sound[]) {
  const soundbank = {} as any;
  sounds.forEach((sound) => {
    const categoryNames = sound.category.split("/");
    let category = soundbank;
    categoryNames.forEach((categoryName) => {
      categoryName = categoryName.toLowerCase();
      if (category[categoryName] === undefined) {
        category[categoryName] = {};
      }
      category = category[categoryName];
    });
    category[getSoundPropertyName(sound.name)] = {
      duration: sound.duration,
      soundbankUrl: `${soundbankUrl}${sound.audioFilePath}`,
    };
  });
  return soundbank;
}

function saveSoundBank(filePath: string, soundbank: any) {
  const code = `export const soundbank = 
        ${JSON.stringify(soundbank, null, 2)}
    `;
  fs.writeFileSync(filePath, code);
}

(async () => {
  const json = await loadJson();
  const soundbank = createSoundbank(json.sounds);
  //checkPropertyNames();
  const soundBankPath = path.join(__dirname, "..", "src", "soundbank.ts");
  saveSoundBank(soundBankPath, soundbank);
})();
