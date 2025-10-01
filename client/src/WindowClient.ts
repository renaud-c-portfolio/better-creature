import { ClientMatch } from "./ClientMatch";
import { ServerMatch } from "./ServerMatch";

import GameEngine from "./GameEngine";
import GameElement from "./GameElement.ts";

import { CreatePartyMenu } from "./CreatePartyMenu.ts";

import * as DATA from "./Data.ts";



import { WindowTabs } from "./WindowTabs.ts";
import { WindowEncyclopedia } from "./WindowEncyclopedia.ts";

export type WindowTabType = "createMenu" | "battle";

export class WindowClient {

    gameWidth:number = 640;
    gameHeight:number = 360;

    headerBaseHeight:number = 40;


    //store all player parties here, as well as on local storage data when modified thru party builder menu
    playerParties:Array<number> = [];
    selectPartyIndex:number = 0;

    //creating html elements to display game page
    appDiv:HTMLDivElement;
    canvasDiv = document.createElement("div");
    gameCanvas =  document.createElement("canvas");

    leftContainerDiv = document.createElement("div");
    rightContainerDiv = document.createElement("div");

    gameTabHeaderDiv = document.createElement("div");
    partyBuilderTab:WindowGameTab; 
    currentTab:WindowGameTab;

    loginHeaderDiv = document.createElement("div");
    infoAreaDiv = document.createElement("div");
    
    infoTabsDiv = document.createElement("div");

    encyclopediaTab = new WindowInfoTab("encyclopedia");
    battleHistoryTab = new WindowInfoTab("battle");
    friendsTab = new WindowInfoTab("friends");
    settingsTab = new WindowInfoTab("settings");


    fightMatches:Array<ClientMatch> = [];

    //creating game engine, party menu and other info menu object instances 
    engine:GameEngine = new GameEngine(this.gameCanvas); 
    partyMenu:CreatePartyMenu; 

    encyclopedia:WindowEncyclopedia = new WindowEncyclopedia();

    tabs:WindowTabs = new WindowTabs();


    clientMatchList:Array<ClientMatch> = []; 

    constructor(appDiv:HTMLDivElement) { 

        this.appDiv = appDiv;
        this.partyMenu = new CreatePartyMenu(this.engine,this); 
        this.partyBuilderTab = new WindowGameTab(this,"createMenu",this.partyMenu,"party builder");
        this.currentTab = this.partyBuilderTab;
        this.engine.gameElements.push(this.partyMenu); 
        this.engine.depthList.push(-100);   
        //this.createNewMatch("cpu","local","cpu");
        this.engine.startGame(); 
    } 



    createNewLocalMatch = (matchType:DATA.MatchType,player1:DATA.PlayerControl,player2:DATA.PlayerControl):[ClientMatch,ServerMatch] => {
         const newMatch = new ClientMatch(this.engine,false);
         const newServer = new ServerMatch();
         const matchTab = new WindowGameTab(this,"battle",newMatch,"test battle 0");
         this.gameTabHeaderDiv.appendChild(matchTab.htmlElement);
         let percent = 20;
         matchTab.htmlElement.style.left = String(percent)+"%"; 

         return [newMatch,newServer]; 
    } 

    closeMatch = () => {

    }

    switchActiveTab = (tab:WindowGameTab) => { 
        this.engine.gameElements = [];
        this.currentTab.htmlElement.classList.remove("selected");

        this.currentTab = tab;
        tab.htmlElement.classList.add("selected");
        this.engine.gameElements.push(tab.tabGameElement);
        if (tab === this.partyBuilderTab)
        {
            this.partyBuilderTab.htmlElement.classList.add("selected");
            this.currentTab = this.partyBuilderTab;
            this.engine.gameElements.push(this.partyMenu);
        }
        else
        {
            this.currentTab = tab;
        }
    }

    startClientWindows = () => {
        this.buildPage();
    }

    resizeWindow = () => {
        let ratio = Math.floor(Math.max(this.gameWidth,window.innerWidth)/(this.gameWidth*1.3));
        let ratio2 = Math.floor(Math.max(this.gameHeight,window.innerHeight)/(this.gameHeight)); 
        let finalRatio = 1;
        if (ratio2 >= ratio)
        {  finalRatio = ratio; }
        else
        { finalRatio = ratio2; } 
        if (finalRatio < 1) {finalRatio = 1;}

        this.gameCanvas.style.width= String(this.gameWidth*finalRatio)+"px";
        
        this.gameTabHeaderDiv.style.height = String(this.headerBaseHeight*finalRatio)+"px";
        this.gameTabHeaderDiv.style.fontSize = String(16*finalRatio)+"px";

        this.partyBuilderTab.htmlElement.style.height = String((this.headerBaseHeight-3)*finalRatio)+"px";
        this.loginHeaderDiv.style.height = String(this.headerBaseHeight*finalRatio)+"px";

        this.infoAreaDiv.style.height = String((this.gameHeight-29)*finalRatio)+"px";
        this.infoTabsDiv.style.height = String(26*finalRatio)+"px";
        this.infoTabsDiv.style.fontSize = String(8*finalRatio)+"px";

    }

    buildPage = () => { 
        
               this.appDiv.appendChild(this.leftContainerDiv);
               this.rightContainerDiv.style.background = "black";
               this.rightContainerDiv.style.width = "100%";

               this.gameTabHeaderDiv.style.height = "100px";
               this.gameTabHeaderDiv.appendChild(this.partyBuilderTab.htmlElement); 
               this.partyBuilderTab.htmlElement.classList.add("selected");
               this.leftContainerDiv.appendChild(this.gameTabHeaderDiv);
               this.leftContainerDiv.appendChild(this.canvasDiv); 
                
               this.canvasDiv.appendChild(this.gameCanvas);

               this.gameCanvas.width = this.gameWidth;
               this.gameCanvas.height = this.gameHeight;
               this.gameCanvas.style.width = "1280px";
               this.gameCanvas.setAttribute("image-rendering","pixelated"); 
               const context = this.gameCanvas.getContext('2d');
               if (context != null)
                { 
                    context.imageSmoothingEnabled = false; 
                }   

                
               this.appDiv.appendChild(this.rightContainerDiv);

               this.rightContainerDiv.appendChild(this.loginHeaderDiv);
               this.loginHeaderDiv.style.height = "100px";
               this.loginHeaderDiv.classList.add("loginarea");
               
               this.rightContainerDiv.appendChild(this.infoAreaDiv);
               this.infoAreaDiv.classList.add("infoarea");
               
               this.rightContainerDiv.appendChild(this.infoTabsDiv);
               this.infoTabsDiv.classList.add("infotabcontainer");

               this.infoTabsDiv.appendChild(this.encyclopediaTab.htmlElement);
               this.encyclopediaTab.htmlElement.classList.add("selected");
               this.encyclopediaTab.htmlElement.style.width = "31%";
               this.infoTabsDiv.appendChild(this.battleHistoryTab.htmlElement);
               this.infoTabsDiv.appendChild(this.friendsTab.htmlElement);
               this.infoTabsDiv.appendChild(this.settingsTab.htmlElement);
               
        
               this.resizeWindow();
                window.addEventListener("resize", (event) => {
                    this.resizeWindow();
                  });
        
    }
}

class WindowGameTab { 
 

    htmlElement = document.createElement("div");   

    constructor (clientWindow:WindowClient,public tabType:WindowTabType,public tabGameElement:GameElement,label:string) { 
        this.htmlElement.classList.add("gametab"); 
        this.htmlElement.innerText = label;

        this.htmlElement.addEventListener("click",(event)=>{
            console.log("helo");
            clientWindow.switchActiveTab(this);
        })
    }
}

class WindowInfoTab { 

    htmlElement = document.createElement("div");  
    constructor (label:string) { 
        this.htmlElement.classList.add("infotab"); 
        this.htmlElement.innerText = label;
    } 

}