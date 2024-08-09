import { shape } from "./game/shapes/shapes";


 
const iconUrls = import.meta.glob<true,string,{default:string}>('./gfx/aspecticons/*.png',{ eager: true });

export type baseStats = "HP" | "strength" | "magic" | "armor" | "resistance" | "speed" | "agility" | "none";
export type baseStatAbbreviation = "HP" | "str" | "mag" | "arm" | "res" | "spd" | "agi" | "none";
export type aspectsType = "fire" | "steel" | "fae" | "bugs" | "beast" | "bone" | "blood" | "hell" | "forest" | "solar" | "stars" | "abyss" | "machine" | "void" | "sands" | "rot" | "curse" | "heavens" | "storms" | "lifespring" | "none";
export type shapesType = "beetle" | "crawler"| "stinger" | "nightmare" | "canine" | "feline" | "critter" | "antler" | "winged" | "fruit" | "mycon" | "worldtree" | "worm" | "crab" | "kraken" | "leviathan" | "hydra" | "dinosaur" | "behemoth" | "dragon" | "none";

export type attackInteract = "normal" | "strong" | "resisted" | "nothing" | "rot" | "resistedrot";
export type defenseInteract = "neutral" | "resist" | "weak" | "immune" | "rotted" | "resistrotted"; 
export type relationships = "strong" | "weak" | "neutral" | "harmony" | "burst" | "catalyst" | "mutate" | "parasitic" | "devour" | "unique"; 

export type realm = "earthly" | "ascended" | "fallen";

export type statusEffect = "poison" | "rot" | "rust" | "none";
export type halfStatus = "beast" | "";


export type soulType = "natural" | "mirror" | "shadow" | "symbiosis" | "chaos" | "primordial" | "none";

export type actionType = "physical" | "magical" | "strongest" | "status";

export type targetType = "single" | "double" | "aoe" | "self" | "ally" | "front" | "diagonal" | "all" | "other";

export type actionEffects = "physical" | "magical" | "strongest" | "statusonly" |
 "basepower" | "powerMult" |
 "setAspect" | "setRealmAspect" | "setOthersRealmAspect" |
 "targetType"
 
;

export const aspectsList:Array<aspectsType> = ["fire","steel","fae","bugs","beast","bone","blood","hell","forest","solar","stars","abyss","machine","void","sands","rot","curse","heavens","storms","lifespring"];
export const shapesList:Array<shapesType> = ["beetle","crawler","stinger","nightmare","canine","feline","critter","antler","winged","fruit","mycon","worldtree","worm","crab","kraken","leviathan","hydra","dinosaur","behemoth","dragon"];
export const realmsList:Array<realm> = ["earthly","ascended","fallen"];
export const targetsList:Array<targetType> = ["single" , "double" , "aoe" , "self" , "ally" , "front" , "diagonal" , "all", "other"];


export const iconImages = new Map();

export const statusEffects = [];  

const preloader = document.createElement("img");

Object.entries(iconUrls).map(([url, promise])=>{
    let iconName = url;
    iconName = iconName.replace("./gfx/aspecticons/icon-","");
    iconName = iconName.replace(".png","");
    const imageSource = promise.default;
    console.log("images ",iconName,)
    iconImages.set(iconName,imageSource);
}); 

export class Aspect {

        name:string = "new aspect";
        typeStr:aspectsType = "fire";
        index:number = -1; 
        isShape = false;

        desc = "";

        attackRecord:Record<aspectsType,attackInteract>;
        defenseRecord:Record<aspectsType,defenseInteract>;
        reverseAttackRecord:Record<attackInteract,Array<aspectsType>> = {
            "normal": [],
            "strong": [],
            "nothing": [],
            "resisted": [],
            "rot": [],
            "resistedrot":[],
        }
        reverseDefenseRecord:Record<defenseInteract,Array<aspectsType>> = {
            "neutral": [],
            "resist": [],
            "immune": [],
            "weak": [],
            "rotted": [],
            "resistrotted":[],
        }

        relationshipRecord:Record<aspectsType|shapesType,[relationships,realm]>; 
        effectNameRecord:Record<relationships,[string,number]> = {
            "neutral": ["attack",0],
            "strong": ["attack",0],
            "weak":  ["attack",0],
            "burst":  ["attack",0],
            "harmony":  ["attack",0],
            "catalyst":  ["attack",0],
            "mutate":  ["attack",0],
            "parasitic":  ["attack",0],
            "devour":  ["attack",0],
            "unique":  ["attack",0],
        };

        effectRecord:Record<relationships, Array<[actionEffects,Array<number>]>> = {
            "neutral": [["basepower",[10]]],
            "strong": [["basepower",[10]]],
            "weak": [["basepower",[10]]],
            "burst": [["basepower",[10]]],
            "harmony": [["basepower",[10]]],
            "catalyst": [["basepower",[10]]],
            "mutate": [["basepower",[10]]],
            "parasitic": [["basepower",[10]]],
            "devour": [["basepower",[10]]],
            "unique": [["basepower",[10]]],
        };

        realmAspectRecord:Record<realm,aspectsType> = {
            "earthly": "fire",
            "ascended": "fire",
            "fallen": "fire",
        };
 

  
        protectEffect:Array<string> = [];

 
        favStat:baseStats = "none";
        earthlyStat:baseStats = "none";
        ascendedStat:baseStats = "none";
        phantasmStat:baseStats = "none"; 
        
        iconImg:HTMLImageElement = document.createElement("img");
        iconLoaded:boolean = false;
        iconURL:string = "";

        color:string = "rgb(255,255,255)";
        colorDark:string = "rgb(205,69,3)";
        colorLight:string = "rgb(255,108,15)"

        constructor(aspectType:aspectsType)
        {
            this.name = aspectType;
            this.typeStr = aspectType;

            this.iconImg.onload = () => {
                this.iconLoaded = true; 
                console.log("babon!",this.iconLoaded,this.name);
            }

            this.relationshipRecord = Object.fromEntries([...aspectsList.map(k => [k,["neutral","earthly"]]),...shapesList.map(k => [k,["neutral","earthly"]])]);
            this.attackRecord = Object.fromEntries([...aspectsList.map(k => [k,"normal"]) ]);
            this.defenseRecord = Object.fromEntries([...aspectsList.map(k => [k,"neutral"]) ]); 
        }

}

export class Shape {
            name:string = "new shape";
            typeStr:shapesType = "beetle";
            isShape = true;
            index:number = -1;

            desc = "";

            relationshipRecord:Record<aspectsType|shapesType,[relationships,realm]>; 
            effectNameRecord:Record<relationships,[string,number]> = {
                "neutral": ["attack",0],
                "strong": ["attack",0],
                "weak":  ["attack",0],
                "burst":  ["attack",0],
                "harmony":  ["attack",0],
                "catalyst":  ["attack",0],
                "mutate":  ["attack",0],
                "parasitic":  ["attack",0],
                "devour":  ["attack",0],
                "unique":  ["attack",0],
            };

            effectRecord:Record<relationships, Array<[actionEffects,Array<number>]>> = {
                "neutral": [["basepower",[10]]],
                "strong": [["basepower",[10]]],
                "weak": [["basepower",[10]]],
                "burst": [["basepower",[10]]],
                "harmony": [["basepower",[10]]],
                "catalyst": [["basepower",[10]]],
                "mutate": [["basepower",[10]]],
                "parasitic": [["basepower",[10]]],
                "devour": [["basepower",[10]]],
                "unique": [["basepower",[10]]],
            };

            realmAspectRecord:Record<realm,aspectsType> = {
                "earthly": "fire",
                "ascended": "fire",
                "fallen": "fire",
            };

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

            effect:Array<relationships> = [
                "strong"
            ];

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
                this.typeStr = shapeType;

                this.iconImg.onload = () => {
                    this.iconLoaded = true; 
                    console.log("babon!",this.iconLoaded,this.name);
                }
                this.relationshipRecord = Object.fromEntries([...aspectsList.map(k => [k,["neutral","earthly"]]),...shapesList.map(k => [k,["neutral","earthly"]])]);
            }
}

const dummyAspect = new Aspect("none");
const dummyShape = new Shape("none");

export const aspectsRecord:Record<aspectsType,Aspect> = Object.fromEntries( [...aspectsList.map(k => [k,dummyAspect])]);
export const shapesRecord:Record<shapesType,Shape> = Object.fromEntries( [...shapesList.map(k => [k,dummyShape])]);


const addAspectRelationship = (aspect:aspectsType,targetAspect:aspectsType|null,targetShape:shapesType|null,aspectRelationship:relationships,targetRelationship:relationships,realm:realm) => {

    const aspectObj = aspectsRecord[aspect];
    if (targetAspect != null)
    {
        const targetAspectObj = aspectsRecord[targetAspect];
        aspectObj.relationshipRecord[targetAspect] = [aspectRelationship,realm];
        targetAspectObj.relationshipRecord[aspect] = [targetRelationship,realm];  
    }
    else if (targetShape != null)
    {
        const targetShapeObj = shapesRecord[targetShape];
        
        aspectObj.relationshipRecord[targetShape] = [aspectRelationship,realm];
        targetShapeObj.relationshipRecord[aspect] = [targetRelationship,realm];   
    } 
}

const addShapeRelationship = (shape:shapesType,targetAspect:aspectsType|null,targetShape:shapesType|null,aspectRelationship:relationships,targetRelationship:relationships,realm:realm) => {

    const shapeObj = shapesRecord[shape];
    if (targetAspect != null)
    {
        const targetAspectObj = aspectsRecord[targetAspect];
        shapeObj.relationshipRecord[targetAspect] = [aspectRelationship,realm];
        targetAspectObj.relationshipRecord[shape] = [targetRelationship,realm]; 
    }
    else if (targetShape != null)
    {
        const targetShapeObj = shapesRecord[targetShape];
        shapeObj.relationshipRecord[targetShape] = [aspectRelationship,realm];
        targetShapeObj.relationshipRecord[shape] = [targetRelationship,realm]; 
    } 
}

const addEffects = (aspect:Aspect|null,shape:Shape|null,relationship:relationships,effectName:string,effectNamePriority:number,effectsArray:Array<[actionEffects,Array<number>]>) => {
     if (aspect != null)
        {
             aspect.effectNameRecord[relationship] = [effectName,effectNamePriority];
             aspect.effectRecord[relationship] = effectsArray;
        }
    else if (shape != null)
        {
            shape.effectNameRecord[relationship] = [effectName,effectNamePriority];
            shape.effectRecord[relationship] = effectsArray;
        }
}

const addAttackInteract = (originAspect:Aspect,interact:attackInteract,targetAspect:aspectsType) => { 
    const originType = originAspect.typeStr; 
    const target = aspectsRecord[targetAspect]; 
    originAspect.attackRecord[targetAspect] = interact;  
    originAspect.reverseAttackRecord[interact].push(targetAspect);

    let defendInteract:defenseInteract = "neutral";
    switch (interact)
    {
        case "strong": defendInteract = "weak"; break;
        case "resisted": defendInteract = "resist"; break;
        case "nothing": defendInteract = "immune"; break;
        case "rot": defendInteract = "rotted"; break;
    } 
    target.defenseRecord[originType] = defendInteract;  
    target.reverseDefenseRecord[defendInteract].push(originType);

} 


for (let i =0 ;i < aspectsList.length; i++)
{
    const currentAspectString = aspectsList[i]; 
    const newAspect = new Aspect(currentAspectString);
    newAspect.typeStr = currentAspectString;
    newAspect.index = i; 
    
    newAspect.iconImg.src = iconImages.get(currentAspectString);
    newAspect.realmAspectRecord["earthly"] = currentAspectString;
    aspectsRecord[currentAspectString]  = newAspect; 
} 

for (let i =0 ;i < shapesList.length; i++)
    {
        const currentShapeString = shapesList[i];
        const newShape = new Shape(currentShapeString);
        newShape.typeStr = currentShapeString;
        newShape.index = i;
        newShape.earthlyAspect = "fire";
        
        newShape.iconImg.src = iconImages.get(currentShapeString);
        shapesRecord[currentShapeString] = newShape; 
    }
     

    let currentAspect = aspectsRecord["fire"];
    let currentShape = shapesRecord["beetle"];
    ///declaring details
    /// aspect details =========================================================
    // aspect 0: FIRE ----------------------------------------------
    currentAspect = aspectsRecord["fire"];  
    currentAspect.color = "rgb(255,108,15)";
    currentAspect.iconImg.src = iconImages.get("fire"); 

    currentAspect.desc = "the volatile power of fire, creating and consuming";

    addEffects(currentAspect,null,"neutral","flame",0,[ ["basepower",[10]],["magical",[1]] ]);
    addEffects(currentAspect,null,"strong","burn",0,[]);
    addEffects(currentAspect,null,"weak","ember",0,[]);
    addEffects(currentAspect,null,"burst","blaze",0,[ ["basepower",[16]],  [ "targetType", [targetsList.indexOf("aoe")]] ]);
    addEffects(currentAspect,null,"harmony","fire",0,[]);
    addEffects(currentAspect,null,"devour","ash",0,[ ["physical",[1]], ["basepower",[8]] , ["setAspect", [aspectsRecord["sands"].index, 999]] ]);
    addEffects(currentAspect,null,"parasitic","ignite",0,[]);
    addEffects(currentAspect,null,"catalyst","tinder",0,[]);
    addEffects(currentAspect,null,"mutate","melting",0,[]);
    addEffects(currentAspect,null,"unique","inner",0, [ ["basepower",[10]],["strongest",[1]] ]);
 
    addAspectRelationship(currentAspect.typeStr,"fire",null,       "strong","strong","earthly");
    addAspectRelationship(currentAspect.typeStr,"steel",null,      "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,"fae",null,        "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,"bugs",null,       "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,"beast",null,      "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,"bone",null,       "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,"blood",null,      "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,"hell",null,       "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,"forest",null,     "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,"solar",null,      "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,"stars",null,      "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,"abyss",null,      "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,"machine",null,    "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,"void",null,       "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,"sands",null,      "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,"rot",null,        "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,"curse",null,      "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,"heavens",null,    "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,"storms",null,     "strong","weak","earthly");
    
    addAspectRelationship(currentAspect.typeStr,null,"beetle",     "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"crawler",    "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"stinger",    "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"nightmare",  "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"canine",     "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"feline",     "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"critter",    "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"antler",     "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"winged",     "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"fruit",      "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"mycon",      "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"worldtree",  "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"worm",       "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"crab",       "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"kraken",     "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"leviathan",  "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"hydra",      "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"dinosaur",   "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"behemoth",   "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"dragon",     "strong","weak","earthly");
 
 
    currentAspect.realmAspectRecord["ascended"] = "solar";
    currentAspect.realmAspectRecord["fallen"] = "hell";

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
    currentAspect = aspectsRecord["steel"];
 
    currentAspect.desc = "the solid power of steel, hard yet malleable";

    addEffects(currentAspect,null,"neutral","steel",0, [ ["basepower",[10]],["strongest",[1]] ]);
    addEffects(currentAspect,null,"strong","steel",0, [ ["basepower",[10]],["strongest",[1]] ]);
    addEffects(currentAspect,null,"weak","steel",0, [ ["basepower",[10]],["strongest",[1]] ]);
    addEffects(currentAspect,null,"burst","steel",0, [ ["basepower",[10]],["strongest",[1]] ]);
    addEffects(currentAspect,null,"harmony","steel",0, [ ["basepower",[10]],["strongest",[1]] ]);
    addEffects(currentAspect,null,"devour","steel",0, [ ["basepower",[10]],["strongest",[1]] ]);
    addEffects(currentAspect,null,"parasitic","steel",0, [ ["basepower",[10]],["strongest",[1]] ]);
    addEffects(currentAspect,null,"catalyst","steel",0, [ ["basepower",[10]],["strongest",[1]] ]);
    addEffects(currentAspect,null,"mutate","steel",0, [ ["basepower",[10]],["strongest",[1]] ]); 
    addEffects(currentAspect,null,"unique","forged",0, [ ["basepower",[10]],["strongest",[1]] ]);

    currentAspect.realmAspectRecord["ascended"] = "machine";
    currentAspect.realmAspectRecord["fallen"] = "steel";  

    currentAspect.color = "rgb(126,147,169)";
    addAttackInteract(currentAspect,"strong","fae"); 

     // aspect 2: FAE ----------------------------------------------
     currentAspect = aspectsRecord["fae"];
     currentAspect.color = "rgb(112,46,235)";
 
    currentAspect.desc = "the alluring power of the fae, transforming yet illusory";

        addEffects(currentAspect,null,"neutral","fae",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"strong","fae",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"weak","glitter",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"burst","fae",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"harmony","fae",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"devour","fae",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"parasitic","fae",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"catalyst","trick",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"mutate","change",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"unique","midsummer",0, [ ["basepower",[10]],["strongest",[1]] ]);

        currentAspect.realmAspectRecord["ascended"] = "stars";
        currentAspect.realmAspectRecord["fallen"] = "curse";  

     addAttackInteract(currentAspect,"strong","beast"); 
    
     // aspect 3: BUGS ----------------------------------------------
     currentAspect = aspectsRecord["bugs"];
     currentAspect.color = "rgb(156,166,87)";

     currentAspect.desc = "the  power of bugs, ";
     
     addEffects(currentAspect,null,"neutral","antlion",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"strong","antlion",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"weak","mosquito",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"burst","bugs",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"harmony","bugs",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"devour","bugs",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"parasitic","bugs",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"catalyst","bugs",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"mutate","bugs",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"unique","swarm",0, [ ["basepower",[10]],["strongest",[1]] ]);

        currentAspect.realmAspectRecord["ascended"] = "rot";
        currentAspect.realmAspectRecord["fallen"] = "fae";   

     addAttackInteract(currentAspect,"strong","bone"); 
    
     // aspect 4: BEAST ----------------------------------------------
     currentAspect = aspectsRecord["beast"];
     currentAspect.color = "rgb(74,60,53)"; 
     
     currentAspect.desc = "the untamed power of beasts, relentlessly hungry";
 
     addEffects(currentAspect,null,"neutral","roar",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"strong","beast",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"weak","beast",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"burst","beast",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"harmony","beast",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"devour","beast",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"parasitic","beast",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"catalyst","beast",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"mutate","beast",0, [ ["basepower",[10]],["strongest",[1]] ]); 
     addEffects(currentAspect,null,"unique","predator",0, [ ["basepower",[10]],["strongest",[1]] ]);
     
        currentAspect.realmAspectRecord["ascended"] = "blood";
        currentAspect.realmAspectRecord["fallen"] = "blood";    

     addAttackInteract(currentAspect,"strong","bone"); 

     // aspect 5: BONE ----------------------------------------------
     currentAspect = aspectsRecord["bone"];
     currentAspect.color = "rgb(255,243,217)";
 
     currentAspect.desc = "the  power of bone, grim yet supportive";

     addEffects(currentAspect,null,"neutral","skeleton",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"strong","bone",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"weak","bone",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"burst","bone",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"harmony","bone",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"devour","bone",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"parasitic","bone",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"catalyst","bone",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"mutate","bone",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"unique","fracture",0, [ ["basepower",[10]],["strongest",[1]] ]);

         currentAspect.realmAspectRecord["ascended"] = "sands";
        currentAspect.realmAspectRecord["fallen"] = "curse";    

     addAttackInteract(currentAspect,"strong","hell"); 

     // aspect 6: BLOOD ----------------------------------------------
     currentAspect = aspectsRecord["blood"];
     currentAspect.color = "rgb(216,16,16)";
 
     currentAspect.desc = "the  power of blood, ";

     addEffects(currentAspect,null,"neutral","vampire",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"strong","blood",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"weak","blood",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"burst","blood",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"harmony","blood",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"devour","blood",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"parasitic","blood",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"catalyst","blood",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"mutate","blood",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"unique","clot",-2, [ ["basepower",[10]],["strongest",[1]] ]);

         currentAspect.realmAspectRecord["ascended"] = "beast";
        currentAspect.realmAspectRecord["fallen"] = "fire";    

     addAttackInteract(currentAspect,"strong","heavens"); 

      // aspect 7: HELL ----------------------------------------------
      currentAspect = aspectsRecord["hell"];
      currentAspect.color = "rgb(201,44,111)";

      currentAspect.desc = "the forsaken power of hell, ";

      addEffects(currentAspect,null,"neutral","devil",0, [ ["basepower",[10]],["strongest",[1]] ]);
      addEffects(currentAspect,null,"strong","hell",0, [ ["basepower",[10]],["strongest",[1]] ]);
      addEffects(currentAspect,null,"weak","hell",0, [ ["basepower",[10]],["strongest",[1]] ]);
      addEffects(currentAspect,null,"burst","hell",0, [ ["basepower",[10]],["strongest",[1]] ]);
      addEffects(currentAspect,null,"harmony","hell",0, [ ["basepower",[10]],["strongest",[1]] ]);
      addEffects(currentAspect,null,"devour","hell",0, [ ["basepower",[10]],["strongest",[1]] ]);
      addEffects(currentAspect,null,"parasitic","hell",0, [ ["basepower",[10]],["strongest",[1]] ]);
      addEffects(currentAspect,null,"catalyst","hell",0, [ ["basepower",[10]],["strongest",[1]] ]);
      addEffects(currentAspect,null,"mutate","hell",0, [ ["basepower",[10]],["strongest",[1]] ]);
      addEffects(currentAspect,null,"unique","demonking",10, [ ["basepower",[10]],["strongest",[1]] ]);

        currentAspect.realmAspectRecord["ascended"] = "fire";
        currentAspect.realmAspectRecord["fallen"] = "machine";  

      addAttackInteract(currentAspect,"nothing","heavens"); 

      // aspect 8: FOREST ----------------------------------------------
      currentAspect = aspectsRecord["forest"];
      currentAspect.color = "rgb(116,164,68)"; 
      
     currentAspect.desc = "the ever-growing power of forests, ";

        addEffects(currentAspect,null,"neutral","woods",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"strong","forest",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"weak","forest",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"burst","forest",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"harmony","forest",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"devour","forest",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"parasitic","forest",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"catalyst","forest",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"mutate","forest",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"unique","endless",0, [ ["basepower",[10]],["strongest",[1]] ]);

            currentAspect.realmAspectRecord["ascended"] = "solar";
            currentAspect.realmAspectRecord["fallen"] = "rot";   

      addAttackInteract(currentAspect,"strong","bone"); 

      // aspect 9: SOLAR ----------------------------------------------
      currentAspect = aspectsRecord["solar"];
      currentAspect.color = "rgb(251,203,40)";

      
     currentAspect.desc = "the incandescent power of the sun, hopeful but cyclical";

        addEffects(currentAspect,null,"neutral","sunray",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"strong","sol",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"weak","solar",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"burst","supernova",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"harmony","solar",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"devour","solar",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"parasitic","solar",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"catalyst","solar",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"mutate","solar",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"unique","brightest",0, [ ["basepower",[10]],["strongest",[1]] ]);
        
            currentAspect.realmAspectRecord["ascended"] = "heavens";
            currentAspect.realmAspectRecord["fallen"] = "forest"; 


      addAttackInteract(currentAspect,"strong","curse"); 

      // aspect 10: STARS ----------------------------------------------
      currentAspect = aspectsRecord["stars"];
      currentAspect.color = "rgb(111,150,255)";

      
     currentAspect.desc = "the faraway power of the stars, subtle but ever-watching";

        addEffects(currentAspect,null,"neutral","galaxy",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"strong","starfall",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"weak","twinkle",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"burst","meteor",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"harmony","constellation",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"devour","stars",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"parasitic","alien",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"catalyst","stars",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"mutate","stars",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"unique","from the",0, [ ["basepower",[10]],["strongest",[1]] ]);
 
            currentAspect.realmAspectRecord["ascended"] = "solar";
            currentAspect.realmAspectRecord["fallen"] = "void";  

      addAttackInteract(currentAspect,"strong","fae"); 

      // aspect 11: ABYSS ----------------------------------------------
       currentAspect = aspectsRecord["abyss"];
       currentAspect.color = "rgb(65,121,139)";
 
        currentAspect.desc = "the sunken power of the abyss, quiet and ";

        addEffects(currentAspect,null,"neutral","deep",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"strong","drown",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"weak","pitch",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"burst","abyss",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"harmony","abyss",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"devour","abyss",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"parasitic","abyss",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"catalyst","abyss",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"mutate","abyss",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"unique","deepest",0, [ ["basepower",[10]],["strongest",[1]] ]);

        currentAspect.realmAspectRecord["ascended"] = "void";
        currentAspect.realmAspectRecord["fallen"] = "storms";   

       addAttackInteract(currentAspect,"strong","fire"); 

      // aspect 12: MACHINE ----------------------------------------------
      currentAspect = aspectsRecord["machine"];
      currentAspect.color = "rgb(147,123,138)"; 

      currentAspect.desc = "the efficient power of machines, designed and specialized";

        addEffects(currentAspect,null,"neutral","gear",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"strong","cannon",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"weak","scrap",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"burst","machine",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"harmony","machine",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"devour","machine",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"parasitic","machine",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"catalyst","homing",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"mutate","machine",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"unique","infinite",0, [ ["basepower",[10]],["strongest",[1]] ]);

        currentAspect.realmAspectRecord["ascended"] = "bugs";
        currentAspect.realmAspectRecord["fallen"] = "steel";  

      addAttackInteract(currentAspect,"strong","fae"); 

      // aspect 13: VOID ----------------------------------------------
      currentAspect = aspectsRecord["void"];
      currentAspect.color = "rgb(78,78,172)";
 
      currentAspect.desc = "the empty power of the void, infinite yet nothing";

        addEffects(currentAspect,null,"neutral","vacuum",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"strong","void",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"weak","void",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"burst","nothingness",1, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"harmony","void",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"devour","void",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"parasitic","void",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"catalyst","void",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"mutate","void",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"unique","endless",-1, [ ["basepower",[10]],["strongest",[1]] ]);

            currentAspect.realmAspectRecord["ascended"] = "stars";
            currentAspect.realmAspectRecord["fallen"] = "fae";   

      addAttackInteract(currentAspect,"strong","solar");

      // aspect 14: SANDS ----------------------------------------------
      currentAspect = aspectsRecord["sands"];
      currentAspect.color = "rgb(186,158,120)";
      
      currentAspect.desc = "the eroding power of the sands, diminutive yet overwhelming";

        addEffects(currentAspect,null,"neutral","dune",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"strong","desert",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"weak","beach",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"burst","scirocco",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"harmony","quicksand",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"devour","sands",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"parasitic","sands",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"catalyst","sands",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"mutate","sands",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"unique","tallest",0, [ ["basepower",[10]],["strongest",[1]] ]);
        
            currentAspect.realmAspectRecord["ascended"] = "forest";
            currentAspect.realmAspectRecord["fallen"] = "abyss";  

      addAttackInteract(currentAspect,"strong","fire");

      // aspect 15: ROT ----------------------------------------------
      currentAspect = aspectsRecord["rot"];
      currentAspect.color = "rgb(73,156,98)";
 
      currentAspect.desc = "the inevitable power of rot, both beginning and end";

        addEffects(currentAspect,null,"neutral","decay",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"strong","spore",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"weak","fungus",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"burst","mold",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"harmony","spoil",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"devour","waste",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"parasitic","host",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"catalyst","ferment",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"mutate","rust",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"unique","life from",0, [ ["basepower",[10]],["strongest",[1]] ]);
        
            currentAspect.realmAspectRecord["ascended"] = "forest";
            currentAspect.realmAspectRecord["fallen"] = "blood";   

        addAttackInteract(currentAspect,"nothing","steel");
        addAttackInteract(currentAspect,"rot","bugs");
        addAttackInteract(currentAspect,"rot","beast"); 
        addAttackInteract(currentAspect,"strong","blood");
        addAttackInteract(currentAspect,"resistedrot","heavens");

        // aspect 16: CURSE ----------------------------------------------
        currentAspect = aspectsRecord["curse"];
        currentAspect.color = "rgb(112,46,75)";
         
         currentAspect.desc = "the burdensome power of curses, hateful and obsessive";

            addEffects(currentAspect,null,"neutral","doom",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"strong","bane",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"weak","hollow",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"burst","evil-eye",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"harmony","hex",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"devour","strife",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"parasitic","jinx",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"catalyst","edge",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"mutate","wretch",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"unique","comforting",0, [ ["basepower",[10]],["strongest",[1]] ]);

            currentAspect.realmAspectRecord["ascended"] = "abyss";
            currentAspect.realmAspectRecord["fallen"] = "bone";   

        addAttackInteract(currentAspect,"strong","steel");

        // aspect 17: HEAVENS ----------------------------------------------
        currentAspect = aspectsRecord["heavens"];
        currentAspect.color = "rgb(254,251,146)";

        currentAspect.desc = "the immaculate power of the heavens, praising yet intolerant";

            addEffects(currentAspect,null,"neutral","banish",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"strong","purify",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"weak","heavens",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"burst","heavens",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"harmony","heavens",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"devour","heavens",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"parasitic","heavens",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"catalyst","heavens",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"mutate","heavens",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"unique","evil",0, [ ["basepower",[10]],["strongest",[1]] ]);

            currentAspect.realmAspectRecord["ascended"] = "solar";
            currentAspect.realmAspectRecord["fallen"] = "machine";   

        addAttackInteract(currentAspect,"strong","hell");

        // aspect 18: STORMS ----------------------------------------------
        currentAspect = aspectsRecord["storms"];
        currentAspect.color = "rgb(63,86,88)";
        
        currentAspect.desc = "the unstoppable power of storms, aimless and momentary";

            addEffects(currentAspect,null,"neutral","thunder",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"strong","monsoon",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"weak","squall",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"burst","typhoon",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"harmony","storms",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"devour","flood",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"parasitic","storms",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"catalyst","storms",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"mutate","storms",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"unique","echoing",0, [ ["basepower",[10]],["strongest",[1]] ]);

            currentAspect.realmAspectRecord["ascended"] = "storms";
            currentAspect.realmAspectRecord["fallen"] = "abyss";    

        addAttackInteract(currentAspect,"strong","fire");

        // aspect 19: LIFESPRING ----------------------------------------------
        currentAspect = aspectsRecord["lifespring"];
        currentAspect.color = "rgb(100,255,208)";
        
        currentAspect.desc = "the quenching power of the lifespring, trickling down with life";

            addEffects(currentAspect,null,"neutral","stream",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"strong","lifespring",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"weak","dewdrop",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"burst","splash",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"harmony","fountain",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"devour","lifespring",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"parasitic","lifespring",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"catalyst","lifespring",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"mutate","lifespring",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"unique","lifespring",0, [ ["basepower",[10]],["strongest",[1]] ]);

            currentAspect.realmAspectRecord["ascended"] = "blood";
            currentAspect.realmAspectRecord["fallen"] = "abyss";    

        addAttackInteract(currentAspect,"strong","fire");


    /////==============================================

        /////==============================================
///================================== shape details ======================================================================
                    ///shape begins yeah
        /////==============================================
        
        /////==============================================

        // shape 0: BEETLE ----------------------------------------------
        currentShape = shapesRecord["beetle"];

            addEffects(null,currentShape,"neutral","mandible",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"strong","beetle",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"weak","beetle",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"burst","beetle",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"harmony","beetle",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"devour","beetle",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"parasitic","beetle",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"catalyst","beetle",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"mutate","beetle",0, [ ["basepower",[10]],["strongest",[1]] ]);
 
            currentShape.realmAspectRecord["earthly"] = "bugs";
            currentShape.realmAspectRecord["ascended"] = "fae";
            currentShape.realmAspectRecord["fallen"] = "rot";    

        currentShape.baseHP = 42;
        currentShape.baseSpd = 50;
        currentShape.baseAgi = 30;  
        currentShape.baseStr = 64;
        currentShape.baseArm = 85;
        currentShape.baseMag = 30;
        currentShape.baseRes = 55;
        //total = 356

        // shape 1: CRAWLER ----------------------------------------------
        currentShape = shapesRecord["crawler"];
        
            addEffects(null,currentShape,"neutral","venombite",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"strong","crawler",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"weak","crawler",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"burst","crawler",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"harmony","crawler",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"devour","crawler",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"parasitic","crawler",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"catalyst","crawler",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"mutate","crawler",0, [ ["basepower",[10]],["strongest",[1]] ]);

            currentShape.realmAspectRecord["earthly"] = "bugs";
            currentShape.realmAspectRecord["ascended"] = "sands";
            currentShape.realmAspectRecord["fallen"] = "hell"; 

        currentShape.baseHP = 53;
        currentShape.baseSpd = 80;
        currentShape.baseAgi = 60;  
        currentShape.baseStr = 69;
        currentShape.baseArm = 50;
        currentShape.baseMag = 40;
        currentShape.baseRes = 20;
        //total = 372

        // shape 2: STINGER ----------------------------------------------
        currentShape = shapesRecord["stinger"];

            addEffects(null,currentShape,"neutral","sting",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"strong","inject",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"weak","buzz",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"burst","repeat",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"harmony","stinger",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"devour","stinger",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"parasitic","egg",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"catalyst","stinger",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"mutate","queen",0, [ ["basepower",[10]],["strongest",[1]] ]);

            currentShape.realmAspectRecord["earthly"] = "bugs";
            currentShape.realmAspectRecord["ascended"] = "machine";
            currentShape.realmAspectRecord["fallen"] = "void"; 

        currentShape.baseHP = 5;
        currentShape.baseSpd = 90;
        currentShape.baseAgi = 80;
        currentShape.baseStr = 52;
        currentShape.baseArm = 10;
        currentShape.baseMag = 70;
        currentShape.baseRes = 28;
        //total = 335

        // shape 3: NIGHTMARE ----------------------------------------------
        currentShape = shapesRecord["nightmare"];

            addEffects(null,currentShape,"neutral","horror",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"strong","nightmare",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"weak","nightmare",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"burst","nightmare",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"harmony","nightmare",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"devour","nightmare",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"parasitic","nightmare",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"catalyst","nightmare",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"mutate","nightmare",0, [ ["basepower",[10]],["strongest",[1]] ]);

            currentShape.realmAspectRecord["earthly"] = "curse";
            currentShape.realmAspectRecord["ascended"] = "void";
            currentShape.realmAspectRecord["fallen"] = "blood"; 

        currentShape.baseHP = 20;
        currentShape.baseSpd = 30;
        currentShape.baseAgi = 90;
        currentShape.baseStr = 60;
        currentShape.baseArm = 0;
        currentShape.baseMag = 80;
        currentShape.baseRes = 95;
        //total = 375

        // shape 4: CANINE ----------------------------------------------
        currentShape = shapesRecord["canine"];

            addEffects(null,currentShape,"neutral","bark",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"strong","lockjaw",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"weak","canine",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"burst","canine",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"harmony","canine",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"devour","canine",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"parasitic","canine",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"catalyst","canine",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"mutate","canine",0, [ ["basepower",[10]],["strongest",[1]] ]);

            currentShape.realmAspectRecord["earthly"] = "beast";
            currentShape.realmAspectRecord["ascended"] = "stars";
            currentShape.realmAspectRecord["fallen"] = "hell";  

        currentShape.baseHP = 66;
        currentShape.baseSpd = 65;
        currentShape.baseAgi = 25;
        currentShape.baseStr = 75;
        currentShape.baseArm = 30;
        currentShape.baseMag = 10;
        currentShape.baseRes = 45;
        //total = 316

        // shape 5: FELINE ----------------------------------------------
        currentShape = shapesRecord["feline"];

            addEffects(null,currentShape,"neutral","pounce",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"strong","feline",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"weak","meow",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"burst","feline",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"harmony","feline",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"devour","feline",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"parasitic","feline",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"catalyst","feline",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"mutate","feline",0, [ ["basepower",[10]],["strongest",[1]] ]);

            currentShape.realmAspectRecord["earthly"] = "beast";
            currentShape.realmAspectRecord["ascended"] = "solar";
            currentShape.realmAspectRecord["fallen"] = "void";   


        currentShape.baseHP = 45;
        currentShape.baseSpd = 80;
        currentShape.baseAgi = 90;
        currentShape.baseStr = 55;
        currentShape.baseArm = 10;
        currentShape.baseMag = 60;
        currentShape.baseRes = 30;
        //total = 370

        // shape 6: CRITTER ----------------------------------------------
        currentShape = shapesRecord["critter"];

            addEffects(null,currentShape,"neutral","swift",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"strong","critter",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"weak","critter",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"burst","critter",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"harmony","critter",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"devour","critter",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"parasitic","critter",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"catalyst","critter",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"mutate","critter",0, [ ["basepower",[10]],["strongest",[1]] ]);

            currentShape.realmAspectRecord["earthly"] = "blood";
            currentShape.realmAspectRecord["ascended"] = "forest";
            currentShape.realmAspectRecord["fallen"] = "fae";    

        currentShape.baseHP = 20;
        currentShape.baseSpd = 75;
        currentShape.baseAgi = 100;
        currentShape.baseStr = 35;
        currentShape.baseArm = 22;
        currentShape.baseMag = 45;
        currentShape.baseRes = 22;
        //total = 319

        // shape 7: ANTLER ----------------------------------------------
        currentShape = shapesRecord["antler"];

            addEffects(null,currentShape,"neutral","gore",0, [ ["basepower",[10]],["physical",[5]] ]);
            addEffects(null,currentShape,"strong","antler",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"weak","antler",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"burst","antler",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"harmony","antler",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"devour","antler",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"parasitic","antler",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"catalyst","antler",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"mutate","antler",0, [ ["basepower",[10]],["strongest",[1]] ]);

            currentShape.realmAspectRecord["earthly"] = "bone";
            currentShape.realmAspectRecord["ascended"] = "fae";
            currentShape.realmAspectRecord["fallen"] = "storms";  

        currentShape.baseHP = 65;
        currentShape.baseSpd = 25;
        currentShape.baseAgi = 70;
        currentShape.baseStr = 49;
        currentShape.baseArm = 32;
        currentShape.baseMag = 65;
        currentShape.baseRes = 62;
        //total = 368

        // shape 8: WINGED ----------------------------------------------
        currentShape = shapesRecord["winged"];

            addEffects(null,currentShape,"neutral","flying",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"strong","winged",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"weak","winged",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"burst","winged",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"harmony","winged",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"devour","winged",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"parasitic","winged",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"catalyst","winged",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"mutate","winged",0, [ ["basepower",[10]],["strongest",[1]] ]);

            currentShape.realmAspectRecord["earthly"] = "storms";
            currentShape.realmAspectRecord["ascended"] = "heavens";
            currentShape.realmAspectRecord["fallen"] = "hell";   

        currentShape.baseHP = 12;
        currentShape.baseSpd = 60;
        currentShape.baseAgi = 80;
        currentShape.baseStr = 29;
        currentShape.baseArm = 0;
        currentShape.baseMag = 45;
        currentShape.baseRes = 30;
        //total = 256

        // shape 9: FRUIT ----------------------------------------------
        currentShape = shapesRecord["fruit"];

            addEffects(null,currentShape,"neutral","fruit",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"strong","fruit",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"weak","fruit",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"burst","fruit",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"harmony","fruit",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"devour","fruit",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"parasitic","fruit",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"catalyst","fruit",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"mutate","fruit",0, [ ["basepower",[10]],["strongest",[1]] ]);

            currentShape.realmAspectRecord["earthly"] = "forest";
            currentShape.realmAspectRecord["ascended"] = "heavens";
            currentShape.realmAspectRecord["fallen"] = "rot";   

        currentShape.baseHP = 12;
        currentShape.baseSpd = 60;
        currentShape.baseAgi = 80;
        currentShape.baseStr = 29;
        currentShape.baseArm = 0;
        currentShape.baseMag = 45;
        currentShape.baseRes = 30;
        //total = 256

        // shape 10: MYCON ----------------------------------------------
        currentShape = shapesRecord["mycon"];
 
        addEffects(null,currentShape,"neutral","mycon",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"strong","mycon",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"weak","mycon",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"burst","mycon",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"harmony","mycon",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"devour","mycon",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"parasitic","cordycep",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"catalyst","mycon",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"mutate","mycon",0, [ ["basepower",[10]],["strongest",[1]] ]);

            currentShape.realmAspectRecord["earthly"] = "rot";
            currentShape.realmAspectRecord["ascended"] = "stars";
            currentShape.realmAspectRecord["fallen"] = "void";   

        currentShape.baseHP = 68;
        currentShape.baseSpd = 30;
        currentShape.baseAgi = 10;
        currentShape.baseStr = 36;
        currentShape.baseArm = 72;
        currentShape.baseMag = 43;
        currentShape.baseRes = 70;
        //total = 329

        // shape 11: WORLDTREE ----------------------------------------------
        currentShape = shapesRecord["worldtree"];

        addEffects(null,currentShape,"neutral","branch",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"strong","trunk",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"weak","bud",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"burst","worldtree",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"harmony","worldtree",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"devour","worldtree",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"parasitic","worldtree",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"catalyst","worldtree",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"mutate","worldtree",0, [ ["basepower",[10]],["strongest",[1]] ]);

            currentShape.realmAspectRecord["earthly"] = "forest";
            currentShape.realmAspectRecord["ascended"] = "solar";
            currentShape.realmAspectRecord["fallen"] = "blood";  

        currentShape.baseHP = 120;
        currentShape.baseSpd = 0;
        currentShape.baseAgi = 0;
        currentShape.baseStr = 72;
        currentShape.baseArm = 10;
        currentShape.baseMag = 85;
        currentShape.baseRes = 10;
        //total = 297

        // shape 12: WORM ----------------------------------------------
        currentShape = shapesRecord["worm"];

        addEffects(null,currentShape,"neutral","worm",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"strong","worm",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"weak","worm",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"burst","worm",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"harmony","worm",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"devour","worm",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"parasitic","worm",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"catalyst","worm",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"mutate","worm",0, [ ["basepower",[10]],["strongest",[1]] ]);

            currentShape.realmAspectRecord["earthly"] = "rot";
            currentShape.realmAspectRecord["ascended"] = "sands";
            currentShape.realmAspectRecord["fallen"] = "abyss";  

        currentShape.baseHP = 80;
        currentShape.baseSpd = 30;
        currentShape.baseAgi = 20;
        currentShape.baseStr = 30;
        currentShape.baseArm = 0;
        currentShape.baseMag = 62;
        currentShape.baseRes = 70;
        //total = 292

        // shape 13: CRAB ----------------------------------------------
        currentShape = shapesRecord["crab"];

        addEffects(null,currentShape,"neutral","pinch",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"strong","crab",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"weak","crab",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"burst","crab",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"harmony","crab",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"devour","crab",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"parasitic","crab",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"catalyst","crab",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"mutate","crab",0, [ ["basepower",[10]],["strongest",[1]] ]);

            currentShape.realmAspectRecord["earthly"] = "sands";
            currentShape.realmAspectRecord["ascended"] = "steel";
            currentShape.realmAspectRecord["fallen"] = "bugs"; 

        currentShape.baseHP = 34;
        currentShape.baseSpd = 40;
        currentShape.baseAgi = 40;
        currentShape.baseStr = 47;
        currentShape.baseArm = 100;
        currentShape.baseMag = 12;
        currentShape.baseRes = 49;
        //total = 322

        // shape 14: KRAKEN ----------------------------------------------
        currentShape = shapesRecord["kraken"];

        addEffects(null,currentShape,"neutral","tentacle",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"strong","kraken",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"weak","kraken",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"burst","kraken",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"harmony","kraken",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"devour","kraken",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"parasitic","kraken",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"catalyst","kraken",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"mutate","kraken",0, [ ["basepower",[10]],["strongest",[1]] ]);

            currentShape.realmAspectRecord["earthly"] = "abyss";
            currentShape.realmAspectRecord["ascended"] = "stars";
            currentShape.realmAspectRecord["fallen"] = "curse"; 

        currentShape.baseHP = 81;
        currentShape.baseSpd = 40;
        currentShape.baseAgi = 41;
        currentShape.baseStr = 52;
        currentShape.baseArm = 12;
        currentShape.baseMag = 62;
        currentShape.baseRes = 59;
        //total = 347

        // shape 15: LEVIATHAN ----------------------------------------------
        currentShape = shapesRecord["leviathan"];

        addEffects(null,currentShape,"neutral","engulf",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"strong","leviathan",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"weak","leviathan",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"burst","leviathan",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"harmony","leviathan",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"devour","leviathan",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"parasitic","leviathan",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"catalyst","leviathan",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"mutate","leviathan",0, [ ["basepower",[10]],["strongest",[1]] ]);

            currentShape.realmAspectRecord["earthly"] = "abyss";
            currentShape.realmAspectRecord["ascended"] = "heavens";
            currentShape.realmAspectRecord["fallen"] = "sands"; 

        currentShape.baseHP = 74;
        currentShape.baseSpd = 73;
        currentShape.baseAgi = 54;
        currentShape.baseStr = 86;
        currentShape.baseArm = 12;
        currentShape.baseMag = 62;
        currentShape.baseRes = 59;

        // shape 16: HYDRA ----------------------------------------------
        currentShape = shapesRecord["hydra"];

        addEffects(null,currentShape,"neutral","multibite",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"strong","hydra",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"weak","hydra",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"burst","hydra",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"harmony","hydra",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"devour","hydra",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"parasitic","hydra",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"catalyst","hydra",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"mutate","hydra",0, [ ["basepower",[10]],["strongest",[1]] ]);

           currentShape.realmAspectRecord["earthly"] = "beast";
            currentShape.realmAspectRecord["ascended"] = "forest";
            currentShape.realmAspectRecord["fallen"] = "hell"; 

        currentShape.baseHP = 92;
        currentShape.baseSpd = 11;
        currentShape.baseAgi = 31;
        currentShape.baseStr = 100;
        currentShape.baseArm = 67;
        currentShape.baseMag = 2;
        currentShape.baseRes = 45;

        // shape 17: DINOSAUR ----------------------------------------------
        currentShape = shapesRecord["dinosaur"];
 
        addEffects(null,currentShape,"neutral","stomp",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"strong","dinosaur",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"weak","dinosaur",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"burst","dinosaur",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"harmony","dinosaur",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"devour","dinosaur",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"parasitic","dinosaur",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"catalyst","dinosaur",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"mutate","dinosaur",0, [ ["basepower",[10]],["strongest",[1]] ]);

            currentShape.realmAspectRecord["earthly"] = "bone";
            currentShape.realmAspectRecord["ascended"] = "solar";
            currentShape.realmAspectRecord["fallen"] = "beast"; 

        currentShape.baseHP = 92;
        currentShape.baseSpd = 11;
        currentShape.baseAgi = 14;
        currentShape.baseStr = 100;
        currentShape.baseArm = 67;
        currentShape.baseMag = 2;
        currentShape.baseRes = 45;
        //total = 385

        // shape 18: BEHEMOTH ----------------------------------------------
        currentShape = shapesRecord["behemoth"];

        addEffects(null,currentShape,"neutral","stampede",0,        [ ["basepower",[22]],["physical",[4]],["setOthersRealmAspect",[3]]]);
        addEffects(null,currentShape,"strong","behemoth",0,         [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"weak","behemoth",0,           [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"burst","behemoth",0,          [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"harmony","behemoth",0,        [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"devour","behemoth",0,         [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"parasitic","behemoth",0,      [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"catalyst","behemoth",0,       [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"mutate","behemoth",0,         [ ["basepower",[10]],["strongest",[1]] ]);

            currentShape.realmAspectRecord["earthly"] = "beast";
            currentShape.realmAspectRecord["ascended"] = "fire";
            currentShape.realmAspectRecord["fallen"] = "stars"; 

        currentShape.baseHP = 100;
        currentShape.baseSpd = 40;
        currentShape.baseAgi = 5;
        currentShape.baseStr = 90;
        currentShape.baseArm = 42;
        currentShape.baseMag = 70;
        currentShape.baseRes = 38;
        //total = 385

        // shape 19: DRAGON ----------------------------------------------
        currentShape = shapesRecord["dragon"];

        addEffects(null,currentShape,"neutral","breath",-2, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"strong","noble",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"weak","dragon",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"burst","outrage",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"harmony","dragon",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"devour","dragon",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"parasitic","dragon",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"catalyst","dragon",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"mutate","dragon",0, [ ["basepower",[10]],["strongest",[1]] ]);

           currentShape.realmAspectRecord["earthly"] = "fire";
            currentShape.realmAspectRecord["ascended"] = "storms";
            currentShape.realmAspectRecord["fallen"] = "beast"; 

        currentShape.baseHP = 85;
        currentShape.baseSpd = 53;
        currentShape.baseAgi = 11;
        currentShape.baseStr = 81;
        currentShape.baseArm = 47;
        currentShape.baseMag = 82;
        currentShape.baseRes = 67;
        //total = 426