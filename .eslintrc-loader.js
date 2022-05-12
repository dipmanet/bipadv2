const eslintrc = require('./.eslintrc.js');



eslintrcLoader = {

	...eslintrc,

	rules: {

		...eslintrc.rules,

		// Disable on js build

		'css-modules/no-unused-class': 0,

		'css-modules/no-undef-class': 0,

		"linebreak-style": 0,

		"global-require": 0,

		"eslint linebreak-style": [0, "error", "linux"],

		"no-tabs": 0,

		"no-mixed-spaces-and-tabs": 0,

		"no-const-assign": "warn",

		"no-this-before-super": "warn",



	},

};



module.exports = eslintrcLoader;