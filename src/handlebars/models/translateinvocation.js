const _ = require('lodash');
const Handlebars = require('handlebars');
const UserError = require('../../errors/usererror');

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
   * 'translate' helper, using the Handlebars parser. For more info see:
   * https://github.com/handlebars-lang/handlebars.js/blob/master/docs/compiler-api.md
   *
   * @param {string} invocationString The string in the partial calling 'translate'.
   * @returns {TranslateInvocation} The resulting {@link TranslateInvocation}.
   */
  static from(invocationString) {
    const tree = Handlebars.parse(invocationString);
    if (!tree.body || tree.body.length !== 1) {
      throw new UserError(
        `Error: Could not parse ${invocationString} as a valid translate helper.`, err.stack);
    }
    const invokedHelper = tree.body[0].path.original;
    const hashPairs = tree.body[0].hash.pairs;
    const parsedParams = this._convertHashPairsToParamsMap(hashPairs);
    return new TranslateInvocation(invokedHelper, parsedParams);
  }

  /**
   * Converts an array of Handlebars HashPairs into a map of keys to values.
   * @param {Array<HashPair>} hashPairs 
   * @returns {Object}
   */
  static _convertHashPairsToParamsMap (hashPairs) {
    return hashPairs.reduce((map, pair) => {
      map[pair.key] = pair.value.original;
      return map;
    }, {});
  }
}

module.exports = TranslateInvocation;