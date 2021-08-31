import UserError from '../../errors/usererror';
import { isCustomError } from '../../utils/errorutils';
import SitesGenerator from './sitesgenerator';
import Command, { ArgsForExecute } from '../../models/commands/command';

const args = {
  jsonEnvVars: {
    type: 'array',
    itemType: 'string', 
    description: 'environment variables containing JSON',
    isRequired: false
  }
} as const;
type Args = typeof args;
  
/**
 * BuildCommand builds all pages in the Jambo repo and places them in the
 * public directory.
 */
const BuildCommand : Command<Args> = class {
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

  async execute(args: ArgsForExecute<Args>): Promise<any> {
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