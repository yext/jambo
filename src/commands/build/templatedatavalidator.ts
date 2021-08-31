import fs from 'file-system';
import UserError from '../../errors/usererror';
import { info } from '../../utils/logger';

/**
 * TemplateDataValidator is reponsible for checking data supplied to a page
 * using Theme's custom validation steps (if any).
 */
export default class TemplateDataValidator {
  private _templateDataValidationHook: string
  private _hasHook: string

  constructor(templateDataValidationHook) {
    /**
     * The path to template data validation hook.
     * @type {string}
     */
    this._templateDataValidationHook = templateDataValidationHook;

    /**
     * Whether or not the file for template data validation hook exists
     * @type {boolean}
     */
    this._hasHook = fs.existsSync(this._templateDataValidationHook);
  }
  
  /**
   * Execute validation hook's function if file exists
   * 
   * @param {Object} page
   * @param {string} page.pageName name of the current page
   * @param {Object} page.pageData template arguments for the current page
   * @param {Object<string, Function|string>} partials
   *                          mapping of partial name to partial. Handlebars converts
   *                          partials from strings to Functions when they are used.
   * @throws {UserError} on failure to execute hook
   * @returns {boolean} whether or not to throw an exception on bad template arguments
   */
  validate({ pageName, pageData, partials }: any) {
    if (!this._hasHook) {
      return true;
    }
    try {
      info(`Validating configuration for page "${pageName}".`);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const validatorFunction = require(this._templateDataValidationHook);
      return validatorFunction(pageData, partials);
    } catch (err) {
      const msg = 
          `Error executing validation hook from ${this._templateDataValidationHook}: `;
      throw new UserError(msg, err.stack);
    }
  }
}
