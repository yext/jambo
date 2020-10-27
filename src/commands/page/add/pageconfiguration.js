/**
 * PageConfiguration contains all of the configuration information
 * needed to create a new page in a Jambo repository.
 */
class PageConfiguration {
  constructor({ name, layout, theme, template }) {
    this._name = name;
    this._layout = layout;
    this._theme = theme;
    this._template = template;
  }

  getName() {
    return this._name;
  }

  getLayout() {
    return this._layout;
  }

  getTheme() {
    return this._theme;
  }

  getTemplate() {
    return this._template;
  }
}

module.exports = PageConfiguration;