const path = require('path');
const { readFileSync } = require('file-system');

const Translator = require('../../src/i18n/translator/translator');
const HandlebarsPreprocessor = require('../../src/handlebars/handlebarspreprocessor');
jest.mock('../../src/i18n/translator/translator')

describe('HandlebarsPreprocessor works correctly', () => {
  Translator.mockImplementation(() => {
    return {
      translate: (phrase) => {
        if (phrase === 'Hello') {
          return 'Bonjour'
        } else if (phrase === 'The man') {
          return 'L\'homme';
        } else if (phrase === '<span class="yext">The dog\'s bone</span>') {
          return '<span class="yext">L\'os du chien</span>';
        } else if (phrase === 'The dog\'s bone') {
          return 'L\'os du chien';
        } else if (phrase === 'The dog.') {
          return 'Le chien.';
        } else if (phrase === 'The: dog') {
          return 'Le: chien';
        } else if (
          phrase === '<a href="https://www.yext.com">View our website [[name]]</a>') {
          return '<a href="https://www.yext.com">Voir notre site web [[name]]</a>';
        } else if (phrase === '[[name]]\'s mail') {
          return '[[name]]\'s mail';
        }
      },
      translateWithContext: (phrase, context) => {
        if (phrase === 'Mail now [[id1]]') {
          return 'Mail maintenant [[id1]]';
        } else if (phrase === 'Person' && context == 'male') {
          return 'L\'homme';
        }
      },
      translatePlural: (phrase) => {
        switch (phrase) {
          case 'Some item [[name]]':
            return {
              0: 'Un article [[name]]',
              1: 'Les articles [[name]]'
            };
          case '<a href="https://www.yext.com">View our website [[name]]</a>':
            return {
              0: '<a href="https://www.yext.com">Voir notre site web [[name]]</a>',
              1: '<a href="https://www.yext.com">Voir nos sites web [[name]]</a>'
            };
          case 'singular':
            return {
              0: 'singular',
              1: 'plural'
            };
        }
      },
      translatePluralWithContext: (phrase, pluralForm, context) => {
        switch (phrase) {
          case 'The [[count]] person went on a walk':
            if (context === 'male') {
              return {
                0: 'Le [[count]] homme est parti en promenade',
                1: 'Les [[count]] Hommes fait une promenade'
              }
            } else if (context === 'female') {
              return {
                0: 'La [[count]] femme a fait une promenade',
                1: 'Les [[count]] femmes fait une promenade'
              }
            }
          case '<a href="https://www.yext.com">View our website [[name]]</a>':
            if (context === 'internet web, not spider web') {
              return {
                0: '<a href="https://www.yext.com">Voir notre site web [[name]]</a>',
                1: '<a href="https://www.yext.com">Voir nos sites web [[name]]</a>'
              }
            }
          case 'The person':
            if (context === 'male') {
              return {
                0: 'L\'homme',
                1: 'Les hommes'
              }
            }
        }
      }
    };
  });
  const translator = new Translator();
  const handlebarsPreprocessor = new HandlebarsPreprocessor(translator);

  it('transpiles all "translate" and "translateJS" invocations in a JS template', () => {
    const rawJsHandlebarsContent = readFileSync(
      path.join(__dirname, '../fixtures/handlebars/rawcomponent.js'), 'utf8');
    const processedJsHandlebarsContent = readFileSync(
      path.join(__dirname, '../fixtures/handlebars/processedcomponent.js'), 'utf8');

    expect(handlebarsPreprocessor.process(rawJsHandlebarsContent))
      .toEqual(processedJsHandlebarsContent);
  });

  it('transpiles all "translate" and "translateJS" invocations in a HBS template', () => {
    const rawHbsHandlebarsContent = readFileSync(
      path.join(__dirname, '../fixtures/handlebars/rawtemplate.hbs'), 'utf8');
    const processedHbsHandlebarsContent = readFileSync(
      path.join(__dirname, '../fixtures/handlebars/processedtemplate.hbs'), 'utf8');

    expect(handlebarsPreprocessor.process(rawHbsHandlebarsContent))
      .toEqual(processedHbsHandlebarsContent);
  });

  it('fails gracefully when trying to process .woff files', () => {
    const woffPath = 
      path.join(__dirname, '../fixtures/handlebars/opensans-regular-webfont.woff');
    const woffContent = readFileSync(woffPath, 'utf8');
    expect(handlebarsPreprocessor.process(woffContent))
      .toEqual(woffContent);
  });
});
