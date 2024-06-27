import { FightAction } from "./FightAction";
import CreatureChar from "./CreatureChar";
import gameEngine from "./gameEngine";
import FightMatch from "./FightMatch";





export class FightEvent { 
     
    public name:string = "default event";
    public user:null|CreatureChar = null;
    public referenceAction:null|FightAction = null;
    public eventOver:boolean = false; 

    public eventEffects:Array<any> = [];
    public effectIndex:number = 0;

    public totalTime:number = 0;
    public effectTime:number = 0;


    constructor(public match:FightMatch) {
         
    }

    EDealDamage = () => {
         console.log("first test"); 

    }

    EActionMessage = () =>{
        console.log("2nd test"); 
        this.match.actionsMessage = "testing action message"; 
    }

    public effect:Function = this.EDealDamage;

    ExecuteEvent = () => {
        if (this.eventEffects.length > 0)
            {
                const currentEffect = this.eventEffects[this.effectIndex];  
                currentEffect();
                this.eventOver = true;
                 
            }
        else
            {
                this.eventOver = true;
            }
    }

    
    
}

export class EventMessage extends FightEvent {
    constructor(match:FightMatch){
        super(match);
        this.eventEffects.push(this.EActionMessage);
    }
}