const registerCustomHbsHelpers = require('../../src/handlebars/registercustomhbshelpers');
const path = require('path');

const hbs = require('handlebars');
const pathToHelpers = path.resolve(__dirname, '../fixtures/handlebars/customhelpers');
registerCustomHbsHelpers(hbs, pathToHelpers)

describe('can register a custom hbs helper', () => {
  it('recognizes https://yext.com as absolute', () => {
    const template = hbs.compile('{{#if (isNonRelativeUrl url)}}is absolute!{{/if}}');
    const data = {
      url: 'https://yext.com'
    };
    expect(template(data)).toEqual('is absolute!');
  });

  it('recognizes relative urls', () => {
    const template =
      hbs.compile('{{#unless (isNonRelativeUrl url)}}is NOT absolute{{/unless}}');
    const data = {
      url: './index.html'
    };
    expect(template(data)).toEqual('is NOT absolute');
  });
});

it('registers baked-in hbs helpers + isNonRelativeUrl', () => {
  const expectedHelpers = [
    'blockHelperMissing',
    'each',
    'helperMissing',
    'if',
    'unless',
    'log',
    'lookup',
    'with',
    'isNonRelativeUrl'
  ];
  expect(Object.keys(hbs.helpers)).toEqual(expectedHelpers);
})

it('does not register helpers in subfolders', () => {
  expect(Object.keys(hbs.helpers)).toEqual(
    expect.not.arrayContaining(['dontRegisterMe']));
});