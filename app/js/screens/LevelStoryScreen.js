/* 
 * levelStoryScreen.js
 * levelStoryScreen object
 */

/*
 * Construct a levelStoryScreen with given id
 * 
 */

var levelStoryScreen = function(id, level) {
	if(level === undefined) {
		this.level = undefined;
	}
	else {
		this.level = level;
	}
	screen.call(this, id, level);
};

inherits(levelStoryScreen, screen); 

/*
 * Override the load and hide of the parent screen
 * 
 */

levelStoryScreen.prototype.load = function() {

};

levelStoryScreen.prototype.hide = function() {
	
};