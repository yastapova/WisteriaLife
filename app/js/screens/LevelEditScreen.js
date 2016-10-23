var levelEditScreen = function(id, level) {
    this.level = level;
    this.renderGrid = [];
    this.defenseGrid = [];
    screen.call(this,id);   
};

inherits(levelEditScreen, screen);

levelEditScreen.prototype.load = function() {

};

levelEditScreen.prototype.hide = function() {
    
};

levelEditScreen.prototype.placeShape = function(shape) {

}

levelEditScreen.prototype.isValidCell = function() {

}

levelEditScreen.prototype.getRelativeCoords = function() {
    
}