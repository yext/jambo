let fs = require('file-system');
import { snakeCase } from "change-case";
let hbs = require('handlebars');

// Read in the root config
let rootConfig = JSON.parse(fs.readFile('config.json'));

// Read in the page-specific configs
let pagesConfig = fs.recurse('config')
	.reduce((acc, cur) => {
		let id = snakeCase(cur);
		acc[id] = JSON.parse(fs.readFile(cur));
		return acc;
	});


// Import theme partials if necessary
let themePartials = rootConfig.getTheme() ? fs.recurse('themes/' + rootConfig.getTheme()) : [];
themePartials.forEach((x) => {
	hbs.registerPartial(snakeCase(x), fs.readFile(x));
});

// Import partials from repository
fs.recurse('partials').forEach((x) => {
	hbs.registerPartial(snakeCase(x), fs.readFile(x));
});

