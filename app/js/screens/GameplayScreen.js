var Screen = require('./Screen');
var GameLogicManager = require('../backend/GameLogicManager');
var gameManager = require('../backend/GameManager');

/**
 * Gameplay Screen
 * @param {String} id          Screen name id ("gameplay")
 * @param {[type]} levelNumber Level number
 */
var GamePlayScreen = function (id, levelNumber) {
    this.levelNumber = levelNumber;
    this.id = id;

    this.gameManager = require('GameManager');
    this.gameManager.isGameplay = true;
    this.gameLogicManager = this.gameManager.gameLogicManager;

    Screen.call(this, id, false, levelNumber);
};


inherits(GamePlayScreen, Screen);

/**
 * Callback function for setting level from LevelManager loadLevel
 * @param {Level} level Level object
 */
GamePlayScreen.prototype.setLevel = function (level) {

    this.level = level;
    this.totalTime = this.level.time;

    var PixiCanvas = require('PixiCanvas');
    var canvas = new PixiCanvas($('#gameplay-canvas'), this.level.grid);

    this.gameLogicManager.setLevel(level, canvas);
    var allowed = Object.keys(this.gameLogicManager.allowedShapesMap);

    $('#unit-select-items').append((function () {
        var shapes = [];
        for (var i = 0; i < allowed.length; i++) {
            var unitName;
            if (allowed[i].charAt(0) == 'a')
                unitName = allowed[i].charAt(0).toUpperCase() +
                               allowed[i].slice(1,-2) + " " +
                               allowed[i].slice(-2).toUpperCase();

            else if(allowed[i].charAt(0) == 'i')
                unitName = allowed[i].charAt(0).toUpperCase() +
                               allowed[i].slice(1,-1) + " " +
                               allowed[i].slice(-1).toUpperCase();
            else
                unitName = allowed[i].charAt(0).toUpperCase() +
                               allowed[i].slice(1);
            shapes.push(
                $('<span>')
                    .attr('id', 'unit-' + allowed[i])
                    .addClass('select-item')
                    .attr('data-value', allowed[i])
                    .attr('data-tooltip', unitName)
                    .append(
                        $('<img>').attr('src', '/img/powerups/' + allowed[i] + '.png')
                    )
                    .append(
                        $('<span>')
                            .addClass('item-count')
                            .text(this.gameLogicManager.allowedShapesMap[allowed[i]])
                    )
            );
        }
        return shapes;
    }.bind(this))());
    var userPowerups = [];
    if(this.gameManager.user.powerups !== undefined){
        userPowerups = Object.keys(this.gameManager.user.powerups);
    }
    $('#powerups-select-items').append((function () {
        var powerups = [];
        for (var i = 0; i < userPowerups.length; i++) {
            var powerup;
            if (userPowerups[i].charAt(0) == 'a'){
                powerup = userPowerups[i].charAt(0).toUpperCase() +
                               userPowerups[i].slice(1,-2) + " " +
                               userPowerups[i].slice(-2).toUpperCase();
            }
            else if(userPowerups[i].charAt(0) == 'i'){
                powerup = userPowerups[i].charAt(0).toUpperCase() +
                               userPowerups[i].slice(1,-1) + " " +
                               userPowerups[i].slice(-1).toUpperCase();
            }
            else if(userPowerups[i].slice(0,4) === "stop"){
                powerup = userPowerups[i].charAt(0).toUpperCase() +
                               userPowerups[i].slice(1,4) + " " + userPowerups[i].charAt(4).toUpperCase() + userPowerups[i].slice(5);
            }
            else if(userPowerups[i].slice(0,4) === "redu"){
                powerup = userPowerups[i].charAt(0).toUpperCase() +
                               userPowerups[i].slice(1,6) + " " +userPowerups[i].charAt(6).toUpperCase() + userPowerups[i].slice(7);
            }
            else{
                powerup = userPowerups[i].charAt(0).toUpperCase() +
                               userPowerups[i].slice(1);
            }
            powerups.push(
                $('<span>')
                    .attr('id', 'powerup-' + userPowerups[i])
                    .addClass('select-item')
                    .attr('data-value', userPowerups[i])
                    .attr('data-tooltip', powerup)
                    .append(
                        $('<img>').attr('src', '/img/powerups/' + userPowerups[i] + '.png')
                    )
                    .append(
                        $('<span>')
                            .addClass('item-count')
                            .text(this.gameManager.user.powerups[userPowerups[i]])
                    )
            );
        }
        return powerups;
    }.bind(this))());

    $('.collapsible').collapsible({
        accordion: false // TODO: change this to true on small screens
    });

    // play pause button event
    var self = this;
    $('#playpause').click(function () {
        // Play on start handled by TutorialScreen if level number < 11
        // Check if level number is greater than 10 or if it has a level id instead
        // if so, then do everything in TutorialScreen here
        if(this.levelNumber <= 10 || this.id != null) {
            if (this.gameLogicManager.paused) {
                this.gameLogicManager.start();

                $('#playpause').attr('data-level', this.levelNumber);

                $('#playpause').find('i').removeClass('play').removeClass('mdi-play');
                $('#playpause').find('i').addClass('pause').addClass('mdi-pause');
                $('#playpause').attr('href', '/pause');
                return false;
            }
            else {
                this.gameLogicManager.pause();
            }
        }
    }.bind(this));

    // update timer once per second
    this.timeDisplay = $('#timer-display');
    this.timeBar = $('#time-bar');

    this.timer = setInterval(function () {
        if (!this.gameLogicManager.paused) {
            this.level.time--;

            if (this.level.time < 0)
                this.level.time = 0;

            if (this.level.time === 0) {
                this.gameLogicManager.pause();
                if (this.gameLogicManager.isDead()){
                    this.gameManager.screenManager.switchScreens('defeat', this.levelNumber);
                }
                else {
                    this.gameManager.screenManager.switchScreens('victory', this.levelNumber);
                }
            }
            else if (this.gameLogicManager.isDead()) {
                this.gameLogicManager.pause();
                this.gameManager.screenManager.switchScreens('defeat', this.levelNumber);
            }
        }
        this.setTimeDisplay(this.level.time);

    }.bind(this), 1000);

    // push timer
    this.gameManager.screenManager.timers.push(this.timer);

    // update current shape
    $('#unit-select-items').on('click', '.select-item', function () {

        // highlight selected
        $('.select-item').removeClass('selected');
        $(this).addClass('selected');

        self.gameLogicManager.currentUnit =
            self.gameManager.shapeManager.getShape(
                $(this).attr('data-value')
            );
        self.gameLogicManager.selectedFaction =
            self.gameLogicManager.FRIEND;
    });

    // update current powerup
    $('#powerups-select-items .select-item').click(function () {
        
        // highlight selected
        $('.select-item').removeClass('selected');
        $(this).addClass('selected');

        self.powerup = self.gameManager.powerupManager.getPowerup($(this).attr('data-value'));
        // pause and show modal
        self.gameLogicManager.pause();
        $('#powerup-confirm').openModal();        

        // self.gameManager.user.powerups[$(this).attr('data-value')]--;
        // // for shape powerups
        // if($(this).attr('data-value') !== "reducetime" && $(this).attr('data-value') !== "stopspawn"){
        //     self.gameLogicManager.currentUnit =
        //         self.gameManager.shapeManager.getShape(
        //             $(this).attr('data-value')
        //         );
        // }
    });

    $('#powerup-yes').on('click', function(){
        $('#powerup-confirm').closeModal();
        self.usePowerup();
        self.gameLogicManager.start();
    }.bind(self));

    $('#powerup-no').on('click', function(){
        $('#powerup-confirm').closeModal();
        self.gameLogicManager.start();
    });

    // units and powerup tooltips
    $('.select-item').tooltip({
        delay: 50,
        position: 'top'
    });
};

/**
 * Setup game logic manager with level and canvas
 *
 * Setup all events
 */
GamePlayScreen.prototype.init = function () {
    console.log("Gameplay screen init called");

    // don't bother showing tutorial after the first ten levels
    if (this.levelNumber < 11)
        this.gameManager.screenManager.switchScreens('tutorial', this.levelNumber);

    $('select').material_select();

    $('.dropdown-button').dropdown({
        constrain_width: false, // Does not change width of dropdown to that of the activator
        hover: true, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: false, // Displays dropdown below the button
        alignment: 'left' // Displays dropdown with edge aligned to the left of button
    });

    // load level, set level callback function
    this.gameManager.levelManager.loadLevel(this.levelNumber, this.setLevel.bind(this));

    // cheat code
    this.cheatButton = $('#cheat');
    this.cheatField = $('#cheat-code');
    this.cheatBox = $('#cheat-box');
    this.cheatForm = $('#cheat-form');
    this.cheatOpen = false;

    // close on click outside of cheat dialog
    $(document).click(function (e) {
        if(this.cheatOpen && !$(e.target).closest(this.cheatBox.parent()).length) {
            this.cheatBox.fadeOut('fast');
            this.cheatOpen = false;
        }
    }.bind(this));

    // open cheat box
    this.cheatButton.click(function () {
        this.cheatOpen = true;
        this.cheatBox.fadeIn('fast');
        this.cheatField.focus();
    }.bind(this));

    this.cheatForm.submit(function (e) {
        e.preventDefault();

        // check cheat code
        if (this.cheatField.val().toLowerCase() == 'winlevel' + this.levelNumber + 'pineapple') {
            if (this.gameLogicManager.paused)
                this.gameLogicManager.start();
            this.level.time = 0;
            this.cheatBox.fadeOut('fast');
            this.cheatOpen = false;

            toast('Cheat successful.');

        } else if (this.cheatField.val().toLowerCase() == 'makemerich' + this.levelNumber + 'kiwi') {

            this.gameManager.user.gameData.wistbux += 100;
    	    this.gameManager.writeUserData();
    	    this.gameManager.userWistbux.text(this.gameManager.user.gameData.wistbux);

            toast('A careless enemy unit dropped 100 wistbux!');

        } else {
            this.gameManager.playErrorSounds();
            toast('Cheat code incorrect. Maybe play the level instead?', true);
        }


    }.bind(this));
};

/**
 * Set Time display
 * Calculates m:ss format of seconds
 * @param {int} seconds Time in seconds
 */
GamePlayScreen.prototype.setTimeDisplay = function (seconds) {

    var percent = seconds / this.totalTime * 100;

    var minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;

    this.timeDisplay.text(minutes + ':' + (seconds < 10 ? '0' : '') + seconds);

    this.timeBar.width(percent + "%");

    if (percent < 20)
        this.timeBar.css('background-color', '#b21c1c');
};

GamePlayScreen.prototype.displayMessage = function () {

};

/**
 * Apply the powerup on the level
 * @param powerup the name of the power up to use
 */
GamePlayScreen.prototype.usePowerup = function(powerup) {
    // get the powerups manager to execute the powerup callback
    var powerupObj = this.gameManager.powerupManager.powerupsMap.get(powerup);
    powerupObj.effect(this.level);
};

/**
 * Legal gameplay access check
 * - Referral screen must be story
 * - Level must be less than or equal to user level
 * @return {Boolean/String} Whether or not switching to this screen is Legal
 *                          Can be an error message instead
 */
GamePlayScreen.prototype.isLegal = function (user) {
    var userCheck = Screen.prototype.isLegal.call(this, user);

    console.log(this.gameManager.screenManager.previousScreen);

    if (userCheck === true) {
        if (
            this.gameManager.screenManager.previousScreen != 'level-story'
            && this.gameManager.screenManager.previousScreen != 'gameplay'
        ) {
            this.gameManager.playErrorSounds();
            return "Must come from story screen";
        }
        // check user progress
        if (this.levelNumber <= 40 && this.levelNumber > user.gameData.currentLevel + 1) {
            this.gameManager.playErrorSounds();
            return "Not up to level " + this.levelNumber + " yet!";
        }
    } else
        return userCheck;

    return true;
};

GamePlayScreen.prototype.usePowerup = function() {    
    this.powerup.effect(this.gameManager, this.powerup.name);
};

module.exports = GamePlayScreen;
