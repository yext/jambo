const path = require('path');
const LocalFileParser = require('../../../src/i18n/translationfetchers/localfileparser');
const UserError = require('../../../src/errors/usererror');

describe('LocalFileParser works correctly', () => {
  const translationsPath = path.join(__dirname, '../../fixtures/translations');
  const localFileParser = new LocalFileParser(translationsPath);

  it('translations are parsed and converted into i18next format', () => {
    const englishLink = '<a href="https://www.yext.com">' +
      'View our website [[name]]</a>';
    const frenchLinkSingular = '<a href="https://www.yext.com">' +
      'Voir notre site web [[name]]</a>';
    const frenchLinkPlural = '<a href="https://www.yext.com">' +
      'Voir nos sites web [[name]]</a>';
    const expectedTranslations = {
      Item: 'Article',
      Item_plural: 'Articles',
      'Hello [[name]]': 'Bonjour [[name]]',
      Child_male: 'fils',
      Child_female: 'fille',
      '([[resultsCount]] result)': '([[resultsCount]] résultat)',
      '([[resultsCount]] result)_plural': '([[resultsCount]] résultats)',
      [englishLink]: frenchLinkSingular,
      [`${englishLink}_internet web, not spider web`]: frenchLinkSingular,
      [`${englishLink}_internet web, not spider web_plural`]: frenchLinkPlural,
      [`${englishLink}_plural`]: frenchLinkPlural,
      'There is [[count]] item [[name]]': 'Il y a [[count]] article [[name]]',
      'There is [[count]] item [[name]]_plural': 'Il y a [[count]] articles [[name]]',
      'I am looking for my child named [[name]]_male':
        'Je cherche mon fils nommé [[name]]',
      'I am looking for my child named [[name]]_female':
        'Je cherche mon fille nommé [[name]]',
      'The person_female': 'La femme',
      'The person_female_plural': 'Les femmes',
      'The person_male': 'L\'homme',
      'The person_male_plural': 'Les hommes',
      'The [[count]] person went on a walk_female':
        'La [[count]] femme a fait une promenade',
      'The [[count]] person went on a walk_female_plural':
        'Les [[count]] femmes fait une promenade',
      'The [[count]] person went on a walk_male':
        'Le [[count]] homme est parti en promenade',
      'The [[count]] person went on a walk_male_plural':
        'Les [[count]] Hommes fait une promenade',
      'The dog.': 'Le chien.',
      'The: dog': 'Le: chien'
    };

    return localFileParser.fetch('fr-FR', 'fr-FR.po').then(translations => {
      expect(translations).toStrictEqual(expectedTranslations);
    })
  });

  it('Rejects with an error when no translation file exists for the locale', () => {
    expect(localFileParser.fetch('es', 'es.po')).rejects.toThrow(UserError);
  })
});