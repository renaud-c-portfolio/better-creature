import { ClientCreature } from './ClientCreature.ts';
import * as DATA from './Data.ts';

 

export class ClientAction {

    name:string = "default action"+String(Math.floor(Math.random()*1000));
    description:string = "basic attack";

    actionType:DATA.actionType = "physical";
    targetType:DATA.targetType = "single"; 
    actionAspect:DATA.aspectsType = "fire"; 
     
    priority:number = 0;
    basePower:number = 10;
     
    targetList:Array<ClientCreature> = [];

    constructor(user:ClientCreature) { 
        
    }

    rebuildAction = () => {
        
    }


}