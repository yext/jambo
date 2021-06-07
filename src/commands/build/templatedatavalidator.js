const fs = require('file-system');
const UserError = require('../../errors/usererror');
const { isCustomError } = require('../../utils/errorutils');

/**
 * TemplateDataValidator is reponsible for checking data supplied to a page
 * using Theme's custom validation steps (if any).
 */
module.exports = class TemplateDataValidator {
  constructor(templateDataValidationHook) {
    /**
     *  The path to template data validation hook.
     * @type {string}
     */
    this._templateDataValidationHook = templateDataValidationHook;
  }
  
  /**
   *  Execute validation hook's function if file exists
   * @param {string} pageName name of the current page
   * @param {Object} pageData template arguments for the current page
   */
  validate({ pageName, pageData }) {
    if (!fs.existsSync(this._templateDataValidationHook)) {
        return;
    }
    try {
        console.log(`Validating configuration for page "${pageName}".`);
        const validatorFunction = require(this._templateDataValidationHook);
        validatorFunction(pageData);
    } catch (err) {
        if(isCustomError(err)) {
            throw err;
        }
        const msg = 
            `Error executing validation hook from ${this._templateDataValidationHook}: `;
        throw new UserError(msg, err.stack);
    }
  }
}
