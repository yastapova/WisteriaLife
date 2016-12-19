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
    // this.guestLoginButton.on('click', gameManager.guestLogin.bind(gameManager));
    this.guestProceedLoginButton.on('click', gameManager.login.bind(gameManager));
    //

    if (gameManager.user) {
        this.playButton.show();
        this.logoutButton.show();

        this.loginButton.hide();
        this.guestButton.hide();

        if (gameManager.user.name == 'Guest') {
            this.guestLoginButton.show();

        } else {
            this.guestLoginButton.hide();
        }
    }

    // if has referrer, check this too
    if (!gameManager.user &&
        this.gameManager.screenManager.previousScreen !== '') {
        $('.login-button').show();
        $('.play-guest').show();

        $('.guest-login').hide();
        $('.play-button').hide();
        $('.logout-button').hide();
    }
};

SplashScreen.prototype.checkUser = function() {

};

/**
 * Splash screen always legal
 * @return {Boolean} Always true
 */
SplashScreen.prototype.isLegal = function () {
    return true;
}

module.exports = SplashScreen;
