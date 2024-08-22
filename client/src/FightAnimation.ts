import GameElement from "./GameElement";
import GameEngine from "./GameEngine";
import animUrl from "./gfx/hitspark.png";


export class FightAnimation extends GameElement {

    public animTime:number = 0;
    public frameTime:number = 0;
    public timePerFrame:number = 4;
    public currentFrame:number = 0;
    public totalFrames:number = 3;
    public animOver:boolean = false;
    public animW:number = 48;
    public animH:number = 48;
    public sprite:string = ""; 

    private imageElem:HTMLImageElement = document.createElement("img");  
    private imageLoaded:boolean = false;
    
    public spriteCanvas:HTMLCanvasElement; 


    constructor (public engine:GameEngine,public spriteContext:CanvasRenderingContext2D,public x:number = 0,public y:number = 0,public depth:number = 0)
    {
        super(engine,x,y,depth); 
        this.imageElem.src = animUrl;
        this.imageElem.onload = () => {
            this.imageLoaded = true; 
        } 
        this.spriteCanvas = spriteContext.canvas;
    }

    override drawFunction = (context: CanvasRenderingContext2D) => {
        if (!this.animOver)
            { 
                this.spriteCanvas.setAttribute("width","48px"); 
                this.spriteCanvas.setAttribute("height","48px"); 
                this.spriteContext.clearRect(0,0,999,999);
                this.spriteContext.drawImage(this.imageElem,0,0-this.currentFrame*this.animH,this.animW,this.animH*this.totalFrames);
                context.drawImage(this.spriteCanvas,this.x,this.y,this.animW,this.animH); 
                this.frameTime+=1;
                if (this.frameTime >= this.timePerFrame)
                    {
                        this.frameTime = 0;
                        this.currentFrame += 1;
                        if (this.currentFrame >= this.totalFrames)
                            {
                                this.animOver = true;
                            }
                    } 
        }
    };

}
