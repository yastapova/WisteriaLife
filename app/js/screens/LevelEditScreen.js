
var screen = require('./Screen');

var LevelEditScreen = function(id, level) {
    this.level = level;
    this.renderGrid = [];
    this.defenseGrid = [];
    screen.call(this,id);
};

inherits(LevelEditScreen, screen);

LevelEditScreen.prototype.init = function() {

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
