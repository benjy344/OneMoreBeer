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
var DEAD     = false;
var MOUVEINTRO = false;
var introIsPlaying = false;
//var ISLOADING = true;
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
    .add("images/background1.png")
    .add("images/background2.png")
    .add("images/background3.png")
    .add("images/background4.png")
    .add("images/background5.png")
    .add("images/background6.png")
    .add("images/home1.png")
    .add("images/home2.png")
    .add("playerWalk.json")
    .add("json/buttonPause.json")
    .add('json/fire.json')
    .add('json/cone.json')
    .add('json/egout.json')
    .add("json/mute.json")
    .add("json/chute.json")
    .add("images/incendie3.png")
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

    var bg1Texture = TextureCache["images/background1.png"];
    var bg1 = new PIXI.extras.TilingSprite(bg1Texture, screenWidth, screenHeight);
    bg1.tilePosition.x = 0;
    bg1.tilePosition.y = 0;
    stage.addChild(bg1);

    var bg2Texture = TextureCache["images/background2.png"];
    var bg2 = new PIXI.extras.TilingSprite(bg2Texture, screenWidth, screenHeight);
    bg2.tilePosition.x = 0;
    bg2.tilePosition.y = 0;
    stage.addChild(bg2);

    var bg3Texture = TextureCache["images/background3.png"];
    var bg3 = new PIXI.extras.TilingSprite(bg3Texture, screenWidth, screenHeight);
    bg3.tilePosition.x = 0;
    bg3.tilePosition.y = 0;
    stage.addChild(bg3);

    var bg4Texture = TextureCache["images/background4.png"];
    var bg4 = new PIXI.extras.TilingSprite(bg4Texture, screenWidth, screenHeight);
    bg4.tilePosition.x = 0;
    bg4.tilePosition.y = 0;
    stage.addChild(bg4);

    var bg5Texture = TextureCache["images/background5.png"];
    var bg5 = new PIXI.extras.TilingSprite(bg5Texture, screenWidth, screenHeight);
    bg5.tilePosition.x = 0;
    bg5.tilePosition.y = 0;
    stage.addChild(bg5);

    var home2Texture = TextureCache["images/home2.png"];
    var home2 = new PIXI.extras.TilingSprite(home2Texture, screenWidth, screenHeight);
    home2.tilePosition.x = 0;
    home2.tilePosition.y = 15;
    stage.addChild(home2);



    // BAD LINK 2
    var framesCone = [];
    framesCone.push(PIXI.Texture.fromFrame('cone_1.png'));
    framesCone.push(PIXI.Texture.fromFrame('cone_2.png'));
    var badLink2 = new PIXI.extras.AnimatedSprite(framesCone);
    badLink2.anchor.set(0.5);
    badLink2.height = 50;
    badLink2.width = 50;
    stage.addChild(badLink2);
    badLink2.interactive = true;


    // BAD LINK 3
    var framesEgout = [];
    framesEgout.push(PIXI.Texture.fromFrame('egout1.png'));
    framesEgout.push(PIXI.Texture.fromFrame('egout2.png'));
    var badLink3 = new PIXI.extras.AnimatedSprite(framesEgout);
    badLink3.anchor.set(0.5);
    badLink3.height = 50;
    badLink3.width = 50;
    stage.addChild(badLink3);
    badLink3.interactive = true;


    // BAD LINK 1
    // create an array of textures from an image path
    var framesFire = [];
    framesFire.push(PIXI.Texture.fromFrame('fire1.png'));
    framesFire.push(PIXI.Texture.fromFrame('fire2.png'));

    var framesFireEnd = TextureCache["images/incendie3.png"];
    var badLinkCopy = new Sprite(framesFireEnd);

    var badLink = new PIXI.extras.AnimatedSprite(framesFire);
    badLink.anchor.set(0.5);
    badLink.animationSpeed = 0.1;
    badLink.play();
    stage.addChild(badLink);
    stage.addChild(badLinkCopy);
    badLink.interactive = true;

    badLinkCopy.anchor.set(0.5);
    badLinkCopy.width = badLink.width;
    badLinkCopy.height = badLink.height;
    badLinkCopy.visible = false;

    badLink.x = screenWidth + 200;
    badLinkCopy.x = screenWidth + 200;
    badLink2.x = screenWidth + 600;
    badLink3.x = screenWidth + 500;

    // PLAYER
    // create an array of textures from an image path
    var frames = [];

    for (var i = 0; i < 55; i++) {
        var val = i;
        // magically works since the spritesheet was loaded with the pixi loader
        frames.push(PIXI.Texture.fromFrame('player' + val + '.png'));
    }
    var player = new PIXI.extras.AnimatedSprite(frames);

    player.anchor.set(0.5);
    player.animationSpeed = 0.5;
    player.height = 120;
    player.width = 250;
    player.x = 0;
    player.y = screenHeight - (screenHeight / 4) ;
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


    var bg6Texture = TextureCache["images/background6.png"];
    var bg6 = new PIXI.extras.TilingSprite(bg6Texture, screenWidth, screenHeight);
    bg6.tilePosition.x = 0;
    bg6.tilePosition.y = 0;
    stage.addChild(bg6);

    var textPoints = new PIXI.Text(nbPoints+ 'm', style);
    textPoints.position.y = 20;
    stage.addChild(textPoints);

    var textBest = new PIXI.Text('record : ' + best + 'm', style2);
    textBest.y = 50;
    textBest.x = 600;
    stage.addChild(textBest);

    var home1Texture = TextureCache["images/home1.png"];
    var home1 = new PIXI.extras.TilingSprite(home1Texture, screenWidth, screenHeight);
    home1.tilePosition.x = 0;
    home1.tilePosition.y = 15;
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
    layer.drawRect(0, 0, screenWidth, screenHeight);
    layer.endFill();
    stage.addChild(layer);

    layer.interactive = true;

    layer.mouseup = layer.touchend = layer.touchendoutside = layer.mouseupoutside = function() {
        if (INTRO) {
            launchGame();
            INTRO = false;
        } else if (DEAD) {
            restart();
        } else {
            pause();
        }

    }

    var logoSprite = PIXI.Sprite.fromImage("images/logo.png");
    //var logoSprite = new PIXI.extras.TilingSprite(logo, screenWidth, screenHeight);
    logoSprite.x = (parseInt(window.innerWidth)/2) - 125;
    logoSprite.y = 80;
    stage.addChild(logoSprite);

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
    textPlay.fadeOpacity = 1;
    stage.addChild(textPlay);

    // Animate the rotation
    app.ticker.add(function() {
        if(textPlay.fadeOpacity) {
            textPlay.alpha -= 0.01;
        }
        else {
            textPlay.alpha += 0.01;
        }

        if (textPlay.alpha <= 0.4) textPlay.fadeOpacity = 0;
        if (textPlay.alpha >= 1) textPlay.fadeOpacity = 1;
    });




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
        screen.scale.y = (screenHeight / texture.height);
        screen.scale.x = (screenHeight / texture.height);
    }

    function launchGame() {

        player.play();
        textPlay.visible = false;
        gameSound.play();
        MOUVEINTRO = true;


    }

    function gameLoop() {

        screenWidth = parseInt(window.innerWidth);
        screenHeight = parseInt(window.innerHeight);
        if (MOUVEINTRO) {
            player.x += 2;
            renderer.render(stage);
            requestAnimationFrame(gameLoop);
            if (player.x >= (screenWidth / 4) ){
                MOUVEINTRO = false;
                PAUSED = false;
                player.x = screenWidth / 4;
                player.y = screenHeight - (screenHeight / 4);
            }
        } else {

            if (INTRO) {
                if (!introIsPlaying){
                    introIsPlaying = true;
                    introSound.play();
                    introSound.loop = true;
                }
            } else {
                if (DEAD || PAUSED) {
                    if(!introIsPlaying) {
                        introIsPlaying = true;
                        introSound.play();
                        introSound.loop = true;
                    }
                } else {
                    if (logoSprite.alpha > 0 ) {
                        logoSprite.alpha -= .01;
                        layer.alpha -= .01;
                    } else {
                       logoSprite.visible = false;
                       layer.visible = false;
                       layer.alpha = 1;
                    }

                    introSound.pause();
                    introIsPlaying = false;
                }

            }
            if (!PAUSED) {
                nbPoints++;
                var showPoints = Math.floor(nbPoints / 60);


                if (accelerator < 5) parseInt(accelerator += 1 / 1000);
                else console.log('fin accelération !');

                if (showPoints > best) {
                    best = showPoints;
                    sessionStorage.setItem("best", best);
                }


                if (accelerator < 5) parseInt(accelerator += 1 / 2000);
                else console.log('fin accelération !');

                textPoints.text = showPoints + 'm';
                textBest.text = 'record : ' + best + 'm';

                home2.x -= 1;
                home1.x -= 1;

                badLink.x -= 1.6 * accelerator;
                badLinkCopy.x -= 1.6 * accelerator;
                badLink2.x -= 1.6 * accelerator;
                badLink3.x -= 1.6 * accelerator;

                bg6.tilePosition.x -= 3 * accelerator;
                bg5.tilePosition.x -= 3 * accelerator;
                bg4.tilePosition.x -= 0.7 * accelerator;
                bg3.tilePosition.x -= 1.5 * accelerator;
                bg2.tilePosition.x -= 1 * accelerator;

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





            textPoints.x = 20;
            textBest.x = 20;
            textPlay.x = (screenWidth / 2) - (textPlay.width / 2);
            textPlay.y = screenHeight - (screenHeight / 8);

            badLink.y = screenHeight - (screenHeight / 5);
            badLinkCopy.y = screenHeight - (screenHeight / 5);
            badLink2.y = screenHeight - (screenHeight / 6.4);
            badLink3.y = screenHeight - (screenHeight / 10);

            buttonPause.x = screenWidth - 60;
            buttonPause.y = 25;

            renderer.resize(screenWidth, screenHeight);

            function getFarestLik() {
                return Math.max(badLink.x, badLink2.x, badLink3.x, screenWidth);
            }


        if (collision(player, badLink)) {
            if(!badLink.passifOk) {
                console.log('dead link');
                 dead();
            }
        }

        if (collision(player, badLink2)) {
            if(!badLink2.passifOk) {
                console.log('dead link2');
                 dead();
            }
        }

        if (collision(player, badLink3)) {
            if(!badLink3.passifOk) {
                console.log('dead link3');
                 dead();
            }
        }

        if (badLink.x + 50 <= 0) {
            badLink.passifOk = 0;
            badLink.visible = true;
            getPosition(badLink);
        }

        if (badLink2.x <= 0) {
            badLink2.passifOk = 0;
            badLink2.gotoAndStop(0);
            getPosition(badLink2);
        }

        if (badLink3.x <= 0) {
            badLink3.passifOk = 0;
            badLink3.gotoAndStop(0);
            getPosition(badLink3);
        }

        function getPosition(obstacle) {
            var mvt = (Math.random() * (screenWidth / 3)) + getFarestLik() + ((screenWidth / 3) * accelerator);
            obstacle.x = mvt;

            if (obstacle === badLink) {
                badLinkCopy.x = mvt;
            }

            }

        badLink.mouseup = badLink.touchend = badLink.touchendoutside = badLink.mouseupoutside = function() {
            badLink.passifOk = 1;
            badLink.visible = false;
            badLinkCopy.visible = true;
        }

        badLink2.mouseup = badLink2.touchend = badLink2.touchendoutside = badLink2.mouseupoutside = function() {
            console.log('click !');
            badLink2.passifOk = 1;
            badLink2.gotoAndStop(1);
        }

        badLink3.mouseup = badLink3.touchend = badLink3.touchendoutside = badLink3.mouseupoutside = function() {
            console.log('click !');
            badLink3.passifOk = 1;
            badLink3.gotoAndStop(1);
        }

            function dead() {
                DEAD = true;
                var looseText = new PIXI.Text('Perdu ! ', style);
                looseText.x = screenWidth / 2 - (looseText.width / 2);
                looseText.y = screenHeight / 2 - (looseText.height / 2);
                stage.addChild(looseText);

                getPosition(badLink);
                getPosition(badLink2);
                getPosition(badLink3);

                playerChute.x = player.x;
                playerChute.y = player.y;

                player.visible = false;
                playerChute.visible = true;
                gameSound.pause();
                looseSound.play();
                setTimeout(function () {
                    if (!introIsPlaying) {
                        introSound.play();
                        introSound.loop = true;
                        introIsPlaying = true;
                    }
                }, 2500)

                playerChute.play();
                playerChute.loop = false;



                PAUSED = true;
                layer.visible = true;
                player.gotoAndStop(1);
                accelerator = 1;

                // setTimeout(function() {
                //     nbPoints = 0;
                //     home2.x = 0;
                //     home1.x = 0;
                //     stage.removeChild(looseText);
                //     PAUSED = false;
                //     layer.visible = false;
                //     player.play();
                // }, 1500);
            }


            renderer.render(stage);
            requestAnimationFrame(gameLoop);
        }

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
                introSound.loop = true;
                introIsPlaying = true;
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
                introIsPlaying = false;
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
    return ((ab.x + ab.width - 150) > bb.x) && (ab.x < (bb.x + bb.width)) && ((ab.y + ab.height) > bb.y && ab.y) < (bb.y + bb.height);
}
