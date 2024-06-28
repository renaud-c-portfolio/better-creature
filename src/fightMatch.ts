import gameButton from "./gameButton";
import CreatureChar from "./CreatureChar";
import gameElement from "./gameElement";


import selectUrl from "./gfx/selector.png";
import targetUrl from "./gfx/targettersheet.png";

import { monsType, MTYPE } from "./game/types/monsType";
import { shape, MSHAPE } from "./game/shapes/shapes"; 
import { FightAction, ACTIONT, TARGETT } from "./FightAction";
import gameEngine from "./gameEngine";

import { FightEvent, EventType, EffectFightMessage } from "./FightEvent"; 


type MultiMode = "cpu" | "local" | "online";
type FightPhase = "start" | "choice" | "turnStart" | "actions" | "turnEnd" | "combatEnd";

export class FightMatch extends gameElement {

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
    eventIndex:number = 0;

    currentActionSpeed:number = 0;
    speedIndex:number = 0;

    

    constructor(public engine:gameEngine,public x:number = 0,public y:number = 0,public depth:number = 0){
        super(engine,x,y,depth); 
        const spriteCanvasElement = document.createElement("canvas");;
        this.spriteCanvas = spriteCanvasElement; 
        const spriteContexter = this.spriteCanvas.getContext('2d');
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
        new gameButton(this.engine,26,246,140,40,"action1",0),
        new gameButton(this.engine,176,246,140,40,"action2",0),
        new gameButton(this.engine,326,246,140,40,"action3",0),
        new gameButton(this.engine,476,246,140,40,"action4",0)

    ];

    protectButtons = [new gameButton(this.engine,356,300,100,40,"protect1",0),
    new gameButton(this.engine,486,300,100,40,"protect2",0)];

    switchButtons = [
        new gameButton(this.engine,66,296,54,54,"switch",0,"labeledImage"),
        new gameButton(this.engine,136,296,54,54,"switch",0,"labeledImage"),
        new gameButton(this.engine,206,296,54,54,"switch",0,"labeledImage"),
        new gameButton(this.engine,276,296,54,54,"switch",0,"labeledImage")
    ];

    confirmButton = new gameButton(this.engine,326,246,140,40,"confirm",0);
    cancelButton = new gameButton(this.engine,26,246,140,40,"cancel",0);
    backButton = new gameButton(this.engine,12,296,40,54,"back",0);
    
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

                    currentButton.text = buttonAction.name;

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

        let minSpeed = 9999;
        let maxSpeed = -9999;
        this.speedsList = [];
        for (let i = 0; i < this.totalTeams; i++)
            {
                for (let j=0; j < this.charsPerTeam; j++)
                    {
                        this.currentChar = this.activeChars[i][j];
                        const charSpeed = this.currentChar.speed;
                        if (this.speedsList.indexOf(charSpeed) === -1)
                            {this.speedsList.push(charSpeed)}
                        if (charSpeed > maxSpeed){maxSpeed = charSpeed;}
                        if (charSpeed < minSpeed){minSpeed = charSpeed;}
                    }
            }

        for (let k =maxSpeed; k >= minSpeed; k--)
        {
            for (let i = 0; i < this.totalTeams; i++)
            {
                for (let j=0; j < this.charsPerTeam; j++)
                    {
                         
                    }
            }
        }
        
        this.fightPhase = "actions";
        this.currentChar = null;
        this.currentAction = null;

        this.speedsList.sort((a, b) => b - a);
        console.log("speedlist",this.speedsList);

        this.eventsList = []; 
        this.eventsList.push( new FightEvent(this,[new EffectFightMessage(this,"hello message")]));
        this.eventIndex = 0;
    }
 
    


    ActionsFunction = (context:CanvasRenderingContext2D) => { 

        context.fillStyle = "black"; 
        context.font = "16px '04b03'";   
        context.fillText(this.actionsMessage,70,258);  
         
        const currentEvent = this.eventsList[this.eventIndex];
        
        currentEvent.ExecuteEvent();
        if (currentEvent.eventOver)
            {
                this.eventIndex+=1;
                if (this.eventIndex >= this.eventsList.length)
                    {
                        this.fightPhase = "turnEnd";
                    }
            } 

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

                break;
            
         }

         
         this.time += 1;
    }


}

export default FightMatch;