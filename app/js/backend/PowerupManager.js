var Powerup = require('./Powerup');

/**
 * PowerupManager.js
 * Defines and initializes all the powerups in the game
 */
var PowerupManager = function () {
	this.powerupsMap = new Map();
	this.initPowerupsMap();
};

/**
 * intializes the powerupsMap with name:String to powerup:Powerup mapping
 */
PowerupManager.prototype.initPowerupsMap = function () {
	console.log("Init powerup map called.");
	var powerupsFile = "/data/powerups.json";
	$.getJSON(powerupsFile, function (data) {
		console.log("loading from data powerups.json");
		this.loadJSONData(data);
	}.bind(this));
};

/**
 * Create a powerupAttrObj from the objs in the json file
 * and map the powerup accordingly.
 * TO DO: add the effect functions.
 * @param data JSON data
 */
PowerupManager.prototype.loadJSONData = function (data) {
	for (var i = 0; i < data.powerups.length; i++) {
		var powerupData = data.powerups[i];
		var powerupAttrObj = {
			name: powerupData.name,
			type: powerupData.type,
			description: powerupData.description,
			price: powerupData.price,
			thumbnail: powerupData.thumbnail
		};
		switch (powerupData.name) {
		case "Reduce Time":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, this.useReduceTimePowerup));
			break;
		case "Stop Spawn":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, this.useStopSpawnPowerup));
			break;
		case "Void Cell":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, this.useShapePowerup));
			break;
		case "Tower":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, this.useShapePowerup));
			break;
		case "Blockade":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, this.useShapePowerup));
			break;
		case "Shield":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, this.useShapePowerup));
			break;
		case "Caltrops":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, this.useShapePowerup));
			break;
		case "Archer NW":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, this.useShapePowerup));
			break;
		case "Archer NE":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, this.useShapePowerup));
			break;
		case "Archer SE":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, this.useShapePowerup));
			break;
		case "Archer SW":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, this.useShapePowerup));
			break;
		case "Infantry W":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, this.useShapePowerup));
			break;
		case "Infantry N":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, this.useShapePowerup));
			break;
		case "Infantry E":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, this.useShapePowerup));
			break;
		case "Infantry S":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, this.useShapePowerup));
			break;
		case "Wall Backward":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, this.useShapePowerup));
			break;
		case "Wall Forward":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, this.useShapePowerup));
			break;
		}
	}
};

/**
 * Use a shape powerup
 * @param level the level obj to use the shape powerup on
 */
PowerupManager.prototype.useShapePowerup = function(level) {
	for(var i = 0; i < level.allowedShapes.length; i++){
		if(level.allowedShapes[i].shape === powerupData.name){
			level.allowedShapes[i].quantity += 1;
			return;
		}
	}
	var shape = {};
	shape.shape = powerupData.name;
	shape.quantity = 1;
	level.allowedShapes.push(shape);		
};

/**
 * Use a reduce time powerup. 
 * @param lvel the level obj to use the reduce time powerup on
 */
PowerupManager.prototype.useReduceTimePowerup = function(level) {
	if(level.time - 5 <= 0){
		level.time = 0;
	}
	else{
		level.time = level.time - 5;
	}		
};

/**
 * Use a stop spawn powerup
 * @param level the level obj to use the stop spawn powerup on
 */
PowerupManager.prototype.useStopSpawnPowerup = function(level) {
	for(var currentTime = level.time; currentTime > 0; currentTime--){
		if(level.enemySpawnsMap.has(currentTime)){
			level.enemySpawnsMap.delete(currentTime);
			return;
		}
	}
};

module.exports = PowerupManager;
