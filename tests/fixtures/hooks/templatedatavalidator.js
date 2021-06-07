const UserError = require('../../../src/errors/usererror');

/**
 * A test data validator hook.
 *
 * @param {Object} pageData configuration(s) of a page template
 */
 module.exports = function (pageData) {
    if(!pageData["global_config"]["experienceKey"]) {
        throw new UserError('Missing Info: experienceKey in config file(s)');
    }
}
