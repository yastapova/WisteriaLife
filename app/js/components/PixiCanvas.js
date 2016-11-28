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

    // set dimensions
    this.setDimensions(size);

    // store grid of rendered shapes
    this.grid = new Array(this.size.width);
    for (var i = 0; i < this.size.width; i++) {
        this.grid[i] = new Array(this.size.height);
    }

    // resize canvas whenever window resizes
    $(window).resize(function () {
        this.resizePixiCanvas();
    }.bind(this));

    // canvas click event
    this.renderer.view.addEventListener('click', this.respondToMouseClick.bind(this));
    this.renderer.view.addEventListener('mousemove', this.respondToMouseMove.bind(this));
    // this.renderer.view.addEventListener('touchstart', this.respondToMouseClick.bind(this));
    this.renderer.view.addEventListener('touchmove', this.respondToMouseMove.bind(this), {passive:true});
    this.renderer.view.addEventListener('touchend', this.respondToMouseClick.bind(this), {passive:true});
    this.renderer.view.addEventListener('touchcancel', this.respondToTouchCancel.bind(this), {passive:true});
}

/**
 * Set the size (number of cells) of grid
 * @param  {String} size small, medium, or large
 */
PixiCanvas.prototype.setDimensions = function (size) {
    switch (size) {
        case 'small':
            this.size = {
                width: 36,
                height: 20
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

    // reset level
    this.reset();
    this.resizePixiCanvas();

    //Tell the `renderer` to `render` the `stage`
    this.renderer.render(this.stage);

    // resize canvas whenever window resizes
    $(window).resize(function () {
        this.resizePixiCanvas();
    }.bind(this));
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

    // consistent canvas size regardless of device
    this.cellLength = this.renderer.width / this.size.width;
};

/**
 * Render the basic grid
 */
PixiCanvas.prototype.render = function () {
    this.renderer.render(this.stage);
};

/**
 * Duplicate of GameLogicManager.renderGridCells
 *
 * TODO: using this method results in severe lag, although the identical
 * method in GameLogicManager does not
 */
PixiCanvas.prototype.renderGridCells = function(gridHeight, gridWidth, renderGrid, renderGridOld, colors) {
    for(var i = 0; i < gridHeight; i++)
    {
        for(var j = 0; j < gridWidth; j++)
        {
            // CALCULATE THE ARRAY INDEX OF THIS CELL
            // AND GET ITS CURRENT STATE
            var index = (i * gridWidth) + j;
            var renderCell = renderGrid[index];
            if(renderCell !== renderGridOld[index]) {
                this.setCell(j, i, colors[renderCell]);
            }
        }
    }

    renderGridOld = renderGrid;
    renderGrid = renderGrid.slice(0);

    this.render();
}

/**
 * Clear the canvas
 */
PixiCanvas.prototype.reset = function () {
    this.stage.children = [];

    // store grid of rendered shapes
    this.grid = new Array(this.size.width);
    for (var i = 0; i < this.size.width; i++) {
        this.grid[i] = new Array(this.size.height);
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

PixiCanvas.prototype.respondToMouseClick = function (event) {
    var isGameplay = gameManager.isGameplay;
    if(isGameplay) {
        if (gameManager.gameLogicManager.paused) {
            Materialize.toast(
                "Game not started yet! Press Play at the top.",
                2000,
                'wisteria-error-toast'
            );
            return;
        }

        // update count display
        var unit = gameManager.gameLogicManager.currentUnit;

        if (!unit) {
            Materialize.toast(
                "No unit selected! Select a unit from the Units sidebar.",
                2000,
                'wisteria-error-toast'
            );
            return;
        } else
            unit = unit.name;

        if (gameManager.gameLogicManager.allowedShapesMap[unit] == 0) {
            Materialize.toast(
                "No more of this unit available.",
                2000,
                'wisteria-error-toast'
            );
            return;
        }
    }
    else {
        var unit = gameManager.levelEditManager.selectedUnit;

        if (!unit) {
            Materialize.toast(
                "No unit selected! Select a unit from the Units sidebar.",
                2000,
                'wisteria-error-toast'
            );
            return;
        } else
            unit = unit.name;
    }

    // calculate coordinates
    var canvasCoords;

    // click or touch
    if (event.changedTouches !== undefined)
        canvasCoords = this.getRelativeTouchCoords(event);
    else
        canvasCoords = this.getRelativeCoords(event);

    var clickCol = Math.floor(canvasCoords.x/this.cellLength);
    var clickRow = Math.floor(canvasCoords.y/this.cellLength);

    if(isGameplay) {
        var friend = gameManager.gameLogicManager.FRIEND;
        gameManager.gameLogicManager.placeShape(clickRow, clickCol, friend, null, null);

        $('#unit-' + unit + ' .item-count').text(
            gameManager.gameLogicManager.allowedShapesMap[unit]
        );
        gameManager.gameLogicManager.clearGhostGrid();
    }
    else {
        var faction = gameManager.levelEditManager.selectedFaction;
        gameManager.levelEditManager.placeShape(clickRow, clickCol, faction, null, null);
        gameManager.levelEditManager.clearGhostGrid();
    }

    this.render();
};

PixiCanvas.prototype.respondToMouseMove = function () {
    // calculate coordinates
    var canvasCoords;

    // click or touch
    if (event.changedTouches !== undefined)
        canvasCoords = this.getRelativeTouchCoords(event);
    else
        canvasCoords = this.getRelativeCoords(event);
    var clickCol = Math.floor(canvasCoords.x/this.cellLength);
    var clickRow = Math.floor(canvasCoords.y/this.cellLength);
    var manager;
    if(gameManager.isGameplay) {
        manager = gameManager.gameLogicManager;
    }
    else {
        manager = gameManager.levelEditManager;
    }
    var ghost = manager.GHOST;
    // var blank = gameManager.gameLogicManager.BLANK;
    var grid = manager.ghostGrid;
    manager.clearGhostGrid();
    // gameManager.gameLogicManager.placeShape(this.prevGhostRow, this.prevGhostCol, blank, null, grid);
    manager.placeShape(clickRow, clickCol, ghost, null, grid);

    // this.prevGhostCol = clickCol;
    // this.prevGhostRow = clickRow;
    // this.render();
}

PixiCanvas.prototype.respondToTouchCancel = function() {
    var manager;
    if(gameManager.isGameplay) {
        manager = gameManager.gameLogicManager;
    }
    else {
        manager = gameManager.levelEditManager;
    }
    manager.clearGhostGrid();
}

PixiCanvas.prototype.getRelativeCoords = function (event) {
    return (event.offsetX !== undefined && event.offsetY !== undefined) ?
        { x: event.offsetX, y: event.offsetY } :
        { x: event.layerX, y: event.layerY };
};

PixiCanvas.prototype.getRelativeTouchCoords = function (event) {
    var rect = event.target.getBoundingClientRect();
    var touch = event.changedTouches[0];
    return {
        x: touch.pageX - rect.left,
        y: touch.pageY - rect.top
    }
};

/**
 * Render the basic grid
 */
PixiCanvas.prototype.renderGridLines = function () {

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

module.exports = PixiCanvas;
