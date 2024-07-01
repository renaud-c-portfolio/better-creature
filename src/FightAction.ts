import CreatureChar from "./CreatureChar";
import { FightEvent,EffectFightMessage } from "./FightEvent";
import FightMatch from "./FightMatch";

export type ACTIONT = "physical" | "magic" | "powerup" | "debuff" | "protect" | "curse" | "special" | "switch";
export type TARGETT = "single" | "double" | "aoe" | "self" | "ally" | "front" | "diagonal";

const tempNames:Array<string> = ["slash","bash","gash","fire","ash","clash","crush","pincer","claw","zap","needle","bite","light","heavy","banana","destruction","laser","breath","sever"];

export class FightAction { 

    
    name:string = "default action"+String(Math.floor(Math.random()*1000));
    actionType:ACTIONT = "physical";
    targetType:TARGETT = "single";
    priority:number = 0;
    power:number = 0;
    statusEffect:string = "";
    statusPower:number = 0; 
    otherEffects:object = {}; 
    actionParts:Array<any> = [];

    remainingUses:number = -1;

    constructor(user:CreatureChar) {
        let random1 = tempNames[Math.floor(Math.random()*tempNames.length)];
        let random2 = tempNames[Math.floor(Math.random()*tempNames.length)];
        this.name = random1 + " " + random2;
    }
 
    generateEvent = (fightMatch:FightMatch,user:CreatureChar) =>{

        const newEvent = new FightEvent(fightMatch,[]);
        newEvent.eventEffects.push(new EffectFightMessage(fightMatch,user.name+" uses "+this.name+"!"));
        newEvent.user = user;
        newEvent.eventSpeed = user.speed;

        return newEvent;
    }
    
     

}

export class SwitchAction extends FightAction {

    constructor(user:CreatureChar) {
        super(user); 
    }

}

export class ProtectAction extends FightAction {

    constructor(user:CreatureChar) {
        super(user);
        this.remainingUses = 1;
    }

}