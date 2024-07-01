import './style.css' 
import * as PIXI from 'pixi.js';

import crambUrl from "./gfx/funny_crab.png" 
import GameEngine from './GameEngine';

const gameWidth = 640;
const gameHeight = 360;

const StartApp = async () => {
  
  const gameCanvas =  document.createElement("canvas");
  gameCanvas.width = gameWidth;
  gameCanvas.height = gameHeight;
  gameCanvas.style.width = "1280px"; 
  
  window.addEventListener("resize", (event) => {
    ResizeCanvas(gameCanvas);
  });

  const tempImage = document.createElement("img");
  tempImage.src = crambUrl; 
  tempImage.setAttribute("id","theimage");
  const context = gameCanvas.getContext('2d'); 

  const appDiv = document.getElementById("app");
  if (context != null)
    {
      context.imageSmoothingEnabled = false;
      tempImage.onload = () => { 
         drawImageActualSize(tempImage,context);
       }
    }
  if (appDiv != null)
    { 
      appDiv.appendChild(gameCanvas);  
    }

  

  const engine = new GameEngine(gameCanvas);
  ResizeCanvas(gameCanvas);
  engine.startGame();
  console.log("starto");
}

const drawImageActualSize = (_image:HTMLImageElement,_context:CanvasRenderingContext2D) => {
 
  _context.drawImage(_image, 0, 0); 
  
}

const ResizeCanvas = (_canvas:HTMLCanvasElement) => {
  let ratio = Math.floor(Math.max(gameWidth,window.innerWidth)/gameWidth);
  let ratio2 = Math.floor(Math.max(gameHeight,window.innerHeight)/gameHeight);
  if (ratio2 >= ratio)
  {
    _canvas.style.width =  String(gameWidth*ratio)+"px";
  }
  else
  {
    _canvas.style.width =  String(gameWidth*ratio2)+"px";
  }
} 

StartApp();
