'use strict';
/*
 * ScreenManager.js
 *
 * Manager for screens
 *
 */

/**
 * Starts a screen manager
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
        about: AboutScreen,
        ad: AdScreen,
        defeat: DefeatScreen,
        gameMap: GameMapScreen,
        gameplay: GameplayScreen,
        levelEdit: LevelEditScreen,
        levelStory: LevelStoryScreen,
        pauseScreen: PauseScreen,
        privateLevels: PrivateCustomLevelsScreen,
        publicLevels: PublicCustomLevelsScreen,
        saveLevel: SaveLevelScreen,
        splash: SplashScreen,
        store: StoreScreen,
        victory: VictoryScreen
    };

    // default screen: splash
    this.currentScreen = currentScreen && currentScreen in this.screenMap
                            ? current : 'splash';

    var properties = null; // TODO

    // load and display the current screen
    this.screen = new this.screenMap[this.currentScreen](this.currentScreen, properties);
    console.log(this.screen);
    this.screen.load();
};

ScreenManager.prototype.switchScreens = function (screen) {

    // screen should be valid, otherwise go to splash
    this.currentScreen = screen && screen in this.screenMap
                            ? screen : 'splash';

    // load and display the current screen
    var properties = null; // TODO
    this.screen = new this.screenMap[this.currentScreen](this.currentScreen, properties);
    this.screen.load();
}

/**
 * Back button
 */
ScreenManager.prototype.back = function () {

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
