import GameButton from "./GameButton";
import CreatureChar from "./CreatureChar";
import GameElement from "./GameElement";


import selectUrl from "./gfx/selector.png";
import targetUrl from "./gfx/targettersheet.png";

import { monsType, MTYPE } from "./game/types/monsType";
import { shape, MSHAPE } from "./game/shapes/shapes"; 
import { FightAction, ACTIONT, TARGETT, SwitchAction, FaintAction, MatchStartSendAction, FaintSwitchAction, FightEndAction } from "./FightAction";
import GameEngine from "./GameEngine";
import { FightAnimation } from "./FightAnimation"; 


type MultiMode = "cpu" | "local" | "online";
type FightPhase = "start" | "choice" | "turnStart" | "actions" | "turnEnd" | "combatEnd" | "turnEndSwitch" | "turnEndSwitchStart";


export type EffectType = "actionMessage" | "dealDamage" | "createAnim"


export class FightMatch extends GameElement {

    multiMode:MultiMode = "cpu";

    fightPhase:FightPhase = "actions"; 

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
    
    turnDeaths:Array<Array<number>> = [[],[]];

    totalTeams:number = 2;
    charsPerTeam:number = 2;
    
    playerNames:Array<string> = ["baboon","aardvark"];
    playerChoices:Array<any> = [[-1,-1,-1,-1],[-1,-1,-1,-1]];
    defaultPos:Array<Array<number>> = [[140,30,90,120],[640-140-64,30,640-90-64,120]];
    
    selectImg:HTMLImageElement = document.createElement("img");   
    targetImg:HTMLImageElement = document.createElement("img");   
    time:number = 0;

    targetting:TARGETT|null = null; 
    currentAction:FightAction|null = null;

    choiceMessage:string = "";
    actionsMessage:string = "actions message";
    actionsMessage2:string = "";

    spriteCanvas:HTMLCanvasElement;
    spriteContext:CanvasRenderingContext2D;
    popupCanvas:HTMLCanvasElement;
    popupContext:CanvasRenderingContext2D;

    speedsList:Array<number> = [];
    eventsList:Array<any> = [];
    interruptsList:Array<any> = [];
    eventIndex:number = 0;

    animationsList:Array<GameElement> = [];

    currentActionSpeed:number = 0;
    speedIndex:number = 0;
    prevSpeed:number = 0;
    prevPriority:number = 0;

    environment:CreatureChar;
    emptyPlayerCreature:Array<CreatureChar> = [];

    suddenDeath:boolean = false;
    

    constructor(public engine:GameEngine,public x:number = 0,public y:number = 0,public depth:number = 0){
        super(engine,x,y,depth); 
        const spriteCanvasElement = document.createElement("canvas");
        this.popupCanvas = document.createElement("canvas");
        this.spriteCanvas = spriteCanvasElement; 
        const spriteContexter = this.spriteCanvas.getContext('2d'); 
        const popupContexter = this.popupCanvas.getContext('2d');
        if (spriteContexter != null)
        { this.spriteContext =  spriteContexter;}
        else
        { this.spriteContext = engine.context; }
        if (spriteContexter != null)
        {this.popupContext =  spriteContexter;}
        else
        {this.popupContext = engine.context; }

        this.selectImg.src = selectUrl;
        this.targetImg.src = targetUrl;

        this.selectImg.onload = () => { 
            this.imgLoaded += 1;
          }

        for (let i=0; i < this.totalTeams; i++)
        {
            const emptyCreature = new CreatureChar(engine,-999,-999,-999,"fae","fae","beetle","crawler",i);
            this.emptyPlayerCreature[i] = emptyCreature;
            this.activeChars[i][0] = emptyCreature;
            this.activeChars[i][1] = emptyCreature;
        }
        
        this.environment = new CreatureChar(engine,-999,-999,-999,"fae","fae","beetle","crawler",-1);
    }

    actionButtons = [
        new GameButton(this.engine,26,246,140,40,"action1",0,"action"),
        new GameButton(this.engine,176,246,140,40,"action2",0,"action"),
        new GameButton(this.engine,326,246,140,40,"action3",0,"action"),
        new GameButton(this.engine,476,246,140,40,"action4",0,"action")

    ];

    protectButtons = [new GameButton(this.engine,356,300,100,40,"protect1",0),
    new GameButton(this.engine,486,300,100,40,"protect2",0)];

    switchButtons = [
        new GameButton(this.engine,66,296,54,54,"switch",0,"labeledChar"),
        new GameButton(this.engine,136,296,54,54,"switch",0,"labeledChar"),
        new GameButton(this.engine,206,296,54,54,"switch",0,"labeledChar"),
        new GameButton(this.engine,276,296,54,54,"switch",0,"labeledChar")
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
        this.party[0][0].muscle = 900;
        this.party[0][1].muscle = 900;
        let matchStartEvent = new MatchStartSendAction(this.emptyPlayerCreature[0]);
        matchStartEvent.targetList.push(_parties[0][0]); 
        matchStartEvent.targetList.push(_parties[0][1]); 
        this.eventsList.push(matchStartEvent);
        _parties[1] = [
            new CreatureChar(this.engine,640-100-64,30,0,"fae","steel","beetle","crawler",1),
            new CreatureChar(this.engine,640-50-64,120,0,"fae","steel","beetle","crawler",1),
            new CreatureChar(this.engine,0,0,0,"fae","steel","beetle","crawler",1),
            new CreatureChar(this.engine,0,0,0,"fae","steel","beetle","crawler",1),
            new CreatureChar(this.engine,0,0,0,"fae","steel","beetle","crawler",1),
            new CreatureChar(this.engine,0,0,0,"fae","steel","beetle","crawler",1),
        ];
        matchStartEvent = new MatchStartSendAction(this.emptyPlayerCreature[1]);
        matchStartEvent.targetList.push(_parties[1][0]); 
        matchStartEvent.targetList.push(_parties[1][1]);  
        this.eventsList.push(matchStartEvent);
        

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
                    if (char.HP <= 0){outputString = " - "}
                    else{outputString+= " can't do anything";}
                    
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
                    outputString += " will switch to " + this.getBenchedCharFromNumber(teamIndex,this.playerChoices[teamIndex][charIndex*2]-6).name;
                }
        }
        return outputString;
    }

    confirmChoiceFunction = (context:CanvasRenderingContext2D) => {

        for (let i= 0; i < this.charsPerTeam; i++)
            { 
                context.fillStyle = "black"; 
                 context.font = "16px '04b03'";
                 context.letterSpacing = "0px"    
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
            context.letterSpacing = "0px"   
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
                    if (this.currentChar != target && target.HP > 0)
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
            context.letterSpacing = "0px"  
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
            context.letterSpacing = "0px"  
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
                    if (buttonAction != null) {currentButton.actionLabel = buttonAction;}
                    

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
                    let buttonChar = this.getBenchedCharFromNumber(0,i); 
                    if (buttonChar != undefined)
                    {
                        currentButton.switchCreature = buttonChar;
                        currentButton.spriteContext = this.spriteContext;

                        currentButton.drawFunction(context);
                        currentButton.disabled = false;

                        if (buttonChar.HP <= 0) {currentButton.disabled = true;}
                        if (this.choicePhase > 0)
                        { 
                            let prevChoice = this.playerChoices[0][0]; 
                            if (prevChoice > 5 && prevChoice < 11)
                                { 
                                    if (i === prevChoice - 6) //can't switch to character other is switching to
                                        {
                                            currentButton.disabled = true;
                                        } 
                                    
                                }
                        }
    

                        if (currentButton.clickConfirm > 0)
                        {
                            this.playerChoices[0][this.choicePhase*2] = 6+i;
                            this.choicePhase += 1;
                            currentButton.clickConfirm = 0;
                        } 
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
                if (cpuChar.HP > 0)
                {
                    const cpuAction = Math.floor(Math.random()*4);
                    let cpuTarget = Math.floor(Math.random()*2);
                    while(this.activeChars[0][cpuTarget].HP <= 0)
                        {
                            cpuTarget = Math.floor(Math.random()*2); 
                        }
                    this.playerChoices[cpuPlayer][i*2] = cpuAction;
                    this.playerChoices[cpuPlayer][i*2+1] = cpuTarget; 
                }
            } 

    }

    CpuRandomDeathSwitch = (cpuPlayer:number) => {
        const maxSwitches = this.getPossibleSwitchNumbers(cpuPlayer);
        const maxCheck = Math.min(maxSwitches,this.turnDeaths[cpuPlayer].length);
        const switchList:Array<number> = [];
        const switchSize = this.party[cpuPlayer].length-this.charsPerTeam;
        console.log("start ",maxSwitches," ",this.turnDeaths[cpuPlayer].length)
        for (let i=0; i < maxCheck;i++)
            {
                console.log("loop ",i);
                const deathSlot = this.turnDeaths[cpuPlayer][i];
                let cpuAction = Math.floor(Math.random()*switchSize);
                let cpuSwitchChar = this.getBenchedCharFromNumber(cpuPlayer,cpuAction);
                console.log("switchlist check ",switchList.length," ",switchList.indexOf(cpuAction));
                while (switchList.indexOf(cpuAction) != -1 || cpuSwitchChar.HP <= 0 || cpuSwitchChar === this.activeChars[cpuPlayer][0] || cpuSwitchChar === this.activeChars[cpuPlayer][1])
                    { 
                        
                        cpuAction = Math.floor(Math.random()*switchSize);
                        cpuSwitchChar = this.getBenchedCharFromNumber(cpuPlayer,cpuAction); 
                        console.log("whilin ",cpuAction," "+cpuSwitchChar.name);
                    } 
                switchList.push(cpuAction);
                this.playerChoices[cpuPlayer][deathSlot*2] = cpuAction+6; 
                console.log("setting switch ",deathSlot," ",cpuAction+6);
            }

    }

    PostDeathSwitchStartFunction = (context:CanvasRenderingContext2D) => {
        this.eventsList = [];
        let switchAct = null; 
        console.log("choices ",this.playerChoices[0],this.playerChoices[1]);
       
        for (let i = 0; i < this.totalTeams; i++)
            {
                switchAct = null; 
                for (let j=0; j < this.charsPerTeam; j++)
                    { 
                        this.currentChar = this.activeChars[i][j]; 
                        const currentChoice = this.playerChoices[i][j*2]; 
                        if (currentChoice > 5 && currentChoice < 11)
                            {
                                if (switchAct === null)
                                {
                                    console.log("ye");
                                    switchAct = new FaintSwitchAction(this.activeChars[i][j]);
                                    switchAct.targetList = [this.environment,this.environment];
                                    this.eventsList.push(switchAct);
                                }
                                switchAct.currentTarget = currentChoice - 6;
                                switchAct.targetList[j] = this.getBenchedCharFromNumber(this.currentChar.team,currentChoice-6);

                            }
                    }
            }

            this.prevPriority = 99999;
            this.prevSpeed = 99999;
            this.fightPhase = "actions";
            this.currentChar = null;
            this.currentAction = null;
            
            this.eventsList.sort((a:FightAction, b:FightAction) => b.eventSpeed - a.eventSpeed);
            this.eventsList.sort((a:FightAction, b:FightAction) => b.eventPriority - a.eventPriority);
            this.turnDeaths = [[],[]]; 
            this.eventIndex = 0; 

    }

    TurnStartFunction = (context:CanvasRenderingContext2D) => {

       this.eventsList = [];
            for (let i = 0; i < this.totalTeams; i++)
            {
                for (let j=0; j < this.charsPerTeam; j++)
                    {
                        this.currentChar = this.activeChars[i][j]; 
                        const currentChoice = this.playerChoices[i][j*2];
                        const currentTarget = this.playerChoices[i][1+j*2];
                        if (currentChoice < 0)
                        {

                        }
                        else if (currentChoice < 4)
                            {
                                this.eventsList.push(this.currentChar.makeEventFromAction(this,currentChoice,currentTarget));
                            }
                        else if (currentChoice < 6)
                            {
                                 
                            }
                        else if (currentChoice < 11)
                            {
                                const switchAct = new SwitchAction(this.currentChar);
                                
                                switchAct.currentTarget = currentChoice - 6;
                                switchAct.switchTarget = this.getBenchedCharFromNumber(this.currentChar.team,currentChoice-6);
                                this.eventsList.push(switchAct);
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
            
        this.prevPriority = 99999;
        this.prevSpeed = 99999;
        this.fightPhase = "actions";
        this.currentChar = null;
        this.currentAction = null;
         
        this.eventsList.sort((a:FightAction, b:FightAction) => b.eventSpeed - a.eventSpeed);
        this.eventsList.sort((a:FightAction, b:FightAction) => b.eventPriority - a.eventPriority); 
 
        this.eventIndex = 0;
    }
 
    


    ActionsFunction = (context:CanvasRenderingContext2D) => { 

        context.fillStyle = "black"; 
        context.font = "16px '04b03'";   
        context.letterSpacing = "0px"  
        context.fillText(this.actionsMessage,70,258);  
        context.fillText(this.actionsMessage2,70,278);  
         
        let currentEvent = this.eventsList[this.eventIndex]; 
        //console.log("evento",currentEvent);
        if (currentEvent.eventSpeed % 1 === 0)
            {
                context.fillText("speed:"+String(currentEvent.eventSpeed),70,238);   
                if (currentEvent.eventPriority > 0) {context.fillText("priority:"+String(currentEvent.eventPriority),140,238); }
            }
        
        if (currentEvent.user != null)
            {
                context.drawImage(this.selectImg,currentEvent.user.x-1,currentEvent.user.y-1,64,64); 
            }
        currentEvent.ExecuteEvent(this);

        if (currentEvent.eventOver)
            {
                this.prevPriority = currentEvent.eventPriority;
                this.prevSpeed = currentEvent.eventSpeed; 
                
                this.eventIndex+=1; 
               
                    const prevEvent = currentEvent;
                    currentEvent = this.eventsList[this.eventIndex];
                    //check for deaths if speed timing changed // if it's over
                    if (this.eventIndex >= this.eventsList.length)
                    {
                        this.checkForDeaths();
                    }
                    else if (currentEvent.eventPriority != prevEvent.eventPriority || prevEvent.eventSpeed != currentEvent.eventSpeed)
                    {
                        console.log("death checkin'");
                        this.checkForDeaths(); 
                        
                    }
                    //if it's still over / no deaths then we end the turn
                    if (this.eventIndex >= this.eventsList.length)
                    {
                        this.fightPhase = "turnEnd";
                    }
            }

    }

    checkForDeaths = () => {

         
                        
                        const deathsArray = [];
                        for (let i = 0; i < this.totalTeams; i++)
                            {
                                for (let j=0; j < this.charsPerTeam; j++)
                                    {
                                        this.currentChar = this.activeChars[i][j]; 
                                        if (this.currentChar.HP <= 0 && this.currentChar.fainting === 0)
                                        {
                                            deathsArray.push(this.currentChar);
                                            this.turnDeaths[this.currentChar.team].push(this.currentChar.activeSlot);
                                            for (let k=this.eventIndex; k < this.eventsList.length; k++)
                                                {
                                                    const eventCheck = this.eventsList[k];
                                                    if (eventCheck.user === this.currentChar)
                                                        {
                                                            eventCheck.isCancelled = true;
                                                            eventCheck.eventOver = true;
                                                            eventCheck.eventSpeed += 0.5;
                                                            eventCheck.user = this.environment;
                                                            
                                                        }
                                                    else if (eventCheck.targetType === "single") //targeting dying man
                                                        {
                                                            if (this.getCharFromNumber(eventCheck.currentTarget) === this.currentChar && this.currentChar.team != eventCheck.user.team && eventCheck.canSwitchFaintedTarget)
                                                                { 
                                                                    if (eventCheck.currentTarget % this.charsPerTeam === 0)
                                                                        {
                                                                            eventCheck.currentTarget += this.charsPerTeam-1; 
                                                                        }
                                                                        else
                                                                        {
                                                                            eventCheck.currentTarget -= 1;  
                                                                        }
                                                                }
                                                        }
                                                }
                                        }
                                    }
                            }
                        if (deathsArray.length > 0)
                            {
                                
                                const deathEvent = new FaintAction(this.environment);
                                deathEvent.targetList = deathsArray;
                                deathEvent.eventSpeed = this.prevSpeed-0.5;
                                deathEvent.eventPriority = this.prevPriority - 0.5;
                                this.eventsList.splice(this.eventIndex, 0, deathEvent);  
                                
                                const teamsDead = [];
                                let teamAlive = -1;
                                for (let i=0; i < this.totalTeams; i++)
                                {
                                    let alive = 0;
                                    for (let j=0; j < this.party[i].length; j++)
                                    {
                                        const creature = this.party[i][j]; 
                                        if (creature.HP > 0)
                                        {
                                            alive += 1;
                                            teamAlive = i;
                                        }
                                    } 
                                    if (alive === 0)
                                    { 
                                        teamsDead.push(i);
                                    }
                                }
                                if (teamsDead.length > 0)
                                {
                                    if (teamsDead.length === this.totalTeams)
                                    {

                                    }
                                    else if (teamsDead.length === this.totalTeams-1)
                                    {
                                        const deathEvent = new FightEndAction(this.environment);
                                        deathEvent.currentTarget = teamAlive;
                                        this.eventsList.splice(this.eventIndex+1, 0, deathEvent);  
                                    }
                                }
                            }  
    }

    TurnEndFunction = (context:CanvasRenderingContext2D) => {
        for (let i=0; i< this.totalTeams; i++)
        {
            for (let j=0; j< this.charsPerTeam; j++)
            {
                this.playerChoices[i][j*2] = -1;
                this.playerChoices[i][1+j*2] = -1;
            }
        }
        if (this.turnDeaths[0].length > 0 && this.getPossibleSwitchNumbers(0) > 0)
        {
            this.fightPhase = "turnEndSwitch"; 
            this.turnDeaths[0].sort((a, b) => a - b);
            this.turnDeaths[1].sort((a, b) => a - b);
            for (let i=0; i < this.turnDeaths[0].length; i++)
            {
                const deathIndex = this.turnDeaths[0][i]; 
            }
            for (let i=0; i < this.turnDeaths[1].length; i++)
                {
                    const deathIndex = this.turnDeaths[1][i]; 
                }

        }
        else if (this.turnDeaths[1].length > 0 && this.getPossibleSwitchNumbers(1) > 0)
        {
            this.turnDeaths[1].sort((a, b) => a - b);
            this.CpuRandomDeathSwitch(1);
            this.fightPhase = "turnEndSwitchStart";
        }
        else
        { 
          this.fightPhase = "choice"; 
        }
        this.eventsList = [];
        this.choicePhase = 0;
        this.choiceDepth = 0;
        this.targetting = null;
        this.actionsMessage = "";
        this.actionsMessage2 = "";
    }

    PostDeathSwitchWaitFunction = (context:CanvasRenderingContext2D) => {

    }

    PostDeathSwitchFunction = (context:CanvasRenderingContext2D) => {

        const charIndex = this.turnDeaths[0][this.choicePhase];
        if (charIndex === 0)
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
            else if (charIndex === 1)
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
            context.letterSpacing = "0px"  
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
                    context.fillText("replace "+this.currentChar.name+" with who?",40,238);   
                }
                for (let i=0; i < this.switchButtons.length; i++)
                    {
                        let currentButton = this.switchButtons[i];
                        let buttonChar = this.getBenchedCharFromNumber(0,i); 
                        if (buttonChar != undefined)
                            {
                                currentButton.switchCreature = buttonChar;
                                currentButton.spriteContext = this.spriteContext;
            
                                currentButton.drawFunction(context);
                                currentButton.disabled = false;
            
                                if (buttonChar.HP <= 0) {currentButton.disabled = true;}
                                if (this.choicePhase > 0)
                                { 
                                    let prevChoice = this.playerChoices[0][0]; 
                                    if (prevChoice > 5 && prevChoice < 11)
                                        { 
                                            if (i === prevChoice - 6)
                                                {
                                                    currentButton.disabled = true;
                                                } 
                                            
                                        }
                                }
            
            
                                if (currentButton.clickConfirm > 0)
                                {
                                    this.playerChoices[0][charIndex*2] = 6+i;
                                    this.choicePhase += 1;
                                    currentButton.clickConfirm = 0;
                                    if (this.choicePhase >= this.turnDeaths[0].length || this.choicePhase >= this.getPossibleSwitchNumbers(0))
                                    {
                                        if (this.turnDeaths[1].length > 0)
                                            {
                                                this.turnDeaths[1].sort((a, b) => a - b);
                                                this.CpuRandomDeathSwitch(1);
                                                this.fightPhase = "turnEndSwitchStart";
                                            }
                                        this.fightPhase = "turnEndSwitchStart";
                                    }
                                } 
                        }
                    } 
    }

    FightOverFunction = (context:CanvasRenderingContext2D) => {



    }
         

    createAnim = (animX:number,animY:number) => {

        const newAnim = new FightAnimation(this.engine,this.spriteContext,animX,animY,0);  
        this.animationsList.push(newAnim);
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
                if (this.choicePhase < this.charsPerTeam)
                {
                    while (this.activeChars[0][this.choicePhase].HP <= 0)
                    {
                        console.log("char check insanity ",this.activeChars[0][this.choicePhase])
                        this.choicePhase += 1;
                        if (this.choicePhase >= this.charsPerTeam)
                        {
                            break;
                        }
                    }
                }

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
                this.TurnEndFunction(context);
            break;
            case "turnEndSwitch":
                this.PostDeathSwitchFunction(context);
            break;  
            case "turnEndSwitchStart":
                this.PostDeathSwitchStartFunction(context);
            break;  

            case "combatEnd":
                this.FightOverFunction(context);
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

    getPlayerNameFromNumber = (num:number) => {
        if (num < 0) {return "The Environment"}
        else if (num < this.playerNames.length) {return this.playerNames[num];}
        else {return "?UNKNOWN?"}
    }

    getPossibleSwitchNumbers = (team:number) => {
        let total = 0; 
        let benchChar = this.party[team][0];
        for (let i =0; i < this.party[team].length; i++)
            {
                benchChar = this.party[team][i];
                if (benchChar != this.activeChars[team][0] && benchChar != this.activeChars[team][1] && benchChar.HP > 0)
                    { 
                        total += 1;
                    }
            }
        return total;

    }

    getBenchedCharFromNumber = (team:number,num:number) =>{
        let benchChar = this.party[team][0];
        let modNum = num;
        for (let i =0; i <= modNum; i++)
            {
                benchChar = this.party[team][i];
                if (benchChar === this.activeChars[team][0] || benchChar === this.activeChars[team][1])
                    { 
                        modNum += 1; 
                    }
            }
        benchChar = this.party[team][modNum];
        return benchChar;
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