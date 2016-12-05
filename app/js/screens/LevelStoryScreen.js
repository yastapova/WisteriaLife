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

    // custom level?
    if ($.isNumeric(this.level)) {
        var levels = require('GameManager').levelManager.levels;

        $("#level-1-story-title").text(levels[this.level - 1].name);
        $("#level-1-story-storyline").text(levels[this.level - 1].storyline);
        $("#level-story-number-display").text(this.level);
    } else {
        require('GameManager').levelManager.loadCustomLevel(this.level, function (level) {
            $("#level-1-story-title").text(level.title);
            $("#level-1-story-storyline").text(level.storyline);
            $("#level-story-number-display").text(" by " + level.author);
        });
    }
};

/**
 * Check if user allowed to access this level story
 * @param  {User}  user [description]
 * @return {Boolean/String}      error message or boolean
 */
LevelStoryScreen.prototype.isLegal = function (user) {
    var userCheck = Screen.prototype.isLegal.call(this, user);

    if (userCheck === true) {
        // check user progress
        if (this.level <= 40 && this.level > user.gameData.currentLevel + 1)
            return "Not up to level " + this.level + " yet!";

    } else {
        return userCheck;
    }

    return true;
}

module.exports = LevelStoryScreen;
