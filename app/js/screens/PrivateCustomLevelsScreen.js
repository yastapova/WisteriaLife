var Screen = require('./Screen');
var firebase = require('firebase');

var PrivateCustomLevelsScreen = function (id) {
    this.gameManager = require('GameManager');
    this.levels = [];
    Screen.call(this, id);
};

inherits(PrivateCustomLevelsScreen, Screen);

PrivateCustomLevelsScreen.prototype.init = function () {
    this.gameManager = require('GameManager');

    this.gameManager.levelManager.loadUserLevels(
        this.gameManager.user.levels,
        this.addCustomLevel.bind(this)
    );

    this.cards = $('#custom-level-cards');
    this.sampleCard = $('#sample-card');

    // test deleting levels
    $('#delete-custom-level').on('click', this.deleteLevels);
};

PrivateCustomLevelsScreen.prototype.deleteLevels = function(){
	// Get current user
    var userId = firebase.auth().currentUser.uid;
	// Grab the ids for the levels that are checked
	// TO DO
	var levelsID = [];
	var levels = firebase.database().ref("/users/" + userId + "/levels/");
	// NOT SURE IF THIS WORKS
	for(var levelID in levelsID){
		// delete from 3 locations: customLevels, levels, and users
		firebase.database().ref('/customLevels/' + levelID).remove();
		firebase.database().ref('/levels/' + levelID).remove();
		for(var key in levels.keys){
			if(levels.key === levelID){
				firebase.database().ref("/users/" + userId + "/" + key).remove();
				break;
			}
		}
		// delete img from storage if it exists
		firebase.storage().ref(userId + "/" + levelID).delete();
	}
};

/**
 * Callback from loading custom levels
 *
 * Adds ONE custom level (different call per level, order not preserved)
 */
PrivateCustomLevelsScreen.prototype.addCustomLevel = function (id, level) {
    console.log("Private custom levels Screen init called");
    this.levels.push(level);

    var card = this.sampleCard.clone()
                    .attr('id', 'custom-level-' + id);

    card.find('.card-title').text(level.title);
    card.find('.card-desc').text(level.storyline);
    card.find('a').attr('data-level', id);
    card.find('input').attr('id',  'level-select-' + id);
    card.find('label').attr('for', 'level-select-' + id);

    this.cards.append(card);


};

PrivateCustomLevelsScreen.prototype.hide = function () {

};

PrivateCustomLevelsScreen.prototype.loadPrivateLevels = function () {

};

module.exports = PrivateCustomLevelsScreen;
