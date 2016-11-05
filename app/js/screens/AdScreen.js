/*
 * AdScreen.js
 * AdScreen object
 */
var Screen = require('./Screen');

/*
 * Construct an AdScreen with given id
 *
 */

var AdScreen = function(id, timer, image) {
    Screen.call(this, true);

    this.timer = timer;
    this.image = image;
};

inherits(AdScreen, Screen);

/*
 * Override the load and hide of the parent screen
 *
 */

AdScreen.prototype.load = function() {

};

AdScreen.prototype.hide = function() {

};

module.exports = AdScreen;
