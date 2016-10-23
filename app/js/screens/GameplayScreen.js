var gameplayScreen = function(id, level) {
    this.level = level;
    this.gameLogicManager = GameLogicManager();
    this.allowedShapes = this.level.getAllowedShapes();
    this.time = this.level.getTime();
    this.messageMap = this.level.getMessageMap();
    this.enemySpawns = this.level.getEnemySpawns();
    screen.call(this,id);   
};

inherits(gameplayScreen, screen);

gameplayScreen.prototype.load = function() {

};

gameplayScreen.prototype.hide = function() {
    
};

gameplayScreen.prototype.addShape = function(shape) {

}

gameplayScreen.prototype.reduceTime = function(time) {
    if(this.time - time <= 0) {
        this.time = 0;
    }
    else {
        this.time = this.time - time;
    }
}

gameplayScreen.prototype.reduceEnemy = function(num) {
    
}