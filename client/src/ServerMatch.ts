import { ClientMatch } from "./ClientMatch"; 
import CreatureChar from "./CreatureChar.ts";
import * as DATA from "./Data.ts";

type fightPhase = "start" | "choice" | "turnStart" | "actions" | "turnEnd" | "combatEnd" | "turnEndSwitch" | "turnEndSwitchStart" | "emergencySwitchChoice";

type partyChoice = [[number],[number],[number] , [number],[number],[number]];

type playerType = "local" | "CPU" | "online";

export class ServerMatch {

    numPlayers:number = 2;
    activePerTeam: number = 2;
    charsPerParty: number = 5;

    playerParties:Array<Array<CreatureChar>> = [[],[]]; 
    activeChars:Array<Array<CreatureChar>> = [[],[]];

    playerTypes:[playerType,playerType] = ["local","CPU"];

    messageIndex = 0;

    allSentMessages:Array<ServerClientMessage> = [];
    sendingMessages:Array<ServerClientMessage> = [];
    receivingMessages:Array<ServerClientMessage> = [];
    allReceivedMessages:Array<ServerClientMessage> = [];


    clientReady:Array<boolean> = [false,false];
    clientChoices:Array<Array<number>> = [[],[]];

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
                    if (this.clientReady[0] && this.clientReady[1])
                    {

                    }
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


    sendCreatureInfo = () => {

        for (let i = 0; i < this.numPlayers; i++)
        {

        }

    }

    createNewMessage = (type:MessageType,data:Object,clientIndex:number) => {
        const newMessage = new ServerClientMessage(this.messageIndex,type,data,clientIndex)
        this.messageIndex += 1;
        this.allSentMessages.push(newMessage);
        this.sendingMessages.push(newMessage); 

        return newMessage;
    }


    sendPendingMessages = () => {
        for (let i=0; i< this.sendingMessages.length; i++)
        {
            const currentMessage = this.sendingMessages[i];

            switch (this.playerTypes[currentMessage.clientIndex])
            {
                case "CPU":

                break;
                case "local":
                    if (this.localMatch != null)
                    {
                        if (this.localMatch.allReceivedMessages.indexOf(currentMessage) != -1)
                        {
                            this.localMatch.receivingMessages.push(currentMessage);
                            this.localMatch.allReceivedMessages.push(currentMessage);
                        }
                    }
                break;
                case "online":

                break;
            }

            currentMessage.sendAttempts += 1;
        }
    }
      
}

export type MessageType = "creature" | "action" | "choice" | "receiveConfirm";

export class ServerClientMessage {

    response:string = "";
    sendAttempts:number = 0;
    
    constructor (public id:number, public type:MessageType, public data:Object, public clientIndex:number) {
        
    }
}

