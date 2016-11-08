/*
 * LevelStoryScreen.js
 * LevelStoryScreen object
 */
var screen = require('./Screen');
var gameManager = require('../backend/GameManager');

/*
 * Construct a LevelStoryScreen with given id
 *
 */

var LevelStoryScreen = function(id, level) {
    if(level === undefined) {
        this.level = undefined;
    }
    else {
        this.level = level;
    }
    screen.call(this, id, level);
};

inherits(LevelStoryScreen, screen);

/*
 * Override the load and hide of the parent screen
 *
 */

LevelStoryScreen.prototype.init = function() {
    console.log("Level story screen init called");
    var regionsMap = require('GameManager').levelManager.regionsMap;
    $("#level-1-story-title").text(regionsMap.get("The Revolting River").levelsArray[0].name);
    $("#level-1-story-storyline").text(regionsMap.get("The Revolting River").levelsArray[0].storyline);
    $("#level-story-number").text("Level 1");    
};

LevelStoryScreen.prototype.hide = function() {

};

module.exports = LevelStoryScreen;
