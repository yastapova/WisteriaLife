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
    this.sound = menu.sound;
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

    $('#drop-sound').on('click', function () {
        this.handleSoundButton();
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
        this.gameManager.handleToggleSound();
        this.mute.css('display', 'none');
        this.sound.css('display', 'block');
    },

    /**
     * Handle sound button
     */

    handleSoundButton: function() {
        this.gameManager.handleToggleSound();
        this.mute.css('display', 'block');
        this.sound.css('display', 'none');
    },

    /**
     * Handle about button
     */
    handleAboutButton: function () {

    }
};

module.exports = OverflowMenu;
