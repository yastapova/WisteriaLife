/* 
 * adScreen.js
 * adScreen object
 */

/*
 * Construct an adScreen with given id
 * 
 */

var adScreen = function(id, timer, image) {
	if(timer === undefined && image === undefined) {
		this.timer = undefined;
		this.image = undefined;
	}
	else if(timer === undefined) {
		this.timer = undefined;
		this.image = image;
	}
	else if(image === undefined) {
		this.timer = timer;
		this.image = undefined;
	}
	else {
		this.timer = timer;
		this.image = image;
	}
	screen.call(this, id, timer, image);
};

inherits(adScreen, screen); 

/*
 * Override the load and hide of the parent screen
 * 
 */

adScreen.prototype.load = function() {

};

adScreen.prototype.hide = function() {
	
};