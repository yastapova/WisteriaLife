'use strict';
/*
 * Screen.js
 *
 * Defines a screen
 *
 */

/**
 * Screen is the parent of all screens
 * @param {string} id       ID of screen (<url>/id)
 * @param {boolean} overlay whether or not its an overlay over existing screen
 */
var Screen = function (id, overlay) {
    this.id = id;
    this.overlay = overlay;
};

/**
 * Load and replace container with new screen
 */
Screen.prototype.load = function () {
    /*
        - $.get HTML page
        - Get #container-inner from fetched page
        - if overlay
            - append container to current #container
        - else
            - replace #container contents to new #container-inner

        - History push (update URL/title, push to browser history)


        Called from child's load method,
        followed by each child's specific functionality
     */
};

module.exports = Screen;
