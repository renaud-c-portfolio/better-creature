import CreatureChar from "./CreatureChar";
import { FightEvent } from "./FightEvent";
import FightMatch from "./FightMatch";

export type ACTIONT = "physical" | "magic" | "powerup" | "debuff" | "protect" | "curse" | "special" | "switch";
export type TARGETT = "single" | "double" | "aoe" | "self" | "ally" | "front" | "diagonal" | "other";

const tempNames:Array<string> = ["slash","bash","gash","fire","ash","clash","crush","pincer","claw","zap","needle","bite","light","heavy","banana","destruction","laser","breath","sever"];

export class FightAction { 

    
    name:string = "default action"+String(Math.floor(Math.random()*1000));
    actionType:ACTIONT = "physical";
    targetType:TARGETT = "single";
    priority:number = 0;
    power:number = 1+Math.random()*20;
    public moddedPower = 0;
    statusEffect:string = "";
    statusPower:number = 0; 

    currentTarget:number = 0;


    otherEffects:object = {};  

    actionEffects:Array<Array<string>> = [["fightMessage","@user uses @name on @target"],["createAnim","target"], ["flashChar"], ["physicalAttack","target"],["wait"],["fightMessage2","@total damage!"],["wait"]];
    actionEffectTimers:Array<number> = [20,5,2,2,10,5,120];
    effectIndex:number = 0; 
    eventOver = false; 
    eventSpeed:number = 0;
    eventPriority:number = 0;

    remainingUses:number = -1;

    totalDamage = 0;

    constructor(public user:CreatureChar) {
        let random1 = tempNames[Math.floor(Math.random()*tempNames.length)];
        let random2 = tempNames[Math.floor(Math.random()*tempNames.length)];
        this.name = random1 + " " + random2;
    }
 
    generateEvent = (user:CreatureChar) =>{ 

        const newEvent = new FightAction(user); 
        
        newEvent.name = this.name;
        newEvent.actionType = this.actionType;
        newEvent.priority = this.priority;
        newEvent.eventPriority = this.priority;
        newEvent.power = this.power;
        newEvent.eventSpeed = user.speed;
        newEvent.moddedPower = this.power;

        //newEvent.target = 0;

         newEvent.actionEffects = structuredClone(this.actionEffects);
         newEvent.actionEffectTimers = [...this.actionEffectTimers];
        return newEvent;
    }  

    ExecuteEvent = (fightMatch:FightMatch) => {
        if (this.actionEffects.length > 0)
            {
                if (this.effectIndex < this.actionEffects.length)
                {
                    const currentEffect = this.actionEffects[this.effectIndex];  
                    let targetChar = fightMatch.getCharFromNumber(this.currentTarget);
                    let message = "";

                    switch (currentEffect[0])
                    {
                        case "fightMessage":
                             message = this.parseText(this.actionEffects[this.effectIndex][1],fightMatch);
                            fightMatch.actionsMessage = message;
                        break;
                        case "fightMessage2":
                             message = this.parseText(this.actionEffects[this.effectIndex][1],fightMatch);
                            fightMatch.actionsMessage2 = message;
                        break;
                        case "createAnim":
                            targetChar = fightMatch.getCharFromNumber(this.currentTarget);
                            fightMatch.createAnim(targetChar.x,targetChar.y);
                        break;
                        case "flashChar":
                            targetChar.flash = 30;
                            targetChar.flashMax = 30;
                            targetChar.flashColor = "white";
                            targetChar.flashType = "normal";

                        break;
                        case "targetAnim":
                            if (this.actionEffectTimers[this.effectIndex] === 1)
                            {
                                console.log("cat")
                                targetChar = fightMatch.getCharFromNumber(this.currentTarget);
                                targetChar.animations.push("flash");
                                targetChar.animations.push(30);
                            }
                        break;
                        case "physicalAttack":
                            if (this.actionEffectTimers[this.effectIndex] === 1)
                            {
                                targetChar = fightMatch.getCharFromNumber(this.currentTarget);

                                let finalDamage = Math.round((this.power*this.user.muscle/10) - targetChar.armor);
                                if (finalDamage < 0){finalDamage = 0};
                                targetChar.damaged += finalDamage;
                                targetChar.HP -= finalDamage;
                                this.totalDamage += finalDamage;
                            } 
                        break;
                        case "magicAttack":
                         
                        break;
                        case "wait":
                            
                        break;
                    }
                    
                    this.actionEffectTimers[this.effectIndex] -= 1; 
                    if (this.actionEffectTimers[this.effectIndex] <= 0)
                    {
                        this.effectIndex += 1;
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


    parseText = (text:string,fightMatch:FightMatch) => {
        let tempString = text;
        let newString = "";

        //$U:user, $A:action name, $T:target
        if (tempString.indexOf("@") != -1)
            {
                tempString = tempString.replace("@user",this.user.name);
                tempString = tempString.replace("@name",this.name); 
                tempString = tempString.replace("@target",fightMatch.getCharFromNumber(this.currentTarget).name);
                tempString = tempString.replace("@total",String(this.totalDamage));
                tempString = tempString.replace("@",""); 
            } 
        return tempString;
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
 

/*
class ActionEffect {  

    public timer:number = 0;
    public duration:number = 120;
    public effectOver:boolean = false;

    public source:CreatureChar|null = null;
    public target:CreatureChar|null = null;


    constructor(public fightMatch:FightMatch){ 
        
    }

    public ExecuteEffect = () => { 
        
    }

    public fightMessage = () => {

    }

}

class EffectFightMessage extends ActionEffect {

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

class EffectCreateAnim extends ActionEffect {
    constructor(fightMatch:FightMatch,public animX:number,public animY:number){ 
        super(fightMatch);
    }

    override ExecuteEffect = () => { 
        const newAnim = this.fightMatch.createAnim(this.animX,this.animY);  
    }
}

class EffectPhysicalAttack extends ActionEffect {
    constructor(fightMatch:FightMatch){ 
        super(fightMatch);
    }  
} */







