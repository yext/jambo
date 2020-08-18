const _ = require('lodash');

// An enum representing the different parameter types that can appear when the
// 'translate' or 'translateJS' helpers are invoked.
const ParamTypes = {
  PHRASE: 'phrase',
  PLURAL: 'pluralForm',
  CONTEXT: 'context',
  COUNT: 'count',
  OTHER: 'other'
}
Object.freeze(ParamTypes);

/**
 * A data model representing an invocation of Jambo's 'translate' or 'translateJS'
 * helpers.
 */
class TranslateInvocation {
  constructor(invokedHelper, providedParams) {
    this._invokedHelper = invokedHelper;
    this._providedParams = providedParams;
  }

  /**
   * Whether or not this invocation requires pluralization.
   * 
   * @returns {boolean}
   */
  isUsingPluralization() {
    return this._providedParams.hasOwnProperty(ParamTypes.PLURAL);
  }

  /**
   * If the translation requested by the invocation can be resolved at
   * compile-time. This is true if no pluralization or interpolation is
   * requested.
   * 
   * @returns {boolean}
   */
  canBeTranslatedStatically() {
    return Object.keys(this._providedParams).every(
      param => param === ParamTypes.PHRASE || param === ParamTypes.CONTEXT);
  }

  /**
   * Returns which Jambo helper is being invoked: 'translate' or
   * 'translateJS'.
   * 
   * @returns {string} The invoked helper.
   */
  getInvokedHelper() {
    return this._invokedHelper;
  }

  /**
   * Returns the phrase needing translation.
   * 
   * @returns {string} The phrase to be translated.
   */
  getPhrase() {
    return this._providedParams[ParamTypes.PHRASE];
  }

  /**
   * Returns any included translation context.
   * 
   * @returns {string} The translation context.
   */
  getContext() {
    return this._providedParams[ParamTypes.CONTEXT];
  }

  /**
   * Returns any interpolation params included with the invocation. 
   * 
   * @returns {Object<string, string>} The interpolation params.
   */
  getInterpolationParams() {
    const interpParams = _.cloneDeep(this._providedParams);
    const paramsToRemove =
      [ParamTypes.CONTEXT, ParamTypes.PHRASE, ParamTypes.PLURAL];
    paramsToRemove.forEach(param => delete interpParams[param]);

    return interpParams;
  }

  /**
   * Creates a {@link TranslateInvocation} from a partial's call to Jambo's
   * 'translate' helper.
   *
   * @param {string} invocationString The string in the partial calling 'translate'.
   * @returns {TranslateInvocation} The resulting {@link TranslateInvocation}.
   */
  static from(invocationString) {
    const invokedHelper =
      invocationString.includes('translateJS') ? 'translateJS' : 'translate';

    const paramRegex =
      /[a-zA-z0-9]+=((\'[a-zA-Z\s\d\[\]\.]+\')|\d+|([a-zA-Z\.]+))/g;
    const parsedParams = (invocationString.match(paramRegex) || [])
      .reduce((params, paramString) => {
        const paramOperands = paramString.split('=');
        const paramName = paramOperands[0];
        const paramValue = paramOperands[1];
        params[paramName] = paramValue;
        return params;
      }, {});

    return new TranslateInvocation(invokedHelper, parsedParams);
  }
}

module.exports = TranslateInvocation;