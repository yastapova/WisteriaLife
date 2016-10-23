/* 
 * ScreenManager.js
 * 
 * Manager for screens
 * 
 */

var ScreenManager = function(screenManager) {
	this.currentScreen = screenManager.currentScreen;
	this.lastLegalScreen = screenManager.lastLegalScreen;
	this.nextScreen = screenManager.nextScreen;
	this.screenMap = screenManager.screenMap;
};

ScreenManager.prototype.setCurrentScreen = function(currentScreen) {
	this.currentScreen = currentScreen;
};

ScreenManager.prototype.setLastLegalScreen = function(lastLegalScreen) {
	this.lastLegalScreen = lastLegalScreen;
};

ScreenManager.prototype.setNextScreen = function(nextScreen) {
	this.nextScreen = nextScreen;
};

ScreenManager.prototype.setScreenMap = function(screenMap) {
	this.screenMap = screenMap;
};

ScreenManager.prototype.getCurrentScreen = function() {
	return this.currentScreen;
};

ScreenManager.prototype.getLastLegalScreen = function() {
	return this.lastLegalScreen;
};

ScreenManager.prototype.getNextScreen = function() {
	return this.nextScreen;
};

ScreenManager.prototype.getScreenMap = function() {
	return this.screenMap;
};

ScreenManager.prototype.setScreen = function(currentScreen) {
	this.currentScreen = currentScreen;
};

ScreenManager.prototype.initializeScreens = function() {
	
};

ScreenManager.prototype.back = function() {
	
};