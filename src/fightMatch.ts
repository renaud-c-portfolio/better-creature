import gameButton from "./gameButton";
import creatureChar from "./creatureChar";
import gameElement from "./gameElement";

import { monsType, MTYPE } from "./game/types/monsType";
import { shape, MSHAPE } from "./game/shapes/shapes"; 

type FIGHTPH = "start" | "choice" | "actions" | "turnEnd" | "combatEnd";

export class fightMatch extends gameElement {

    fightPhase:FIGHTPH = "choice"; 

    choicePhase = 0;

    
    party:Array<Array<creatureChar>> = []; 
    activeChars:Array<Array<creatureChar>> = []; 

    playerChoices:Array<any> = [[],[]];





    actionButton1 = new gameButton(this.engine,26,246,140,40,"blaze cruncho",0);
    actionButton2 = new gameButton(this.engine,176,246,140,40,"action2",0);
    actionButton3 = new gameButton(this.engine,326,246,140,40,"action3",0);
    actionButton4 = new gameButton(this.engine,476,246,140,40,"action4",0);
    protect1Button = new gameButton(this.engine,356,300,100,40,"protect1",0);
    protect2Button = new gameButton(this.engine,486,300,100,40,"protect2",0);

    switchButton1 = new gameButton(this.engine,66,296,54,54,"switch",0,"labeledImage");
    switchButton2 = new gameButton(this.engine,136,296,54,54,"switch",0,"labeledImage");
    switchButton3 = new gameButton(this.engine,206,296,54,54,"switch",0,"labeledImage");
    switchButton4 = new gameButton(this.engine,276,296,54,54,"switch",0,"labeledImage");

    
    defaultParty = () =>{

        const _parties = this.party; 
        _parties[0] = [];
        _parties[0] = [
            new creatureChar(this.engine,0,0,0,"fae","steel","beetle","crawler"),
            new creatureChar(this.engine,0,0,0,"fae","steel","beetle","crawler"),
            new creatureChar(this.engine,0,0,0,"fae","steel","beetle","crawler"),
            new creatureChar(this.engine,0,0,0,"fae","steel","beetle","crawler"),
            new creatureChar(this.engine,0,0,0,"fae","steel","beetle","crawler"),
            new creatureChar(this.engine,0,0,0,"fae","steel","beetle","crawler"),
        ];
        this.activeChars[0][0] = _parties[0][0];
        this.activeChars[0][1] = _parties[0][0];
        _parties[1] = [
            new creatureChar(this.engine,0,0,0,"fae","steel","beetle","crawler"),
            new creatureChar(this.engine,0,0,0,"fae","steel","beetle","crawler"),
            new creatureChar(this.engine,0,0,0,"fae","steel","beetle","crawler"),
            new creatureChar(this.engine,0,0,0,"fae","steel","beetle","crawler"),
            new creatureChar(this.engine,0,0,0,"fae","steel","beetle","crawler"),
            new creatureChar(this.engine,0,0,0,"fae","steel","beetle","crawler"),
        ];

        this.activeChars[1][0] = _parties[1][0];
        this.activeChars[1][1] = _parties[1][0];

        

    }
    

    combatLoop = () => {

        switch (this.fightPhase){
            case "start":
                 
            break;
            case "choice":
                 
            break;
        }

    }

    override drawFunction = (_context:CanvasRenderingContext2D) => {

         switch (this.fightPhase)
         {
            case "start":
                break;
            case "choice":
                this.actionButton1.drawFunction(_context);
                this.actionButton2.drawFunction(_context);
                this.actionButton3.drawFunction(_context);
                this.actionButton4.drawFunction(_context);
                this.protect1Button.drawFunction(_context);
                this.protect2Button.drawFunction(_context);
                
                this.switchButton1.drawFunction(_context);
                this.switchButton2.drawFunction(_context);
                this.switchButton3.drawFunction(_context);
                this.switchButton4.drawFunction(_context);

                if (this.actionButton1.clicked)
                    {
                        this.playerChoices[1][0] = 1; 
                        this.choicePhase += 1;
                    }
                
                
            break;
         }

    }


}

export default fightMatch;