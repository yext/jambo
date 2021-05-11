const Handlebars = require('handlebars');

/**
 * InvocationTranspiler is responsible for taking an instance of
 * {@link TranslateInvocation}, and changing it into a static translation,
 * if possible, or a runtime translation helper if not.
 */
class InvocationTranspiler {
  constructor(translator) {
    /**
     * @type {Translator}
     */
    this._translator = translator;
  }

  /**
   * Transpiles a usage of the 'translate' or 'translateJS' helper. If the
   * translation can be resolved at compile-time (no pluralization or interpolation),
   * the usage will be transpiled to it. Otherwise, it will be transpiled to the
   * appropriate call to the SDK's run-time translation method.
   *
   * @param {TranslateInvocation} invocation The {@link TranslateInvocation}
   *                                         representaiton of the usage.
   * @returns {string} The transpiled result.
   */
  transpile(invocation) {
    let translatorResult;
    const translationContext = invocation.getContext();
    if (invocation.isUsingPluralization()) {
      translatorResult = translationContext ?
        this._translator.translatePluralWithContext(
          invocation.getPhrase(),
          invocation.getPluralForm(),
          translationContext) :
        this._translator.translatePlural(
          invocation.getPhrase(),
          invocation.getPluralForm());
    } else {
      translatorResult = translationContext ?
        this._translator.translateWithContext(
          invocation.getPhrase(), translationContext) :
        this._translator.translate(invocation.getPhrase());
    }

    if (invocation.canBeTranslatedStatically()) {
      if (invocation.getInvokedHelper() === 'translateJS') {
        const escapedTranslatorResult = this._escapeSingleQuotes(translatorResult);
        return `'${escapedTranslatorResult}'`;
      }

      if (invocation.shouldEscapeHTML()) {
        return Handlebars.Utils.escapeExpression(translatorResult);
      }

      return translatorResult;
    }
    const interpParams = invocation.getInterpolationParams();

    return invocation.getInvokedHelper() === 'translateJS' ?
      this._createRuntimeCallForJS(
        translatorResult,
        interpParams,
        invocation.isUsingPluralization()) :
      this._createRuntimeCallForHBS(
        translatorResult,
        interpParams,
        invocation.isUsingPluralization(),
        invocation.shouldEscapeHTML());
  }

  /**
   * Constructs a call to the SDK's Javascript method for run-time translation
   * processing. This call is constructed using the translation(s) for a phrase and any
   * interpolation parameters.
   *
   * @param {Object|string} translatorResult The translation(s) for the phrase.
   * @param {Object<string, ?>} interpolationParams The needed interpolation parameters
   *                                                (including 'count').
   * @param {boolean} needsPluralization If pluralization is required when translating.
   * @returns {string} The call to ANSWERS.processTranslation.
   */
   _createRuntimeCallForJS(translatorResult, interpolationParams, needsPluralization) {
    let parsedParams = JSON.stringify(interpolationParams);
    parsedParams = parsedParams.replace(/[\'\"]/g, '');

    if (needsPluralization) {
      const count = interpolationParams.count;
      const pluralForms = this._getFormattedPluralForms(translatorResult);

      return `ANSWERS.processTranslation(${pluralForms}, ${parsedParams}, ${count})`;
    }
    const escapedTranslatorResult = this._escapeSingleQuotes(translatorResult);

    return `ANSWERS.processTranslation('${escapedTranslatorResult}', ${parsedParams})`;
  }


  /**
   * Constructs a string representation of a translatorResult Object. This output is
   * similar to JSON.stringiy(), however keys are not surrounded by quotes, and values
   * are surrounded by single quotes.
   * 
   * @param {Object<number,string>} translatorResult 
   * @returns {string}
   */
   _getFormattedPluralForms(translatorResult) {
    const pluralFormPairs = Object.entries(translatorResult)
        .reduce((params, [pluralFormIndex, pluralForm], index, array) => {
          const escapedPluralForm = this._escapeSingleQuotes(pluralForm);
          const accumulatedParams = params + `${pluralFormIndex}:'${escapedPluralForm}'`;
          const isLastParam = (index === array.length-1);

          return isLastParam ?
            accumulatedParams :
            accumulatedParams + ',';
        }, '');

      return '{' + pluralFormPairs + '}';
  }

  /**
   * Constructs a call to the SDK's Handlebars helper for run-time translation
   * processing. This call is constructed using the translation(s) for a phrase and any
   * interpolation parameters.
   *
   * @param {Object|string} translatorResult The translation(s) for the phrase.
   * @param {Object<string, ?>} interpolationValues The needed interpolation parameters
   *                                                (including 'count').
   * @param {boolean} needsPluralization If pluralization is required when translating.
   * @param {boolean} shouldEscapeHTML If HTML should be escaped. If false, wrap the call
   *                                   in triple curly braces. If true, wrap in in double
   *                                   double curly braces.
   * @returns {string} The call to the 'processTranslation' helper.
   */
   _createRuntimeCallForHBS(
    translatorResult, 
    interpolationValues, 
    needsPluralization, 
    shouldEscapeHTML) 
  {
    const translationParams = needsPluralization ?
      Object.entries(translatorResult)
        .reduce((params, [paramName, paramValue]) => {
          paramValue = this._escapeSingleQuotes(paramValue);
            return params + `pluralForm${paramName}='${paramValue}' `;
        }, '') :
      `phrase='${this._escapeSingleQuotes(translatorResult)}'`;

    const interpolationParams = Object.entries(interpolationValues)
      .reduce((params, [paramName, paramValue]) => {
        return params + `${paramName}=${paramValue} `;
      }, '');

    return shouldEscapeHTML ?
      `{{ processTranslation ${translationParams} ${interpolationParams}}}` :
      `{{{ processTranslation ${translationParams} ${interpolationParams}}}}`
  }

  /**
   * Escape single quotes in the string
   * @param {string} str
   *
   * @returns {string}
   */
   _escapeSingleQuotes(str) {
    const regex = new RegExp('\'', 'g');
    return str.replace(regex, '\\\'');
  }
}
module.exports = InvocationTranspiler;