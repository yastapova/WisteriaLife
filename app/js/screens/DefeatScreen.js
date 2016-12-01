/*
 * DefeatScreen.js
 * DefeatScreen object
 */
var Screen = require('./Screen');

 /*
  * construct a DefeatScreen obj with given id
  */
var DefeatScreen = function (id, level) {
	this.gameManager = require('GameManager');
	this.level = level;
    Screen.call(this, id, true, level);
};

inherits(DefeatScreen, Screen);

/*
 * Override the load and hide of the parent screen
 */
DefeatScreen.prototype.init = function() {
    console.log("Defeat screen init called");
    document.getElementById('share').onclick = function() {
	    FB.ui({
	    method: 'share',
	    display: 'popup',
	    href: 'https://wisteria-life-build4.appspot.com',
	    }, function(response){});
	};

	if(!this.gameManager.mute) {
		$('audio').each(function() {
			$(this).attr("autoplay", "autoplay");
		});
	}

	if (!$.isNumeric(this.level)) {
        $('#level-back-button')
            .attr('href', '/custom-private-levels')
            .attr('data-region', '');

        $('#level-next-button')
            .attr('href', '/custom-private-levels')
            .attr('data-level', '');
    }
};

DefeatScreen.prototype.hide = function() {

};

DefeatScreen.prototype.share = function() {

}

DefeatScreen.prototype.replay = function() {

}

module.exports = DefeatScreen;
