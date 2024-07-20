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
    targetList:Array<CreatureChar> = [];
    switchTarget:CreatureChar|null = null;


    otherEffects:object = {};  

    actionEffects:Array<Array<string>> = [["fightMessage","@sametime@user uses @name on @target"],["createAnim","target"], ["flashChar","30","white","target"], ["physicalAttack","target"],["wait"],["fightMessage2","@total damage!"],["wait"]];
    actionEffectTimers:Array<number> = [20,5,2,2,10,5,120];
    effectIndex:number = 0; 
    eventOver = false; 
    eventSpeed:number = 0;
    eventPriority:number = 0;

    canSwitchFaintedTarget:boolean = true;

    isSwitchAction:boolean = false;
    isProtectAction:boolean = false;
    isCancelled:boolean = false;

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
        if (this.isCancelled === true)
            {
                this.eventOver = true
            }
        else if (this.actionEffects.length > 0)
            {
                if (this.effectIndex < this.actionEffects.length)
                {
                    const currentEffect = this.actionEffects[this.effectIndex];  
                    let targetChar = fightMatch.getCharFromNumber(this.currentTarget);
                    let message = "";

                    switch (currentEffect[0])
                    {
                        case "fightMessage":
                             message = this.parseText(currentEffect[1],fightMatch);
                            fightMatch.actionsMessage = message;
                        break;
                        case "fightMessage2":
                             message = this.parseText(currentEffect[1],fightMatch);
                            fightMatch.actionsMessage2 = message;
                        break;
                        case "createAnim":
                            targetChar = fightMatch.getCharFromNumber(this.currentTarget);
                            fightMatch.createAnim(targetChar.x,targetChar.y);
                        break;
                        case "flashChar":
                            if (currentEffect[3] === "self"){targetChar = this.user; console.log("hey!flash",parseInt(currentEffect[1]))}
                            else if (currentEffect[3] === "switch" && this.switchTarget != null){targetChar = this.switchTarget;}
                            else if (currentEffect[3] === "list")
                            {
                                let timing = this.actionEffectTimers[this.effectIndex];
                                if (timing > this.targetList.length-1) {timing -= this.targetList.length}
                                targetChar = this.targetList[timing];
                            }
                            targetChar.flash = parseInt(currentEffect[1])*1.2; 
                            console.log(targetChar.flash);
                            targetChar.flashMax = parseInt(currentEffect[1]);
                            targetChar.flashColor = currentEffect[2];
                            targetChar.flashType = "normal";

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
                        case "switchAction":
                            if (this.actionEffectTimers[this.effectIndex] === 1)
                                { 
                                    if (this.switchTarget != null)
                                        {
                                            this.switchTarget.activeSlot = this.user.activeSlot;
                                            this.user.activeSlot = -1;
                                            this.switchTarget.x = this.user.x;
                                            this.switchTarget.y = this.user.y;
                                            fightMatch.activeChars[this.user.team][this.switchTarget.activeSlot] = this.switchTarget;
                                        }
                                    
                                }
                             
                        break;
                        case "faintedSwitchAction":
                            message = "@playeuser sends out ";
                            let numSend = 0; 
                                 for (let i=0; i < this.targetList.length; i++)
                                    {
                                        let currentSend = this.targetList[i];  
                                        if (currentSend != fightMatch.environment)
                                        {
                                            fightMatch.activeChars[this.user.team][i] = currentSend;
                                            currentSend.activeSlot = i;
                                            currentSend.x = fightMatch.defaultPos[this.user.team][0+i*2];
                                            currentSend.y = fightMatch.defaultPos[this.user.team][1+i*2];
                                            if (numSend > 0 && i === this.targetList.length-1)
                                            {
                                                message += " and "
                                            }
                                            else if (numSend > 0)
                                            {
                                                message += ", "
                                            }
                                            numSend+= 1;
                                            message += currentSend.name;
                                        } 
                                    }
                                    message +="!";
                                    if (this.user.team === 0)
                                    {fightMatch.actionsMessage = this.parseText(message,fightMatch);}
                                    else {fightMatch.actionsMessage2 = this.parseText(message,fightMatch);}

                        break;
                        case "switchMenu":
                             
                        break;
                        case "faintAction":
                            message = "";
                            if (this.actionEffectTimers[this.effectIndex] === 1)
                                { 
                                    for (let i=0; i < this.targetList.length; i++)
                                        {
                                            let currentFaint = this.targetList[i]; 
                                            currentFaint.fainting = 1;
                                            if (i > 0 && i === this.targetList.length-1)
                                            {
                                                message += " and "
                                            }
                                            else if (i > 0)
                                            {
                                                message += ", "
                                            }
                                            message += currentFaint.name;
                                        }
                                    if (this.targetList.length === 1) {message += " is defeated!"}
                                    else {message+= " are defeated!"}

                                    fightMatch.actionsMessage = message;
                                    fightMatch.actionsMessage2 = "";
                                }
                                
                        break;
                        case "fightEndAction":
                                message += fightMatch.playerNames[this.currentTarget] + " wins!";
                                fightMatch.actionsMessage = message;
                                fightMatch.actionsMessage2 = "";
                        break;
                        case "matchStartSend":
                                 message = "@playeuser sends out ";
                                 for (let i=0; i < this.targetList.length; i++)
                                    {
                                        let currentSend = this.targetList[i];  
                                        if (currentSend != null)
                                        {
                                            fightMatch.activeChars[this.user.team][i] = currentSend;
                                            currentSend.activeSlot = i;
                                            currentSend.x = fightMatch.defaultPos[this.user.team][0+i*2];
                                            currentSend.y = fightMatch.defaultPos[this.user.team][1+i*2];
                                            if (i > 0 && i === this.targetList.length-1)
                                            {
                                                message += " and "
                                            }
                                            else if (i > 0)
                                            {
                                                message += ", "
                                            }
                                            message += currentSend.name;
                                        } 
                                    }
                                    message +="!";
                                    if (this.user.team === 0)
                                    {fightMatch.actionsMessage = this.parseText(message,fightMatch);}
                                    else {fightMatch.actionsMessage2 = this.parseText(message,fightMatch);}
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
 
        if (tempString.indexOf("@") != -1)
            {
                tempString = tempString.replace("@user",this.user.name);
                tempString = tempString.replace("@name",this.name); 
                tempString = tempString.replace("@target",fightMatch.getCharFromNumber(this.currentTarget).name);
                tempString = tempString.replace("@total",String(this.totalDamage));
                tempString = tempString.replace("@playeuser",fightMatch.getPlayerNameFromNumber(this.user.team)); 
                if (this.eventSpeed === fightMatch.prevSpeed && this.eventPriority === fightMatch.prevPriority) {tempString = tempString.replace("@sametime","at the same time, ");}
                else {tempString = tempString.replace("@sametime","");}
                if (this.isSwitchAction && this.switchTarget != null)  { tempString = tempString.replace("@switchtarget",this.switchTarget.name); }
            } 
        return tempString;
    }
 
}



export class SwitchAction extends FightAction {

    constructor(user:CreatureChar) {
        super(user); 
         
        this.isSwitchAction = true;
        this.actionEffects = [];
        this.actionEffects = [["fightMessage","@playeuser switches @user with @switchtarget!"], ["flashChar","-20","white","self"],["wait"],["switchAction"],["flashChar","10","white","switch"],["wait"]];
        this.actionEffectTimers = [20,2,20,2,2,90];
        this.priority = 9999;
        this.eventPriority = 9999;
    }

}

export class FaintSwitchAction extends FightAction {

    constructor(user:CreatureChar) {
        super(user); 
         
        this.isSwitchAction = true;
        this.actionEffects = [];
        this.actionEffects = [["faintedSwitchAction"], ["flashChar","10","white","list"],["wait"]];
        this.actionEffectTimers = [20,2,20,2,2,90];
        this.priority = 9999;
        this.eventPriority = 9999;
        this.eventSpeed = 0.5;
    }

}

export class MatchStartSendAction extends FightAction {

    constructor(user:CreatureChar) {
        super(user); 
         
        this.isSwitchAction = true;
        this.actionEffects = [];
        this.actionEffects = [["matchStartSend"], ["flashChar","10","white","list"],["wait"]];
        this.actionEffectTimers = [2,3,90];
        this.priority = 9999;
        this.eventPriority = 9999;
        this.eventSpeed = 0.5;
    }

}

export class ProtectAction extends FightAction {

    constructor(user:CreatureChar) {
        super(user);
        this.remainingUses = 1;
    } 

}

export class FaintAction extends FightAction {
    constructor(user:CreatureChar) {
        super(user); 
        this.actionEffects = [];
        this.actionEffects = [["faintAction"], ["wait"]];
        this.actionEffectTimers = [2,200];
    } 
     
}

export class FightEndAction extends FightAction {
    constructor(user:CreatureChar) {
        super(user); 
        this.actionEffects = [];
        this.actionEffects = [["fightEndAction"], ["wait"]];
        this.actionEffectTimers = [2,9999];
        this.eventSpeed = 0.5;
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







