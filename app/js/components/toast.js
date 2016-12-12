/**
 * Display an onscreen toast message
 *
 * Error messages are limited to one on-screen at any given time,
 * so adding a message will remove previous ones.
 *
 * @param  {String} message     Message to display
 * @param  {boolean} error      whether or not its an error
 * @param  {Number} [duration]  duration in milliseconds
 */
function toast(message, error, duration) {
    var className = error ? 'wisteria-error-toast' : 'wisteria-toast';
    duration = duration ? duration : 4000;

    // remove all existing error toasts
    if (error)
        $('.wisteria-error-toast').remove();

    Materialize.toast(message, duration, className);
}

module.exports = toast;
