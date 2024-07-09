import GameButton from "./GameButton";
import CreatureChar from "./CreatureChar";
import GameElement from "./GameElement";


import selectUrl from "./gfx/selector.png";
import targetUrl from "./gfx/targettersheet.png";

import { monsType, MTYPE } from "./game/types/monsType";
import { shape, MSHAPE } from "./game/shapes/shapes"; 
import { FightAction, ACTIONT, TARGETT } from "./FightAction";
import GameEngine from "./GameEngine";
import { FightAnimation } from "./FightAnimation"; 


type MultiMode = "cpu" | "local" | "online";
type FightPhase = "start" | "choice" | "turnStart" | "actions" | "turnEnd" | "combatEnd";


export type EffectType = "actionMessage" | "dealDamage" | "createAnim"


export class FightMatch extends GameElement {

    multiMode:MultiMode = "cpu";

    fightPhase:FightPhase = "choice"; 

    currentTurn:number = 0;
    choicePhase = 0;
    choiceConfirmed = false;
    choiceDepth = 0;
    imgLoaded:number = 0;
    imgLoadedMax:number = 1;

    localPlayer = 0;

    
    party:Array<Array<CreatureChar>> = []; 
    activeChars:Array<Array<CreatureChar>> = [[],[]]; 
    currentChar:CreatureChar|null = null;

    totalTeams:number = 2;
    charsPerTeam:number = 2;
    
    playerChoices:Array<any> = [[-1,-1,-1,-1],[-1,-1,-1,-1]];
    
    selectImg:HTMLImageElement = document.createElement("img");   
    targetImg:HTMLImageElement = document.createElement("img");   
    time:number = 0;

    targetting:TARGETT|null = null; 
    currentAction:FightAction|null = null;

    choiceMessage:string = "";
    actionsMessage:string = "actions message";

    spriteCanvas:HTMLCanvasElement;
    spriteContext:CanvasRenderingContext2D;

    speedsList:Array<number> = [];
    eventsList:Array<any> = [];
    interruptsList:Array<any> = [];
    eventIndex:number = 0;

    animationsList:Array<GameElement> = [];

    currentActionSpeed:number = 0;
    speedIndex:number = 0;

    

    constructor(public engine:GameEngine,public x:number = 0,public y:number = 0,public depth:number = 0){
        super(engine,x,y,depth); 
        const spriteCanvasElement = document.createElement("canvas");;
        this.spriteCanvas = spriteCanvasElement; 
        const spriteContexter = this.spriteCanvas.getContext('2d');
        console.log("context",spriteContexter);
        if (spriteContexter != null)
            {
                this.spriteContext =  spriteContexter;
            }
            else
            {
                this.spriteContext = engine.context;
            }
        this.selectImg.src = selectUrl;
        this.targetImg.src = targetUrl;

        this.selectImg.onload = () => { 
            this.imgLoaded += 1;
          }
          
    }

    


    actionButtons = [
        new GameButton(this.engine,26,246,140,40,"action1",0),
        new GameButton(this.engine,176,246,140,40,"action2",0),
        new GameButton(this.engine,326,246,140,40,"action3",0),
        new GameButton(this.engine,476,246,140,40,"action4",0)

    ];

    protectButtons = [new GameButton(this.engine,356,300,100,40,"protect1",0),
    new GameButton(this.engine,486,300,100,40,"protect2",0)];

    switchButtons = [
        new GameButton(this.engine,66,296,54,54,"switch",0,"labeledImage"),
        new GameButton(this.engine,136,296,54,54,"switch",0,"labeledImage"),
        new GameButton(this.engine,206,296,54,54,"switch",0,"labeledImage"),
        new GameButton(this.engine,276,296,54,54,"switch",0,"labeledImage")
    ];

    confirmButton = new GameButton(this.engine,326,246,140,40,"confirm",0);
    cancelButton = new GameButton(this.engine,26,246,140,40,"cancel",0);
    backButton = new GameButton(this.engine,12,296,40,54,"back",0);
    
    defaultParty = () =>{

        const _parties = this.party; 
        _parties[0] = [];
        _parties[0] = [
            new CreatureChar(this.engine,100,30,0,"fae","steel","beetle","crawler",0),
            new CreatureChar(this.engine,50,120,0,"fae","steel","beetle","crawler",0),
            new CreatureChar(this.engine,0,0,0,"fae","steel","beetle","crawler",0),
            new CreatureChar(this.engine,0,0,0,"fae","steel","beetle","crawler",0),
            new CreatureChar(this.engine,0,0,0,"fae","steel","beetle","crawler",0),
            new CreatureChar(this.engine,0,0,0,"fae","steel","beetle","crawler",0),
        ];
        this.activeChars[0][0] = _parties[0][0];
        this.activeChars[0][1] = _parties[0][1];
        _parties[1] = [
            new CreatureChar(this.engine,640-100-64,30,0,"fae","steel","beetle","crawler",1),
            new CreatureChar(this.engine,640-50-64,120,0,"fae","steel","beetle","crawler",1),
            new CreatureChar(this.engine,0,0,0,"fae","steel","beetle","crawler",1),
            new CreatureChar(this.engine,0,0,0,"fae","steel","beetle","crawler",1),
            new CreatureChar(this.engine,0,0,0,"fae","steel","beetle","crawler",1),
            new CreatureChar(this.engine,0,0,0,"fae","steel","beetle","crawler",1),
        ];

        this.activeChars[1][0] = _parties[1][0];
        this.activeChars[1][1] = _parties[1][1];
        this.currentChar = this.activeChars[0][0];
        

    }
    

    combatLoop = () => {

        switch (this.fightPhase){
            case "start":
                 
            break;
            case "choice":
                 
            break;
        }

    }


    charActionText = (teamIndex:number,charIndex:number) => {
        const actionNumber = this.playerChoices[teamIndex][charIndex*2];
        const char = this.activeChars[teamIndex][charIndex];
        let outputString = "";
        if (char === null)
            {
                 
            }
        else
        {
            outputString += char.name;
            if (actionNumber === -1)
                {
                    outputString+= " can't do anything";
                }
                else if (actionNumber < 4)
                {
                    let otherAction = this.activeChars[teamIndex][charIndex].actions[this.playerChoices[teamIndex][charIndex*2]];
                    let otherTarget = this.playerChoices[teamIndex][charIndex*2+1];
                    otherTarget = this.activeChars[Math.floor(otherTarget/this.charsPerTeam)][otherTarget % this.charsPerTeam]; 
                    outputString += " will use " + otherAction.name + " on " + otherTarget.name;
                }
                else if (actionNumber < 6)
                {
                    outputString += " will protect with ";
                }
                else if (actionNumber < 11)
                {
                    outputString += " will switch to ";
                }
        }
        return outputString;
    }

    confirmChoiceFunction = (context:CanvasRenderingContext2D) => {

        for (let i= 0; i < this.charsPerTeam; i++)
            { 
                context.fillStyle = "black"; 
                 context.font = "16px '04b03'";  
                context.fillText(this.charActionText(0,i),40,218+i*20);    
            }

            if (this.choiceConfirmed)
                {
                    
                    this.choiceConfirmed = false; 
                    context.fillStyle = "blue"; 
                    context.fillText("choices confirmed, please wait",70,278); 
                    
                    if (this.multiMode === "cpu")
                        {
                            this.CpuRandom(1);
                            this.fightPhase = "turnStart";
                        }
                    
                }
            else
            {
                this.backButton.drawFunction(context);
                if (this.backButton.clickConfirm > 0)
                {
                    this.backButton.clickConfirm = 0;
                    this.choicePhase -= 1;
                }

                this.confirmButton.drawFunction(context);
                if (this.confirmButton.clickConfirm)
                    {
                        this.targetting = null; 
                        this.confirmButton.clickConfirm = 0; 
                        this.choiceConfirmed = true; 
                    }

                this.cancelButton.drawFunction(context);
                if (this.cancelButton.clickConfirm)
                    {
                        this.targetting = null; 
                        this.choicePhase = 0;
                        this.cancelButton.clickConfirm = 0;
                    }
                if (this.engine.rightClick === 1)
                    {
                        this.choicePhase -= 1;
                        this.targetting = null;
                    }
            } 
        


    }



    targetChoiceFunction = (context:CanvasRenderingContext2D) => {

        context.fillStyle = "black"; 
            context.font = "16px '04b03'";   
            if (this.choicePhase === 1)
                {  
                    context.fillText(this.charActionText(0,0),40,218);  

                    this.backButton.drawFunction(context);
                    if (this.backButton.clickConfirm > 0)
                    {
                        this.backButton.clickConfirm = 0;
                        this.choicePhase -= 1;
                        this.playerChoices[0] = [-1,-1,-1,-1];
                    }
                }
        
        this.spriteCanvas.setAttribute("width","40px"); 
        this.spriteCanvas.setAttribute("height","40px"); 
        let hoveredTarget:CreatureChar|null = null;

        for (let i =0; i < this.totalTeams; i++)
            {
                for (let j =0; j <this.charsPerTeam; j++)
                {
                    const target = this.activeChars[i][j];
                    if (this.currentChar != target)
                    {
                        if (this.engine.MouseInRect(target.x-3,target.y-3,76,76))
                        {
                            document.body.style.cursor = 'pointer';
                            this.spriteContext.clearRect(0,0,999,999);
                            this.spriteContext.drawImage(this.targetImg,0,-40,40,80);  
                            context.drawImage(this.spriteCanvas,target.x-24,target.y-24,120,120);
                            hoveredTarget = target;
                            if (this.engine.leftClick === 1)
                                {
                                    this.playerChoices[0][this.choicePhase*2+1] = i*this.charsPerTeam+j;
                                    this.targetting = null;
                                    this.choicePhase += 1;
                                }
                        }
                        else
                        {
                            this.spriteContext.clearRect(0,0,999,999);
                            this.spriteContext.drawImage(this.targetImg,0,0,40,80);  
                            context.drawImage(this.spriteCanvas,target.x-4,target.y-4,80,80); 
                        }

                    }

                }
            }


            context.fillStyle = "black"; 
            context.font = "16px '04b03'";  
            if (this.currentChar != null && this.currentAction != null)
                {
                    let targetName = "";
                    if (hoveredTarget!= null)
                        {
                            targetName = hoveredTarget.name;
                        }
                    context.fillText(this.currentChar.name+" uses "+this.currentAction.name+" on "+targetName,40,238); 
                    
                }
            this.cancelButton.drawFunction(context);
            if (this.cancelButton.clickConfirm)
                {
                    this.targetting = null; 
                    this.cancelButton.clickConfirm = 0;
                }
            if (this.engine.rightClick === 1)
                {
                    this.targetting = null;
                }

    }

    actionChoiceFunction = (context:CanvasRenderingContext2D) => {


        if (this.choicePhase == 0)
            {
                this.currentChar = this.activeChars[0][0];
                var _char = this.currentChar;
                if (this.time % 40 < 20)
                {
                    context.drawImage(this.selectImg,_char.x-1,_char.y-1,64,64); 
                }
                else
                {
                    context.drawImage(this.selectImg,_char.x-4,_char.y-4,72,72);
                }
            }
            else if (this.choicePhase == 1)
            {
                this.currentChar = this.activeChars[0][1];
                const _char = this.currentChar;
                if (this.time % 40 < 20)
                {
                    context.drawImage(this.selectImg,_char.x-1,_char.y-1,64,64); 
                }
                else
                {
                    context.drawImage(this.selectImg,_char.x-4,_char.y-4,72,72);
                } 
            } 

            context.fillStyle = "black"; 
            context.font = "16px '04b03'";   
            if (this.choicePhase === 1)
                { 
                    context.fillText(this.charActionText(0,0),40,218);  

                    this.backButton.drawFunction(context);
                    if (this.backButton.clickConfirm > 0)
                    {
                        this.backButton.clickConfirm = 0;
                        this.choicePhase -= 1;
                    }
                    if (this.engine.rightClick === 1)
                    {
                        this.choicePhase -= 1;
                    }
                    
                }
            if (this.currentChar != null)
                {
                    context.fillText(this.currentChar.name+"'s action",40,238);  
            
                for (let i=0; i < this.actionButtons.length; i++)
                {
                
                    let currentButton = this.actionButtons[i];
                    let buttonAction:FightAction|null = new FightAction(this.currentChar);

                    if (this.currentChar != null) {buttonAction = this.currentChar.actions[i];}
                    else { buttonAction.name = "none";} 
                    if (buttonAction != null) {currentButton.text = buttonAction.name;}
                    

                    currentButton.drawFunction(context);
                    if (currentButton.clickConfirm > 0)
                    {
                        this.playerChoices[0][this.choicePhase*2] = i;
                        this.targetting = this.currentChar.actions[i].targetType;
                        //this.choicePhase += 1;
                        this.currentAction = buttonAction;
                        currentButton.clickConfirm = 0;
                    }
                } 

                for (let i=0; i < this.protectButtons.length; i++)
                {
                    let currentButton = this.protectButtons[i];
                    currentButton.drawFunction(context);
                    if (currentButton.clickConfirm > 0)
                    {
                        this.playerChoices[0][this.choicePhase*2] = 4+i;
                        this.choicePhase += 1;
                        currentButton.clickConfirm = 0;
                    }
                } 

                for (let i=0; i < this.switchButtons.length; i++)
                {
                    let currentButton = this.switchButtons[i];
                    currentButton.drawFunction(context);
                    if (currentButton.clickConfirm > 0)
                    {
                        this.playerChoices[0][this.choicePhase*2] = 6+i;
                        this.choicePhase += 1;
                        currentButton.clickConfirm = 0;
                    }
                }   
        }

    }

    ViewCreatures = (context:CanvasRenderingContext2D) => {
        for (let i=0; i < this.totalTeams; i++)
            {
                for (let j=0; j < this.charsPerTeam; j++)
                    {
                        const viewChar = this.activeChars[i][j];
                        if (this.engine.MouseInRect(viewChar.x,viewChar.y,64,64))
                            {
                                document.body.style.cursor = 'help';
                            }
                    }
            }
    }

    CpuRandom = (cpuPlayer:number) => {
        for (let i=0; i < this.charsPerTeam;i++)
            {
                const cpuChar = this.activeChars[cpuPlayer][i];
                const cpuAction = Math.floor(Math.random()*4);
                const cpuTarget = Math.floor(Math.random()*2);
                this.playerChoices[cpuPlayer][i*2] = cpuAction;
                this.playerChoices[cpuPlayer][i*2+1] = cpuTarget;
            } 

    }

    TurnStartFunction = (context:CanvasRenderingContext2D) => {

       this.eventsList = [];
            for (let i = 0; i < this.totalTeams; i++)
            {
                for (let j=0; j < this.charsPerTeam; j++)
                    {
                        this.currentChar = this.activeChars[i][j]; 
                        const currentChoice = this.playerChoices[i][j*2];

                        if (currentChoice < 4)
                            {
                                this.eventsList.push(this.currentChar.makeEventFromAction(this,currentChoice));
                            }
                        else if (currentChoice < 6)
                            {
                                 
                            }
                        else if (currentChoice < 11)
                            {
                                 
                            }
                    }    
            }

            //let minSpeed = 9999;
            //let maxSpeed = -9999;
            //this.speedsList = [];
            /*const charSpeed = this.currentChar.speed;
            if (this.speedsList.indexOf(charSpeed) === -1)
                {this.speedsList.push(charSpeed)}
            if (charSpeed > maxSpeed){maxSpeed = charSpeed;} 
            if (charSpeed < minSpeed){minSpeed = charSpeed;} */ 
            
        this.fightPhase = "actions";
        this.currentChar = null;
        this.currentAction = null;
         
        this.eventsList.sort((a:FightAction, b:FightAction) => b.eventSpeed - a.eventSpeed);
        this.eventsList.sort((a:FightAction, b:FightAction) => b.eventPriority - a.eventPriority);
        console.log("speedlist",this.speedsList);
 
        this.eventIndex = 0;
    }
 
    


    ActionsFunction = (context:CanvasRenderingContext2D) => { 

        context.fillStyle = "black"; 
        context.font = "16px '04b03'";   
        context.fillText(this.actionsMessage,70,258);  
         
        const currentEvent = this.eventsList[this.eventIndex];
        console.log("evento",currentEvent);
        context.fillText("speed:"+String(currentEvent.eventSpeed),70,238);  
        
        if (currentEvent.user != null)
            {
                context.drawImage(this.selectImg,currentEvent.user.x-1,currentEvent.user.y-1,64,64); 
            }
        currentEvent.ExecuteEvent(this);

        if (currentEvent.eventOver)
            {
                this.eventIndex+=1;
                if (this.eventIndex >= this.eventsList.length)
                    {
                        this.fightPhase = "turnEnd";
                    }
            } 

    }

    createAnim = (animX:number,animY:number) => {

        const newAnim = new FightAnimation(this.engine,this.spriteContext,animX,animY,0);  
        return newAnim;
    } 


    override drawFunction = (context:CanvasRenderingContext2D) => {

        document.body.style.cursor = 'default';
        
        //draw creatures
        if (this.activeChars[0][0] != undefined)
        {
            let _char = this.activeChars[0][0];
            _char.drawFunction(context);
        }
        if (this.activeChars[0][1] != undefined)
        {
            let _char = this.activeChars[0][1];
            _char.drawFunction(context);
        }
        if (this.activeChars[1][0] != undefined)
        {
            let _char = this.activeChars[1][0];
            _char.dir = -1;
            _char.drawFunction(context);
        }
        if (this.activeChars[1][1] != undefined)
        {
            let _char = this.activeChars[1][1];
            _char.dir = -1;
            _char.drawFunction(context);
        }

        //draw sfx animations
        for (let i =0; i < this.animationsList.length;i++)
            {
                const currentAnim = this.animationsList[i];
                currentAnim.drawFunction(context);
            }


        ///draw buttons, catch their functions
         switch (this.fightPhase)
         {
            case "start":
             
            break;
            case "choice": 
                this.ViewCreatures(context);
                if (this.choicePhase >= this.charsPerTeam)
                {
                    this.confirmChoiceFunction(context);
                }
                else
                {
                    if (this.targetting === null)
                        { 
                            this.actionChoiceFunction(context);
                        }
                        else
                        {
                            this.targetChoiceFunction(context);
                        }
                }
            break;
            case "turnStart":
                this.TurnStartFunction(context); 
            break;

            case "actions":
                this.ActionsFunction(context);

            break;
            case "turnEnd":
                this.fightPhase = "choice"; 
                this.choicePhase = 0;
                this.choiceDepth = 0;
                this.targetting = null;
            break;

            default:
                //hello
            break;
            
         }

         
         this.time += 1;
    }


    getCharFromNumber = (num:number) => {
        return this.activeChars[Math.floor(num/this.charsPerTeam)][num % this.charsPerTeam]; 
    }


}



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





 

export default FightMatch;