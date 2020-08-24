const Page = require("../../models/page");
const UserError = require("../../errors/usererror");

/**
 * PageUniquenessValidator is responsible for validating whether the given pages are unique.
 */
module.exports = class PageUniquenessValidator {
  /**
   * Runs a set of validation tests on the given pages. Throws an error with a description of the
   * broken validation rule if present.
   *
   * @param {Array<Page>} pages
   */
  validate(pages) {
    if (!pages || pages.length < 1) {
      return;
    }
    const brokenValidationRule = this._validatePageNameLocaleCombinations(pages)
      || this._validateOutputPaths(pages);

    if (brokenValidationRule) {
      throw new UserError(brokenValidationRule);
    }
  }

  /**
   * Validates the [pageName, locale] combinations in the given pages. Returns a description of the
   * broken validation rule if present.
   *
   * @param {Array<Page>} pages
   * @returns {String}
   */
  _validatePageNameLocaleCombinations(pages) {
    const duplicates = this._findDuplicates(
      pages.map(page => `[${page.getName()}, ${page.getLocale()}]`));

    if (duplicates && duplicates.length > 0) {
      return `Found duplicate config for the [pageName, locale] combinations: ${duplicates.join(', ')}`;
    }
  }

  /**
   * Validates that there are no conflicting output paths in the given pages. Returns a description
   * of the broken validation rule if present.
   *
   * @param {Array<Page>} pages
   * @returns {String}
   */
  _validateOutputPaths(pages) {
    const duplicateOutputPaths = this._findDuplicates(pages.map(page => page.getOutputPath()));

    if (!duplicateOutputPaths || duplicateOutputPaths.length < 1) {
      return;
    }

    let brokenRuleDescription = ['Multiple pages are configured to use the same output path'];
    for (const path of duplicateOutputPaths) {
      const pageNameLocaleCombinations = pages
        .filter(page => page.getOutputPath() === path)
        .map(page => `[${page.getName()}, ${page.getLocale()}]`)
        .join(' and ');

      brokenRuleDescription.push(`\tPages ${pageNameLocaleCombinations} are configured to use output path '${path}'`);
    };

    return brokenRuleDescription.join('\n');
  }

  /**
   * Finds and returns duplicate strings in an array
   *
   * @param {Array<string>} values
   * @returns {Array<string>} duplicates
   */
  _findDuplicates(values) {
    const valueToCount = values.reduce((accumulator, value) => ({
      ...accumulator,
      [value]: (accumulator[value] || 0) + 1
    }), {});

    return Object.keys(valueToCount).filter((value) => valueToCount[value] > 1);
  }
}