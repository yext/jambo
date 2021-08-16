import { ArgumentMetadata, ArgumentType } from '../../models/commands/argumentmetadata';
import UserError from '../../errors/usererror';
import { isCustomError } from '../../utils/errorutils';

/**
 * BuildCommand builds all pages in the Jambo repo and places them in the
 * public directory.
 */
class BuildCommand {
  constructor(sitesGenerator) {
    this.sitesGenerator = sitesGenerator;
  }

  static getAlias() {
    return 'build';
  }

  static getShortDescription() {
    return 'build the static pages for the site';
  }

  static args() {
    return {
      jsonEnvVars: new ArgumentMetadata({
        type: ArgumentType.ARRAY,
        itemType: ArgumentType.STRING, 
        description: 'environment variables containing JSON',
        isRequired: false
      })
    }
  }

  static describe() {
    return {
      displayName: 'Build Pages'
    }
  }

  async execute(args) {
    try {
      await this.sitesGenerator.generate(args.jsonEnvVars);
    } catch (err) {
      if (isCustomError(err)) {
        throw err;
      }
      throw new UserError('Failed to generate the site', err.stack);
    }
  }
}

export default BuildCommand;