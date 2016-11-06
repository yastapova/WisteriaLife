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
    var GameManager = require('GameManager');
    var gameManager = GameManager.getGameManager();

    console.log('%cTesting GameManager', 'color: #c9a0dc; font-size: x-large');
    console.log(gameManager);
    console.log('%c=====', 'color: #c9a0dc; font-size: x-large');
});
