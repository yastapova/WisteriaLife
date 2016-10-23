/* 
 * levelSelectScreen.js
 * levelSelectScreen object
 */

/*
 * Construct a levelSelectScreen with given id
 * 
 */

var levelSelectScreen = function(id, region) {
	if(region === undefined) {
		this.region = undefined;
	}
	else {
		this.region = region;
	}
	screen.call(this, id, region);
};

inherits(levelSelectScreen, screen); 

/*
 * Override the load and hide of the parent screen
 * 
 */

levelSelectScreen.prototype.load = function() {

};

levelSelectScreen.prototype.hide = function() {
	
};

levelSelectScreen.prototype.loadAvailableLevels = function() {
	
};

levelSelectScreen.prototype.loadLevels = function() {
	
};