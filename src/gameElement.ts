import gameEngine from "./gameEngine";
class gameElement {

      
    sprite:string = "";

    isSpriteList:boolean = false;


    constructor (public engine:gameEngine,public x:number = 0,public y:number = 0,public depth:number = 0) {
        
    }

    drawFunction = (context:CanvasRenderingContext2D) => {
        
    }
    
}

export default gameElement