var Shape = require('Shape');
var firebase = require("firebase");

/**
 * ShapeManager.js
 *
 * Defines and initializes all the shapes in the game
 */
var ShapeManager = function() {
    this.shapesMap = new Map();
};

/**
 * Load resource
 * @param  {Function} callback
 *         Success callback function (called when done loading and processing)
 */
ShapeManager.prototype.load = function (callback) {
    this.loadShapes(callback);
};

// Loads the shapes from firebase
ShapeManager.prototype.loadShapes = function(callback) {
    // Reference to the /shapes/ database path
    firebase.database().ref('shapes').once('value', function (snapshot) {
        this.loadJSONData(snapshot.val(), callback);
    }.bind(this));
};

/*
 * Create a shapeAttrObj from the objs in the json file
 * and map the shapes accordingly.
 * @param data the JSON data
 */
ShapeManager.prototype.loadJSONData = function(data, callback){
    for (var i = 0; i < data.length;i++){
        var shapeData = data[i];
        var shapeAttrObj = {
            name : shapeData.name,
            coordinates : shapeData.coordinates
        };
        this.shapesMap.set(shapeData.name, new Shape(shapeAttrObj));
    }

    callback();
};

/**
 * Look up shape object in the map
 * @param  {String} name name of Shape
 * @return {Shape}      Shape object
 */
ShapeManager.prototype.getShape = function (name) {
    return this.shapesMap.get(name);
};

module.exports = ShapeManager;
