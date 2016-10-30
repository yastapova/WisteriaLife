/**
 * PixiCanvas manager
 *
 * Creates and inserts a canvas using Pixi.js
 * Manages all rendering
 *
 * @param {jQuery object} parent element of canvas
 */
var PixiCanvas = function (element) {

    // parent of canvas
    this.element = element;
    this.cellLength = 10;

    //Create the renderer
    this.renderer = PIXI.autoDetectRenderer(1280, 720, {
        antialias: false,
        transparent: false,
        resolution: 1
    });
    this.renderer.autoResize = true;
    this.renderer.backgroundColor = 0xeeeeee;

    //Add the canvas to the HTML document
    element.get(0).appendChild(this.renderer.view);

    //Create a container object called the `stage`
    this.stage = new PIXI.Container();

    // first resize
    this.resizePixiCanvas();

    //Tell the `renderer` to `render` the `stage`
    this.renderer.render(this.stage);

    // resize canvas whenever window resizes
    $(window).resize(function () {
        this.resizePixiCanvas();
    }.bind(this));

    // canvas click event
    this.renderer.view.addEventListener('click', respondToMouseClick.bind(this));
}

/**
 * Calculate canvas size to maintain 16:9 aspect ratio
 * Called when canvas first loads and on window resize
 */
PixiCanvas.prototype.resizePixiCanvas = function () {

    /*
        Calculate the canvas size to maintain 16:9 aspect ratio
        Either fill the height or the width
    */

    var width = this.element.width();
    var height = this.element.height();

    /*
        Keep one of the dimensions
        Pick the one that fits (best fit)
     */

    // Keep height
    var keepHeight = {
        height: height,
        width: height / 9 * 16
    }

    // Keep width
    var keepWidth = {
        height: width / 16 * 9,
        width: width
    }

    var canvasDimensions = keepHeight.width <= width ? keepHeight : keepWidth;

    // resize renderer
    this.renderer.resize(canvasDimensions.width, canvasDimensions.height);

    // resized canvas, so need to reset and re-render
    this.render();
};

/**
 * Render the basic grid
 */
PixiCanvas.prototype.render = function () {

    // clear canvas first
    this.reset();

    // render grid LINES
    this.renderGrid();
};

/**
 * Clear the canvas
 */
PixiCanvas.prototype.reset = function () {

};

PixiCanvas.prototype.respondToMouseClick = function () {
    // CALCULATE THE ROW,COL OF THE CLICK
    var canvasCoords = this.getRelativeCoords(event);
    var clickCol = Math.floor(canvasCoords.x/cellLength);
    var clickRow = Math.floor(canvasCoords.y/cellLength);

    // hardcoded pattern for now
    var pattern [5, 5, 6, 6, 7, 7];

    // Go through pattern and fill grid
    for (var i = 0; i < pixels.length; i += 2) {
        var col = clickCol + pixels[i];
        var row = clickRow + pixels[i+1];
    }

    // RENDER THE GAME IMMEDIATELY
    renderGame();
};

PixiCanvas.prototype.getRelativeCoords = function () {
    return (event.offsetX !== undefined && event.offsetY !== undefined) ?
        { x: event.offsetX, y: event.offsetY } :
        { x: event.layerX, y: event.layerY };
};

/**
 * Render the basic grid
 */
PixiCanvas.prototype.renderGrid = function () {

    // SET THE PROPER COLOR
    var strokeColor = 0xAAAAAA;
    var lineWidth = 1;

    // VERTICAL LINES
    for (var i = 0; i < this.renderer.width; i++) {
        var x1 = i * this.cellLength;
        var y1 = 0;
        var x2 = x1;
        var y2 = this.renderer.height;

        var line = new PIXI.Graphics();
        line.lineStyle(lineWidth, strokeColor, 1);
        line.moveTo(x1, y1);
        line.lineTo(x2, y2);
        this.stage.addChild(line);
    }

    // HORIZONTAL LINES
    for (var j = 0; j < this.renderer.height; j++) {
        var x1 = 0;
        var y1 = j * this.cellLength;
        var x2 = this.renderer.width;
        var y2 = y1;

        var line = new PIXI.Graphics();
        line.lineStyle(lineWidth, strokeColor, 1);
        line.moveTo(x1, y1);
        line.lineTo(x2, y2);
        this.stage.addChild(line);
    }

};
