/* 
 * ShapeManager.js
 * 
 * Manager for shapes
 * 
 */

var ShapeManager = function(shapes, listOfShapes) {
    this.shapes = undefined;
    this.listOfShapes = undefined;
};

ShapeManager.prototype.init = function(shapes, listOfShapes) {
    this.shapes = shapes;
    this.listOfShapes = listOfShapes;
};

ShapeManager.prototype.setShapes = function(shapes) {
    this.shapes = shapes;
};

ShapeManager.prototype.setListOfShapes = function(listOfShapes) {
    this.listOfShapes = listOfShapes;
};

ShapeManager.prototype.getShapes = function() {
    return this.shapes;
};

ShapeManager.prototype.getListOfShapes = function() {
    return this.listOfShapes;
};

ShapeManager.prototype.initShapes = function () {
    
};