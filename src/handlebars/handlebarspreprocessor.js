const TranslateInvocation = require('./models/translateinvocation');

/**
 * This class performs preprocessing on templates before they are registered
 * with Handlebars. The preprocessing is applicable to any type of template
 * used with Jambo.
 */
class HandlebarsPreprocessor {
  constructor(translator) {
    this._translator = translator;
  }

  /**
   * Processes the provided template, looking for usages of the 'translate' or
   * 'translateJS' helpers. These usages are transpiled into either a translated
   * string or a call to the SDK's run-time translation methods.
   *
   * @param {string} template The template to process.
   * @returns {string} The transpiled template.
   */
  process(template) {
    let processedTemplate = template;
    const translateHelperCalls =
      processedTemplate.match(/\{\{\s?translate(JS)?\s.+\}\}/g) || [];

    translateHelperCalls.forEach(call => {
      const translateInvocation = TranslateInvocation.from(call);
      const transpiledCall =
        this._handleTranslateInvocation(translateInvocation);
      processedTemplate = processedTemplate.replace(call, transpiledCall);
    });

    return processedTemplate;
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
    if (invocation.isUsingPluralization()) {
      translatorResult = JSON.stringify(
        this._translator.translatePlural(invocation.getPhrase()));
    } else {
      const translationContext = invocation.getContext();
      translatorResult = translationContext ?
        this._translator.translateWithContext(
          invocation.getPhrase(), translationContext) :
        this._translator.translate(invocation.getPhrase());
    }
    translatorResult = `'${translatorResult}'`;

    if (invocation.canBeTranslatedStatically()) {
      return translatorResult;
    }
    const interpParams = invocation.getInterpolationParams();

    return invocation.getInvokedHelper() === 'translateJS' ?
        this._createRuntimeCallForJS(
          translatorResult,
          interpParams,
          invocation.isUsingPluralization()) :
        this._createRuntimeCallForHBS(translatorResult, interpParams);
  }

  /**
   * Constructs a call to the SDK's Javascript method for run-time translation.
   * This call is constructed using the translation(s) for a phrase and any interpolation
   * paramters.
   *
   * @param {Object|string} translatorResult The translation(s) for the phrase.
   * @param {boolean} needsPluralization If pluralization is required when translating.
   * @param {Object<string, ?>} interpolationParams The needed interpolation parameters
   *                                                (including 'count').
   * @returns {string} The string-ified call to ANSWERS.translateJS.
   */
  _createRuntimeCallForJS(translatorResult, interpolationParams, needsPluralization) {
    let parsedParams = JSON.stringify(interpolationParams);
    parsedParams = parsedParams.replace(/[\'\"]/g, '');

    if (needsPluralization) {
      const count = interpolationParams.count;
      return `ANSWERS.translateJS(${translatorResult}, ${parsedParams}, ${count})`;
    }

    return `ANSWERS.translateJS(${translatorResult}, ${parsedParams})`;
  }

  /**
   * Constructs a call to the SDK's Handlebars helper for run-time translation.
   * This call is constructed using the translation(s) for a phrase and any interpolation
   * paramters.
   *
   * @param {Object|string} translatorResult The translation(s) for the phrase.
   * @param {Object<string, ?>} interpolationParams The needed interpolation parameters
   *                                                (including 'count').
   * @returns {string} The string-ified call to the 'runtimeTranslation' helper.
   */
  _createRuntimeCallForHBS(translatorResult, interpolationParams) {
    const paramsString = Object.entries(interpolationParams)
      .reduce((params, [paramName, paramValue]) => {
        return params + `${paramName}=${paramValue} `;
      }, '');

    return `{{ runtimeTranslation phrase=${translatorResult} ${paramsString}}}`;
  }
}
module.exports = HandlebarsPreprocessor;