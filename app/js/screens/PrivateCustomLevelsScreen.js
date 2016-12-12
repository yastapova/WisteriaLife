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

    this.imageStorage = firebase.storage()
        .ref(firebase.auth().currentUser.uid);

    this.gameManager.levelManager.loadUserLevels(
        this.gameManager.user.levels,
        this.addCustomLevel.bind(this)
    );

    // test deleting levels
    
    $('#delete-custom-level').leanModal({
        dismissible: true,
        opacity: .6
    });

     $('#delete-level-no').click(function () {
        $('#delete-level-confirm').closeModal();
    });

    $('#delete-level-yes').click(function () {
        $('#delete-level-confirm').closeModal();
        this.deleteLevels();
    }.bind(this));
};

PrivateCustomLevelsScreen.prototype.deleteLevels = function () {
	// Get current user
    var userId = firebase.auth().currentUser.uid;
	// Grab the ids for the levels that are checked
	var levelsID = $('.input-field input:checkbox:checked');

    if(levelsID.length === 0)
        return;

    levelsID.each(function () {
        var lkey = $(this).attr('data-id');
        firebase.database().ref().once('value', function(snapshot){
            var db = snapshot.val();
            var userId = firebase.auth().currentUser.uid;            
            // delete img from storage if it exists
            firebase.storage().ref("/" + userId + "/" + lkey + "/" + db.customLevels[lkey].img).delete()
                .then(function () {
                    console.log('Deleted level image.');
                }).catch(function (error) {
                    console.warn(error);
                }); 
            // delete from 3 locations: customLevels, levels, users
            firebase.database().ref('/customLevels/' + lkey).remove();
            firebase.database().ref('/levels/' + lkey).remove(); 
            firebase.database().ref("/users/" + userId + '/levels/' + lkey).remove();                          
        });        
    });

    // refresh page to reload levels (private levels is on a once event)
    this.gameManager.screenManager.switchScreens('private-custom-levels');
};

/**
 * Callback from loading custom levels
 *
 * Adds ONE custom level (different call per level, order not preserved)
 */
PrivateCustomLevelsScreen.prototype.addCustomLevel = function (id, level) {

    // invalid level, skip
    if (!level) return;

    console.log("Private custom levels Screen init called");
    this.levels.push(level);

    var card = this.sampleCard.clone()
                    .attr('id', 'custom-level-' + id);

    card.find('.card-title').text(level.title);
    card.find('.card-desc').text(level.storyline);

    if (this.gameManager.user.avatar)
        card.find('.card-icon img').attr('src', this.gameManager.user.avatar);
    card.find('a').attr('data-level', id);
    card.find('input').attr('id',  'level-select-' + id);
    card.find('input').attr('data-id',  id);
    card.find('label').attr('for', 'level-select-' + id);

    if (level.img !== undefined){
        this.imageStorage.child(id + '/' + level.img)
            .getDownloadURL()
            .then(function (url) {
                card.find('.level-img').attr('src', url);
            }, function(error){
                console.log("Error!");
            });
    }

    this.cards.prepend(card);


};

PrivateCustomLevelsScreen.prototype.loadPrivateLevels = function () {

};

module.exports = PrivateCustomLevelsScreen;
