import gameElement from "./gameElement";
import { monsType, MTYPE } from "./game/types/monsType";
import { shape, MSHAPE } from "./game/shapes/shapes"; 
import gameEngine from "./gameEngine";

import crambUrl from "./gfx/quadtopus.png";
import mashUrl from "./gfx/mashroom.png";
import hydraUrl from "./gfx/hydrr.png";
import nekoUrl from "./gfx/evil_neko.png";
import centiUrl from "./gfx/centip.png";
import sharkyUrl from "./gfx/sharky.png";
import melonUrl from "./gfx/watermelone.png";
import { fightAction } from "./fightAction";


export class creatureChar extends gameElement {

    public name:string = "animal" + String(Math.floor(Math.random()*1000));

    public HP:number = 100;
    public maxHP:number = 100; 
    public dodgePoint: number = 1;
    public dodgeMax: number = 1;

    public dir:number = 1;

    muscle:number = 10;
    magic:number = 10;
    armor:number = 1;
    resistance:number = 1;
    speed:number = 5;

    actions:Array<any> = [];
    
    //protect1:fightAction = null;
    types:Array<monsType> = [];
    shapes:Array<shape> = [];
    loaded:boolean = false;

    tempUrlArray:Array<any> = [crambUrl,mashUrl,hydraUrl,nekoUrl,centiUrl,sharkyUrl,melonUrl];
 
    imageElem:HTMLImageElement = document.createElement("img");  

    constructor (public engine:gameEngine,public x:number = 0,public y:number = 0,public depth:number = 0,public type1:MTYPE,public type2:MTYPE,public shape1:MSHAPE,public shape2:MSHAPE){
        super(engine,x,y,depth)
        var _rando = Math.floor(Math.random()*this.tempUrlArray.length);
        this.imageElem.src = this.tempUrlArray[_rando];

        this.imageElem.onload = () => { 
            this.loaded = true;
          }


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




}


export default creatureChar