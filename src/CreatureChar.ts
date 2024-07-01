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
import { FightEvent } from "./FightEvent";
import FightMatch from "./FightMatch";


export class CreatureChar extends GameElement {

    public name:string = "animal" + String(Math.floor(Math.random()*1000)); 
    public dir:number = 1;
    public defaultX:number = 0;
    public defaultY:number = 0;

    public HP:number = 100;
    public maxHP:number = 100; 
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


    drawFunction = (_context:CanvasRenderingContext2D) => {
        if (this.loaded)
            {
                _context.save();
                //_context.drawImage(this.imageElem,this.x+64,this.y,64,64);
                if (this.dir == -1)
                { 
                    _context.translate(640, 0);
                    _context.scale(-1, 1);
                    _context.drawImage(this.imageElem,640-this.x-64,this.y,64,64);
                } 
                else{_context.drawImage(this.imageElem,this.x,this.y,64,64);} 
                _context.restore();


            }

    }

    makeEventFromAction = (currentMatch:FightMatch,actionNumber:number) =>{ 
        const currentAction = this.actions[actionNumber];  
        const newEvent = currentAction.generateEvent(currentMatch,this);  
        return newEvent;
    }




}


export default CreatureChar