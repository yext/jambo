const fs = require('file-system');

exports.GlobalPageSettings = class {
  constructor({ apiKey, businessId, experienceKey, experienceVersion }) {
    this._apiKey = apiKey;
    this._businessId = businessId;
    this._experienceKey = experienceKey;
    this._experienceVersion = experienceVersion;
  }

  getApiKey() {
    return this._apiKey;
  }

  getBusinessId() {
    return this._businessId;
  }

  getExperienceKey() {
    return this._experienceKey;
  }

  getExperienceVersion() {
    return this._experienceVersion;
  }
}

exports.RepositoryScaffolder = class {
  create(globalPageSettings) {
    // Initialize pages, overrides, themes, and layouts directories.
    this._createDirectory('pages');
    this._createDirectory('overrides');
    this._createDirectory('layouts');
    this._createDirectory('themes');

    // Create the config directory and initialize it with a global_config.json.
    this._initializeConfigDirectory(globalPageSettings);

    // Create the top-level Jambo configuration.
    this._createJamboConfig();
  }

  _createJamboConfig() {
    const jamboConfig = {
      dirs: {
        themes: 'themes',
        config: 'config',
        overrides: 'overrides',
        output: 'public',
        pages: 'pages',
        layouts: 'layouts'
      }
    };

    fs.writeFileSync('config.json', JSON.stringify(jamboConfig));
  }

  _initializeConfigDirectory(globalPageSettings) {
    const configDirectory = 'config';
    this._createDirectory(configDirectory);

    const globalConfig = {
      apiKey: globalPageSettings.getApiKey(),
      experienceKey: globalPageSettings.getExperienceKey(),
      businessId: globalPageSettings.getBusinessId(),
      experienceVersion: globalPageSettings.getExperienceVersion()
    };
    fs.writeFileSync(`${configDirectory}/global_config.json`, JSON.stringify(globalConfig));
  }

  _createDirectory(directoryName) {
    fs.mkdirSync(directoryName);
  }
};