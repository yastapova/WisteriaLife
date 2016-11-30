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
 * @param {int} property    screen specific property (needed for final part of url)
 */
var Screen = function (id, overlay, property) {
    this.id = id;
    this.overlay = overlay;
    this.overlayElement = null;
    this.property = property;

    // constants - main container will never change
    this.container = $('#main-container');
    this.loader = $('#loading-overlay');
};

/**
 * Load and replace screen with new screen
 *
 * When finished, the screen's implemented init() method is a callback.
 */
Screen.prototype.load = function () {
    /*
        - $.get HTML page
        - Get #container-inner from fetched page
        - if overlay
            - append container to current #container
        - else
            - replace #container contents to new #container-inner

        - History push (update URL/title, push to browser history)


        Called from child's load method,
        followed by each child's specific functionality
     */

    // special case url for splash screen
    var screenSwitch = this.id == 'splash' ? '' : this.id;

    // add specific property to url if avaiable
    if (this.property)
        screenSwitch += '/' + this.property;

    if (!this.overlay)
        this.loader.fadeIn('fast');

    console.log('Loading screen ' + this.id);

    $.get('/' + screenSwitch, '', function (data) {

        // if overlay, only add the container (don't replace)
        // and don't push history
        if (this.overlay) {

            this.container.prepend($(data).filter('#main-container').html());

            // save element to easily hide later
            this.overlayElement = this.container.find('.screen-overlay');

            document.title = $(data).filter('title').text();

            // initialize overlay screen
            // initScreen.bind(this)();
            this.init();

        } else {
            this.container.fadeOut('fast', function () {

                // replace current container with new screen's container
                this.container.html($(data).filter('#main-container').html());

                this.container.fadeIn('fast', function() {

                    // don't pushstate if going back (popstate)
                    if (!history.state || history.state.screen != this.id) {
                        // set browser URL
                        history.pushState({screen: this.id, property: this.property}, '', '/' + screenSwitch);
                    }
                    // set browser title
                    // https://bugs.webkit.org/show_bug.cgi?id=43730
                    // https://bugzilla.mozilla.org/show_bug.cgi?id=585653
                    document.title = $(data).filter('title').text();

                    this.loader.fadeOut('fast');

                    // scroll to top
                    $('html, body').animate({ scrollTop: 0 }, 'fast');

                    // initialize screen
                    // initScreen.bind(this)();
                    this.init();
                }.bind(this))

            }.bind(this));
        }

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

/**
 * Base method for checking if loading this screen is legal
 * for the user
 *
 * @param  {User}  user User object
 * @return {Boolean/String}    whether or not the user is allowed to navigate here
 *                             if false, a String message may be returned instead.
 *                             Message will appear as an error toast
 */
Screen.prototype.isLegal = function (user) {
    return true;
}

module.exports = Screen;
