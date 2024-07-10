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
import { FightAction } from "./FightAction"; 
import FightMatch from "./FightMatch";


export class CreatureChar extends GameElement {

    public name:string = "animal" + String(Math.floor(Math.random()*1000)); 
    public dir:number = 1;
    public defaultX:number = 0;
    public defaultY:number = 0;

    public HP:number = 100;
    public maxHP:number = 100; 
    public damaged:number = 0;

    public dodgePoint: number = 1;
    public dodgeMax: number = 1;


    public muscle:number = 10;
    public magic:number = 10;
    public armor:number = 1;
    public resistance:number = 1;
    public speed:number = 5;

    public turnOver:boolean = false;

    actions:Array<FightAction> = [
        new FightAction(this),
        new FightAction(this),
        new FightAction(this),
        new FightAction(this) 
    ];

    animations:Array<any> = [];
    flash:number = 0;
    flashColor:string = "white";

    displayLifebar = false;
    displayExtraTimer = 0;


    
    //protect1:fightAction = null;
    types:Array<monsType> = [];
    shapes:Array<shape> = [];
    loaded:boolean = false;

    tempUrlArray:Array<any> = [crambUrl,mashUrl,hydraUrl,nekoUrl,centiUrl,sharkyUrl,melonUrl];
 
    imageElem:HTMLImageElement = document.createElement("img");  

    constructor (public engine:gameEngine,public x:number = 0,public y:number = 0,public depth:number = 0,public type1:MTYPE,public type2:MTYPE,public shape1:MSHAPE,public shape2:MSHAPE,public team = -1){
        super(engine,x,y,depth)
        var _rando = Math.floor(Math.random()*this.tempUrlArray.length);
        this.imageElem.src = this.tempUrlArray[_rando];

        this.imageElem.onload = () => { 
            this.loaded = true;
          }

        this.speed = Math.floor(Math.random()*9);


    }


    drawFunction = (context:CanvasRenderingContext2D) => {
        if (this.loaded)
            { 
                for (let i = this.animations.length-2; i >=0 ; i = i-2)
                { 
                     const animType = this.animations[i];
                     switch (animType)
                     {
                        case "flash": 
                         context.filter = "contrast(0) sepia(100%) hue-rotate(116deg) brightness(2.4) saturate(0.28) opacity("+String(this.animations[i+1]/30*100)+"%)";
                        break;
                        default:  
                     }
                     this.animations[i+1] -= 1;
                     if (this.animations[i+1] <= 0)
                     {
                        
                     } 
                } 
                
                context.save();
                //_context.drawImage(this.imageElem,this.x+64,this.y,64,64);
                if (this.dir == -1)
                { 
                    context.translate(640, 0);
                    context.scale(-1, 1);
                    if (this.animations.length > 0){ context.drawImage(this.imageElem,640-this.x-64,this.y,64,64); }
                    context.filter = "none"; 
                    context.drawImage(this.imageElem,640-this.x-64,this.y,64,64);
                } 
                else{
                    if (this.animations.length > 0){ context.drawImage(this.imageElem,this.x,this.y,64,64); }
                    context.filter = "none"; 
                    context.drawImage(this.imageElem,this.x,this.y,64,64);
                } 
                context.restore();
                context.filter = "none";
                

            }
            if (this.damaged > 0 || this.displayExtraTimer > 0)
            {
                this.displayLifebar = true;
                if (this.displayExtraTimer > 0) {this.displayExtraTimer -= 1; if (this.displayExtraTimer <= 0) {this.displayLifebar=false;}}
            }

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
                    context.fillRect(this.x-12+hpRatio,this.y+72,this.damaged,5); 
                    this.damaged -= 0.5;
                    if (this.damaged <= 0){this.displayLifebar=false; this.displayExtraTimer = 30;}
                }
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




}


export default CreatureChar