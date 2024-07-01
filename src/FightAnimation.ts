import GameElement from "./GameElement";
import GameEngine from "./GameEngine";


export class CreatureChar extends GameElement {

    constructor (public engine:GameEngine,public x:number = 0,public y:number = 0,public depth:number = 0)
    {
        super(engine,x,y,depth);

    }

}
