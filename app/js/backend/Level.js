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

Level.prototype.setWistbux = function(wistbux) {
    this.wistbux = wistbux;
};
