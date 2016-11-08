var gameManager = require('GameManager')

/**
 * PixiCanvas manager
 *
 * Creates and inserts a canvas using Pixi.js
 * Manages all rendering
 *
 * @param {jQuery object} parent element of canvas
 * @param [String] size (small, medium, large)
 */
var PixiCanvas = function (element, size) {

    // parent of canvas
    this.element = element;

    // recalculated when rendering
    this.cellLength = 0;

    switch (size) {
        case 'small':
            this.size = {
                width: 36,
                height: 18
            };
            break;


        case 'medium':
            this.size = {
                width: 48,
                height: 27
            };
            break;

        case 'large':
            this.size = {
                width: 80,
                height: 45
            };
            break;

        default:
            this.size = {
                width: 48,
                height: 27
            }
    }

    // store grid of rendered shapes
    this.grid = new Array(this.size.width);
    for (var i = 0; i < this.size.width; i++) {
        this.grid[i] = new Array(this.size.height);
    }

    //Create the renderer
    this.renderer = PIXI.autoDetectRenderer(1280, 720, {
        antialias: false,
        transparent: true,
        resolution: 1
    });
    this.renderer.autoResize = true;
    // this.renderer.backgroundColor = 0xeeeeee;

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
    this.renderer.view.addEventListener('click', this.respondToMouseClick.bind(this));
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
    this.renderGridLines();
};

/**
 * Render the basic grid
 */
PixiCanvas.prototype.render = function () {

    this.renderer.render(this.stage);
};

/**
 * Clear the canvas
 */
PixiCanvas.prototype.reset = function () {
    for (var child of this.stage.children) {
        this.stage.removeChild(child);
    }
};

PixiCanvas.prototype.calculateCellLocation = function (col, row) {
    return {
        x: col * this.cellLength,
        y: row * this.cellLength
    }
};

/**
 * Set grid cell with specified color
 * @param {[type]} col   [description]
 * @param {[type]} row   [description]
 * @param {[type]} color [description]
 */
PixiCanvas.prototype.setCell = function (col, row, color) {
    var location = this.calculateCellLocation(col, row);

    // calculate location of the cell
    var rect = new PIXI.Graphics();
    rect.beginFill(color);

    // set the line style to have a width of 5 and set the color to red
    rect.lineStyle(1, 0xAAAAAA);

    // draw a rectangle
    rect.drawRect(location.x, location.y, this.cellLength, this.cellLength);

    // replace existing shape at location if exists
    var oldRect = this.grid[col][row];
    if (oldRect)
        this.stage.removeChild(oldRect);
    this.grid[col][row] = rect;

    this.stage.addChild(rect);

}

PixiCanvas.prototype.respondToMouseClick = function () {
    // CALCULATE THE ROW,COL OF THE CLICK
    var canvasCoords = this.getRelativeCoords(event);
    var clickCol = Math.floor(canvasCoords.x/this.cellLength);
    var clickRow = Math.floor(canvasCoords.y/this.cellLength);

    var friend = gameManager.gameLogicManager.FRIEND;
    gameManager.gameLogicManager.placeShape(clickRow, clickCol, friend);

    this.render();
};

PixiCanvas.prototype.getRelativeCoords = function () {
    return (event.offsetX !== undefined && event.offsetY !== undefined) ?
        { x: event.offsetX, y: event.offsetY } :
        { x: event.layerX, y: event.layerY };
};

/**
 * Render the basic grid
 */
PixiCanvas.prototype.renderGridLines = function () {

    // SET THE PROPER COLOR
    var strokeColor = 0xAAAAAA;
    var lineWidth = 1;

    // consistent canvas size regardless of device
    this.cellLength = this.renderer.width / this.size.width;

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

module.exports = PixiCanvas;
