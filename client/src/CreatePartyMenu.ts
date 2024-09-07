import CreatureChar from "./CreatureChar";
import GameButton from "./GameButton";
import GameElement from "./GameElement";
import GameEngine from "./GameEngine";

import * as DATA from "./Data";
import { ScrollMenu } from "./ScrollMenu";
import { FightAction } from "./FightAction";

export class GameParty {
    public partyName:string = "new party";
    public characterList:Array<CreatureChar> = [];

}

type PartyMenuStep = "basic" | "scrollmenu" | "renameChar";
type PartyPopupTypes = "none" | "renameChar" | "renameCharExtended" | "changeAspect" | "changeShape" | "changeEmptyAspect" | "actionInfo";
 

export class CreatePartyMenu extends GameElement {

    public playerParties:Array<GameParty> = [];
    public selectPartyIndex = 0;
    public currentParty:GameParty|null = null;

    public selectCharIndex = -1;
    public currentChar:CreatureChar|null = null;

    public selectAction:FightAction|null = null;

    public partySize:number = 8;

    createPartyButton:GameButton = new GameButton(this.engine,16,32,160,20,"create party",0,"text");
    testPartyButton:GameButton = new GameButton(this.engine,192,32,60,20,"test",0,"text");
    renamePartyButton:GameButton = new GameButton(this.engine,16,32,160,20,"rename",0,"text");
    addCharButton:GameButton = new GameButton(this.engine,36,32,100,30,"add creature",0,"text");

    actionButtons:Array<GameButton> = [
        new GameButton(this.engine,284,246,160,40,"action1",0,"action"),
        new GameButton(this.engine,456,246,160,40,"action2",0,"action"),
        new GameButton(this.engine,284,296,160,40,"action3",0,"action"),
        new GameButton(this.engine,456,296,160,40,"action4",0,"action")]; 


    aspectButtons:Array<GameButton> = [
        new GameButton(this.engine,350,44,102,26,"fire",0,"aspect"),
        new GameButton(this.engine,460,44,102,26,"fire",0,"aspect"),
    ];

    protectButtons:Array<GameButton> = [
        new GameButton(this.engine,290,246,100,40,"protect1"),
        new GameButton(this.engine,470,246,100,40,"protect2")
    ];
    
    shapeButtons:Array<GameButton> = [
        new GameButton(this.engine,350,74,102,26,"fire",0,"shape"),
        new GameButton(this.engine,460,74,102,26,"fire",0,"shape"),
    ];

 
    tooltipPopup:PartyMenuTooltip;

    createStep:PartyMenuStep = "basic";


    scrollMenu:ScrollMenu = new ScrollMenu(this.engine,100,10,150,240); 

    oldName:string = "";

    changeType = "aspect";
    changeIndex = 0;

    constructor(public engine:GameEngine,public x:number = 0,public y:number = 0,public depth:number = 0){
        super(engine,x,y,depth);  

        this.tooltipPopup =  new PartyMenuTooltip(engine,this,0,0,200,30);
        this.loadParties();
        if (this.playerParties.length > 0)
        {
            this.currentParty = this.playerParties[0];
            this.currentChar = this.currentParty.characterList[0];
        }
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
            for (let i =0; i < this.partySize; i++)
            {
                const newChar = new CreatureChar(this.engine,-100,-100,-55,0);
                newChar.resetStats(); 
                newChar.name = "new creature "+String(i+1);
                this.currentParty.characterList.push(newChar);
            }
            this.currentChar = this.currentParty.characterList[0];
            this.saveParties();
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
            if (numChars > 1)
            {
                this.testPartyButton.drawFunction(context);
                if (this.testPartyButton.clickConfirm)
                {
                    this.engine.currentMatch.party[0] = [...this.currentParty.characterList];
                    this.engine.currentMatch.activeChars[0][0] = this.currentParty.characterList[0];
                    this.engine.currentMatch.activeChars[0][1] = this.currentParty.characterList[1];
                    this.engine.gameElements = [];
                    this.engine.gameElements.push(this.engine.currentMatch);
                }
            }

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
                    this.saveParties();
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
            if (this.engine.MouseInRect(charMenuX+78,charMenuY+2,100,22) && this.createStep === "basic")
                { 
                    
                    this.tooltipPopup.tooltipFunction(charMenuX+68,charMenuY+32,"renameChar");
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
            
            if (this.aspectButtons[0].highlighted)
            {
                this.tooltipPopup.selectAspect = this.currentChar.aspectTypes[0];
                this.tooltipPopup.tooltipFunction(this.aspectButtons[0].x-40,this.aspectButtons[0].y+40,"changeAspect"); 
            }
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
            if (this.aspectButtons[1].highlighted)
                {
                    if (this.currentChar.aspectTypes.length == 1)
                    {
                        this.tooltipPopup.tooltipFunction(this.aspectButtons[0].x-40,this.aspectButtons[0].y+40,"changeEmptyAspect");
                    }
                    else
                    {this.tooltipPopup.selectAspect = this.currentChar.aspectTypes[1];
                    this.tooltipPopup.tooltipFunction(this.aspectButtons[0].x-40,this.aspectButtons[0].y+40,"changeAspect");} 
                }
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
            if (this.shapeButtons[0].highlighted)
            { 
                this.tooltipPopup.selectShape = this.currentChar.shapes[0];
                this.tooltipPopup.tooltipFunction(this.aspectButtons[0].x-40,this.shapeButtons[0].y+40,"changeShape");
            }
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
            if (this.shapeButtons[1].highlighted)
            { 
                this.tooltipPopup.selectShape = this.currentChar.shapes[1];
                this.tooltipPopup.tooltipFunction(this.aspectButtons[0].x-40,this.shapeButtons[0].y+40,"changeShape");
            }
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

            //actions 
            for (let i=0; i < 4; i++)
            {
                const button = this.actionButtons[i];
                button.active = false;
                button.actionLabel = this.currentChar.actions[i];
                button.drawFunction(context);
                if (button.mouseOvering)
                {
                    this.tooltipPopup.tooltipFunction(charMenuX+22,charMenuY+82,"actionInfo");
                    if (this.tooltipPopup.tooltipTime < 20) { this.tooltipPopup.tooltipTime = 25;}
                    this.tooltipPopup.selectAction = this.currentChar.actions[i];
                }
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
                        this.saveParties();
                    }
                else if (this.engine.rightClick > 0)
                    {
                        this.createStep = "basic";
                        this.reactivateButtons();
                        
                    }
            }
            else if (this.createStep === "renameChar" && this.currentChar != null)
                {
                    
                    this.tooltipPopup.tooltipFunction(charMenuX+68,charMenuY+32,"renameCharExtended");
                    this.tooltipPopup.tooltipPrevious = "renameCharExtended";
                    this.tooltipPopup.tooltipTime = 99;
                    if (this.engine.keyPressed === 1)
                        { 
                            const checkAlphaNum = (this.engine.lastKeyChar.toUpperCase() != this.engine.lastKeyChar.toLowerCase() || !Number.isNaN(Number(this.engine.lastKeyChar)));
                            console.log("hello ",Number(this.engine.lastKeyChar))

                            if ( (this.engine.lastKeyChar === " " && this.currentChar.name.length > 0 || this.engine.lastKeyChar != " " && checkAlphaNum)  && this.engine.lastKeyChar.length === 1 && this && this.currentChar.name.length < 16)
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
                                    this.saveParties();
                                }
                            
                        }
                    else if (this.engine.rightClick > 0)
                        {
                            this.currentChar.name = this.oldName;
                            this.createStep = "basic";
                            this.reactivateButtons();
                            this.saveParties();
                        }
                }
                else if (this.engine.rightClick > 0 && this.currentParty != null)
                    {
                        this.jsonParty(this.currentParty)
                    }


            ///draw tooltip
            this.tooltipPopup.drawFunction(context);

    } /// end drawfunction

    jsonParty = (party:GameParty) => { 

    }

    deactivateButtons = () => {
        this.createPartyButton.mouseOverActive = false;
        this.addCharButton.mouseOverActive = false;
        this.testPartyButton.mouseOverActive = false;
        
        for (let i=0 ;i < this.aspectButtons.length; i++)
            {
                this.aspectButtons[i].active = false;
                this.aspectButtons[i].mouseOverActive = false;
                this.shapeButtons[i].active = false;
                this.shapeButtons[i].mouseOverActive = false;
            }  
        for (let i =0 ;i < 4; i++)
        {
            this.actionButtons[i].mouseOverActive = false;
        }
    }

    reactivateButtons = () => {
        this.createPartyButton.mouseOverActive = true;
        this.addCharButton.mouseOverActive = true;
        this.testPartyButton.mouseOverActive = true;

        for (let i=0 ;i < this.aspectButtons.length; i++)
            {
                this.aspectButtons[i].active = true;
                this.aspectButtons[i].mouseOverActive = true;
                this.shapeButtons[i].active = true;
                this.shapeButtons[i].mouseOverActive = true;
                this.aspectButtons[i].outlineColor = "black";
                this.shapeButtons[i].outlineColor = "black";
            } 
            for (let i =0 ;i < 4; i++)
            {
                this.actionButtons[i].mouseOverActive = true;
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

    saveParties = () =>{
        localStorage.setItem("partyNum",String(this.playerParties.length));
        for (let i =0; i < this.playerParties.length; i++)
        {
            const currentSaveParty = this.playerParties[i];
            let partyStr = currentSaveParty.partyName+"@";
            for (let j =0; j < currentSaveParty.characterList.length; j++)
            {
                const currentSaveChar = currentSaveParty.characterList[j];
                partyStr += currentSaveChar.name + "@";
                partyStr += currentSaveChar.aspectTypes[0]+"-";
                if (currentSaveChar.aspectTypes.length > 0)
                {partyStr += currentSaveChar.aspectTypes[1] + "-";}
                else { partyStr+= "none-"}
                partyStr += currentSaveChar.shapes[0] + "-";
                partyStr += currentSaveChar.shapes[1] + "-";
                for (let k = 0; k < currentSaveChar.statPlus.length; k++)
                {
                    partyStr += String(currentSaveChar.statPlus[k]);
                }
            }
            localStorage.setItem("party"+String(i),partyStr);
        }
    }

    loadParties = () => {
        this.playerParties = [];
        const partyNum = Number(localStorage.getItem("partyNum"));
        for (let i=0; i < partyNum; i++)
        {
            let saveStr = localStorage.getItem("party"+String(i));
            if (saveStr != undefined)
            {
                const newParty = new GameParty();
                let saveIndex = saveStr?.indexOf("@");
                newParty.partyName = saveStr?.slice(0,saveIndex);
                saveStr = saveStr.slice(saveIndex+1);
                this.playerParties.push(newParty);
                while (saveStr.indexOf("@") >= 0)
                {
                    const newChar = new CreatureChar(this.engine,-99,-99,0,0);
                    newParty.characterList.push(newChar);
                    saveIndex = saveStr?.indexOf("@");
                    newChar.name = saveStr.slice(0,saveIndex);
                    
                    let checkArray:Array<string> = [...DATA.aspectsList];
                    saveStr = saveStr?.slice(saveIndex+1);
                    saveIndex = saveStr.indexOf("-");
                    let stringo = saveStr.slice(0,saveIndex);
                    let stringoAspect:DATA.aspectsType
                    let stringoShape:DATA.shapesType;
                    console.log("stringo ",stringo)
                    newChar.aspectTypes = [];
                    if (checkArray.includes(stringo))
                    {
                        console.log("catgirls??")
                        stringoAspect = stringo as DATA.aspectsType;
                        newChar.aspectTypes[0] = stringoAspect; 
                    }
                    saveStr = saveStr?.slice(saveIndex+1);

                    saveIndex = saveStr?.indexOf("-"); 
                    stringo = saveStr.slice(0,saveIndex);
                    if (stringo != "none" && checkArray.includes(stringo))
                    {
                        stringoAspect = stringo as DATA.aspectsType;
                        newChar.aspectTypes[1] = stringoAspect; 
                    }
                    saveStr = saveStr?.slice(saveIndex+1);

                    saveIndex = saveStr?.indexOf("-"); 
                    stringo = saveStr.slice(0,saveIndex);
                    checkArray = [...DATA.shapesList];
                    if (checkArray.includes(stringo))
                    {
                        stringoShape = stringo as DATA.shapesType;
                        newChar.shapes[0] = stringoShape; 
                    }
                    saveStr = saveStr?.slice(saveIndex+1);

                    saveIndex = saveStr?.indexOf("-"); 
                    stringo = saveStr.slice(0,saveIndex);
                    checkArray = [...DATA.shapesList];
                    if (checkArray.includes(stringo))
                    {
                        stringoShape = stringo as DATA.shapesType;
                        newChar.shapes[1] = stringoShape; 
                    }
                    saveStr = saveStr?.slice(saveIndex+1);
                    console.log("remains ",saveStr);
                    for (let j =0; j < newChar.statPlus.length; j++)
                    {
                        newChar.statPlus[j] = Number(saveStr[0]);
                        saveStr = saveStr?.slice(1);
                    }
                    console.log("remains2 ",saveStr);


                    
                    newChar.resetStats();
                }
            }
        }
        
    }
}

class PartyMenuTooltip extends GameElement {
 
    
    public tooltipType:PartyPopupTypes = "none";
    public tooltipPrevious:string = "";
    public tooltipTime:number = 0;
    public selectAction:FightAction|null = null;
    public selectAspect:DATA.aspectsType = "none";
    public selectShape:DATA.shapesType = "none";
     
    constructor(engine:GameEngine,public partyMenu:CreatePartyMenu,x:number,y:number,public width:number,public height:number){
        super(engine,x,y,0);
    }


    override drawFunction = (context:CanvasRenderingContext2D) => { 
        if (this.tooltipType === this.tooltipPrevious && this.tooltipType != "none")
        {this.tooltipTime += 1;} 
        else {this.tooltipTime = 0;}

        if (this.tooltipTime > 0)
        {
            const appear = Math.max(0,(this.tooltipTime - 30));
            //context.filter =  "opacity("+String(Math.min(appear/4,0.8))+")"; 
            context.globalAlpha = Math.min(appear/4,0.85);
            context.fillStyle = "black";
            context.fillRect(this.x-2,this.y-2,this.width+4,this.height+4);
            context.fillStyle = "white";
            context.fillRect(this.x,this.y,this.width,this.height); 
            context.globalAlpha = Math.min(appear/4,0.9);
            
            switch(this.tooltipType)
            {
                case "renameChar":
                    this.width = 220;
                    this.height = 20;
                    context.font = "16px '04b03'";
                    context.fillStyle = "blue";
                    context.fillText("click to rename creature",this.x+2,this.y+14);
                break;
                case "renameCharExtended":
                    this.width = 220;
                    this.height = 60;
                    context.font = "16px '04b03'";
                    context.fillStyle = "black";
                    context.fillText("renaming creature",this.x+2,this.y+14);
                    context.fillStyle = "blue";
                    context.fillText("press enter to accept",this.x+2,this.y+32);
                    context.fillText("right click to cancel",this.x+2,this.y+50);
                break;
                case "actionInfo":
                    this.width = 320;
                    this.height = 140;
                    if (this.selectAction != null)
                    {
                        context.font = "16px '04b03'";
                        context.fillStyle = "black";
                        context.fillText(this.selectAction.name.toUpperCase(),this.x+12,this.y+16);
                        context.drawImage(DATA.aspectsRecord[this.selectAction.actionAspect].iconImg,this.x+8,this.y+24);
                        context.fillText(this.selectAction.actionAspect,this.x+24,this.y+36);
                         context.fillRect(this.x+4,this.y+60,312,2)

                        context.fillText(this.selectAction.description,this.x+8,this.y+76);
                        switch(this.selectAction.targetType)
                        {
                            case "single":
                            context.fillText("single target",this.x+12,this.y+52); break; 
                            case "double":
                            context.fillText("target enemies",this.x+12,this.y+52); break;
                            case "aoe":
                            context.fillText("target others",this.x+12,this.y+52); break;
                            case "all":
                            context.fillText("target everyone",this.x+12,this.y+52); break;
                            case "ally":
                            context.fillText("target ally",this.x+12,this.y+52); break;
                            case "self":
                            context.fillText("target self",this.x+12,this.y+52); break;
                            case "front":
                            context.fillText("target front",this.x+12,this.y+52); break;
                            case "diagonal":
                            context.fillText("target diagonal",this.x+12,this.y+52); break;
                            case "other":
                            context.fillText("other target",this.x+12,this.y+52); break;
                        }
                        switch(this.selectAction.actionType)
                        {
                            case "physical":
                                context.drawImage(this.engine.physImage,this.x+138,this.y+23);
                                context.fillText("physical attack",this.x+154,this.y+36);
                                context.fillText("power: "+String(this.selectAction.power),this.x+184,this.y+52);
                                break;
                            case "magical":
                                context.drawImage(this.engine.magImage,this.x+138,this.y+23);
                                context.fillText("magical attack",this.x+154,this.y+36);
                                context.fillText("power: "+String(this.selectAction.power),this.x+184,this.y+52);
                                break;
                            case "strongest":
                                context.drawImage(this.engine.strongestImage,this.x+138,this.y+23);
                                context.fillText("adaptable attack",this.x+154,this.y+36);
                                context.fillText("power: "+String(this.selectAction.power),this.x+184,this.y+52);
                                break;
                            case "status":
                                context.drawImage(this.engine.strongestImage,this.x+138,this.y+23);
                                context.fillText("status action",this.x+154,this.y+36); 
                                break; 
                        }

                    }
                break;
                case "changeAspect":
                    this.width = 320;
                    this.height = 120;
                    context.font = "16px '04b03'";
                    context.fillStyle = "blue";
                    context.fillText("click to change aspect",this.x+2,this.y+14); 
 
                    context.fillStyle = "black";
                    const currentAspect = this.selectAspect;
                    if (currentAspect!= null && currentAspect != "none"){
                        
                        const currentAspectObj = DATA.aspectsRecord[currentAspect];
                        let textLine = 0;
                        context.drawImage(currentAspectObj.iconImg,this.x+4,this.y+22);
                        context.fillText(currentAspectObj.name.toUpperCase(),this.x+20,this.y+34); 
                        context.fillText(currentAspectObj.desc,this.x+20,this.y+50,this.width);  
                        let aspectsString = "";
                        if (currentAspectObj.reverseAttackRecord.strong.length > 0)
                        {
                            currentAspectObj.reverseAttackRecord.strong.map((aspectName) => aspectsString += aspectName+",");
                            context.fillText("STRONG AGAINST: "+aspectsString,this.x+4,this.y+68+textLine*18); 
                            aspectsString = aspectsString.slice(0,aspectsString.length-1);
                            textLine += 1;  
                        }
                        if (currentAspectObj.reverseAttackRecord.resisted.length > 0)
                            {
                                aspectsString = "";
                                currentAspectObj.reverseAttackRecord.resisted.map((aspectName) => aspectsString += aspectName+",");
                                context.fillText("RESISTED BY: "+aspectsString,this.x+4,this.y+68+textLine*18); 
                                textLine += 1;  
                            }

                    }

                    break;

                case "changeShape":
                    this.width = 320;
                    this.height = 120;
                    context.font = "16px '04b03'";
                    context.fillStyle = "blue";
                    context.fillText("click to change shape",this.x+2,this.y+14); 

                    context.fillStyle = "black";
                    const currentShape = this.selectShape;

                    if (currentShape!= "none"){
                        
                        const currentShapeObj = DATA.shapesRecord[currentShape];
                        let textLine = 0; 
                        context.drawImage(currentShapeObj.iconImg,this.x+4,this.y+22);
                        context.fillText(currentShapeObj.name.toUpperCase(),this.x+20,this.y+34); 
                        context.fillText(currentShapeObj.desc,this.x+20,this.y+50,this.width);  
                    }



                    break;
            }
            context.globalAlpha = 1;
        }

        this.tooltipPrevious = this.tooltipType;
        this.tooltipType = "none";
        
    }

    tooltipFunction = (x:number,y:number,tooltipType:PartyPopupTypes) => {
        this.x = x;
        this.y = y;
        this.tooltipType = tooltipType; 

    }

}
