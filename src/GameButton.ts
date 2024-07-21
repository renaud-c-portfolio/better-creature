import CreatureChar from "./CreatureChar";
import { FightAction } from "./FightAction";
import GameElement from "./GameElement";
import GameEngine from "./GameEngine";

type BUTTONT = "text" | "action" | "image" | "labeledImage" | "labeledChar"

class GameButton extends GameElement {

    public clicked:number = 0;
    public clickConfirm:number = 0;
 
    public sprite:string = "";
    public topLeftText:string = "";

    public spriteContext:CanvasRenderingContext2D|null = null;
    public switchCreature:CreatureChar|null = null;
    public actionLabel:FightAction|null = null;

    public disabled:boolean = false;

    constructor(engine:GameEngine,public x:number = 0,public y:number = 0,public width:number = 50, public height:number = 30,public text:string = "",public depth:number = 0, public type:BUTTONT = "text") {
        super(engine,x,y,depth);

    }


    drawFunction = (context:CanvasRenderingContext2D) => {

        

        context.fillStyle = "black";
        context.beginPath();
        context.roundRect(this.x-1,this.y-1,this.width+2,this.height+3,5); 
        context.closePath();
        context.fill();  
        
        if (this.engine.MouseInRect(this.x,this.y,this.width,this.height) && !this.disabled)
            {context.fillStyle = "rgb(100,100,150)"; 
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
            context.fillStyle = "rgb(80,80,130)";}
        if (this.clicked)
        { context.fillStyle= "rgb(60,60,110)";
            //this.x = this.engine.mouseX;
            //this.y = this.engine.mouseY; 
         }
        else if(this.disabled)
            {context.fillStyle= "rgb(50,50,80)";}
 
        context.beginPath();
        context.roundRect(this.x,this.y+this.clicked,this.width,this.height,5); 
        context.closePath();
        context.fill();  
        context.fillStyle = "black"; 
        if(this.disabled)  {context.fillStyle= "rgb(20,20,30)"   }
        context.font = "16px '04b03'";  
        
        if (this.type === "text")
            {
                context.letterSpacing = "-1px"  
                const _txtWidth = context.measureText(this.text).width;
                let _halfTxtWidth = Math.floor(_txtWidth/2);
                context.fillText(this.text,this.x+this.width/2-_halfTxtWidth,this.y+this.height/2+4+this.clicked);   
            }
        else if (this.type === "action" && this.actionLabel != null)
            {
                this.text = this.actionLabel.name;
                context.letterSpacing = "-1px";
                const _txtWidth = context.measureText(this.text).width;
                let _halfTxtWidth = Math.floor(_txtWidth/2);
                context.fillText(this.text,this.x+this.width/2-_halfTxtWidth,this.y+this.height/2-3+this.clicked);   
                context.font = "8px '04b03'";  
                context.letterSpacing = "0px";
                context.fillText("TYPE",this.x+7,this.y+this.height-5+this.clicked);   
            }
        else if (this.type === "labeledChar")
            {
                context.letterSpacing = "0px"  
                context.font = "8px '04b03'";  
                let _txtWidth = Math.floor(context.measureText(this.text).width);
                let _halfTxtWidth = Math.floor(_txtWidth/2);
                context.fillText(this.text,this.x+this.width/2-_halfTxtWidth,this.y+9+this.clicked);
                //draw creature's portrait to switch to
                if (this.spriteContext != null && this.switchCreature != null)
                    {
                        if (this.switchCreature.HP <= 0)
                            {
                                context.filter = "grayscale(100%)"
                            }
                        context.drawImage(this.switchCreature.imageElem,this.x+10,this.y+10+this.clicked);
                        context.filter = "grayscale(0%)";
                        _txtWidth = Math.floor(context.measureText(this.switchCreature.name).width);
                        _halfTxtWidth = Math.floor(_txtWidth/2);
                        context.fillText(this.switchCreature.name,this.x+(this.width/2)-_halfTxtWidth,this.y+this.height-4+this.clicked); 
                    }
                
            } 


        
    }
}


export default GameButton