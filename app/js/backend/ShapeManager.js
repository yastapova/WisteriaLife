/*
 * ShapeManager.js
 *
 * Defines an initializes all the shapes in the game
 *
 */

var Shape = require('Shape');
 
var ShapeManager = function() {
    this.shapesMap = new Map();
    this.initShapesMap();
}

ShapeManager.prototype.initShapesMap = function(){
    console.log("Init shapes map called.");
    var shapesFile = "/data/shapes.json";
    $.getJSON(shapesFile, function(data){
        console.log("loading from data shapes.json");
        this.loadJSONData(data);
    }.bind(this));
}

/*
 * Create a shapeAttrObj from the objs in the json file
 * and map the shapes accordingly.
 */
ShapeManager.prototype.loadJSONData = function(data){
    for (var i = 0; i < data.shapes.length;i++){
        var shapeData = data.shapes[i];
        var shapeAttrObj = {
            name : shapeData.name,
            coordinates : shapeData.coordinates
        }
        this.shapesMap.set(shapeData.name, new Shape(shapeAttrObj));
    }
}

module.exports = ShapeManager;
