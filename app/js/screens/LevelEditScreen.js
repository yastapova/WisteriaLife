
var Screen = require('./Screen');

var LevelEditScreen = function(id, level) {
    this.level = null;

    this.gameManager = require('GameManager');
    this.gameLogicManager = this.gameManager.gameLogicManager;

    Screen.call(this,id);
};

inherits(LevelEditScreen, Screen);

/**
 * Callback function for setting level from LevelManager loadLevel
 * @param {Level} level Level object
 */
LevelEditScreen.prototype.setLevel = function (level) {
    this.level = level;

    this.totalTime = this.level.time;

    var PixiCanvas = require('PixiCanvas');
    var canvas = new PixiCanvas($('#editor-canvas'), this.level.grid);

    this.gameLogicManager.setLevel(level, canvas);

    // current zoom level - needed to undo zoom changes
    this.currentZoom = level.grid;
}

LevelEditScreen.prototype.init = function() {
    console.log("Level edit screen init called");

    // materialize select menus
    $('select').material_select();

    var PixiCanvas = require('PixiCanvas');
    this.canvas = new PixiCanvas($('#editor-canvas'), 'medium');

    $('.dropdown-button').dropdown({
        constrain_width: false, // Does not change width of dropdown to that of the activator
        hover: true, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: false, // Displays dropdown below the button
        alignment: 'left' // Displays dropdown with edge aligned to the left of button
    });

    // load level, set level callback function
    // 41, 42, 43 are small, medium, large blank levels respectively
    // Saved levels will start from ID 44 onwards.
    // Default: 41
    this.gameManager.levelManager.loadLevel(41, this.setLevel.bind(this));

    // update current shape
    var self = this;
    $('#unit-select-menu select').change(function () {
        self.gameLogicManager.currentUnit =
            self.gameManager.shapeManager.getShape(
                $(this).val()
            );
    });

    // zoom select, ask for confirmation because this clears the canvas
    $('#zoom-select-menu select').change(function () {
        // the new 0.97.8 method doesn't work
        // https://github.com/Dogfalo/materialize/issues/3902
        $('#resize-confirm').openModal();
    });

    // user confirms resize, clear and resize
    $('#resize-yes').click(function () {
        $('#editor-canvas').empty();

        switch ($('#zoom-select-menu select').val()) {
            case 'small':
                this.gameManager.levelManager.loadLevel(41, this.setLevel.bind(this));
                this.currentZoom = 'small';
                break;

            case 'medium':
                this.gameManager.levelManager.loadLevel(42, this.setLevel.bind(this));
                this.currentZoom = 'medium';
                break;

            case 'large':
                this.gameManager.levelManager.loadLevel(43, this.setLevel.bind(this));
                this.currentZoom = 'large';
                break;
        }

        $('#resize-confirm').closeModal();
    }.bind(this));

    // user cancels resize, revert value
    $('#resize-no').click(function () {
        $('#zoom-select-menu select').val(this.currentZoom);
        $('select').material_select();
        $('#resize-confirm').closeModal();
    }.bind(this));

};

LevelEditScreen.prototype.hide = function() {

};

LevelEditScreen.prototype.placeShape = function(shape) {

}

LevelEditScreen.prototype.isValidCell = function() {

}

LevelEditScreen.prototype.getRelativeCoords = function() {

}

module.exports = LevelEditScreen;
