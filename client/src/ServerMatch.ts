import { ClientMatch } from "./ClientMatch";
import { ServerCreature } from "./ServerCreature";
import * as DATA from "./Data.ts";

type fightPhase = "start" | "choice" | "turnStart" | "actions" | "turnEnd" | "combatEnd" | "turnEndSwitch" | "turnEndSwitchStart" | "emergencySwitchChoice";

type partyChoice = [[number],[number],[number] , [number],[number],[number]];

type playerType = "local" | "CPU" | "online";

export class ServerMatch {

    numPlayers:number = 2;
    activePerTeam: number = 2;
    charsPerParty: number = 6;

    playerParties:Array<Array<ServerCreature>> = [[],[]]; 
    activeChars:Array<Array<ServerCreature>> = [[],[]];

    playerTypes:[playerType,playerType] = ["local","CPU"];

    playerChoices:[[[number,number,number],[number,number,number],],[[number,number,number],[number,number,number],]] = 
    [[[0,0,0],[0,0,0]],[[0,0,0],[0,0,0]]];

    //local match can be null for a server-only setup
    localMatch:ClientMatch|null = null;


    constructor () {
         
    }
    
    
    currentPhase:fightPhase = "start";




    serverCombatSequenceLogic = ( ) => {

        switch(this.currentPhase)
        {
            case "start":
                     
                break;

            case "choice":
                     
                break;

        }

    }

    serverStartLogic = () => {
        for (let i=0; i < this.numPlayers; i++)
        {
            switch (this.playerTypes[i])
            {
                case "local":
                        if (this.localMatch != null)
                        {
                            
                        }
                    break;

                case "CPU":

                    break;

                case "online":

                    break;
            }
        }
    }

    validateCreature = () => {

    }

      
}

