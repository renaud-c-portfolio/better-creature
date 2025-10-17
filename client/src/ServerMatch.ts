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
    totalPerParty: number = 8;

    serverActive = false;
    serverTicks = 0;

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
    
    
    currentPhase:fightPhase = "preStart";




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

    
    serverTickUpdate = () => {

        //console.log("server tick update "+String(this.serverTicks))
        this.serverTicks += 1;

        this.serverCombatSequenceLogic(); 
        this.sendPendingMessages();

        if (this.serverActive)
        {
            setTimeout(()=>{
                this.serverTickUpdate(); 
            },500)
        }
        
    }

    initCreatures = () => {

        for (let i=0; i < this.numPlayers; i++)
        {
            for (let j=0;j < Math.min(this.playerParties[i].length,this.totalPerParty); j++)
            {
                const creature = this.playerParties[i][j];
                creature.playerOwner = i; 
                creature.partyIndex = j;  
                if (i===j)
                {
                    creature.knownInfo[i] = (creature.fullInfoKnown(true));
                }
                console.log("creature inited",creature.playerOwner);
            }
        }
    }

    serverPreStartLogic = () => {
        /// send creature info to players, only first 2 of your opponents if closed sheets  
        this.initCreatures();

        for (let i=0; i < this.numPlayers; i++)
        {
            if (this.playerTypes[i] === "local")
            { 
                for (let j=0; j < this.numPlayers;j++)
                { 
                    let sendInfo = 0;
                    if (i == j) {sendInfo = 2;}
                    else if (this.openSheet) {sendInfo = 1;}

                    let showChars = this.activePerTeam;
                    if (sendInfo > 0) {showChars = this.totalPerParty;}

                    for (let k =0; k < showChars;k++)
                    {
                        const creature = this.playerParties[j][k];

                        creature.knownInfo[i].aspects = true;
                        creature.knownInfo[i].shapes = true;
 
                        const creatureInfo = this.createCreatureInfo(creature,sendInfo);
                        this.createNewMessage("creature",creatureInfo,i);
                        console.log("sending creature to client"+String(i)+": #"+String(j)+"'s "+creature.name);
                    }
                }

            }
        } 

        this.currentPhase = "start";
        
    }

    validateCreature = () => {

    } 

    copyCreatureParty = (party:Array<CreatureChar>) => {

        const newParty:Array<CreatureChar> = [];
        
        for (let i=0; i < party.length; i++)
        {
            const oldCreature = party[i];
            const newCreature = this.newCreatureCopy(oldCreature);

            newParty.push(newCreature);
        }

        return newParty;
    }


    newCreatureCopy = (creature:CreatureChar) => {
        const newCreature = new CreatureChar();

        newCreature.name = creature.name;
        newCreature.statPlus = creature.statPlus.slice();
        newCreature.aspectTypes = creature.aspectTypes.slice();
        newCreature.shapes = creature.shapes.slice();
        newCreature.partyIndex = creature.partyIndex;
        newCreature.playerOwner = creature.playerOwner;

        return newCreature;
    }

    newCreatureFromInfo = (info:DATA.CreatureInfo) => {

        const creature = new CreatureChar()
        if (info.name != null)
        {creature.name = info.name;}
        if (info.aspectsAndShapes!= null)
        {
            creature.aspectTypes = info.aspectsAndShapes[0];
            creature.shapes = info.aspectsAndShapes[1];
        } 
        if (info.pluses != null)
        {
            creature.statPlus = info.pluses;
        }
        creature.playerOwner = info.player;
        creature.partyIndex = info.partyIndex;

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


    createActionInfo = () => {
        
        

    }

    createCreatureInfo = (creature:CreatureChar,infoLevel:number) => {
        
        const info = this.blankCreatureInfo();
        info.name = creature.name; 
        info.player = creature.playerOwner;
        info.partyIndex = creature.partyIndex;
        info.aspectsAndShapes = [creature.aspectTypes, creature.shapes];
        console.log("info creatured",info)
        return info;

    }

    createNewMessage = (type:MessageType,data:Object,clientIndex:number) => {
        const newMessage = new ServerClientMessage(this.messageIndex,type,data,clientIndex)
        this.messageIndex += 1;
        this.allSentMessages.push(newMessage);
        this.sendingMessages.push(newMessage);  
        return newMessage;
    }

    confirmSentMessageReceived = (messageId:number) => { 
        let messageConfirmed = false;
        for (let i=0; i < this.sendingMessages.length;i++)
        {
            const message = this.sendingMessages[i];
            if (message.id === messageId)
            {
                message.received = true;
                messageConfirmed = true; 
                console.log("message "+String(messageId)+" received")
                this.sendingMessages.splice(i,1);
                break;
            }
        }
        if (!messageConfirmed)
        {
            console.log("message "+String(messageId)+" not in pending list but confirmation received");
        }
    }

    receiveClientMessages = () => {
        for (let i=0; i < this.receivingMessages.length; i++)
        {

        }
    }


    sendPendingMessages = () => {
        for (let i=0; i< this.sendingMessages.length; i++)
        {
            const currentMessage = this.sendingMessages[i];
            console.log("sending pending message id "+String(currentMessage.id) +" to player "+String(i)+", a "+this.playerTypes[currentMessage.clientIndex]);
            switch (this.playerTypes[currentMessage.clientIndex])
            {
                case "CPU": 

                break;
                case "local":
                    if (this.localMatch != null)
                    {
                        console.log("local match")
                        if (this.localMatch.allReceivedMessages.indexOf(currentMessage) === -1)
                        {
                            this.localMatch.receivingMessages.push(currentMessage);
                            this.localMatch.allReceivedMessages.push(currentMessage);
                            console.log("local match sent message")
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

