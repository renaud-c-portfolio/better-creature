import GameEngine from "./GameEngine";
export class GameElement {

      
    sprite:string = "";

    isSpriteList:boolean = false;


    constructor (public engine:GameEngine,public x:number = 0,public y:number = 0,public depth:number = 0) {
        
    }

    drawFunction = (context:CanvasRenderingContext2D) => {
        
    }
    
}
 