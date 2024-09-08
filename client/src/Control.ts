

class Control { 
    players = 1;

    mouseX: number = -1;
    mouseY: number = -1; 

    leftClicking:number = 0;
    rightClicking:number = 0;

    //enum equivalent
    keys = ['up','down','left','right','fire','boost','special'];

    public BUTTONS = 7;
    public UP = 0;
    public DOWN = 1;
    public LEFT = 2;
    public RIGHT = 3;
    public FIRE = 4;
    public BOOST = 5;
    public SPECIAL = 6; 

    public key:Array<any> = [];
    public pre:Array<any> = [];
    public hol:Array<any> = [];
    public rel:Array<any> = [];
    


    initControl = () => {   


        
        for (let _i =1; _i <= this.players; _i++ )
        {
            this.key[_i] = [];
            this.pre[_i] = [];
            this.hol[_i] = [];
            this.rel[_i] = [];
        }
         
        this.key[1][this.UP] = 'w';
        this.key[1][this.DOWN] = 's';
        this.key[1][this.LEFT] = 'a';
        this.key[1][this.RIGHT] = 'd';
        this.key[1][this.FIRE] = 'o';
        this.key[1][this.BOOST] = ' ';
        this.key[1][this.SPECIAL] = 'p';   
        
        for (let _i = 0; _i <= this.players; _i++)
        {
            //pressed this frame
            this.pre[1][this.UP] = 0;
            this.pre[1][this.DOWN] = 0;
            this.pre[1][this.LEFT] = 0;
            this.pre[1][this.RIGHT] = 0;
            this.pre[1][this.FIRE] = 0;
            this.pre[1][this.BOOST] = 0;
            this.pre[1][this.SPECIAL] = 0;

            //released this frame
            this.rel[1][this.UP] = 0;
            this.rel[1][this.DOWN] = 0;
            this.rel[1][this.LEFT] = 0;
            this.rel[1][this.RIGHT] = 0;
            this.rel[1][this.FIRE] = 0;
            this.rel[1][this.BOOST] = 0;
            this.rel[1][this.SPECIAL] = 0;

            
            //held or not
            this.hol[1][this.UP] = 0;
            this.hol[1][this.DOWN] = 0;
            this.hol[1][this.LEFT] = 0;
            this.hol[1][this.RIGHT] = 0;
            this.hol[1][this.FIRE] = 0;
            this.hol[1][this.BOOST] = 0;
            this.hol[1][this.SPECIAL] = 0;
        }
        

        document.addEventListener('keydown', this.keyDownEvent);
        document.addEventListener('keyup', this.keyUpEvent);
        document.addEventListener('focusout', this.focusOutEvent);
    }

    keyDownEvent = (event:KeyboardEvent) => {  
        for (let _i =1; _i <= this.players; _i++ )
        {
            for (let _j =0; _j < this.BUTTONS; _j++)
            {
                if (event.key === this.key[_i][_j])
                {
                    if (this.hol[_i][_j] === 0)
                    {
                        this.pre[_i][_j] = 1;
                    }
                    this.hol[_i][_j] += 1;
                }
            }
        } 
    }

    keyUpEvent = (event:KeyboardEvent) => { 
        for (let _i =1; _i <= this.players; _i++ )
        {
            for (let _j =0; _j < this.BUTTONS; _j++)
            {
                if (event.key === this.key[_i][_j])
                {
                    if (this.hol[_i][_j] > 0)
                    {
                        this.rel[_i][_j] = this.hol[_i][_j];
                        this.hol[_i][_j] = 0; 
                    }
                }
            }
        }
    }

    focusOutEvent = (event:Event) => {
        console.log("cat")
        for (let _i =1; _i <= this.players; _i++ )
        {
            for (let _j =0; _j < this.BUTTONS; _j++)
            {
                const _key = this.key[_i][_j]
                dispatchEvent(new KeyboardEvent('keyup',{"key":_key})); 
            }
        }
    }

    controlUpdate = () => {
        for (let _i =1; _i <= this.players; _i++ )
        {
            for (let _j =0; _j < this.BUTTONS; _j++)
            {
                if (this.rel[_i][_j])
                {
                    this.rel[_i][_j] = 0;
                }
                else if (this.hol[_i][_j])
                {
                    this.hol[_i][_j] += 1;
                    if (this.pre[_i][_j])
                    {
                        this.pre[_i][_j] = 0;
                    }
                }
            }
        }
     }



}

export default Control;
