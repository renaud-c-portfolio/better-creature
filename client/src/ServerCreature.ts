
import * as DATA from "./Data.ts"; 
import { ServerAction } from "./ServerAction"; 



export class ServerCreature {

    public name:string = "animal" + String(Math.floor(Math.random()*100)); 
     
     
    public statPlus:Array<number> = [0,0,0,0,0,0,0];
    public itemChoices:Array<string|null> = [null,null];
    public currentItem:string|null = null;
    
    public soulType:DATA.soulType = "natural";
    public halfSoul:DATA.soulType = "none";

    aspectsList:Array<DATA.aspectsType> = [];
    shapesList:Array<DATA.shapesType> = []; 


    //combat -----------------------------
    public HP:number = 100;
    public maxHP:number = 100; 
    public damaged:number = 0;
    public maxDamaged:number = 0; 
    public dodgePoint: number = 1;
    public dodgeMax: number = 1; 
    public muscle:number = 10;
    public magic:number = 10;
    public armor:number = 1;
    public resistance:number = 10;
    public speed:number = 5;

    public skill1:string = "";
    public skill2:string = ""; 

    public realms:Array<DATA.realm> = ["earthly","earthly"];

    actions:Array<ServerAction> = [
        new ServerAction(),
        new ServerAction(),
        new ServerAction(),
        new ServerAction() 
    ]; 

    

    constructor () { 
         
         
         
    }

}