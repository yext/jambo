# Jambo

<div>
  <a href='https://coveralls.io/github/yext/jambo?branch=master'>
    <img src='https://coveralls.io/repos/github/yext/jambo/badge.svg?branch=master' alt='Coverage Status' />
  </a>
</div>

Jambo is a JAMStack implementation using Handlebars.

## Installation

Install jambo from npm, and save it to your package.json as a dev-dependency.

```bash
npm install -D jambo
```

___

## Usage

Jambo has 6 official commands: init, import, override, page, build, and upgrade.

#### Init

```bash
npx jambo init
```

Initiailizes the current directory as a Jambo repository.

The init command initializes a Jambo repo, and also imports the designated theme.
Currently, only answers-hitchhiker-theme is supported.

###### Optional Arguments

--themeUrl _theme_url_

The git URL of the theme to import, if a theme should be imported on init.

--useSubmodules _true/false_

If importing a theme on init, whether to import it as a git submodule as opposed to regular files. Defaults to false.

#### Import

```bash
npx jambo import --themeUrl https://github.com/yext/answers-hitchhiker-theme.git
```

The import command imports the designated theme into the 'themes' folder.

**--themeUrl** _theme_url_

The git URL of the theme to import.

###### Optional Arguments

--useSubmodules _true/false_

Whether to import the theme as a git submodule, as opposed to regular files. Defaults to false.

#### Override

```bash
npx jambo override --theme answers-hitchhiker-theme
```

The override command lets you override a specified theme by copying its files into the **overrides** folder.

**--theme** _theme_name_

The name of the theme to override.

###### Optional Arguments

--path _path_to_override_

You can specify specific files(s) in the theme to override.

#### Page

```bash
npx jambo page --name new_page_name
```

The **page** command registers a new page, with the specified name, to be built by Jambo.

**--name** _page_name_

The name this page will be registered as.

###### - Optional Arguments

--template  _template_name_

The template to generate the page with.

--layout _layout_name_

The layout to use around the page.

#### Build

```bash
npx jambo build
```

The build command builds all pages reigstered within Jambo, and places them inside the 'public' directory. The public directory will be cleared prior to each build, so any static assets in that directory will need to be re-generated.

The build command uses the 'defaultTheme' attribute in the jambo.json in Jambo's root directory, which must be added to jambo.json manually. Here is an example jambo.json.

```json
{
  "dirs": {
    "themes":"themes",
    "cards": "cards",
    "config":"config",
    "overrides":"overrides",
    "output":"public",
    "pages":"pages",
    "layouts":"layouts"
  },
  "defaultTheme": "answers-hitchhiker-theme"
}
```

##### Helpers

The build command registers a few handlebars helpers for convenience:

* `json(context)`: Renders the context as JSON
* `ifeq(arg1, arg2, options)`: if arg1 == arg2 then options.fn, otherwise options.inverse
* `read(fileName)`: Reads contents of the given fileName
* `concat(prefix, id)`: Concatenates prefix + id
* `babel(options)`: Adds babel transforms to the given code with the options given
* `partialPattern(cardPath, opt)`
* `deepMerge(...args)`: Performs a deep merge of the given objects

Note: The babel helper does not polyfill all necessary functionality needed for IE11 for example.
You should use global polyfills if you wish to use them in the code. For example, you might
want to import core-js/stable.


### Upgrade

```bash
npx jambo upgrade
```

The upgrade command updates your current defaultTheme to the latest version.
It will also automatically execute the theme's upgrade.js script.

###### Optional Arguments

--disableScript _true/false_

You can disable automatic execution of the upgrade.js script in the theme.
Defaults to false.

--isLegacy _true/false_

You can signal whether to pass an --isLegacy flag to the theme's upgrade.js.
This can be useful when you need different/additional upgrade logic to upgrade
from older versions of a theme. Defaults to false.
