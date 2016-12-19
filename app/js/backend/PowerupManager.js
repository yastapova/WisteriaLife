var Powerup = require('./Powerup');
var firebase = require("firebase");

/**
 * PowerupManager.js
 * Defines and initializes all the powerups in the game
 */
var PowerupManager = function () {
	this.powerupsMap = new Map();
};

/**
 * Load resource
 * @param  {Function} callback
 *         Success callback function (called when done loading and processing)
 */
PowerupManager.prototype.load = function (callback) {
	this.loadPowerups(callback);
};

/**
 * Look up powerup object in the map
 * @param  {String} name name of powerup
 * @return {Powerup}      powerup object
 */
PowerupManager.prototype.getPowerup = function (name) {
    return this.powerupsMap.get(name);
};

// Loads the powerups from firebase
PowerupManager.prototype.loadPowerups = function(callback) {
	// Reference to the /powerups/ database path
	firebase.database().ref('powerups').once('value', function (snapshot) {
  		this.loadJSONData(snapshot.val(), callback);
  	}.bind(this));
};

/**
 * Create a powerupAttrObj from the objs in the json file
 * and map the powerup accordingly.
 * @param data JSON data
 */
PowerupManager.prototype.loadJSONData = function (data, callback) {
	for (var i = 0; i < data.length; i++) {
		var powerupData = data[i];
		var powerupAttrObj = {
			name: powerupData.name,
			type: powerupData.type,
			description: powerupData.description,
			price: powerupData.price,
			thumbnail: powerupData.thumbnail
		};
		switch (powerupData.name) {
		case "reducetime":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, this.useReduceTimePowerup));
			break;
		case "stopspawn":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, this.useStopSpawnPowerup));
			break;
		case "void":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, this.useShapePowerup));
			break;
		case "tower":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, this.useShapePowerup));
			break;
		case "blockade":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, this.useShapePowerup));
			break;
		case "shield":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, this.useShapePowerup));
			break;
		case "caltrops":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, this.useShapePowerup));
			break;
		case "archernw":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, this.useShapePowerup));
			break;
		case "archerne":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, this.useShapePowerup));
			break;
		case "archerse":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, this.useShapePowerup));
			break;
		case "archersw":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, this.useShapePowerup));
			break;
		case "infantryw":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, this.useShapePowerup));
			break;
		case "infantryn":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, this.useShapePowerup));
			break;
		case "infantrye":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, this.useShapePowerup));
			break;
		case "infantrys":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, this.useShapePowerup));
			break;
		case "wallbackward":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, this.useShapePowerup));
			break;
		case "wallforward":
			this.powerupsMap.set(powerupData.name, new Powerup(powerupAttrObj, this.useShapePowerup));
			break;
		}
	}

	callback();
};

/**
 * Use a shape powerup
 * @param level the level obj to use the shape powerup on
 */
PowerupManager.prototype.useShapePowerup = function(gameManager, shape) {
	var current = $("#powerup-" + shape + " .item-count").text();
	if(current === "0"){
		return;
	}
	current =  current - '0';
	$("#powerup-" + shape + " .item-count").text(--current);	
	if(gameManager.gameLogicManager.allowedShapesMap[shape] !== undefined){
		gameManager.gameLogicManager.allowedShapesMap[shape]++;	
	}else{
		$('#unit-select-items').append((function () {
        var shapes = [];
        var unitName;
            if (shape.charAt(0) == 'a')
                unitName = shape.charAt(0).toUpperCase() +
                               shape.slice(1,-2) + " " +
                               shape.slice(-2).toUpperCase();

            else if(shape.charAt(0) == 'i')
                unitName = shape.charAt(0).toUpperCase() +
                               shape.slice(1,-1) + " " +
                               shape.slice(-1).toUpperCase();
            else
                unitName = shape.charAt(0).toUpperCase() +
                               shape.slice(1);
        shapes.push(
            $('<span>')
                .attr('id', 'unit-' + shape)
                .addClass('select-item')
                .attr('data-value', shape)
                .attr('data-tooltip', unitName)
                .append(
                    $('<img>').attr('src', '/img/powerups/' + shape + '.png')
                )
                .append(
                    $('<span>')
                        .addClass('item-count')
                        .text(1)
                )
        );
        return shapes;
    }.bind(this))());
		gameManager.gameLogicManager.allowedShapesMap[shape] = 1;	
	}
	$("#unit-" + shape + " .item-count").text(gameManager.gameLogicManager.allowedShapesMap[shape]);
	// decrement user powerups here
	gameManager.user.powerups[shape]--;
	gameManager.writeUserData();
};

/**
 * Use a reduce time powerup.
 * @param level the level obj to use the reduce time powerup on
 */
PowerupManager.prototype.useReduceTimePowerup = function(gameManager, shape) {
	var current = $("#powerup-" + shape + " .item-count").text();
	if(current === "0"){
		return;
	}
	current =  current - '0';
	$("#powerup-" + shape + " .item-count").text(--current);
	if(gameManager.gameLogicManager.level.time - 5 <= 0){
		gameManager.gameLogicManager.level.time = 0;
	}
	else{
		gameManager.gameLogicManager.level.time = gameManager.gameLogicManager.level.time - 5;
	}
	// decrement user powerups here
	gameManager.user.powerups[shape]--;
	gameManager.writeUserData();
};

/**
 * Use a stop spawn powerup
 * @param level the level obj to use the stop spawn powerup on
 */
PowerupManager.prototype.useStopSpawnPowerup = function(gameManager, shape) {
	var current = $("#powerup-" + shape + " .item-count").text();
	if(current === "0"){
		return;
	}
	current =  current - '0';
	$("#powerup-" + shape + " .item-count").text(--current);
	for(var currentTime = gameManager.gameLogicManager.level.time; currentTime > 0; currentTime--){
		if(gameManager.gameLogicManager.level.enemySpawns.has(currentTime)){
			gameManager.gameLogicManager.level.enemySpawns.delete(currentTime);
			break;
		}
	}
	// decrement user powerups here
	gameManager.user.powerups[shape]--;
	gameManager.writeUserData();
};

module.exports = PowerupManager;
