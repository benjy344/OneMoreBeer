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

renderer.interactive = true;


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

var ennemiStage = new PIXI.Container();

var PAUSED = false;
var nbPoints = 0;


document.body.appendChild(renderer.view);

renderer.view.style.position = "absolute";
// renderer.view.style.display = "block";
renderer.autoResize = true;

renderer.render(stage);


//load an image and run the `setup` function when it's done

loader
    .add("images/link.png")
    .add("images/background.png")
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
    var farTexture = PIXI.Texture.fromImage("images/background.png");


    var farTexture = PIXI.Texture.fromImage("images/background.png");
    var far = new PIXI.Sprite(PIXI.loader.resources["images/background.png"].texture);
    far = new PIXI.extras.TilingSprite(farTexture, window.innerWidth, window.innerHeight);
    far.tilePosition.x = 0;
    far.tilePosition.y = 0;

    stage.addChild(far);

    var richText = new PIXI.Text(nbPoints + ' mètre', style);
    richText.x = window.innerWidth - 20 - richText.width;
    richText.y = 20;
    stage.addChild(richText);


    // requestAnimFrame(update);

    // LINK
    var texture = TextureCache["images/link.png"];
    var rectangle = new PIXI.Rectangle(0, 96, 32, 32);
    texture.frame = rectangle;
    var rocket = new Sprite(texture);
    rocket.x = 32;
    stage.addChild(rocket);


    // BAD LINK
    var badLink = new Sprite(texture);
    badLink.interactive = true;
    badLink.x = window.innerWidth + 200;
    ennemiStage.addChild(badLink);


    stage.addChild(ennemiStage);
    renderer.render(stage);

    gameLoop();

    function gameLoop() {
        far.tilePosition.x -= 2;
        badLink.x -= 5;

        renderer.resize(window.innerWidth, window.innerHeight);
        far.height = window.innerHeight;
        far.width = window.innerWidth;

        badLink.y = window.innerHeight - (window.innerHeight / 6.4);
        rocket.y = window.innerHeight - (window.innerHeight / 6.4);


        if (boxesIntersect(rocket, badLink)) {
            badLink.x = window.innerWidth + 200;
            dead();
        }

        badLink.mouseup = badLink.touchend = badLink.touchendoutside = badLink.mouseupoutside = function() {
            console.log('click');
            badLink.x = window.innerWidth + 200;
        }


        nbPoints++;
        showPoints = Math.floor(nbPoints / 50);
        var s = (showPoints > 1) ? 's' : '';
        richText.text = showPoints + ' mètre' + s;
        richText.x = window.innerWidth - 20 - richText.width;

        if (!PAUSED) requestAnimationFrame(gameLoop);
        renderer.render(stage);
    }


    function dead() {

        var looseText = new PIXI.Text('Perdu ! ', style);
        looseText.x = window.innerWidth / 2 - (looseText.width / 2);
        looseText.y = window.innerHeight / 2 - (looseText.height / 2);
        stage.addChild(looseText);

        PAUSED = true;



        setTimeout(function() {
            nbPoints = 0;
            stage.removeChild(looseText);
            PAUSED = false;
            gameLoop();
        }, 1500);
    }

}



function boxesIntersect(a, b) {
    var ab = a.getBounds();
    var bb = b.getBounds();
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}


var initialPoint;

var finalPoint;



renderer.touchstart = function(interactionData) {

    initialPoint = interactionData.getLocalPosition(this.parent);
    console.log(initialPoint);
}



renderer.touchend = renderer.touchendoutside = function(interactionData) {

    alert('touch end')

    finalPoint = interactionData.getLocalPosition(this.parent);

    var xAbs = Math.abs(initialPoint.x - finalPoint.x);

    var yAbs = Math.abs(initialPoint.y - finalPoint.y);

    if (xAbs > 20 || yAbs > 20) { //check if distance between two points is greater then 20 otherwise discard swap event

        if (xAbs > yAbs) {

            if (finalPoint.x < initialPoint.x)

                alert("swap left");

            else

                alert("swap right");

        } else {

            if (finalPoint.y < initialPoint.y)

                alert("swap up");

            else
                alert("swap down");
        }

    }

}