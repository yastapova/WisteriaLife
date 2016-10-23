var victoryScreen = function(id, level, user) {
    this.level = level;
    this.user = user;
    screen.call(this,id);
};

inherits(victoryScreen, screen);

victoryScreen.prototype.load = function() {

};

victoryScreen.prototype.hide = function() {
    
};

victoryScreen.prototype.share = function() {

}

victoryScreen.prototype.replay = function() {

}