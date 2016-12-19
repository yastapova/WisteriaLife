/*
 * StoreScreen.js
 * StoreScreen object
 */
var Screen = require('./Screen');

 /*
  * construct a StoreScreen obj with given id
  */
var StoreScreen = function(id) {
    Screen.call(this,id);
};

inherits(StoreScreen, Screen);

/*
 * Override the load and hide of the parent screen
 */
StoreScreen.prototype.init = function() {
    console.log("Store screen init called");
    this.cards = $('#store-cards');
    this.sampleCard = $('#sample-powerups-card');
    this.gameManager = require('GameManager');

    var map = this.gameManager.powerupManager.powerupsMap;
    for(let [key, value] of map.entries()){
        var card = this.sampleCard.clone()
                        .attr('id', 'powerup-' + key);

        //card.find('.level-num').text(i + 1);
        // card.removeClass(".level-num");
        // card.addClass(".powerup-shape");
        // card.addClass(".powerup-magic");
        var powerup;
        if (value.name.charAt(0) == 'a'){
            powerup = value.name.charAt(0).toUpperCase() +
                           value.name.slice(1,-2) + " " +
                           value.name.slice(-2).toUpperCase();
        }
        else if(value.name.charAt(0) == 'i'){
            powerup = value.name.charAt(0).toUpperCase() +
                           value.name.slice(1,-1) + " " +
                           value.name.slice(-1).toUpperCase();
        }
        else if(value.name.slice(0,4) === "stop"){
            powerup = value.name.charAt(0).toUpperCase() +
                           value.name.slice(1,4) + " " + value.name.charAt(4).toUpperCase() + value.name.slice(5);
        }
        else if(value.name.slice(0,4) === "redu"){
            powerup = value.name.charAt(0).toUpperCase() +
                           value.name.slice(1,6) + " " + value.name.charAt(6).toUpperCase() + value.name.slice(7);
        }
        else{
            powerup = value.name.charAt(0).toUpperCase() +
                           value.name.slice(1);
        }

        if(value.name === "reducetime" || value.name === "stopspawn"){
        	card.find('.card-icon i').removeClass('mdi-shape-plus');
        	card.find('.card-icon i').addClass('mdi-fire');
        }

        card.find('.card-title span').text(powerup);
        card.find('.card-desc').text(value.description);
        card.find('button').attr('data-powerup', value.name);
        card.find('img').attr('src', '/img/powerups/' + value.thumbnail);
        card.find('.price').text(value.price);

        this.cards.append(card);
    }
    var self = this;

    // whole card clickable
    $('#store-cards').on('click', '[id|=powerup]', function () {
        $('#buy-confirm').openModal();
    	self.powerup = $(this).find('button').attr('data-powerup');
    });

    $('#buy-yes').on('click', function(){
    	$('#buy-confirm').closeModal();
    	self.buyPowerup(self.powerup, self.gameManager.powerupManager.getPowerup(self.powerup).price);
    }.bind(self));

    $('#buy-no').on('click', function(){
    	$('#buy-confirm').closeModal();
    });
};

StoreScreen.prototype.buyPowerup = function(powerup, price){
	console.log("Attempting to buy powerup!");
	var availableWistbux = this.gameManager.user.wistbux;
	if(availableWistbux >= price){
		this.gameManager.user.wistbux -= price;
		if(this.gameManager.user.powerup[powerup]){
			this.gameManager.user.powerup[powerup] = 1;
		}else{
			this.gameManager.user.powerup[powerup]++;
		}
		this.gameManager.writeUserData();
		toast("Purchase Successful!");
	}else{
		toast("Insufficient Funds!", true);
	}

};

module.exports = StoreScreen;
