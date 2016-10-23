var user = function(nm, av, id, gd) {
	this.name = undefined;
	this.avatar = undefined;
	this.id = undefined;
	this.gameData = undefined;
};

user.prototype.init = function(nm, av, id, gd) {
	this.name = nm;
	this.avatar = av;
	this.id = id;
	this.gameData = gd;
}

user.prototype.setName = function(nm) {
	this.name = nm;
}
user.prototype.setAvatar = function(av) {
	this.avatar = av;
}
user.prototype.setId = function(id) {
	this.id = id;
}
user.prototype.setGameData = function(gd) {
	this.gameData = gd;
}

user.prototype.getName = function() {
	return this.name;
}
user.prototype.getAvatar = function() {
	return this.avatar;
}
user.prototype.getId = function() {
	return this.id;
}
user.prototype.getGameData = function() {
	return this.gameData;
}