/*
 * TransitionScreen.js
 * TransitionScreen object
 */

var Screen = require('./Screen');

/*
 * Construct an TransitionScreen with given id
 *
 */

var TransitionScreen = function(id, level, timer, image) {
    Screen.call(this, id, true, level);

    this.timer = timer;
    this.image = image;
};

inherits(TransitionScreen, Screen);

/*
 * Override the load and hide of the parent screen
 *
 */

TransitionScreen.prototype.init = function() {
    console.log("Transition screen init called");

    var transitions = ["/img/transitions/AwesomeLife.png", "/img/transitions/CanaryLife.png", "/img/transitions/FireBrickLife.png",
    		   "/img/transitions/IKBLife.png", "/img/transitions/PurpleLife.png", "/img/transitions/SalmonLife.png",
    		   "/img/transitions/ScarletLife.png", "/img/transitions/TimberwolfLife.png"];

    var urls = ["http://awesome-life-game.appspot.com", "http://canary-life.firebaseapp.com", "http://firebrick-life.firebaseapp.com",
    		    "http://ikb-life.firebaseapp.com", "http://purplelifegame.firebaseapp.com", "http://salmon-life.firebaseapp.com",
    		    "http://the-scarlet-life.appspot.com", "http://timberwolf-life.firebaseapp.com"];

   	var index = Math.floor(Math.random() * (transitions.length));
   	$("#transition").attr("src", transitions[index]);
   	$("#transition-url").attr("href", urls[index]);

};

module.exports = TransitionScreen;
