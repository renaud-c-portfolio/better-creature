import gameButton from "./gameButton";
import FightMatch from "./FightMatch";
import gameElement from "./gameElement"; 
import CreatureChar from "./CreatureChar";

import { MTYPE } from "./game/types/monsType";
import { MSHAPE } from "./game/shapes/shapes";

class gameEngine {
    
    mouseX: number = -1;
    mouseY: number = -1; 
    public context:CanvasRenderingContext2D;
    public gameElements: Array<gameElement> = [];
    public depthList: Array<number> = [];
    public frameRate = 1000 / 60;

    public prevTime:number = Date.now();
    public currentTime:number = Date.now();
    public deltaTime:number = 0;
    public frameTime:number = 0;

    public leftClick: number = 0;
    public leftRelease: number = 0;
    public rightClick: number = 0;
    public rightRelease: number = 0;

    public currentMatch:FightMatch = new FightMatch(this,0,0,-100);

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
        else if (event.button === 2)
        {
            this.rightClick = 1;  
        }

        //console.log(event);
    }

    ReleaseMouse = (event:MouseEvent,_canvas:HTMLCanvasElement) => {

        const rect = _canvas.getBoundingClientRect();
        const scaleX = _canvas.width / rect.width;
        const scaleY = _canvas.height / rect.height;
        this.mouseX = Math.floor((event.clientX - rect.left)*scaleX);
        this.mouseY =  Math.floor((event.clientY - rect.top)*scaleY); 
        if (event.button === 0)
        {
            this.leftRelease = this.leftClick;
            this.leftClick = 0;
        }
        else if (event.button === 2)
        {
            this.rightRelease = this.rightClick;
            this.rightClick = 0;
        }
        
        //console.log(event);
        
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
        
         this.currentTime = Date.now();
         this.deltaTime = this.currentTime - this.prevTime; 
         this.prevTime =this.currentTime; 
         this.frameTime += this.deltaTime;
         //this allows us to limit game FPS to 60 instead of whatever your display is, along with frameskip sometimes. might need a limit though
         let multiFrame = 0;
         while (this.frameTime >= this.frameRate)
            { 
                this.frameTime -= this.frameRate;
                multiFrame += 1;
            
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
                if (this.leftClick > 0)  {this.leftClick +=1;}
                if (this.leftRelease > 0) {this.leftRelease = 0;}
                if (this.rightClick > 0)  {this.rightClick +=1;}
                if (this.rightRelease > 0) {this.rightRelease = 0;}
            }

          if (multiFrame > 1)
            {
                console.log("frames skipped:",multiFrame);
                multiFrame = 0;
            }

          requestAnimationFrame(()=>{this.gameTick()});  
      }

}

export default gameEngine;