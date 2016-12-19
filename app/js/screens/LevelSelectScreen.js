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

    var gameManager = require('GameManager');

    // get all level metadata
    var levels = gameManager.levelManager.levels;

    // current user
    var user = gameManager.user;

    this.cards = $('#level-cards');
    this.sampleCard = $('#sample-card');

    // add cards for each level
    for (var i = (this.region - 1) * 10; i < this.region * 10; i++) {
        var card = this.sampleCard.clone()
                        .attr('id', 'level-' + (i % 10 + 1));

        card.find('.level-num').text(i + 1);
        card.find('.card-title span').text(levels[i].title);
        card.find('.card-desc').text(levels[i].storyline.substring(0,200) + "...");
        card.find('a').attr('data-level', i + 1);
        card.find('img').attr('src', '/img/levels/' + levels[i].img);

        // allowed levels are [1, currentLevel + 1]
        if (user.gameData.currentLevel < i)
            card.addClass('card-locked');

        this.cards.append(card);
    }

    // whole card clickable, but only allowed cards
    $('#level-cards > div:not(.card-locked)').on('click', function () {
        gameManager.screenManager.switchScreens('level-story', $(this).find('a').attr('data-level'));
    });
};

LevelSelectScreen.prototype.loadAvailableLevels = function() {

};

LevelSelectScreen.prototype.loadLevels = function() {

};

module.exports = LevelSelectScreen;
