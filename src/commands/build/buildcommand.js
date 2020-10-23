const { SitesGenerator } = require('./sitesgenerator');
const { ArgumentMetadata, ArgumentType } = require('../../models/commands/argumentmetadata');

/**
 * BuildCommand builds all pages in the Jambo repo and places them in the
 * public directory.
 */
class BuildCommand {
  constructor(jamboConfig) {
    this.jamboConfig = jamboConfig;
  }

  getAlias() {
    return 'build';
  }

  getShortDescription() {
    return 'build the static pages for the site';
  }

  args() {
    return {
      jsonEnvVars: new ArgumentMetadata({
        type: ArgumentType.ARRAY,
        description: 'environment variables containing JSON',
        isRequired: false
      })
    }
  }

  describe() {
    return {
      displayName: 'Build Pages'
    }
  }

  execute(args) {
    const sitesGenerator = new SitesGenerator(this.jamboConfig);
      try {
        sitesGenerator.generate(args.jsonEnvVars);
      } catch (err) {
        if (isCustomError(err)) {
          throw err;
        }
        throw new UserError('Failed to generate the site', err.stack);
      }
  }
}

module.exports = BuildCommand;