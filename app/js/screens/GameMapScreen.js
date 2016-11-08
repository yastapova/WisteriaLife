/**
 * GameMapScreen.js
 * Map region select screen
 */
var screen = require('./Screen');
var firebase = require("firebase");
var gameManager = require('../backend/GameManager');

var GameMapScreen = function (id) {
    screen.call(this, id);
};

inherits(GameMapScreen, screen);

/**
 * Load available levels/regions based on user progress
 */
GameMapScreen.prototype.loadAvailableLevels = function () {

};

/*
 * Override the load and hide of the parent screen
 */
GameMapScreen.prototype.init = function () {
    console.log("Game map init called!");
    // update current shape
    this.loadRegionImages();
};

GameMapScreen.prototype.hide = function () {

};

GameMapScreen.prototype.loadRegionImages = function () {
	var regionsMap = require('GameManager').levelManager.regionsMap;
	// Reference to the /images/ storage path
	//var pathReference1 = firebase.storage().ref('img/regions/' + regionsMap.get("The Revolting River").img);
	// var pathReference2 = firebase.storage().ref('img/regions/' + regionsMap.get("The Putrid Plateau").img);
	// var pathReference3 = firebase.storage().ref('img/regions/' + regionsMap.get("The Malignant Marsh").img);
	// var pathReference4 = firebase.storage().ref('img/regions/' + regionsMap.get("The Abysmal Abyss").img);
	$('#region-1-card').css({
		   "background" : "url(img/regions/" + regionsMap.get("The Revolting River").img + ") no-repeat center center",
		   "background-size" : "cover"
	});
	$('#region-2-card').css({
		   "background" : "url(img/regions/" + regionsMap.get("The Putrid Plateau").img + ") no-repeat center center",
		   "background-size" : "cover"
	});
	$('#region-3-card').css({
		   "background" : "url(img/regions/" + regionsMap.get("The Malignant Marsh").img + ") no-repeat center center",
		   "background-size" : "cover"
	});
	$('#region-4-card').css({
		   "background" : "url(img/regions/" + regionsMap.get("The Abysmal Abyss").img + ") no-repeat center center",
		   "background-size" : "cover"
	});
	// // Get the download URL
	// pathReference1.getDownloadURL().then(function(url) {
	//   $('#region-1-card').css({
	// 	   "background" : "url(img/regions/" + regionsMap.get("The Revolting River").img + ") no-repeat center center",
	// 	   "background-size" : "cover"
	// 	 });
	// });
	// pathReference2.getDownloadURL().then(function(url) {
	//   $('#region-2-card').css({
	// 	   "background" : "url(" + url + ") no-repeat center center",
	// 	   "background-size" : "cover"
	// 	 });
	// });
	// pathReference3.getDownloadURL().then(function(url) {
	//   $('#region-3-card').css({
	// 	   "background" : "url(" + url + ") no-repeat center center",
	// 	   "background-size" : "cover"
	// 	 });
	// });
	// pathReference4.getDownloadURL().then(function(url) {
	//   $('#region-4-card').css({
	// 	   "background" : "url(" + url + ") no-repeat center center",
	// 	   "background-size" : "cover"
	// 	 });
	// });
};

// // A loading image URL.
// GameMapScreen.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

// // Sets the URL of the given img element with the URL of the image stored in Firebase Storage.
// GameMapScreen.prototype.setImageUrl = function(imageUri, imgElement) {
//   // If the image is a Firebase Storage URI we fetch the URL.
//   if (imageUri.startsWith('gs://')) {
//     imgElement.src = GameMapScreen.LOADING_IMAGE_URL; // Display a loading image first.
//     this.storage.refFromURL(imageUri).getMetadata().then(function(metadata) {
//       imgElement.src = metadata.downloadURLs[0];
//     });
//   } else {
//     imgElement.src = imageUri;
//   }
// };

module.exports = GameMapScreen;
