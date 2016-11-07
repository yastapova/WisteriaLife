
var Screen = require('./Screen');

var VictoryScreen = function (id, properties) {
    this.properties = properties;
    Screen.call(this, id, true);
};

inherits(VictoryScreen, Screen);

VictoryScreen.prototype.init = function() {
    console.log("Victory screen init called");

};

VictoryScreen.prototype.hide = function() {

};

VictoryScreen.prototype.share = function() {

}

VictoryScreen.prototype.replay = function() {

}

module.exports = VictoryScreen;
