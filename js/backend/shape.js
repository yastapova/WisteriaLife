/* 
 * shape.js
 * 
 * Defines a shape
 * 
 */

var shape = function(name, thumbnail, cells) {
	this.name = undefined;
	this.thumbnail = undefined;
	this.cells = undefined;
};

shape.prototype.init = function(name, thumnail, cells) {
	this.name = name;
	this.thumnail = thumnail;
	this.cells = cells;
};

shape.prototype.setName = function(name) {
	this.name = name;
};

shape.prototype.setThumbnail = function(thumbnail) {
	this.thumbnail = thumbnail;
};

shape.prototype.setCells = function(cells) {
	this.cells = cells;
};

shape.prototype.getName = function() {
	return this.name;
};

shape.prototype.getThumbnail = function() {
	return this.thumbnail;
};

shape.prototype.getCells = function() {
	return this.cells;
};
