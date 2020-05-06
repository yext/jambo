# Jambo

Jambo is a JAMStack implementation using Handlebars.

## Installation

Install jambo from npm, and save it to your package.json as a dev-dependency.

```bash
npm install -D jambo
```
___

## Usage

Jambo has 5 commands, init, import, override, page, and build.

#### Init

```bash
npx jambo init
```

Initiailizes the current directory as a Jambo repository.

The init command initializes a Jambo repo, and also imports the designated theme.
Currently, only answers-hitchhiker-theme is supported.

###### Optional Arguments

--theme _theme_name_

Import a theme after initializing the repo.

#### Import

```bash
npx jambo import --theme answers-hitchhiker-theme
```

The import command imports the designated theme into the 'themes' folder.

**--theme** _theme_name_

The name of the theme to import.

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

--theme _theme_name_

A theme to use with your page. Required if specifying a template.

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

___

## License

[ISC](https://opensource.org/licenses/ISC)