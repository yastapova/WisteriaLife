/*
 * PauseScreen.js
 * PauseScreen object
 */
var screen = require('Screen');

/*
 * Construct a PauseScreen with given id
 *
 */

var PauseScreen = function(id, level) {
    if(level === undefined) {
        this.level = undefined;
    }
    else {
        this.level = level;
    }
    screen.call(this, id, level);
};

inherits(PauseScreen, screen);

/*
 * Override the load and hide of the parent screen
 *
 */

PauseScreen.prototype.load = function() {

};

PauseScreen.prototype.hide = function() {

};

PauseScreen.prototype.replay = function() {

};

module.exports = PauseScreen;
