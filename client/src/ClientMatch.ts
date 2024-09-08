import * as DATA from './Data.ts';

import GameElement from "./GameElement";
import ClientButton from "./ClientButton.ts";
import GameEngine from './GameEngine.ts';

import { ClientCreature } from "./ClientCreature";
import { ClientAction } from './ClientAction.ts';


type playerControl = "local" | "cpu" | "online"; 
type fightPhase = "start" | "choice" | "turnStart" | "actions" | "turnEnd" | "combatEnd" | "turnEndSwitch" | "turnEndSwitchStart" | "emergencySwitchChoice";



export class ClientMatch extends GameElement {

    //gameplay constants that will probably never be changed
    totalTeams:number = 2;
    charsPerTeam:number = 2;

    //player info & turn choices
    playerNames:Array<string> = ["baboon","aardvark"];
    playerController:Array<playerControl> = ["local","cpu"];
    playerChoices:Array<any> = [[-1,-1,-1,-1],[-1,-1,-1,-1]];

    //player parties and active chars
    playerParties:Array<Array<ClientCreature>> = []; 
    activeChars:Array<Array<ClientCreature>> = [[],[]];
    emptyPlayerCreature:Array<ClientCreature> = [];

    //environment etc effects that's just an invisible creature
    environmentChar:ClientCreature;

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
    defaultPos:Array<Array<number>> = [[140,30,90,120],[640-140-64,30,640-90-64,120]]; //default positioning of characters
    gameElementsList:Array<GameElement> = []; 

     spriteCanvas:HTMLCanvasElement;
     spriteContext:CanvasRenderingContext2D;

     popupCanvas:HTMLCanvasElement;
     popupContext:CanvasRenderingContext2D;
     popupViewTime:number = 0;

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
    constructor(public engine:GameEngine) {
        super(engine,0,0,0); 

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

        for (let i=0; i < this.totalTeams; i++)
            {
                const emptyCreature = new ClientCreature(engine);
                this.emptyPlayerCreature[i] = emptyCreature;
                this.activeChars[i][0] = emptyCreature;
                this.activeChars[i][1] = emptyCreature;
            }
        
        this.environmentChar = new ClientCreature(engine);
 
    }

    //-------------------------------------------------------------------

    // main render loop
    override drawFunction = (context:CanvasRenderingContext2D) => {

            this.drawGameElements(context);
            this.drawGuiElements(context);  
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

        this.gameElementsList.sort((a, b) => b.depth - a.depth);

        for (let i = 0; i < this.gameElementsList.length; i++)
        {
            const drawElement = this.gameElementsList[i];
            drawElement.drawFunction(context);  
        }     


    }


     
     
}