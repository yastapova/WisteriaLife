/**
 * Splash screen
 * Initial screen that displays when app is loaded
 */
var Screen = require('./Screen');

var SplashScreen = function(id, buttons) {
    Screen.call(this, id, false);
    this.buttons = buttons;
};

inherits(SplashScreen, Screen);

/**
 * Init splash screen - event handlers
 * Callback for loading screens
 */
SplashScreen.prototype.init = function() {
    console.log("Splash screen init called");

    this.loginButton = $('#splash-login');
    this.guestButton = $('#splash-guest');
    this.guestLoginButton = $('#splash-guest-login');
    this.logoutButton = $('#splash-logout');
    this.playButton = $('#splash-play');
    this.guestProceedLoginButton = $('#guest-proceed-login');

    // Listeners for buttons
    var gameManager = require('GameManager');
    this.loginButton.on('click', gameManager.login.bind(gameManager));
    this.guestButton.on('click', gameManager.guest.bind(gameManager));
    this.logoutButton.on('click', gameManager.logout.bind(gameManager));
    this.playButton.on('click', gameManager.play.bind(gameManager));
    this.guestLoginButton.on('click', gameManager.guestLogin.bind(gameManager));
    this.guestProceedLoginButton.on('click', gameManager.login.bind(gameManager));
    gameManager.auth.onAuthStateChanged(gameManager.onAuthStateChanged.bind(gameManager));   

};

SplashScreen.prototype.checkUser = function() {

};

module.exports = SplashScreen;
