import gameButton from "./gameButton";
import fightMatch from "./fightMatch";
import gameElement from "./gameElement"; 
import creatureChar from "./creatureChar";

import { MTYPE } from "./game/types/monsType";
import { MSHAPE } from "./game/shapes/shapes";

class gameEngine {
    
    mouseX: number = -1;
    mouseY: number = -1; 
    public context:CanvasRenderingContext2D;
    public gameElements: Array<gameElement> = [];
    public depthList: Array<number> = [];

    public leftClick: number = 0;
    public leftRelease: number = 0;

    public currentMatch:fightMatch = new fightMatch(this,0,0,-100);

    constructor(public canvas:HTMLCanvasElement){ 

        if (canvas != null)
            {
                const ctx = canvas.getContext('2d');
                if (ctx === null)
                    {throw new Error("sometimes things can be null"); }
                this.context = ctx;
            }
            else {throw new Error("sometimes things can be null");}
    }


    ///initialize game
    startGame = () => { 
        this.gameTick();  
        
        document.addEventListener("mousemove",(event:MouseEvent)=>{
            this.UpdateMouse(event,this.canvas);
          });
        
        document.addEventListener("mousedown",(event:MouseEvent)=>{
            this.ClickMouse(event,this.canvas);
        });

        document.addEventListener("mouseup",(event:MouseEvent)=>{
            this.ReleaseMouse(event,this.canvas);
        });  

        this.currentMatch.defaultParty(); //until we import parties from data
        this.gameElements.push(this.currentMatch);
        this.depthList.push(-100); 
        console.log("what the"); 
    }
    
    


      //locate mouse inside canvas
    UpdateMouse = (event:MouseEvent,_canvas:HTMLCanvasElement) => {
        
        const rect = _canvas.getBoundingClientRect();
        const scaleX = _canvas.width / rect.width;
        const scaleY = _canvas.height / rect.height; 
        this.mouseX = Math.floor((event.clientX - rect.left)*scaleX);
        this.mouseY =  Math.floor((event.clientY - rect.top)*scaleY);
    }

    ClickMouse = (event:MouseEvent,_canvas:HTMLCanvasElement) => {

        const rect = _canvas.getBoundingClientRect();
        const scaleX = _canvas.width / rect.width;
        const scaleY = _canvas.height / rect.height;
        this.mouseX = Math.floor((event.clientX - rect.left)*scaleX);
        this.mouseY =  Math.floor((event.clientY - rect.top)*scaleY);
        if (event.button === 0)
        {
            this.leftClick = 1;  
        }

        console.log(event);
    }

    ReleaseMouse = (event:MouseEvent,_canvas:HTMLCanvasElement) => {

        const rect = _canvas.getBoundingClientRect();
        const scaleX = _canvas.width / rect.width;
        const scaleY = _canvas.height / rect.height;
        this.mouseX = Math.floor((event.clientX - rect.left)*scaleX);
        this.mouseY =  Math.floor((event.clientY - rect.top)*scaleY); 
        if (event.button === 0)
        {
            this.leftClick = 0;
            this.leftRelease = 1;
        }
        
    }


    MouseInRect = (_left:number,_top:number,_width:number,_height:number):boolean => {

        if (this.mouseX > _left && this.mouseX < _left + _width && this.mouseY > _top && this.mouseY < _top+_height)
            {
                return true;
            }
            else
            {
                return false;
            }

    }


    

    sortDepth = () => {
        this.depthList = [];
        for (let _i =0; _i < this.gameElements.length; _i++)
            {
                const _ge = this.gameElements[_i];
                if (this.depthList.indexOf(_ge.depth) === -1)
                {
                    this.depthList.push(_ge.depth);
                }
            } 
        this.depthList.sort((a, b) => a - b);
    }


    /// run every frame 
    gameTick = () => {
        //tick += 0.25;

        

        const _context = this.context;
        
        if (_context != null)
          { 
            _context.clearRect(0,0,999,999);
            _context.fillStyle = "rgba(128, 128, 128, 1)";
            _context.fillRect(0,0,640,360);  
            _context.font = "48px '04b03'";  

            for (let _j =0; _j < this.depthList.length;_j++)
            {
                const _depth = this.depthList[_j];
                for (let _i =0; _i < this.gameElements.length; _i++)
                {
                    const _ge = this.gameElements[_i];
                    if (_ge.depth === _depth)
                    {
                        _ge.drawFunction(_context);
                    }
                } 
            }  
            
          }  

          if (this.leftClick > 0)
            {this.leftClick +=1;}
           if (this.leftRelease > 0) {this.leftRelease = 0;}

          requestAnimationFrame(()=>{this.gameTick()}); 
      
      }

}

export default gameEngine;