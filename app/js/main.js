/**
 * main.js
 *
 *   Includes all of the objects
 *   Starts the game
 *   Pixi renderer object
 *
 * Added last in the concatenation
 */

var gameManager = new GameManager();
var renderer; // TODO

/**
 * Instantiate navbar events
 */
$(document).ready(function () {
	var menuElements = {
		vert: $('#hamburger-vert'),
		back: $('#drop-back'),
		store: $('#drop-store'),
		mute: $('#drop-mute'),
		about: $('#drop-about'),
		loginout: $('#drop-loginout')
	};

	var menu = new DropdownMenu(menuElements);
});
