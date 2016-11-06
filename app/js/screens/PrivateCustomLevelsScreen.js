
var screen = require('./Screen');

var PrivateCustomLevelsScreen = function(id) {
    screen.call(this,id);
};

inherits(PrivateCustomLevelsScreen, screen);

PrivateCustomLevelsScreen.prototype.init = function() {
    console.log("Private custom levels screen init called");

};

PrivateCustomLevelsScreen.prototype.hide = function() {

};

PrivateCustomLevelsScreen.prototype.loadPrivateLevels = function() {

};

module.exports = PrivateCustomLevelsScreen;
