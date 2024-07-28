export const aspectsMap = new Map();
export const shapesMap = new Map();
export const iconImages = new Map();
 
const iconUrls = import.meta.glob<true,string,{default:string}>('./gfx/aspecticons/*.png',{ eager: true });

export type baseStats = "HP" | "strength" | "magic" | "armor" | "resistance" | "speed" | "agility" | "none";
export type baseStatAbbreviation = "HP" | "str" | "mag" | "arm" | "res" | "spd" | "agi" | "none";
export type aspectsType = "fire" | "steel" | "fae" | "bugs" | "beast" | "bone" | "blood" | "hell" | "forest" | "solar" | "stars" | "abyss" | "machine" | "void" | "sands" | "rot" | "curse" | "heavens" | "storms" | "none";
export type shapesType = "beetle" | "crawler"| "stinger" | "nightmare" | "canine" | "feline" | "critter" | "antler" | "winged" | "fruit" | "mycon" | "worldtree" | "worm" | "crab" | "kraken" | "leviathan" | "hydra" | "dinosaur" | "behemoth" | "dragon" | "none";
export type attackInteract = "normal" | "strong" | "resisted" | "nothing" | "rot" | "resistedrot";
export type defenseInteract = "neutral" | "resist" | "weak" | "immune" | "rotted" | "resistrotted"; 
export type relationships = "strong" | "weak" | "neutral" | "harmony" | "burst" | "catalyst" | "mutate" | "unique"; 
export type statusEffect = "poison" | "rot" | "rust" | "none";
export type soulType = "natural" | "mirror" | "shadow" | "symbiosis" | "chaos" | "primordial" | "none";

export const aspectsList:Array<aspectsType> = ["fire","steel","fae","bugs","beast","bone","blood","hell","forest","solar","stars","abyss","machine","void","sands","rot","curse","heavens","storms"];
export const shapesList:Array<shapesType> = ["beetle","crawler","stinger","nightmare","canine","feline","critter","antler","winged","fruit","mycon","worldtree","worm","crab","kraken","leviathan","hydra","dinosaur","behemoth","dragon"];

export const statusEffects = []; 

const blankAspectAttackList:Array<attackInteract> = [];
const blankAspectDefenseList:Array<defenseInteract> = [];
const blankRelationshipsList:Array<relationships> = [];

const preloader = document.createElement("img");

Object.entries(iconUrls).map(([url, promise])=>{
    let iconName = url;
    iconName = iconName.replace("./gfx/aspecticons/icon-","");
    iconName = iconName.replace(".png","");
    const imageSource = promise.default;
    console.log("images ",iconName,)
    iconImages.set(iconName,imageSource);
});



for (let i= 0; i < aspectsList.length; i++)
    {
        blankAspectAttackList.push("normal");
        blankAspectDefenseList.push("neutral");
        blankRelationshipsList.push("neutral");
    }

const addAttackInteract = (originAspect:Aspect,interact:attackInteract,targetAspect:aspectsType) => {
    originAspect[interact].push(targetAspect);
    const originType = originAspect.aspectType;
    const originIndex = originAspect.index;
    const target = aspectsMap.get(targetAspect);
    const targetIndex = target.index;
    originAspect.attackMap.set(targetAspect,interact);
    originAspect.attackingList[targetIndex] = interact;

    let defendInteract:defenseInteract = "neutral";
    switch (interact)
    {
        case "strong": defendInteract = "weak"; break;
        case "resisted": defendInteract = "resist"; break;
        case "nothing": defendInteract = "immune"; break;
        case "rot": defendInteract = "rotted"; break;
    } 
    target.defenseMap.set(originType,defendInteract);
    target[defendInteract].push(originType);
    target.defendingList[originIndex] = defendInteract;

}


export class Aspect {

        name:string = "new aspect";
        aspectType:aspectsType = "none";
        index:number = -1;

        attackMap:Map<string,attackInteract> = new Map();
        defenseMap:Map<string,defenseInteract> = new Map();
        attackingList:Array<attackInteract> = [...blankAspectAttackList];
        defendingList:Array<defenseInteract> = [...blankAspectDefenseList];
        normal:Array<aspectsType> = [];
        strong:Array<aspectsType> = [];
        resisted:Array<aspectsType> = [];
        nothing:Array<aspectsType> = [];
        rot:Array<aspectsType> = [];
        neutral:Array<aspectsType> = [];
        resist:Array<aspectsType> = [];
        weak:Array<aspectsType> = [];
        immune:Array<aspectsType> = [];
        rotted:Array<aspectsType> = [];
        resistrotted:Array<aspectsType> = [];
        resistedrot:Array<aspectsType> = [];


        favStat:baseStats = "none";
        earthlyStat:baseStats = "none";
        ascendedStat:baseStats = "none";
        phantasmStat:baseStats = "none";

        aspectRelationships:Array<relationships> = [];
        shapeRelationships:Array<relationships> = [];

        effectStrong:Array<string> = [];
        effectWeak:Array<string> = [];
        effectNeutral:Array<string> = [];
        effectHarmony:Array<string> = [];
        effectBurst:Array<string> = [];
        effectCatalyst:Array<string> = [];
        effectMutate:Array<string> = [];
        effectUnique:Array<string> = [];

        protectEffect:Array<string> = [];

        earthlyAspect:aspectsType = "none";
        ascendedAspect:aspectsType = "none";
        phantasmAspect:aspectsType = "none";
        
        iconImg:HTMLImageElement = document.createElement("img");
        iconLoaded:boolean = false;
        iconURL:string = "";

        color:string = "rgb(255,255,255)";
        colorDark:string = "rgb(205,69,3)";
        colorLight:string = "rgb(255,108,15)"

        constructor(aspectType:aspectsType)
        {
            this.name = aspectType;
            this.aspectType = aspectType;

            this.iconImg.onload = () => {
                this.iconLoaded = true; 
                console.log("babon!",this.iconLoaded,this.name);
            }
        }

}

export class Shape {
            name:string = "new shape";
            shapeType:shapesType = "none";
            index:number = -1;

            baseHP:number = 0;
            baseStr:number = 0;
            baseMag:number = 0;
            baseArm:number = 0;
            baseRes:number = 0;
            baseSpd:number = 0;
            baseAgi:number = 0;
            earthlyHP:number = 0;
            ascendedHP:number = 0;
            phantasmHP:number = 0;
            earthlyStr:number = 0;
            ascendedStr:number = 0;
            phantasmStr:number = 0;
            earthlyMag:number = 0;
            ascendedMag:number = 0;
            phantasmMag:number = 0;
            earthlyArm:number = 0;
            ascendedArm:number = 0;
            phantasmArm:number = 0;
            earthlyRes:number = 0;
            ascendedRes:number = 0;
            phantasmRes:number = 0;
            earthlySpd:number = 0;
            ascendedSpd:number = 0;
            phantasmSpd:number = 0;
            earthlyAgi:number = 0;
            ascendedAgi:number = 0;
            phantasmAgi:number = 0;

            favStat:baseStats = "none";
            earthlyStat:baseStats = "none";
            ascendedStat:baseStats = "none";
            phantasmStat:baseStats = "none";

            aspectRelationships:Array<relationships> = [];
            shapeRelationships:Array<relationships> = [];

            effectStrong:Array<string> = [];
            effectWeak:Array<string> = [];
            effectNeutral:Array<string> = [];
            effectHarmony:Array<string> = [];
            effectBurst:Array<string> = [];
            effectCatalyst:Array<string> = [];
            effectMutate:Array<string> = [];
            effectUnique:Array<string> = [];

            protectEffect:Array<string> = [];

            color:string = "rgb(200,200,200)";

            earthlyAspect:aspectsType = "none";
            ascendedAspect:aspectsType = "none";
            phantasmAspect:aspectsType = "none";

            iconImg:HTMLImageElement = document.createElement("img");
            iconLoaded:boolean = false;

            constructor(shapeType:shapesType)
            {
                this.name = shapeType;
                this.shapeType = shapeType;

                this.iconImg.onload = () => {
                    this.iconLoaded = true; 
                    console.log("babon!",this.iconLoaded,this.name);
                }
            }
}


for (let i =0 ;i < aspectsList.length; i++)
{
    const currentAspectString = aspectsList[i]; 
    const newAspect = new Aspect(currentAspectString);
    newAspect.aspectType = currentAspectString;
    newAspect.index = i;
    newAspect.earthlyAspect = currentAspectString;
    
    newAspect.iconImg.src = iconImages.get(currentAspectString);
    aspectsMap.set(currentAspectString,newAspect);
    aspectsMap.set(i,newAspect);  
} 

for (let i =0 ;i < shapesList.length; i++)
    {
        const currentShapeString = shapesList[i];
        const newShape = new Shape(currentShapeString);
        newShape.shapeType = currentShapeString;
        newShape.index = i;
        newShape.earthlyAspect = "fire";
        
        newShape.iconImg.src = iconImages.get(currentShapeString);
        shapesMap.set(currentShapeString,newShape);
        shapesMap.set(i,newShape);   
    }
     

    let currentAspect = aspectsMap.get("fire");
    let currentShape = shapesMap.get("beetle");
    ///declaring details
    /// aspect details =========================================================
    // aspect 0: FIRE ----------------------------------------------
    currentAspect = aspectsMap.get("fire");  
    currentAspect.color = "rgb(255,108,15)";
    currentAspect.iconImg.src = iconImages.get("fire");
    addAttackInteract(currentAspect,"strong","bugs");
    addAttackInteract(currentAspect,"strong","beast");
    addAttackInteract(currentAspect,"strong","bone"); 
    addAttackInteract(currentAspect,"strong","forest");
    addAttackInteract(currentAspect,"strong","rot");
    addAttackInteract(currentAspect,"resisted","fire");
    addAttackInteract(currentAspect,"resisted","hell");
    addAttackInteract(currentAspect,"resisted","abyss");
    addAttackInteract(currentAspect,"resisted","sands");
    addAttackInteract(currentAspect,"nothing","solar");

    // aspect 1: STEEL ----------------------------------------------
    currentAspect = aspectsMap.get("steel"); 
    currentAspect.color = "rgb(126,147,169)";
    addAttackInteract(currentAspect,"strong","fae"); 

     // aspect 2: FAE ----------------------------------------------
     currentAspect = aspectsMap.get("fae"); 
     currentAspect.color = "rgb(112,46,235)";
     addAttackInteract(currentAspect,"strong","beast"); 
    
     // aspect 3: BUGS ----------------------------------------------
     currentAspect = aspectsMap.get("bugs"); 
     currentAspect.color = "rgb(156,166,87)";
     addAttackInteract(currentAspect,"strong","bone"); 
    
     // aspect 4: BEAST ----------------------------------------------
     currentAspect = aspectsMap.get("beast"); 
     currentAspect.color = "rgb(74,60,53)";
     addAttackInteract(currentAspect,"strong","bone"); 

     // aspect 5: BONE ----------------------------------------------
     currentAspect = aspectsMap.get("bone");
     currentAspect.color = "rgb(255,243,217)";
     addAttackInteract(currentAspect,"strong","hell"); 

     // aspect 6: BLOOD ----------------------------------------------
     currentAspect = aspectsMap.get("blood");
     currentAspect.color = "rgb(216,16,16)";
     addAttackInteract(currentAspect,"strong","heavens"); 

      // aspect 7: HELL ----------------------------------------------
      currentAspect = aspectsMap.get("hell");
      currentAspect.color = "rgb(201,44,111)";
      addAttackInteract(currentAspect,"nothing","heavens"); 

      // aspect 8: FOREST ----------------------------------------------
      currentAspect = aspectsMap.get("forest");
      currentAspect.color = "rgb(116,164,68)";
      addAttackInteract(currentAspect,"strong","bone"); 

      // aspect 9: SOLAR ----------------------------------------------
      currentAspect = aspectsMap.get("solar");
      currentAspect.color = "rgb(251,203,40)";
      addAttackInteract(currentAspect,"strong","curse"); 

      // aspect 10: STARS ----------------------------------------------
      currentAspect = aspectsMap.get("stars");
      currentAspect.color = "rgb(111,150,255)";
      addAttackInteract(currentAspect,"strong","fae"); 

      // aspect 11: ABYSS ----------------------------------------------
       currentAspect = aspectsMap.get("abyss");
       currentAspect.color = "rgb(65,121,139)";
       addAttackInteract(currentAspect,"strong","fire"); 

      // aspect 12: MACHINE ----------------------------------------------
      currentAspect = aspectsMap.get("machine");
      currentAspect.color = "rgb(147,123,138)";
      addAttackInteract(currentAspect,"strong","fae"); 

      // aspect 13: VOID ----------------------------------------------
      currentAspect = aspectsMap.get("void");
      currentAspect.color = "rgb(61,62,99)";
      addAttackInteract(currentAspect,"strong","solar");

      // aspect 14: SANDS ----------------------------------------------
      currentAspect = aspectsMap.get("sands");
      currentAspect.color = "rgb(186,158,120)";
      addAttackInteract(currentAspect,"strong","fire");

      // aspect 15: ROT ----------------------------------------------
      currentAspect = aspectsMap.get("rot");
      currentAspect.color = "rgb(73,156,98)";
      addAttackInteract(currentAspect,"nothing","steel");
      addAttackInteract(currentAspect,"rot","bugs");
      addAttackInteract(currentAspect,"rot","beast"); 
      addAttackInteract(currentAspect,"strong","blood");

        // aspect 16: CURSED ----------------------------------------------
        currentAspect = aspectsMap.get("curse");
        currentAspect.color = "rgb(112,46,75)";
        addAttackInteract(currentAspect,"strong","steel");

        // aspect 17: HEAVENS ----------------------------------------------
        currentAspect = aspectsMap.get("heavens");
        currentAspect.color = "rgb(254,251,146)";
        addAttackInteract(currentAspect,"strong","hell");

        // aspect 18: STORMS ----------------------------------------------
        currentAspect = aspectsMap.get("storms");
        currentAspect.color = "rgb(63,86,88)";
        addAttackInteract(currentAspect,"strong","fire");
 
///================================== shape details ======================================================================
        // shape 0: BEETLE ----------------------------------------------
        currentShape = shapesMap.get("beetle");
        currentShape.baseHP = 42;
        currentShape.baseSpd = 50;
        currentShape.baseAgi = 30;  
        currentShape.baseStr = 64;
        currentShape.baseArm = 85;
        currentShape.baseMag = 30;
        currentShape.baseRes = 55;
        //total = 356

        // shape 1: CRAWLER ----------------------------------------------
        currentShape = shapesMap.get("crawler");
        currentShape.baseHP = 53;
        currentShape.baseSpd = 80;
        currentShape.baseAgi = 60;  
        currentShape.baseStr = 69;
        currentShape.baseArm = 50;
        currentShape.baseMag = 40;
        currentShape.baseRes = 20;
        //total = 372

        // shape 2: STINGER ----------------------------------------------
        currentShape = shapesMap.get("stinger");
        currentShape.baseHP = 5;
        currentShape.baseSpd = 90;
        currentShape.baseAgi = 80;
        currentShape.baseStr = 52;
        currentShape.baseArm = 10;
        currentShape.baseMag = 70;
        currentShape.baseRes = 28;
        //total = 335

        // shape 3: NIGHTMARE ----------------------------------------------
        currentShape = shapesMap.get("nightmare");
        currentShape.baseHP = 20;
        currentShape.baseSpd = 30;
        currentShape.baseAgi = 90;
        currentShape.baseStr = 60;
        currentShape.baseArm = 0;
        currentShape.baseMag = 80;
        currentShape.baseRes = 95;
        //total = 375

        // shape 4: CANINE ----------------------------------------------
        currentShape = shapesMap.get("canine");
        currentShape.baseHP = 66;
        currentShape.baseSpd = 65;
        currentShape.baseAgi = 25;
        currentShape.baseStr = 75;
        currentShape.baseArm = 30;
        currentShape.baseMag = 10;
        currentShape.baseRes = 45;
        //total = 316

        // shape 5: FELINE ----------------------------------------------
        currentShape = shapesMap.get("feline");
        currentShape.baseHP = 45;
        currentShape.baseSpd = 80;
        currentShape.baseAgi = 90;
        currentShape.baseStr = 55;
        currentShape.baseArm = 10;
        currentShape.baseMag = 60;
        currentShape.baseRes = 30;
        //total = 370

        // shape 6: CRITTER ----------------------------------------------
        currentShape = shapesMap.get("critter");
        currentShape.baseHP = 20;
        currentShape.baseSpd = 75;
        currentShape.baseAgi = 100;
        currentShape.baseStr = 35;
        currentShape.baseArm = 22;
        currentShape.baseMag = 45;
        currentShape.baseRes = 22;
        //total = 319

        // shape 7: ANTLER ----------------------------------------------
        currentShape = shapesMap.get("antler");
        currentShape.baseHP = 65;
        currentShape.baseSpd = 25;
        currentShape.baseAgi = 70;
        currentShape.baseStr = 49;
        currentShape.baseArm = 32;
        currentShape.baseMag = 65;
        currentShape.baseRes = 62;
        //total = 368

        // shape 8: WINGED ----------------------------------------------
        currentShape = shapesMap.get("winged");
        currentShape.baseHP = 12;
        currentShape.baseSpd = 60;
        currentShape.baseAgi = 80;
        currentShape.baseStr = 29;
        currentShape.baseArm = 0;
        currentShape.baseMag = 45;
        currentShape.baseRes = 30;
        //total = 256

        // shape 9: FRUIT ----------------------------------------------
        currentShape = shapesMap.get("fruit");
        currentShape.baseHP = 12;
        currentShape.baseSpd = 60;
        currentShape.baseAgi = 80;
        currentShape.baseStr = 29;
        currentShape.baseArm = 0;
        currentShape.baseMag = 45;
        currentShape.baseRes = 30;
        //total = 256

        // shape 10: MYCON ----------------------------------------------
        currentShape = shapesMap.get("mycon");
        currentShape.baseHP = 68;
        currentShape.baseSpd = 30;
        currentShape.baseAgi = 10;
        currentShape.baseStr = 36;
        currentShape.baseArm = 72;
        currentShape.baseMag = 43;
        currentShape.baseRes = 70;
        //total = 329

        // shape 11: WORLDTREE ----------------------------------------------
        currentShape = shapesMap.get("worldtree");
        currentShape.baseHP = 120;
        currentShape.baseSpd = 0;
        currentShape.baseAgi = 0;
        currentShape.baseStr = 72;
        currentShape.baseArm = 10;
        currentShape.baseMag = 85;
        currentShape.baseRes = 10;
        //total = 297

        // shape 12: WORM ----------------------------------------------
        currentShape = shapesMap.get("worm");
        currentShape.baseHP = 80;
        currentShape.baseSpd = 30;
        currentShape.baseAgi = 20;
        currentShape.baseStr = 30;
        currentShape.baseArm = 0;
        currentShape.baseMag = 62;
        currentShape.baseRes = 70;
        //total = 292

        // shape 13: CRAB ----------------------------------------------
        currentShape = shapesMap.get("crab");
        currentShape.baseHP = 34;
        currentShape.baseSpd = 40;
        currentShape.baseAgi = 40;
        currentShape.baseStr = 47;
        currentShape.baseArm = 100;
        currentShape.baseMag = 12;
        currentShape.baseRes = 49;
        //total = 322

        // shape 14: KRAKEN ----------------------------------------------
        currentShape = shapesMap.get("kraken");
        currentShape.baseHP = 81;
        currentShape.baseSpd = 40;
        currentShape.baseAgi = 41;
        currentShape.baseStr = 52;
        currentShape.baseArm = 12;
        currentShape.baseMag = 62;
        currentShape.baseRes = 59;
        //total = 347

        // shape 15: LEVIATHAN ----------------------------------------------
        currentShape = shapesMap.get("leviathan");
        currentShape.baseHP = 74;
        currentShape.baseSpd = 73;
        currentShape.baseAgi = 54;
        currentShape.baseStr = 86;
        currentShape.baseArm = 12;
        currentShape.baseMag = 62;
        currentShape.baseRes = 59;

        // shape 16: HYDRA ----------------------------------------------
        currentShape = shapesMap.get("hydra");
        currentShape.baseHP = 92;
        currentShape.baseSpd = 11;
        currentShape.baseAgi = 31;
        currentShape.baseStr = 100;
        currentShape.baseArm = 67;
        currentShape.baseMag = 2;
        currentShape.baseRes = 45;

        // shape 17: DINOSAUR ----------------------------------------------
        currentShape = shapesMap.get("dinosaur");
        currentShape.baseHP = 92;
        currentShape.baseSpd = 11;
        currentShape.baseAgi = 14;
        currentShape.baseStr = 100;
        currentShape.baseArm = 67;
        currentShape.baseMag = 2;
        currentShape.baseRes = 45;
        //total = 385

        // shape 18: BEHEMOTH ----------------------------------------------
        currentShape = shapesMap.get("behemoth");
        currentShape.baseHP = 100;
        currentShape.baseSpd = 40;
        currentShape.baseAgi = 5;
        currentShape.baseStr = 90;
        currentShape.baseArm = 42;
        currentShape.baseMag = 70;
        currentShape.baseRes = 38;
        //total = 385

        // shape 19: DRAGON ----------------------------------------------
        currentShape = shapesMap.get("dragon");
        currentShape.baseHP = 85;
        currentShape.baseSpd = 53;
        currentShape.baseAgi = 11;
        currentShape.baseStr = 81;
        currentShape.baseArm = 47;
        currentShape.baseMag = 82;
        currentShape.baseRes = 67;
        //total = 426