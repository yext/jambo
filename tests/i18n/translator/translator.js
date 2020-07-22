const path = require('path');

const LocalFileParser = require('../../../src/i18n/translationfetchers/localfileparser');
const Translator = require('../../../src/i18n/translator/translator');

describe('Translator works correctly', () => {
  let translator;
  beforeAll(async () => {
    const translationsPath = path.join(__dirname, '../../fixtures/translations');
    const localFileParser = new LocalFileParser(translationsPath);

    const frFRTranslations = await localFileParser.fetch('fr-FR');
    const frTranslations = await localFileParser.fetch('fr');
    const translations = {
      'fr': { translation: frTranslations },
      'fr-FR': { translation: frFRTranslations }
    }

    translator = await Translator.create('fr-FR', ['fr'], translations);
  })

  it('simple translation works as expected', () => {
    const translation = translator.translate('Item');
    expect(translation).toEqual('Article');
  });

  it('simple translation with interpolation works as expected', () => {
    const translation = 
      translator.translate('Hello {{name}}', { name: 'Tom' });
    expect(translation).toEqual('Bonjour Tom');
  });

  it('translation fallback works as expected', () => {
    const translation = translator.translate('Breakfast');
    expect(translation).toEqual('Petit Déjeuner');
  });
});