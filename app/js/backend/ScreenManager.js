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
var ScreenManager = function (currentScreen) {

    // screen manager is loaded once at beginning
    // no such last legal screen in the beginning
    this.lastLegalScreen = null;

    this.nextScreen = null;
    this.screenMap = null;

    // reference all the screens
    this.screenMap = {
        'about': AboutScreen,
        'ad': AdScreen,
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
        'victory': VictoryScreen
    };

    // default screen: splash
    this.currentScreen = currentScreen && currentScreen in this.screenMap
                            ? currentScreen : 'splash';

    /**
     * Popstate / Back Button
     */
    $(window).on('popstate', function (e) {
        if (history.state !== null)
            // read state ID that was pushed when switching originally
            this.switchScreens(history.state.screen);
    }.bind(this));


    var self = this; // need "this" inside callback, but can't bind here
    // use switchScreens() for all internal links
    $(document).on('click', 'a', function (e) {

        var href = $(this).attr("href");

        // non-event and internal links only
        if (href.indexOf('#!') == -1 && (
            href.indexOf(document.domain) > -1 || href.indexOf(':') === -1)
        ) {

            e.preventDefault(); // prevent link from working normally

            var newScreen = $(this)[0].pathname.replace(/^\//, "");
            newScreen = newScreen == '' ? 'splash' : newScreen;
            self.switchScreens(newScreen);
        }
    });
};

/**
 * Setup the initial screen
 * Cannot be done in constructor because some screens rely on game manager
 * Game manager relies on screen manager
 */
ScreenManager.prototype.setupInitScreen = function () {
    // load and display the current screen
    this.screen = new this.screenMap[this.currentScreen](this.currentScreen, null);

    // set initial state (for going back later)
    var screenSwitch = this.currentScreen == 'splash' ? '' : this.currentScreen;
    history.replaceState({screen: this.id}, '', screenSwitch);

    this.screen.init(); // first screen doesn't need to load, just init
}

ScreenManager.prototype.switchScreens = function (screen) {

    // screen should be valid, otherwise go to splash
    this.currentScreen = screen && screen in this.screenMap
                            ? screen : 'splash';

    // load and display the current screen
    var properties = null; // TODO

    this.screen = new this.screenMap[this.currentScreen](this.currentScreen, properties);
    this.screen.load(this.screen.init);
};

/**
 * Back button
 */
ScreenManager.prototype.back = function () {
    console.log("Back!");
    history.back();

    // TODO - restricting where the user can go back to
};

// require all screens
var Screen = require('../screens/Screen');
var AboutScreen = require('../screens/AboutScreen');
var AdScreen = require('../screens/AdScreen');
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
var VictoryScreen = require('../screens/VictoryScreen');

module.exports = ScreenManager;
