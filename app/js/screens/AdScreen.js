/*
 * AdScreen.js
 * AdScreen object
 */
var Screen = require('./Screen');

/*
 * Construct an AdScreen with given id
 *
 */

var AdScreen = function(id, level, timer, image) {
    Screen.call(this, id, true, level);

    this.timer = timer;
    this.image = image;
};

inherits(AdScreen, Screen);

/*
 * Override the load and hide of the parent screen
 *
 */

AdScreen.prototype.init = function() {
    console.log("Ad screen init called");

};

module.exports = AdScreen;
