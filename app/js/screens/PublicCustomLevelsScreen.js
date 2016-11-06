
var screen = require('./Screen');

var PublicCustomLevelsScreen = function(id, publicCustomLevelsMap) {
    this.publicCustomLevelsMap = publicCustomLevelsMap;
    screen.call(this,id);
};

inherits(PublicCustomLevelsScreen, screen);

PublicCustomLevelsScreen.prototype.init = function() {
    console.log("Public custom levels screen init called");

};

PublicCustomLevelsScreen.prototype.hide = function() {

};

PublicCustomLevelsScreen.prototype.loadPublicLevels = function() {

};

module.exports = PublicCustomLevelsScreen;
