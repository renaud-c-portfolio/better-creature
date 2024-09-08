import GameEngine from "./GameEngine";
class GameElement { 

    isSpriteList:boolean = false;


    constructor (public engine:GameEngine,public x:number = 0,public y:number = 0,public depth:number = 0) {
        
    }

    drawFunction = (context:CanvasRenderingContext2D) => {
        
    }
    
}

export default GameElement