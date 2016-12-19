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

    this.userLevel = $('.user-level');

    // User
    this.user = '';
    this.userWistbux = $('.user-wistbux');
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

GameManager.prototype.onAuthStateChanged = function (user) {
    if (user) { // if logging in, user is true

        // hide login buttons
        $('.login-button').hide();

        // logging in so show play button
        $('.play-button').show();

        // show logout buttons
        $('.logout-button').show();

        // hide email field
        $('.user-email').hide();

        // hide login as guest button
        $('.play-guest').hide();

        if (user.isAnonymous) { // is user a guest?

            if (!this.user) { // guest user doesn't already exist
                this.user = new User('Guest', null, user.uid);
                this.userLevel.text('Level ' + this.user.gameData.currentLevel);

                // automatically move to map when logging in as guest
                if (this.screenManager.currentScreen == 'splash')
                    this.screenManager.switchScreens('map');
            }

            // check for existing guest data
            firebase.database().ref('/users/' + user.uid).once('value', function (snapshot) {
                var exists = snapshot.val() !== null;
                this.userExistsCallback(user, exists, snapshot.val());
            }.bind(this));

            // show guest login button
            $('.guest-login').show();

            $('.user-name').text('Guest');

            // show default icon
            $('.user-pic')
                .css({
                    "background" : "url(" + '/img/default-avatar.jpg' + ") no-repeat center center",
                    "background-size" : "cover",
                    "display" : "inline-block"
                });


        } else { // Google account logging in
            if (!this.user) { // does user exist yet?

                // Check if user already has data
                console.log(user.email);
				firebase.database().ref('/users/' + user.uid).once('value', function (snapshot) {
                    var exists = (snapshot.val() !== null);
                    this.userExistsCallback(user, exists, snapshot.val());
				}.bind(this));

            } else { // if this a guest merge?

                var currentGameData = this.user.gameData;
                var oldUid = this.user.uid;
	        	this.user = new User(user.displayName, user.photoURL, user.uid, this.user.levels);
	        	this.user.gameData = currentGameData;
                this.user.guestUid = oldUid;
	        	this.userLevel.text('Level ' + this.user.gameData.currentLevel);
	        	this.writeUserData();

                // custom levels change uid and author
                firebase.database().ref().once('value', function (snapshot){
                    var db = snapshot.val();
                    var updates = {};
                    for(var key in db.users[oldUid].levels){
                        updates["/customLevels/" + key] = {
                            author: this.user.name,
                            dateCreated: db.customLevels[key].dateCreated,
                            img: db.customLevels[key].img,
                            public: db.customLevels[key].public,
                            storyline: db.customLevels[key].storyline,
                            title: db.customLevels[key].title,
                            uid: this.user.uid
                        };
                        // firebase.database().ref('/customLevels/' + levels[key]).uid = this.user.uid;
                        // firebase.database().ref('/customLevels/' + levels[key]).author = this.user.name;
                    }
                    firebase.database().ref().update(updates);
                    // delete guest account
                    firebase.database().ref('/users/' + this.user.guestUid).remove();
                }.bind(this));

                $('.user-name').text(user.displayName);
                $('.user-pic')
                    .css({
                        "background" : "url(" + (user.photoURL) + ") no-repeat center center",
                        "background-size" : "cover",
                        "display" : "inline-block"
                    });
                $('.user-email').text(user.email).show();

            }

            // hide guest login button
            $('.guest-login').hide();
            $('.play-guest').hide();
        }

    } else { // logging out
        $('.login-button').show();
        $('.logout-button').hide();
        $('.guest-login').hide();
        $('.play-button').hide();
        $('.play-guest').show();
        $('.user-email').hide();

        $('.user-name').text('Guest');
        $('.user-pic')
            .css({
                "background" : "url(" + '/img/default-avatar.jpg' + ") no-repeat center center",
                "background-size" : "cover",
                "display" : "inline-block"
            });

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
        firebase.database().ref().once('value', function(snapshot){
            var db = snapshot.val();
            var userId = this.user.uid;
            for(var key in db.users[userId].levels){
                // delete img from storage if it exists
                firebase.storage().ref("/" + userId + "/" + key + "/" + db.customLevels[key].img).delete()
                    .then(function () {
                        console.log('Deleted level image.');
                    }).catch(function (error) {
                        console.warn(error);
                    });
                // delete from 2 locations: customLevels, levels
                firebase.database().ref('/customLevels/' + key).remove();
                firebase.database().ref('/levels/' + key).remove();
            }
            firebase.database().ref('/users/' + userId).remove();
            // Sign out of Firebase.
            firebase.auth().signOut();
            this.screenManager.switchScreens('splash');
            this.user = '';
            // this.userDropName.text("Guest");
        }.bind(this));
    }else{
        // Sign out of Firebase.
        firebase.auth().signOut();
        this.screenManager.switchScreens('splash');
        this.user = '';
        // this.userDropName.text("Guest");
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
            avatar: this.user.avatar,
            powerups: this.user.powerups
        });
    }else{
    	firebase.database().ref('users/' + this.user.uid).set({
        	username: this.user.name,
        	gameData: this.user.gameData,
            levels: this.user.levels,
            avatar: this.user.avatar,
            powerups: this.user.powerups,
            guestUid: this.user.guestUid
    	});
    }
};

/**
 * Callback for reading user data from firebase
 */
GameManager.prototype.userExistsCallback = function (user, exists, snapshot) {
	if (exists){
        this.user = new User(user.displayName, user.photoURL, user.uid, snapshot.levels);
        this.user.name = this.user.name ? this.user.name : 'Guest';
		this.user.gameData = snapshot.gameData;
        this.user.guestUid = snapshot.guestUid;
        this.user.powerups = snapshot.powerups;
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

    // is it a non-guest user?
    if (user.displayName) {

        $('.user-name').text(user.displayName);
        $('.user-pic')
            .css({
                "background" : "url(" + (user.photoURL) + ") no-repeat center center",
                "background-size" : "cover",
                "display" : "inline-block"
            });
        $('.user-email').text(user.email).show();
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
GameManager.prototype.handleToggleSound = function() {
    if(this.mute === false) {
        this.mute = true;
        $('audio').each(function() {
            $(this).attr("preload", "none");
            $(this).prop("muted", true);
        });
    }
    else {
        this.mute = false;
        $('audio').each(function() {
            $(this).attr("preload", "auto");
            $(this).prop("muted", false);
        });
    }
};

/**
 * Check is a sound is already playing
 */

GameManager.prototype.isPlaying = function(audioid) {
    var audio = document.getElementById(audioid);
    if(audio.currentTime > 0 || !audio.paused) {
        return true;
    }
    else {
        return false;
    }
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

GameManager.prototype.playAttack = function () {
    var chance = Math.floor(Math.random() * 100);

    if(chance < 65) {
        var attackSounds = ["/sounds/gameplay/attack1.wav", "/sounds/gameplay/attack2.wav",
                            "/sounds/gameplay/attack3.wav", "/sounds/gameplay/attack4.mp3"];

        if(!this.mute && !this.isPlaying("attack-sound")) {
            var number = Math.floor(Math.random() * (attackSounds.length));
            $('#attack-sound').attr("src", attackSounds[number]);
            $('#attack-sound')[0].play();
        }
    }
};

GameManager.prototype.playSpawnSounds = function () {

    var spawnSounds = ["/sounds/gameplay/slime1.wav", "/sounds/gameplay/slime2.wav",
                        "/sounds/gameplay/slime3.wav", "/sounds/gameplay/slime4.wav",
                        "/sounds/gameplay/slime5.wav", "/sounds/gameplay/slime6.wav",
                        "/sounds/gameplay/slime7.wav", "/sounds/gameplay/slime8.wav"];

    if(!this.mute && !this.isPlaying("spawn-sound")) {
        var number = Math.floor(Math.random() * (spawnSounds.length));
        $('#spawn-sound').attr("src", spawnSounds[number]);
        $('#spawn-sound')[0].play();
    }
};

GameManager.prototype.playErrorSounds = function () {
    if(!this.mute) {
        $('#error-sound')[0].play();
    }
};

module.exports = GameManager.getGameManager();
