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
    
    $(".dropdown-button").dropdown();
    console.log("Defeat screen init called");
    document.getElementById('facebook-share').onclick = function() {
	    FB.ui({
	    method: 'share',
	    display: 'popup',
	    href: 'https://wisteria-life-build4.appspot.com',
	    }, function(response){});
	};

    if(this.gameManager.user.gameData.currentLevel < this.gameManager.gameLogicManager.level.id){
        $('#level-next-button').attr("href", "#!");
        $('#level-next-button').removeAttr("data-level");
        $('#level-next-button i').css("color", "lightgray");
    }

	if(!this.gameManager.mute) {
        $('#defeat-sound')[0].play();
    }

	if (!$.isNumeric(this.level)) {
        
        $('#level-back-button').attr('href', '#!');
        $('#level-back-button').removeAttr('data-region');
        $('#level-back-button').on('click', function() {
            history.go(-2);
        });

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

module.exports = DefeatScreen;
