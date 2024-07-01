import './style.css' 
import * as PIXI from 'pixi.js';

import gameEngine from './gameEngine';
import crambURL from './gfx/funny_crab.png';

const StartApp = async () => {
 
  const app = new PIXI.Application(); 
  await app.init({ background: '#1099bb', resizeTo: window }); 
  document.body.appendChild(app.canvas); 

    const gameScreen = PIXI.RenderTexture.create({
      
      width: 640,
      height: 360,  
      scaleMode: "nearest",
      
  });

  //const engine = new gameEngine(app);
 

  const gameContainer = new PIXI.Container(); 
  //const gameBG = new PIXI.Rectangle(0,0,640,360); 
  const gameBGSprite = new PIXI.Sprite(PIXI.Texture.WHITE);
  gameBGSprite.width = 640;
  gameBGSprite.height = 360;
  gameBGSprite.tint = 0x000000; 
  
  const gameScreenSprite = new PIXI.Sprite(gameScreen);
  gameScreenSprite.x = 20; 
  gameScreenSprite.y = 20; 
  gameScreenSprite.scale.x = 4; 
  gameScreenSprite.scale.y = 4; 
  
 
  const texture = await PIXI.Assets.load(crambURL);
  const bunny = new PIXI.Sprite(texture);

  app.stage.addChild(gameScreenSprite);  
  gameContainer.addChild(gameBGSprite);
  gameContainer.addChild(bunny);

  bunny.anchor.set(0.5);
  bunny.cullable = true;
  bunny.x = 100; 
  bunny.y = 100; 

    app.ticker.add((time) => {
        bunny.x += 0.25 * time.deltaTime;
    });

    app.ticker.add(() =>
      {
          app.renderer.render({ target: gameScreen, container: gameContainer });
      });
      /*app.ticker.add(() =>
      {
          app.renderer.render(gameContainer,);
      });*/
      console.log("height",app.screen.height);

      
    
}

StartApp();