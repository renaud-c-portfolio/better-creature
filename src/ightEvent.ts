import { FightAction } from "./FightAction";
import CreatureChar from "./CreatureChar";
import gameEngine from "./gameEngine";
import { FightMatch } from "./FightMatch";



export type EventType = "actionMessage" | "dealDamage"

export class FightEvent { 
     
    public name:string = "default event";
    public user:null|CreatureChar = null;
    public referenceAction:null|FightAction = null;
    public eventOver:boolean = false; 
 
    public effectIndex:number = 0;

    public eventSpeed:number = 0;
    public eventPriority:number = 0;

    public totalTime:number = 0;
    public effectTime:number = 0;
     

     
     
     
    constructor(public match:FightMatch, public eventEffects:Array<any>) {
         
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
                if (this.effectIndex < this.eventEffects.length)
                {
                    const currentEffect = this.eventEffects[this.effectIndex];  
                    currentEffect.ExecuteEffect();
                    if (currentEffect.effectOver)
                    {
                        this.effectIndex += 1;
                        //todo prolly destroy the effect or smth
                    }
                }
                else
                {
                    this.eventOver = true;
                }
                
                 
            }
        else
            {
                this.eventOver = true; 
            }
            
    }

    
    
} 


export class EventEffect {  

    public timer:number = 0;
    public duration:number = 120;
    public effectOver:boolean = false;

    constructor(public fightMatch:FightMatch){ 
     
    }

    public ExecuteEffect = () => {
        

    }

}

export class EffectFightMessage extends EventEffect {

    constructor(fightMatch:FightMatch,public message:string){ 
        super(fightMatch);
         
    }

     override ExecuteEffect = () => {  
        console.log("timer:",this.timer)
        this.fightMatch.actionsMessage = this.message;
        this.timer += 1;
        if (this.timer > this.duration)
        {
            this.effectOver = true;
        }
     };
}