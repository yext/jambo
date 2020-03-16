# Jamboree

Jamboree (Jambo for short) is a A JAMStack implementation using Handlebars.

## Installation

Install jamboree from npm, and save it to your package.json as a dev-dependency.

```bash
npm install -D @yext/jamboree
```
___

## Usage

Jambo has 5 commands, init, import, override, page, and build.

#### Init

```bash
npx jambo init
```

Initiailizes the current directory as a Jambo repository.

```bash
npx jambo init --theme a_jambo_theme_name
```

The init command initializes a Jambo repo, and also imports the designated theme.
Currently, only answers-hitchhiker-theme is supported.

#### Import

```bash
npx jambo import --theme answers-hitchhiker-theme
```

The import command imports the designated theme into your jambo repo.

#### Override

```bash
npx jambo override --theme answers-hitchhiker-theme --path path_to_override
```

The override command lets you override a specified theme, such as answers-hitchhiker-theme.
You can also specify a specific path to override, instead of the whole theme.

It does so by copying the designated theme, or just the specified path of the theme, into the 'overrides' folder.
These copies, and any changes made to them, will be used instead of the original files.

#### Page

```bash
npx jambo page --name new_page_name --layout layout_name --template vertical --theme answers-hitchhiker-theme
```

The page command registers a new webpage within Jambo with the specified name. 
The layout argument adds an optional layout to the page, which specifies content outside of your primary page content, e.g. a header or footer.

The template argument specifies which template to fill the page content with.

The theme argument specifies which theme to look for your layout and template, if any were specified.

#### Build

```bash
npx jambo build
```

The build command builds all pages reigstered within Jambo, and places them inside the 'public' directory.
The build command currently uses the 'theme' attribute in the config.json in Jambo's root directory, which must
be added to config.json manually. Here is an example of a simple config.json.

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
  "theme": "answers-hitchhiker-theme"
}
```

In the future, this will not be necessary.

___

## License

[ISC](https://opensource.org/licenses/ISC)