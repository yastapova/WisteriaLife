
var screen = require('Screen');

var VictoryScreen = function(id, level, user) {
    this.level = level;
    this.user = user;
    screen.call(this,id);
};

inherits(VictoryScreen, screen);

VictoryScreen.prototype.load = function() {

};

VictoryScreen.prototype.hide = function() {

};

VictoryScreen.prototype.share = function() {

}

VictoryScreen.prototype.replay = function() {

}

module.exports = VictoryScreen;
