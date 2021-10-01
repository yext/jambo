import _ from 'lodash';
import Handlebars from 'handlebars';
import UserError from '../../errors/usererror';
import {
  BooleanLiteral,
  HashPair,
  MustacheStatement,
  NumberLiteral,
  NullLiteral,
  PathExpression,
  StringLiteral,
  SubExpression,
  UndefinedLiteral
} from '@handlebars/parser/types/ast';

// An enum representing the different parameter types that can appear when the
// 'translate' or 'translateJS' helpers are invoked.
const ParamTypes = {
  PHRASE: 'phrase',
  PLURAL: 'pluralForm',
  CONTEXT: 'context',
  COUNT: 'count',
  ESCAPE: 'escapeHTML',
  OTHER: 'other'
};
Object.freeze(ParamTypes);

/**
 * A data model representing an invocation of Jambo's 'translate' or 'translateJS'
 * helpers.
 */
class TranslateInvocation {
  _invokedHelper: string;
  _providedParams: Record<string, string>;
  _lineNumber: number;

  constructor(invokedHelper, providedParams, lineNumber) {
    this._invokedHelper = invokedHelper;
    this._providedParams = providedParams;
    this._lineNumber = lineNumber;
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
      param =>
        param === ParamTypes.PHRASE ||
        param === ParamTypes.CONTEXT ||
        param === ParamTypes.ESCAPE);
  }

  /**
   * Returns true if the HTML in the translation should be escaped.
   *
   * @returns {boolean}
   */
  shouldEscapeHTML() {
    return !(this._providedParams[ParamTypes.ESCAPE] === 'false');
  }

  /**
   * Returns which Jambo helper is being invoked: 'translate' or
   * 'translateJS'.
   *
   * @returns {string} The invoked helper.
   */
  getInvokedHelper(): string {
    return this._invokedHelper;
  }

  /**
   * Returns the phrase needing translation.
   *
   * @returns {string} The phrase to be translated.
   */
  getPhrase(): string {
    return this._providedParams[ParamTypes.PHRASE];
  }

  /**
   * Returns the plural form if one exists, otherwise returns undefined.
   *
   * @returns {string|undefined}
   */
  getPluralForm(): string | undefined {
    return this._providedParams[ParamTypes.PLURAL];
  }

  /**
   * Returns any included translation context.
   *
   * @returns {string} The translation context.
   */
  getContext(): string {
    return this._providedParams[ParamTypes.CONTEXT];
  }

  /**
   * Returns the line number of the invocation.
   *
   * @returns {number}
   */
  getLineNumber(): number {
    return this._lineNumber;
  }

  /**
   * Returns any interpolation params included with the invocation.
   *
   * @returns {Object<string, string>} The interpolation params.
   */
  getInterpolationParams(): Record<string, string> {
    const interpParams = _.cloneDeep(this._providedParams);
    const paramsToRemove =
      [ParamTypes.CONTEXT, ParamTypes.PHRASE, ParamTypes.PLURAL, ParamTypes.ESCAPE];
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
  static from(invocationString: string): TranslateInvocation {
    try {
      const tree = Handlebars.parse(invocationString);
      if (tree.body.length !== 1) {
        throw new Error();
      }
      const node = tree.body[0] as MustacheStatement;
      return this.fromMustacheStatementNode(node);
    } catch (err) {
      throw new UserError(
        `Could not parse "${invocationString}" as a valid translate helper.`,
        err.stack);
    }
  }

  /**
   * Creates a {@link TranslateInvocation} from a Handlebars MustacheStatement.
   * @param {MustacheStatement} mustacheStatement
   */
  static fromMustacheStatementNode(mustacheStatement: MustacheStatement): TranslateInvocation {
    const invokedHelper = (mustacheStatement.path as PathExpression).original;
    const hashPairs = mustacheStatement.hash.pairs;
    const parsedParams = this._convertHashPairsToParamsMap(hashPairs);
    const lineNumber = mustacheStatement.loc.start.line;
    return new TranslateInvocation(invokedHelper, parsedParams, lineNumber);
  }

  /**
   * Converts an array of Handlebars HashPair parameters into a map of keys to values.
   * Errors out when given a parameter that is a SubExpression.
   * @param {Array<HashPair>} hashPairs
   * @returns {Object}
   */
  static _convertHashPairsToParamsMap(hashPairs: Array<HashPair>) {
    return hashPairs.reduce((map, pair) => {
      const expression = pair.value as
        NumberLiteral | BooleanLiteral | StringLiteral | NullLiteral | UndefinedLiteral | SubExpression;
      if (expression.type === 'NullLiteral') {
        map[pair.key] = 'null';
      } else if (expression.type === 'UndefinedLiteral') {
        map[pair.key] = 'undefined';
      } else if (expression.type === 'SubExpression') {
        throw new Error();
      } else {
        map[pair.key] = expression.original.toString();
      }
      return map;
    }, {});
  }
}

export default TranslateInvocation;
