var Screen = require('./Screen');
var LevelEditManager = require('../backend/LevelEditManager');
var gameManager = require('../backend/GameManager');

/**
 * Level Edit Screen
 * @param {String} id          Screen name id ("level-edit")
 * @param {[type]} levelNumber Level number
 */
var LevelEditScreen = function(id, level) {
    this.level = level ? level : 41;

    this.gameManager = require('GameManager');
    this.gameManager.isGameplay = false;
    this.levelEditManager = this.gameManager.levelEditManager;

    Screen.call(this, id, false, level);
};

inherits(LevelEditScreen, Screen);

/**
 * Callback function for setting level from LevelManager loadLevel
 * @param {Level} level Level object
 */
LevelEditScreen.prototype.setLevel = function (level) {
    this.level = level;

    this.totalTime = this.level.time;

    var PixiCanvas = require('PixiCanvas');
    var canvas = new PixiCanvas($('#editor-canvas'), this.level.grid);

    this.levelEditManager.setLevel(level, canvas);
    this.levelEditManager.custom = false;

    $('.collapsible').collapsible({
        accordion: false // TODO: change this to true on small screens
    });

    var self = this;
    // update current shape
    $('#unit-select-items .select-item').click(function () {

        // highlight selected
        $('.select-item').removeClass('selected');
        $(this).addClass('selected');

        self.levelEditManager.selectedUnit =
            self.gameManager.shapeManager.getShape(
                $(this).attr('data-value')
            );
        self.levelEditManager.forceChangeFaction();
    });

    // units and powerup tooltips
    $('.select-item').tooltip({
        delay: 50,
        position: 'top'
    });

    // current zoom level - needed to undo zoom changes
    this.currentZoom = level.grid;
}

LevelEditScreen.prototype.init = function() {
    console.log("Level edit screen init called");

    if (this.level === 41)
        this.gameManager.screenManager.switchScreens('editor-overlay', this.level);

    $('.dropdown-button').dropdown({
        constrain_width: false, // Does not change width of dropdown to that of the activator
        hover: true, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: false, // Displays dropdown below the button
        alignment: 'left' // Displays dropdown with edge aligned to the left of button
    });

    // load level, set level callback function
    // 41, 42, 43 are small, medium, large blank levels respectively
    // Saved levels will start from ID 44 onwards.
    // Default: 41
    this.gameManager.levelManager.loadLevel(this.level, this.setLevel.bind(this));

    var self = this;

    // set initial time and time change event
    this.timeDisplay = $('#timer-display');
    this.timeBar = $('#timeline input');
    this.timeBar.on('change', function () {
        self.setTimeDisplay($(this).val());
        var curSelFaction = self.levelEditManager.selectedFaction;
        self.levelEditManager.changeCurrentTime($(this).val());
        self.levelEditManager.selectedUnit = self.gameManager.shapeManager.getShape($('#unit-select-items .select-item').attr('data-value'));
        self.levelEditManager.selectedFaction = curSelFaction;
        switch(self.levelEditManager.selectedFaction) {
            case 5: $('#fac-objective').focus(); break;
            case 6: $('#fac-enemy').focus(); break;
            case 2: $('#fac-friend-zone').focus(); break;
            case 3: $('#fac-enemy-zone').focus(); break;
        }
        // check for messages
        // change color of button if message exists
        var message = self.levelEditManager.messages[$(this).val()];
        if (message) {
            self.messageButton.addClass('has-message');
            $('#message').val(message);
        } else {
            self.messageButton.removeClass('has-message');
            $('#message').val(null);
        }
    });
    self.setTimeDisplay($('#level-total-time').val());
    this.timeBar.val($('#level-total-time').val());

    // update current shape
    $('#unit-select-menu select').change(function () {
        self.gameLogicManager.currentUnit =
            self.gameManager.shapeManager.getShape(
                $(this).val()
            );
    });

    this.messageButton = $('#message-button');
    this.messageField = $('#message');
    this.messageBox = $('#message-box');
    this.messageForm = $('#message-form');
    this.messageOpen = false;

    // close on click outside of message dialog
    $(document).click(function (e) {
        if(this.messageOpen && !$(e.target).closest(this.messageBox.parent()).length) {
            this.messageBox.fadeOut('fast');
            this.messageOpen = false;
        }
    }.bind(this));

    // open message box
    this.messageButton.click(function () {
        this.messageOpen = true;
        this.messageBox.fadeIn('fast');
    }.bind(this));

    this.messageForm.submit(function (e) {
        e.preventDefault();
        if (this.levelEditManager.addMessage(this.messageField.val())) {
            self.messageButton.addClass('has-message');
            this.messageBox.fadeOut('fast');
            this.messageOpen = false;
        }
    }.bind(this));

    $('#level-total-time').change(function() {
        if (!($(this).val() <= 300) || !($(this).val() >= 30))  {
            // TODO show an error message
            console.log("this is invalid time");
        }
        else {
            self.levelEditManager.changeTotalTime($(this).val());
            $('#timeline input').attr('max', $(this).val());
            $('#level-total-time').attr('value', $(this).val());
            self.setTimeDisplay($('#timeline input').val());
        }
    });

    $('#zoom-select-open').leanModal({
        dismissible: true,
        opacity: .6
    });

    $('#delete-button').leanModal({
        dismissible: true,
        opacity: .6
    });

    $('#fac-objective').click(function () {
        this.gameManager.levelEditManager.selectedFaction = 5;
        this.gameManager.levelEditManager.forceChangeUnit();
        console.log(this.gameManager.levelEditManager.selectedFaction);
    }.bind(this));
    $('#fac-enemy').click(function () {
        this.gameManager.levelEditManager.selectedFaction = 6;
        this.gameManager.levelEditManager.forceChangeUnit();
        console.log(this.gameManager.levelEditManager.selectedFaction);
    }.bind(this));
    $('#fac-friend-zone').click(function () {
        this.gameManager.levelEditManager.selectedFaction = 2;
        this.gameManager.levelEditManager.forceChangeUnit();
        console.log(this.gameManager.levelEditManager.selectedFaction);
    }.bind(this));
    $('#fac-enemy-zone').click(function () {
        this.gameManager.levelEditManager.selectedFaction = 3;
        this.gameManager.levelEditManager.forceChangeUnit();
        console.log(this.gameManager.levelEditManager.selectedFaction);
    }.bind(this));

    $('#backspace-button button').click(function () {
        this.gameManager.levelEditManager.selectedFaction = this.gameManager.levelEditManager.BLANK;
        this.gameManager.levelEditManager.selectedUnit = this.gameManager.shapeManager.getShape("void");
    }.bind(this));

    // user confirms resize, clear and resize
    $('.resize-select button').click(function () {
        $('#editor-canvas').empty();

        switch ($(this).attr('data-zoom')) {
            case 'small':
                self.gameManager.levelManager.loadLevel(41, self.setLevel.bind(self));
                self.currentZoom = 'small';
                break;

            case 'medium':
                self.gameManager.levelManager.loadLevel(42, self.setLevel.bind(self));
                self.currentZoom = 'medium';
                break;

            case 'large':
                self.gameManager.levelManager.loadLevel(43, self.setLevel.bind(self));
                self.currentZoom = 'large';
                break;
        }

        $('#resize-confirm').closeModal();
    });

    // user cancels resize, revert value
    $('#resize-no').click(function () {
        $('#resize-confirm').closeModal();
    }.bind(this));

    // navigate to save level screen
    $('#save-level-show').click(function () {
        if(this.levelEditManager.enemySpawns.size < 1) {
            alert("Need at least 1 of each to save:\n"
            + this.levelEditManager.defenses.length + "/1 Defense Structures\n"
            + this.levelEditManager.enemySpawns.size + "/1 Enemy Spawn");
            return;
        }
        this.gameManager.screenManager.switchScreens('save-level', this.level);
    }.bind(this));

    // navigate to private custom levels screen
    $('#delete-yes').click(function (){
        $('#delete-confirm').closeModal();
        this.gameManager.screenManager.switchScreens('private-custom-levels');
        // add delete level code here
    }.bind(this));

    $('#delete-no').click(function () {
        $('#delete-confirm').closeModal();
    });

    // units and powerup tooltips
    $('.select-item').tooltip({
        delay: 50,
        position: 'top'
    });

    // units and powerup tooltips
    $('.tooltipped').tooltip({
        delay: 50,
        position: 'top'
    });

};

/**
 * Set Time display
 * Calculates m:ss format of seconds
 * @param {int} seconds Time in seconds
 */
LevelEditScreen.prototype.setTimeDisplay = function (seconds) {

    var percent = seconds / this.totalTime * 100;

    var minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;

    this.timeDisplay.text(minutes + ':' + (seconds < 10 ? '0' : '') + seconds);
};

LevelEditScreen.prototype.placeShape = function(shape) {

}

LevelEditScreen.prototype.isValidCell = function() {

}

LevelEditScreen.prototype.getRelativeCoords = function() {

}

module.exports = LevelEditScreen;
