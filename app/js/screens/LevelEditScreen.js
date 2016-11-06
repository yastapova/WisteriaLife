
var screen = require('./Screen');

var LevelEditScreen = function(id, level) {
    this.level = level;
    this.renderGrid = [];
    this.defenseGrid = [];
    screen.call(this,id);
};

inherits(LevelEditScreen, screen);

LevelEditScreen.prototype.init = function() {
    console.log("Level edit screen init called");

    var PixiCanvas = require('pixi-canvas');
    var canvas = new PixiCanvas($('#editor-canvas'), 'medium');

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
