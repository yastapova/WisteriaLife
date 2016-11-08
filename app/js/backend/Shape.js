/**
 * Shape.js
 * Defines a Shape
 * @param shapeAttrObj the Object containing all the attrbiutes required to initialize a shape
 */
var Shape = function (shapeAttrObj) {
	this.name = shapeAttrObj.name;
	this.pixelsArray = shapeAttrObj.coordinates;
};

module.exports = Shape;
