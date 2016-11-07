/*
 * PauseScreen.js
 * PauseScreen object
 */
var Screen = require('./Screen');

/*
 * Construct a PauseScreen with given id
 *
 */

var PauseScreen = function (id, properties) {
    this.properties = properties;
    Screen.call(this, id, true);
};

inherits(PauseScreen, Screen);

/*
 * Override the load and hide of the parent screen
 *
 */

PauseScreen.prototype.init = function() {
    console.log("Pause screen init called");

};

PauseScreen.prototype.hide = function() {

};

PauseScreen.prototype.replay = function() {

};

module.exports = PauseScreen;
