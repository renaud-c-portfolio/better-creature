import './style.css'  

import GameEngine from './GameEngine';
import { ClientMatch } from './ClientMatch';
import { CreatePartyMenu } from './CreatePartyMenu';
import { WindowClient } from './WindowClient';

const gameWidth = 640;
const gameHeight = 360;


const headerBar = document.createElement("div");
const partyBuildTab = document.createElement("div");
const leftContainer = document.createElement("div");

const activeMatchTab = document.createElement("div");
const activeMatchTab2 = document.createElement("div");

const rightContainer = document.createElement("div");
const loginArea = document.createElement("div");
const infoArea = document.createElement("div");

const infoTabs = document.createElement("div");
const encycloTab = document.createElement("div");
const friendsTab = document.createElement("div");
const battleTab = document.createElement("div"); 
const settingsTab = document.createElement("div"); 

const canvasDiv = document.createElement("div");
const gameCanvas =  document.createElement("canvas"); 

const StartApp = async () => { 
    const appDiv = document.getElementById("app") as HTMLDivElement;
    if (appDiv != null)
    {
      const clientWindow = new WindowClient(appDiv);
      clientWindow.startClientWindows();
    }
    else
    {
      console.log("appDiv not found");
    }
}

const OldStartApp = async () => {

  leftContainer.setAttribute("class","leftcontainer"); 
  leftContainer.style.width = String(gameWidth)+"px"; 
 
  rightContainer.setAttribute("class","rightcontainer");
  rightContainer.style.right = "0px";   


  loginArea.setAttribute("class","loginarea"); 
  loginArea.innerHTML = "<span>NOT LOGGED IN</span> <button class='loginbutton'>LOGIN</button>"
  loginArea.style.fontSize = "32px"; 
  loginArea.style.height = String(Math.floor(gameHeight/4)+15)+"px";
  rightContainer.appendChild(loginArea);

  infoArea.setAttribute("class","infoarea");  
  infoArea.style.height = "655px";
  rightContainer.appendChild(infoArea);
  
  infoTabs.setAttribute("class","infotabcontainer");
  infoTabs.style.height= "60px";
  infoTabs.style.width = "100%";
  rightContainer.appendChild(infoTabs); 
  
  encycloTab.classList.add("infotab","selected");
  encycloTab.innerText = "encyclopedia";
  encycloTab.style.fontSize = "24px"; 
  encycloTab.style.width = "31%";
  
  encycloTab.addEventListener("click", ()=>{
    changeInfoTab(encycloTab);
  });
  infoTabs.appendChild(encycloTab);

  battleTab.classList.add("infotab");
  battleTab.innerText = "battle";
  battleTab.style.fontSize = "24px"; 
  battleTab.addEventListener("click", ()=>{
    changeInfoTab(battleTab);
  });
  infoTabs.appendChild(battleTab);

  friendsTab.classList.add("infotab");
  friendsTab.innerText = "friends";
  friendsTab.style.fontSize = "24px"; 
  friendsTab.addEventListener("click", ()=>{
    changeInfoTab(friendsTab);
  });
  infoTabs.appendChild(friendsTab);

  
  settingsTab.classList.add("infotab");
  settingsTab.innerText = "settings";
  settingsTab.style.fontSize = "24px"; 
  settingsTab.addEventListener("click", ()=>{
    changeInfoTab(settingsTab);
  });
  infoTabs.appendChild(settingsTab);

  
  

  headerBar.setAttribute("class","headerbar");  
  headerBar.style.height = String(Math.floor(gameHeight/4)+15)+"px";
  headerBar.style.background = "rgb(50,50,50)"; 
  leftContainer.appendChild(headerBar);

  partyBuildTab.classList.add("gametab","selected");
  partyBuildTab.style.width = "260px"
  partyBuildTab.style.height = String(Math.floor(gameHeight/4))+"px";
  partyBuildTab.style.fontSize = "32px"; 
  partyBuildTab.innerText = "Party \nBuilder";
  partyBuildTab.addEventListener("click", ()=>{
    changeGameTab(partyBuildTab);
  });
  headerBar.appendChild(partyBuildTab);

  activeMatchTab.classList.add("gametab");
  activeMatchTab.style.width = "260px"
  activeMatchTab.style.height = String(Math.floor(gameHeight/4))+"px";
  activeMatchTab.style.fontSize = "32px"; 
  activeMatchTab.innerText = "VS\nBabouino" 
  activeMatchTab.addEventListener("click", ()=>{
    changeGameTab(activeMatchTab);
  });
  headerBar.appendChild(activeMatchTab);

  activeMatchTab2.classList.add("gametab");
  activeMatchTab2.style.width = "260px"
  activeMatchTab2.style.height = String(Math.floor(gameHeight/4))+"px";
  activeMatchTab2.style.fontSize = "32px"; 
  activeMatchTab2.innerText = "VS\nSelf" 
  activeMatchTab2.addEventListener("click", ()=>{
    changeGameTab(activeMatchTab2);
  });
  headerBar.appendChild(activeMatchTab2);
  
  gameCanvas.width = gameWidth;
  gameCanvas.height = gameHeight;
  gameCanvas.style.width = "1280px";
  gameCanvas.setAttribute("image-rendering","pixelated");

  
  leftContainer.appendChild(canvasDiv);
  canvasDiv.classList.add("canvasdiv"); 
  canvasDiv.appendChild(gameCanvas)
  
  window.addEventListener("resize", (event) => {
    ResizeCanvas(gameCanvas);
  });

   const context = gameCanvas.getContext('2d'); 

  const headerDiv = document.getElementById("header");
  const appDiv = document.getElementById("app");
  const sidebarDiv = document.getElementById("sidebar");
  if (context != null)
    {
      context.imageSmoothingEnabled = false; 
    }
 
  if (appDiv != null)
    { 
      appDiv.appendChild(leftContainer);  
      appDiv.appendChild(rightContainer);  
    }  

  ResizeCanvas(gameCanvas);  
 

  console.log("starto"); 
}

const drawImageActualSize = (_image:HTMLImageElement,_context:CanvasRenderingContext2D) => {
 
  _context.drawImage(_image, 0, 0); 
  
}

const changeGameTab = (tab:HTMLDivElement) => {

  partyBuildTab.classList.remove("selected");
  activeMatchTab.classList.remove("selected");
  activeMatchTab2.classList.remove("selected");
  tab.classList.add("selected");
}

const changeInfoTab = (tab:HTMLDivElement) => { 

  encycloTab.classList.remove("selected");
  battleTab.classList.remove("selected");
  friendsTab.classList.remove("selected");
  settingsTab.classList.remove("selected");
  tab.classList.add("selected");  
}

const ResizeCanvas = (canvas:HTMLCanvasElement) => {
  /*
  let ratio = Math.floor(Math.max(gameWidth,window.innerWidth)/gameWidth);
  let ratio2 = Math.floor(Math.max(gameHeight,window.innerHeight)/gameHeight); 
  let finalRatio = 1;
  if (ratio2 >= ratio)
  {  finalRatio = ratio; }
  else
  { finalRatio = ratio2; }
  
  canvas.style.width =  String(gameWidth*finalRatio)+"px";
  leftContainer.style.width = canvas.style.width;
  rightContainer.style.width = String(window.innerWidth-gameWidth*finalRatio)+"px";
  //partyBuildTab.style.fontSize = String(16*finalRatio)+"px"; 
  */
} 

StartApp();
