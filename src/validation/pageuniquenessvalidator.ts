import Page from '../models/page';
import UserError from '../errors/usererror';

/**
 * PageUniquenessValidator is responsible for validating whether the given pages
 * are unique.
 */
export default class PageUniquenessValidator {
  /**
   * Runs a set of validation tests on the given pages. Throws an error with a
   * description of the broken validation rule if present.
   *
   * @param {Array<Page>} pages
   * @throws {UserError} Thrown if validation fails
   */
  validate(pages: Array<Page>) {
    if (!pages || pages.length < 1) {
      return;
    }

    this._validatePageNameLocaleCombinations(pages)
    this._validateOutputPaths(pages);
  }

  /**
   * Validates the [pageName, locale] combinations in the given pages. Throws an
   * error with a description of the broken validation rule if present.
   *
   * @param {Array<Page>} pages
   */
  _validatePageNameLocaleCombinations(pages: Array<Page>) {
    const duplicates = this._findDuplicates(
      pages.map(page => `[${page.getName()}, ${page.getLocale()}]`));

    if (duplicates && duplicates.length > 0) {
      throw new UserError(
        'Found duplicate config for the [pageName, locale] combinations: ' +
        duplicates.join(', '));
    }
  }

  /**
   * Validates that there are no conflicting output paths in the given pages.
   * Throws an error with a description of the broken validation rule if present.
   *
   * @param {Array<Page>} pages
   */
  _validateOutputPaths(pages: Array<Page>) {
    const duplicateOutputPaths = this._findDuplicates(
      pages.map(page => page.getOutputPath()));

    if (!duplicateOutputPaths || duplicateOutputPaths.length < 1) {
      return;
    }

    const brokenRuleDescription = [
      'Multiple pages are configured to use the same output path'
    ];
    for (const path of duplicateOutputPaths) {
      const pageNameLocaleCombinations = pages
        .filter(page => page.getOutputPath() === path)
        .map(page => `[${page.getName()}, ${page.getLocale()}]`)
        .join(' and ');

      brokenRuleDescription.push(
        `\tPages ${pageNameLocaleCombinations} are configured to ` +
        `use output path '${path}'`);
    }

    throw new UserError(brokenRuleDescription.join('\n'));
  }

  /**
   * Finds and returns duplicate strings in an array
   *
   * @param {string[]} values
   * @returns {string[]} duplicates
   */
  _findDuplicates(values: string[]) {
    const valueToCount = values.reduce((accumulator, value) => ({
      ...accumulator,
      [value]: (accumulator[value] || 0) + 1
    }), {});

    return Object.keys(valueToCount).filter((value) => valueToCount[value] > 1);
  }
}