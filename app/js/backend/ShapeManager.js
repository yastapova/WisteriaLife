var Shape = require('Shape');
var firebase = require("firebase");

/**
 * ShapeManager.js
 *
 * Defines and initializes all the shapes in the game
 */
var ShapeManager = function() {
    this.shapesMap = new Map();
    this.loadShapes();
};

// Loads the shapes from firebase
ShapeManager.prototype.loadShapes = function() { 
    // Reference to the /shapes/ database path
    firebase.database().ref('shapes').once('value', function (snapshot) {
        this.loadJSONData(snapshot.val());
    }.bind(this));
};

/*
 * Create a shapeAttrObj from the objs in the json file
 * and map the shapes accordingly.
 * @param data the JSON data
 */
ShapeManager.prototype.loadJSONData = function(data){
    for (var i = 0; i < data.length;i++){
        var shapeData = data[i];
        var shapeAttrObj = {
            name : shapeData.name,
            coordinates : shapeData.coordinates
        };
        this.shapesMap.set(shapeData.name, new Shape(shapeAttrObj));
    }
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
