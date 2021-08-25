import { ArgumentMetadata } from '../../models/commands/argumentmetadata';
import UserError from '../../errors/usererror';
import { isCustomError } from '../../utils/errorutils';
import SitesGenerator from './sitesgenerator';
import Command from '../../models/commands/command';

/**
 * BuildCommand builds all pages in the Jambo repo and places them in the
 * public directory.
 */
const BuildCommand : Command = class {
  sitesGenerator: SitesGenerator;

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
        type: 'array',
        itemType:'string', 
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