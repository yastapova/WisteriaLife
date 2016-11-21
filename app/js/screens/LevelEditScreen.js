var Screen = require('./Screen');
var LevelEditManager = require('../backend/LevelEditManager');
var gameManager = require('../backend/GameManager');

/**
 * Level Edit Screen
 * @param {String} id          Screen name id ("level-edit")
 * @param {[type]} levelNumber Level number
 */
var LevelEditScreen = function(id, level) {
    this.level = null;

    this.gameManager = require('GameManager');
    this.levelEditManager = this.gameManager.levelEditManager;

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

    this.levelEditManager.setLevel(level, canvas);

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

    var self = this;

    // set initial time and time change event
    this.timeDisplay = $('#timer-display');
    this.timeBar = $('#timeline input');
    this.timeBar.on('change', function () {
        self.setTimeDisplay($(this).val());
    });
    this.timeBar.val(0);

    // update current shape
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

    // navigate to save level screen    
    $('#save-button').click(function(){
        this.gameManager.screenManager.switchScreens('save-level', this.level);
    }.bind(this));
    // navigate to private custom levels screen   
    $('#delete-button').click(function(){
        this.gameManager.screenManager.switchScreens('private-custom-levels');
    }.bind(this));

};

/**
 * Set Time display
 * Calculates m:ss format of seconds
 * @param {int} seconds Time in seconds
 */
LevelEditScreen.prototype.setTimeDisplay = function (seconds) {

    var percent = seconds / this.totalTime * 100;

    var minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;

    this.timeDisplay.text(minutes + ':' + (seconds < 10 ? '0' : '') + seconds);
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
