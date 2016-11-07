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

/*
 * Test Screens
 */
var TestA = require('./test-screen/test').TestA;
var TestB = require('./test-screen/test').TestB;

/**
 * Instantiate navbar events
 *
 * All screen specific events should be moved to load() methods
 */
$(document).ready(function() {
    var menuElements = {
        activate: $('#hamburger-vert'),
        back: $('#drop-back'),
        store: $('#drop-store'),
        mute: $('#drop-mute'),
        about: $('#drop-about'),
        loginout: $('#drop-loginout')
    };

    var OverflowMenu = require('OverflowMenu');
    var menu = new OverflowMenu(menuElements);

    var userMenuElements = {
        activate: $('#user-menu'),
        loginout: $('#drop-loginout')
    };

    var UserMenu = require('UserMenu');
    var userMenu = new UserMenu(userMenuElements);

    /*
     * Test Screens
     */
    var TestA = require('./test-screen/test').TestA;
    var TestB = require('./test-screen/test').TestB;

    // singleton game manager
    var gameManager = require('GameManager');

    // setup initial screen
    gameManager.screenManager.setupInitScreen();
});
