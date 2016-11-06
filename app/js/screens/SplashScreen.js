/**
 * Splash screen
 * Initial screen that displays when app is loaded
 */
var Screen = require('./Screen');

var SplashScreen = function(id, buttons) {
    Screen.call(this, id, false);
    this.buttons = buttons;
}

inherits(SplashScreen, Screen);

/**
 * Init splash screen - event handlers
 * Callback for loading screens
 */
SplashScreen.prototype.init = function() {
    console.log("Splash screen init called");

    // testing only
    $('#splash-play').click(function (e) {
        e.preventDefault();

        var gameManager = require('GameManager').getGameManager();

        gameManager.screenManager.switchScreens('map');
    });
}

SplashScreen.prototype.checkUser = function() {

}

module.exports = SplashScreen;
