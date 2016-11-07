/**
 * Shape.js
 * Defines a Shape
 * @param shapeAttrObj the Object containing all the attrbiutes required to initialize a shape
 */
var Shape = function (shapeAttrObj) {
	this.name = shapeAttrObj.name;
	this.pixelsArray = [];
	this.convertToPixelsArray(shapeAttrObj.coordinates);
};

/**
 * Initializes the pixels array from the coordinates in the shapeAttrObj
 * @param  coordinates the array of coordinate objects to convert to a single array
 */
Shape.prototype.convertToPixelsArray = function (coordinates) {
	var pixelsArrayCounter = 0;
	for (var i = 0; i < coordinates.length; i++) {
		this.pixelsArray[pixelsArrayCounter] = coordinates[i].x;
		this.pixelsArray[pixelsArrayCounter + 1] = coordinates[i].y;
		pixelsArrayCounter += 2;
	}
};

module.exports = Shape;
