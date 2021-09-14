import SitesGenerator from '../../../src/commands/build/sitesgenerator'
import LocalizationConfig from '../../../src/models/localizationconfig';
import path from 'path';
import log from 'npmlog';

const warnSpy = jest.spyOn(log, 'warn').mockImplementation();

describe('_extractCustomTranslations gives warning if file not found', () => {
  const jamboConfig = {
    dirs: {
      themes: '../../',
      config: 'config',
      output: 'public',
      pages: 'pages',
      partials: [
        'script/on-ready.js',
        'cards',
        'directanswercards'
      ],
      preservedFiles: [
        'public/iframe_test.html',
        'public/overlay.html'
      ],
      translations: path.resolve(
        __dirname, '../../fixtures/translations/')
    },
    defaultTheme: 'answers-hitchhiker-theme'
  };

  const config = new LocalizationConfig({
    default: 'en',
    localeConfig: {
      en: {
        // "fallback": [""], // allows you to specify locale fallbacks for this locale
        // "translationFile": "<filepath>.po", // the filepath for the translation file
        experienceKey: 'testkey' //  the unique key of your search configuration for this locale
      },
      fr: {
        // "fallback": [""], // allows you to specify locale fallbacks for this locale
        translationFile: 'fr-FR.po', // the filepath for the translation file
        experienceKey: 'testkey-fr' //  the unique key of your search configuration for this locale
      },
      es: {
        // fallback: ["fr"], // allows you to specify locale fallbacks for this locale
        translationFile: 'dummyFile.po', // the filepath for the translation file
        experienceKey: 'testkey-es' //  the unique key of your search configuration for this locale
      }
    },
    urlFormat: {
      baseLocale: '{locale}/{pageName}.{pageExt}',
      default: '{pageName}.{pageExt}'
    }
  });

  const sg = new SitesGenerator(jamboConfig);

  beforeAll(() => {
    warnSpy.mockClear();
  });

  it('warns when translationFile specified in locale_config is not found', async () => {
    const translations = await sg._extractCustomTranslations(['en', 'es'], config);
    const translationFilePath = path.join(jamboConfig.dirs.translations, 'dummyFile.po');
    expect(log.warn).toHaveBeenLastCalledWith('',
      `Failed to find custom translation file for 'es' at '${translationFilePath}'`
    );
    expect(translations).toEqual({});
  });

  it ('finds translationFile specified in locale_config', async () => {
    const translations = await sg._extractCustomTranslations(['en', 'fr'], config);
    expect(translations['fr']).toBeDefined();
  });
});