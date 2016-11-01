/**
 * Splash screen
 * Initial screen that displays when app is loaded
 */
var screen = require('Screen');

 var splashScreen = function (id, buttons) {
     this.id = id;
     this.buttons = buttons;
 }

 splashScreen.prototype.checkUser = function () {

 }

 module.exports = splashScreen;
