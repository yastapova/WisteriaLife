var Screen = require('./Screen');
var firebase = require('firebase');

var PrivateCustomLevelsScreen = function (id) {
    this.gameManager = require('GameManager');
    Screen.call(this, id);
};

inherits(PrivateCustomLevelsScreen, Screen);

PrivateCustomLevelsScreen.prototype.init = function () {
    this.gameManager = require('GameManager');
    this.gameManager.levelManager.loadUserLevels(
        this.gameManager.user.levels,
        this.setCustomLevels.bind(this)
    );

    // test deleting levels
    $('#delete-custom-level').on('click', this.deleteLevels);
};

PrivateCustomLevelsScreen.prototype.deleteLevels = function(){
	// Get current user
    var userId = firebase.auth().currentUser.uid;
	// Grab the ids for the levels that are checked
	var levels = [];
	for(var level in levels){
		// delete from 3 locations: customLevels, levels, and users
		firebase.database().ref('/customLevels/' + level).remove();
		firebase.database().ref('/levels/' + level).remove();
		for(var [key, value] in Object.entries(firebase.database().ref('/users/' + userId + "/levels/"))){
			if(value === level){
				firebase.database().ref('/users/' + userId + "/" + key).remove();
				break;
			}
		}
		// delete img from storage if it exists
		//firebase.storage().ref
	}
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
