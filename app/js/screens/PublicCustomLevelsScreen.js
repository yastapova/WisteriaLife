
var Screen = require('./Screen');
var firebase = require('firebase');

var PublicCustomLevelsScreen = function (id, publicCustomLevelsMap) {
    this.publicCustomLevelsMap = publicCustomLevelsMap;
    Screen.call(this,id);
    this.levels = [];
};

inherits(PublicCustomLevelsScreen, Screen);

PublicCustomLevelsScreen.prototype.init = function () {
    console.log("Public custom levels Screen init called");

    this.cards = $('#custom-level-cards');
    this.sampleCard = $('#sample-card');

    require('GameManager').levelManager.loadAllCustomLevels(
        this.addPublicLevels.bind(this)
    );

};

PublicCustomLevelsScreen.prototype.hide = function () {

};

PublicCustomLevelsScreen.prototype.addPublicLevels = function (levels) {

    for (var level in levels) {
        if (!levels[level].public)
            continue;

        this.levels.push(level);

        var card = this.sampleCard.clone()
                        .attr('id', 'custom-level-' + level);

        card.find('.level-title').text(levels[level].title);
        card.find('.level-sub').text(levels[level].author);
        card.find('.card-desc').text(levels[level].storyline);
        card.find('a').attr('data-level', level);

        if (levels[level].img !== undefined) {
            (function(card) {
                firebase.storage()
                .ref(levels[level].uid + '/' + level + '/' + levels[level].img)
                .getDownloadURL()
                .then(function (url) {
                    card.find('img').attr('src', url);
                });
            })(card);
        }

        this.cards.append(card);
    }

};

module.exports = PublicCustomLevelsScreen;
