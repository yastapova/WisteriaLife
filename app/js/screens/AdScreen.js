/*
 * AdScreen.js
 * AdScreen object
 */
var screen = require('./Screen');

/*
 * Construct an AdScreen with given id
 *
 */

var AdScreen = function(id, timer, image) {
    if(timer === undefined && image === undefined) {
        this.timer = undefined;
        this.image = undefined;
    }
    else if(timer === undefined) {
        this.timer = undefined;
        this.image = image;
    }
    else if(image === undefined) {
        this.timer = timer;
        this.image = undefined;
    }
    else {
        this.timer = timer;
        this.image = image;
    }
    screen.call(this, id, timer, image);
};

inherits(AdScreen, screen);

/*
 * Override the load and hide of the parent screen
 *
 */

AdScreen.prototype.load = function() {

};

AdScreen.prototype.hide = function() {

};

module.exports = AdScreen;
