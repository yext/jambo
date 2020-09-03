const path = require('path');
const LocalFileParser = require('../../../src/i18n/translationfetchers/localfileparser');

describe('LocalFileParser works correctly', () => {
  const translationsPath = path.join(__dirname, '../../fixtures/translations');
  const localFileParser = new LocalFileParser(translationsPath);

  it('translations are parsed and converted into i18next format', () => {
    const expectedTranslations = {
      Item: 'Article',
      Item_plural: 'Articles',
      'Hello [[name]]': 'Bonjour [[name]]',
      Child_male: 'fils',
      Child_female: 'fille',
      'There is [[count]] item [[name]]': 'Il y a [[count]] article [[name]]',
      'There is [[count]] item [[name]]_plural': 'Il y a [[count]] articles [[name]]',
      'I am looking for my child named [[name]]_male': 'Je cherche mon fils nommé [[name]]',
      'I am looking for my child named [[name]]_female': 'Je cherche mon fille nommé [[name]]',
      'The person_female': 'La femme',
      'The person_female_plural': 'Les femmes',
      'The person_male': 'L\'homme',
      'The person_male_plural': 'Les hommes',
      "The [[count]] person went on a walk_female": "La [[count]] femme a fait une promenade",
      "The [[count]] person went on a walk_female_plural": "Les [[count]] femmes fait une promenade",
      "The [[count]] person went on a walk_male": "Le [[count]] homme est parti en promenade",
      "The [[count]] person went on a walk_male_plural": "Les [[count]] Hommes fait une promenade",
      "The dog.": "Le chien.",
      "The: dog": "Le: chien"
    };

    return localFileParser.fetch('fr-FR').then(translations => {
      expect(translations).toStrictEqual(expectedTranslations);
    })
  });

  it('Rejects with an error when no translation file exists for the locale', () => {
    expect(localFileParser.fetch('es')).rejects.toThrow();
  })
});