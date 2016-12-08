var User = require('./User');
var ScreenManager = require('./ScreenManager');
var PowerupManager = require('./PowerupManager');
var GameLogicManager = require('./GameLogicManager');
var LevelEditManager = require('./LevelEditManager');
var ShapeManager = require('./ShapeManager');
var LevelManager = require('./LevelManager');
var firebase = require('firebase');
/**
 * GameManager handles the user and saving/loading of data
 */
var GameManager = function () {
    this.initFirebase();

    this.powerupManager = new PowerupManager();
    this.shapeManager = new ShapeManager();
    this.levelManager = new LevelManager();
    this.gameLogicManager = new GameLogicManager();
    this.levelEditManager = new LevelEditManager();
    this.screenManager = new ScreenManager();

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
    this.userPic = $('#user-pic');
    this.userName = $('#user-name');
    // Dropdown
    this.userDropName = $('#user-name-dropdown');
    this.userLevel = $('#user-level');
    this.userIconPic = $('#user-icon-pic');
    this.userPicDrop = $('#user-pic-drop');

    // User
    this.user = '';
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
    apiKey: "AIzaSyAeAjQJFC4PhrmyFDfNiQds7XdW7pSSzz0",
    authDomain: "wisteria-life.firebaseapp.com",
    databaseURL: "https://wisteria-life.firebaseio.com",
    storageBucket: "wisteria-life.appspot.com",
    messagingSenderId: "689320437204"
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
    		if(!this.user){
	        	this.user = new User("Guest", null, user.uid);
	        	this.userLevel.textContent = 'Level ' + this.user.gameData.currentLevel;
                this.userDropName.text("Guest");

                if (this.screenManager.currentScreen == 'splash')
                    this.screenManager.switchScreens('map');

    	        this.writeUserData();
	        }else{
                // Check if guest already has data
                firebase.database().ref('/users/' + user.uid).once('value', function(snapshot) {
                  var exists = (snapshot.val() !== null);
                  this.userExistsCallback(user, exists, snapshot.val());
                }.bind(this));
            }

    		// Splash changes
	        $('#splash-logout').css('display','block');
	        $('#splash-login').css('display', 'none');
	        $('#splash-guest-login').css('display', 'block');
	        $('#splash-guest').css('display', 'none');
	        $('#splash-play').css('display', 'block');

	        $('#splash-play').css('display', 'block');

	        // Dropdown changes
	        $('#drop-login').css('display','none');
	        $('#drop-login-guest').css('display', 'block');
	        $('#drop-logout').css('display', 'block');
	        $('#user-icon-def').css('display','inline-block');
	        $('#user-icon-pic').css('display','none');
	        $('#user-pic-drop').css('display','none');
	        this.userDropName.text("Guest");
	    }
    	else{
    		// User is signed in
	        // Get the avatar and name from the Firebase user object
	        if(!this.user){
	        	// Check if user already has data
				firebase.database().ref('/users/' + user.uid).once('value', function(snapshot) {
				  var exists = (snapshot.val() !== null);
				  this.userExistsCallback(user, exists, snapshot.val());
				}.bind(this));
	        	// Guest wants to log in
	        } else if (this.user.name === "Guest"){
                console.log("MERGING ACCOUNTS!");
                // check the id values for this, possibly delete the old data
                // custom levels change uid and author
                // from users delete old uid user
                // storage old uid data = new uid data
	        	var currentGameData = this.user.gameData;
                var oldUid = this.user.uid;
	        	this.user = new User(user.displayName, user.photoURL, user.uid, this.user.levels);
	        	this.user.gameData = currentGameData;
                this.user.guestUid = oldUid;
	        	this.userLevel.text = 'Level ' + this.user.gameData.currentLevel;
	        	this.writeUserData();

                // custom levels change uid and author
                firebase.database().ref("/users/" + oldUid + "/levels/").once('value', function(snapshot){
                var levels = snapshot.val();
                for(var key in levels){                   
                    firebase.database().ref('/customLevels/' + levels[key]).uid = this.user.uid;
                    firebase.database().ref('/customLevels/' + levels[key]).author = this.user.userName;
                }
                // delete guest account
                firebase.database().ref('/users/' + this.gameManager.user.guestUid).remove();
                }.bind(this));
                
	        }
	        // Splash changes
	        $('#splash-logout').css('display','block');
	        $('#splash-login').css('display', 'none');
	        $('#splash-guest').css('display', 'none');
	        $('#splash-guest-login').css('display', 'none');
	        $('#splash-play').css('display', 'block');


	        // Navbar changes
	        this.userName.text(user.displayName);
	        this.userPic.css({"background" : "url(" + (user.photoURL) + ") no-repeat center center",
                "background-size" : "cover"});
	        $('#user-login').css('display','none');
	        $('#user-name').css('display','inline-block');
	        $('#user-pic').css('display','inline-block');

	        // Dropdown changes
	        this.userPicDrop.css({"background" : "url(" + (user.photoURL) + ") no-repeat center center",
                "background-size" : "cover"});
	        this.userDropName.text(user.displayName);
	        $('#drop-logout').css('display','block');
	        $('#drop-login-guest').css('display', 'none');
	        $('#drop-login').css('display', 'none');
	        $('#user-icon-def').css('display','none');
	        $('#user-icon-pic').css('display','inline-block');
	        $('#user-pic-drop').css('display','inline-block');
    	}
    }else{
    	// Splash changes
        $('#splash-logout').css('display','none');
        $('#splash-guest-login').css('display', 'none');
        $('#splash-login').css('display', 'block');
        $('#splash-guest').css('display', 'block');
        $('#splash-play').css('display', 'none');


        // Navbar changes
        $('#user-login').css('display','block');
        $('#user-name').css('display','none');
        $('#user-pic').css('display','none');

        // Dropdown changes
        $('#drop-login').css('display','block');
        $('#drop-login-guest').css('display', 'none');
        $('#drop-logout').css('display', 'none');
        $('#user-icon-def').css('display','inline-block');
        $('#user-icon-pic').css('display','none');
        $('#user-pic-drop').css('display','none');
        this.userDropName.text("Guest");
        this.userWistbux.text(0);

        this.user = "";
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
 * Guest login event
 */
GameManager.prototype.guest = function() {
    // Sign in Firebase using guest account
    firebase.auth().signInAnonymously();
};

/**
 * Logout event
 */
GameManager.prototype.logout = function() {
    if(this.user.name === "Guest"){
        // delete guest from database
        var userId = firebase.auth().currentUser.uid;
        firebase.database().ref("/users/" + userId + "/levels/").once('value', function(snapshot){
            var levels = snapshot.val();
            for(var key in levels){
                // delete from 2 locations: customLevels, levels
                firebase.database().ref('/customLevels/' + levels[key]).remove();
                firebase.database().ref('/levels/' + levels[key]).remove();
                // delete img from storage if it exists
                firebase.storage().ref(userId + "/"+ levels[key]).getDownloadURL().then(function(){console.log("Found image");}, function(){console.log("No image found");});
            }
            firebase.database().ref('/users/' + userId).remove();
            // Sign out of Firebase.
            firebase.auth().signOut();
            this.screenManager.switchScreens('splash');
            this.user = '';
            this.userDropName.text("Guest");
            }.bind(this));
    }else{
        // Sign out of Firebase.
        firebase.auth().signOut();
        this.screenManager.switchScreens('splash');
        this.user = '';
        this.userDropName.text("Guest");
    }
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
	console.log("Writing/updating data " + this.user.uid);
    if(!this.user.guestUid){
        firebase.database().ref('users/' + this.user.uid).set({
            username: this.user.name,
            gameData: this.user.gameData,
            levels: this.user.levels,
            avatar: this.user.avatar
        });
    }else{
    	firebase.database().ref('users/' + this.user.uid).set({
        	username: this.user.name,
        	gameData: this.user.gameData,
            levels: this.user.levels,
            avatar: this.user.avatar,
            guestUid: this.user.guestUid
    	});
    }
};

/**
 * Callback for reading user data from firebase
 */
GameManager.prototype.userExistsCallback = function (user, exists, snapshot) {
	if(exists){
        this.user = new User(user.displayName, user.photoURL, user.uid, snapshot.levels);
        this.user.name = this.user.name ? this.user.name : 'Guest';
		this.user.gameData = snapshot.gameData;
        this.user.guestUid = snapshot.guestUid;
        this.userWistbux.text(this.user.gameData.wistbux);
        this.userLevel.text('Level ' + this.user.gameData.currentLevel);

        // update data (particularly the avatar)
        this.writeUserData();
	}else{
        this.user = new User(user.displayName, user.photoURL, user.uid, []);
        this.userWistbux.text(this.user.gameData.wistbux);
        this.userLevel.text('Level ' + this.user.gameData.currentLevel);
		this.writeUserData();
	}
};


/**
 * Guest login modal
 */
GameManager.prototype.guestLogin = function () {
	$('#confirmation-modal').openModal();
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
GameManager.prototype.handleMute = function() {
    this.mute = true;
    $('audio').each(function() {
        $(this).attr("preload", "none");
        $(this).prop("muted", true);
    });
};

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
