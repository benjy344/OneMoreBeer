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


//Create a Pixi stage and renderer and add the
//renderer.view to the DOM
var stage = new Container(),
    renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {
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

var PAUSED = true;
var nbPoints = 0;
var best = (sessionStorage.getItem("best")) ? sessionStorage.getItem("best") : 0;

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
    var link = new Sprite(texture);
    link.x = 32;
    link.height = 150;
    stage.addChild(link);


    // PLAYER
    // create an array of textures from an image path
    var frames = [];

    for (var i = 0; i < 57; i++) {
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
    player.x = app.renderer.width / 2;
    player.y = 270;
    player.anchor.set(0.5);
    player.animationSpeed = 0.5;
    player.height = 120;
    player.width = 250;
    stage.addChild(player);

    var bg6Texture = PIXI.Texture.fromImage("images/background6.png");
    var bg6 = new PIXI.extras.TilingSprite(bg6Texture, window.innerWidth, window.innerHeight);
    bg6.tilePosition.x = 0;
    bg6.tilePosition.y = 0;
    stage.addChild(bg6);

    var textPoints = new PIXI.Text(nbPoints+ 'm', style);
    textPoints.y = 20;
    stage.addChild(textPoints);

    var textBest = new PIXI.Text('record : ' + best + 'm', style2);
    textBest.y = 65;
    stage.addChild(textBest);

    var home1Texture = PIXI.Texture.fromImage("images/home1.png");
    var home1 = new PIXI.extras.TilingSprite(home1Texture, window.innerWidth, window.innerHeight);
    home1.tilePosition.x = 0;
    home1.tilePosition.y = 0;
    stage.addChild(home1);

    var layer = new PIXI.Graphics();
    layer.beginFill(0x000000, 0.4);
    layer.drawRect(0, 0, window.innerWidth, window.innerHeight);
    layer.endFill();
    stage.addChild(layer);

    layer.interactive = true;

    layer.mouseup = layer.touchend = layer.touchendoutside = layer.mouseupoutside = function() {
        launchGame();
    }

    var textPlay = new PIXI.Text("Tape n'importe où pour rentrer chez toi", style3);
    textPlay.y = window.innerHeight - 50;
    stage.addChild(textPlay);

    // incendie
    //
    // var incendieImages = ['incendie0.png', 'incendie1.png'];
    // var framesIncendie = [];
    // for (var i = 0; i < 1; i++) {
    //     var val = i;
    //     // magically works since the spritesheet was loaded with the pixi loader
    //     framesIncendie.push(PIXI.Texture.fromFrame('incendie' + val + '.png'));
    // }
    //
    // player.x = app.renderer.width / 2;
    // player.y = 250;;
    // player.anchor.set(0.5);
    // player.animationSpeed = 0.5;
    // player.height = 170;
    // player.width = 170;
    // player.play();
    // stage.addChild(player);
    //
    // var incendie = new PIXI.extras.AnimatedSprite(framesIncendie);




    // BAD LINK
    var badLink = new Sprite(texture);
    badLink.interactive = true;
    badLink.x = window.innerWidth + 200;
    stage.addChild(badLink);

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
    }

    function gameLoop() {
        if (!PAUSED) {
            home2.x -= 1;
            home1.x -= 1;

            bg6.tilePosition.x -= 3;
            bg5.tilePosition.x -= 3;
            bg4.tilePosition.x -= 0.7;
            bg3.tilePosition.x -= 1.5;
            bg2.tilePosition.x -= 1;
            badLink.x -= 2;

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


        resize(bg6, bg5Texture);
        resize(bg5, bg5Texture);
        resize(bg4, bg5Texture);
        resize(bg3, bg5Texture);
        resize(bg2, bg5Texture);
        resize(bg1, bg5Texture);
        resize(home2, home2Texture);
        resize(home1, home1Texture);


        textPoints.x = window.innerWidth - 20 - textPoints.width;
        textBest.x = window.innerWidth - 25 - textBest.width;
        textPlay.x = (window.innerWidth / 2) - (textPlay.width / 2);

        badLink.y = window.innerHeight - (window.innerHeight / 6.4);
        link.y = window.innerHeight - (window.innerHeight / 2);

        renderer.resize(window.innerWidth, window.innerHeight);



        if (boxesIntersect(link, badLink)) {
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

        setTimeout(function() {
            nbPoints = 0;
            stage.removeChild(looseText);
            // gameLoop();
        }, 1500);
    }

}



function boxesIntersect(a, b) {
    var ab = a.getBounds();
    var bb = b.getBounds();
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}
