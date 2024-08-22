export type MTYPE = "fire" | "steel" | "fae";

export class monsType {

    typeList:Array<string> = ["fire","steel","fae","bugs","beast","bone","blood","hell","forest","solar","stars","abyss","machine","void","sands","rot","curse","heavens","storms","20"];
    typeIndex:Object = {
        "fire":0,
        "steel":1,
        "fae":2,
    }

    name:string = "";
    defaultType:string = "";
    ascendType:string = "";
    phantasmType:string = ""; 

    strongOn:Array<any> = [];
    resistedOn:Array<any> = [];
    immunedOn:Array<any> = [];

    weakTo:Array<any> = [];
    resistantTo:Array<any> = [];
    immuneTo:Array<any> = [];

    constructor () {
        
    }

    strongEffect:Function = () => {

    }

    weakEffect:Function = () => {

    }

    neutralEffect:Function = () => {

    }

    harmonyEffect:Function = () => {

    }

    explosiveEffect:Function = () => {

    }

    catalystEffect:Function = () => {

    }
}

const createTypes = () => {

    const typeArray:Array<monsType> = [];
    //-------------------------

    const tyFire = new monsType();
        tyFire.name = "beetle";
        tyFire.defaultType = "fae";
        tyFire.ascendType = "rot";
        tyFire.strongOn = ["steel","bugs","beast","bone","forest","rot"];
        tyFire.resistedOn = ["fire","hell","abyss","sand","storms"];
        tyFire.immunedOn = ["solar"];  

        tyFire.strongEffect = () => {
             
        }
        tyFire.weakEffect = () => {
             
        }
        tyFire.neutralEffect = () => {
             
        }
        tyFire.harmonyEffect = () => {
             
        }
        tyFire.explosiveEffect = () => {
             
        }
        tyFire.catalystEffect = () => {
             
        }
    typeArray.push(tyFire);


}

