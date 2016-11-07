'use strict';
/*
 * Screen.js
 *
 * Defines a screen
 *
 */

/**
 * Screen is the parent of all screens
 * @param {string} id       ID of screen (<url>/id)
 * @param {boolean} overlay whether or not its an overlay over existing screen
 */
var Screen = function (id, overlay) {
    this.id = id;
    this.overlay = overlay;

    // constants - main container will never change
    this.container = $('#main-container');
    this.loader = $('#container-loader');
};

/**
 * Load and replace screen with new screen
 * @param  {function} initScreen callback when screen is done loading
 *                               this should be a function that sets screen specific events
 */
Screen.prototype.load = function (initScreen) {
    /*
        - $.get HTML page
        - Get #container-inner from fetched page
        - if overlay (TODO overlay not implemented yet)
            - append container to current #container
        - else
            - replace #container contents to new #container-inner

        - History push (update URL/title, push to browser history)


        Called from child's load method,
        followed by each child's specific functionality
     */

    // special case url for splash screen
    var screenSwitch = this.id == 'splash' ? '' : this.id;

    this.loader.fadeIn('fast');

    console.log('Loading screen ' + this.id);

    $.get('/' + screenSwitch, '', function (data) {

        this.container.fadeOut('fast', function () {

            // replace current container with new screen's container
            this.container.html($(data).filter('#main-container').html());

            this.container.fadeIn('fast', function() {

                // don't pushstate if going back (popstate)
                if (!history.state || history.state.screen != this.id) {
                    // set browser URL
                    history.pushState({screen: this.id}, '', '/' + screenSwitch);
                }
                // set browser title
                // https://bugs.webkit.org/show_bug.cgi?id=43730
                // https://bugzilla.mozilla.org/show_bug.cgi?id=585653
                document.title = $(data).filter('title').text();

                console.log('Loading screen complete! ' + this.id);

                this.loader.fadeOut('fast');

                // initialize screen
                initScreen.bind(this)();
            }.bind(this))

        }.bind(this));

    }.bind(this), 'html');
};

/**
 * Base method for initializing screen
 * Typically passed in as parameter to load
 * Must be implemented by child class
 */
Screen.prototype.init = function () {
    throw this.id + " screen's init() method not implemented!";
}

module.exports = Screen;
