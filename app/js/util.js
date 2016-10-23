/**
 * Utility methods and variables
 * Included first in concatenation
 */

/**
 * Child inherits from parent
 * Sets the child's prototype equal to the parent's
 *
 * @param child child object
 * @param parent parent object
 */
function inherits(child, parent) {
    child.prototype = Object.create(parent.prototype);
}
