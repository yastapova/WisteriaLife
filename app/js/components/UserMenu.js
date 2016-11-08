/**
 * Dropdown menu constructor
 *
 * @constructor
 * @param {Object} menu map of menu jQuery DOM elements
 */
var UserMenu = function (menu) {

    // set dropdown event
    menu.activate.dropdown();

    this.loginout = menu.loginout;

    this.loginout.on('click', function () {
        this.handleLoginoutButton();
    }.bind(this));

    this.loginButton = $('#user-login');

    // Listeners for buttons
    var gameManager = require('GameManager');
    this.loginButton.on('click', gameManager.login.bind(this)); 
}

UserMenu.prototype = {

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

module.exports = UserMenu;
