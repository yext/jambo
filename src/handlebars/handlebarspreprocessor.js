const TranslateInvocation = require('./models/translateinvocation');
const Handlebars = require('handlebars');

/**
 * This class performs preprocessing on Handlebars content before it is registered
 * with Handlebars. The preprocessing is applicable to any type of Handlebars content
 * used with Jambo.
 */
class HandlebarsPreprocessor {
  constructor(translator) {
    this._translator = translator;
  }

  /**
   * Processes the provided Handlebars content, looking for usages of the 'translate' or
   * 'translateJS' helpers. These usages are transpiled into either a translated
   * string or a call to the SDK's run-time translation methods.
   *
   * @param {string} handlebarsContent The Handlebars content to process.
   * @returns {string} The transpiled Handlebars content.
   */
  process(handlebarsContent) {
    let processedHandlebarsContent = handlebarsContent;
    const translateHelperCalls =
      processedHandlebarsContent.match(/\{\{\s?translate(JS)?\s(.+?)\}\}/g) || [];

    translateHelperCalls.forEach(call => {
      const translateInvocation = TranslateInvocation.from(call);
      const transpiledCall = this._handleTranslateInvocation(translateInvocation);
      processedHandlebarsContent = processedHandlebarsContent.replace(
        call, transpiledCall);
    });

    return processedHandlebarsContent;
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
  _handleTranslateInvocation(invocation) {
    let translatorResult;
    const translationContext = invocation.getContext();
    if (invocation.isUsingPluralization()) {
      translatorResult = translationContext ?
        this._translator.translatePluralWithContext(
          invocation.getPhrase(),
          invocation.getPluralForm(), 
          translationContext):
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
      if (invocation.getInvokedHelper() === 'translateJS' ) {
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

      const translationPairs = Object.entries(translatorResult)
        .reduce((params, [pluralFormIndex, pluralForm], index, array) => {
          const escapedPluralForm = this._escapeSingleQuotes(pluralForm);
          const accumulatedParams = params + `${pluralFormIndex}:'${escapedPluralForm}'`;
          const isLastParam = (index === array.length-1);

          return isLastParam ?
            accumulatedParams :
            accumulatedParams + ',';
        }, '');

      const translations = '{' + translationPairs + '}';

      return `ANSWERS.processTranslation(${translations}, ${parsedParams}, ${count})`;
    }
    const escapedTranslatorResult = this._escapeSingleQuotes(translatorResult);
    return `ANSWERS.processTranslation('${escapedTranslatorResult}', ${parsedParams})`;
  }

  /**
   * Constructs a call to the SDK's Handlebars helper for run-time translation
   * processing. This call is constructed using the translation(s) for a phrase and any
   * interpolation parameters.
   *
   * @param {Object|string} translatorResult The translation(s) for the phrase.
   * @param {Object<string, ?>} interpolationParams The needed interpolation parameters
   *                                                (including 'count').
   * @param {boolean} needsPluralization If pluralization is required when translating.
   * @param {boolean} shouldEscapeHTML If HTML should be escaped. If false, wrap the call
   *                                   in triple curly braces. If true, wrap in in double
   *                                   double curly braces.
   * @returns {string} The call to the 'processTranslation' helper.
   */
  _createRuntimeCallForHBS(
  translatorResult, interpolationParams, needsPluralization, shouldEscapeHTML) {
    const translationString = needsPluralization ?
      Object.entries(translatorResult)
        .reduce((params, [paramName, paramValue]) => {
          paramValue = this._escapeSingleQuotes(paramValue);
          return paramName === 'locale' ?
            params + `locale='${paramValue}' ` :
            params + `pluralForm${paramName}='${paramValue}' `;
        }, '') :
      `phrase='${this._escapeSingleQuotes(translatorResult)}'`;

    const paramsString = Object.entries(interpolationParams)
      .reduce((params, [paramName, paramValue]) => {
        return params + `${paramName}=${paramValue} `;
      }, '');

    return shouldEscapeHTML ?
      `{{ processTranslation ${translationString} ${paramsString}}}` :
      `{{{ processTranslation ${translationString} ${paramsString}}}}`
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
module.exports = HandlebarsPreprocessor;