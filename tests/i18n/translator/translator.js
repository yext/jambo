const path = require('path');

const LocalFileParser = require('../../../src/i18n/translationfetchers/localfileparser');
const Translator = require('../../../src/i18n/translator/translator');

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
});

describe('Translations without pluralization or context', () => {
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

describe('Translations with pluralization and no context', () => {
  it('simple pluralization works as expected', () => {
    const translation = translator.translatePlural('Item', 'Items', 2);
    expect(translation).toEqual('Articles');
  });

  it('pluralization and interpolation works as expected', () => {
    const translation = translator.translatePlural(
      'There is {{count}} item {{name}}', 
      'There are {{count}} items {{name}}', 
      2, 
      { name: 'Tom' });
    expect(translation).toEqual('Il y a 2 articles Tom')
  });

  it('falls back correctly when count is unity', () => {
    const translation = translator.translatePlural(
      'Missing {{count}} translation', 
      'Missing {{count}} translations', 
      1);
    expect(translation).toEqual('Missing 1 translation');
  });

  it('falls back correctly when count is not unity', () => {
    const translation = translator.translatePlural(
      'Missing {{count}} translation {{name}}', 
      'Missing {{count}} translations {{name}}', 
      2,
      { name: 'Tom' });
    expect(translation).toEqual('Missing 2 translations Tom');
  });
});

describe('Translations with context and no pluralization', () => {
  it('context works as expected with context = male', () => {
    const translation = translator.translateWithContext('Child', 'male');
    expect(translation).toEqual('fils');
  });

  it('context works as expected with context = female', () => {
    const translation = translator.translateWithContext('Child', 'female');
    expect(translation).toEqual('fille');
  });

  it('context and interpolation works as expected with context = male', () => {
    const translation = translator.translateWithContext(
      'I am looking for my child named {{name}}', 
      'male', 
      { name: 'Sam' });
    expect(translation).toEqual('Je cherche mon fils nommé Sam')
  });

  it('context and interpolation works as expected with context = female', () => {
    const translation = translator.translateWithContext(
      'I am looking for my child named {{name}}', 
      'female', 
      { name: 'Sam' });
    expect(translation).toEqual('Je cherche mon fille nommé Sam')
  });
});