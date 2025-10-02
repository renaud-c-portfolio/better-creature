import { ClientMatch } from "./ClientMatch"; 
import CreatureChar from "./CreatureChar.ts";
import * as DATA from "./Data.ts";
import { FightAction } from "./FightAction.ts";

type fightPhase = "preStart" | "start" | "choice" | "turnStart" | "actions" | "turnEnd" | "combatEnd" | "turnEndSwitch" | "turnEndSwitchStart" | "emergencySwitchChoice";

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

    turnEventList:Array<Array<FightAction>> = [[]]; 

    clientReady:Array<boolean> = [false,false];
    clientChoices:Array<Array<number>> = [[],[]];

    playerChoices:[[[number,number,number],[number,number,number],],[[number,number,number],[number,number,number],]] = 
    [[[0,0,0],[0,0,0]],[[0,0,0],[0,0,0]]];

    //local match can be null for a server-only setup
    localMatch:ClientMatch|null = null;

    openSheet = false;

    constructor () {
         
    }
    
    
    currentPhase:fightPhase = "start";




    serverCombatSequenceLogic = ( ) => {

        switch(this.currentPhase)
        {
            case "preStart":
                this.serverPreStartLogic();
            break;
            case "start":
                    if (this.clientReady[0] && this.clientReady[1])
                    {

                    }
                break;

            case "choice":
                     
                break;

        }

    }

    serverPreStartLogic = () => {
        /// send creature info to players, only first 2 of your opponents if closed sheets
        for (let i=0; i < this.numPlayers; i++)
        {
             for (let j=0; j < this.numPlayers;j++)
             { 
                let sendInfo = 0;
                if (i == j) {sendInfo = 2;}
                else if (this.openSheet) {sendInfo = 1;}

                let showChars = this.activePerTeam;
                if (sendInfo > 0) {showChars = 99;}

                for (let k =0; k < Math.max(showChars,this.playerParties[j].length);k++)
                {
                    const creature = this.playerParties[j][k];
                    const creatureInfo = this.createCreatureInfo(creature,sendInfo);
                    this.createNewMessage("creature",creatureInfo,i);
                }
             }
        }
        
        this.currentPhase = "start";
        
    }

    validateCreature = () => {

    }

    blankCreatureInfo = () => {
        const info:DATA.CreatureInfo = {
            name: null,
            aspectsAndShapes:null,
            pluses:null,
            player: -1,
            partyIndex: -1,
        };

        return info;
    }

    createCreatureInfo = (creature:CreatureChar,infoLevel:number) => {
        
        const info = this.blankCreatureInfo();
        info.name = creature.name;
        
        info.player = creature.playerOwner;
        info.partyIndex = creature.partyIndex;
        info.aspectsAndShapes = [creature.aspectTypes, creature.shapes];
        
        return info;
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

export type MessageType = "creature" | "action" | "choice" | "message";

export class ServerClientMessage {

    received = false;
    sendAttempts:number = 0;
    
    constructor (public id:number, public type:MessageType, public data:Object, public clientIndex:number) {
        
    }
}

