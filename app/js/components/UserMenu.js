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

    this.loginButton = $('.login-button');
    this.logoutButton = $('.logout-button');
    this.guestLoginButton = $('.guest-login');

    // Listeners for buttons
    var gameManager = require('GameManager');
    this.loginButton.on('click', gameManager.login.bind(gameManager));
    this.logoutButton.on('click', gameManager.logout.bind(gameManager));
    this.guestLoginButton.on('click', gameManager.guestLogin.bind(gameManager));
};

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
