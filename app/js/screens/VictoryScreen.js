var gameManager = require('../backend/GameManager');
var Screen = require('./Screen');

var VictoryScreen = function (id, level) {
    this.gameManager = require('GameManager');
    this.level = level;
    Screen.call(this, id, true, level);
};

inherits(VictoryScreen, Screen);

VictoryScreen.prototype.init = function() {
    var victorySounds = ["/sounds/gameplay/victory1.mp3", "/sounds/gameplay/victory2.wav",
                        "/sounds/gameplay/victory3.wav", "/sounds/gameplay/victory4.wav", 
                        "/sounds/gameplay/victory5.wav"];

    console.log("Victory screen init called");
    document.getElementById('share').onclick = function() {
	    FB.ui({
	    method: 'share',
	    display: 'popup',
	    href: 'https://wisteria-life-build4.appspot.com',
	    }, function(response){});
	};
	if(this.gameManager.user.gameData.currentLevel < this.gameManager.gameLogicManager.level.id){
		$('#victory-wistbux').text(this.gameManager.gameLogicManager.level.getWistbux());
		this.gameManager.user.gameData.currentLevel++;
	    this.gameManager.user.gameData.wistbux += this.gameManager.gameLogicManager.level.getWistbux();
	    this.gameManager.writeUserData();
	    this.gameManager.userWistbux.text(this.gameManager.user.gameData.wistbux);
	    this.gameManager.userLevel.text("Level " + this.gameManager.user.gameData.currentLevel);
	}else{
		$('#victory-wistbux').text("0");
	}

	if(!this.gameManager.mute) {
        var index = Math.floor(Math.random() * (victorySounds.length));
        $('#victory-sound').attr("src", victorySounds[index]);
		$('audio').each(function() {
			this.play();
		});
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

VictoryScreen.prototype.share = function() {

}

VictoryScreen.prototype.replay = function() {

}

module.exports = VictoryScreen;
