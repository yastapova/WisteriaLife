/**
 * Canvas manager
 *
 * ***
 * DO NOT USE - due to be replaced by pixi-canvas.js
 * Left here for now to avoid breaking pages that haven't updated yet
 *
 * gameplay and edit-level now use pixi-canvas.js instead
 * TODO - transition pause/defeat/victory/save-level to use pixi
 * ***
 *
 * @param {jQuery object} element Canvas jQuery item
 */
var Canvas = function (element) {
    this.element = element;

    // canvas 2D context
    this.canvas = element.get(0).getContext("2d");

    // temporary only
    this.cellLength = 25;

    // calculate size of canvas
    this.resizeCanvas();

    this.canvas.font = '24px Roboto';

    // resize canvas whenever window resizes
    $(window).resize(function () {
        this.resizeCanvas();
    }.bind(this));
}

/**
 * Calculate canvas size to maintain 16:9 aspect ratio
 * Called when canvas first loads and on window resize
 */
Canvas.prototype.resizeCanvas = function () {

    /*
        Calculate the canvas size to maintain 16:9 aspect ratio
        Either fill the height or the width
    */

    // reset to 100% again
    this.element.width('100%');
    this.element.height('100%');

    this.element.attr('width', '');
    this.element.attr('height', '');

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

    // resize actual element
    this.element.attr('width', canvasDimensions.width);
    this.element.attr('height', canvasDimensions.height);

    this.element.width('');
    this.element.height('');

    // resize canvas2D context
    this.canvas.width = canvasDimensions.width;
    this.canvas.height = canvasDimensions.height;

    // resized canvas, so need to reset and re-render
    this.render();
};

/**
 * Render the basic grid
 */
Canvas.prototype.render = function () {

    // clear canvas first
    this.reset();

    // render grid LINES
    this.renderGrid();
};

/**
 * Clear the canvas
 */
Canvas.prototype.reset = function () {
    this.canvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

/**
 * Render the basic grid
 */
Canvas.prototype.renderGrid = function () {
    // SET THE PROPER COLOR
    this.canvas.strokeStyle = '#aaa';
    this.canvas.lineWidth = 1;

    // VERTICAL LINES
    for (var i = 0; i < this.canvas.width; i++) {
        var x1 = i * this.cellLength;
        var y1 = 0;
        var x2 = x1;
        var y2 = this.canvas.height;
        this.canvas.beginPath();
        this.canvas.moveTo(x1, y1);
        this.canvas.lineTo(x2, y2);
        this.canvas.stroke();
    }

    // HORIZONTAL LINES
    for (var j = 0; j < this.canvas.height; j++) {
        var x1 = 0;
        var y1 = j * this.cellLength;
        var x2 = this.canvas.width;
        var y2 = y1;
        this.canvas.moveTo(x1, y1);
        this.canvas.lineTo(x2, y2);
        this.canvas.stroke();
    }
};
