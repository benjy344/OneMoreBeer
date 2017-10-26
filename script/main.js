var type = "WebGL"
if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas"
}

PIXI.utils.sayHello(type);


//Aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    TextureCache = PIXI.utils.TextureCache;


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

var PAUSED = true;
var nbPoints = 0;


document.body.appendChild(renderer.view);

renderer.view.style.position = "absolute";
// renderer.view.style.display = "block";
renderer.autoResize = true;

//load an image and run the `setup` function when it's done

loader
    .add("images/link.png")
    .add("images/background5.png")
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

    var spriteSVGImage = "images/home2.svg";
    var spriteSVGTexture = PIXI.Texture.fromImage(spriteSVGImage);
    var spriteSVG = new PIXI.Sprite(spriteSVGTexture);


    var spriteSVGImage2 = "images/home1.svg";
    var spriteSVGTexture2 = PIXI.Texture.fromImage(spriteSVGImage2);
    var spriteSVG2 = new PIXI.Sprite(spriteSVGTexture2);


    stage.addChild(spriteSVG);

    // LINK
    var texture = TextureCache["images/link.png"];
    var rectangle = new PIXI.Rectangle(0, 96, 32, 32);
    texture.frame = rectangle;
    var link = new Sprite(texture);
    link.x = 32;
    link.height = 150;
    stage.addChild(link);

    stage.addChild(spriteSVG2);


    var bg6Texture = PIXI.Texture.fromImage("images/background6.png");
    var bg6 = new PIXI.extras.TilingSprite(bg6Texture, window.innerWidth, window.innerHeight);
    bg6.tilePosition.x = 0;
    bg6.tilePosition.y = 0;
    stage.addChild(bg6);

    var richText = new PIXI.Text(nbPoints+ 'm', style);
    richText.x = window.innerWidth - 20 - richText.width;
    richText.y = 20;
    stage.addChild(richText);







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

    function gameLoop() {
        bg6.tilePosition.x -= 3;
        bg5.tilePosition.x -= 3;
        bg4.tilePosition.x -= 0.7;
        bg3.tilePosition.x -= 1.5;
        bg2.tilePosition.x -= 1;
        badLink.x -= 2;

        resize(bg6, bg5Texture);
        resize(bg5, bg5Texture);
        resize(bg4, bg5Texture);
        resize(bg3, bg5Texture);
        resize(bg2, bg5Texture);
        resize(bg1, bg5Texture);


        spriteSVG.width = window.innerWidth;
        spriteSVG.height = window.innerHeight;
        spriteSVG2.width = window.innerWidth;
        spriteSVG2.height = window.innerHeight;

        renderer.resize(window.innerWidth, window.innerHeight);


        badLink.y = window.innerHeight - (window.innerHeight / 6.4);
        link.y = window.innerHeight - (window.innerHeight / 2);


        if (boxesIntersect(link, badLink)) {
            badLink.x = window.innerWidth + 200;
            dead();
        }

        badLink.mouseup = badLink.touchend = badLink.touchendoutside = badLink.mouseupoutside = function() {
            console.log('click');
            badLink.x = window.innerWidth + 200;
        }


        nbPoints++;
        showPoints = Math.floor(nbPoints / 60);
        richText.text = showPoints + 'm';
        richText.x = window.innerWidth - 20 - richText.width;

        if (!PAUSED) requestAnimationFrame(gameLoop);
        renderer.render(stage);
    }


    function dead() {

        var looseText = new PIXI.Text('Perdu ! ', style);
        looseText.x = window.innerWidth / 2 - (looseText.width / 2);
        looseText.y = window.innerHeight / 2 - (looseText.height / 2);
        stage.addChild(looseText);

        // PAUSED = true;

        setTimeout(function() {
            nbPoints = 0;
            stage.removeChild(looseText);
            // PAUSED = false;
            // gameLoop();
        }, 1500);
    }

}



function boxesIntersect(a, b) {
    var ab = a.getBounds();
    var bb = b.getBounds();
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}
