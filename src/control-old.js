keys = [];
const BUTTONS = 7;
const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;
const FIRE = 4;
const BOOST = 5;
const SPECIAL = 6;
keys.push('up');
keys.push('down');
keys.push('left');
keys.push('right');
keys.push('fire');
keys.push('boost');
keys.push('special');

class control { 
    players = 1;

    initControl = () => {  
        //key[player][button];
        this.key = [];
        this.pre = [];
        this.hol = [];
        this.rel = [];
        for (let _i =1; _i <= this.players; _i++ )
        {
            this.key[_i] = [];
            this.pre[_i] = [];
            this.hol[_i] = [];
            this.rel[_i] = [];
        }
        this.key[1][UP] = 'w';
        this.key[1][DOWN] = 's';
        this.key[1][LEFT] = 'a';
        this.key[1][RIGHT] = 'd';
        this.key[1][FIRE] = 'o';
        this.key[1][BOOST] = ' ';
        this.key[1][SPECIAL] = 'p';   
        
        for (let _i = 0; _i <= this.players; _i++)
        {
            //pressed this frame
            this.pre[1][UP] = 0;
            this.pre[1][DOWN] = 0;
            this.pre[1][LEFT] = 0;
            this.pre[1][RIGHT] = 0;
            this.pre[1][FIRE] = 0;
            this.pre[1][BOOST] = 0;
            this.pre[1][SPECIAL] = 0;

            //released this frame
            this.rel[1][UP] = 0;
            this.rel[1][DOWN] = 0;
            this.rel[1][LEFT] = 0;
            this.rel[1][RIGHT] = 0;
            this.rel[1][FIRE] = 0;
            this.rel[1][BOOST] = 0;
            this.rel[1][SPECIAL] = 0;

            
            //held or not
            this.hol[1][UP] = 0;
            this.hol[1][DOWN] = 0;
            this.hol[1][LEFT] = 0;
            this.hol[1][RIGHT] = 0;
            this.hol[1][FIRE] = 0;
            this.hol[1][BOOST] = 0;
            this.hol[1][SPECIAL] = 0;
        }
        

        document.addEventListener('keydown', this.keyDownEvent);
        document.addEventListener('keyup', this.keyUpEvent);
        document.addEventListener('focousout', this.focusOutEvent);
    }

    keyDownEvent = (event) => {  
        for (let _i =1; _i <= ctrl.players; _i++ )
        {
            for (let _j =0; _j < BUTTONS; _j++)
            {
                if (event.key === ctrl.key[_i][_j])
                {
                    if (ctrl.hol[_i][_j] === 0)
                    {
                        ctrl.pre[_i][_j] = 1;
                    }
                    ctrl.hol[_i][_j] += 1;
                }
            }
        } 
    }

    keyUpEvent = (event) => { 
        for (let _i =1; _i <= ctrl.players; _i++ )
        {
            for (let _j =0; _j < BUTTONS; _j++)
            {
                if (event.key === ctrl.key[_i][_j])
                {
                    if (ctrl.hol[_i][_j] > 0)
                    {
                        ctrl.rel[_i][_j] = ctrl.hol[_i][_j];
                        ctrl.hol[_i][_j] = 0; 
                    }
                }
            }
        }
    }

    focusOutEvent = (event) => {
        console.log("cat")
        for (let _i =1; _i <= ctrl.players; _i++ )
        {
            for (let _j =0; _j < BUTTONS; _j++)
            {
                (this.key[_i][_j]).keyup();
            }
        }
    }

    controlUpdate = () => {
        for (let _i =1; _i <= ctrl.players; _i++ )
        {
            for (let _j =0; _j < BUTTONS; _j++)
            {
                if (ctrl.rel[_i][_j])
                {
                    ctrl.rel[_i][_j] = 0;
                }
                else if (ctrl.hol[_i][_j])
                {
                    ctrl.hol[_i][_j] += 1;
                    if (ctrl.pre[_i][_j])
                    {
                        ctrl.pre[_i][_j] = 0;
                    }
                }
            }
        }
     }



}
