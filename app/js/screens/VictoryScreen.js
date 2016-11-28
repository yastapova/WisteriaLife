var gameManager = require('../backend/GameManager');
var Screen = require('./Screen');

var VictoryScreen = function (id, level) {
    this.gameManager = require('GameManager');
    this.level = level;
    Screen.call(this, id, true, level);
};

inherits(VictoryScreen, Screen);

VictoryScreen.prototype.init = function() {
    console.log("Victory screen init called");
    document.getElementById('share').onclick = function() {
	    FB.ui({
	    method: 'share',
	    display: 'popup',
	    href: 'https://wisteria-life-build3.appspot.com',
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

VictoryScreen.prototype.hide = function() {

};

VictoryScreen.prototype.share = function() {

}

VictoryScreen.prototype.replay = function() {

}

module.exports = VictoryScreen;
