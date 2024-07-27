import GameElement from "./GameElement";
import { monsType, MTYPE } from "./game/types/monsType";
import { shape, MSHAPE } from "./game/shapes/shapes"; 
import gameEngine from "./GameEngine";

import crambUrl from "./gfx/quadtopus.png";
import mashUrl from "./gfx/mashroom.png";
import hydraUrl from "./gfx/hydrr.png";
import nekoUrl from "./gfx/evil_neko.png";
import centiUrl from "./gfx/centip.png";
import sharkyUrl from "./gfx/sharky.png";
import melonUrl from "./gfx/watermelone.png";
import treeUrl from "./gfx/heaven-tree.png";
import { FightAction } from "./FightAction"; 
import FightMatch from "./FightMatch";

import * as DATA from './Data.ts';


export class CreatureChar extends GameElement {

    public name:string = "animal" + String(Math.floor(Math.random()*100)); 
    public dir:number = 1;
    public defaultX:number = 0;
    public defaultY:number = 0;

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

    tempUrlArray:Array<any> = [crambUrl,mashUrl,hydraUrl,nekoUrl,centiUrl,sharkyUrl,melonUrl,treeUrl];
 
    imageElem:HTMLImageElement = document.createElement("img");  
    imageAlpha:number = 1;

    constructor (public engine:gameEngine,public x:number = 0,public y:number = 0,public depth:number = 0,public team = -1){
        super(engine,x,y,depth)
        let rando = Math.floor(Math.random()*this.tempUrlArray.length);
        this.imageElem.src = this.tempUrlArray[rando];

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
        const shape1 = DATA.shapesMap.get(this.shapes[0]);
        const shape2 = DATA.shapesMap.get(this.shapes[1]);
        const aspect1 = DATA.aspectsMap.get(this.aspectTypes[0]);

        this.maxHP = shape1.baseHP + shape2.baseHP;
        if (this.statPlus[0] === 1) {this.maxHP *= 1.10; this.maxHP+=10}
        else if (this.statPlus[0] === 2) {this.maxHP *= 1.23; this.maxHP+=20}
        this.maxHP = Math.round(this.maxHP/4+10);
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




}


export default CreatureChar