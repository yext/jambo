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
      translator.translate('Hello {{name}}');
    expect(translation).toEqual('Bonjour {{name}}');
  });

  it('translation fallback works as expected', () => {
    const translation = translator.translate('Breakfast');
    expect(translation).toEqual('Petit Déjeuner');
  });
});

describe('Translations with pluralization and no context', () => {
  it('simple pluralization works as expected', () => {
    const translation = translator.translatePlural('Item', 'Items');
    const expectedResult = {
      1: 'Article',
      plural: 'Articles'
    };

    expect(translation).toEqual(expectedResult);
  });

  it('pluralization with interpolation works as expected', () => {
    const translation = translator.translatePlural(
      'There is {{count}} item {{name}}', 'There are {{count}} items {{name}}');
    const expectedResult = {
      1: 'Il y a {{count}} article {{name}}',
      plural: 'Il y a {{count}} articles {{name}}'
    };

    expect(translation).toEqual(expectedResult);
  });

  it('falls back correctly when no translations present', () => {
    const translation = translator.translatePlural(
      'Missing {{count}} translation {{name}}', 
      'Missing {{count}} translations {{name}}');
    const expectedResult = {
      1: 'Missing {{count}} translation {{name}}',
      plural: 'Missing {{count}} translations {{name}}'
    };

    expect(translation).toEqual(expectedResult);
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
      'I am looking for my child named {{name}}', 'male');
    expect(translation).toEqual('Je cherche mon fils nommé {{name}}')
  });

  it('context and interpolation works as expected with context = female', () => {
    const translation = translator.translateWithContext(
      'I am looking for my child named {{name}}', 'female');
    expect(translation).toEqual('Je cherche mon fille nommé {{name}}')
  });
});