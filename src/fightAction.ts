export type ACTIONT = "physical" | "magic" | "powerup" | "debuff" | "protect" | "curse" | "special"
export type TARGETT = "single" | "double" | "aoe"

export class fightAction { 

    
    actionType:ACTIONT = "physical";
    targetType:TARGETT = "single";
    priority:number = 0;
    power:number = 0;
    statusEffect:string = "";
    statusPower:number = 0; 
    otherEffects:object = {};

    actionParts:Array<any> = [];

    constructor() {
        
    }

    preTurnAction = () => {
        
    }

    executeAction = () => {

    }
   
    postTurnAction = () => {

    }

     

    generateTypesAction = () =>{

    }
     
}
 
 