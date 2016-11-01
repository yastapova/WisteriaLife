/*
 * Level.js
 *
 * Defines a level
 *
 */

var Level = function(level) {
    this.name = level.name;
    this.id = level.id;
    this.storyline = level.storyline;
    this.grid = level.grid;
    this.allowedShapes = level.allowedShapes;
    this.time = level.time;
    this.messageMap = level.messageMap;
    this.enemySpawns = level.enemySpawns;
    this.image = level.image;
    this.wistbux = level.wistbux;
};

Level.prototype.setName = function(name) {
    this.name = name;
};

Level.prototype.setId = function(id) {
    this.id = id;
};

Level.prototype.setStoryline = function(storyline) {
    this.storyline = storyline;
};

Level.prototype.setGrid = function(grid) {
    this.grid = grid;
};

Level.prototype.setAllowedShapes = function(allowedShapes) {
    this.allowedShapes = allowedShapes;
};

Level.prototype.setTime = function(time) {
    this.time = time;
};

Level.prototype.setMessageMap = function(messageMap) {
    this.messageMap = messageMap;
};

Level.prototype.setEnemySpawns = function(enemySpawns) {
    this.enemySpawns = enemySpawns;
};

Level.prototype.setImage = function(image) {
    this.image = image;
};

Level.prototype.getName = function() {
    return this.name;
};

Level.prototype.getId = function() {
    return this.id;
};

Level.prototype.getStoryline = function() {
    return this.storyline;
};

Level.prototype.getGrid = function() {
    return this.grid;
};

Level.prototype.getAllowedShapes = function() {
    return this.allowedShapes;
};

Level.prototype.getTime = function() {
    return this.time;
};

Level.prototype.getMessageMap = function() {
    return this.messageMap;
};

Level.prototype.getEnemySpawns = function() {
    return this.enemySpawns;
};

Level.prototype.getImage = function() {
    return this.image;
};

Level.prototype.setWistbux = function() {
    return this.wistbux;
};

module.exports = Level;
