var TestA = function () {
	this.name = "Test A Screen";
}

TestA.prototype.getName = function () {
	return this.name;
}

var TestB = function () {
	this.name = "Test B Screen";
	this.screen = "Extend";
}

inherits(TestB, TestA);

TestB.prototype.getScreen = function () {
	return this.screen;
}

var testB = new TestB();
console.log(testB.getName());
console.log(testB.getScreen());

var testA = new TestA();
console.log(testA.getName());
console.log(testA.name);

testA.name = "Test A Name";
console.log(testA.name);

var PowerupManager = require('PowerupManager');
var ShapeManager = require('ShapeManager');

var PowerupManager = new PowerupManager();
var ShapeManager = new ShapeManager();

module.exports = {
	TestA: TestA,
	TestB: TestB,
};
