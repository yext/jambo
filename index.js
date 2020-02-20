let fs = require('file-system');
let { snakeCase } = require('change-case');
let hbs = require('handlebars');
const mergeOptions = require('merge-options');


exports.build = function (params) {
	// BUILD

	// Read in the root config
	let config = mergeOptions(
		{
			dirs: {
				themes: 'themes',
				config: 'config',
				overrides: 'overrides',
				output: 'public',
				pages: 'pages'
			}
		},
		JSON.parse(fs.readFileSync('config.json'))
	);

	// Read in the page-specific configs
	let pagesConfig = {};
	fs.recurseSync(config.dirs.config, (path, relative, filename) => {
		if (filename) {
			let id = snakeCase(stripExtension(relative));
			pagesConfig[id] = JSON.parse(fs.readFileSync(path));
		}
	})

	// Import theme partials if necessary
	if (config.theme) {
		let themeDir = config.dirs.themes + '/' + config.theme;
		fs.recurseSync(themeDir, (path, relative, filename) => {
			if (filename) {
				relativeNoExtension = stripExtension(relative);
				hbs.registerPartial(snakeCase(relativeNoExtension), fs.readFileSync(path));
			}
		});
	}

	// Import partials from repository
	// TODO: Read from root config a list of all directories containing partials
	fs.recurseSync(config.dirs.overrides, (path, relative, filename) => {
		hbs.registerPartial(snakeCase(relative), fs.readFileSync(path));
	});

	console.dir(config);
	console.dir(pagesConfig);
	console.dir(Object.keys(hbs.partials));

	// Write out a file to the output directory per file in the pages directory
	fs.recurseSync(config.dirs.pages, (path, relative, filename) => {
		console.log(fs.readFileSync(path));
		let template = hbs.compile(fs.readFileSync(path).toString());
		console.log(template);
		let result = template(pagesConfig);
		fs.writeFileSync(
			config.dirs.output + "/" +
			stripExtension(relative).substring(config.dirs.pages),
			result);
	});

	// END BUILD
}

function stripExtension(fn) {
	if (fn.indexOf(".") === -1) {
		return fn;
	}
	return fn.substring(0, fn.lastIndexOf("."));
}