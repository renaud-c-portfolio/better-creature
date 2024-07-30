import CreatureChar from "./CreatureChar";
import GameButton from "./GameButton";
import GameElement from "./GameElement";
import GameEngine from "./GameEngine";

import * as DATA from "./Data";
import { ScrollMenu } from "./ScrollMenu";

export class GameParty {
    public partyName:string = "new party";
    public characterList:Array<CreatureChar> = [];

}

type PartyMenuStep = "basic" | "scrollmenu" | "renameChar";

export class CreatePartyMenu extends GameElement {

    public playerParties:Array<GameParty> = [];
    public selectPartyIndex = 0;
    public currentParty:GameParty|null = null;

    public selectCharIndex = -1;
    public currentChar:CreatureChar|null = null;

    createPartyButton:GameButton = new GameButton(this.engine,16,32,160,20,"create party",0,"text");
    renamePartyButton:GameButton = new GameButton(this.engine,16,32,160,20,"rename",0,"text");
    addCharButton:GameButton = new GameButton(this.engine,36,32,100,30,"add creature",0,"text");

    actionButtons:Array<GameButton> = [
        new GameButton(this.engine,290,246,140,40,"action1",0,"action"),
        new GameButton(this.engine,470,246,140,40,"action2",0,"action"),
        new GameButton(this.engine,290,296,140,40,"action3",0,"action"),
        new GameButton(this.engine,470,296,140,40,"action4",0,"action")]; 


    aspectButtons:Array<GameButton> = [
        new GameButton(this.engine,350,44,96,26,"fire",0,"aspect"),
        new GameButton(this.engine,460,44,96,26,"fire",0,"aspect"),
    ];

    protectButtons:Array<GameButton> = [
        new GameButton(this.engine,290,246,100,40,"protect1"),
        new GameButton(this.engine,470,246,100,40,"protect2")
    ];
    
    shapeButtons:Array<GameButton> = [
        new GameButton(this.engine,350,74,96,26,"fire",0,"shape"),
        new GameButton(this.engine,460,74,96,26,"fire",0,"shape"),
    ];

    createStep:PartyMenuStep = "basic";


    scrollMenu:ScrollMenu = new ScrollMenu(this.engine,100,10,150,240); 

    oldName:string = "";

    changeType = "aspect";
    changeIndex = 0;

    constructor(public engine:GameEngine,public x:number = 0,public y:number = 0,public depth:number = 0){
        super(engine,x,y,depth);  
    }


    


    override drawFunction = (context:CanvasRenderingContext2D) => {

        

        document.body.style.cursor = 'default';
        //select party
        context.filter = "none";
        context.fillStyle = "black";
        context.font = "16px '04b03'";
        context.letterSpacing = "-1px";  
        context.fillText("Current Party: ",10,20);

        //party display
        const partyMenuY = 60;
        context.beginPath();
        context.roundRect(12,partyMenuY,240,260,5);
        context.closePath();
        context.fill();
        
        context.fillStyle = "rgb(230,215,200)";
        context.beginPath();
        context.roundRect(14,partyMenuY+2,236,256,5);
        context.closePath();
        context.fill();
 
        this.createPartyButton.drawFunction(context);
        if (this.createPartyButton.clickConfirm)
        {
            this.createPartyButton.clickConfirm = 0;
            const newParty = new GameParty();
            this.playerParties.push(newParty);
            newParty.partyName += String(this.playerParties.length);
            this.currentParty = newParty;
        }

        if (this.playerParties.length > 1)
        {
            if (this.engine.wheel > 0)
            {
                this.selectPartyIndex += 1;
                if (this.selectPartyIndex >= this.playerParties.length)
                {this.selectPartyIndex = this.playerParties.length-1;}
                this.currentParty = this.playerParties[this.selectPartyIndex];
            }
            else if (this.engine.wheel < 0)
            {
                this.selectPartyIndex -= 1;
                if (this.selectPartyIndex < 0)
                {this.selectPartyIndex = 0;}
                this.currentParty = this.playerParties[this.selectPartyIndex];
            }
        }

        if (this.currentParty != null) ///display party
        {
            context.fillStyle = "rgb(0,0,110)";
            context.fillText(this.currentParty.partyName,120,20);
            const numChars = this.currentParty.characterList.length;
            for (let i =0; i < numChars;i++)
            {
                const partyChar = this.currentParty.characterList[i];
                if (this.engine.MouseInRect(22+i%2*112,partyMenuY+8+Math.floor(i/2)*60,106,50) && this.createStep === "basic")
                {
                    document.body.style.cursor = 'pointer';
                    context.filter = "brightness(1.3)";
                    if (this.engine.leftClick > 0)
                    {
                        this.currentChar = partyChar;
                    }
                }
                if (partyChar === this.currentChar)
                {
                    context.fillStyle = "rgb(255,120,20)";
                    context.beginPath();
                    context.roundRect(20+i%2*112,partyMenuY+6+Math.floor(i/2)*60,110,54,5);
                    context.closePath();
                    context.fill();
                }
                context.fillStyle = "rgb(128,160,128)";
                context.beginPath();
                context.roundRect(22+i%2*112,partyMenuY+8+Math.floor(i/2)*60,106,50,5);
                context.closePath();
                context.fill();
                if (partyChar.loaded)
                {context.drawImage(partyChar.imageElem,26+i%2*112,partyMenuY+21+Math.floor(i/2)*60);} 
                context.drawImage(DATA.aspectsRecord[partyChar.aspectTypes[0]].iconImg,66+i%2*112,partyMenuY+21+Math.floor(i/2)*60);
                if (partyChar.aspectTypes.length > 1)
                    {context.drawImage(DATA.aspectsRecord[partyChar.aspectTypes[1]].iconImg,81+i%2*112,partyMenuY+21+Math.floor(i/2)*60);}
                context.drawImage(DATA.shapesRecord[partyChar.shapes[0]].iconImg,96+i%2*112,partyMenuY+21+Math.floor(i/2)*60);
                context.drawImage(DATA.shapesRecord[partyChar.shapes[1]].iconImg,111+i%2*112,partyMenuY+21+Math.floor(i/2)*60);

                context.font = "8px '04b03'";
                context.letterSpacing = "0px";  
                
                context.fillStyle = "black";
                context.fillText(partyChar.name,32+i%2*112,partyMenuY+17+Math.floor(i/2)*60);
                context.filter = "none";
            }
            if (numChars < 8)
            {
                this.addCharButton.x = 24+numChars%2*112;
                this.addCharButton.y = 76+Math.floor(numChars/2)*60;
                this.addCharButton.drawFunction(context);
                if (this.addCharButton.clickConfirm)
                {
                    this.addCharButton.clickConfirm = 0;
                    const newChar = new CreatureChar(this.engine,-100,-100,-55,0);
                    newChar.resetStats();
                    this.currentChar = newChar;
                    this.currentParty.characterList.push(newChar);
                }
            } 
        } 

        const charMenuX = 270;
        const charMenuY = 10;
        context.beginPath();
        context.roundRect(charMenuX,charMenuY,360,340,5);
        context.closePath();
        context.fill();
        
        context.fillStyle = "rgb(230,215,200)";
        context.beginPath();
        context.roundRect(charMenuX+2,charMenuY+2,356,336,5);
        context.closePath();
        context.fill();

        if (this.currentChar != null)
        {
            context.drawImage(this.currentChar.imageElem,charMenuX+6,charMenuY+6,64,64);
            context.font = "24px '04b03'";
            context.letterSpacing = "0px";  
            
            context.fillStyle = "black";
            if (this.engine.MouseInRect(charMenuX+78,charMenuY+2,100,22))
                { 
                    document.body.style.cursor = 'pointer';
                    context.fillStyle = "orange";
                    if (this.engine.leftClick > 0)
                        {
                            this.engine.leftClick = 0;
                            this.createStep = "renameChar";
                            this.deactivateButtons();
                            this.oldName = this.currentChar.name;
                        }
                }
            if (this.createStep === "renameChar")
                {
                    
                    context.fillStyle = "blue";
                    context.fillText(this.currentChar.name+"_",charMenuX+78,charMenuY+24);   
                }
                else
                {
                    context.fillText(this.currentChar.name,charMenuX+78,charMenuY+24); 
                }

            this.aspectButtons[0].aspectLabel = this.currentChar.aspectTypes[0];
            this.aspectButtons[0].drawFunction(context);
            
            if (this.aspectButtons[0].clickConfirm)
                {
                    this.aspectButtons[0].clickConfirm = 0;
                    this.aspectButtons[0].outlineColor = "rgb(255,100,0)"; 
                    this.changeIndex = 0;
                    this.scrollMenu.checkType = "aspect";
                    this.createStep = "scrollmenu";
                    this.deactivateButtons();
                }

            if (this.currentChar.aspectTypes.length < 2)
            {this.aspectButtons[1].aspectLabel = this.currentChar.aspectTypes[0]; context.globalAlpha = 0.5;}
            else{this.aspectButtons[1].aspectLabel = this.currentChar.aspectTypes[1];}
            this.aspectButtons[1].drawFunction(context);
            if (this.aspectButtons[1].clickConfirm)
                {
                    this.aspectButtons[1].clickConfirm = 0;
                    this.aspectButtons[1].outlineColor = "rgb(255,100,0)";
                    this.changeIndex = 1; 
                    this.scrollMenu.checkType = "aspect";
                    this.createStep = "scrollmenu";
                    this.deactivateButtons();
                }
            context.globalAlpha = 1;

            this.shapeButtons[0].shapeLabel = this.currentChar.shapes[0];
            this.shapeButtons[0].drawFunction(context);
            if (this.shapeButtons[0].clickConfirm)
            {
                this.shapeButtons[0].clickConfirm = 0; 
                this.shapeButtons[0].outlineColor = "rgb(255,100,0)";
                
                this.changeIndex = 0; 
                this.scrollMenu.checkType = "shape";
                this.createStep = "scrollmenu";
                this.deactivateButtons();
            }
            this.shapeButtons[1].shapeLabel = this.currentChar.shapes[1];
            this.shapeButtons[1].drawFunction(context);
            if (this.shapeButtons[1].clickConfirm)
            {
                this.shapeButtons[1].clickConfirm = 0;
                this.shapeButtons[1].outlineColor = "rgb(255,100,0)";
                
                this.changeIndex = 1; 
                this.scrollMenu.checkType = "shape";
                this.createStep = "scrollmenu";
                this.deactivateButtons();
            }

            ///stats
            context.fillStyle = "black";
            context.fillText("HP",charMenuX+22,charMenuY+112);
            context.fillText("Agility",charMenuX+22,charMenuY+112+18*1);
            context.fillText("Speed",charMenuX+22,charMenuY+112+18*2); 

            context.fillText("Strength",charMenuX+22,charMenuY+112+18*3);
            context.fillText("Armor",charMenuX+22,charMenuY+112+18*4);
            context.fillText("Magic",charMenuX+22,charMenuY+112+18*5); 
            context.fillText("Resistance",charMenuX+22,charMenuY+112+18*6); 
            context.fillStyle = "rgb(0,0,110)";
            context.fillText(String(this.currentChar.maxHP),charMenuX+108,charMenuY+112);
            context.fillText(String(this.currentChar.dodgeMax),charMenuX+108,charMenuY+112+18*1);
            context.fillText(String(this.currentChar.speed),charMenuX+108,charMenuY+112+18*2); 

            context.fillText(String(this.currentChar.muscle),charMenuX+108,charMenuY+112+18*3);
            context.fillText(String(this.currentChar.armor),charMenuX+108,charMenuY+112+18*4);
            context.fillText(String(this.currentChar.magic),charMenuX+108,charMenuY+112+18*5); 
            context.fillText(String(this.currentChar.resistance),charMenuX+108,charMenuY+112+18*6);

            let plusRemain = 3;
            for (let i=0; i < 7; i++)
            { 
                if (this.currentChar.statPlus[i] > 0)
                {
                    
                    let plus = "!";
                    plusRemain -= 1;
                    if (this.currentChar.statPlus[i] > 1){plus += "!"; plusRemain -= 2;}

                    if (this.engine.MouseInRect(charMenuX+134,charMenuY+106+18*i-8,10,16) && this.createStep === "basic")
                    {
                        document.body.style.cursor = 'pointer';
                        context.strokeStyle = "rgb(255,0,0)";
                        context.strokeText(plus,charMenuX+137,charMenuY+112+18*i); 
                        if (this.engine.leftClick > 0)
                            {
                                this.currentChar.statPlus[i] = 0;
                                this.engine.leftClick = 0;
                                this.currentChar.resetStats();
                            }
                        
                    }
                    context.fillText(plus,charMenuX+136,charMenuY+112+18*i); 
                }
            }
            for (let i=0; i < 7; i++)
            {
                if (plusRemain > this.currentChar.statPlus[i])
                {
                    if (this.engine.MouseInRect(charMenuX+144,charMenuY+111+18*i-8,8,16) && this.createStep === "basic")
                    {
                        document.body.style.cursor = 'pointer';
                        context.strokeStyle = "rgb(50,255,25)";
                        context.strokeText("+",charMenuX+146,charMenuY+112+18*i); 
                        if (this.engine.leftClick > 0)
                        { 
                            this.currentChar.statPlus[i] += 1;
                            this.engine.leftClick = 0;
                            this.currentChar.resetStats();
                        }
                    }
                    context.fillStyle = "blue";
                    context.fillText("+",charMenuX+145,charMenuY+112+18*i);
                }
            }

            //item
            context.fillStyle = "black";
            context.fillText("ITEM: ",charMenuX+192,charMenuY+112);
            context.fillText("ITEM2: ",charMenuX+192,charMenuY+130);
            context.fillText("SKILL1: ",charMenuX+192,charMenuY+148);
            context.fillText("SKILL2: ",charMenuX+192,charMenuY+164);
            context.fillText("SOUL: ",charMenuX+192,charMenuY+182);
            context.fillText("HALFSOUL: ",charMenuX+192,charMenuY+200); 

            for (let i=0; i < 4; i++)
            {
                const button = this.actionButtons[i];
                button.active = false;
                button.actionLabel = this.currentChar.actions[i];
                button.drawFunction(context);
            }
        }
        
        
        if (this.createStep === "scrollmenu") ///scroll menu choosing aspect / shapes / other in future
            {

                context.fillStyle = "black";
                this.shadowCenterButton(context,this.aspectButtons[this.changeIndex]); 
                this.scrollMenu.drawFunction(context);
                if (this.scrollMenu.indexClicked >= 0)
                    {
                        switch (this.scrollMenu.checkType)
                        {
                            case "aspect":
                                if (this.currentChar != null)
                                    {
                                        this.currentChar.aspectTypes[this.changeIndex] = DATA.aspectsList[this.scrollMenu.indexClicked]; 
                                        this.currentChar.resetStats();
                                        this.engine.leftClick = 0;
                                    } 
                            break;
                            case "shape":
                                if (this.currentChar != null)
                                    {
                                        const otherIndex = Math.abs(this.changeIndex-1);
                                        if (this.currentChar.shapes[otherIndex] === DATA.shapesList[this.scrollMenu.indexClicked]){
                                            this.currentChar.shapes[otherIndex] = this.currentChar.shapes[this.changeIndex];
                                        }
                                        this.currentChar.shapes[this.changeIndex] = DATA.shapesList[this.scrollMenu.indexClicked]; 
                                        this.currentChar.resetStats();
                                        this.engine.leftClick = 0;

                                    } 
                            break;
                        }
                        this.createStep = "basic";
                        this.reactivateButtons();
                    }
                else if (this.engine.rightClick > 0)
                    {
                        this.createStep = "basic";
                        this.reactivateButtons();
                        
                    }
            }
            else if (this.createStep === "renameChar" && this.currentChar != null)
                {
                    if (this.engine.keyPressed === 1)
                        {
                            if (this.engine.lastKeyChar.length === 1 && this.currentChar.name.length < 16)
                                {
                                    this.currentChar.name += this.engine.lastKeyChar; 
                                }
                            else if (this.engine.lastKeyChar === "Backspace" && this.currentChar.name.length > 0)
                                {
                                    this.currentChar.name = this.currentChar.name.slice(0,this.currentChar.name.length-1);
                                }
                            else if (this.engine.lastKeyChar === "Enter" && this.currentChar.name.length > 0)
                                {
                                    this.currentChar.name = this.engine.censorship(this.currentChar.name);
                                    this.createStep = "basic";
                                    this.reactivateButtons();
                                }
                            
                        }
                    else if (this.engine.rightClick > 0)
                        {
                            this.currentChar.name = this.oldName;
                            this.createStep = "basic";
                            this.reactivateButtons();
                        }
                }
                else if (this.engine.rightClick > 0 && this.currentParty != null)
                    {
                        this.jsonParty(this.currentParty)
                    }

    } /// end drawfunction

    jsonParty = (party:GameParty) => { 

    }

    deactivateButtons = () => {
        this.createPartyButton.active = false;
        this.addCharButton.active = false;
        for (let i=0 ;i < this.aspectButtons.length; i++)
            {
                this.aspectButtons[i].active = false;
                this.shapeButtons[i].active = false;
            }  
    }

    reactivateButtons = () => {
        this.createPartyButton.active = true;
        this.addCharButton.active = true;
        for (let i=0 ;i < this.aspectButtons.length; i++)
            {
                this.aspectButtons[i].active = true;
                this.shapeButtons[i].active = true;
                this.aspectButtons[i].outlineColor = "black";
                this.shapeButtons[i].outlineColor = "black";
            } 
    } 


    shadowCenterButton = (context:CanvasRenderingContext2D,button:GameButton) => {

                context.globalAlpha = 0.6;
                context.fillRect(0,0,640,button.y); 
                context.fillRect(0,button.y+button.height,640,360);
                context.fillRect(0,button.y,button.x,button.height); 
                context.fillRect(button.x+button.width,44,999,button.height); 
                context.globalAlpha = 1;

    }
}
