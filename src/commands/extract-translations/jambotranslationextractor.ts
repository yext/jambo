import TranslationExtractor from '../../i18n/extractor/translationextractor';
import { info } from '../../utils/logger';
import DefaultTranslationGlobber from './defaulttranslationglobber';
import { readGitignorePaths } from '../../utils/gitutils';
import { JamboConfig } from '../../models/JamboConfig';
import Command from '../../models/commands/Command';
import { StringArrayMetadata, StringMetadata } from '../../models/commands/concreteargumentmetadata';
import DescribeMetadata from '../../models/commands/DescribeMetadata';

const args = {
  globs: new StringArrayMetadata({
    description:
      'specify globs to scan for translations, instead of using the defaults',
    isRequired: false
  }),
  output: new StringMetadata({
    description: 'the output path to extract the .pot file to',
    isRequired: false,
    defaultValue: 'messages.pot'
  })
};

/**
 * JamboTranslationExtractor extracts translations from a jambo repo.
 */
const JamboTranslationExtractor: Command<typeof args> = class {
  jamboConfig: JamboConfig
  extractor: TranslationExtractor

  constructor(jamboConfig) {
    this.jamboConfig = jamboConfig;
    this.extractor = new TranslationExtractor();
  }

  static getAlias() {
    return 'extract-translations';
  }

  static getShortDescription() {
    return 'extract translated strings from .hbs and .js files';
  }

  static args() {
    return args;
  }

  static describe(): DescribeMetadata<typeof args> {
    return {
      displayName: 'Extract Translations',
      params: {
        globs: {
          displayName: 'Globs to Scan',
        },
        output: {
          displayName: 'Output Path',
        }
      }
    };
  }

  execute({ output, globs }: { output: string, globs: string[] }) {
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