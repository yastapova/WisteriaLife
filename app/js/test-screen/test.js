var TestA = function () {
	this.name = "Test A Screen";
};

TestA.prototype.getName = function () {
	return this.name;
};

var TestB = function () {
	this.name = "Test B Screen";
	this.screen = "Extend";
};

inherits(TestB, TestA);

TestB.prototype.getScreen = function () {
	return this.screen;
};

var testB = new TestB();
console.log(testB.getName());
console.log(testB.getScreen());

var testA = new TestA();
console.log(testA.getName());
console.log(testA.name);

testA.name = "Test A Name";
console.log(testA.name);

// Note - this only works on frontend
// on backend code, the full relative path must be provided
// require('../backend/PowerupManager')
var PowerupManager = require('PowerupManager');
var ShapeManager = require('ShapeManager');
var LevelManager = require('LevelManager');

var PowerupManager = new PowerupManager();
var ShapeManager = new ShapeManager();
var LevelManager = new LevelManager();
LevelManager.loadLevel(1);

module.exports = {
	TestA: TestA,
	TestB: TestB,
};
