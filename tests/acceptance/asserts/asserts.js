const assert = require('assert').strict;
const prettier = require('prettier');

const asserts = { ...assert };

/**
 * Asserts that two html strings are equal.
 *
 * @param {string} actualHtml 
 * @param {string} expectedHtml 
 */
asserts.isEqualHtml = function(actualHtml, expectedHtml) {
  const normalize = html => {
    return prettier.format(html, { parser: 'html' });
  };
  assert.strictEqual(normalize(actualHtml), normalize(expectedHtml));
}

module.exports = asserts;