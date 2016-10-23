/* 
 * ShapeManager.js
 * 
 * Manager for shapes
 * 
 */

var ShapeManager = function(shapes, listOfShapes) {
	if(shapes === undefined && listOfShapes === undefined) {
		this.shapes = undefined;
		this.listOfShapes = undefined;
	}
	else if(shapes === undefined) {
		this.shapes = undefined;
		this.listOfShapes = listOfShapes;
	}
	else if(listOfShapes === undefined) {
		this.shapes = shapes;
		this.listOfShapes = undefined;
	}
	else {
		this.shapes = shapes;
		this.listOfShapes = listOfShapes;
	}
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