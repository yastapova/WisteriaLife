/**
 * Dropdown menu constructor
 *
 * @constructor
 * @param {Object} menu map of menu jQuery DOM elements
 */
var DropdownMenu = function (menu, gm) {

	// set dropdown event
	menu.vert.dropdown();

	// set DOM elements
	this.back = menu.back;
	this.store = menu.store;
	this.mute = menu.mute;
	this.about = menu.about;
	this.loginout = menu.loginout;

	// use gm if provided, otherwise, use global
	this.gameManager = gm ? gm : gameManager;

	// set click events on all menu items
	this.back.on('click', function () {
		this.handleBackButton();
	}.bind(this));

	this.store.on('click', function () {
		this.handleStoreButton();
	}.bind(this));

	this.mute.on('click', function () {
		this.handleMuteButton();
	}.bind(this));

	this.about.on('click', function () {
		this.handleAboutButton();
	}.bind(this));

	this.loginout.on('click', function () {
		this.handleLoginoutButton();
	}.bind(this));
}

DropdownMenu.prototype = {
	/**
	 * Handle back button
	 */
	handleBackButton: function () {
		console.log("Back button pressed!");
	},

	/**
	 * Handle store button
	 */
	handleStoreButton: function () {

	},

	/**
	 * Handle mute button
	 */
	handleMuteButton: function () {

	},

	/**
	 * Handle about button
	 */
	handleAboutButton: function () {

	},

	/**
	 * Handle loginout button
	 */
	handleLoginoutButton: function () {

	},

	/**
	 * Switch between login and logout buttons
	 */
	toggleLoginout: function () {

	}
};
