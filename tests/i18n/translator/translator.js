const path = require('path');

const LocalFileParser = require('../../../src/i18n/translationfetchers/localfileparser');
const Translator = require('../../../src/i18n/translator/translator');

describe('translations with one plural form (French)', () => {
  let translator;
  beforeAll(async () => {
    const translationsPath = path.join(__dirname, '../../fixtures/translations');
    const localFileParser = new LocalFileParser(translationsPath);

    const frFRTranslations = await localFileParser.fetch('fr-FR');
    const frTranslations = await localFileParser.fetch('fr');
    const translations = {
      'fr': { translation: frTranslations },
      'fr-FR': { translation: frFRTranslations },
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
        translator.translate('Hello [[name]]');
      expect(translation).toEqual('Bonjour [[name]]');
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
        0: 'Article',
        plural: 'Articles',
        locale: 'fr-FR'
      };

      expect(translation).toEqual(expectedResult);
    });

    it('pluralization with interpolation works as expected', () => {
      const translation = translator.translatePlural(
        'There is [[count]] item [[name]]', 'There are [[count]] items [[name]]');
      const expectedResult = {
        0: 'Il y a [[count]] article [[name]]',
        plural: 'Il y a [[count]] articles [[name]]',
        locale: 'fr-FR'
      };

      expect(translation).toEqual(expectedResult);
    });

    it('falls back correctly when no translations present', () => {
      const translation = translator.translatePlural(
        'Missing [[count]] translation [[name]]', 
        'Missing [[count]] translations [[name]]');
      const expectedResult = {
        0: 'Missing [[count]] translation [[name]]',
        plural: 'Missing [[count]] translations [[name]]',
        locale: 'en'
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
        'I am looking for my child named [[name]]', 'male');
      expect(translation).toEqual('Je cherche mon fils nommé [[name]]')
    });

    it('context and interpolation works as expected with context = female', () => {
      const translation = translator.translateWithContext(
        'I am looking for my child named [[name]]', 'female');
      expect(translation).toEqual('Je cherche mon fille nommé [[name]]')
    });
  });
});

describe('translations with multiple plural forms (Lithuanian)', () => {
  let translator;
  beforeAll(async () => {
    const translationsPath = path.join(__dirname, '../../fixtures/translations');
    const localFileParser = new LocalFileParser(translationsPath);

    const ltLT_Translations = await localFileParser.fetch('lt-LT');
    const translations = {
      'lt-LT': { translation: ltLT_Translations }
    }

    translator = await Translator.create('lt-LT', [], translations);
  });

  it('simple pluralization works as expected', () => {
    const translation = translator.translatePlural('Unable to email review', 'Unable to email reviews');
    const expectedResult = {
      0: 'Nepavyksta nusiųsti apžvalgos el. paštu',
      1: 'Nepavyksta nusiųsti apžvalgų el. paštu',
      2: 'Nepavyksta nusiųsti apžvalgų el. paštu',
      locale: 'lt-LT'
    };

    expect(translation).toEqual(expectedResult);
  });

  it('pluralization with interpolation works as expected', () => {
    const translation = translator.translatePlural(
      '1 location selected',
      '[[count]] locations selected]'
    );
    const expectedResult = {
      0: 'Pasirinkta [[count]] tinklalapis',
      1: 'Pasirinkta [[count]] tinklalapiai',
      2: 'Pasirinkta [[count]] tinklalapių',
      locale: 'lt-LT'
    };

    expect(translation).toEqual(expectedResult);
  });
});
