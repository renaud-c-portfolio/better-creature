import * as DATA from './Data.ts';

import GameElement from "./GameElement";
import ClientButton from "./ClientButton.ts";
import GameEngine from './GameEngine.ts';
   
import { FightAction } from './FightAction.ts';
import CreatureChar from './CreatureChar.ts';
import { ServerMatch,ServerClientMessage } from './ServerMatch.ts';


import bgUrl from "./gfx/backyard.png";


type playerControl = "local" | "cpu" | "online"; 
type fightPhase = "preFight" | "waitStart" | "start" | "choice" | "turnStart" | "actions" | "turnEnd" | "combatEnd" | "turnEndSwitch" | "turnEndSwitchStart" | "emergencySwitchChoice";
 

export class ClientMatch extends GameElement {

    //gameplay constants that will probably never be changed
    totalTeams:number = 2;
    activeCharsPerTeam:number = 2;
    fightCharsPerTeam:number = 5;
    totalPartySize:number = 8;
 

    /// important player stuffs
    onlineGame = false;

    allSentMessages:Array<ServerClientMessage> = [];
    sendingMessages:Array<ServerClientMessage> = [];
    receivingMessages:Array<ServerClientMessage> = [];
    allReceivedMessages:Array<ServerClientMessage> = [];

    turnEventList:Array<Array<FightAction>> = [[]];

    localPlayer = 0;
    remapPlayerPerspective= [0,1,2,3];

    //stuff to receive from server
    playerDecision:DATA.PlayerDecision = [0,0,0];
    newCharInfo:DATA.CreatureInfo|null = null;

    //player info & turn choices
    playerNames:Array<string> = ["baboon","aardvark"];
    playerController:Array<playerControl> = ["local","cpu"];
    playerChoices:Array<any> = [[-1,-1,-1,-1],[-1,-1,-1,-1]];

    multiLocalPlayerTurn:number = 0;

    //player parties and active chars
    playerParties:Array<Array<CreatureChar>> = [[],[]]; 
    activeChars:Array<Array<CreatureChar>> = [[],[]];
    emptyPlayerCreature:Array<CreatureChar> = [];

    //environment etc effects that's just an invisible creature
    environmentChar:CreatureChar;

    //general match vars
    currentPhase:fightPhase = "start";
    currentTurn:number = 0;

    //player choice menu vars
    choicePhase:number = 0;
    choiceDepth:number = 0;
    choiceConfirmed:boolean = false;
    choiceMessage:string = "";

    //combat message display vars - TODO change to formatted string soon
    actionsMessage:string = "actions message";
    actionsMessage2:string = "";

    //visual vars
    defaultPos:Array<Array<[number,number]>> = [[[140,30],[90,120]],[[640-140-64,30],[640-90-64,120]]]; //default positioning of characters
    gameElementsList:Array<GameElement> = []; 

     spriteCanvas:HTMLCanvasElement;
     spriteContext:CanvasRenderingContext2D;

     popupCanvas:HTMLCanvasElement;
     popupContext:CanvasRenderingContext2D;
     popupViewTime:number = 0;

     
    bgImg:HTMLImageElement = document.createElement("img");   

     //player choice button creation
     //------------------------------
     actionButtons = [
        new ClientButton(this.engine,26,246,140,40,"action1",0,"action"),
        new ClientButton(this.engine,176,246,140,40,"action2",0,"action"),
        new ClientButton(this.engine,326,246,140,40,"action3",0,"action"),
        new ClientButton(this.engine,476,246,140,40,"action4",0,"action") 
    ];

    protectButtons = [new ClientButton(this.engine,356,300,100,40,"protect1",0),
    new ClientButton(this.engine,486,300,100,40,"protect2",0)];

    switchButtons = [
        new ClientButton(this.engine,66,296,54,54,"switch",0,"labeledChar"),
        new ClientButton(this.engine,136,296,54,54,"switch",0,"labeledChar"),
        new ClientButton(this.engine,206,296,54,54,"switch",0,"labeledChar"),
        new ClientButton(this.engine,276,296,54,54,"switch",0,"labeledChar")
    ];

    confirmButton = new ClientButton(this.engine,326,246,140,40,"confirm",0);
    cancelButton = new ClientButton(this.engine,26,246,140,40,"cancel",0);
    backButton = new ClientButton(this.engine,12,296,40,54,"back",0);
    
    //starting vars end-----------------------------------------------------

    //constructor time =====================================================
    constructor(public engine:GameEngine, online:boolean) {
        super(engine,0,0,-100); 
 

        //initializing drawing elements
        const spriteCanvasElement = document.createElement("canvas");
        this.popupCanvas = document.createElement("canvas");
        this.spriteCanvas = spriteCanvasElement; 
        const spriteContexter = this.spriteCanvas.getContext('2d'); 
        const popupContexter = this.popupCanvas.getContext('2d');
        //convincing typescript things are not null anymore
        if (spriteContexter != null)
        { this.spriteContext =  spriteContexter;}  else { this.spriteContext = engine.context; }
        if (popupContexter != null)
        {this.popupContext =  popupContexter;} else {this.popupContext = engine.context; }
        // 

        
        this.bgImg.src = bgUrl;
         
        this.environmentChar = new CreatureChar(engine);
 
    }

    //-------------------------------------------------------------------

    // main render loop
    override drawFunction = (context:CanvasRenderingContext2D) => {
        
            context.drawImage(this.bgImg,0,0,640,360);

            this.drawGameElements(context); 
            this.drawGuiElements(context);   
    }

    // initialize battle function
    initBattle = () => {

        for (let i =0; i < this.totalTeams; i++)
        {
            for (let j =0; j < this.activeCharsPerTeam; j++)
            {
                const char = this.playerParties[i][j];
                if (char != null)
                {
                    this.activeChars[i][j] = char;
                    char.x = this.defaultPos[i][j][0];
                    char.y = this.defaultPos[i][j][1]; 
                }
            }
        }
    }

    // 
    combatSequenceLogic = (context:CanvasRenderingContext2D) => {
        switch(this.currentPhase)
        {
            case "start": 

                break; 
            case "choice":

                break; 
            case "emergencySwitchChoice":

                break;
            case "actions":

                break;
            case "turnEnd":

                break;
        }
    }

    //graphical function - draw GUI (includes some of their logic, mostly buttons)
    drawGuiElements = (context:CanvasRenderingContext2D) => {
        switch (this.currentPhase)
        {
            case "waitStart":
                
                break;
            case "start":

                break;
            
            case "choice":
                 
                break;
            
            default:

                break;
        }
    }
     
    //graphical function - draw creatures & special effects, ordered by "depth";
    drawGameElements = (context:CanvasRenderingContext2D) => {
 
        for (let i=0; i< this.totalTeams; i++)
        {
            for (let j=0; j < this.playerParties[i].length;j++)
            {
                let _char = this.playerParties[i][j]; 
                _char.drawFunction(context);
            }
        }
        /*
        if (this.currentPhase != "waitStart")
        {
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
        
                this.gameElementsList.sort((a, b) => b.depth - a.depth);
        
                for (let i = 0; i < this.gameElementsList.length; i++)
                {
                    const drawElement = this.gameElementsList[i];
                    drawElement.drawFunction(context);  
                }
        }*/
        


    }

    fillTeamWithUnknown = (teamIndex:number,creatureAmount:number) => {
        this.playerParties[teamIndex] = [];
        for (let i=0; i < creatureAmount; i++)
        {
            const newCreature = new CreatureChar(this.engine,
                40 + (i%2)*80 + teamIndex*300,
                30 + Math.floor(i/2)*80,
                0,
                teamIndex
            );
            this.playerParties[teamIndex].push(newCreature);
        }
    }

    startMatch = (party1:Array<CreatureChar>,party2:Array<CreatureChar>,matchType:DATA.MatchType) => {
        this.playerParties[0] = party1;
        this.playerParties[1] = party2;

        this.activeChars[0] = [party1[0],party1[1]];
        this.activeChars[1] = [party2[0],party2[1]];
    }


    receiveServerMessages = () => {
        for (let i=0; i < this.receivingMessages.length; i++) 
        {
            const currentMessage = this.receivingMessages[i];

            switch(currentMessage.type)
            {
                case "creature":
                    const info = currentMessage.data as DATA.CreatureInfo;
                    this.updateCreatureInfo(info);
                break;
            }
        }
    }

    updateCreatureInfo = (info:DATA.CreatureInfo) => {
        const creature = this.playerParties[this.remapPlayerPerspective[info.player]][this.remapPlayerPerspective[info.partyIndex]];
        if (creature != undefined)
        {
            if (info.name != null)
            {
                if (info.name != creature.name)
                {creature.name = info.name; console.log("name updated")}
            }
            if (info.aspectsAndShapes != null)
            {
                creature.aspectTypes = info.aspectsAndShapes[0];
                creature.shapes = info.aspectsAndShapes[1];
                console.log("aspect & shapes updated");
            }
            if (info.pluses != null)
            {
                creature.statPlus = info.pluses;
                console.log("pluses updated");
            }
        }
        else 
        {
            console.log("TRYING TO UPDATE UNDEFINED CREATURE ALERT")
        }
    }
     
     
}