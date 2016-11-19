/*
 * LevelSelectScreen.js
 * LevelSelectScreen object
 */
var Screen = require('./Screen');
var gameManager = require('../backend/GameManager');

/*
 * Construct a LevelSelectScreen with given id
 * @param id id of Screen
 * @param region region number (1 through 4)
 *
 */
var LevelSelectScreen = function (id, region) {
    this.region = region;
    Screen.call(this, id, false, region);
};

inherits(LevelSelectScreen, Screen);

/*
 * Override the load and hide of the parent Screen
 *
 */

LevelSelectScreen.prototype.init = function() {
    console.log("Level select Screen init called");
    var regionsMap = require('GameManager').levelManager.regionsMap;
    $("#region-1-level-1").text(regionsMap.get("The Revolting River").levelsArray[0].name);
    $("#region-1-level-1-img").attr("src", "/img/levels/" + regionsMap.get("The Revolting River").levelsArray[0].img);
    $("#region-1-level-1-storyline").text(regionsMap.get("The Revolting River").levelsArray[0].storyline);
};

LevelSelectScreen.prototype.hide = function() {

};

LevelSelectScreen.prototype.loadAvailableLevels = function() {

};

LevelSelectScreen.prototype.loadLevels = function() {

};

module.exports = LevelSelectScreen;
