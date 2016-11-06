/*
 * LevelStoryScreen.js
 * LevelStoryScreen object
 */
var screen = require('./Screen');

/*
 * Construct a LevelStoryScreen with given id
 *
 */

var LevelStoryScreen = function(id, level) {
    if(level === undefined) {
        this.level = undefined;
    }
    else {
        this.level = level;
    }
    screen.call(this, id, level);
};

inherits(LevelStoryScreen, screen);

/*
 * Override the load and hide of the parent screen
 *
 */

LevelStoryScreen.prototype.init = function() {

};

LevelStoryScreen.prototype.hide = function() {

};

module.exports = LevelStoryScreen;
