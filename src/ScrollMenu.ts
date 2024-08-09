

import GameElement from "./GameElement";
import GameEngine from "./GameEngine";

import * as DATA from "./Data";
import GameButton from "./GameButton";


export class ScrollMenu extends GameElement {

    public checkType:string = "aspect"

    public aspectCheckArray:Array<DATA.aspectsType> = [];

    outlineColor:string = "black";
    innerColor:string = "rgb(222,222,222)";


    indexClicked = -1;


    scroll:number = 0;

    aspectNone:boolean = false;
    aspectButton:GameButton = new GameButton(this.engine,350,44,102,26,"fire",0,"aspect");
    shapeButton:GameButton = new GameButton(this.engine,350,44,102,26,"beetle",0,"shape");


    constructor(engine:GameEngine, public x:number = 0,public y:number = 0,public width:number = 50, public height:number = 30,public text:string = "",public depth:number = 0) {
        super(engine,x,y,depth);  

    }

    override drawFunction = (context:CanvasRenderingContext2D) => {

        context.fillStyle = this.outlineColor;
        context.beginPath();
        context.roundRect(this.x-1,this.y-1,this.width+2,this.height+3,2); 
        context.closePath();
        context.fill(); 

        context.fillStyle = this.innerColor;
        context.beginPath();
        context.roundRect(this.x,this.y,this.width,this.height,3); 
        context.closePath();
        context.fill();  
        context.fillStyle = "black";  

        let indexI = 0;
         switch(this.checkType)
         {
            case "aspect":

                this.indexClicked = -1; 
                this.width = 224;
                this.height = 342; 
                context.font = "16px '04b03'";

                context.fillText("Select Aspect",this.x+44,this.y+13);
                for (let i=0; i < DATA.aspectsList.length; i++)
                    {
                        this.aspectButton.aspectLabel = DATA.aspectsList[i];
                        this.aspectButton.x = this.x + 6 + (i % 2)*110;
                        this.aspectButton.y = this.y + 21 + Math.floor(i / 2)*32;
                        this.aspectButton.drawFunction(context);
                        if (this.aspectButton.clicked)
                            {
                                this.indexClicked = i;
                            }
                        this.aspectButton.clicked = 0;
                        indexI = i+1;
                    }
                if (this.aspectNone)
                    {
                        this.aspectButton.aspectLabel = "none";
                        this.aspectButton.x = this.x + 2 + (indexI % 2)*110;
                        this.aspectButton.y = this.y + 2 + Math.floor(indexI / 2)*30;
                        this.aspectButton.drawFunction(context);
                    }
            break;
            case "shape":

            this.indexClicked = -1; 
            this.width = 224;
            this.height = 342; 
            context.font = "16px '04b03'";

            context.fillText("Select Shape",this.x+44,this.y+13);
            for (let i=0; i < DATA.shapesList.length; i++)
                {
                    this.shapeButton.shapeLabel = DATA.shapesList[i];
                    this.shapeButton.x = this.x + 6 + (i % 2)*110;
                    this.shapeButton.y = this.y + 21 + Math.floor(i / 2)*32;
                    this.shapeButton.drawFunction(context);
                    if (this.shapeButton.clicked)
                        {
                            this.indexClicked = i;
                        }
                    this.shapeButton.clicked = 0;
                    indexI = i+1;
                }
            if (this.aspectNone)
                {
                    this.shapeButton.shapeLabel = "none";
                    this.shapeButton.x = this.x + 2 + (indexI % 2)*110;
                    this.shapeButton.y = this.y + 2 + Math.floor(indexI / 2)*30;
                    this.shapeButton.drawFunction(context);
                }
        break;
         }


    }

    




}

