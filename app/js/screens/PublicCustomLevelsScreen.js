
var Screen = require('./Screen');
var firebase = require('firebase');

var PublicCustomLevelsScreen = function (id, publicCustomLevelsMap) {
    this.publicCustomLevelsMap = publicCustomLevelsMap;
    Screen.call(this,id);
    this.levels = [];

    this.search = "";
};

inherits(PublicCustomLevelsScreen, Screen);

PublicCustomLevelsScreen.prototype.init = function () {
    console.log("Public custom levels Screen init called");

    this.cards = $('#custom-level-cards');
    this.sampleCard = $('#sample-card');

    this.levelManager = require('GameManager').levelManager;

    // hold reference to detach listener later
    this.dbRef = this.levelManager.loadAllCustomLevels(
        this.addPublicLevels.bind(this)
    );

    var self = this;
    $('#custom-levels-search').on('input', function () {
        self.search = $(this).val();

        // force update
        self.levelManager.loadAllCustomLevelsOnce(
            self.addPublicLevels.bind(self)
        );
    });
};

PublicCustomLevelsScreen.prototype.addPublicLevels = function (levels) {

    // avoid duplicates by clearing first
    this.cards.empty();

    for (var level in levels) {
        if (!levels[level].public)
            continue;

        // check if it matches a search term
        if (this.search) {
            var regex = new RegExp(this.search, 'i');
            if (!(levels[level].title.match(regex)
                || levels[level].author.match(regex)
                || levels[level].storyline.match(regex)
            ))
                continue;
        }

        this.levels.push(level);

        var card = this.sampleCard.clone()
                        .attr('id', 'custom-level-' + level);

        card.find('.level-title').text(levels[level].title);
        card.find('.level-sub').text(levels[level].author);
        card.find('.card-desc').text(levels[level].storyline);
        card.find('a').attr('data-level', level);

        // insert user avatar
        (function (card) {
            firebase.database()
                .ref('users/' + levels[level].uid)
                .once('value', function (snapshot) {
                    if (snapshot.val() && snapshot.val().avatar)
                        card.find('.card-icon img').attr('src', snapshot.val().avatar);
                });
        })(card);


        if (levels[level].img !== undefined) {
            (function (card) {
                firebase.storage()
                .ref(levels[level].uid + '/' + level + '/' + levels[level].img)
                .getDownloadURL()
                .then(function (url) {
                    card.find('.level-img').attr('src', url);
                });
            })(card);
        }

        this.cards.prepend(card);
    }

};

/**
 * Detach listeners to Firebase
 */
PublicCustomLevelsScreen.prototype.onLeave = function () {
    this.dbRef.off();
};

module.exports = PublicCustomLevelsScreen;
