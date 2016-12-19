/**
 * User.js
 * Defines a User
 * @param name the name of the user as defined by their Google account
 * @param avatar the user's profile picture as defined by their Google account
 * @param id the user's unique ID
 * @param gameData the user's game data
 */

var GameData = require('./GameData');

var User = function(name, avatar, uid, levels) {
    this.name = name;
    this.avatar = avatar;
    this.uid = uid;
    this.gameData = new GameData();
    this.powerups = {
        "archerne": 1,
        "reducetime":1,
        "stopspawn":1,
        "void":1
    }; // object
    this.levels = levels ? levels : [];
};

User.prototype.addCustomLevel = function (levelId) {
    for (var i = 0; i < this.levels.length; i++) {
        if (this.levels[i] == levelId)
            return;
    }

    this.levels[levelId] = levelId;
};

module.exports = User;
