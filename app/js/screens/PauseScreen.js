/* 
 * pauseScreen.js
 * pauseScreen object
 */

/*
 * Construct a pauseScreen with given id
 * 
 */

var pauseScreen = function(id, level) {
	if(level === undefined) {
		this.level = undefined;
	}
	else {
		this.level = level;
	}
	screen.call(this, id, level);
};

inherits(pauseScreen, screen); 

/*
 * Override the load and hide of the parent screen
 * 
 */

pauseScreen.prototype.load = function() {

};

pauseScreen.prototype.hide = function() {
	
};

pauseScreen.prototype.replay = function() {
	
}