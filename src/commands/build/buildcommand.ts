import { ArgumentMetadata, ArgumentType } from '../../models/commands/argumentmetadata';
import UserError from '../../errors/usererror';
import { isCustomError } from '../../utils/errorutils';
import SitesGenerator from './sitesgenerator';
import Command from '../../models/commands/command';

/**
 * BuildCommand builds all pages in the Jambo repo and places them in the
 * public directory.
 */
const BuildCommand : Command = class {
  static alias = 'build';
  static shortDescription = 'build the static pages for the site';
  static args: Record<string, ArgumentMetadata> = {
    jsonEnvVars: {
      type: ArgumentType.ARRAY,
      description: 'environment variables containing JSON',
      isRequired: false
    }
  };
  sitesGenerator: SitesGenerator;

  constructor(sitesGenerator) {
    this.sitesGenerator = sitesGenerator;
  }

  static describe() {
    return {
      displayName: 'Build Pages'
    }
  }

  async execute(args: Record<string, any>): Promise<any> {
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