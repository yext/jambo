import TranslationExtractor from '../../i18n/extractor/translationextractor';
import { ArgumentMetadata } from '../../models/commands/argumentmetadata';
import { info } from '../../utils/logger';
import DefaultTranslationGlobber from './defaulttranslationglobber';
import { readGitignorePaths } from '../../utils/gitutils';
import { JamboConfig } from '../../models/JamboConfig';
import Command from '../../models/commands/command';

/**
 * JamboTranslationExtractor extracts translations from a jambo repo.
 */
const JamboTranslationExtractor : Command = class {
  static getAlias() {
    return 'extract-translations';
  }

  static getShortDescription() {
    return 'extract translated strings from .hbs and .js files';
  }

  static args() {
    return {
      globs: new ArgumentMetadata({
        displayName: 'Globs to Scan',
        type: 'array',
        description:
          'specify globs to scan for translations, instead of using the defaults',
        isRequired: false
      }),
      output: new ArgumentMetadata({
        displayName: 'Output Path',
        type: 'string',
        description: 'the output path to extract the .pot file to',
        isRequired: false,
        defaultValue: 'messages.pot'
      })
    };
  }
  jamboConfig: JamboConfig
  extractor: TranslationExtractor
  
  constructor(jamboConfig) {
    this.jamboConfig = jamboConfig;
    this.extractor = new TranslationExtractor();
  }

  static describe() {
    const args = this.args();
    return {
      displayName: 'Extract Translations',
      params: Object.keys(args).reduce((params, alias) => {
        params[alias] = {
          displayName: args[alias].getDisplayName(),
          type: args[alias].getType(),
          required: args[alias].isRequired(),
          default: args[alias].defaultValue(),
        }
        return params;
      }, {})
    };
  }

  execute({ output, globs }) {
    if (globs && globs.length > 0) {
      this._extract(output, globs);
    } else {
      const gitignorePaths = readGitignorePaths();
      const defaultGlobber = new DefaultTranslationGlobber(
        this.jamboConfig.dirs, gitignorePaths);
      const defaultGlobs = defaultGlobber.getGlobs();
      this._extract(output, defaultGlobs);
    }
  }

  /**
   * Extracts i18n strings from a jambo repo to a designed output file.
   *
   * @param {string} outputPath
   * @param {string[]} globs
   */
  _extract(outputPath: string, globs: string[]) {
    info(`Extracting translations to ${outputPath}`);
    this.extractor.extract(globs);
    this.extractor.savePotFile(outputPath);
  }
}

export default JamboTranslationExtractor;
