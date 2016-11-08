/*
 * LevelSelectScreen.js
 * LevelSelectScreen object
 */
var screen = require('./Screen');
var gameManager = require('../backend/GameManager');

/*
 * Construct a LevelSelectScreen with given id
 *
 */

var LevelSelectScreen = function(id, region) {
    if(region === undefined) {
        this.region = undefined;
    }
    else {
        this.region = region;
    }
    screen.call(this, id, region);
};

inherits(LevelSelectScreen, screen);

/*
 * Override the load and hide of the parent screen
 *
 */

LevelSelectScreen.prototype.init = function() {
    console.log("Level select screen init called");
    var regionsMap = require('GameManager').levelManager.regionsMap;
    $("#region-1-level-1").text(regionsMap.get("The Revolting River").levelsArray[0].name);
    $("#region-1-level-1-img").attr("src", "img/levels/" + regionsMap.get("The Revolting River").levelsArray[0].img);
    $("#region-1-level-1-storyline").text(regionsMap.get("The Revolting River").levelsArray[0].storyline);
};

LevelSelectScreen.prototype.hide = function() {

};

LevelSelectScreen.prototype.loadAvailableLevels = function() {

};

LevelSelectScreen.prototype.loadLevels = function() {

};

module.exports = LevelSelectScreen;
