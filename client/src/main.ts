import './style.css'  

import GameEngine from './GameEngine';
import { ClientMatch } from './ClientMatch';
import { CreatePartyMenu } from './CreatePartyMenu';
import { WindowClient } from './WindowClient';
 

const StartApp = async () => { 
    const appDiv = document.getElementById("app") as HTMLDivElement;
    if (appDiv != null)
    {
      const clientWindow = new WindowClient(appDiv);
      clientWindow.startClientWindows();
    }
    else
    {
      console.log("appDiv not found");
    }
}  

StartApp();
