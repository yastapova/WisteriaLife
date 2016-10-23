/* 
 * screen.js
 * 
 * Defines a screen
 * 
 */

var screen = function(id) {
	if(id === undefined) {
		this.id = undefined;
	}
	else {
		this.id = id;
	} 
};

screen.prototype.setId = function(id) {
	this.id = id;
};

screen.prototype.getId = function() {
	return this.id;
};

screen.prototype.load = function() {

};

screen.prototype.hide = function() {
	
};