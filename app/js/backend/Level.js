/*
 * Level.js
 *
 * Defines a level
 *
 */

var Level = function(levelAttrObj) {
    //this.name = level.name;
    this.id = levelAttrObj.id;
    //this.storyline = level.storyline;
    this.grid = levelAttrObj.grid;
    this.time = levelAttrObj.time;
    this.enemyZone = levelAttrObj.enemyZone;
    this.allowedShapes = levelAttrObj.allowedShapes;
    this.messageMap = this.convertToMessageMap(levelAttrObj.messages);
    this.enemySpawns = this.convertToEnemySpawnMap(levelAttrObj.enemySpawns);
    this.defenseStructures = levelAttrObj.defenseStructures;
    //this.image = level.image;
    //this.wistbux = level.wistbux;
};

/*
 * Initializes the messageMap from the messages array in the shapeAtrrObj
 */
Level.prototype.convertToMessageMap = function (messages) {
	// var pixels = new Array();
	// var pixelsArrayCounter = 0;
	// for (var i = 0; i < coordinates.length; i++) {
		// pixels[pixelsArrayCounter] = coordinates[i].x;
		// pixels[pixelsArrayCounter + 1] = coordinates[i].y;
		// pixelsArrayCounter += 2;
	// }
	// return pixels;
}

/*
 * Initializes the enemySpawnMap array from the enemry spawns array in the shapeAtrrObj
 */
Level.prototype.convertToEnemySpawnMap = function (enemySpawns) {
	// var pixels = new Array();
	// var pixelsArrayCounter = 0;
	// for (var i = 0; i < coordinates.length; i++) {
		// pixels[pixelsArrayCounter] = coordinates[i].x;
		// pixels[pixelsArrayCounter + 1] = coordinates[i].y;
		// pixelsArrayCounter += 2;
	// }
	// return pixels;
}

/*
 * Get the wistbux reward for given level. Does not check to see if level is custom or not.
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
    if(id % 10 == 0){
        wistbux *=2;
    }
    return wistbux;
};

module.exports = Level;
