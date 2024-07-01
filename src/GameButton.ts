import GameElement from "./GameElement";
import GameEngine from "./GameEngine";

type BUTTONT = "text" | "image" | "labeledImage"

class gameButton extends GameElement {

    public clicked:number = 0;
    public clickConfirm:number = 0;
 
    public sprite:string = "";

    constructor(engine:GameEngine,public x:number = 0,public y:number = 0,public width:number = 50, public height:number = 30,public text:string = "",public depth:number = 0, public type:BUTTONT = "text") {
        super(engine,x,y,depth);

    }


    drawFunction = (_context:CanvasRenderingContext2D) => {

        

        _context.fillStyle = "black";
        _context.beginPath();
        _context.roundRect(this.x-1,this.y-1,this.width+2,this.height+3,5); 
        _context.closePath();
        _context.fill();  
        
        if (this.engine.MouseInRect(this.x,this.y,this.width,this.height))
            {_context.fillStyle = "rgb(100,100,150)"; 
                document.body.style.cursor = 'pointer';

                if (this.engine.leftClick === 1)
                    {
                        this.clicked = 1;
                    }
                if (this.engine.leftRelease > 0 && this.clicked > 0)
                    {
                        this.clickConfirm = this.clicked;
                        this.clicked = 0;
                    }
                    
            }
        else {
            if (this.clicked > 0 && this.engine.leftRelease)
            {
                this.clicked = 0;
            }
            _context.fillStyle = "rgb(80,80,130)";}
        if (this.clicked)
        { _context.fillStyle= "rgb(60,60,110)";
            //this.x = this.engine.mouseX;
            //this.y = this.engine.mouseY; 
         }
 
        _context.beginPath();
        _context.roundRect(this.x,this.y+this.clicked,this.width,this.height,5); 
        _context.closePath();
        _context.fill();  
        _context.fillStyle = "black"; 
        _context.font = "16px '04b03'";  
        
        if (this.type === "text")
            {
                const _txtWidth = _context.measureText(this.text).width;
                _context.fillText(this.text,this.x+this.width/2-_txtWidth/2,this.y+this.height/2+4+this.clicked);   
            }
        else if (this.type === "labeledImage")
            {
                _context.font = "8px '04b03'";  
                const _txtWidth = _context.measureText(this.text).width; 
                _context.fillText(this.text,this.x+this.width/2-_txtWidth/2,this.y+9+this.clicked);   
            }


        
    }
}


export default gameButton