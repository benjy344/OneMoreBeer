var PIXI = require('pixi.js');
var PIXISOUND = require('pixi-sound');

var type = "WebGL"
if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas"
}

PIXI.utils.sayHello(type);

//Aliases
var Container           = PIXI.Container,
    autoDetectRenderer  = PIXI.autoDetectRenderer,
    loader              = PIXI.loader,
    resources           = PIXI.loader.resources,
    Sprite              = PIXI.Sprite,
    TextureCache        = PIXI.utils.TextureCache,
    app                 = new PIXI.Application();

    var screenWidth = parseInt(window.innerWidth);
    var screenHeight = parseInt(window.innerHeight);


//Create a Pixi stage and renderer and add the
//renderer.view to the DOM
var stage = new Container(),
    renderer = PIXI.autoDetectRenderer(screenWidth, screenHeight, {
        antialias: true,
        transparent: false,
        resolution: 1
    });

var style = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#ffffff'], // gradient
    strokeThickness: 5,
    wordWrap: true,
    wordWrapWidth: 440
});

var style2 = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 14,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#ffffff'], // gradient
    wordWrap: true,
    wordWrapWidth: 440
});

var style3 = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 20,
    fill: ['#ffffff']
});

var PAUSED   = true;
var INTRO    = true;
var MUTE     = false;
var nbPoints = 0;
var best     = (sessionStorage.getItem("best")) ? sessionStorage.getItem("best") : 0;
var accelerator = 1;

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
    .add('json/fire.json')
    .add("json/mute.json")
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
    gameSound.loop = true

    var bg1Texture = PIXI.Texture.fromImage("images/background1.png");
    var bg1 = new PIXI.extras.TilingSprite(bg1Texture, screenWidth, screenHeight);
    bg1.tilePosition.x = 0;
    bg1.tilePosition.y = 0;
    stage.addChild(bg1);

    var bg2Texture = PIXI.Texture.fromImage("images/background2.png");
    var bg2 = new PIXI.extras.TilingSprite(bg2Texture, screenWidth, screenHeight);
    bg2.tilePosition.x = 0;
    bg2.tilePosition.y = 0;
    stage.addChild(bg2);

    var bg3Texture = PIXI.Texture.fromImage("images/background3.png");
    var bg3 = new PIXI.extras.TilingSprite(bg3Texture, screenWidth, screenHeight);
    bg3.tilePosition.x = 0;
    bg3.tilePosition.y = 0;
    stage.addChild(bg3);

    var bg4Texture = PIXI.Texture.fromImage("images/background4.png");
    var bg4 = new PIXI.extras.TilingSprite(bg4Texture, screenWidth, screenHeight);
    bg4.tilePosition.x = 0;
    bg4.tilePosition.y = 0;
    stage.addChild(bg4);

    var bg5Texture = PIXI.Texture.fromImage("images/background5.png");
    var bg5 = new PIXI.extras.TilingSprite(bg5Texture, screenWidth, screenHeight);
    bg5.tilePosition.x = 0;
    bg5.tilePosition.y = 0;
    stage.addChild(bg5);

    var home2Texture = PIXI.Texture.fromImage("images/home2.png");
    var home2 = new PIXI.extras.TilingSprite(home2Texture, screenWidth, screenHeight);
    home2.tilePosition.x = 0;
    home2.tilePosition.y = 0;
    stage.addChild(home2);

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

    player.anchor.set(0.5);
    player.animationSpeed = 0.5;
    player.height = 120;
    player.width = 250;
    stage.addChild(player);

    var bg6Texture = PIXI.Texture.fromImage("images/background6.png");
    var bg6 = new PIXI.extras.TilingSprite(bg6Texture, screenWidth, screenHeight);
    bg6.tilePosition.x = 0;
    bg6.tilePosition.y = 0;
    stage.addChild(bg6);

    var textPoints = new PIXI.Text(nbPoints+ 'm', style);
    textPoints.position.y = 20;
    stage.addChild(textPoints);

    var textBest = new PIXI.Text('record : ' + best + 'm', style2);
    textBest.y = 65;
    textBest.x = 635;
    stage.addChild(textBest);

    var home1Texture = PIXI.Texture.fromImage("images/home1.png");
    var home1 = new PIXI.extras.TilingSprite(home1Texture, screenWidth, screenHeight);
    home1.tilePosition.x = 0;
    home1.tilePosition.y = 0;
    stage.addChild(home1);


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
    buttonPause.height = 40;
    buttonPause.width = 40;
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
    layer.drawRect(0, 0, screenWidth, screenHeight);
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
    buttonRestart.x = (screenWidth / 2) + 60;
    buttonRestart.y = screenHeight / 2;
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
    buttonMute.x = (screenWidth / 2) - 100;
    buttonMute.y = screenHeight / 2;
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
    buttonSounds.x = (screenWidth / 2) - 20;
    buttonSounds.y = (screenHeight / 2);
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
    stage.addChild(textPlay);

    // BAD LINK 2
    var link2Texture = TextureCache["images/link.png"];
    var rectangle2 = new PIXI.Rectangle(0, 96, 32, 32);
    link2Texture.frame = rectangle2;
    var badLink2 = new Sprite(link2Texture);
    badLink2.interactive = true;
    stage.addChild(badLink2);

    // BAD LINK 3
    var link3Texture = TextureCache["images/link.png"];
    var rectangle3 = new PIXI.Rectangle(0, 96, 32, 32);
    link3Texture.frame = rectangle3;
    var badLink3 = new Sprite(link3Texture);
    badLink3.interactive = true;
    stage.addChild(badLink3);



    // create an array of textures from an image path
    var framesFire = [];

    framesFire.push(PIXI.Texture.fromFrame('fire1.png'));
    framesFire.push(PIXI.Texture.fromFrame('fire2.png'));

    var fire = new PIXI.extras.AnimatedSprite(framesFire);

    fire.anchor.set(0.5);
    fire.animationSpeed = 0.1;
    fire.play();
    stage.addChild(fire);


    var badLink = fire;
    badLink.interactive = true;

    gameLoop();

    function resize(screen, texture) {
        screen.height = texture.height;
        screen.width = texture.width;
        screen.scale.y = (screenHeight / texture.height);
        screen.scale.x = (screenHeight / texture.height);
    }

    function launchGame() {
        PAUSED = false;
        player.play();
        layer.visible = false;
        textPlay.visible = false;
        gameSound.play();
    }

    function gameLoop() {

        screenWidth = parseInt(window.innerWidth);
        screenHeight = parseInt(window.innerHeight);

        if (!PAUSED) {
            nbPoints++;
            var showPoints = Math.floor(nbPoints / 60);

            if (showPoints > best) {
                best = showPoints;
                sessionStorage.setItem("best", best);
            }

            if (accelerator < 5) accelerator += 1 / 2000;
            else console.log('fin accelération !');

            textPoints.text = showPoints + 'm';
            textBest.text = 'record : ' + best + 'm';


            home2.x -= 1;
            home1.x -= 1;

            bg6.tilePosition.x -= 3 * accelerator;
            bg5.tilePosition.x -= 3 * accelerator;
            bg4.tilePosition.x -= 0.7 * accelerator;
            bg3.tilePosition.x -= 1.5 * accelerator;
            bg2.tilePosition.x -= 1 * accelerator;

            badLink.x -= 1.6 * accelerator;
            badLink2.x -= 1.6 * accelerator;
            badLink3.x -= 1.6 * accelerator;

            player.animationSpeed = 0.5 * accelerator;


        }


        resize(bg6, bg6Texture);
        resize(bg5, bg5Texture);
        resize(bg4, bg4Texture);
        resize(bg3, bg3Texture);
        resize(bg2, bg2Texture);
        resize(bg1, bg1Texture);
        resize(home2, home2Texture);
        resize(home1, home1Texture);

        layer.width = screenWidth;
        layer.height = screenHeight;

        player.x = screenWidth / 4;
        player.y = screenHeight - (screenHeight / 4);


        textPoints.x = 20;
        textBest.x = 20;
        textPlay.x = (screenWidth / 2) - (textPlay.width / 2);
        textPlay.y = screenHeight - (screenHeight / 8);

        badLink2.x = screenWidth + 600;
        fire.x = screenWidth + 200;
        badLink3.x = screenWidth + 500;
        
        badLink.y = screenHeight - (screenHeight / 5);
        badLink2.y = screenHeight - (screenHeight / 6.4);
        badLink3.y = screenHeight - (screenHeight / 6.4);

        buttonPause.x = screenWidth - 60;
        buttonPause.y = 40;

        renderer.resize(screenWidth, screenHeight);

        function getFarestLik() {
            return Math.max(badLink.x, badLink2.x, badLink3.x, screenWidth);
        }

        if (collision(player, badLink)) {
            dead();
        }

        if (collision(player, badLink2)) {
            dead();
        }

        if (collision(player, badLink3)) {
            dead();
        }

        function getPosition(obstacle) {
            obstacle.x = (Math.random() * (screenWidth / 3)) + getFarestLik() + ((screenWidth / 3) * accelerator);

        }

        fire.mouseup = fire.touchend = fire.touchendoutside = fire.mouseupoutside = function() {
            console.log('click !');
            getPosition(fire);
        }

        badLink2.mouseup = badLink2.touchend = badLink2.touchendoutside = badLink2.mouseupoutside = function() {
            console.log('click !');
            getPosition(badLink2);
        }

        badLink3.mouseup = badLink3.touchend = badLink3.touchendoutside = badLink3.mouseupoutside = function() {
            console.log('click !');
            getPosition(badLink3);
        }

        function dead() {
            var looseText = new PIXI.Text('Perdu ! ', style);
            looseText.x = screenWidth / 2 - (looseText.width / 2);
            looseText.y = screenHeight / 2 - (looseText.height / 2);
            stage.addChild(looseText);

            getPosition(badLink);
            getPosition(badLink2);
            getPosition(badLink3);


            PAUSED = true;
            layer.visible = true;
            player.gotoAndStop(1);

            setTimeout(function() {
                nbPoints = 0;
                stage.removeChild(looseText);
                PAUSED = false;
                layer.visible = false;
                player.play();
            }, 1500);
        }


        renderer.render(stage);
        requestAnimationFrame(gameLoop);
    }





    buttonPause.mouseup = buttonPause.touchend = buttonPause.touchendoutside = buttonPause.mouseupoutside = function() {
        pause();
    }
    buttonMute.mouseup = buttonMute.touchend = buttonMute.touchendoutside = buttonMute.mouseupoutside = function() {
        toggleMute();
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

}



function collision(a, b) {
    var ab = a.getBounds();
    var bb = b.getBounds();
    return ((ab.x + ab.width - 150) > bb.x) && (ab.x < (bb.x + bb.width)) && ((ab.y + ab.height) > bb.y && ab.y) < (bb.y + bb.height);
}
