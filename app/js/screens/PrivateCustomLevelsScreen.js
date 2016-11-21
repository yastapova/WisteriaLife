
var Screen = require('./Screen');

var PrivateCustomLevelsScreen = function (id) {
    Screen.call(this, id);

};

inherits(PrivateCustomLevelsScreen, Screen);

PrivateCustomLevelsScreen.prototype.init = function () {
    this.gameManager = require('GameManager');
    this.gameManager.levelManager.loadUserLevels(
        this.gameManager.user.levels,
        this.setCustomLevels.bind(this)
    );
};

/**
 * Callback from loading custom levels
 * @param {[type]} levels [description]
 */
PrivateCustomLevelsScreen.prototype.setCustomLevels = function (levels) {
    console.log("Private custom levels Screen init called");

};

PrivateCustomLevelsScreen.prototype.hide = function () {

};

PrivateCustomLevelsScreen.prototype.loadPrivateLevels = function () {

};

module.exports = PrivateCustomLevelsScreen;
