import CreatureChar from "./CreatureChar.ts";
import { FightAction } from "./FightAction.ts";
import GameElement from "./GameElement.ts";
import GameEngine from "./GameEngine.ts";

import FightMatch from "./FightMatch.ts";
 

import * as DATA from './Data.ts'; 
import { shape } from "./game/shapes/shapes.ts";

type BUTTONT = "text" | "action" | "image" | "labeledImage" | "labeledChar" | "aspect" | "shape";

class ClientButton extends GameElement {

    public clicked:number = 0;
    public clickConfirm:number = 0;
 
    public sprite:string = "";
    public topLeftText:string = "";

    public spriteContext:CanvasRenderingContext2D|null = null;
    public switchCreature:CreatureChar|null = null;
    public actionLabel:FightAction|null = null;
    public aspectLabel:DATA.aspectsType|null = null;
    public shapeLabel:DATA.shapesType|null = null;

    public disabled:boolean = false;
    public active:boolean = true;
    public mouseOverActive:boolean = true;
    public mouseOvering:boolean = false;


    public highlighted:boolean = false;

    public imageElem:HTMLImageElement = document.createElement("img"); 
    public iconUrl:string = "./gfx/aspecticons/icon-unknown.png";
    public loaded = false;  

    public mainColor:string = "rgb(100,100,160)";
    public outlineColor:string = "black";



    constructor(engine:GameEngine, public x:number = 0,public y:number = 0,public width:number = 50, public height:number = 30,public text:string = "",public depth:number = 0, public type:BUTTONT = "text") {
        super(engine,x,y,depth); 

        this.imageElem.onload = () => { 
            this.loaded = true;
          }

    }


    drawFunction = (context:CanvasRenderingContext2D) => {
 
        context.fillStyle = this.outlineColor;
        context.beginPath();
        context.roundRect(this.x-1,this.y-1,this.width+2,this.height+3,5); 
        context.closePath();
        context.fill(); 

        context.fillStyle = this.mainColor;
        context.filter = "brightness(1.2) grayscale(0.6)";
        
        this.mouseOvering = false;
        if (this.engine.MouseInRect(this.x,this.y,this.width,this.height) && !this.disabled && this.mouseOverActive)
            {
                context.filter = "brightness(1.3)";
                this.highlighted = true;
                this.mouseOvering = true;

                if (this.active)
                { document.body.style.cursor = 'pointer'; }
                else { document.body.style.cursor = 'help';} 

                if (this.engine.leftClick === 1 && this.active)
                    {
                        this.clicked = 1;
                    }
                if (this.engine.leftRelease > 0 && this.clicked > 0 && this.active)
                    {
                        this.clickConfirm = this.clicked;
                        this.clicked = 0;
                    }
                    
            }
        else {
            this.highlighted = false;
            if (this.clicked > 0 && this.engine.leftRelease)
            {
                this.clicked = 0;
            } }

        if (this.clicked)
        { 
            context.filter = "brightness(0.6) grayscale(0.1)";
         }
        else if(this.disabled)
            {context.filter = "brightness(0.7) grayscale(0.4)";} 
        
        context.font = "16px '04b03'";  
        if (this.type === "text")
            {
                context.beginPath();
                context.roundRect(this.x,this.y+this.clicked,this.width,this.height,5); 
                context.closePath();
                context.fill();  
                context.fillStyle = "black"; 

                context.letterSpacing = "-1px"  
                const _txtWidth = context.measureText(this.text).width;
                let _halfTxtWidth = Math.floor(_txtWidth/2);
                context.fillText(this.text,this.x+this.width/2-_halfTxtWidth,this.y+this.height/2+4+this.clicked);   
            }
        else if (this.type === "action" && this.actionLabel != null)
            {
                
                const labelAspect:DATA.aspectsType = this.actionLabel.actionAspect;
                const capsAspect = labelAspect.toUpperCase(); 
                const aspectObj = DATA.aspectsRecord[labelAspect];   

                context.fillStyle= aspectObj.color;
                context.beginPath();
                context.roundRect(this.x,this.y+this.clicked,this.width,this.height,5); 
                context.closePath();
                context.fill();  
                context.fillStyle= "black";

                this.text = this.actionLabel.name;
                context.letterSpacing = "-1px";
                const _txtWidth = context.measureText(this.text).width;
                let _halfTxtWidth = Math.floor(_txtWidth/2);
                context.filter = "none";
                context.fillText(this.text,this.x+this.width/2-_halfTxtWidth,this.y+this.height/2-3+this.clicked);   
                context.font = "8px '04b03'";  
                context.letterSpacing = "0px"; 

                if (aspectObj.iconLoaded)
                    {context.drawImage(aspectObj.iconImg,this.x+7,this.y+this.height-16+this.clicked,14,14);}
                context.filter = "none";
                context.fillText(capsAspect,this.x+23,this.y+this.height-6+this.clicked);
                const actionPower = String(this.actionLabel.power); 
                const actionType = this.actionLabel.actionType;
                let actionImage = this.engine.physImage;
                switch (actionType)
                {
                    case "magical": actionImage = this.engine.magImage; break;
                    case "strongest": actionImage = this.engine.strongestImage; break;
                    case "status": actionImage = this.engine.specImage; break;
                }
                context.drawImage(actionImage,this.x+102,this.y+this.height-16+this.clicked);
                if (actionPower != "0"){context.fillText(actionPower,this.x+116,this.y+this.height-6+this.clicked);} 
                
                
            }
        else if (this.type === "labeledChar")
            {
                context.beginPath();
                context.roundRect(this.x,this.y+this.clicked,this.width,this.height,5); 
                context.closePath();
                context.fill();  
                context.fillStyle = "black"; 
                
                context.letterSpacing = "0px";  
                context.font = "8px '04b03'"; 
                let _txtWidth = Math.floor(context.measureText(this.text).width);
                let _halfTxtWidth = Math.floor(_txtWidth/2);
                
                //draw creature's portrait to switch to
                if (this.spriteContext != null && this.switchCreature != null)
                    {
                        if (this.switchCreature.HP <= 0)
                            {
                                context.filter = "grayscale(100%)";
                            }
                        context.drawImage(this.switchCreature.imageElem,this.x+10,this.y+10+this.clicked);
                        context.filter = "none";
                        _txtWidth = Math.floor(context.measureText(this.switchCreature.name).width);
                        _halfTxtWidth = Math.floor(_txtWidth/2);
                        context.fillText(this.switchCreature.name,this.x+(this.width/2)-_halfTxtWidth,this.y+this.height-4+this.clicked);
                        
                        context.fillText(this.text,this.x+this.width/2-_halfTxtWidth,this.y+9+this.clicked);
                    }
                
            } 
        else if (this.type === "aspect")
            {
                 if (this.aspectLabel != null)
                 { 
                    const capsAspect = this.aspectLabel.toUpperCase(); 
                    const aspectObj = DATA.aspectsRecord[this.aspectLabel];   

                    context.fillStyle= aspectObj.color;
                    context.beginPath();  
                    context.roundRect(this.x,this.y+this.clicked,this.width,this.height,5);  
                    context.closePath();  
                    context.fill();   
                    context.fillStyle= "black";  

                    context.letterSpacing = "-1px"  
                    this.text = capsAspect;
                    const _txtWidth = context.measureText(this.text).width+14;
                    let _halfTxtWidth = Math.floor(_txtWidth/2);
                    if (aspectObj.iconLoaded)
                    {context.drawImage(aspectObj.iconImg,this.x+this.width/2-_halfTxtWidth,this.y+this.height/2+4+this.clicked-12,14,14);}
                    context.filter = "none";
                    context.fillText(this.text,15+this.x+this.width/2-_halfTxtWidth,this.y+this.height/2+4+this.clicked);  
                 }
            }
            else if (this.type === "shape")
                {
                     if (this.shapeLabel != null)
                     {  
                        const shapeObj = DATA.shapesRecord[this.shapeLabel];   
    
                        context.fillStyle= "shapeObj.color;";
                        context.beginPath();  
                        context.roundRect(this.x,this.y+this.clicked,this.width,this.height,5);  
                        context.closePath();  
                        context.fill();  
                        context.fillStyle= "black"; 
                        context.filter = "none";
                        context.letterSpacing = "-1px"  
                        this.text = this.shapeLabel;
                        const _txtWidth = context.measureText(this.text).width+14;
                        let _halfTxtWidth = Math.floor(_txtWidth/2);
                        if (shapeObj.iconLoaded)
                        {context.drawImage(shapeObj.iconImg,this.x+this.width/2-_halfTxtWidth,this.y+this.height/2+4+this.clicked-12,14,14);}
                        context.fillText(this.text,16+this.x+this.width/2-_halfTxtWidth,this.y+this.height/2+4+this.clicked);  
                     }
                }
        context.filter = "none";


        
    }
}


export default ClientButton