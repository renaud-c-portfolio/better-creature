import gameElement from "./gameElement";
import gameEngine from "./gameEngine";


export class CreatureChar extends gameElement {

    constructor (public engine:gameEngine,public x:number = 0,public y:number = 0,public depth:number = 0,public type1:MTYPE,public type2:MTYPE,public shape1:MSHAPE,public shape2:MSHAPE,public team = -1)
    {
        super(engine,x,y,depth);

    }

}
