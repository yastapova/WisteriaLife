/*
 * LevelStoryScreen.js
 * LevelStoryScreen object
 */
var Screen = require('./Screen');
var gameManager = require('../backend/GameManager');

/*
 * Construct a LevelStoryScreen
 *
 */
var LevelStoryScreen = function (id, level) {
    this.level = level;
    Screen.call(this, id, false, level);
};

inherits(LevelStoryScreen, Screen);

/*
 * Override the load and hide of the parent Screen
 *
 */

LevelStoryScreen.prototype.init = function () {
    console.log("Level story Screen init called");

    var regionsMap = require('GameManager').levelManager.regionsMap;

    // this screen has no way of knowing the region
    // First level of second region should be level 11, not level 1 of region 2
    // get rid of regions map, just have a levels array
    $("#level-1-story-title").text(regionsMap.get("The Revolting River").levelsArray[this.level - 1].name);
    $("#level-1-story-storyline").text(regionsMap.get("The Revolting River").levelsArray[this.level - 1].storyline);
    $("#level-story-number-display").text(this.level);
};

LevelStoryScreen.prototype.hide = function () {

};

module.exports = LevelStoryScreen;
