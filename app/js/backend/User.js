/**
 * User.js
 * Defines a User
 * @param name the name of the user as defined by their Google account
 * @param avatar the user's profile picture as defined by their Google account
 * @param id the user's unique ID
 * @param gameData the user's game data
 */

var User = function(name, avatar, id, gameData) {
    this.name = name;
    this.avatar = avatar;
    this.id = id;
    this.gameData = gameData;
};

module.exports = User;
