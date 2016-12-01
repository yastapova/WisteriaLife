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
            this.play();
        });
    }

	if (!$.isNumeric(this.level)) {
        $('#level-back-button')
            .attr('href', '/private-custom-levels')
            .attr('data-region', '');

        $('#level-next-button')
            .attr('href', '/private-custom-levels')
            .attr('data-level', '');
    }
    else if($.isNumeric(this.level)) {
    	var region = 0;
    	if(this.level < 11) {
    		region = 1;
    	}
    	else if(10 < this.level < 21) {
    		region = 2;
    	}
    	else if(20 < this.level < 31) {
    		region = 3;
    	}
    	else {
    		region = 4;
    	}
     	$('#level-back-button')
            .attr('data-region', region);
    }
};

DefeatScreen.prototype.share = function() {

}

DefeatScreen.prototype.replay = function() {

}

module.exports = DefeatScreen;
