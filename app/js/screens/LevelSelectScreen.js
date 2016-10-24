/* 
 * LevelSelectScreen.js
 * LevelSelectScreen object
 */

/*
 * Construct a LevelSelectScreen with given id
 * 
 */

var LevelSelectScreen = function(id, region) {
	if(region === undefined) {
		this.region = undefined;
	}
	else {
		this.region = region;
	}
	screen.call(this, id, region);
};

inherits(LevelSelectScreen, screen); 

/*
 * Override the load and hide of the parent screen
 * 
 */

LevelSelectScreen.prototype.load = function() {

};

LevelSelectScreen.prototype.hide = function() {
	
};

LevelSelectScreen.prototype.loadAvailableLevels = function() {
	
};

LevelSelectScreen.prototype.loadLevels = function() {
	
};