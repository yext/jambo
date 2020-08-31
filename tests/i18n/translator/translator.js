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
        1: 'Articles',
        locale: 'fr-FR'
      };

      expect(translation).toEqual(expectedResult);
    });

    it('pluralization with interpolation works as expected', () => {
      const translation = translator.translatePlural(
        'There is [[count]] item [[name]]', 'There are [[count]] items [[name]]');
      const expectedResult = {
        0: 'Il y a [[count]] article [[name]]',
        1: 'Il y a [[count]] articles [[name]]',
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
        1: 'Missing [[count]] translations [[name]]',
        locale: 'en'
      };

      expect(translation).toEqual(expectedResult);
    });
  });

  describe('Translations with context and no pluralization', () => {
    it('context works as expected', () => {
      const translationWithMaleContext = translator.translateWithContext('Child', 'male');
      const translationWithFemaleContext = translator.translateWithContext('Child', 'female');
      expect(translationWithMaleContext).toEqual('fils');
      expect(translationWithFemaleContext).toEqual('fille');
    });

    it('context and interpolation works as expected', () => {
      const translationWithMaleContext = translator.translateWithContext(
        'I am looking for my child named [[name]]', 'male');
      const translationWithFemaleContext = translator.translateWithContext(
        'I am looking for my child named [[name]]', 'female');
      expect(translationWithMaleContext).toEqual('Je cherche mon fils nommé [[name]]')
      expect(translationWithFemaleContext).toEqual('Je cherche mon fille nommé [[name]]')
    });
  });

  describe('Translations with pluralization and context', () => {
    it('Pluralization and context works as expected', () => {
      const translationWithMaleContext = translator.translatePluralWithContext(
        'The person',
        'The people',
        'male');
      const translationWithFemaleContext = translator.translatePluralWithContext(
        'The person',
        'The people',
        'female');
      const expectedResultWithMaleContext = {
        0: 'L\'homme',
        1: 'Les hommes',
        locale: 'fr-FR'
      };
      const expectedResultWithFemaleContext = {
        0: 'La femme',
        1: 'Les femmes',
        locale: 'fr-FR'
      };
      expect(translationWithMaleContext).toEqual(expectedResultWithMaleContext);
      expect(translationWithFemaleContext).toEqual(expectedResultWithFemaleContext);
    });

    it('Pluralization and interpolation works as expected', () => {
      const translationWithMaleContext = translator.translatePluralWithContext(
      'The [[count]] person went on a walk',
        'The [[count]] people went on a walk',
        'male');
      const translationWithFemaleContext = translator.translatePluralWithContext(
        'The [[count]] person went on a walk',
        'The [[count]] people went on a walk',
        'female');
      const expectedResultWithMaleContext = {
        0: 'Le [[count]] homme est parti en promenade',
        1: 'Les [[count]] Hommes fait une promenade',
        locale: 'fr-FR'
      };
      const expectedResultWithFemaleContext = {
        0: 'La [[count]] femme a fait une promenade',
        1: 'Les [[count]] femmes fait une promenade',
        locale: 'fr-FR'
      };
      expect(translationWithMaleContext).toEqual(expectedResultWithMaleContext);
      expect(translationWithFemaleContext).toEqual(expectedResultWithFemaleContext);
    });

    it('Pluralization and interpolation with context works as expected when the translation is not found', () => {
      const translation = translator.translatePluralWithContext(
        'The [[count]] elephant went on a drive',
        'The [[count]] elephants went on a drive',
        'male');
      const expectedResult = {
        0: 'The [[count]] elephant went on a drive',
        1: 'The [[count]] elephants went on a drive',
        locale: 'en'
      };
      expect(translation).toEqual(expectedResult);
    });
  });

  describe('supports text intermixed with HTML', () => {
    it('text with html link', () => {
      const translation = translator.translate('Alternatively, you can<a class="yxt-AlternativeVerticals-universalLink" href=universalUrl>view results across all search categories</a>');
      expect(translation).toEqual('Sinon vous pouvez<a class="yxt-AlternativeVerticals-universalLink" href=universalUrl>afficher les résultats dans toutes les catégories de recherche</a>');
    });

    it('apostrophe inside text and html class with double quotes', () => {
      const translation = translator.translate('<span class="yext">The dog\'s bone</span>');
      expect(translation).toEqual('<span class="yext">L\'os du chien</span>');
    });

    it('apostrophe inside text and html class with double quotes (all inside double quoted string)', () => {
      const translation = translator.translate("<span class=\"yext\">The dog's bone</span>");
      expect(translation).toEqual("<span class=\"yext\">L'os du chien</span>");
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
