import GameElement from "./GameElement"; 
import gameEngine from "./GameEngine";

import { ClientAction } from "./ClientAction.ts";
 

import * as DATA from './Data.ts';
import { ClientCharSprite } from "./ClientCharSprite.ts";


export class ClientCreature extends GameElement { 

    //permanent vars that determine the core of the creature -----------------------------
    public name:string = "animal" + String(Math.floor(Math.random()*100)); 
     
     
    public statPlus:Array<number> = [0,0,0,0,0,0,0];
    public itemChoices:Array<string|null> = [null,null];
    public currentItem:string|null = null;
    
    public soulType:DATA.soulType = "natural";
    public halfSoul:DATA.soulType = "none";

    aspectsList:Array<DATA.aspectsType> = [];
    shapesList:Array<DATA.shapesType> = []; 


    //combat -----------------------------
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

    public skill1:string = "";
    public skill2:string = ""; 

    public realms:Array<DATA.realm> = ["earthly","earthly"];

    actions:Array<ClientAction> = [
        new ClientAction(this),
        new ClientAction(this),
        new ClientAction(this),
        new ClientAction(this) 
    ]; 


    //combat display vars -----------------------------
    public defaultX:number = 0;
    public defaultY:number = 0;

    //graphical vars -----------------------------
    public sprite:ClientCharSprite = new ClientCharSprite();
    public dir:number = 1; 
    loaded:boolean = false; 

    //begin actual code - constructor -----------------------------
    constructor (public engine:gameEngine,public x:number = 0,public y:number = 0,public depth:number = 0,public team = -1){
        super(engine,x,y,depth);
        this.sprite.generateSpriteSheet(this);

    }


    //drawFunction - called by client match, not by engine -----------------------------
    drawFunction = (context:CanvasRenderingContext2D) => {

        if (this.sprite.loaded)
        { 
            context.drawImage(this.sprite.imageElem,640-this.x-64,this.y,64,64);
        }

    }

    //resetStats - called to determine stats according to character Data
    resetStats = () => { 
            const   shape1 = DATA.shapesRecord[this.shapesList[0]];     
            const   shape2 = DATA.shapesRecord[this.shapesList[1]];     
            const   aspect1 = DATA.aspectsRecord[this.aspectsList[0]];  
            let     aspect2 = DATA.aspectsRecord[this.aspectsList[0]];  
            
            if (this.aspectsList.length > 1)
                {
                    if (this.aspectsList[0] === this.aspectsList[1])
                        {
                            this.aspectsList.splice(1,1);
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
    }

    //



}