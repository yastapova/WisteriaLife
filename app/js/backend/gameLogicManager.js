var gameLogicManager = function(level) {
    this.renderGrid = [];
    this.updateGrid = [];
    this.defenseGrid = [];
    this.ghostGrid = [];
    this.timer = undefined;
    this.level = level;
}

gameLogicManager.prototype.start = function(level) {

}

gameLogicManager.prototype.updateLoop = function() {

}

gameLogicManager.prototype.updateGrid = function() {

}

gameLogicManager.prototype.reproduce = function() {

}

gameLogicManager.prototype.calcNumNeighbors = function(row, col) {

}

gameLogicManager.prototype.placeShape = function(shape) {

}

gameLogicManager.prototype.isValidCell = function() {

}

gameLogicManager.prototype.getRelativeCoords = function() {

}

gameLogicManager.prototype.pause = function() {

}

gameLogicManager.prototype.resume = function() {

}

gameLogicManager.prototype.reset = function() {

}

gameLogicManager.prototype.getRenderGrid = function() {
    return this.renderGrid;
}
gameLogicManager.prototype.getUpdateGrid = function() {
    return this.updateGrid;
}
gameLogicManager.prototype.getDefenseGrid = function() {
    return this.defenseGrid;
}
gameLogicManager.prototype.getGhostGrid = function() {
    return this.ghostGrid;
}
gameLogicManager.prototype.getTimer = function() {
    return this.timer;
}
gameLogicManager.prototype.getLevel = function() {
    return this.level;
}

gameLogicManager.prototype.setRenderGrid = function(renderGrid) {
    this.renderGrid = renderGrid;
}
gameLogicManager.prototype.setUpdateGrid = function(updateGrid) {
    this.updateGrid = updateGrid;
}
gameLogicManager.prototype.setDefenseGrid = function(defenseGrid) {
    this.defenseGrid = defenseGrid;
}
gameLogicManager.prototype.setGhostGrid = function(ghostGrid) {
    this.ghostGrid = ghostGrid;
}
gameLogicManager.prototype.setTimer = function(timer) {
    this.timer = timer;
}
gameLogicManager.prototype.setLevel = function(level) {
    this.level = level;
}