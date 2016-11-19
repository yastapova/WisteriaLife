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
        window.location.pathname.split(/\//)[1]
    );

    // classes that need to load resources to be functional
    this.resources = [];
    Array.prototype.push.apply(this.resources, [
        this.powerupManager,
        this.shapeManager,
        this.levelManager
    ]);
    this.resourcesLoaded = 0;

    this.mute = false;

    // Menu Bar
    this.userPic = document.getElementById('user-pic');
    this.userName = document.getElementById('user-name');

    // Dropdown
    this.userDropName = document.getElementsByClassName('user-name')[0];
    this.userLevel = document.getElementsByClassName('user-level')[0];
    this.userIconPic = document.getElementById('user-icon-pic');
    this.userPicDrop = document.getElementById('user-pic-drop');

    // User
    this.user = undefined;
    this.userWistbux = $('#user-wistbux');
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
 * Load resources sequence start
 * @param  {Function} callback callback when ALL resources are done loading
 */
GameManager.prototype.loadResources = function (callback) {

    // callback when ALL resources are done loading
    this.resourcesLoadedCallback = callback;

    for (var i = 0; i < this.resources.length; i++) {
        // EACH resource will call this.resourceLoaded() when its done
        this.resources[i].load(this.resourceLoaded.bind(this));
    }
};

/**
 * Callback for a SINGLE resource being complete
 * Checks if all resources completed, if not, do nothing
 * If completed, then call the ALL resources done callback
 * @param  {Function} callback resource complete callback
 */
GameManager.prototype.resourceLoaded = function () {
    // there are multiple async resource loads, so need to count
    this.resourcesLoaded++;

    // all resources done!
    if (this.resourcesLoaded == this.resources.length) {
        this.resourcesLoadedCallback();
    }
};

/**
* Setup shortcuts to Firebase features and initiate firebase authentication
*/
GameManager.prototype.initFirebase = function() {
    // Initialize Firebase
	var config = {
	    apiKey: "AIzaSyCF30XXggPV9nLf3zBLEYpRUMjG55cQUaE",
	    authDomain: "wisteria-life-build3.firebaseapp.com",
	    databaseURL: "https://wisteria-life-build3.firebaseio.com",
	    storageBucket: "wisteria-life-build3.appspot.com",
	    messagingSenderId: "581646437875"
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
    	if(user.isAnonymous){
    		console.log("I am anonymous!");
    		if(this.user === undefined){
	        	this.user = new User("Guest", null, user.uid);
	        	this.userLevel.textContent = 'Level ' + this.user.gameData.currentLevel;
	        }
    		console.log(user);
    		// Splash changes
	        $('#splash-logout').css('display','block');
	        $('#splash-login').css('display', 'none');
	        $('#splash-guest').css('display', 'none');
	        $('#splash-play').css('display', 'block');

	        // Dropdown changes
	        $('#drop-login').css('display','block');
	        $('#drop-logout').css('display', 'none');
	        $('#user-icon-def').css('display','inline-block');
	        $('#user-icon-pic').css('display','none');
	        $('#user-pic-drop').css('display','none');
	        this.userDropName.textContent = "Guest";
	        this.writeUserData();
	    }
    	else{
    		// User is signed in
	        // Get the avatar and name from the Firebase user object
	        if(this.user === undefined){
	        	// Check if user already has data
	        	// TO DO
				var userRef = firebase.database().ref('/users/' + user.uid).once('value', function(snapshot) {
				  var exists = (snapshot.val() !== null);
				  this.userExistsCallback(user, exists, snapshot.val());
				}.bind(this));
	        	// Guest wants to log in
	        	// TO DO Merging!
	        }else if(this.user !== undefined && this.user.name === "Guest"){
	        	var currentGameData = this.user.gameData;
	        	this.user = new User(user.displayName, user.photoURL, user.uid);
	        	this.user.gameData = currentGameData;
	        	this.userLevel.text = 'Level ' + this.user.gameData.currentLevel;
	        	this.writeUserData();
	        }
	        console.log(user);

	        // Splash changes
	        $('#splash-logout').css('display','block');
	        $('#splash-login').css('display', 'none');
	        $('#splash-guest').css('display', 'none');
	        $('#splash-play').css('display', 'block');


	        // Navbar changes
	        this.userName.textContent = user.displayName;
	        this.userPic.style.backgroundImage = 'url(' + (user.photoURL) + ')';
	        $('#user-login').css('display','none');
	        $('#user-name').css('display','inline-block');
	        $('#user-pic').css('display','inline-block');

	        // Dropdown changes
	        this.userPicDrop.style.backgroundImage = 'url(' + (user.photoURL) + ')';
	        this.userDropName.textContent = name;
	        $('#drop-logout').css('display','block');
	        $('#drop-login').css('display', 'none');
	        $('#user-icon-def').css('display','none');
	        $('#user-icon-pic').css('display','inline-block');
	        $('#user-pic-drop').css('display','inline-block');
    	}
    }else{
    	// Splash changes
        $('#splash-logout').css('display','none');
        $('#splash-login').css('display', 'block');
        $('#splash-guest').css('display', 'block');
        $('#splash-play').css('display', 'none');


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
    }
};

/**
 * Login event
 */
GameManager.prototype.login = function() {
    // Sign in Firebase using popup auth and Google as the identity provider
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
    this.screenManager.switchScreens('map');
};

/**
 * Guest login event
 */
GameManager.prototype.guest = function() {
    // Sign in Firebase using guest account
    firebase.auth().signInAnonymously();
    this.screenManager.switchScreens('map');
};

/**
 * Logout event
 */
GameManager.prototype.logout = function() {
    // Sign out of Firebase.
    firebase.auth().signOut();
    this.screenManager.switchScreens('splash');
    this.user = undefined;
};

/**
 * Play event
 */
GameManager.prototype.play = function() {
    // Switch to the map screen
    this.screenManager.switchScreens('map');
};

/**
 * Write User Data
 */
GameManager.prototype.writeUserData = function () {
  firebase.database().ref('users/' + this.user.uid).set({
    username: this.user.name,
    gameData: this.user.gameData
  });
};

/**
 * Callback for reading user data from firebase
 */
GameManager.prototype.userExistsCallback = function (user, exists, snapshot) {
	this.user = new User(user.displayName, user.photoURL, user.uid);
	if(exists){
		console.log("I exist!");
		console.log(snapshot);
		this.user.gameData = snapshot.gameData;
		this.userLevel.textContent = 'Level ' + this.user.gameData.currentLevel;
		this.userWistbux.text(this.user.gameData.wistbux);
	}else{
	  	this.user = new User(user.displayName, user.photoURL, user.uid);
	  	this.userLevel.textContent = 'Level ' + this.user.gameData.currentLevel;
		this.writeUserData();
	}
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
