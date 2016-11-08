
var Screen = require('./Screen');

var VictoryScreen = function (id, properties) {
    this.properties = properties;
    Screen.call(this, id, true);
};

inherits(VictoryScreen, Screen);

VictoryScreen.prototype.init = function() {
    console.log("Victory screen init called");
    document.getElementById('share').onclick = function() {
	    FB.ui({
	    method: 'share',
	    display: 'popup',
	    href: 'https://wisteria-life-build2.appspot.com',
	    }, function(response){});
	}

};

VictoryScreen.prototype.hide = function() {

};

VictoryScreen.prototype.share = function() {

}

VictoryScreen.prototype.replay = function() {

}

module.exports = VictoryScreen;
