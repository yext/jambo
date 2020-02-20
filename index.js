let fs = require('file-system');
let { snakeCase } = require('change-case');
let hbs = require('handlebars');

// BUILD

// Read in the root config
let rootConfig = JSON.parse(fs.readFileSync('config.json'));

// Read in the page-specific configs

let pagesConfig = {};

fs.recurseSync('config', (path, relative, filename) => {
	let id = snakeCase(relative);
	pagesConfig[id] = JSON.parse(fs.readFileSync(path));
})

// Import theme partials if necessary
if (rootConfig.getTheme()) {
	fs.recurseSync('themes/' + rootConfig.getTheme(), (path, relative, filename) => {
		hbs.registerPartial(snakeCase(relative), fs.readFileSync(path));
	});
}

// Import partials from repository
// TODO: Read from root config a list of all directories containing partials
fs.recurseSync('partials', (path, relative, filename) => {
	hbs.registerPartial(snakeCase(relative), fs.readFileSync(path));
});

// END BUILD