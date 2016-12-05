/*
 * TransitionScreen.js
 * TransitionScreen object
 */

var Screen = require('./Screen');

/*
 * Construct an TransitionScreen with given id
 *
 */

var TransitionScreen = function(id, level, timer, image) {
    Screen.call(this, id, true, level);

    this.timer = timer;
    this.image = image;
};

inherits(TransitionScreen, Screen);

/*
 * Override the load and hide of the parent screen
 *
 */

TransitionScreen.prototype.init = function() {
    console.log("Transition screen init called");

};

module.exports = TransitionScreen;
