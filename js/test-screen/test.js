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
