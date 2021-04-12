const TranslateInvocation = require('./models/translateinvocation');
const InvocationTranspiler = require('./invocationtranspiler');
/**
 * This class performs preprocessing on Handlebars content before it is registered
 * with Handlebars. The preprocessing is applicable to any type of Handlebars content
 * used with Jambo.
 */
class HandlebarsPreprocessor {
  constructor(translator) {
    this._invocationTranspiler = new InvocationTranspiler(translator);
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
      const transpiledCall = this._invocationTranspiler.transpile(translateInvocation);
      processedHandlebarsContent = processedHandlebarsContent.replace(
        call, transpiledCall);
    });

    return processedHandlebarsContent;
  }
}
module.exports = HandlebarsPreprocessor;