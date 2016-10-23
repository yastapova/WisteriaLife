/* 
 * level.js
 * 
 * Defines a level
 * 
 */

var level = function(name, id, storyline, grid, allowedShapes, time, messageMap, enemySpawns, image, wistbux) {
    this.name = undefined;
    this.id = undefined;
    this.storyline = undefined;
    this.grid = undefined;
    this.allowedShapes = undefined;
    this.time = undefined;
    this.messageMap = undefined;
    this.enemySpawns = undefined;
    this.image = undefined;
    this.wistbux = undefined;
};

level.prototype.init = function(name, id, storyline, grid, allowedShapes, time, messageMap, enemySpawns, image, wistbux) {
    this.name = name;
    this.id = id;
    this.storyline = storyline;
    this.grid = grid;
    this.allowedShapes = allowedShapes;
    this.time = time;
    this.messageMap = messageMap;
    this.enemySpawns = enemySpawns;
    this.image = image;
    this.wistbux = wistbux;
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

