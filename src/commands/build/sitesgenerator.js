const fs = require('file-system');
const hbs = require('handlebars');
const path = require('path');
const { parse } = require('comment-json');

const { EnvironmentVariableParser } = require('../../utils/envvarparser');

exports.SitesGenerator = class {
  constructor(jamboConfig) {
    this.config = jamboConfig;
  }

  /**
   * Renders the static HTML for each site in the pages directory. All Handlebars
   * partials needed to do this are registered. Parameters, driven by the data in
   * any environment variables and the config directory, are supplied to these partials.
   * 
   * @param {Array<string>} jsonEnvVars Those environment variables that were serialized
   *                                    using JSON.
   */
  generate(jsonEnvVars=[]) {
    const config = this.config;
    if (!config) {
      throw new Error('Cannot find Jambo config in this directory, exiting.');
    }

    console.log('Reading config files');
    const pagesConfig = {};
    fs.recurseSync(config.dirs.config, (path, relative, filename) => {
      if (this._isValidFile(filename)) {
        let pageId = this._stripExtension(relative);
        try {
          pagesConfig[pageId] = parse(fs.readFileSync(path, 'utf8'), null, true);
        } catch (e) {
          if (e instanceof SyntaxError) {
            throw new Error('JSON SyntaxError: could not parse ' + path);
          } else {
            throw e;
          }
        }
      }
    })

    const globalConfigName = 'global_config';
    if (!pagesConfig[globalConfigName]) {
      console.error(`Error: Cannot find ${globalConfigName} file in '` + config.dirs.config + '/\' directory, exiting.');
      return;
    }

    console.log('Registering Jambo Handlebars helpers');
    // Register needed Handlebars helpers.
    this._registerHelpers();

    console.log('Registering all handlebars templates');
    // Register Theme partials.
    const defaultTheme = config.defaultTheme;
    defaultTheme && this._registerThemePartials(defaultTheme, config.dirs.themes);

    // Register all custom partials.
    this._registerCustomPartials(config.dirs.partials);

    // Pull all data from environment variables.
    const envVarParser = EnvironmentVariableParser.create();
    const env = envVarParser.parse(['JAMBO_INJECTED_DATA'].concat(jsonEnvVars));

    const verticalConfigs = Object.keys(pagesConfig).reduce((object, key) => {
      if (key !== globalConfigName) {
        object[key] = pagesConfig[key];
      }
      return object;
    }, {});

    // Clear the output directory before writing new files
    console.log('Cleaning output directory');
    if (fs.existsSync(config.dirs.output)) {
      fs.rmdirSync(config.dirs.output);
    }
    fs.mkdirSync(config.dirs.output);

    // Write out a file to the output directory per file in the pages directory
    fs.recurseSync(config.dirs.pages, (path, relative, filename) => {
      if (this._isValidFile(filename)) {
        const pageId = filename.split('.')[0];
        if (!pagesConfig[pageId]) {
          throw new Error(`Error: No config found for page: ${pageId}`);
        }
        console.log(`Writing output file for the '${pageId}' page`);
        const pageConfig = Object.assign(
            {},
            pagesConfig[pageId],
            {
              verticalConfigs,
              global_config: pagesConfig[globalConfigName],
              relativePath: this._calculateRelativePath(path),
              env
            });
        const pageLayout = pageConfig.layout;
  
        let template;
        if (pageLayout) {
          hbs.registerPartial('body', fs.readFileSync(path).toString());
          const layoutPath = `${config.dirs.partials}/${pageLayout}`;
          template = hbs.compile(fs.readFileSync(layoutPath).toString());
        } else {
          template = hbs.compile(fs.readFileSync(path).toString());
        }
        const result = template(pageConfig);
        const outputPath =
          `${config.dirs.output}/${this._stripExtension(relative).substring(config.dirs.pages)}`;
        fs.writeFileSync(outputPath, result); 
      }
    });
    console.log('Done.');
  }

  _stripExtension(fn) {
    if (fn.indexOf(".") === -1) {
      return fn;
    }
    return fn.substring(0, fn.lastIndexOf("."));
  }

  /**
   * Registers all custom Handlebars partials in the provided paths.
   * 
   * @param {Array} partialPaths The set of paths to traverse for partials.
   */
  _registerCustomPartials(partialPaths) {
    partialPaths.forEach(partialPath => this._registerPartials(partialPath, true));
  }

  /**
   * Registers all of the partials in the default Theme.
   * 
   * @param {string} defaultTheme The default Theme in the Jambo config.
   * @param {string} themesDir The Jambo Themes directory.
   */
  _registerThemePartials(defaultTheme, themesDir) {
    const themeDir = path.resolve(themesDir, defaultTheme);
    this._registerPartials(themeDir, false);
  }

  /**
   * Registers all partials in the provided path. If the path is a directory,
   * the useFullyQualifiedName parameter dictates if the path's root will be
   * included in the partial naming scheme.
   * 
   * @param {string} partialsPath The set of partials to register.
   * @param {boolean} useFullyQualifiedName Whether or not to include the path's root
   *                                        in the name of the newly registered partials. 
   */
  _registerPartials(partialsPath, useFullyQualifiedName) {
    const pathExists = fs.existsSync(partialsPath);
    if (pathExists && !fs.lstatSync(partialsPath).isFile()) {
      fs.recurseSync(partialsPath, (path, relative, filename) => {
        if (this._isValidFile(filename)) {
          const partialName = useFullyQualifiedName
            ? this._stripExtension(path)
            : this._stripExtension(relative);
          hbs.registerPartial(partialName, fs.readFileSync(path).toString());
        }
      });
    } else if (pathExists) {
      hbs.registerPartial(
        this._stripExtension(partialsPath), 
        fs.readFileSync(partialsPath).toString());
    }
  }

  _registerHelpers() {
    hbs.registerHelper('json', function(context) {
      return JSON.stringify(context || {});
    });

    hbs.registerHelper('ifeq', function (arg1, arg2, options) {
      return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
    });

    hbs.registerHelper('read', function (fileName) {
      return hbs.partials[fileName];
    });

    hbs.registerHelper('partialPattern', function (cardPath, opt) {
      let result = '';
      Object.keys(hbs.partials)
        .filter(key => key.match(new RegExp(cardPath)))
        .map(key => {return {key}})
        .forEach(key => result += opt.fn(key));
      return result;
    });
  }

  _calculateRelativePath(filePath) {
    return path.relative(path.dirname(filePath), "");
  }

  _isValidFile(fileName) {
    return fileName && !fileName.startsWith('.');
  }
}
