const path = require('path');
const LocalFileParser = require('../../../src/i18n/translationfetchers/localfileparser');

describe('LocalFileParser works correctly', () => {
    it('translations are parsed and converted into i18next format', () => {
        const translationsPath = path.join(__dirname, '../../fixtures/translations');
        const localFileParser = new LocalFileParser(translationsPath);

        const expectedTranslations = {
            Item: 'Article',
            Item_plural: 'Articles',
            Hello: 'Bonjour',
            Child_male: 'fils',
            Child_female: 'fille'
        };

        return localFileParser.fetch('fr-FR').then(translations => {
            expect(translations).toStrictEqual(expectedTranslations);
        })
    });
});