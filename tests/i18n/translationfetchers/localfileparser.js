const path = require('path');
const LocalFileParser = require('../../../src/i18n/translationfetchers/localfileparser');

describe('LocalFileParser works correctly', () => {
  const translationsPath = path.join(__dirname, '../../fixtures/translations');
  const localFileParser = new LocalFileParser(translationsPath);

  it('translations are parsed and converted into i18next format', () => {
    const expectedTranslations = {
      Item: 'Article',
      Item_plural: 'Articles',
      'Hello {{name}}': 'Bonjour {{name}}',
      Child_male: 'fils',
      Child_female: 'fille',
      'There is {{count}} item {{name}}': 'Il y a {{count}} article {{name}}',
      'There is {{count}} item {{name}}_plural': 'Il y a {{count}} articles {{name}}',
    };

    return localFileParser.fetch('fr-FR').then(translations => {
      expect(translations).toStrictEqual(expectedTranslations);
    })
  });

  it('works correctly when no translation file exists for the locale', () => {
    return localFileParser.fetch('es').then(translations => {
      expect(translations).toEqual({});
    })
  })
});