/* 
 * screen.js
 * 
 * Defines a screen
 * 
 */

var screen = function(id) {
	this.id = undefined;
};

screen.prototype.init = function(id) {
	this.id = id;
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