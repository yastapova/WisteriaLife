/**
 * Primary frontend script
 * main.js
 *
 * Wisteria Life
 *
 * Depends on Browserify for node.js style requires
 */

// include backend components
var GameData = require('GameData');
var GameLogicManager = require('GameLogicManager');
var GameManager = require('GameManager');
var Level = require('Level');
var LevelManager = require('LevelManager');
var Powerup = require('Powerup');
var PowerupManager = require('PowerupManager');
var ScreenManager = require('ScreenManager');
var Shape = require('Shape');
var ShapeManager = require('ShapeManager');
var User = require('User');

// include screens
var Screen = require('Screen');
var AboutScreen = require('AboutScreen');
var AdScreen = require('AdScreen');
var DefeatScreen = require('DefeatScreen');
var GameMapScreen = require('GameMapScreen');
var GameplayScreen = require('GameplayScreen');
var LevelEditScreen = require('LevelEditScreen');
var LevelSelectScreen = require('LevelSelectScreen');
var LevelStoryScreen = require('LevelStoryScreen');
var PauseScreen = require('PauseScreen');
var PrivateCustomLevelsScreen = require('PrivateCustomLevelsScreen');
var PublicCustomLevelsScreen = require('PublicCustomLevelsScreen');
var SaveLevelScreen = require('SaveLevelScreen');
var SplashScreen = require('SplashScreen');
var StoreScreen = require('StoreScreen');
var VictoryScreen = require('VictoryScreen');

var DropdownMenu = require('overflow');
var UserMenu = require('UserMenu');
var PixiCanvas = require('pixi-canvas');
var Canvas = require('canvas');

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
});

module.exports = {
    inherits: inherits
}
