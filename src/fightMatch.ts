import gameButton from "./gameButton";
import creatureChar from "./creatureChar";
import gameElement from "./gameElement";


import selectUrl from "./gfx/selector.png";

import { monsType, MTYPE } from "./game/types/monsType";
import { shape, MSHAPE } from "./game/shapes/shapes"; 
import { fightAction, ACTIONT, TARGETT } from "./fightAction";
import gameEngine from "./gameEngine";

type FightPhase = "start" | "choice" | "actions" | "turnEnd" | "combatEnd";

export class FightMatch extends gameElement {

    fightPhase:FightPhase = "choice"; 

    choicePhase = 0;
    imgLoaded:number = 0;
    imgLoadedMax:number = 1;
    
    party:Array<Array<creatureChar>> = []; 
    activeChars:Array<Array<creatureChar>> = [[],[]]; 
    currentChar:creatureChar|null = null;
    
    playerChoices:Array<any> = [[],[]];
    
    selectImg:HTMLImageElement = document.createElement("img");   
    time:number = 0;

    targetting:TARGETT|null = null;
    currentAction:fightAction|null = null;

    constructor(public engine:gameEngine,public x:number = 0,public y:number = 0,public depth:number = 0){
        super(engine,x,y,depth);

        this.selectImg.src = selectUrl;

        this.selectImg.onload = () => { 
            this.imgLoaded += 1;
          }

    }

    


    actionButtons = [
        new gameButton(this.engine,26,246,140,40,"blaze cruncho",0),
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
    
    defaultParty = () =>{

        const _parties = this.party; 
        _parties[0] = [];
        _parties[0] = [
            new creatureChar(this.engine,100,50,0,"fae","steel","beetle","crawler"),
            new creatureChar(this.engine,50,140,0,"fae","steel","beetle","crawler"),
            new creatureChar(this.engine,0,0,0,"fae","steel","beetle","crawler"),
            new creatureChar(this.engine,0,0,0,"fae","steel","beetle","crawler"),
            new creatureChar(this.engine,0,0,0,"fae","steel","beetle","crawler"),
            new creatureChar(this.engine,0,0,0,"fae","steel","beetle","crawler"),
        ];
        this.activeChars[0][0] = _parties[0][0];
        this.activeChars[0][1] = _parties[0][1];
        _parties[1] = [
            new creatureChar(this.engine,476,50,0,"fae","steel","beetle","crawler"),
            new creatureChar(this.engine,526,140,0,"fae","steel","beetle","crawler"),
            new creatureChar(this.engine,0,0,0,"fae","steel","beetle","crawler"),
            new creatureChar(this.engine,0,0,0,"fae","steel","beetle","crawler"),
            new creatureChar(this.engine,0,0,0,"fae","steel","beetle","crawler"),
            new creatureChar(this.engine,0,0,0,"fae","steel","beetle","crawler"),
        ];

        this.activeChars[1][0] = _parties[1][0];
        this.activeChars[1][1] = _parties[1][1];

        

    }
    

    combatLoop = () => {

        switch (this.fightPhase){
            case "start":
                 
            break;
            case "choice":
                 
            break;
        }

    }

    actionChoiceFunction = (context:CanvasRenderingContext2D) => {

            for (let i=0; i < this.actionButtons.length; i++)
            {
                let currentButton = this.actionButtons[i];
                currentButton.drawFunction(context);
                if (currentButton.clicked > 0)
                {
                    this.playerChoices[1][0] = 1;
                    this.choicePhase += 1;
                    currentButton.clicked = 0;
                }
            } 

            for (let i=0; i < this.protectButtons.length; i++)
            {
                let currentButton = this.protectButtons[i];
                currentButton.drawFunction(context);
                if (currentButton.clicked > 0)
                {
                    this.playerChoices[1][0] = 1;
                    this.choicePhase += 1;
                    currentButton.clicked = 0;
                }
            } 

            for (let i=0; i < this.switchButtons.length; i++)
            {
                let currentButton = this.switchButtons[i];
                currentButton.drawFunction(context);
                if (currentButton.clicked > 0)
                {
                    this.playerChoices[1][0] = 1;
                    this.choicePhase += 1;
                    currentButton.clicked = 0;
                }
            }  

            
            if (this.choicePhase == 0)
            {
                this.currentChar = this.activeChars[0][0];
                var _char = this.currentChar;
                if (this.time % 60 < 30)
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
                if (this.time % 60 < 30)
                {
                    context.drawImage(this.selectImg,_char.x-1,_char.y-1,64,64); 
                }
                else
                {
                    context.drawImage(this.selectImg,_char.x-4,_char.y-4,72,72);
                } 
            } 
            

    }

    override drawFunction = (_context:CanvasRenderingContext2D) => {
        
        //draw creatures
        if (this.activeChars[0][0] != undefined)
        {
            let _char = this.activeChars[0][0];
            _char.drawFunction(_context);
        }
        if (this.activeChars[0][1] != undefined)
        {
            let _char = this.activeChars[0][1];
            _char.drawFunction(_context);
        }
        if (this.activeChars[1][0] != undefined)
        {
            let _char = this.activeChars[1][0];
            _char.dir = -1;
            _char.drawFunction(_context);
        }
        if (this.activeChars[1][1] != undefined)
        {
            let _char = this.activeChars[1][1];
            _char.dir = -1;
            _char.drawFunction(_context);
        }


        ///draw buttons, catch their functions
         switch (this.fightPhase)
         {
            case "start":
                break;
            case "choice":
                
                if (this.targetting === null)
                {
                    this.actionChoiceFunction(_context);
                }
                else
                {

                }
                

            break;

            
         }

         
         this.time += 1;
    }


}

export default FightMatch;