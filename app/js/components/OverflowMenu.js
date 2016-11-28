/**
 * Dropdown menu constructor
 *
 * @constructor
 * @param {Object} menu map of menu jQuery DOM elements
 */
var OverflowMenu = function (menu) {

    this.gameManager = require('GameManager');

    // set dropdown event
    menu.activate.dropdown();

    // set DOM elements
    this.back = menu.back;
    this.store = menu.store;
    this.mute = menu.mute;
    this.about = menu.about;

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
}

OverflowMenu.prototype = {
    /**
     * Handle back button
     */
    handleBackButton: function () {
        require('GameManager').screenManager.back();
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
        this.gameManager.handleMute();
    },

    /**
     * Handle about button
     */
    handleAboutButton: function () {

    }
};

module.exports = OverflowMenu;
