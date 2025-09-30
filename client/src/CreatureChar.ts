import GameElement from "./GameElement"; 
import gameEngine from "./GameEngine";

import crambUrl from  "./gfx/funny_crab.png";
import octoUrl from "./gfx/quadtopus.png";
import mashUrl from "./gfx/mashroom.png";
import hydraUrl from "./gfx/hydrr.png";
import nekoUrl from "./gfx/evil_neko.png";
import centiUrl from "./gfx/centip.png";
import sharkyUrl from "./gfx/sharky.png";
import melonUrl from "./gfx/watermelone.png";
import treeUrl from "./gfx/heaven-tree.png";
import foxUrl from "./gfx/fire-canine.png";
import fruitUrl from "./gfx/steel_fruit.png";
import starBeheUrl from "./gfx/star_behemoth.png";
import sandStingUrl from "./gfx/sands_stinger.png";
import solarAntlerUrl from "./gfx/solar_antler.png";
import bloodNightmareUrl from "./gfx/blood_nightmare.png";
import curseBeetleUrl from "./gfx/curse_beetle.png";
import faeCritterUrl from "./gfx/fae_critter.png";
import forestFeatherUrl from "./gfx/forest_feather.png";
import abyssWormUrl from "./gfx/abyss_worm.png";
import boneDinoUrl from "./gfx/bone_dinosaur.png";
import stormsDragonUrl from "./gfx/storms_dragon.png";


import { FightAction } from "./FightAction"; 
import FightMatch from "./FightMatch";

import * as DATA from './Data.ts';


export class CreatureChar extends GameElement {

    public name:string = "animal" + String(Math.floor(Math.random()*100)); 
    public dir:number = 1;
    public defaultX:number = 0;
    public defaultY:number = 0;

    public sprite:string = "";

    public clientPercentDisplayHP = false;
    public infoKnown = true;

    public HP:number = 100;
    public maxHP:number = 100; 
    public damaged:number = 0;
    public maxDamaged:number = 0;

    public dodgePoint: number = 1;
    public dodgeMax: number = 1;


    public muscle:number = 10;
    public magic:number = 10;
    public armor:number = 1;
    public resistance:number = 10;
    public speed:number = 5;

    public turnOver:boolean = false;

    public activeSlot:number = -1;

    public statPlus:Array<number> = [0,0,0,0,0,0,0];
    
    public itemChoices:Array<string|null> = [null,null];
    public currentItem:string|null = null;
    

    public realms:Array<DATA.realm> = ["earthly","earthly"];
    public skill1:string = "";
    public skill2:string = "";
    public soulType:DATA.soulType = "natural";
    public halfSoul:DATA.soulType = "none";

    actions:Array<FightAction> = [
        new FightAction(this),
        new FightAction(this),
        new FightAction(this),
        new FightAction(this) 
    ];

    animations:Array<any> = [];
    flash:number = 0;
    flashMax:number = 30;
    flashColor:string = "white";
    flashType:string = "normal";
    fainting:number = 0;


    displayLifebar = false;
    displayExtraTimer = 0;

    aspectTypes:Array<DATA.aspectsType> = [];
    shapes:Array<DATA.shapesType> = [];

    loaded:boolean = false;

    tempUrlArray:Array<any> = [crambUrl,octoUrl,mashUrl,hydraUrl,nekoUrl,centiUrl,sharkyUrl,melonUrl,treeUrl,foxUrl,fruitUrl,starBeheUrl,solarAntlerUrl,sandStingUrl,bloodNightmareUrl,curseBeetleUrl,faeCritterUrl,forestFeatherUrl,abyssWormUrl,boneDinoUrl];
 
    imageElem:HTMLImageElement = document.createElement("img");  
    imageAlpha:number = 1;

    constructor (public engine:gameEngine,public x:number = 0,public y:number = 0,public depth:number = 0,public team = -1){
        super(engine,x,y,depth)
        let rando = Math.floor(Math.random()*this.tempUrlArray.length);
        //this.imageElem.src = this.tempUrlArray[rando];

        this.imageElem.onload = () => { 
            this.loaded = true;
          }
        rando = Math.floor(Math.random()*DATA.aspectsList.length);
        this.aspectTypes.push(DATA.aspectsList[rando]);
        if (Math.random()> 0.6)
        {
            rando = Math.floor(Math.random()*DATA.aspectsList.length);
            if (this.aspectTypes[0] != DATA.aspectsList[rando])
            {this.aspectTypes.push(DATA.aspectsList[rando]);}
        }

        rando = Math.floor(Math.random()*DATA.shapesList.length);
        this.shapes.push(DATA.shapesList[rando]);
        rando = Math.floor(Math.random()*DATA.shapesList.length);
        this.shapes.push(DATA.shapesList[rando]);
        while (this.shapes[0] === this.shapes[1])
        {
            rando = Math.floor(Math.random()*DATA.shapesList.length);
            this.shapes[1] = DATA.shapesList[rando];
        }
        

        this.speed = Math.floor(Math.random()*7)+1;
         
        this.resetStats();
    }


    drawFunction = (context:CanvasRenderingContext2D) => {
        if (this.loaded)
            { 
                for (let i = this.animations.length-2; i >=0 ; i = i-2)
                { 
                     const animType = this.animations[i];
                     switch (animType)
                     {
                         
                        default: break;  
                     }
                     this.animations[i+1] -= 1;
                     if (this.animations[i+1] <= 0)
                     {
                        
                     } 
                } 
                
                context.save();
                //_context.drawImage(this.imageElem,this.x+64,this.y,64,64);
                context.globalAlpha = this.imageAlpha;
                
                if (this.dir == -1)
                { 
                    context.translate(640, 0);
                    context.scale(-1, 1); 
                    context.filter = "none";  
                    if (this.fainting > 0)
                        {
                            context.filter = "grayscale("+String(Math.min(100,this.fainting))+"%)"
                            if (this.fainting > 60)
                                {
                                    if (this.imageAlpha > 0.02){this.imageAlpha -= 0.02;} else {this.imageAlpha = 0;}
                                }
                             
                        this.fainting += 1;
                        }
                    context.drawImage(this.imageElem,640-this.x-64,this.y,64,64);
                    if (this.flash > 0)
                    {
                        context.filter = "contrast(0) sepia(100%) hue-rotate(116deg) brightness(2.4) saturate(0.28) opacity("+String(this.flash/this.flashMax*100)+"%)";
                        this.flash -= 1;
                        context.drawImage(this.imageElem,640-this.x-64,this.y,64,64);
                    }
                    else if (this.flash < 0)
                    {
                        console.log("flashy flash:",(1/this.flash/this.flashMax)*10000)
                        context.filter = "contrast(0) sepia(100%) hue-rotate(116deg) brightness(2.4) saturate(0.28) opacity("+String((10000)*(1/this.flash/this.flashMax))+"%)"; 
                        context.drawImage(this.imageElem,640-this.x-64,this.y,64,64); 
                        this.flash += 1;
                    }
                } 
                else{ 
                    context.filter = "none"; 
                    if (this.fainting > 0)
                        {
                            context.filter = "grayscale("+String(Math.min(100,this.fainting))+"%)" 
                            if (this.fainting > 60)
                                {
                                    if (this.imageAlpha > 0.02){this.imageAlpha -= 0.02;} else {this.imageAlpha = 0;}
                                }
                        this.fainting += 1;
                        }
                    context.drawImage(this.imageElem,this.x,this.y,64,64);
                    if (this.flash > 0)
                    {
                        context.filter = "contrast(0) sepia(100%) hue-rotate(116deg) brightness(2.4) saturate(0.28) opacity("+String(this.flash/this.flashMax*100)+"%)";
                        this.flash -= 1;
                        context.drawImage(this.imageElem,this.x,this.y,64,64);
                    }
                    else if (this.flash < 0)
                        {
                            console.log("flashy flash:",(1/this.flash/this.flashMax)*10000)
                            context.filter = "contrast(0) sepia(100%) hue-rotate(116deg) brightness(2.4) saturate(0.28) opacity("+String((10000)*(1/this.flash/this.flashMax))+"%)"; 
                            context.drawImage(this.imageElem,this.x,this.y,64,64);
                            this.flash += 1;
                        }
                } 
                context.globalAlpha = 1; 
                context.restore();
                context.filter = "none";
                

            }

            if (this.damaged > 0 || this.displayExtraTimer > 0)
            {
                if (this.HP < 0) {this.damaged += this.HP; this.HP = 0; this.displayExtraTimer = 20;}
                this.displayLifebar = true;
                if (this.displayExtraTimer > 0) {this.displayExtraTimer -= 1; if (this.displayExtraTimer <= 0) {this.displayLifebar=false; this.displayExtraTimer = 0;}}
            } 
            //lifebar display during events
            if (this.displayLifebar)
            {
                context.fillStyle = "black";
                context.beginPath();
                context.fillRect(this.x-14,this.y+70,88,9); 
                const hpRatio = this.HP/this.maxHP*84;
                context.fillStyle = "green";
                if (hpRatio <= 21) {context.fillStyle = "red";}
                else if (hpRatio <= 42) {context.fillStyle = "yellow";}
                context.fillRect(this.x-12,this.y+72,hpRatio,5);

                if (this.damaged > 0)
                {
                    context.fillStyle = "maroon";
                    context.fillRect(this.x-12+hpRatio,this.y+72,this.damaged*0.84,5); 

                    this.damaged -= 0.5;
                    if (this.damaged <= 0){this.displayLifebar=false; this.displayExtraTimer = 50; this.damaged = 0;}
                }
                else if (!this.displayExtraTimer) {this.displayLifebar = false;} 
                context.closePath();
                context.fill();
            }
            
            

    }

    makeEventFromAction = (currentMatch:FightMatch,actionNumber:number,targetNumber:number) =>{ 
        const currentAction = this.actions[actionNumber];   
        const newEvent = currentAction.generateEvent(this);
        newEvent.currentTarget = targetNumber;
        return newEvent;
    }

    resetStats = () => {
        const shape1 = DATA.shapesRecord[this.shapes[0]];
        const shape2 = DATA.shapesRecord[this.shapes[1]];
        const aspect1 = DATA.aspectsRecord[this.aspectTypes[0]];
        if (this.aspectTypes.length > 1)
            {
                if (this.aspectTypes[0] === this.aspectTypes[1])
                    {
                        this.aspectTypes.splice(1,1);
                    }
            }

        this.maxHP = shape1.baseHP + shape2.baseHP;
        if (this.statPlus[0] === 1) {this.maxHP *= 1.10; this.maxHP+=10}
        else if (this.statPlus[0] === 2) {this.maxHP *= 1.23; this.maxHP+=20}
        this.maxHP = Math.round(this.maxHP/4+26);
        this.HP = this.maxHP;

        this.dodgeMax = shape1.baseAgi + shape2.baseAgi;
        if (this.statPlus[1] === 1) {this.dodgeMax *= 1.10; this.dodgeMax += 6;}
        else if (this.statPlus[1] === 2) {this.dodgeMax *= 1.23; this.dodgeMax +=14;}
        this.dodgeMax = Math.round(this.dodgeMax/12);

        this.speed = shape1.baseSpd + shape2.baseSpd;
        if (this.statPlus[2] === 1) {this.speed *= 1.10; this.speed += 6;}
        else if (this.statPlus[2] === 2) {this.speed *= 1.23; this.speed +=14;}
        this.speed = Math.round(this.speed/12);

        this.muscle = shape1.baseStr + shape2.baseStr;
        if (this.statPlus[3] === 1) {this.muscle *= 1.10; this.muscle += 6;}
        else if (this.statPlus[3] === 2) {this.muscle *= 1.23; this.muscle +=14;}
        this.muscle = Math.round(this.muscle/12);

        
        this.armor = shape1.baseArm + shape2.baseArm;
        if (this.statPlus[4] === 1) {this.armor *= 1.10; this.armor += 6;}
        else if (this.statPlus[4] === 2) {this.armor *= 1.23; this.armor +=14;}
        this.armor = Math.round(this.armor/12);

        this.magic = shape1.baseMag + shape2.baseMag;
        if (this.statPlus[5] === 1) {this.magic *= 1.10; this.magic += 6;}
        else if (this.statPlus[5] === 2) {this.magic *= 1.23; this.magic +=14;}
        this.magic = Math.round(this.magic/12);


        this.resistance = shape1.baseRes + shape2.baseRes;
        if (this.statPlus[6] === 1) {this.resistance *= 1.10; this.resistance += 6;}
        else if (this.statPlus[6] === 2) {this.resistance *= 1.23; this.resistance +=14;}
        this.resistance = Math.round(this.resistance/12);

        switch (this.shapes[0])
        {
            case "antler":
                this.sprite = solarAntlerUrl; break;
            case "beetle":
                this.sprite = curseBeetleUrl; break;
            case "behemoth":
                this.sprite = starBeheUrl; break;
            case "canine":
                this.sprite = foxUrl; break;
            case "crab":
                this.sprite = crambUrl; break;
            case "crawler":
                this.sprite = centiUrl; break;
            case "critter":
                this.sprite = faeCritterUrl; break;
            case "dinosaur":
                this.sprite = boneDinoUrl; break; 
            case "feather":
                this.sprite = forestFeatherUrl; break;
            case "feline":
                this.sprite = nekoUrl; break;
            case "fruit":
                this.sprite = fruitUrl; break;
            case "hydra":
                this.sprite = hydraUrl; break;
            case "kraken":
                this.sprite = octoUrl; break;
            case "leviathan":
                this.sprite = sharkyUrl; break;
            case "mycon":
                this.sprite = mashUrl; break;
            case "nightmare":
                this.sprite = bloodNightmareUrl; break;
            case "stinger":
                this.sprite = sandStingUrl; break;
            case "worldtree":
                this.sprite = treeUrl; break;
            case "worm":
                this.sprite = abyssWormUrl; break;
            case "dragon":
                this.sprite = stormsDragonUrl; break;
        }
        this.imageElem.src = this.sprite;

        this.createActions();
    } 

    createSingleAction = (creature:CreatureChar, actionHalfObj:[DATA.Aspect|DATA.Shape,DATA.Aspect|DATA.Shape], realms:[DATA.realm,DATA.realm],soul:DATA.soulType) => {

        let newAction = new FightAction(creature);

        let basePower = 0;  
        let powerMult = 1; 
        let powerBonus = 0; 
        
        let isShape = [actionHalfObj[0].isShape,actionHalfObj[1].isShape]; 
        let actionHalf:[DATA.aspectsType|DATA.shapesType,DATA.aspectsType|DATA.shapesType] = [actionHalfObj[0].typeStr,actionHalfObj[1].typeStr]; 

        
        let tieBreaker = 0.5;

        let realmAspects:[DATA.aspectsType,DATA.aspectsType] = [ 
            actionHalfObj[0].realmAspectRecord[realms[0]],
            actionHalfObj[1].realmAspectRecord[realms[1]]
        ];


        if (isShape[0] && isShape[1] || !isShape[0] && !isShape[1])
        {
            if (actionHalfObj[0].index > actionHalfObj[1].index)
            { tieBreaker = 0.5;   }
            else {tieBreaker = -0.5;}
        }
        else if (isShape[0])
        { tieBreaker = -0.5; }

        let relationship:Array<DATA.relationships> = ["neutral","neutral"];  
        let halfEffect:[Array<[DATA.actionEffects,Array<number>]>,Array<[DATA.actionEffects,Array<number>]>] = [[],[]];
        let halfName:Array<[string,number]> = [["",0],["",0]];  
        let targetAspect:Array<[DATA.aspectsType,number]> = [[actionHalfObj[0].realmAspectRecord["earthly"],0],[actionHalfObj[1].realmAspectRecord["earthly"],0]]; 
        if (isShape[0]) {targetAspect[0][1] -=1;}   
        if (isShape[1]) {targetAspect[1][1] -=1;}   

        //setup base variables 
        for (let i =0; i < 2; i++)
            {
                const opposite = Math.abs(i-1);
                if (i === 0 && actionHalf[0] === actionHalf[1])
                    {  relationship[0] = "unique"; }
                else {relationship[i] = actionHalfObj[i].relationshipRecord[actionHalf[opposite]][0] }
                halfName[i] = actionHalfObj[i].effectNameRecord[relationship[i]]; 
                halfEffect[i] = actionHalfObj[i].effectRecord[relationship[i]];
            } 
 
        let actionAttackType:number = 0;
        let actionStrongestType:number = 0;
        let actionOtherType:number = 0;
        

        //go through effects
        for (let i =0; i <2; i++)
        {
            const opposite = Math.abs(i-1);
             for (let j = 0; j < halfEffect[i].length; j++)
                {
                    const effectType = halfEffect[i][j][0];
                    const effectParams = halfEffect[i][j][1];
                    switch (effectType)
                    {
                        case "basepower":
                            basePower += effectParams[0];
                        break;
                        case "physical":
                            actionAttackType += effectParams[0];
                        break;
                        case "magical":
                            actionAttackType -= effectParams[0];
                        break;
                        case "strongest":
                            actionStrongestType += effectParams[0];
                        break;
                        case "setAspect":
                             targetAspect[i][0] = DATA.aspectsList[effectParams[0]];
                             targetAspect[i][1] = effectParams[1];
                        break;
                        case "setRealmAspect":
                            targetAspect[i][0] = realmAspects[i];
                            targetAspect[i][1] = effectParams[0];
                        break;
                        
                        case "setOthersAspect": //TODO fix this lol
                            targetAspect[i][0] = realmAspects[opposite];
                            targetAspect[i][1] = effectParams[0];
                        break;
                        case "setOthersRealmAspect":
                            targetAspect[i][0] = realmAspects[opposite];
                            targetAspect[i][1] = effectParams[0];
                        break;
                        case "targetType":
                            newAction.targetType = DATA.targetsList[effectParams[0]];
                        break;
                    }
                }
        } 

        if (targetAspect[0][1] + tieBreaker > targetAspect[1][1])
            { newAction.actionAspect = targetAspect[0][0]; }
            else {newAction.actionAspect = targetAspect[1][0];} 

        if (actionAttackType > 1)
        {
            newAction.actionType = "physical";
        }
        else if (actionAttackType < -1)
        {
            newAction.actionType = "magical";
        }
        else
        {
            newAction.actionType = "strongest";
        }

        basePower = basePower/2; 

        let spaceCheck = " ";
        if (halfName[0][1] + tieBreaker > halfName[1][1])
            {
                if (halfName[1][0].charAt(0) === "-" || halfName[0][0].charAt(halfName[0][0].length-1) === "-") {spaceCheck = "";}
                newAction.name = halfName[0][0] + spaceCheck + halfName[1][0];
            }
            else {
                if (halfName[0][0].charAt(0) === "-"  || halfName[1][0].charAt(halfName[1][0].length-1) === "-") {spaceCheck = "";}
                newAction.name = halfName[1][0] + spaceCheck + halfName[0][0];  
            }
        if (halfName[0][0] === "-rex" || halfName[1][0] === "-rex")
        {
            newAction.name = "t-"+newAction.name;
        }
        if (halfName[0][0] === "-bite" || halfName[1][0] === "-bite" || halfName[0][0] === "-spit" || halfName[1][0] === "-spit")
        {
            newAction.name = "tri-"+newAction.name;
        }
        
        if (newAction.actionAspect === "machine" && newAction.actionType === "magical")
        {
            newAction.actionAspect = "laser";
        }
        else if (newAction.actionAspect === "machine" && newAction.actionType === "strongest" && creature.magic > creature.muscle)
        {
            newAction.actionAspect = "laser";
        }

        newAction.power = Math.round(basePower*powerMult);
        return newAction;

    }

    createActions = () => { 

        const aspect1 = this.aspectTypes[0];
        let aspect2 = aspect1 ;
        if (this.aspectTypes.length > 1) {aspect2 = this.aspectTypes[1];}
        const shape1 = this.shapes[0];
        const shape2 = this.shapes[1]; 
        const aspect1Obj = DATA.aspectsRecord[aspect1];
        const aspect2Obj = DATA.aspectsRecord[aspect2];
        const shape1Obj = DATA.shapesRecord[shape1];
        const shape2Obj = DATA.shapesRecord[shape2];
        const realm1:DATA.realm = aspect1Obj.relationshipRecord[shape2][1];
        const realm2:DATA.realm = aspect2Obj.relationshipRecord[shape1][1];

        const soul:DATA.soulType = "natural";
        const soulHalf:DATA.soulType = "natural";

        //action 0 - double aspect  
        this.actions[0] = this.createSingleAction(this,[aspect1Obj,aspect2Obj],[realm2,realm1],soul);
        //action 2 - aspect1 shape1 
        this.actions[2] = this.createSingleAction(this,[aspect1Obj,shape1Obj],[realm2,realm1],soul);
        //action 1 - aspect2 shape2 -- making it like this bc of visual positioning 
        this.actions[1] = this.createSingleAction(this,[aspect2Obj,shape2Obj],[realm1,realm2],soul);
        //action 3 - double shape 
        this.actions[3] = this.createSingleAction(this,[shape1Obj,shape2Obj],[realm1,realm2],soul);

    }

    createActionFrom2Shapes = (shape1:DATA.shapesType,shape2:DATA.shapesType) => {
        let newAction = new FightAction(this); 

        return newAction;
    } 

    createActionFrom2Aspects = (aspect1:DATA.aspectsType,aspect2:DATA.aspectsType) => {
        let newAction = new FightAction(this);

        return newAction;
    }

    createActionFromCombo = () => {
        
    }



}


export default CreatureChar