const TranslateInvocation = require('./models/translateinvocation');

/**
 * This class performs preprocessing on partials before they are registered
 * with Handlebars. The preprocessing is applicable to any type of partial
 * used with Jambo.
 */
class PartialPreprocessor {
  constructor(translator) {
    this._translator = translator;
  }

  /**
   * Processes the provided partial, looking for usages of the 'translate'
   * helper. These usages are transpiled into either a translated string or a call
   * to the SDK's run-time translation methods.
   * 
   * @param {string} partial The partial to process.
   * @returns {string} The transpiled partial.
   */
  process(partial) {
    let processedPartial = partial;
    const translateHelperCalls =
      processedPartial.match(/\{\{\stranslate\s.+\}\}/g) || [];

    translateHelperCalls.forEach(call => {
      const translateInvocation = TranslateInvocation.from(call);
      const transpiledCall =
        this._handleTranslateInvocation(translateInvocation);
      processedPartial = processedPartial.replace(call, transpiledCall);
    });

    return processedPartial;
  }

  /**
   * Transpiles a usage of the 'translate' helper. If the translation
   * can be resolved at compile-time (no pluralization or interpolation), the
   * usage will be transpiled to it. Otherwise, it will be transpiled to the
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
        this._translator.translate(invocation.getPhrase);
      translatorResult = `'${translatorResult}'`;
    }
    let interpolationParams = JSON.stringify(invocation.getInterpolationParams());
    interpolationParams = interpolationParams.replace(/[\'\"]/g, '');

    return invocation.canBeTranslatedStatically() ?
        translatorResult :
        `ANSWERS.translateJS(${translatorResult}, ${interpolationParams})`;
  }
}
module.exports = PartialPreprocessor;