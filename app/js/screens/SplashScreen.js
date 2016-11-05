/**
 * Splash screen
 * Initial screen that displays when app is loaded
 */
var screen = require('./Screen');

var splashScreen = function (id, buttons) {
 this.id = id;
 this.buttons = buttons;
}

splashScreen.prototype.load = function () {
    console.log("Splash screen load called");
}

splashScreen.prototype.checkUser = function () {

}

module.exports = splashScreen;
