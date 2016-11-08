var User = require('./User');
var ScreenManager = require('./ScreenManager');
var PowerupManager = require('./PowerupManager');
var GameLogicManager = require('./GameLogicManager');
var ShapeManager = require('./ShapeManager');
var LevelManager = require('./LevelManager');
var firebase = require('firebase');
/**
 * GameManager handles the user and saving/loading of data
 */
var GameManager = function() {
    this.initFirebase();    
    this.powerupManager = new PowerupManager();
    this.shapeManager = new ShapeManager();
    this.levelManager = new LevelManager();
    this.gameLogicManager = new GameLogicManager();
    this.screenManager = new ScreenManager(
        window.location.pathname.replace(/^\//, "")
    );
    //this.user = new User();
    this.mute = false;

    // Menu Bar
    this.userPic = document.getElementById('user-pic');
    this.userName = document.getElementById('user-name');

    // Dropdown
    this.userDropName = document.getElementsByClassName('user-name')[0];
    this.userLevel = document.getElementsByClassName('user-level')[0];
    this.userIconPic = document.getElementById('user-icon-pic');
    this.userPicDrop = document.getElementById('user-pic-drop');

};

/**
 * Singleton-like
 */
GameManager.getGameManager = function() {
    if (!GameManager.gameManager) {
        GameManager.gameManager = new GameManager();
    }
    return GameManager.gameManager;
};

/**
* Setup shortcuts to Firebase features and initiate firebase authentication
*/
GameManager.prototype.initFirebase = function() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBNCeWYe5TnqjvSIL9ieykBn59Zn3Aa0q0",
        authDomain: "wisteria-life-build2.firebaseapp.com",
        databaseURL: "https://wisteria-life-build2.firebaseio.com",
        storageBucket: "wisteria-life-build2.appspot.com",
        messagingSenderId: "103993744321"
    };

    firebase.initializeApp(config);

    // Shortcuts to Firebase SDK features.
    this.auth = firebase.auth();
    this.database = firebase.database();
    this.storage = firebase.storage();

    // Initialize Firebase authentication and listen to auth state changes
    this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

/**
 * Detects when the user is signed in or out and initializes a user when signed in
 * @return {User} User object
 */

GameManager.prototype.onAuthStateChanged = function(user) {
    if(user) {
        // User is signed in
        // Get the avatar and name from the Firebase user object
        var avatar = user.photoURL;
        var name = user.displayName;
        var id = user.getToken();
        user = new User(name, avatar, id);
        console.log(user);

        // Splash changes
        $('#splash-logout').css('display','block');
        $('#splash-login').css('display', 'none');

        // Navbar changes
        this.userName.textContent = name;
        this.userPic.style.backgroundImage = 'url(' + (avatar) + ')';
        $('#user-login').css('display','none');
        $('#user-name').css('display','inline-block');
        $('#user-pic').css('display','inline-block');

        // Dropdown changes
        this.userPicDrop.style.backgroundImage = 'url(' + (avatar) + ')';
        this.userDropName.textContent = name;
        this.userLevel.textContent = 'Level ' + user.gameData.getCurrentLevel();
        $('#drop-logout').css('display','block');
        $('#drop-login').css('display', 'none');
        $('#user-icon-def').css('display','none');
        $('#user-icon-pic').css('display','inline-block');
        $('#user-pic-drop').css('display','inline-block');

        return user;
    }
    else {
        // The user is signed out

        // Splash changes
        $('#splash-logout').css('display','none');
        $('#splash-login').css('display', 'block');

        // Navbar changes
        $('#user-login').css('display','block');
        $('#user-name').css('display','none');
        $('#user-pic').css('display','none');

        // Dropdown changes
        $('#drop-login').css('display','block');
        $('#drop-logout').css('display', 'none');
        $('#user-icon-def').css('display','inline-block');
        $('#user-icon-pic').css('display','none');
        $('#user-pic-drop').css('display','none');
        this.userDropName.textContent = "Guest";
        this.userLevel.textContent = 'Level 0';

    }
};

/**
 * Login event
 */
GameManager.prototype.login = function() {
    // Sign in Firebase using popup auth and Google as the identity provider
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
};

/**
 * Logout event
 */
GameManager.prototype.logout = function() {
    // Sign out of Firebase.
    firebase.auth().signOut();
};

/**
 * Save data to local storage
 */
GameManager.prototype.saveToLocalStorage = function() {};

/**
 * Load data from local storage
 */
GameManager.prototype.loadFromLocalStorage = function() {};

/**
 * Save local storage to server
 */
GameManager.prototype.saveToServer = function() {};

/**
 * Load data from server
 */
GameManager.prototype.loadFromServer = function() {};

/**
 * Mute all sounds
 */
GameManager.prototype.mute = function() {};

/**
 * Return to the previous screen if eligible
 */
GameManager.prototype.back = function() {};

/**
 * Is user logged in?
 * @return {boolean} login status
 */
GameManager.prototype.checkIsLoggedIn = function() {
    if (firebase.auth().currentUser) {
        return true;
    }
    else {
        return false;
    }
};

module.exports = GameManager.getGameManager();
