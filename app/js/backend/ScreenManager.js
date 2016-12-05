'use strict';
/*
 * ScreenManager.js
 *
 * Manager for screens
 *
 * Splash screen is a special case.
 * All other pages go to their corresponding URL.
 *
 */

/**
 * Starts a screen manager
 * Sets up the initial screen
 * @param {string} current [optional] current screen, default splash
 */
var ScreenManager = function () {

    // all app timers
    this.timers = [];

    // reference all the screens
    this.screenMap = {
        'about': AboutScreen,
        'defeat': DefeatScreen,
        'map': GameMapScreen,
        'gameplay': GameplayScreen,
        'level-editor': LevelEditScreen,
        'level-select': LevelSelectScreen,
        'level-story': LevelStoryScreen,
        'pause': PauseScreen,
        'private-custom-levels': PrivateCustomLevelsScreen,
        'public-custom-levels': PublicCustomLevelsScreen,
        'save-level': SaveLevelScreen,
        'splash': SplashScreen,
        'store': StoreScreen,
        'transition': TransitionScreen,
        'tutorial': TutorialScreen,
        'victory': VictoryScreen
    };

    /**
     * Popstate / Back Button
     */
    $(window).on('popstate', function (e) {
        if (history.state !== null)
            // read state ID that was pushed when switching originally
            this.switchScreens(history.state.screen, history.state.property);
    }.bind(this));


    var self = this; // need "this" inside callback, but can't bind here
    // use switchScreens() for all internal links
    $(document).on('click', 'a', function (e) {

        var href = $(this).attr("href");

        // non-event and internal links only
        if (href.indexOf('#') == -1 && (
            href.indexOf(document.domain) > -1 || href.indexOf(':') === -1)
        ) {

            e.preventDefault(); // prevent link from working normally

            var newScreen = $(this)[0].pathname.split(/\//)[1];
            var property = $(this)[0].pathname.split(/\//)[2];

            // if property is undefined, also check for link attributes
            if (property === undefined)
                property = $(this).attr('data-level');

            if (property === undefined)
                property = $(this).attr('data-region');

            newScreen = newScreen == '' ? 'splash' : newScreen;
            self.switchScreens(newScreen, property);
        }
    });

    // loading indicator overlay
    this.loader = $('#loading-overlay');
};

/**
 * Setup the initial screen
 * Cannot be done in constructor because some screens rely on game manager
 * Game manager relies on screen manager
 */
ScreenManager.prototype.setupInitScreen = function () {

    // game manager doesn't exist during constructor call
    this.gameManager = require('GameManager');

    // load and display the current screen
    var screenSwitch =  window.location.pathname.split(/\//)[1];
    var property = window.location.pathname.split(/\//)[2];

    this.currentScreen = this.screenMap[screenSwitch] ? screenSwitch : 'splash';

    this.previousScreen = '';
    this.screen = new this.screenMap[this.currentScreen](this.currentScreen, property);

    // set initial state (for going back later)

    history.replaceState({screen: this.id, property: property}, '', '/' + screenSwitch +
        (property ? '/' + property : '' ));

    // wait to init until user available
    if (this.currentScreen !== 'splash') {
        this.loader.fadeIn();
        var userCheck = setTimeout(function () {
            if (this.gameManager.user || this.gameManager.user === '') {
                clearTimeout(userCheck);

                // return could be true, false, or a string
                var legal = this.isLegal(this.screen);
                if (legal !== true) {
                    if (legal)
                        Materialize.toast(legal, 4000, 'wisteria-error-toast');

                    this.switchScreens('splash');
                    return;
                }

                this.screen.init(); // first screen doesn't need to load, just init
                this.loader.fadeOut();
            }
        }.bind(this), 250);
    } else {
        // splash screen is a special case so just load it
        this.screen.init();
    }

    $('#loading-overlay').fadeOut('fast');
}

/**
 * Switch screens
 * @param  {[type]} screen   [description]
 * @param  {String, Number, or Object} property Arbitrary property for each screen
 *                           If clicked from a link (event defined in constructor
 *                           above), property will be a Number.
 *                           If called directly, it can be anything.
 */
ScreenManager.prototype.switchScreens = function (screen, property) {

    // save previous screen, update instance var only if not overlay
    var previousScreen = this.currentScreen;

    // screen should be valid, otherwise go to splash
    this.currentScreen = screen && screen in this.screenMap
                            ? screen : 'splash';

    // load and display the current screen
    this.screen = new this.screenMap[this.currentScreen](this.currentScreen, property);

    // overlay screens don't count as previous screen
    if (this.screen.overlay)
        this.previousScreen = previousScreen;

    // return could be true, false, or a string
    var legal = this.isLegal(this.screen);
    if (legal !== true) {
        if (legal)
            Materialize.toast(legal, 4000, 'wisteria-error-toast');

        this.switchScreens('map');
        return;
    }

    this.screen.load();

    // stop timers if not an overlay
    if (!this.screen.overlay) {
        for (var i = 0; i < this.timers.length; i++) {
            clearInterval(this.timers[i]);
        }
        this.timers = [];

        // clear tooltips
        $('.material-tooltip').remove();
    }
};

/**
 * Hide overlay screen
 * @param  {Screen} screen Screen to remove
 */
ScreenManager.prototype.hideScreen = function (screen) {
    if (screen.overlayElement)
        screen.overlayElement.remove();
}

/**
 * Back button
 */
ScreenManager.prototype.back = function () {
    console.log("Back!");
    history.back();

    // TODO - restricting where the user can go back to
};

/**
 * Check if navigation to a screen is legal
 * @param  {Screen}  screen Screen being switched to
 * @return {Boolean/String} whether or not its legal or an error message
 */
ScreenManager.prototype.isLegal = function (screen) {
    return screen.isLegal(this.gameManager.user);
}

// require all screens
var Screen = require('../screens/Screen');
var AboutScreen = require('../screens/AboutScreen');
var DefeatScreen = require('../screens/DefeatScreen');
var GameMapScreen = require('../screens/GameMapScreen');
var GameplayScreen = require('../screens/GameplayScreen');
var LevelEditScreen = require('../screens/LevelEditScreen');
var LevelSelectScreen = require('../screens/LevelSelectScreen');
var LevelStoryScreen = require('../screens/LevelStoryScreen');
var PauseScreen = require('../screens/PauseScreen');
var PrivateCustomLevelsScreen = require('../screens/PrivateCustomLevelsScreen');
var PublicCustomLevelsScreen = require('../screens/PublicCustomLevelsScreen');
var SaveLevelScreen = require('../screens/SaveLevelScreen');
var SplashScreen = require('../screens/SplashScreen');
var StoreScreen = require('../screens/StoreScreen');
var TransitionScreen = require('../screens/TransitionScreen');
var TutorialScreen = require('../screens/TutorialScreen');
var VictoryScreen = require('../screens/VictoryScreen');

module.exports = ScreenManager;
