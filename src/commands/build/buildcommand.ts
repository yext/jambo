import UserError from '../../errors/usererror';
import { isCustomError } from '../../utils/errorutils';
import SitesGenerator from './sitesgenerator';
import Command from '../../models/commands/command';
import { StringArrayMetadata } from '../../models/commands/concreteargumentmetadata';

const args = {
  jsonEnvVars: new StringArrayMetadata({
    description: 'environment variables containing JSON',
    isRequired: false
  })
};
  
/**
 * BuildCommand builds all pages in the Jambo repo and places them in the
 * public directory.
 */
const BuildCommand : Command<typeof args> = class {
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
    return args;
  }

  static describe() {
    return {
      displayName: 'Build Pages'
    }
  }

  async execute(args: { jsonEnvVars: string[] }): Promise<any> {
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