/**
 * gameMap.js
 * Map region select screen
 */
var screen = require('./Screen');

var gameMap = function (id) {
    screen.call(this, id);
};

inherits(gameMap, screen);

/**
 * Load available levels/regions based on user progress
 */
gameMap.prototype.loadAvailableLevels = function () {

};

/*
 * Override the load and hide of the parent screen
 */
gameMap.prototype.load = function () {

};

gameMap.prototype.hide = function () {

};

module.exports = gameMap;
