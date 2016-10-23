/* 
 * level.js
 * 
 * Defines a level
 * 
 */

var level = function(Level) {
	this.name = Level.name;
	this.id = Level.id;
	this.storyline = Level.storyline;
	this.grid = Level.grid;
	this.allowedShapes = Level.allowedShapes;
	this.time = Level.time;
	this.messageMap = Level.messageMap;
	this.enemySpawns = Level.enemySpawns;
	this.image = Level.image;
	this.wistbux = Level.wistbux;
};

level.prototype.setName = function(name) {
	this.name = name;
};

level.prototype.setId = function(id) {
	this.id = id;
};

level.prototype.setStoryline = function(storyline) {
	this.storyline = storyline;
};

level.prototype.setGrid = function(grid) {
	this.grid = grid;
};

level.prototype.setAllowedShapes = function(allowedShapes) {
	this.allowedShapes = allowedShapes;
};

level.prototype.setTime = function(time) {
	this.time = time;
};

level.prototype.setMessageMap = function(messageMap) {
	this.messageMap = messageMap;
};

level.prototype.setEnemySpawns = function(enemySpawns) {
	this.enemySpawns = enemySpawns;
};

level.prototype.setImage = function(image) {
	this.image = image;
};

level.prototype.setWistbux = function(wistbux) {
	this.wistbux = wistbux;
};

level.prototype.getName = function() {
	return this.name;
};

level.prototype.getId = function() {
	return this.id;
};

level.prototype.getStoryline = function() {
	return this.storyline;
};

level.prototype.getGrid = function() {
	return this.grid;
};

level.prototype.getAllowedShapes = function() {
	return this.allowedShapes;
};

level.prototype.getTime = function() {
	return this.time;
};

level.prototype.getMessageMap = function() {
	return this.messageMap;
};

level.prototype.getEnemySpawns = function() {
	return this.enemySpawns;
};

level.prototype.getImage = function() {
	return this.image;
};

level.prototype.setWistbux = function() {
	return this.wistbux;
};

