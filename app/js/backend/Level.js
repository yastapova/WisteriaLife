/**
 * Level.js
 * Defines a Level
 * @param levelAttrObj object containing all the attributes for a Level obj
 */
var Level = function(levelAttrObj) {
    this.id = levelAttrObj.id;
    this.grid = levelAttrObj.grid;
    this.time = levelAttrObj.time;
    this.enemyZone = levelAttrObj.enemyZone;
    this.allowedShapes = levelAttrObj.allowedShapes;    
    this.defenseStructures = levelAttrObj.defenseStructures;
    this.messageMap = new Map();
    this.enemySpawns = new Map();
    this.convertToMessageMap(levelAttrObj.messages);
    this.convertToEnemySpawnMap(levelAttrObj.enemySpawns);
};

/**
 * Initializes the messageMap from the messages array in the shapeAtrrObj
 * @param messages the messages object with time and message attributes
 */
Level.prototype.convertToMessageMap = function (messages) {
	for(var i = 0; i < messages.length; i++){
        this.messageMap.set(messages.time, messages.message);
    }
};

/*
 * Initializes the enemySpawnMap array from the enemy spawns array in the shapeAtrrObj
 * @param enemySpawns the enemySpawns object with time and enemy spawn shapes atttributes
 */
Level.prototype.convertToEnemySpawnMap = function (enemySpawns) {
	for(var i = 0; i < enemySpawns.length; i++){
        this.enemySpawnMap.set(enemySpawns.time, enemySpawns.shapes);
    }
};

/**
 * Get the wistbux reward for given level. Does not check to see if level is custom or not.
 * @return int the number of wistbux to reward
 */
Level.prototype.getWistbux = function() {
    var wistbux = 0; 
    if(id < 11){
        wistbux += 5;
    }else if(id < 21){
        wistbux += 10;
    }else if(id < 31){
        wistbux += 15;
    }
    else{
        wistbux += 20;
    }
    if(id % 10 === 0){
        wistbux *=2;
    }
    return wistbux;
};

module.exports = Level;
