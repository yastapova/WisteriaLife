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

    this.cards = $('#custom-level-cards');
    this.sampleCard = $('#sample-card');
    console.log(this.gameManager.user);
    console.log(this.gameManager.user.levels);

    this.imageStorage = firebase.storage()
        .ref(firebase.auth().currentUser.uid);

    this.gameManager.levelManager.loadUserLevels(
        this.gameManager.user.levels,
        this.addCustomLevel.bind(this)
    );


    // test deleting levels
    $('#delete-custom-level').on('click', this.deleteLevels);
};

PrivateCustomLevelsScreen.prototype.deleteLevels = function(){
	// Get current user
    var userId = firebase.auth().currentUser.uid;
	// Grab the ids for the levels that are checked
	// TO DO    
	var levelsID = $('.input-field input:checkbox:checked');
    console.log(levelsID); 
    if(levelsID.length === 0){
        return;
    }
	firebase.database().ref("/users/" + userId + "/levels/").once('value', function(snapshot){
        // NOT SURE IF THIS WORKS TO DO
        for(var index in levelsID){
            var lkey = levelsID[index].id.substring(14);
            // delete from 3 locations: customLevels, levels, and users
            firebase.database().ref('/customLevels/' + lkey).remove();
            firebase.database().ref('/levels/' + lkey).remove();
            // which level is being deleted?
            var levels = snapshot.val();
            for(var key in levels){
                if(levels[key] === lkey){
                    firebase.database().ref("/users/" + firebase.auth().currentUser.uid + "/" + key).remove();
                    break;
                }
            }
        // delete img from storage if it exists
        firebase.storage().ref(userId + "/" + lkey).delete();
        }
    });	
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

    if (level.img !== undefined) 
        this.imageStorage.child(id + '/' + level.img)
            .getDownloadURL()
            .then(function (url) {
                card.find('img').attr('src', url);
            });

    this.cards.append(card);


};

PrivateCustomLevelsScreen.prototype.hide = function () {

};

PrivateCustomLevelsScreen.prototype.loadPrivateLevels = function () {

};

module.exports = PrivateCustomLevelsScreen;
