import TranslationExtractor from '../../i18n/extractor/translationextractor';
import { ArgumentMetadata, ArgumentType } from '../../models/commands/argumentmetadata';
import { info } from '../../utils/logger';
import DefaultTranslationGlobber from './defaulttranslationglobber';
import { readGitignorePaths } from '../../utils/gitutils';
import { JamboConfig } from '../../models/JamboConfig';
import Command from '../../models/commands/command';

/**
 * JamboTranslationExtractor extracts translations from a jambo repo.
 */
const JamboTranslationExtractor : Command = class {
  static alias = 'extract-translations';
  static shortDescription = 'extract translated strings from .hbs and .js files';
  static args: Record<string, ArgumentMetadata> = {
    globs: {
      describeName: 'Globs to Scan',
      type: ArgumentType.ARRAY,
      description:
        'specify globs to scan for translations, instead of using the defaults',
      isRequired: false
    },
    output: {
      describeName: 'Output Path',
      type: ArgumentType.STRING,
      description: 'the output path to extract the .pot file to',
      isRequired: false,
      defaultValue: 'messages.pot'
    }
  };
  jamboConfig: JamboConfig
  extractor: TranslationExtractor
  
  constructor(jamboConfig) {
    this.jamboConfig = jamboConfig;
    this.extractor = new TranslationExtractor();
  }

  static describe() {
    return {
      displayName: 'Extract Translations',
      params: Object.keys(this.args).reduce((params, alias) => {
        params[alias] = {
          displayName: this.args[alias].describeName,
          type: this.args[alias].type,
          required: this.args[alias].isRequired,
          default: this.args[alias].defaultValue,

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
