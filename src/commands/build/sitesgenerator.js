const fs = require('file-system');
const hbs = require('handlebars');
const path = require('path');

exports.SitesGenerator = class {
  constructor(jamboConfig) {
    this.config = jamboConfig;
  }

  generate() {
    const config = this.config;

    console.log('Reading config files');
    const pagesConfig = {};
    fs.recurseSync(config.dirs.config, (path, relative, filename) => {
      if (this._isValidFile(filename)) {
        let pageId = this._stripExtension(relative);
        try {
          pagesConfig[pageId] = JSON.parse(fs.readFileSync(path));
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

    const verticalConfigs = Object.keys(pagesConfig).reduce((object, key) => {
      if (key !== globalConfigName) {
        object[key] = pagesConfig[key];
      }
      return object;
    }, {});
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
              relativePath: this._calculateRelativePath(path)
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
  }

  _calculateRelativePath(filePath) {
    return path.relative(path.dirname(filePath), "");
  }

  _isValidFile(fileName) {
    return fileName && !fileName.startsWith('.');
  }
}
