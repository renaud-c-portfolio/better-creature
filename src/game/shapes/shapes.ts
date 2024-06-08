
export type MSHAPE = "beetle" | "crawler" | "stinger"

export class shape {

    shapeList:Array<string> = ["beetle","crawler","stinger","canine","feline","critter","antler","winged","fruit","mycon","world tree","serpent","crab","kraken","leviathan","hydra","dinosaur","behemoth","dragon"];
    shapeIndex:Object = {
        "beetle":0,
        "crawler":1,
    } 

    name:string = "";
    defaultType:string = "";
    ascendType:string = "";
    phantasmType:string = ""; 
 
        constructor () { 
            
    }

    strongEffect = () => {

    }

    weakEffect = () => {
        
    }

    neutralEffect = () => {

    }

    harmonyEffect = () => {

    }

    explosiveEffect = () => {

    }

    catalystEffect = () => {

    }

    mutateEffect = () => {

    }
}

const createShapes = () => {

    const shapeArray:Array<shape> = [];
    //-------------------------

    const shBeetle = new shape();
        shBeetle.name = "beetle";
        shBeetle.defaultType = "fae";
        shBeetle.ascendType = "rot";
    shapeArray.push(shBeetle);


}

