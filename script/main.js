var PIXI = require('pixi.js');
var PIXISOUND = require('pixi-sound');

var type = "WebGL"
if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas"
}
WebFontConfig = {
  custom: {
    families: ["Questrial"],
  }
  // active: function() {
  //   // do something
  //   init();
  // }
};

(function() {
  var wf = document.createElement('script');
  wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
    '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
  wf.type = 'text/javascript';
  wf.async = 'true';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(wf, s);
})();



PIXI.utils.sayHello(type);

//Aliases
var Container           = PIXI.Container,
    autoDetectRenderer  = PIXI.autoDetectRenderer,
    loader              = PIXI.loader,
    resources           = PIXI.loader.resources,
    Sprite              = PIXI.Sprite,
    TextureCache        = PIXI.utils.TextureCache,
    app                 = new PIXI.Application();


//Create a Pixi stage and renderer and add the
//renderer.view to the DOM
var stage = new Container(),
    renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {
        antialias: true,
        transparent: false,
        resolution: 1
    });

var style = new PIXI.TextStyle({
    fontFamily: 'Questrial',
    fontSize: 26,
    fill: ['#ffffff'], // gradient
    wordWrap: true,
    wordWrapWidth: 440
});

var style2 = new PIXI.TextStyle({
    fontFamily: 'Questrial',
    fontSize: 14,
    fill: ['#ffffff'], // gradient
    wordWrap: true,
    wordWrapWidth: 440
});

var style3 = new PIXI.TextStyle({
    fontFamily: 'Questrial',
    fontSize: 20,
    fill: ['#ffffff']
});

var PAUSED   = true;
var INTRO    = true;
var MUTE     = false;
//var ISLOADING = true;
var nbPoints = 0;
var best     = (sessionStorage.getItem("best")) ? sessionStorage.getItem("best") : 0;

document.body.appendChild(renderer.view);

renderer.view.style.position = "absolute";
// renderer.view.style.display = "block";
renderer.autoResize = true;

//load an image and run the `setup` function when it's done
// @TODO verif loader
loader
    .add("images/link.png")
    .add("images/background.png")
    .add("playerWalk.json")
    .add("json/buttonPause.json")
    .add("json/mute.json")
    .add("json/chute.json")
    .on("progress", loadProgressHandler)
    .load(setup);

function loadProgressHandler(loader, resource) {
    //Display the file `url` currently being loaded
    console.log("loading: " + resource.url);

    //Display the percentage of files currently loaded
    console.log("progress: " + loader.progress + "%");

    //If you gave your files names as the first argument
    //of the `add` method, you can access them like this
    console.log("loading: " + resource.name);
}


function setup() {

    // SOUNDS
    var gameSound  = PIXI.sound.Sound.from('sounds/game.mp3');
    var PauseSound = PIXI.sound.Sound.from('sounds/ClickOnPause.mp3');
    var looseSound = PIXI.sound.Sound.from('sounds/loose.mp3');
    var introSound = PIXI.sound.Sound.from('sounds/intro_pause.mp3');

    //gameSound.play();
    gameSound.loop = true

    var bg1Texture = PIXI.Texture.fromImage("images/background1.png");
    var bg1 = new PIXI.extras.TilingSprite(bg1Texture, window.innerWidth, window.innerHeight);
    bg1.tilePosition.x = 0;
    bg1.tilePosition.y = 0;
    stage.addChild(bg1);

    var bg2Texture = PIXI.Texture.fromImage("images/background2.png");
    var bg2 = new PIXI.extras.TilingSprite(bg2Texture, window.innerWidth, window.innerHeight);
    bg2.tilePosition.x = 0;
    bg2.tilePosition.y = 0;
    stage.addChild(bg2);

    var bg3Texture = PIXI.Texture.fromImage("images/background3.png");
    var bg3 = new PIXI.extras.TilingSprite(bg3Texture, window.innerWidth, window.innerHeight);
    bg3.tilePosition.x = 0;
    bg3.tilePosition.y = 0;
    stage.addChild(bg3);

    var bg4Texture = PIXI.Texture.fromImage("images/background4.png");
    var bg4 = new PIXI.extras.TilingSprite(bg4Texture, window.innerWidth, window.innerHeight);
    bg4.tilePosition.x = 0;
    bg4.tilePosition.y = 0;
    stage.addChild(bg4);

    var bg5Texture = PIXI.Texture.fromImage("images/background5.png");
    var bg5 = new PIXI.extras.TilingSprite(bg5Texture, window.innerWidth, window.innerHeight);
    bg5.tilePosition.x = 0;
    bg5.tilePosition.y = 0;
    stage.addChild(bg5);

    var home2Texture = PIXI.Texture.fromImage("images/home2.png");
    var home2 = new PIXI.extras.TilingSprite(home2Texture, window.innerWidth, window.innerHeight);
    home2.tilePosition.x = 0;
    home2.tilePosition.y = 0;
    stage.addChild(home2);

    // LINK
    var texture = TextureCache["images/link.png"];
    var rectangle = new PIXI.Rectangle(0, 96, 32, 32);
    texture.frame = rectangle;
    // var link = new Sprite(texture);
    // link.x = 32;
    // link.height = 150;
    // stage.addChild(link);


    // PLAYER
    // create an array of textures from an image path
    var frames = [];

    for (var i = 0; i < 55; i++) {
        var val = i;
        // magically works since the spritesheet was loaded with the pixi loader
        frames.push(PIXI.Texture.fromFrame('player' + val + '.png'));
    }
    // create an AnimatedSprite (brings back memories from the days of Flash, right ?)
    var player = new PIXI.extras.AnimatedSprite(frames);

    /*
     * An AnimatedSprite inherits all the properties of a PIXI sprite
     * so you can change its position, its anchor, mask it, etc
     */
    player.x = window.innerWidth / 4;
    player.y = 270;
    player.anchor.set(0.5);
    player.animationSpeed = 0.5;
    player.height = 120;
    player.width = 250;
    stage.addChild(player);

    // PLAYER_chute
    // create an array of textures from an image path
    var framesChute = [];

    for (var i = 0; i < 26; i++) {
        var val = i;
        // magically works since the spritesheet was loaded with the pixi loader
        framesChute.push(PIXI.Texture.fromFrame('chute' + val + '.png'));
    }
    // create an AnimatedSprite (brings back memories from the days of Flash, right ?)
    var playerChute = new PIXI.extras.AnimatedSprite(framesChute);

    /*
     * An AnimatedSprite inherits all the properties of a PIXI sprite
     * so you can change its position, its anchor, mask it, etc
     */
    playerChute.x = window.innerWidth / 4;
    playerChute.y = 270;
    playerChute.anchor.set(0.5);
    playerChute.animationSpeed = 0.5;
    playerChute.height = 120;
    playerChute.width = 250;
    stage.addChild(playerChute);
    playerChute.visible = false;

    var bg6Texture = PIXI.Texture.fromImage("images/background6.png");
    var bg6 = new PIXI.extras.TilingSprite(bg6Texture, window.innerWidth, window.innerHeight);
    bg6.tilePosition.x = 0;
    bg6.tilePosition.y = 0;
    stage.addChild(bg6);

    var textPoints = new PIXI.Text(nbPoints+ 'm', style);
    textPoints.position.y = 20;
    console.log('textPoints.position.x', textPoints.position.x)
    stage.addChild(textPoints);

    var textBest = new PIXI.Text('record : ' + best + 'm', style2);
    textBest.y = 50;
    textBest.x = 600;
    stage.addChild(textBest);

    var home1Texture = PIXI.Texture.fromImage("images/home1.png");
    var home1 = new PIXI.extras.TilingSprite(home1Texture, window.innerWidth, window.innerHeight);
    home1.tilePosition.x = 0;
    home1.tilePosition.y = 0;
    stage.addChild(home1);

    // var text1Content = "Qello world! "
    // var spaces1 = "$1 "; // put any number of spaces after the 

    // var text1 = new PIXI.Text(text1Content.replace(/(.)(?=.)/g, spaces1), {
    //     fontFamilly: "Questrial",
    //     fill: "white"
    //     }); // the higher this number the crispier the text
    // text1.x = 30;
    // text1.y = 30;
    // stage.addChild(text1);


    // PauseButton

    var framesButtonPause = [];
    for (var i = 0; i < 1; i++) {
        var val = i;
        // magically works since the spritesheet was loaded with the pixi loader
        framesButtonPause.push(PIXI.Texture.fromFrame('pause' + val + '.png'));
    }
    var buttonPause = new PIXI.extras.AnimatedSprite(framesButtonPause);

    /*
     * An AnimatedSprite inherits all the properties of a PIXI sprite
     * so you can change its position, its anchor, mask it, etc
     */
    buttonPause.x = window.innerWidth - 60;
    buttonPause.y = 20;
    buttonPause.height = 30;
    buttonPause.width = 30;
    buttonPause.interactive = true;
    buttonPause.animationSpeed = 1;
    // buttonPause.on('touchstart', (event) => {
    //     console.log('touchstart')
    //     buttonPause.gotoAndStop(1);
    //     pause();
    // });
    buttonPause.buttonMode = true;
    stage.addChild(buttonPause);




    var layer = new PIXI.Graphics();
    layer.beginFill(0x000000, 0.4);
    layer.drawRect(0, 0, window.innerWidth, window.innerHeight);
    layer.endFill();
    stage.addChild(layer);

    layer.interactive = true;

    layer.mouseup = layer.touchend = layer.touchendoutside = layer.mouseupoutside = function() {
        if (INTRO) {
            launchGame();
            INTRO = false;
        } else {
            pause();
        }

    }

      // PauseRestart

    var framesButtonRestart = [];
    for (var i = 0; i < 1; i++) {
        var val = i;
        // magically works since the spritesheet was loaded with the pixi loader
        framesButtonRestart.push(PIXI.Texture.fromFrame('pause' + val + '.png'));
    }
    var buttonRestart = new PIXI.extras.AnimatedSprite(framesButtonRestart);

    /*
     * An AnimatedSprite inherits all the properties of a PIXI sprite
     * so you can change its position, its anchor, mask it, etc
     */
    buttonRestart.x = (window.innerWidth / 2) + 60;
    buttonRestart.y = window.innerHeight / 2;
    buttonRestart.height = 40;
    buttonRestart.width = 40;
    buttonRestart.interactive = true;
    buttonRestart.animationSpeed = 1;
    buttonRestart.visible = false;
    buttonRestart.buttonMode = true;
    stage.addChild(buttonRestart);


    var framesButtonMute = [];
    for (var i = 0; i < 1; i++) {
        var val = i;
        // magically works since the spritesheet was loaded with the pixi loader
        framesButtonMute.push(PIXI.Texture.fromFrame('mute' + val + '.png'));
    }
    var buttonMute = new PIXI.extras.AnimatedSprite(framesButtonMute);

    /*
     * An AnimatedSprite inherits all the properties of a PIXI sprite
     * so you can change its position, its anchor, mask it, etc
     */
    buttonMute.x = (window.innerWidth / 2) - 100;
    buttonMute.y = window.innerHeight / 2;
    buttonMute.height = 40;
    buttonMute.width = 40;
    buttonMute.interactive = true;
    buttonMute.animationSpeed = 1;
    buttonMute.visible = false;
    buttonMute.buttonMode = true;
    stage.addChild(buttonMute);

    var framesButtonSounds = [];
    for (var i = 0; i < 1; i++) {
        var val = i;
        // magically works since the spritesheet was loaded with the pixi loader
        framesButtonSounds.push(PIXI.Texture.fromFrame('pause' + val + '.png'));
    }
    var buttonSounds = new PIXI.extras.AnimatedSprite(framesButtonSounds);

    /*
     * An AnimatedSprite inherits all the properties of a PIXI sprite
     * so you can change its position, its anchor, mask it, etc
     */
    buttonSounds.x = (window.innerWidth / 2) - 20;
    buttonSounds.y = (window.innerHeight / 2);
    buttonSounds.height = 40;
    buttonSounds.width = 40;
    buttonSounds.interactive = true;
    buttonSounds.animationSpeed = 1;
    buttonSounds.visible = false;
    // buttonSounds.on('touchstart', (event) => {
    //     console.log('touchstart')
    //     buttonSounds.gotoAndStop(1);
    //     Sounds();
    // });
    buttonSounds.buttonMode = true;
    stage.addChild(buttonSounds);

    var textPlay = new PIXI.Text("Tape n'importe où pour rentrer chez toi", style3);
    textPlay.y = window.innerHeight - 50;
    stage.addChild(textPlay);




    // BAD LINK
    var badLink = new Sprite(texture);
    badLink.interactive = true;
    badLink.x = window.innerWidth + 200;
    stage.addChild(badLink);

    // var layerBlack = new PIXI.Graphics();
    // layer.beginFill(0x000000, 1);
    // layer.drawRect(0, 0, window.innerWidth, window.innerHeight);
    // layer.endFill();
    // stage.addChild(layerBlack);
    //layerBlack.visible = false


    gameLoop();

    function resize(screen, texture) {
        screen.height = texture.height;
        screen.width = texture.width;
        screen.scale.y = (window.innerHeight / texture.height);
        screen.scale.x = (window.innerHeight / texture.height);
    }

    function launchGame() {
        PAUSED = false;
        player.play();
        layer.visible = false;
        textPlay.visible = false;
        gameSound.play();
        console.log(textPlay);
        console.log(textPlay.visible);
    }

    function gameLoop() {
        //layerBlack.visible = false
        //ISLOADING? layerBlack.visible = true : layerBlack.visible = false;
        if (!PAUSED) {
            home2.x -= 1;
            home1.x -= 1;

            bg6.tilePosition.x -= 3;
            bg5.tilePosition.x -= 3;
            bg4.tilePosition.x -= 0.7;
            bg3.tilePosition.x -= 1.5;
            bg2.tilePosition.x -= 1;
            badLink.x -= 1.6;

            nbPoints++;
            var showPoints = Math.floor(nbPoints / 60);

            if (showPoints > best) {
                best = showPoints;
                sessionStorage.setItem("best", best);
                console.log('BEST');
            }

            textPoints.text = showPoints + 'm';

            textBest.text = 'record : ' + best + 'm';
        }


        resize(bg6, bg6Texture);
        resize(bg5, bg5Texture);
        resize(bg4, bg4Texture);
        resize(bg3, bg3Texture);
        resize(bg2, bg2Texture);
        resize(bg1, bg1Texture);
        resize(home2, home2Texture);
        resize(home1, home1Texture);



        textPoints.x = 25;
        textBest.x = 25;
        textPlay.x = (window.innerWidth / 2) - (textPlay.width / 2);

        badLink.y = window.innerHeight - (window.innerHeight / 6.4);
        // link.y = window.innerHeight - (window.innerHeight / 2);



        renderer.resize(window.innerWidth, window.innerHeight);



        if (collision(player, badLink)) {
            badLink.x = window.innerWidth + 200;
            dead();
        }

        badLink.mouseup = badLink.touchend = badLink.touchendoutside = badLink.mouseupoutside = function() {
            console.log('click');
            badLink.x = window.innerWidth + 200;
        }





        renderer.render(stage);
        requestAnimationFrame(gameLoop);
    }

    function dead() {
        var looseText = new PIXI.Text('Perdu ! ', style);
        looseText.x = window.innerWidth / 2 - (looseText.width / 2);
        looseText.y = window.innerHeight / 2 - (looseText.height / 2);
        stage.addChild(looseText);

        playerChute.x = player.x;
        playerChute.y = player.y;

        player.visible = false;
        playerChute.visible = true;

        setTimeout(function() {
            nbPoints = 0;
            stage.removeChild(looseText);
            // gameLoop();
        }, 1500);
    }



    buttonPause.mouseup = buttonPause.touchend = buttonPause.touchendoutside = buttonPause.mouseupoutside = function() {
        pause();
    }
    buttonMute.mouseup = buttonMute.touchend = buttonMute.touchendoutside = buttonMute.mouseupoutside = function() {
        toggleMute();
    }
    buttonRestart.mouseup = buttonRestart.touchend = buttonRestart.touchendoutside = buttonRestart.mouseupoutside = function() {
        restart();
    }

    function pause () {

        PAUSED = !PAUSED;

        if (PAUSED) {

            if(!MUTE) {
                gameSound.pause();
                PauseSound.play();
                introSound.play();
            }
            introSound.loop = true;
            player.gotoAndStop(1);
            layer.visible = true;
            buttonRestart.visible = true;
            buttonMute.visible = true;
            buttonSounds.visible = true;
         } else {

            if(!MUTE) {
                gameSound.play();
                introSound.pause();
            }
            player.play();
            layer.visible = false;
            buttonRestart.visible = false;
            buttonMute.visible = false;
            buttonSounds.visible = false;
         }
    }

    function toggleMute () {
        MUTE = !MUTE;
        if (MUTE){
            PIXI.sound.muteAll();
        } else {
            PIXI.sound.unmuteAll();
        }
    }

    function toggleSounds () {
        MUTE = !MUTE;
        if (MUTE){
            PIXI.sound.muteAll();            
        } else {
            PIXI.sound.unmuteAll();
        }
    }

    function restart () {
        location.reload();
    }

}



function collision(a, b) {
    var ab = a.getBounds();
    var bb = b.getBounds();
    return ((ab.x + ab.width - 110) > bb.x) && (ab.x < (bb.x + bb.width)) && ((ab.y + ab.height) > bb.y && ab.y) < (bb.y + bb.height);
}
