 import { ClientCreature } from "./ClientCreature" 
 

import crambUrl from  "./gfx/funny_crab.png";
import octoUrl from "./gfx/quadtopus.png";
import mashUrl from "./gfx/mashroom.png";
import hydraUrl from "./gfx/hydrr.png";
import nekoUrl from "./gfx/evil_neko.png";
import centiUrl from "./gfx/centip.png";
import sharkyUrl from "./gfx/sharky.png";
import melonUrl from "./gfx/watermelone.png";
import treeUrl from "./gfx/heaven-tree.png";
import foxUrl from "./gfx/fire-canine.png";
import fruitUrl from "./gfx/steel_fruit.png";
import starBeheUrl from "./gfx/star_behemoth.png";
import sandStingUrl from "./gfx/sands_stinger.png";
import solarAntlerUrl from "./gfx/solar_antler.png";
import bloodNightmareUrl from "./gfx/blood_nightmare.png";
import curseBeetleUrl from "./gfx/curse_beetle.png";
import faeCritterUrl from "./gfx/fae_critter.png";
import forestFeatherUrl from "./gfx/forest_feather.png";
import abyssWormUrl from "./gfx/abyss_worm.png";
import boneDinoUrl from "./gfx/bone_dinosaur.png";
import stormsDragonUrl from "./gfx/storms_dragon.png";

export class ClientCharSprite {

    imageElem:HTMLImageElement = document.createElement("img");  
    imageAlpha:number = 1;
    
    public loaded:boolean = false;
     
    constructor() {

        this.imageElem.onload = () => { 
            this.loaded = true;
          }
          
    }


    generateSpriteSheet = (creature:ClientCreature) => {
         
        switch (creature.shapesList[0])
        {
            case "antler":
                this.imageElem.src = solarAntlerUrl; break;
            case "beetle":
                this.imageElem.src = curseBeetleUrl; break;
            case "behemoth":
                this.imageElem.src = starBeheUrl; break;
            case "canine":
                this.imageElem.src = foxUrl; break;
            case "crab":
                this.imageElem.src = crambUrl; break;
            case "crawler":
                this.imageElem.src = centiUrl; break;
            case "critter":
                this.imageElem.src = faeCritterUrl; break;
            case "dinosaur":
                this.imageElem.src = boneDinoUrl; break; 
            case "feather":
                this.imageElem.src = forestFeatherUrl; break;
            case "feline":
                this.imageElem.src = nekoUrl; break;
            case "fruit":
                this.imageElem.src = fruitUrl; break;
            case "hydra":
                this.imageElem.src = hydraUrl; break;
            case "kraken":
                this.imageElem.src = octoUrl; break;
            case "leviathan":
                this.imageElem.src = sharkyUrl; break;
            case "mycon":
                this.imageElem.src = mashUrl; break;
            case "nightmare":
                this.imageElem.src = bloodNightmareUrl; break;
            case "stinger":
                this.imageElem.src = sandStingUrl; break;
            case "worldtree":
                this.imageElem.src = treeUrl; break;
            case "worm":
                this.imageElem.src = abyssWormUrl; break;
            case "dragon":
                this.imageElem.src = stormsDragonUrl; break;
        } 
    }

}