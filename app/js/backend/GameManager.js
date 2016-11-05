var User = require('./User');
var ScreenManager = require('./ScreenManager');
var PowerupManager = require('./PowerupManager');
var ShapeManager = require('./ShapeManager');
var LevelManager = require('./LevelManager');

/**
 * GameManager handles the user and saving/loading of data
 */
var GameManager = function () {
	this.screenManager = new ScreenManager();
	this.powerupManager = new PowerupManager();
	this.shapeManager = new ShapeManager();
	this.levelManager = new LevelManager();
    this.user = new User();
    this.mute = false;
};

/**
 * Singleton-like
 */
GameManager.getGameManager = function () {
	if (!GameManager.gameManager) {
		GameManager.gameManager = new GameManager();
	}
	return GameManager.gameManager;
};

/**
 * Initialize user object, based on login status
 * @return {User} user object
 */
GameManager.prototype.initializeUser = function () {
    user = new User("Mystery Boxman");
    return user;
}

/**
 * Login event
 */
GameManager.prototype.login = function () {}

/**
 * Logout event
 */
GameManager.prototype.logout = function () {}

/**
 * Save data to local storage
 */
GameManager.prototype.saveToLocalStorage = function () {}

/**
 * Load data from local storage
 */
GameManager.prototype.loadFromLocalStorage = function () {}

/**
 * Save local storage to server
 */
GameManager.prototype.saveToServer = function () {}

/**
 * Load data from server
 */
GameManager.prototype.loadFromServer = function () {}

/**
 * Mute all sounds
 */
GameManager.prototype.mute = function () {}

/**
 * Return to the previous screen if eligible
 */
GameManager.prototype.back = function () {}

/**
 * Is user logged in?
 * @return {boolean} login status
 */
GameManager.prototype.checkIsLoggedIn = function () {
    return false;
}

module.exports = GameManager;
