var User = require('./User');
var ScreenManager = require('./ScreenManager');
var PowerupManager = require('./PowerupManager');
var GameLogicManager = require('./GameLogicManager');
var ShapeManager = require('./ShapeManager');
var LevelManager = require('./LevelManager');

/**
 * GameManager handles the user and saving/loading of data
 */
var GameManager = function() {

    this.screenManager = new ScreenManager(
        window.location.pathname.replace(/^\//, "")
    );
    this.powerupManager = new PowerupManager();
    this.shapeManager = new ShapeManager();
    this.levelManager = new LevelManager();
    this.gameLogicManager = new GameLogicManager();
    this.user = new User();
    this.mute = false;
    // this.loginButton = document.getElementById('splash-login');
    // this.logoutButton = document.getElementById('splash-logout');
    //
    // // Listeners for buttons
    //
    // this.loginButton.addEventListener('click', this.login.bind(this));
    // this.logoutButton.addEventListener('click', this.logout.bind(this));
    // this.initFirebase();
};

/**
 * Singleton-like
 */
GameManager.getGameManager = function() {
    if (typeof GameManager.gameManager === 'undefined') {
        GameManager.gameManager = new GameManager();
    }
    return GameManager.gameManager;
};

GameManager.prototype.initFirebase = function() {

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

    // Shortcuts to Firebase SDK features.
    this.auth = firebase.auth();
    this.database = firebase.database();
    this.storage = firebase.storage();

    // Initiates Firebase auth and listen to auth state changes.
    //this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

/**
 * Initialize user object, based on login status
 * @return {User} user object
 */
GameManager.prototype.initializeUser = function() {
    user = new User("Mystery Boxman");
    return user;
}

/**
 * Login event
 */
GameManager.prototype.login = function() {
    // Sign in Firebase using popup auth and Google as the identity provider
    var provider = new firebase.auth.GoogleAuthProvider();
    this.auth.signInWithPopup(provider);
};

/**
 * Logout event
 */
GameManager.prototype.logout = function() {
    // Sign out of Firebase.
    this.auth.signOut();
}

/**
 * Save data to local storage
 */
GameManager.prototype.saveToLocalStorage = function() {}

/**
 * Load data from local storage
 */
GameManager.prototype.loadFromLocalStorage = function() {}

/**
 * Save local storage to server
 */
GameManager.prototype.saveToServer = function() {}

/**
 * Load data from server
 */
GameManager.prototype.loadFromServer = function() {}

/**
 * Mute all sounds
 */
GameManager.prototype.mute = function() {}

/**
 * Return to the previous screen if eligible
 */
GameManager.prototype.back = function() {}

/**
 * Is user logged in?
 * @return {boolean} login status
 */
GameManager.prototype.checkIsLoggedIn = function() {
    return false;
}

module.exports = GameManager.getGameManager();
