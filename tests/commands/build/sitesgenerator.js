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
        // "translationFile": "<filepath>.po", // the filepath for the translation file
        experienceKey: 'testkey-fr' //  the unique key of your search configuration for this locale
      },
      es: {
        // fallback: ["fr"], // allows you to specify locale fallbacks for this locale
        translationFile: 'dummyFile.po', // the filepath for the translation file
        experienceKey: 'testkey-es' //  the unique key of your search configuration for this locale
      },
      jp: {
        // "fallback": [""], // allows you to specify locale fallbacks for this locale
        // "translationFile": "<filepath>.po", // the filepath for the translation file
        experienceKey: 'testkey-jp' //  the unique key of your search configuration for this locale
      },
      lt: {
        // "fallback": [""], // allows you to specify locale fallbacks for this locale
        translationFile: 'lt-LT.po', // the filepath for the translation file
        experienceKey: 'testkey-lt' //  the unique key of your search configuration for this locale
      },
    },
    urlFormat: {
      baseLocale: '{locale}/{pageName}.{pageExt}',
      default: '{pageName}.{pageExt}'
    }
  });

  const sg = new SitesGenerator(jamboConfig);

  beforeEach(() => {
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

  it('warns when default translationFile is not found', async () => {
    const translations = await sg._extractCustomTranslations(['jp'], config);
    const translationFilePath = path.join(jamboConfig.dirs.translations, 'jp.po');
    expect(log.warn).toHaveBeenLastCalledWith('',
      `Failed to find custom translation file for 'jp' at '${translationFilePath}'`
    );
    expect(translations).toEqual({});
  });

  it ('finds translationFile specified in locale_config', async () => {
    const translations = await sg._extractCustomTranslations(['lt'], config);
    expect(translations['lt']).toBeDefined();
  });

  it ('finds default translationFile', async () => {
    const translations = await sg._extractCustomTranslations(['en', 'fr'], config);
    expect(translations['fr']).toBeDefined();
  });
});


describe('_extractThemeTranslations gives warning if file not found', () => {
  const jamboConfig = {
    dirs: {
      themes: path.resolve(
        __dirname, '../../'),
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
      ]
    },
    defaultTheme: 'fixtures'
  };

  const sg = new SitesGenerator(jamboConfig);

  beforeEach(() => {
    warnSpy.mockClear();
  });

  it('warns when theme translationFile is not found', async () => {
    const translations = await sg._extractThemeTranslations(['en', 'es', 'fr']);
    const themeTranslationsDir =
      `${jamboConfig.dirs.themes}/${jamboConfig.defaultTheme}/translations`;
    const translationFilePath = path.join(themeTranslationsDir, 'es.po');
    expect(log.warn).toHaveBeenLastCalledWith('',
      `Failed to find theme translation file for 'es' at '${translationFilePath}'`
    );
    expect(translations['es']).toBeUndefined();
    expect(translations['fr']).toBeDefined();
  });
});