/**
 * Primary frontend script
 * main.js
 *
 * Wisteria Life
 *
 * Depends on Browserify for node.js style requires
 *
 * This is frontend only.
 */

// include backend components
var GameData = require('./backend/GameData');
var GameLogicManager = require('./backend/GameLogicManager');
var GameManager = require('./backend/GameManager');
var Level = require('./backend/Level');
var LevelManager = require('./backend/LevelManager');
var Powerup = require('./backend/Powerup');
var PowerupManager = require('./backend/PowerupManager');
var ScreenManager = require('./backend/ScreenManager');
var Shape = require('./backend/Shape');
var ShapeManager = require('./backend/ShapeManager');
var User = require('./backend/User');

// include screens
var Screen = require('./screens/Screen');
var AboutScreen = require('./screens/AboutScreen');

// include screens
var Screen = require('./screens/Screen');
var AboutScreen = require('./screens/AboutScreen');
var AdScreen = require('./screens/AdScreen');
var DefeatScreen = require('./screens/DefeatScreen');
var GameMapScreen = require('./screens/GameMapScreen');
var GameplayScreen = require('./screens/GameplayScreen');
var LevelEditScreen = require('./screens/LevelEditScreen');
var LevelSelectScreen = require('./screens/LevelSelectScreen');
var LevelStoryScreen = require('./screens/LevelStoryScreen');
var PauseScreen = require('./screens/PauseScreen');
var PrivateCustomLevelsScreen = require('./screens/PrivateCustomLevelsScreen');
var PublicCustomLevelsScreen = require('./screens/PublicCustomLevelsScreen');
var SaveLevelScreen = require('./screens/SaveLevelScreen');
var SplashScreen = require('./screens/SplashScreen');
var StoreScreen = require('./screens/StoreScreen');
var VictoryScreen = require('./screens/VictoryScreen');

var DropdownMenu = require('./components/overflow');
var UserMenu = require('./components/UserMenu');
var PixiCanvas = require('./components/pixi-canvas');
var Canvas = require('./components/canvas');

/*
 * Test Screens
 */
var TestA = require('test').TestA;
var TestB = require('test').TestB;


// Initialize Firebase
var config = {
    apiKey: "AIzaSyBNCeWYe5TnqjvSIL9ieykBn59Zn3Aa0q0",
    authDomain: "wisteria-life-build2.firebaseapp.com",
    databaseURL: "https://wisteria-life-build2.firebaseio.com",
    storageBucket: "wisteria-life-build2.appspot.com",
    messagingSenderId: "103993744321"
};

var firebase = require("firebase");

firebase.initializeApp(config);

var gameManager = new GameManager();

/**
 * Child inherits from parent
 * Sets the child's prototype equal to the parent's
 *
 * @param child child object
 * @param parent parent object
 */
function inherits(child, parent) {
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = parent;
}

/**
 * Instantiate navbar events
 */
$(document).ready(function () {
    var menuElements = {
        activate: $('#hamburger-vert'),
        back: $('#drop-back'),
        store: $('#drop-store'),
        mute: $('#drop-mute'),
        about: $('#drop-about'),
        loginout: $('#drop-loginout')
    };

    var menu = new DropdownMenu(menuElements, gameManager);

    var userMenuElements = {
        activate: $('#user-menu'),
        loginout: $('#drop-loginout')
    };

    var userMenu = new UserMenu(userMenuElements);

    // temporary fix Only
    var canvasElement = $('#gameplay-canvas').length != 0 ? $('#gameplay-canvas') : $('#editor-canvas');
    var canvas = new PixiCanvas(canvasElement, 'medium');
    var canvas2 = new PixiCanvas(canvasElement, 'medium');

    var testB = new TestB();
    console.log(testB.getName());
    console.log(testB.getScreen());

    var testA = new TestA();
    console.log(testA.getName());
    console.log(testA.name);

    testA.name = "Test A Name";
    console.log(testA.name);
});

module.exports = {
    inherits: inherits
}
