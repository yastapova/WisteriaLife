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

	// use gm if provided, oter
	this.gameManager = gm ? gm : gameManager;
}

DropdownMenu.prototype = {
	/**
	 * Handle back button
	 */
	handleBackButton: function () {

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
}
