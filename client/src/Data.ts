import { shape } from "./game/shapes/shapes";


 
const iconUrls = import.meta.glob<true,string,{default:string}>('./gfx/aspecticons/*.png',{ eager: true });

export type baseStats = "HP" | "strength" | "magic" | "armor" | "resistance" | "speed" | "agility" | "none";
export type baseStatAbbreviation = "HP" | "str" | "mag" | "arm" | "res" | "spd" | "agi" | "none";
export type aspectsType = "fire" | "steel" | "fae" | "bugs" | "beast" | "bone" | "blood" | "hell" | "forest" | "solar" | "stars" | "abyss" | "machine" | "void" | "sands" | "rot" | "curse" | "heavens" | "storms" | "lifespring" | "imago" | "mortal" | "none";
export type shapesType = "beetle" | "crawler"| "stinger" | "nightmare" | "canine" | "feline" | "critter" | "antler" | "feather" | "fruit" | "mycon" | "worldtree" | "worm" | "crab" | "kraken" | "leviathan" | "hydra" | "dinosaur" | "behemoth" | "dragon" | "none";

export type attackInteract = "normal" | "strong" | "resisted" | "nothing" | "rot" | "resistedrot";
export type defenseInteract = "neutral" | "resist" | "weak" | "immune" | "rotted" | "resistrotted"; 
export type relationships = "strong" | "weak" | "neutral" | "harmony" | "burst" | "catalyst" | "mutate" | "parasitic" | "devour" | "unique"; 

export type realm = "earthly" | "ascended" | "fallen";

export type statusEffect = "poison" | "rot" | "rust" | "none";
export type halfStatus = "beast" | "";


export type soulType = "natural" | "mirror" | "shadow" | "symbiosis" | "chaos" | "primordial" | "none";

export type actionType = "physical" | "magical" | "strongest" | "status" | "protect";

export type targetType = "single" | "double" | "aoe" | "self" | "ally" | "front" | "diagonal" | "all" | "other";

export type actionEffects = "physical" | "magical" | "strongest" | "statusonly" |
 "basepower" | "powerMult" |
 "setAspect" | "setOthersAspect" | "setRealmAspect" | "setOthersRealmAspect" |
 "targetType"
 
;

export const aspectsList:Array<aspectsType> = ["fire","steel","fae","bugs","beast","bone","blood","hell","forest","solar","stars","abyss","machine","void","sands","rot","curse","heavens","storms","lifespring"];
export const aspectsListExtended:Array<aspectsType> = ["fire","steel","fae","bugs","beast","bone","blood","hell","forest","solar","stars","abyss","machine","void","sands","rot","curse","heavens","storms","lifespring"];
export const shapesList:Array<shapesType> = ["beetle","crawler","stinger","nightmare","canine","feline","critter","antler","feather","fruit","mycon","worldtree","worm","crab","kraken","leviathan","hydra","dinosaur","behemoth","dragon"];
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

    // soul details - "natural" | "mirror" | "shadow" | "symbiosis" | "chaos" | "primordial"  | "none";

    // soul 0: NATURAL
    // no changes, uses standard relationships

    // soul 1: MIRROR
    // few changes, merely flips relationships

    // soul 2: SHADOW
    // changes type relationships thusly:
    // neutral > harmonious  ||  harmonious > burst
    // strong > parasitic    || weak > strong
    // burst >  weak         || parasitic > neutral
    // catalyst > mutate     || mutate > catalyst
    // unique remains no matter what

    // soul 3: SYMBIOSIS
    // relationships are those of the previous move on the user's list
    // unique remains no matter what
    // 

    
    // soul 4: PRIMORDIAL
    // relationship becomes the same for both - removes catalyst/mutate if needed otherwise it's first of the two (always aspect, otherwise first shape/aspect);
    // unique remains no matter what

    // soul ?: RADIANT
    // has the relationships of ascended aspects
    //

    // soul ?: 
    // has the relationships of fallen aspects
    //

    // soul 5: CHAOSED
    // relationship is same but effect is from realmed aspect instead with same base aspect - cuts user's stats by 10%?
    // unique remains no matter what




    /// aspect details =========================================================
    // aspect 0: FIRE ----------------------------------------------
    currentAspect = aspectsRecord["fire"];  
    currentAspect.color = "rgb(255,108,15)";
    currentAspect.iconImg.src = iconImages.get("fire"); 

    currentAspect.desc = "the volatile power of fire, creating and consuming";

    addEffects(currentAspect,null,"neutral","flame",0,[ ["basepower",[10]],["magical",[1]] , ["setAspect", [aspectsRecord["fire"].index, 12]]]);  
    // basic magical preference attack
    addEffects(currentAspect,null,"strong","burn",0,[]);
    // focus on adding burning status ailment
    addEffects(currentAspect,null,"weak","ember",2,[]);
    addEffects(currentAspect,null,"burst","blaze",0,[ ["basepower",[16]],  [ "targetType", [targetsList.indexOf("aoe")]] ]);
    // huge AoE attack big damage etc
    addEffects(currentAspect,null,"harmony","torch",0,[]);
    addEffects(currentAspect,null,"devour","ash",3,[ ["physical",[1]], ["basepower",[8]] , ["setAspect", [aspectsRecord["sands"].index, 999]] ]);
    // almost always sets aspects to sands
    addEffects(currentAspect,null,"parasitic","combust",0,[]);
    // 
    addEffects(currentAspect,null,"catalyst","ignite",0,[]);
    // probably more of a buff
    addEffects(currentAspect,null,"mutate","melting",5,[]);
    // 
    addEffects(currentAspect,null,"unique","inner",99, [ ["basepower",[10]],["strongest",[1]] ]);
    // 
 
    addAspectRelationship(currentAspect.typeStr,"fire",null,       "neutral","neutral","earthly");
    addAspectRelationship(currentAspect.typeStr,"steel",null,      "mutate","neutral","earthly");
    addAspectRelationship(currentAspect.typeStr,"fae",null,        "harmony","neutral","earthly");
    addAspectRelationship(currentAspect.typeStr,"bugs",null,       "mutate","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,"beast",null,      "neutral","neutral","earthly");
    addAspectRelationship(currentAspect.typeStr,"bone",null,       "strong","neutral","earthly");
    addAspectRelationship(currentAspect.typeStr,"blood",null,      "burst","harmony","earthly");
    addAspectRelationship(currentAspect.typeStr,"hell",null,       "catalyst","burst","earthly");
    addAspectRelationship(currentAspect.typeStr,"forest",null,     "devour","catalyst","earthly");
    addAspectRelationship(currentAspect.typeStr,"solar",null,      "parasitic","harmony","earthly");
    addAspectRelationship(currentAspect.typeStr,"stars",null,      "neutral","neutral","earthly");
    addAspectRelationship(currentAspect.typeStr,"abyss",null,      "weak","devour","earthly");
    addAspectRelationship(currentAspect.typeStr,"machine",null,    "burst","burst","earthly");
    addAspectRelationship(currentAspect.typeStr,"void",null,       "weak","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,"sands",null,      "weak","devour","earthly");
    addAspectRelationship(currentAspect.typeStr,"rot",null,        "burst","parasitic","earthly");
    addAspectRelationship(currentAspect.typeStr,"curse",null,      "parasitic","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,"heavens",null,    "catalyst","strong","earthly");
    addAspectRelationship(currentAspect.typeStr,"storms",null,     "weak","strong","earthly");
    addAspectRelationship(currentAspect.typeStr,"lifespring",null, "neutral","harmony","earthly");
    
    addAspectRelationship(currentAspect.typeStr,null,"beetle",     "strong","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"crawler",    "catalyst","neutral","fallen");
    addAspectRelationship(currentAspect.typeStr,null,"stinger",    "weak","catalyst","ascended");
    addAspectRelationship(currentAspect.typeStr,null,"nightmare",  "devour","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"canine",     "weak","weak","fallen");
    addAspectRelationship(currentAspect.typeStr,null,"feline",     "neutral","neutral","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"critter",    "mutate","harmony","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"antler",     "mutate","strong","fallen");
    addAspectRelationship(currentAspect.typeStr,null,"feather",     "catalyst","neutral","fallen");
    addAspectRelationship(currentAspect.typeStr,null,"fruit",      "devour","weak","ascended");
    addAspectRelationship(currentAspect.typeStr,null,"mycon",      "harmony","weak","ascended");
    addAspectRelationship(currentAspect.typeStr,null,"worldtree",  "burst","weak","fallen");
    addAspectRelationship(currentAspect.typeStr,null,"worm",       "mutate","devour","ascended");
    addAspectRelationship(currentAspect.typeStr,null,"crab",       "neutral","weak","fallen");
    addAspectRelationship(currentAspect.typeStr,null,"kraken",     "harmony","mutate","fallen");
    addAspectRelationship(currentAspect.typeStr,null,"leviathan",  "parasitic","weak","fallen");
    addAspectRelationship(currentAspect.typeStr,null,"hydra",      "strong","strong","ascended");
    addAspectRelationship(currentAspect.typeStr,null,"dinosaur",   "strong","weak","ascended");
    addAspectRelationship(currentAspect.typeStr,null,"behemoth",   "catalyst","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"dragon",     "harmony","harmony","ascended");
 
 
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

    addEffects(currentAspect,null,"neutral","steel",3, [ ["basepower",[10]],["physical",[1]] , ["setAspect", [aspectsRecord["steel"].index, 50]] ]);
    //setOthersRealmAspect
    addEffects(currentAspect,null,"strong","blade",-3, [ ["basepower",[12]],["physical",[9]] , ["setOthersRealmAspect", [4]] ]);
    //
    addEffects(currentAspect,null,"weak","ring",-1, [ ["basepower",[10]],["physical",[1]] ]);
    //
    addEffects(currentAspect,null,"burst","hammer",-3, [ ["basepower",[25]],["physical",[1]] ]);
    //
    addEffects(currentAspect,null,"harmony","shield",-2, [ ["basepower",[10]],["physical",[1]] ]);
    //
    addEffects(currentAspect,null,"devour","chain",1, [ ["basepower",[10]],["physical",[1]] ]);
    //
    addEffects(currentAspect,null,"parasitic","weld",2, [ ["basepower",[10]],["physical",[1]] , ["setAspect", [aspectsRecord["fire"].index, 3]] ]);
    //
    addEffects(currentAspect,null,"catalyst","serrated",20, [ ["basepower",[10]],["physical",[1]] ]);
    //
    addEffects(currentAspect,null,"mutate","cold iron",9, [ ["basepower",[10]],["physical",[1]] ]); 
    //
    addEffects(currentAspect,null,"unique","forged",0, [ ["basepower",[34]],["physical",[1]] ]);
    // no additional effect it's just hella good
    
    addAspectRelationship(currentAspect.typeStr,"steel",null,      "burst","burst","earthly");
    addAspectRelationship(currentAspect.typeStr,"fae",null,        "weak","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,"bugs",null,       "neutral","harmony","earthly");
    addAspectRelationship(currentAspect.typeStr,"beast",null,      "neutral","neutral","earthly");
    addAspectRelationship(currentAspect.typeStr,"bone",null,       "harmony","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,"blood",null,      "strong","neutral","earthly");
    addAspectRelationship(currentAspect.typeStr,"hell",null,       "weak","strong","earthly");
    addAspectRelationship(currentAspect.typeStr,"forest",null,     "neutral","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,"solar",null,      "strong","neutral","earthly");
    addAspectRelationship(currentAspect.typeStr,"stars",null,      "burst","neutral","earthly");
    addAspectRelationship(currentAspect.typeStr,"abyss",null,      "burst","parasitic","earthly");
    addAspectRelationship(currentAspect.typeStr,"machine",null,    "parasitic","harmony","earthly");
    addAspectRelationship(currentAspect.typeStr,"void",null,       "harmony","strong","earthly");
    addAspectRelationship(currentAspect.typeStr,"sands",null,      "devour","catalyst","earthly");
    addAspectRelationship(currentAspect.typeStr,"rot",null,        "harmony","mutate","earthly");
    addAspectRelationship(currentAspect.typeStr,"curse",null,      "mutate","neutral","earthly");
    addAspectRelationship(currentAspect.typeStr,"heavens",null,    "devour","parasitic","earthly");
    addAspectRelationship(currentAspect.typeStr,"storms",null,     "strong","burst","earthly");
    addAspectRelationship(currentAspect.typeStr,"lifespring",null, "neutral","mutate","earthly");
    
    addAspectRelationship(currentAspect.typeStr,null,"beetle",     "neutral","strong","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"crawler",    "strong","catalyst","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"stinger",    "mutate","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"nightmare",  "devour","strong","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"canine",     "neutral","strong","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"feline",     "catalyst","burst","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"critter",    "parasitic","strong","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"antler",     "harmony","catalyst","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"feather",    "mutate","neutral","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"fruit",      "neutral","strong","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"mycon",      "burst","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"worldtree",  "weak","burst","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"worm",       "mutate","parasitic","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"crab",       "neutral","weak","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"kraken",     "neutral","parasitic","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"leviathan",  "parasitic","burst","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"hydra",      "devour","harmony","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"dinosaur",   "burst","catalyst","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"behemoth",   "catalyst","burst","earthly");
    addAspectRelationship(currentAspect.typeStr,null,"dragon",     "weak","parasitic","earthly");

    currentAspect.realmAspectRecord["ascended"] = "machine";
    currentAspect.realmAspectRecord["fallen"] = "steel";  

    currentAspect.color = "rgb(126,147,169)";
    addAttackInteract(currentAspect,"strong","fae"); 

     // aspect 2: FAE ----------------------------------------------
     currentAspect = aspectsRecord["fae"];
     currentAspect.color = "rgb(112,46,235)";
 
    currentAspect.desc = "the alluring power of the fae, transforming yet illusory";

        addEffects(currentAspect,null,"neutral","illusion",-1, [ ["basepower",[10]],["magical",[1]] ]);
        //
        addEffects(currentAspect,null,"strong","magick",5, [ ["basepower",[10]],["magical",[12]] ]);
        //
        addEffects(currentAspect,null,"weak","glitter",1, [ ["basepower",[10]],["magical",[1]] ]);
        addEffects(currentAspect,null,"burst","bewitch",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"harmony","royal",50, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"devour","vaporize",-5, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"parasitic","confusion",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"catalyst","trick",-2, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"mutate","morph",-5, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"unique","midsummer",99, [ ["basepower",[10]],["strongest",[1]] ]);
        
        addAspectRelationship(currentAspect.typeStr,"fae",null,        "neutral","neutral","earthly");
        addAspectRelationship(currentAspect.typeStr,"bugs",null,       "harmony","strong","earthly");
        addAspectRelationship(currentAspect.typeStr,"beast",null,      "harmony","devour","earthly");
        addAspectRelationship(currentAspect.typeStr,"bone",null,       "mutate","harmony","earthly");
        addAspectRelationship(currentAspect.typeStr,"blood",null,      "burst","parasitic","earthly");
        addAspectRelationship(currentAspect.typeStr,"hell",null,       "devour","strong","earthly");
        addAspectRelationship(currentAspect.typeStr,"forest",null,     "parasitic","parasitic","earthly");
        addAspectRelationship(currentAspect.typeStr,"solar",null,      "strong","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,"stars",null,      "parasitic","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,"abyss",null,      "catalyst","devour","earthly");
        addAspectRelationship(currentAspect.typeStr,"machine",null,    "weak","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,"void",null,       "weak","catalyst","earthly");
        addAspectRelationship(currentAspect.typeStr,"sands",null,      "neutral","devour","earthly");
        addAspectRelationship(currentAspect.typeStr,"rot",null,        "strong","parasitic","earthly");
        addAspectRelationship(currentAspect.typeStr,"curse",null,      "harmony","burst","earthly");
        addAspectRelationship(currentAspect.typeStr,"heavens",null,    "devour","burst","earthly");
        addAspectRelationship(currentAspect.typeStr,"storms",null,     "weak","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,"lifespring",null, "burst","weak","earthly");
        
        addAspectRelationship(currentAspect.typeStr,null,"beetle",     "mutate","parasitic","ascended");
        addAspectRelationship(currentAspect.typeStr,null,"crawler",    "catalyst","burst","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"stinger",    "neutral","burst","ascended");
        addAspectRelationship(currentAspect.typeStr,null,"nightmare",  "neutral","parasitic","fallen");
        addAspectRelationship(currentAspect.typeStr,null,"canine",     "harmony","devour","fallen");
        addAspectRelationship(currentAspect.typeStr,null,"feline",     "burst","parasitic","fallen");
        addAspectRelationship(currentAspect.typeStr,null,"critter",    "catalyst","parasitic","ascended");
        addAspectRelationship(currentAspect.typeStr,null,"antler",     "harmony","harmony","ascended");
        addAspectRelationship(currentAspect.typeStr,null,"feather",     "strong","weak","ascended");
        addAspectRelationship(currentAspect.typeStr,null,"fruit",      "catalyst","weak","ascended");
        addAspectRelationship(currentAspect.typeStr,null,"mycon",      "parasitic","mutate","fallen");
        addAspectRelationship(currentAspect.typeStr,null,"worldtree",  "weak","harmony","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"worm",       "parasitic","neutral","fallen");
        addAspectRelationship(currentAspect.typeStr,null,"crab",       "mutate","burst","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"kraken",     "devour","strong","fallen");
        addAspectRelationship(currentAspect.typeStr,null,"leviathan",  "burst","harmony","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"hydra",      "neutral","mutate","ascended");
        addAspectRelationship(currentAspect.typeStr,null,"dinosaur",   "mutate","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"behemoth",   "strong","mutate","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"dragon",     "neutral","parasitic","ascended");

        currentAspect.realmAspectRecord["ascended"] = "stars";
        currentAspect.realmAspectRecord["fallen"] = "curse";  

     addAttackInteract(currentAspect,"strong","beast"); 
    
     // aspect 3: BUGS ----------------------------------------------
     currentAspect = aspectsRecord["bugs"];
     currentAspect.color = "rgb(156,166,87)";

     currentAspect.desc = "the  power of bugs, ";
     
     addEffects(currentAspect,null,"neutral","locusts",-1, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"strong","mantis",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"weak","dragonfly",-1, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"burst","centipede",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"harmony","army-ants",-1, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"devour","antlion",-1, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"parasitic","tick",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"catalyst","cicada",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"mutate","grub",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"unique","swarming",99, [ ["basepower",[20]],["strongest",[1]] ]); 
     
     addAspectRelationship(currentAspect.typeStr,"bugs",null,       "neutral","neutral","earthly");
     addAspectRelationship(currentAspect.typeStr,"beast",null,      "burst","catalyst","earthly");
     addAspectRelationship(currentAspect.typeStr,"bone",null,       "parasitic","devour","earthly");
     addAspectRelationship(currentAspect.typeStr,"blood",null,      "parasitic","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,"hell",null,       "neutral","mutate","earthly");
     addAspectRelationship(currentAspect.typeStr,"forest",null,     "neutral","catalyst","earthly");
     addAspectRelationship(currentAspect.typeStr,"solar",null,      "catalyst","harmony","earthly");
     addAspectRelationship(currentAspect.typeStr,"stars",null,      "devour","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,"abyss",null,      "weak","mutate","earthly");
     addAspectRelationship(currentAspect.typeStr,"machine",null,    "devour","weak","earthly");
     addAspectRelationship(currentAspect.typeStr,"void",null,       "harmony","mutate","earthly");
     addAspectRelationship(currentAspect.typeStr,"sands",null,      "strong","weak","earthly");
     addAspectRelationship(currentAspect.typeStr,"rot",null,        "neutral","burst","earthly");
     addAspectRelationship(currentAspect.typeStr,"curse",null,      "burst","neutral","earthly");
     addAspectRelationship(currentAspect.typeStr,"heavens",null,    "harmony","weak","earthly");
     addAspectRelationship(currentAspect.typeStr,"storms",null,     "weak","harmony","earthly");
     addAspectRelationship(currentAspect.typeStr,"lifespring",null, "mutate","devour","earthly");
     
     addAspectRelationship(currentAspect.typeStr,null,"beetle",     "mutate","strong","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"crawler",    "burst","catalyst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"stinger",    "harmony","mutate","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"nightmare",  "strong","weak","ascended");
     addAspectRelationship(currentAspect.typeStr,null,"canine",     "parasitic","catalyst","fallen");
     addAspectRelationship(currentAspect.typeStr,null,"feline",     "strong","devour","fallen");
     addAspectRelationship(currentAspect.typeStr,null,"critter",    "parasitic","mutate","fallen");
     addAspectRelationship(currentAspect.typeStr,null,"antler",     "devour","catalyst","fallen");
     addAspectRelationship(currentAspect.typeStr,null,"feather",    "weak","burst","fallen");
     addAspectRelationship(currentAspect.typeStr,null,"fruit",      "mutate","harmony","ascended");
     addAspectRelationship(currentAspect.typeStr,null,"mycon",      "harmony","parasitic","ascended");
     addAspectRelationship(currentAspect.typeStr,null,"worldtree",  "strong","harmony","ascended");
     addAspectRelationship(currentAspect.typeStr,null,"worm",       "devour","burst","ascended");
     addAspectRelationship(currentAspect.typeStr,null,"crab",       "harmony","neutral","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"kraken",     "burst","weak","ascended");
     addAspectRelationship(currentAspect.typeStr,null,"leviathan",  "catalyst","harmony","fallen");
     addAspectRelationship(currentAspect.typeStr,null,"hydra",      "devour","strong","fallen");
     addAspectRelationship(currentAspect.typeStr,null,"dinosaur",   "neutral","mutate","fallen");
     addAspectRelationship(currentAspect.typeStr,null,"behemoth",   "harmony","weak","fallen");
     addAspectRelationship(currentAspect.typeStr,null,"dragon",     "weak","strong","fallen");

        currentAspect.realmAspectRecord["ascended"] = "rot";
        currentAspect.realmAspectRecord["fallen"] = "fae";   

     addAttackInteract(currentAspect,"strong","bone"); 

     ///--------------------------bonus aspect - bugs imago

         /*currentAspect = aspectsRecord["bugs"];
          currentAspect.color = "rgb(156,166,87)";
     
          currentAspect.desc = "the  power of bugs, ";
          
          addEffects(currentAspect,null,"neutral","locust",0, [ ["basepower",[10]],["strongest",[1]] ]);
          addEffects(currentAspect,null,"strong","mantis",0, [ ["basepower",[10]],["strongest",[1]] ]);
          addEffects(currentAspect,null,"weak","mosquito",0, [ ["basepower",[10]],["strongest",[1]] ]);
          addEffects(currentAspect,null,"burst","centipede",0, [ ["basepower",[10]],["strongest",[1]] ]);
          addEffects(currentAspect,null,"harmony","wasp",0, [ ["basepower",[10]],["strongest",[1]] ]);
          addEffects(currentAspect,null,"devour","antlion",0, [ ["basepower",[10]],["strongest",[1]] ]);
          addEffects(currentAspect,null,"parasitic","tick",0, [ ["basepower",[10]],["strongest",[1]] ]);
          addEffects(currentAspect,null,"catalyst","bugs",0, [ ["basepower",[10]],["strongest",[1]] ]);
          addEffects(currentAspect,null,"mutate","bugs",0, [ ["basepower",[10]],["strongest",[1]] ]);
          addEffects(currentAspect,null,"unique","swarm",-20, [ ["basepower",[20]],["strongest",[1]] ]); 
          
          addAspectRelationship(currentAspect.typeStr,"bugs",null,       "neutral","neutral","earthly");
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
          addAspectRelationship(currentAspect.typeStr,"lifespring",null, "strong","weak","earthly");
          
          addAspectRelationship(currentAspect.typeStr,null,"beetle",     "strong","weak","earthly");
          addAspectRelationship(currentAspect.typeStr,null,"crawler",    "strong","weak","earthly");
          addAspectRelationship(currentAspect.typeStr,null,"stinger",    "strong","weak","earthly");
          addAspectRelationship(currentAspect.typeStr,null,"nightmare",  "strong","weak","earthly");
          addAspectRelationship(currentAspect.typeStr,null,"canine",     "strong","weak","earthly");
          addAspectRelationship(currentAspect.typeStr,null,"feline",     "strong","weak","earthly");
          addAspectRelationship(currentAspect.typeStr,null,"critter",    "strong","weak","earthly");
          addAspectRelationship(currentAspect.typeStr,null,"antler",     "strong","weak","earthly");
          addAspectRelationship(currentAspect.typeStr,null,"feather",     "strong","weak","earthly");
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
     
             currentAspect.realmAspectRecord["ascended"] = "rot";
             currentAspect.realmAspectRecord["fallen"] = "fae";   
     
          addAttackInteract(currentAspect,"strong","bone"); */     
    
     // aspect 4: BEAST ----------------------------------------------
     currentAspect = aspectsRecord["beast"];
     currentAspect.color = "rgb(74,60,53)"; 
     
     currentAspect.desc = "the untamed power of beasts, relentlessly hungry";
 
     addEffects(currentAspect,null,"neutral","fang",-4, [ ["basepower",[10]],["physical",[3]] ]);
     addEffects(currentAspect,null,"strong","claw",-3, [ ["basepower",[10]],["physical",[2]] ]);
     addEffects(currentAspect,null,"weak","snarl",-2, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"burst","roar",-2, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"harmony","hunt",-5, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"devour","feast",-4, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"parasitic","instinct",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"catalyst","relentless",7, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"mutate","frenzy",-2, [ ["basepower",[10]],["strongest",[1]] ]); 

     addEffects(currentAspect,null,"unique","predator",99, [ ["basepower",[10]],["strongest",[1]] ]);

     
     addAspectRelationship(currentAspect.typeStr,"beast",null,      "parasitic","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,"bone",null,       "devour","mutate","earthly");
     addAspectRelationship(currentAspect.typeStr,"blood",null,      "mutate","weak","earthly");
     addAspectRelationship(currentAspect.typeStr,"hell",null,       "burst","catalyst","earthly");
     addAspectRelationship(currentAspect.typeStr,"forest",null,     "parasitic","mutate","earthly");
     addAspectRelationship(currentAspect.typeStr,"solar",null,      "harmony","weak","earthly");
     addAspectRelationship(currentAspect.typeStr,"stars",null,      "burst","devour","earthly");
     addAspectRelationship(currentAspect.typeStr,"abyss",null,      "neutral","mutate","earthly");
     addAspectRelationship(currentAspect.typeStr,"machine",null,    "neutral","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,"void",null,       "strong","neutral","earthly");
     addAspectRelationship(currentAspect.typeStr,"sands",null,      "harmony","weak","earthly");
     addAspectRelationship(currentAspect.typeStr,"rot",null,        "devour","neutral","earthly");
     addAspectRelationship(currentAspect.typeStr,"curse",null,      "weak","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,"heavens",null,    "burst","neutral","earthly");
     addAspectRelationship(currentAspect.typeStr,"storms",null,     "strong","neutral","earthly");
     addAspectRelationship(currentAspect.typeStr,"lifespring",null, "catalyst","strong","earthly");
     
     addAspectRelationship(currentAspect.typeStr,null,"beetle",     "neutral","catalyst","ascended");
     addAspectRelationship(currentAspect.typeStr,null,"crawler",    "harmony","weak","ascended");
     addAspectRelationship(currentAspect.typeStr,null,"stinger",    "neutral","strong","ascended");
     addAspectRelationship(currentAspect.typeStr,null,"nightmare",  "harmony","catalyst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"canine",     "catalyst","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"feline",     "neutral","strong","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"critter",    "strong","neutral","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"antler",     "parasitic","devour","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"feather",    "strong","devour","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"fruit",      "neutral","weak","fallen");
     addAspectRelationship(currentAspect.typeStr,null,"mycon",      "devour","burst","fallen");
     addAspectRelationship(currentAspect.typeStr,null,"worldtree",  "strong","burst","fallen");
     addAspectRelationship(currentAspect.typeStr,null,"worm",       "neutral","strong","ascended");
     addAspectRelationship(currentAspect.typeStr,null,"crab",       "neutral","strong","ascended");
     addAspectRelationship(currentAspect.typeStr,null,"kraken",     "devour","strong","ascended");
     addAspectRelationship(currentAspect.typeStr,null,"leviathan",  "burst","weak","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"hydra",      "weak","catalyst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"dinosaur",   "harmony","burst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"behemoth",   "strong","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"dragon",     "weak","mutate","fallen");
     
        currentAspect.realmAspectRecord["ascended"] = "blood";
        currentAspect.realmAspectRecord["fallen"] = "blood";    

     addAttackInteract(currentAspect,"strong","bone"); 

     // aspect 5: BONE ----------------------------------------------
     currentAspect = aspectsRecord["bone"];
     currentAspect.color = "rgb(255,243,217)";
 
     currentAspect.desc = "the  power of bone, grim yet supportive";

     addEffects(currentAspect,null,"neutral","skeleton",4, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"strong","tooth",-2, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"weak","ribcage",-1, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"burst","fracture",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"harmony","skull",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"devour","splinter",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"parasitic","calcify",8, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"catalyst","mending",3, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"mutate","marrow",-2, [ ["basepower",[10]],["strongest",[1]] ]);

     addEffects(currentAspect,null,"unique","enlarge",99, [ ["basepower",[10]],["strongest",[1]] ]);

     
     addAspectRelationship(currentAspect.typeStr,"bone",null,       "neutral","neutral","earthly");
     addAspectRelationship(currentAspect.typeStr,"blood",null,      "devour","burst","earthly");
     addAspectRelationship(currentAspect.typeStr,"hell",null,       "harmony","strong","earthly");
     addAspectRelationship(currentAspect.typeStr,"forest",null,     "weak","strong","earthly");
     addAspectRelationship(currentAspect.typeStr,"solar",null,      "neutral","devour","earthly");
     addAspectRelationship(currentAspect.typeStr,"stars",null,      "burst","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,"abyss",null,      "catalyst","weak","earthly");
     addAspectRelationship(currentAspect.typeStr,"machine",null,    "strong","weak","earthly");
     addAspectRelationship(currentAspect.typeStr,"void",null,       "mutate","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,"sands",null,      "neutral","mutate","earthly");
     addAspectRelationship(currentAspect.typeStr,"rot",null,        "harmony","weak","earthly");
     addAspectRelationship(currentAspect.typeStr,"curse",null,      "harmony","burst","earthly");
     addAspectRelationship(currentAspect.typeStr,"heavens",null,    "burst","devour","earthly");
     addAspectRelationship(currentAspect.typeStr,"storms",null,     "mutate","devour","earthly");
     addAspectRelationship(currentAspect.typeStr,"lifespring",null, "parasitic","weak","earthly");
     
     addAspectRelationship(currentAspect.typeStr,null,"beetle",     "strong","strong","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"crawler",    "neutral","devour","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"stinger",    "strong","burst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"nightmare",  "weak","strong","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"canine",     "neutral","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"feline",     "burst","mutate","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"critter",    "neutral","strong","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"antler",     "harmony","mutate","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"feather",     "strong","neutral","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"fruit",      "parasitic","strong","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"mycon",      "harmony","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"worldtree",  "weak","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"worm",       "mutate","harmony","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"crab",       "parasitic","burst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"kraken",     "strong","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"leviathan",  "harmony","harmony","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"hydra",      "catalyst","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"dinosaur",   "burst","weak","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"behemoth",   "devour","burst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"dragon",     "catalyst","weak","earthly");

         currentAspect.realmAspectRecord["ascended"] = "sands";
        currentAspect.realmAspectRecord["fallen"] = "curse";    

     addAttackInteract(currentAspect,"strong","hell"); 

     // aspect 6: BLOOD ----------------------------------------------
     currentAspect = aspectsRecord["blood"];
     currentAspect.color = "rgb(216,16,16)";
 
     currentAspect.desc = "the  power of blood, ";

     addEffects(currentAspect,null,"neutral","bloodlet",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"strong","anemia",-4, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"weak","wound",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"burst","heart",-5, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"harmony","transfusion",-10, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"devour","clot",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"parasitic","vampire",0, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"catalyst","vitalize",6, [ ["basepower",[10]],["strongest",[1]] ]);
     addEffects(currentAspect,null,"mutate","blood",25, [ ["basepower",[10]],["strongest",[1]] ]);
     
     addEffects(currentAspect,null,"unique","second",99, [ ["basepower",[10]],["strongest",[1]] ]);

     
     addAspectRelationship(currentAspect.typeStr,"blood",null,      "burst","burst","earthly");
     addAspectRelationship(currentAspect.typeStr,"hell",null,       "neutral","burst","earthly");
     addAspectRelationship(currentAspect.typeStr,"forest",null,     "burst","burst","earthly");
     addAspectRelationship(currentAspect.typeStr,"solar",null,      "mutate","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,"stars",null,      "harmony","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,"abyss",null,      "mutate","burst","earthly");
     addAspectRelationship(currentAspect.typeStr,"machine",null,    "weak","devour","earthly");
     addAspectRelationship(currentAspect.typeStr,"void",null,       "burst","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,"sands",null,      "neutral","harmony","earthly");
     addAspectRelationship(currentAspect.typeStr,"rot",null,        "strong","catalyst","earthly");
     addAspectRelationship(currentAspect.typeStr,"curse",null,      "mutate","strong","earthly");
     addAspectRelationship(currentAspect.typeStr,"heavens",null,    "weak","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,"storms",null,     "mutate","devour","earthly");
     addAspectRelationship(currentAspect.typeStr,"lifespring",null, "weak","harmony","earthly");
     
     addAspectRelationship(currentAspect.typeStr,null,"beetle",     "devour","harmony","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"crawler",    "devour","mutate","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"stinger",    "harmony","strong","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"nightmare",  "parasitic","weak","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"canine",     "parasitic","catalyst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"feline",     "weak","mutate","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"critter",    "strong","devour","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"antler",     "weak","strong","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"feather",     "burst","strong","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"fruit",      "burst","mutate","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"mycon",      "devour","devour","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"worldtree",  "harmony","weak","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"worm",       "parasitic","devour","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"crab",       "mutate","catalyst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"kraken",     "burst","catalyst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"leviathan",  "weak","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"hydra",      "parasitic","strong","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"dinosaur",   "devour","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"behemoth",   "mutate","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"dragon",     "weak","neutral","earthly");

         currentAspect.realmAspectRecord["ascended"] = "beast";
        currentAspect.realmAspectRecord["fallen"] = "fire";    

     addAttackInteract(currentAspect,"strong","heavens"); 

      // aspect 7: HELL ----------------------------------------------
      currentAspect = aspectsRecord["hell"];
      currentAspect.color = "rgb(201,44,111)";

      currentAspect.desc = "the forsaken power of hell, ";

      addEffects(currentAspect,null,"neutral","gaol",-5, [ ["basepower",[10]],["strongest",[1]] ]);
      addEffects(currentAspect,null,"strong","hellfire",1, [ ["basepower",[10]],["magical",[1]] ]);
      addEffects(currentAspect,null,"weak","punish",-2, [ ["basepower",[10]],["strongest",[1]] ]);
      addEffects(currentAspect,null,"burst","sin",-1, [ ["basepower",[10]],["strongest",[1]] ]);
      addEffects(currentAspect,null,"harmony","forbid",0, [ ["basepower",[10]],["strongest",[1]] ]);
      addEffects(currentAspect,null,"devour","fall of",99, [ ["basepower",[10]],["strongest",[1]] ]);
      addEffects(currentAspect,null,"parasitic","chaos",2, [ ["basepower",[10]],["strongest",[1]] ]);
      addEffects(currentAspect,null,"catalyst","damnation",1, [ ["basepower",[10]],["strongest",[1]] ]);
      addEffects(currentAspect,null,"mutate","devil",11, [ ["basepower",[10]],["strongest",[1]] ]);
      addEffects(currentAspect,null,"unique","demon king's",99, [ ["basepower",[10]],["strongest",[1]] ]);

      
     addAspectRelationship(currentAspect.typeStr,"hell",null,       "burst","burst","earthly");

     addAspectRelationship(currentAspect.typeStr,"forest",null,     "parasitic","mutate","earthly");
     addAspectRelationship(currentAspect.typeStr,"solar",null,      "neutral","mutate","earthly");
     addAspectRelationship(currentAspect.typeStr,"stars",null,      "parasitic","burst","earthly");
     addAspectRelationship(currentAspect.typeStr,"abyss",null,      "neutral","harmony","earthly");
     addAspectRelationship(currentAspect.typeStr,"machine",null,    "strong","strong","earthly");
     addAspectRelationship(currentAspect.typeStr,"void",null,       "burst","strong","earthly");
     addAspectRelationship(currentAspect.typeStr,"sands",null,      "neutral","devour","earthly");
     addAspectRelationship(currentAspect.typeStr,"rot",null,        "weak","harmony","earthly");
     addAspectRelationship(currentAspect.typeStr,"curse",null,      "catalyst","harmony","earthly");
     addAspectRelationship(currentAspect.typeStr,"heavens",null,    "mutate","weak","earthly");
     addAspectRelationship(currentAspect.typeStr,"storms",null,     "parasitic","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,"lifespring",null, "harmony","mutate","earthly");
     
     addAspectRelationship(currentAspect.typeStr,null,"beetle",     "mutate","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"crawler",    "neutral","mutate","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"stinger",    "burst","strong","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"nightmare",  "harmony","harmony","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"canine",     "catalyst","harmony","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"feline",     "parasitic","weak","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"critter",    "burst","devour","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"antler",     "devour","burst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"feather",     "weak","harmony","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"fruit",      "burst","burst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"mycon",      "mutate","strong","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"worldtree",  "strong","catalyst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"worm",       "neutral","harmony","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"crab",       "mutate","harmony","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"kraken",     "weak","burst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"leviathan",  "strong","burst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"hydra",      "neutral","harmony","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"dinosaur",   "burst","strong","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"behemoth",   "strong","devour","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"dragon",     "parasitic","mutate","earthly");

        currentAspect.realmAspectRecord["ascended"] = "fire";
        currentAspect.realmAspectRecord["fallen"] = "machine";  

      addAttackInteract(currentAspect,"nothing","heavens"); 

      // aspect 8: FOREST ----------------------------------------------
      currentAspect = aspectsRecord["forest"];
      currentAspect.color = "rgb(116,164,68)"; 
      
     currentAspect.desc = "the ever-growing power of forests, ";

        addEffects(currentAspect,null,"neutral","woods",2, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"strong","bramble",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"weak","treefall",-1, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"burst","autumn",7, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"harmony","leafwind",3, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"devour","overgrow",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"parasitic","lost",10, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"catalyst","nightfall",-2, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"mutate","eyes of",99, [ ["basepower",[10]],["strongest",[1]] ]);

        addEffects(currentAspect,null,"unique","endless",99, [ ["basepower",[10]],["strongest",[1]] ]); 

        
     addAspectRelationship(currentAspect.typeStr,"forest",null,     "neutral","neutral","earthly");

     addAspectRelationship(currentAspect.typeStr,"solar",null,      "parasitic","strong","earthly");
     addAspectRelationship(currentAspect.typeStr,"stars",null,      "catalyst","harmony","earthly");
     addAspectRelationship(currentAspect.typeStr,"abyss",null,      "weak","mutate","earthly");
     addAspectRelationship(currentAspect.typeStr,"machine",null,    "strong","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,"void",null,       "neutral","mutate","earthly");
     addAspectRelationship(currentAspect.typeStr,"sands",null,      "catalyst","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,"rot",null,        "harmony","strong","earthly");
     addAspectRelationship(currentAspect.typeStr,"curse",null,      "burst","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,"heavens",null,    "mutate","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,"storms",null,     "burst","harmony","earthly");
     addAspectRelationship(currentAspect.typeStr,"lifespring",null, "harmony","parasitic","earthly");
     
     addAspectRelationship(currentAspect.typeStr,null,"beetle",     "strong","weak","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"crawler",    "catalyst","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"stinger",    "devour","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"nightmare",  "parasitic","neutral","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"canine",     "catalyst","harmony","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"feline",     "devour","devour","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"critter",    "parasitic","burst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"antler",     "burst","harmony","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"feather",    "harmony","strong","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"fruit",      "devour","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"mycon",      "neutral","catalyst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"worldtree",  "weak","burst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"worm",       "neutral","burst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"crab",       "mutate","harmony","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"kraken",     "strong","neutral","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"leviathan",  "harmony","harmony","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"hydra",      "strong","harmony","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"dinosaur",   "neutral","catalyst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"behemoth",   "weak","catalyst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"dragon",     "burst","weak","earthly");

            currentAspect.realmAspectRecord["ascended"] = "solar";
            currentAspect.realmAspectRecord["fallen"] = "rot";   

      addAttackInteract(currentAspect,"strong","bone"); 

      // aspect 9: SOLAR ----------------------------------------------
      currentAspect = aspectsRecord["solar"];
      currentAspect.color = "rgb(251,203,40)";

      
     currentAspect.desc = "the incandescent power of the sun, hopeful but cyclical";

        addEffects(currentAspect,null,"neutral","sunbeam",1, [ ["basepower",[10]],["magical",[3]] ]);
        //
        addEffects(currentAspect,null,"strong","sol",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"weak","lunar",10, [ ["basepower",[10]],["strongest",[1]],["setOthersRealmAspect",[4]] ]);
        addEffects(currentAspect,null,"burst","supernova",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"harmony","morning",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"devour","drying",-1, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"parasitic","eclipse",1, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"catalyst","refracting",9, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"mutate","dusk",1, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"unique","brightest",99, [ ["basepower",[10]],["strongest",[1]] ]);

        
     addAspectRelationship(currentAspect.typeStr,"solar",null,      "harmony","harmony","earthly");
     addAspectRelationship(currentAspect.typeStr,"stars",null,      "parasitic","strong","earthly");
     addAspectRelationship(currentAspect.typeStr,"abyss",null,      "weak","harmony","earthly");
     addAspectRelationship(currentAspect.typeStr,"machine",null,    "catalyst","burst","earthly");
     addAspectRelationship(currentAspect.typeStr,"void",null,       "strong","devour","earthly");
     addAspectRelationship(currentAspect.typeStr,"sands",null,      "devour","neutral","earthly");
     addAspectRelationship(currentAspect.typeStr,"rot",null,        "devour","harmony","earthly");
     addAspectRelationship(currentAspect.typeStr,"curse",null,      "weak","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,"heavens",null,    "harmony","harmony","earthly");
     addAspectRelationship(currentAspect.typeStr,"storms",null,     "strong","catalyst","earthly");
     addAspectRelationship(currentAspect.typeStr,"lifespring",null, "neutral","harmony","earthly");
     
     addAspectRelationship(currentAspect.typeStr,null,"beetle",     "strong","harmony","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"crawler",    "mutate","harmony","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"stinger",    "catalyst","weak","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"nightmare",  "harmony","harmony","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"canine",     "weak","harmony","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"feline",     "neutral","neutral","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"critter",    "strong","burst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"antler",     "mutate","weak","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"feather",    "parasitic","burst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"fruit",      "strong","catalyst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"mycon",      "devour","catalyst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"worldtree",  "neutral","burst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"worm",       "neutral","catalyst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"crab",       "parasitic","devour","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"kraken",     "neutral","mutate","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"leviathan",  "burst","neutral","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"hydra",      "devour","mutate","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"dinosaur",   "parasitic","catalyst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"behemoth",   "burst","strong","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"dragon",     "burst","devour","earthly");
        
            currentAspect.realmAspectRecord["ascended"] = "heavens";
            currentAspect.realmAspectRecord["fallen"] = "forest"; 


      addAttackInteract(currentAspect,"strong","curse"); 

      // aspect 10: STARS ----------------------------------------------
      currentAspect = aspectsRecord["stars"];
      currentAspect.color = "rgb(111,150,255)";

      
     currentAspect.desc = "the faraway power of the stars, subtle but ever-watching";

        addEffects(currentAspect,null,"neutral","starfall",-1, [ ["basepower",[10]],["strongest",[1]] ]);
        //
        addEffects(currentAspect,null,"strong","galaxy",1, [ ["basepower",[10]],["strongest",[1]] ]);
        //
        addEffects(currentAspect,null,"weak","twinkle",1, [ ["basepower",[10]],["strongest",[1]] ]);
        //
        addEffects(currentAspect,null,"burst","comet",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"harmony","constellation",-3, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"devour","disaster",1, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"parasitic","alien",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"catalyst","infinity",2, [ ["basepower",[10]],["strongest",[1]] ]);
        //
        addEffects(currentAspect,null,"mutate","cosmos",2, [ ["basepower",[10]],["strongest",[1]] ]);
        //
        addEffects(currentAspect,null,"unique","from beyond",-99, [ ["basepower",[10]],["strongest",[1]] ]);

        
     addAspectRelationship(currentAspect.typeStr,"stars",null,      "weak","weak","earthly");
     addAspectRelationship(currentAspect.typeStr,"abyss",null,      "strong","neutral","earthly");
     addAspectRelationship(currentAspect.typeStr,"machine",null,    "devour","devour","earthly");
     addAspectRelationship(currentAspect.typeStr,"void",null,       "neutral","devour","earthly");
     addAspectRelationship(currentAspect.typeStr,"sands",null,      "neutral","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,"rot",null,        "mutate","neutral","earthly");
     addAspectRelationship(currentAspect.typeStr,"curse",null,      "strong","burst","earthly");
     addAspectRelationship(currentAspect.typeStr,"heavens",null,    "mutate","neutral","earthly");
     addAspectRelationship(currentAspect.typeStr,"storms",null,     "burst","weak","earthly");
     addAspectRelationship(currentAspect.typeStr,"lifespring",null, "neutral","neutral","earthly");
     
     addAspectRelationship(currentAspect.typeStr,null,"beetle",     "burst","burst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"crawler",    "harmony","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"stinger",    "parasitic","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"nightmare",  "mutate","devour","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"canine",     "catalyst","neutral","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"feline",     "weak","catalyst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"critter",    "devour","weak","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"antler",     "strong","catalyst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"feather",    "neutral","burst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"fruit",      "burst","neutral","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"mycon",      "parasitic","burst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"worldtree",  "harmony","harmony","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"worm",       "burst","weak","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"crab",       "harmony","mutate","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"kraken",     "mutate","neutral","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"leviathan",  "strong","weak","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"hydra",      "catalyst","weak","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"dinosaur",   "burst","weak","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"behemoth",   "neutral","mutate","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"dragon",     "devour","catalyst","earthly");
 
            currentAspect.realmAspectRecord["ascended"] = "solar";
            currentAspect.realmAspectRecord["fallen"] = "void";  

      addAttackInteract(currentAspect,"strong","fae"); 

      // aspect 11: ABYSS ----------------------------------------------
       currentAspect = aspectsRecord["abyss"];
       currentAspect.color = "rgb(65,121,139)";
 
        currentAspect.desc = "the sunken power of the abyss, quiet terror";

        addEffects(currentAspect,null,"neutral","ocean",1, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"strong","drown",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"weak","salt",2, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"burst","maelstrom",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"harmony","trench",-1, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"devour","volcano",0, [ ["basepower",[10]],["strongest",[1]], ["setAspect", [aspectsRecord["fire"].index, 2]] ]);
        addEffects(currentAspect,null,"parasitic","pressure",1, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"catalyst","lightless",20, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"mutate","gigantis",3, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"unique","deepest",99, [ ["basepower",[10]],["strongest",[1]] ]);
        
     addAspectRelationship(currentAspect.typeStr,"abyss",null,      "harmony","harmony","earthly");
     addAspectRelationship(currentAspect.typeStr,"machine",null,    "parasitic","neutral","earthly");
     addAspectRelationship(currentAspect.typeStr,"void",null,       "catalyst","burst","earthly");
     addAspectRelationship(currentAspect.typeStr,"sands",null,      "weak","neutral","earthly");
     addAspectRelationship(currentAspect.typeStr,"rot",null,        "weak","catalyst","earthly");
     addAspectRelationship(currentAspect.typeStr,"curse",null,      "harmony","catalyst","earthly");
     addAspectRelationship(currentAspect.typeStr,"heavens",null,    "weak","mutate","earthly");
     addAspectRelationship(currentAspect.typeStr,"storms",null,     "burst","neutral","earthly");
     addAspectRelationship(currentAspect.typeStr,"lifespring",null, "neutral","burst","earthly");
     
     addAspectRelationship(currentAspect.typeStr,null,"beetle",     "strong","burst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"crawler",    "parasitic","strong","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"stinger",    "neutral","devour","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"nightmare",  "strong","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"canine",     "parasitic","strong","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"feline",     "mutate","burst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"critter",    "strong","parasitic","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"antler",     "catalyst","harmony","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"feather",    "mutate","weak","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"fruit",      "harmony","devour","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"mycon",      "devour","catalyst","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"worldtree",  "neutral","strong","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"worm",       "harmony","weak","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"crab",       "parasitic","strong","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"kraken",     "strong","strong","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"leviathan",  "neutral","devour","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"hydra",      "mutate","devour","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"dinosaur",   "devour","harmony","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"behemoth",   "burst","harmony","earthly");
     addAspectRelationship(currentAspect.typeStr,null,"dragon",     "devour","catalyst","earthly");

        currentAspect.realmAspectRecord["ascended"] = "void";
        currentAspect.realmAspectRecord["fallen"] = "storms";   

       addAttackInteract(currentAspect,"strong","fire"); 

      // aspect 12: MACHINE ----------------------------------------------
      currentAspect = aspectsRecord["machine"];
      currentAspect.color = "rgb(147,123,138)"; 

      currentAspect.desc = "the efficient power of machines, designed and specialized";

        addEffects(currentAspect,null,"neutral","engine",-4, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"strong","cannon",-2, [ ["basepower",[30]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"weak","scrap",0, [ ["basepower",[10]],["strongest",[1]] ]);

        addEffects(currentAspect,null,"burst","laser",-1, [ ["basepower",[20]],["magical",[3]],["setAspect", [aspectsRecord["fire"].index, 1]],["setOthersAspect", [1]],["setOthersRealmAspect", [1]] ]);
        //
        addEffects(currentAspect,null,"harmony","wheel",-2, [ ["basepower",[10]],["strongest",[1]] ]);
        //
        addEffects(currentAspect,null,"devour","explosion",0, [ ["basepower",[30]],["strongest",[1]], ["targetType",[targetsList.indexOf("aoe")]] ]);
        //
        addEffects(currentAspect,null,"parasitic","drill",-1, [ ["basepower",[10]],["physical",[1]] ]);
        //
        addEffects(currentAspect,null,"catalyst","homing",20, [ ["basepower",[6]],["strongest",[1]] ]);
        //never misses
        addEffects(currentAspect,null,"mutate","cyber-",99, [ ["basepower",[10]],["strongest",[1]] ]);
        //
        addEffects(currentAspect,null,"unique","buster",99, [ ["basepower",[30]],["strongest",[1]] ]);
 
        addAspectRelationship(currentAspect.typeStr,"machine",null,    "strong","strong","earthly");
        addAspectRelationship(currentAspect.typeStr,"void",null,       "strong","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,"sands",null,      "weak","strong","earthly");
        addAspectRelationship(currentAspect.typeStr,"rot",null,        "weak","mutate","earthly");
        addAspectRelationship(currentAspect.typeStr,"curse",null,      "strong","harmony","earthly");
        addAspectRelationship(currentAspect.typeStr,"heavens",null,    "neutral","catalyst","earthly");
        addAspectRelationship(currentAspect.typeStr,"storms",null,     "parasitic","catalyst","earthly");
        addAspectRelationship(currentAspect.typeStr,"lifespring",null, "neutral","mutate","earthly");
        
        addAspectRelationship(currentAspect.typeStr,null,"beetle",     "mutate","strong","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"crawler",    "parasitic","neutral","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"stinger",    "harmony","harmony","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"nightmare",  "neutral","neutral","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"canine",     "neutral","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"feline",     "catalyst","neutral","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"critter",    "mutate","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"antler",     "devour","burst","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"feather",    "harmony","catalyst","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"fruit",      "devour","mutate","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"mycon",      "mutate","harmony","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"worldtree",  "neutral","parasitic","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"worm",       "parasitic","burst","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"crab",       "weak","strong","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"kraken",     "devour","harmony","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"leviathan",  "strong","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"hydra",      "harmony","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"dinosaur",   "mutate","devour","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"behemoth",   "parasitic","burst","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"dragon",     "burst","harmony","earthly");

        currentAspect.realmAspectRecord["ascended"] = "bugs";
        currentAspect.realmAspectRecord["fallen"] = "steel";  

      addAttackInteract(currentAspect,"strong","fae"); 

      // aspect 13: VOID ----------------------------------------------
      currentAspect = aspectsRecord["void"];
      currentAspect.color = "rgb(78,78,172)";
 
      currentAspect.desc = "the empty power of the void, infinite yet nothing";

        addEffects(currentAspect,null,"neutral","vacuum",1, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"strong","implosion",-3, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"weak","removal",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"burst","nothingness",1, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"harmony","clear",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"devour","gravity",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"parasitic","frozen",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"catalyst","desire",-2, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"mutate","empty",15, [ ["basepower",[10]],["strongest",[1]] ]);
        
        addEffects(currentAspect,null,"unique","endless",99, [ ["basepower",[10]],["strongest",[1]] ]);
        //protect action: blackhole
        
        addAspectRelationship(currentAspect.typeStr,"void",null,       "burst","burst","earthly");
        addAspectRelationship(currentAspect.typeStr,"sands",null,      "parasitic","neutral","earthly");
        addAspectRelationship(currentAspect.typeStr,"rot",null,        "strong","neutral","earthly");
        addAspectRelationship(currentAspect.typeStr,"curse",null,      "burst","devour","earthly");
        addAspectRelationship(currentAspect.typeStr,"heavens",null,    "burst","neutral","earthly");
        addAspectRelationship(currentAspect.typeStr,"storms",null,     "neutral","devour","earthly");
        addAspectRelationship(currentAspect.typeStr,"lifespring",null, "catalyst","weak","earthly");
        
        addAspectRelationship(currentAspect.typeStr,null,"beetle",     "devour","catalyst","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"crawler",    "weak","catalyst","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"stinger",    "neutral","strong","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"nightmare",  "burst","neutral","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"canine",     "devour","burst","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"feline",     "catalyst","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"critter",    "weak","devour","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"antler",     "parasitic","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"feather",    "devour","devour","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"fruit",      "catalyst","burst","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"mycon",      "harmony","neutral","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"worldtree",  "neutral","mutate","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"worm",       "strong","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"crab",       "devour","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"kraken",     "strong","devour","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"leviathan",  "neutral","neutral","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"hydra",      "catalyst","parasitic","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"dinosaur",   "devour","parasitic","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"behemoth",   "weak","mutate","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"dragon",     "mutate","weak","earthly");

            currentAspect.realmAspectRecord["ascended"] = "stars";
            currentAspect.realmAspectRecord["fallen"] = "fae";   

      addAttackInteract(currentAspect,"strong","solar");

      // aspect 14: SANDS ----------------------------------------------
      currentAspect = aspectsRecord["sands"];
      currentAspect.color = "rgb(186,158,120)";
      
      currentAspect.desc = "the eroding power of the sands, diminutive yet overwhelming";

        addEffects(currentAspect,null,"neutral","dune",-1, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"strong","sandblast",-2, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"weak","desert",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"burst","sirocco",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"harmony","burial",-1, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"devour","quicksand",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"parasitic","hourglass",-3, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"catalyst","glass",20, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"mutate","polish",-7, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(currentAspect,null,"unique","tallest",0, [ ["basepower",[10]],["strongest",[1]] ]);

        
        addAspectRelationship(currentAspect.typeStr,"sands",null,      "neutral","neutral","earthly");
        addAspectRelationship(currentAspect.typeStr,"rot",null,        "harmony","devour","earthly");
        addAspectRelationship(currentAspect.typeStr,"curse",null,      "devour","devour","earthly");
        addAspectRelationship(currentAspect.typeStr,"heavens",null,    "weak","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,"storms",null,     "burst","burst","earthly");
        addAspectRelationship(currentAspect.typeStr,"lifespring",null, "weak","catalyst","earthly");
        
        addAspectRelationship(currentAspect.typeStr,null,"beetle",     "strong","mutate","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"crawler",    "devour","parasitic","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"stinger",    "burst","devour","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"nightmare",  "devour","mutate","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"canine",     "weak","mutate","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"feline",     "mutate","devour","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"critter",    "harmony","neutral","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"antler",     "neutral","catalyst","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"feather",    "burst","strong","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"fruit",      "harmony","neutral","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"mycon",      "neutral","catalyst","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"worldtree",  "neutral","devour","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"worm",       "neutral","burst","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"crab",       "mutate","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"kraken",     "strong","mutate","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"leviathan",  "burst","burst","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"hydra",      "catalyst","neutral","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"dinosaur",   "devour","parasitic","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"behemoth",   "burst","strong","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"dragon",     "strong","harmony","earthly");
        
            currentAspect.realmAspectRecord["ascended"] = "forest";
            currentAspect.realmAspectRecord["fallen"] = "abyss";  

      addAttackInteract(currentAspect,"strong","fire");

      // aspect 15: ROT ----------------------------------------------
      currentAspect = aspectsRecord["rot"];
      currentAspect.color = "rgb(73,156,98)";
 
      currentAspect.desc = "the inevitable power of rot, both beginning and end";

        addEffects(currentAspect,null,"neutral","decay",0, [ ["basepower",[10]],["strongest",[1]] ]);
        //
        addEffects(currentAspect,null,"strong","miasma",0, [ ["basepower",[10]],["strongest",[1]] ]);
        //
        addEffects(currentAspect,null,"weak","blight",0, [ ["basepower",[10]],["strongest",[1]] ]);
        //
        addEffects(currentAspect,null,"burst","mold",-9, [ ["basepower",[10]],["strongest",[1]] ]);
        //
        addEffects(currentAspect,null,"harmony","shrivel",-2, [ ["basepower",[10]],["strongest",[1]] ]);
        //
        addEffects(currentAspect,null,"devour","waste",0, [ ["basepower",[10]],["strongest",[1]] ]);
        //
        addEffects(currentAspect,null,"parasitic","bud",-5, [ ["basepower",[10]],["strongest",[1]] ]);
        //
        addEffects(currentAspect,null,"catalyst","ferment",0, [ ["basepower",[10]],["strongest",[1]] ]);
        //
        addEffects(currentAspect,null,"mutate","rust",5, [ ["basepower",[10]],["strongest",[1]] , ["setAspect", [aspectsRecord["sands"].index, 999]] ]);
        //
        addEffects(currentAspect,null,"unique","life from",99, [ ["basepower",[10]],["strongest",[1]] ,  ["setAspect", [aspectsRecord["lifespring"].index, 999]] ]);
        // sacrifice to heal?

        
        addAspectRelationship(currentAspect.typeStr,"rot",null,        "neutral","neutral","earthly");
        addAspectRelationship(currentAspect.typeStr,"curse",null,      "strong","parasitic","earthly");
        addAspectRelationship(currentAspect.typeStr,"heavens",null,    "weak","strong","earthly");
        addAspectRelationship(currentAspect.typeStr,"storms",null,     "burst","devour","earthly");
        addAspectRelationship(currentAspect.typeStr,"lifespring",null, "weak","parasitic","earthly");
        
        addAspectRelationship(currentAspect.typeStr,null,"beetle",     "parasitic","devour","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"crawler",    "burst","burst","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"stinger",    "neutral","burst","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"nightmare",  "strong","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"canine",     "strong","mutate","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"feline",     "weak","harmony","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"critter",    "neutral","devour","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"antler",     "catalyst","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"feather",    "strong","mutate","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"fruit",      "burst","parasitic","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"mycon",      "burst","devour","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"worldtree",  "parasitic","burst","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"worm",       "devour","harmony","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"crab",       "weak","catalyst","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"kraken",     "weak","devour","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"leviathan",  "mutate","strong","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"hydra",      "strong","burst","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"dinosaur",   "strong","neutral","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"behemoth",   "devour","mutate","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"dragon",     "neutral","strong","earthly");
        
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
            //
            addEffects(currentAspect,null,"strong","bane",0, [ ["basepower",[10]],["strongest",[1]] ]);
            //
            addEffects(currentAspect,null,"weak","hollow",0, [ ["basepower",[10]],["strongest",[1]] ]);
            //
            addEffects(currentAspect,null,"burst","evil-eye",2, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"harmony","hex",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"devour","strife",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"parasitic","gloom",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"catalyst","edge",-6, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"mutate","wretch",-8, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"unique","comforting",99, [ ["basepower",[10]],["strongest",[1]] ]);

            
        addAspectRelationship(currentAspect.typeStr,"curse",null,      "parasitic","parasitic","earthly");
        addAspectRelationship(currentAspect.typeStr,"heavens",null,    "mutate","burst","earthly");
        addAspectRelationship(currentAspect.typeStr,"storms",null,     "parasitic","parasitic","earthly");
        addAspectRelationship(currentAspect.typeStr,"lifespring",null, "weak","strong","earthly");
        
        addAspectRelationship(currentAspect.typeStr,null,"beetle",     "burst","neutral","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"crawler",    "neutral","parasitic","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"stinger",    "weak","harmony","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"nightmare",  "mutate","devour","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"canine",     "devour","neutral","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"feline",     "neutral","strong","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"critter",    "harmony","parasitic","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"antler",     "devour","devour","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"feather",    "catalyst","neutral","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"fruit",      "neutral","neutral","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"mycon",      "parasitic","harmony","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"worldtree",  "weak","strong","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"worm",       "burst","catalyst","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"crab",       "harmony","mutate","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"kraken",     "strong","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"leviathan",  "harmony","catalyst","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"hydra",      "strong","strong","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"dinosaur",   "mutate","burst","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"behemoth",   "devour","parasitic","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"dragon",     "weak","mutate","earthly");

            currentAspect.realmAspectRecord["ascended"] = "abyss";
            currentAspect.realmAspectRecord["fallen"] = "bone";   

        addAttackInteract(currentAspect,"strong","steel");

        // aspect 17: HEAVENS ----------------------------------------------
        currentAspect = aspectsRecord["heavens"];
        currentAspect.color = "rgb(254,251,146)";

        currentAspect.desc = "the immaculate power of the heavens, praising yet intolerant";

            addEffects(currentAspect,null,"neutral","banish",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"strong","purify",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"weak","repent",-5, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"burst","smite",-8, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"harmony","blessing",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"devour","anathema",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"parasitic","sacrament",2, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"catalyst","halo",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"mutate","exorcism",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"unique","all evil",-99, [ ["basepower",[10]],["strongest",[1]] ]);

            
        addAspectRelationship(currentAspect.typeStr,"heavens",null,    "burst","burst","earthly");

        addAspectRelationship(currentAspect.typeStr,"storms",null,     "burst","neutral","earthly");
        addAspectRelationship(currentAspect.typeStr,"lifespring",null, "strong","neutral","earthly");
        
        addAspectRelationship(currentAspect.typeStr,null,"beetle",     "harmony","neutral","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"crawler",    "mutate","neutral","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"stinger",    "strong","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"nightmare",  "parasitic","neutral","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"canine",     "harmony","mutate","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"feline",     "harmony","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"critter",    "strong","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"antler",     "catalyst","burst","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"feather",    "strong","mutate","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"fruit",      "harmony","harmony","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"mycon",      "catalyst","neutral","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"worldtree",  "mutate","neutral","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"worm",       "neutral","strong","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"crab",       "weak","mutate","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"kraken",     "burst","parasitic","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"leviathan",  "mutate","harmony","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"hydra",      "devour","mutate","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"dinosaur",   "burst","neutral","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"behemoth",   "parasitic","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"dragon",     "weak","burst","earthly");

            currentAspect.realmAspectRecord["ascended"] = "solar";
            currentAspect.realmAspectRecord["fallen"] = "machine";   

        addAttackInteract(currentAspect,"strong","hell");

        // aspect 18: STORMS ----------------------------------------------
        currentAspect = aspectsRecord["storms"];
        currentAspect.color = "rgb(63,86,88)";
        
        currentAspect.desc = "the unstoppable power of storms, aimless and momentary";

            addEffects(currentAspect,null,"neutral","lightning",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"strong","monsoon",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"weak","squall",-1, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"burst","typhoon",-4, [ ["basepower",[10]],["strongest",[1]], ["setOthersAspect",[5]]]); 
            addEffects(currentAspect,null,"harmony","tailwind",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"devour","flood",-10, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"parasitic","stormcloud",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"catalyst","thunder",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"mutate","drench",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"unique","echoing",99, [ ["basepower",[10]],["strongest",[1]] ]);

            
        addAspectRelationship(currentAspect.typeStr,"storms",null,     "strong","strong","earthly");
        addAspectRelationship(currentAspect.typeStr,"lifespring",null, "devour","devour","earthly");
        
        addAspectRelationship(currentAspect.typeStr,null,"beetle",     "neutral","catalyst","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"crawler",    "burst","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"stinger",    "neutral","catalyst","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"nightmare",  "weak","mutate","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"canine",     "devour","mutate","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"feline",     "neutral","neutral","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"critter",    "harmony","neutral","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"antler",     "strong","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"feather",    "strong","weak","earthly");
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

            currentAspect.realmAspectRecord["ascended"] = "storms";
            currentAspect.realmAspectRecord["fallen"] = "abyss";    

        addAttackInteract(currentAspect,"strong","fire");

        // aspect 19: LIFESPRING ----------------------------------------------
        currentAspect = aspectsRecord["lifespring"];
        currentAspect.color = "rgb(100,255,208)";
        
        currentAspect.desc = "the quenching power of the lifespring, trickling down with life";

            addEffects(currentAspect,null,"neutral","stream",-3, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"strong","vigor",-4, [ ["basepower",[10]],["physical",[2]],["setOthersRealmAspect",[1]]]);
            addEffects(currentAspect,null,"weak","dewdrop",1, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"burst","splash",-1, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"harmony","fountain",-1, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"devour","revitalize",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"parasitic","mist",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"catalyst","drink",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"mutate","crying",10, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(currentAspect,null,"unique","revival",99, [ ["basepower",[10]],["strongest",[1]] ]);

            
        addAspectRelationship(currentAspect.typeStr,"lifespring",null, "strong","weak","earthly");
        
        addAspectRelationship(currentAspect.typeStr,null,"beetle",     "strong","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"crawler",    "strong","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"stinger",    "strong","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"nightmare",  "strong","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"canine",     "strong","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"feline",     "strong","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"critter",    "strong","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"antler",     "strong","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"feather",     "strong","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"fruit",      "strong","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"mycon",      "strong","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"worldtree",  "strong","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"worm",       "strong","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"crab",       "strong","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"kraken",     "strong","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"leviathan",  "harmony","burst","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"hydra",      "strong","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"dinosaur",   "strong","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"behemoth",   "strong","weak","earthly");
        addAspectRelationship(currentAspect.typeStr,null,"dragon",     "mutate","burst","earthly");

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

        currentShape.desc = "Adaptable, high armor"

            addEffects(null,currentShape,"neutral","elytra",1, [ ["basepower",[10]],["strongest",[1]] ]);
            //
            addEffects(null,currentShape,"strong","mandible",0, [ ["basepower",[10]],["physical",[2]] ]);
            //
            addEffects(null,currentShape,"weak","bore",0, [ ["basepower",[10]],["physical",[2]] ]);
            //
            addEffects(null,currentShape,"burst","suplex",0, [ ["basepower",[10]],["physical",[3]] ]);
            //
            addEffects(null,currentShape,"harmony","-orb gather",-99, [ ["basepower",[10]],["strongest",[1]] ]);
            //
            addEffects(null,currentShape,"devour","shellhorn",0, [ ["basepower",[10]],["physical",[1]] ]);
            //
            addEffects(null,currentShape,"parasitic","pupa",0, [ ["basepower",[10]],["strongest",[1]] ]);
            // allows access to imago if possible
            // becomes another move in imago??
            addEffects(null,currentShape,"catalyst","snap",3, [ ["basepower",[10]],["physical",[1]] ]);
            //
            addEffects(null,currentShape,"mutate","bombspray",-2, [ ["basepower",[10]],["magical",[1]] ]);
            //

            addShapeRelationship(currentShape.typeStr,null,"crawler",    "strong","burst","earthly");
            addShapeRelationship(currentShape.typeStr,null,"stinger",    "neutral","harmony","earthly");
            addShapeRelationship(currentShape.typeStr,null,"nightmare",  "strong","strong","earthly");
            addShapeRelationship(currentShape.typeStr,null,"canine",     "devour","burst","earthly");
            addShapeRelationship(currentShape.typeStr,null,"feline",     "burst","neutral","earthly");
            addShapeRelationship(currentShape.typeStr,null,"critter",    "catalyst","strong","earthly");
            addShapeRelationship(currentShape.typeStr,null,"antler",     "burst","mutate","earthly");
            addShapeRelationship(currentShape.typeStr,null,"feather",    "weak","parasitic","earthly");
            addShapeRelationship(currentShape.typeStr,null,"fruit",      "harmony","harmony","earthly");
            addShapeRelationship(currentShape.typeStr,null,"mycon",      "parasitic","parasitic","earthly");
            addShapeRelationship(currentShape.typeStr,null,"worldtree",  "weak","strong","earthly");
            addShapeRelationship(currentShape.typeStr,null,"worm",       "devour","catalyst","earthly");
            addShapeRelationship(currentShape.typeStr,null,"crab",       "strong","neutral","earthly");
            addShapeRelationship(currentShape.typeStr,null,"kraken",     "mutate","harmony","earthly");
            addShapeRelationship(currentShape.typeStr,null,"leviathan",  "devour","strong","earthly");
            addShapeRelationship(currentShape.typeStr,null,"hydra",      "weak","neutral","earthly");
            addShapeRelationship(currentShape.typeStr,null,"dinosaur",   "harmony","parasitic","earthly");
            addShapeRelationship(currentShape.typeStr,null,"behemoth",   "strong","catalyst","earthly");
            addShapeRelationship(currentShape.typeStr,null,"dragon",     "mutate","strong","earthly");
 
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

        currentShape.desc = "masters of surprise attacks. many legs";
        
            addEffects(null,currentShape,"neutral","chelicerae",0, [ ["basepower",[10]],["physical",[1]] ]);
            addEffects(null,currentShape,"strong","legcrush",0, [ ["basepower",[10]],["physical",[2]] ]);
            addEffects(null,currentShape,"weak","skitter",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"burst","toxishock",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"harmony","instar",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"devour","liquefy",6, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"parasitic","creep",-3, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"catalyst","sudden",30, [ ["basepower",[10]],["strongest",[1]] ,["setOthersRealmAspect",[5]]]);
            addEffects(null,currentShape,"mutate","web",0, [ ["basepower",[10]],["strongest",[1]] ]);

            
            addShapeRelationship(currentShape.typeStr,null,"stinger",    "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"nightmare",  "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"canine",     "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"feline",     "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"critter",    "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"antler",     "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"feather",     "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"fruit",      "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"mycon",      "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"worldtree",  "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"worm",       "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"crab",       "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"kraken",     "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"leviathan",  "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"hydra",      "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"dinosaur",   "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"behemoth",   "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"dragon",     "strong","weak","earthly");

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
 
        currentShape.desc = "injects powerful status ailments";

            addEffects(null,currentShape,"neutral","sting",-3, [ ["basepower",[5]],["physical",[1]] ]);
            //basic attack with medium-weak power but small status effect
            addEffects(null,currentShape,"strong","inject",2, [ ["basepower",[2]],["physical",[3]] ]);
            //weak power, if damage done causes high effect status or secondary attack
            addEffects(null,currentShape,"weak","needle",-1, [ ["basepower",[10]],["physical",[1]] ]); 
            //
            addEffects(null,currentShape,"burst","darts",-15, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"harmony","buzz",-1, [ ["basepower",[10]],["magical",[1]] ]);
            addEffects(null,currentShape,"devour","jet",-5, [ ["basepower",[10]],["magical",[1]] ]);
            addEffects(null,currentShape,"parasitic","egg",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"catalyst","repeat",6, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"mutate","queen",0, [ ["basepower",[10]],["strongest",[1]] ]);

            
            addShapeRelationship(currentShape.typeStr,null,"nightmare",  "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"canine",     "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"feline",     "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"critter",    "strong","devour","earthly");
            addShapeRelationship(currentShape.typeStr,null,"antler",     "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"feather",     "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"fruit",      "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"mycon",      "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"worldtree",  "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"worm",       "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"crab",       "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"kraken",     "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"leviathan",  "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"hydra",      "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"dinosaur",   "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"behemoth",   "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"dragon",     "strong","weak","earthly");

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
        currentShape.desc = "elusive magical tricksters";

            addEffects(null,currentShape,"neutral","horror",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"strong","grip",-4, [ ["basepower",[10]],["physical",[1]] ]);
            addEffects(null,currentShape,"weak","stalking",1, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"burst","panic",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"harmony","dozing",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"devour","scream",-9, [ ["basepower",[10]],["magical",[1]] ]);
            addEffects(null,currentShape,"parasitic","jumpscare",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"catalyst","behind you",-99, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"mutate","coldsweat",0, [ ["basepower",[10]],["strongest",[1]] ]);

            
            addShapeRelationship(currentShape.typeStr,null,"canine",     "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"feline",     "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"critter",    "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"antler",     "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"feather",     "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"fruit",      "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"mycon",      "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"worldtree",  "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"worm",       "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"crab",       "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"kraken",     "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"leviathan",  "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"hydra",      "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"dinosaur",   "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"behemoth",   "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"dragon",     "strong","weak","earthly");

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
        currentShape.desc = "all-rounder that enjoys team tactics";

            addEffects(null,currentShape,"neutral","barking",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"strong","lockjaw",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"weak","growl",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"burst","takedown",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"harmony","howl",-4, [ ["basepower",[10]],["magical",[1]] ]);
            addEffects(null,currentShape,"devour","roughhouse",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"parasitic","scent",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"catalyst","pack",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"mutate","panting",0, [ ["basepower",[10]],["strongest",[1]] ]);

            
            addShapeRelationship(currentShape.typeStr,null,"feline",     "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"critter",    "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"antler",     "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"feather",     "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"fruit",      "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"mycon",      "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"worldtree",  "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"worm",       "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"crab",       "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"kraken",     "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"leviathan",  "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"hydra",      "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"dinosaur",   "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"behemoth",   "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"dragon",     "strong","weak","earthly");

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
        
        currentShape.desc = "agile stealthy hunter";

            addEffects(null,currentShape,"neutral","pounce",1, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"strong","ambush",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"weak","meow",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"burst","ripper",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"harmony","catscratch",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"devour","sabertooth",2, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"parasitic","purr",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"catalyst","paw bat",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"mutate","cleanup",0, [ ["basepower",[10]],["strongest",[1]] ]);

            
            addShapeRelationship(currentShape.typeStr,null,"critter",    "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"antler",     "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"feather",     "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"fruit",      "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"mycon",      "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"worldtree",  "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"worm",       "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"crab",       "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"kraken",     "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"leviathan",  "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"hydra",      "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"dinosaur",   "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"behemoth",   "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"dragon",     "strong","weak","earthly");

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
        
        currentShape.desc = "escape artists full of tricks";


            addEffects(null,currentShape,"neutral","swift",5, [ ["basepower",[10]],["physical",[1]] ]);
            addEffects(null,currentShape,"strong","dismantle",-1, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"weak","squeak",0, [ ["basepower",[10]],["magical",[1]] ]);
            addEffects(null,currentShape,"burst","brave",7, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"harmony","gnaw",-1, [ ["basepower",[10]],["physical",[1]] ]);
            addEffects(null,currentShape,"devour","plague",-5, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"parasitic","hide &",99, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"catalyst","sniff",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"mutate","infest",-3, [ ["basepower",[10]],["strongest",[1]] ]);

            
            addShapeRelationship(currentShape.typeStr,null,"antler",     "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"feather",     "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"fruit",      "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"mycon",      "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"worldtree",  "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"worm",       "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"crab",       "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"kraken",     "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"leviathan",  "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"hydra",      "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"dinosaur",   "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"behemoth",   "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"dragon",     "strong","weak","earthly");

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
        
        currentShape.desc = "stalwart defenders";


            addEffects(null,currentShape,"neutral","headbutt",0, [ ["basepower",[10]],["physical",[5]] ]);
            addEffects(null,currentShape,"strong","goring",1, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"weak","hibernate",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"burst","majesty",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"harmony","serenity",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"devour","compete",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"parasitic","prance",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"catalyst","guardian",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"mutate","antlered",10, [ ["basepower",[10]],["strongest",[1]] ]);

            
            addShapeRelationship(currentShape.typeStr,null,"feather",     "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"fruit",      "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"mycon",      "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"worldtree",  "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"worm",       "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"crab",       "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"kraken",     "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"leviathan",  "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"hydra",      "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"dinosaur",   "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"behemoth",   "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"dragon",     "strong","burst","earthly");

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

        // shape 8: FEATHER ----------------------------------------------
        currentShape = shapesRecord["feather"];
        
        currentShape.desc = "swift and graceful";


            addEffects(null,currentShape,"neutral","beak",-4, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"strong","wingbeat",-3, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"weak","quills",-7, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"burst","divebomb",-5, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"harmony","sky grab",20, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"devour","swoop",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"parasitic","& fly away",-99, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"catalyst","flying",7, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"mutate","flutter",0, [ ["basepower",[10]],["strongest",[1]] ]);

            
            addShapeRelationship(currentShape.typeStr,null,"fruit",      "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"mycon",      "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"worldtree",  "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"worm",       "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"crab",       "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"kraken",     "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"leviathan",  "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"hydra",      "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"dinosaur",   "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"behemoth",   "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"dragon",     "strong","weak","earthly");

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
        
        currentShape.desc = "full of magical juice to support allies";


            addEffects(null,currentShape,"neutral","seed",0, [ ["basepower",[10]],["physical",[1]] ]);
            addEffects(null,currentShape,"strong","peel",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"weak","sedative",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"burst","cornucopia",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"harmony","nectar",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"devour","acid",0, [ ["basepower",[10]],["magical",[1]] ]);
            addEffects(null,currentShape,"parasitic","sprout",-2, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"catalyst","vitamin",0, [ ["basepower",[10]],["strongest",[1]] ]);
            addEffects(null,currentShape,"mutate","berry",-8, [ ["basepower",[10]],["strongest",[1]] ]);

            
            addShapeRelationship(currentShape.typeStr,null,"mycon",      "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"worldtree",  "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"worm",       "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"crab",       "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"kraken",     "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"leviathan",  "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"hydra",      "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"dinosaur",   "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"behemoth",   "strong","weak","earthly");
            addShapeRelationship(currentShape.typeStr,null,"dragon",     "strong","weak","earthly");

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

        
        currentShape.desc = "mysterious mushroom with strange powers";

 
        addEffects(null,currentShape,"neutral","cap",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"strong","amanita",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"weak","stinkhorn",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"burst","spore",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"harmony","symbiosis",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"devour","infection",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"parasitic","cordycep",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"catalyst","terraform",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"mutate","psyshroom",0, [ ["basepower",[10]],["strongest",[1]] ]);

        
        addShapeRelationship(currentShape.typeStr,null,"worldtree",  "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"worm",       "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"crab",       "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"kraken",     "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"leviathan",  "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"hydra",      "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"dinosaur",   "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"behemoth",   "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"dragon",     "strong","weak","earthly");

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

        
        currentShape.desc = "full of life, which it might share";


        addEffects(null,currentShape,"neutral","branch",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"strong","trunk",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"weak","sap",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"burst","blooming",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"harmony","flower",1, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"devour","uproot",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"parasitic","graft",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"catalyst","ecosystem",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"mutate","leaves",0, [ ["basepower",[10]],["strongest",[1]] ]);

        
        addShapeRelationship(currentShape.typeStr,null,"worm",       "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"crab",       "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"kraken",     "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"leviathan",  "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"hydra",      "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"dinosaur",   "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"behemoth",   "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"dragon",     "strong","weak","earthly");

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

        
        currentShape.desc = "simple and efficient. likes to burrow.";


        addEffects(null,currentShape,"neutral","bristle",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"strong","capture",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"weak","burrow",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"burst","surfacing",3, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"harmony","slime",-3, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"devour","leech",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"parasitic","hook",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"catalyst","extend",15, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"mutate","reverse",0, [ ["basepower",[10]],["strongest",[1]] ]);

        
        addShapeRelationship(currentShape.typeStr,null,"crab",       "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"kraken",     "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"leviathan",  "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"hydra",      "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"dinosaur",   "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"behemoth",   "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"dragon",     "strong","weak","earthly");

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
        
        currentShape.desc = "heavily armored, surprisingly evasive";


        addEffects(null,currentShape,"neutral","pinch",-3, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"strong","crusher",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"weak","scissor",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"burst","shell",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"harmony","crab",20, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"devour","vise",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"parasitic","scuttle",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"catalyst","bubbles",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"mutate","carcinize",0, [ ["basepower",[10]],["strongest",[1]] ]);

        
        addShapeRelationship(currentShape.typeStr,null,"kraken",     "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"leviathan",  "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"hydra",      "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"dinosaur",   "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"behemoth",   "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"dragon",     "strong","weak","earthly");

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
        
        currentShape.desc = "restrain opponents to devour them";


        addEffects(null,currentShape,"neutral","tentacle",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"strong","drag &",99, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"weak","envenom",-1, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"burst","8-arm",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"harmony","biozap",-2, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"devour","wrap",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"parasitic","harpoon",0, [ ["basepower",[10]],["strongest",[1]],["setAspect", [aspectsRecord["bone"].index, 2]] ]);
        addEffects(null,currentShape,"catalyst","regrow",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"mutate","ink",0, [ ["basepower",[10]],["strongest",[1]] ]);

        
        addShapeRelationship(currentShape.typeStr,null,"leviathan",  "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"hydra",      "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"dinosaur",   "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"behemoth",   "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"dragon",     "strong","weak","earthly");

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
        currentShape.desc = "immovable lord of the sea";


        addEffects(null,currentShape,"neutral","engulf",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"strong","ramming",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"weak","sonar",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"burst","spout",-2, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"harmony","song",-10, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"devour","breach",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"parasitic","bloodsmell",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"catalyst","sharkskin",15, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"mutate","blubber",0, [ ["basepower",[10]],["strongest",[1]] ]);

        
        addShapeRelationship(currentShape.typeStr,null,"hydra",      "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"dinosaur",   "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"behemoth",   "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"dragon",     "strong","weak","earthly");

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
        currentShape.desc = "unpredictable, many-headed venomous serpent";


        addEffects(null,currentShape,"neutral","venomfang",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"strong","-bite",-9, [ ["basepower",[10]],["physical",[3]] ]);
        addEffects(null,currentShape,"weak","coil",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"burst","-spit",0, [ ["basepower",[10]],["magical",[1]] ]);
        addEffects(null,currentShape,"harmony","constrict",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"devour","swallow",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"parasitic","head fork",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"catalyst","slither",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"mutate","shedskin",0, [ ["basepower",[10]],["strongest",[1]] ]);

        
        addShapeRelationship(currentShape.typeStr,null,"dinosaur",   "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"behemoth",   "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"dragon",     "strong","weak","earthly");

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
        currentShape.desc = "the strongest animals to ever live";

 
        addEffects(null,currentShape,"neutral","stomp",-2, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"strong","whiplash",-1, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"weak","fossil",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"burst","rampage",-1, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"harmony","quake",-1, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"devour","crunch",-4, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"parasitic","tar",1, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"catalyst","primeval",10, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"mutate","-rex",-99, [ ["basepower",[10]],["strongest",[1]] ]);

        
        addShapeRelationship(currentShape.typeStr,null,"behemoth",   "strong","weak","earthly");
        addShapeRelationship(currentShape.typeStr,null,"dragon",     "strong","weak","earthly");

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
        
        currentShape.desc = "unstoppable humongous force of nature";


        addEffects(null,currentShape,"neutral","devour",0,          [ ["basepower",[15]],["physical",[2]]]);
        addEffects(null,currentShape,"strong","stampede",0,         [ ["basepower",[22]],["physical",[4]],["setOthersRealmAspect",[3]]]);
        addEffects(null,currentShape,"weak","fearless",20,           [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"burst","great horn",0,         [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"harmony","bellowing",5,        [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"devour","onslaught",-3,         [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"parasitic","berserk",1,      [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"catalyst","giant",12,       [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"mutate","meteor",0,         [ ["basepower",[10]],["strongest",[1]] ]);

        
        addShapeRelationship(currentShape.typeStr,null,"dragon",     "strong","weak","earthly");

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
        
        currentShape.desc = "ancient mystical embodiment of the elements";


        addEffects(null,currentShape,"neutral","hunger",-2, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"strong","flare",-4, [ ["basepower",[10]],["magical",[4]] ,["targetType",[targetsList.indexOf("single")]] ]);
        //
        addEffects(null,currentShape,"weak","slumber",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"burst","outrage",-1, [ ["basepower",[10]],["physical",[2]] ,["targetType",[targetsList.indexOf("front")]] ]);
        addEffects(null,currentShape,"harmony","breath",-3, [ ["basepower",[10]],["magical",[99]],["targetType",[targetsList.indexOf("double")]] ]);
        addEffects(null,currentShape,"devour","cataclysm",0, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"parasitic","treasure",5, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"catalyst","awaken",15, [ ["basepower",[10]],["strongest",[1]] ]);
        addEffects(null,currentShape,"mutate","serpenteye",0, [ ["basepower",[10]],["strongest",[1]] ]);

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


        ///// ==========ITEM ZONE===========

        // bunch of items go here

        ///// ==========ABILITY ZONE========
        
        //// *FIRE*ABILITIES*
        /// beetle      - 
        /// crawler     - 
        /// stinger     - 
        /// nightmare   - 
        /// canine      - 
        /// feline      - 
        /// critter     - 
        /// antler      - 
        /// feather     - 
        /// fruit       -
        /// mycon       -
        /// worldtree   -
        /// worm        -
        /// crab        -
        /// kraken      -
        /// leviathan   -
        /// hydra       -
        /// dinosaur    -
        /// behemoth    - 
        /// dragon      - Red Legend - Something about fire and breath

        //// *STEEL*ABILITIES*
        /// beetle      - 
        /// crawler     - 
        /// stinger     - 
        /// nightmare   - 
        /// canine      - 
        /// feline      - 
        /// critter     - 
        /// antler      - 
        /// feather     - 
        /// fruit       - 
        /// mycon       - 
        /// worldtree   - 
        /// worm        - 
        /// crab        - 
        /// kraken      - 
        /// leviathan   - 
        /// hydra       - 
        /// dinosaur    - 
        /// behemoth    -  
        /// dragon      - 

        //// *FAE*ABILITIES*
        /// beetle      -
        /// crawler     -
        /// stinger     -
        /// nightmare   -
        /// canine      -
        /// feline      -
        /// critter     -
        /// antler      -
        /// feather     -
        /// fruit       -
        /// mycon       -
        /// worldtree   -
        /// worm        -
        /// crab        -
        /// kraken      -
        /// leviathan   -
        /// hydra       -
        /// dinosaur    -
        /// behemoth    - 
        /// dragon      -
        
        //// *BUGS*ABILITIES*
        /// beetle      -
        /// crawler     -
        /// stinger     - parasitoid: if opponent knocked out with melee attack, uses weaker version of same action on 2nd opponent
        /// nightmare   -
        /// canine      -
        /// feline      -
        /// critter     -
        /// antler      -
        /// feather     -
        /// fruit       -
        /// mycon       -
        /// worldtree   -
        /// worm        -
        /// crab        -
        /// kraken      -
        /// leviathan   -
        /// hydra       -
        /// dinosaur    -
        /// behemoth    - 
        /// dragon      -

        ////!!! *IMAGO*ABILITIES* 
        /// beetle      -
        /// crawler     -
        /// stinger     - parasitoid imago: also works with any BUGS action
        /// nightmare   -
        /// canine      -
        /// feline      -
        /// critter     -
        /// antler      -
        /// feather     -
        /// fruit       -
        /// mycon       -
        /// worldtree   -
        /// worm        -
        /// crab        -
        /// kraken      -
        /// leviathan   -
        /// hydra       -
        /// dinosaur    -
        /// behemoth    - 
        /// dragon      -

        //// *BEAST*ABILITIES*
        /// beetle      -
        /// crawler     -
        /// stinger     -
        /// nightmare   -
        /// canine      -
        /// feline      -
        /// critter     -
        /// antler      -
        /// feather     -
        /// fruit       -
        /// mycon       -
        /// worldtree   -
        /// worm        -
        /// crab        -
        /// kraken      -
        /// leviathan   -
        /// hydra       -
        /// dinosaur    -
        /// behemoth    - King of the Beasts - roars before using any BEAST action, doing smth (like bellowing?)
        /// dragon      -

        //// *BONE*ABILITIES*
        /// beetle      - exo & endo - defensive stats can't be lowered and get +10%
        /// crawler     - 
        /// stinger     -
        /// nightmare   -
        /// canine      -
        /// feline      -
        /// critter     -
        /// antler      -
        /// feather     -
        /// fruit       -
        /// mycon       -
        /// worldtree   -
        /// worm        -
        /// crab        -
        /// kraken      -
        /// leviathan   -
        /// hydra       -
        /// dinosaur    - fossil body - 
        /// behemoth    - 
        /// dragon      -

        //// *BLOOD*ABILITIES* 
        /// beetle      - 
        /// crawler     - 
        /// stinger     - bloodmeal: restores 25% hp upon inflicting a status ailment
        /// nightmare   - blood teleport: attacks gains priority vs bleeding target
        /// canine      - 
        /// feline      - 
        /// critter     - 
        /// antler      - 
        /// feather     - 
        /// fruit       - 
        /// mycon       -
        /// worldtree   -
        /// worm        -
        /// crab        -
        /// kraken      -
        /// leviathan   -
        /// hydra       -
        /// dinosaur    -
        /// behemoth    - 
        /// dragon      -

        //// *HELL*ABILITIES* 
        /// beetle      -
        /// crawler     - hellgrammite:
        /// stinger     -
        /// nightmare   -
        /// canine      - guard dog of hell: deals 1.5x damage to opponent who switched in this turn
        /// feline      -
        /// critter     -
        /// antler      -
        /// feather     -
        /// fruit       -
        /// mycon       -
        /// worldtree   -
        /// worm        -
        /// crab        -
        /// kraken      -
        /// leviathan   -
        /// hydra       -
        /// dinosaur    -
        /// behemoth    - 
        /// dragon      -

        //// *FOREST*ABILITIES*
        /// beetle      -
        /// crawler     -
        /// stinger     -
        /// nightmare   -
        /// canine      -
        /// feline      -
        /// critter     -
        /// antler      -
        /// feather     -
        /// fruit       -
        /// mycon       -
        /// worldtree   -
        /// worm        -
        /// crab        -
        /// kraken      -
        /// leviathan   -
        /// hydra       -
        /// dinosaur    -
        /// behemoth    - 
        /// dragon      -

        //// *SOLAR*ABILITIES*
        /// beetle      -
        /// crawler     -
        /// stinger     -
        /// nightmare   -
        /// canine      -
        /// feline      -
        /// critter     -
        /// antler      -
        /// feather     -
        /// fruit       -
        /// mycon       -
        /// worldtree   -
        /// worm        -
        /// crab        -
        /// kraken      -
        /// leviathan   -
        /// hydra       -
        /// dinosaur    -
        /// behemoth    - 
        /// dragon      -

        //// *STARS*ABILITIES*
        /// beetle      -
        /// crawler     -
        /// stinger     -
        /// nightmare   -
        /// canine      -
        /// feline      -
        /// critter     -
        /// antler      -
        /// feather     -
        /// fruit       -
        /// mycon       -
        /// worldtree   -
        /// worm        -
        /// crab        -
        /// kraken      -
        /// leviathan   -
        /// hydra       -
        /// dinosaur    -
        /// behemoth    - 
        /// dragon      -

        //// *ABYSS*ABILITIES*  
        /// beetle      -
        /// crawler     -
        /// stinger     -
        /// nightmare   -
        /// canine      -
        /// feline      -
        /// critter     -
        /// antler      -
        /// feather     -
        /// fruit       -
        /// mycon       -
        /// worldtree   -
        /// worm        - volcano eater: immune to FIRE. is healed for 25% when a FIRE move is used on it.
        /// crab        -
        /// kraken      -
        /// leviathan   -
        /// hydra       -
        /// dinosaur    -
        /// behemoth    - 
        /// dragon      -

        //// *MACHINE*ABILITIES*
        /// beetle      -
        /// crawler     -
        /// stinger     -
        /// nightmare   -
        /// canine      -
        /// feline      -
        /// critter     -
        /// antler      -
        /// feather     -
        /// fruit       -
        /// mycon       -
        /// worldtree   - ablative bark: doubles armor for first phys (attack or hit?)
        /// worm        -
        /// crab        -
        /// kraken      -
        /// leviathan   -
        /// hydra       -
        /// dinosaur    -
        /// behemoth    - 
        /// dragon      - 

        //// *VOID*ABILITIES*
        /// beetle      -
        /// crawler     -
        /// stinger     -
        /// nightmare   -
        /// canine      -
        /// feline      -
        /// critter     -
        /// antler      -
        /// feather     -
        /// fruit       -
        /// mycon       -
        /// worldtree   -
        /// worm        -
        /// crab        -
        /// kraken      -
        /// leviathan   -
        /// hydra       -
        /// dinosaur    -
        /// behemoth    - 
        /// dragon      -

        //// *SANDS*ABILITIES*
        /// beetle      -
        /// crawler     -
        /// stinger     -
        /// nightmare   -
        /// canine      -
        /// feline      -
        /// critter     -
        /// antler      -
        /// feather     -
        /// fruit       -
        /// mycon       -
        /// worldtree   -
        /// worm        -
        /// crab        -
        /// kraken      -
        /// leviathan   -
        /// hydra       -
        /// dinosaur    -
        /// behemoth    - 
        /// dragon      -

        //// *ROT*ABILITIES*
        /// beetle      -
        /// crawler     -
        /// stinger     -
        /// nightmare   -
        /// canine      -
        /// feline      -
        /// critter     -
        /// antler      -
        /// feather     -
        /// fruit       -
        /// mycon       -
        /// worldtree   -
        /// worm        -
        /// crab        -
        /// kraken      -
        /// leviathan   -
        /// hydra       -
        /// dinosaur    -
        /// behemoth    - 
        /// dragon      -

        //// *CURSE*ABILITIES*
        /// beetle      -
        /// crawler     -
        /// stinger     -
        /// nightmare   -
        /// canine      - lycamorphosis: being cursed also has the effect of beasthood
        /// feline      -
        /// critter     -
        /// antler      -
        /// feather     -
        /// fruit       -
        /// mycon       -
        /// worldtree   -
        /// worm        -
        /// crab        -
        /// kraken      -
        /// leviathan   -
        /// hydra       -
        /// dinosaur    -
        /// behemoth    - 
        /// dragon      - 

        //// *HEAVENS*ABILITIES*
        /// beetle      -
        /// crawler     -
        /// stinger     -
        /// nightmare   -
        /// canine      -
        /// feline      -
        /// critter     -
        /// antler      -
        /// feather     -
        /// fruit       -
        /// mycon       -
        /// worldtree   -
        /// worm        -
        /// crab        -
        /// kraken      -
        /// leviathan   -
        /// hydra       -
        /// dinosaur    -
        /// behemoth    - 
        /// dragon      -

        //// *STORMS*ABILITIES*
        /// beetle      -
        /// crawler     -
        /// stinger     -
        /// nightmare   -
        /// canine      -
        /// feline      -
        /// critter     -
        /// antler      -
        /// feather     -
        /// fruit       -
        /// mycon       -
        /// worldtree   -
        /// worm        -
        /// crab        -
        /// kraken      -
        /// leviathan   -
        /// hydra       -
        /// dinosaur    -
        /// behemoth    - 
        /// dragon      -

        //// *LIFESPRING*ABILITIES*
        /// beetle      -
        /// crawler     -
        /// stinger     -
        /// nightmare   -
        /// canine      -
        /// feline      -
        /// critter     -
        /// antler      -
        /// feather     -
        /// fruit       -
        /// mycon       -
        /// worldtree   - source of life: heal everyone at end of turn but teammate more
        /// worm        -
        /// crab        -
        /// kraken      -
        /// leviathan   -
        /// hydra       -
        /// dinosaur    -
        /// behemoth    - 
        /// dragon      - 
 