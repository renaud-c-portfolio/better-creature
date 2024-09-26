import { ClientMatch } from "./ClientMatch";
import { ServerMatch } from "./ServerMatch";

import GameEngine from "./GameEngine";

import { CreatePartyMenu } from "./CreatePartyMenu.ts";

import * as DATA from "./Data.ts";
import { WindowTabs } from "./WindowTabs.ts";
import { WindowEncyclopedia } from "./WindowEncyclopedia.ts";


export class WindowClient {

    gameWidth:number = 640;
    gameHeight:number = 360;

    appDiv:HTMLDivElement;
    canvasDiv = document.createElement("div");
    gameCanvas =  document.createElement("canvas");

    engine:GameEngine = new GameEngine(this.gameCanvas); 
    partyMenu:CreatePartyMenu;

    enclopedia:WindowEncyclopedia = new WindowEncyclopedia();
    tabs:WindowTabs = new WindowTabs();

    clientList:Array<ClientMatch> = []; 
    playerParties:Array<number> = [];

    constructor(appDiv:HTMLDivElement) { 

        this.appDiv = appDiv;
        this.partyMenu = new CreatePartyMenu(this.engine,0,0,-100); 

        this.engine.gameElements.push(this.partyMenu); 
        this.engine.depthList.push(-100);   
        this.engine.startGame(); 
    } 





    newMatch = () => {
         
    }

    closeMatch = () => {

    }

    switchActiveTab = () => {

    }

    startClientWindows = () => {
        this.buildPage();
    }

    resizeWindow = (canvas:HTMLCanvasElement) => {
        
    }

    buildPage = () => { 
               this.canvasDiv.appendChild(this.gameCanvas);
               this.appDiv.appendChild(this.canvasDiv);
               this.gameCanvas.width = this.gameWidth;
               this.gameCanvas.height = this.gameHeight;
               this.gameCanvas.style.width = "1280px";
               this.gameCanvas.setAttribute("image-rendering","pixelated");
               const context = this.gameCanvas.getContext('2d');
               if (context != null)
                { 
                    context.imageSmoothingEnabled = false; 
                } 

                window.addEventListener("resize", (event) => {
                    this.resizeWindow(this.gameCanvas);
                  });
        
    }
}