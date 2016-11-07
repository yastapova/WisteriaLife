
var Screen = require('./Screen');

var LevelEditScreen = function(id, level) {
    this.level = level;
    this.renderGrid = [];
    this.defenseGrid = [];
    Screen.call(this,id);
};

inherits(LevelEditScreen, Screen);

LevelEditScreen.prototype.init = function() {
    console.log("Level edit screen init called");

    var PixiCanvas = require('PixiCanvas');
    var canvas = new PixiCanvas($('#editor-canvas'), 'medium');

    $('.dropdown-button').dropdown({
        constrain_width: false, // Does not change width of dropdown to that of the activator
        hover: true, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: false, // Displays dropdown below the button
        alignment: 'left' // Displays dropdown with edge aligned to the left of button
    });

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
