'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var postcss = _interopDefault(require('postcss'));
var postcssAdvancedVariables = _interopDefault(require('postcss-advanced-variables'));
var postcssAtroot = _interopDefault(require('postcss-atroot'));
var postcssExtendRule = _interopDefault(require('postcss-extend-rule'));
var postcssNested = _interopDefault(require('postcss-nested'));
var postcssPresetEnv = _interopDefault(require('postcss-preset-env'));
var postcssPropertyLookup = _interopDefault(require('postcss-property-lookup'));

// tooling

// plugin chain
var plugins = [postcssExtendRule, postcssAdvancedVariables, postcssPresetEnv, postcssAtroot, postcssPropertyLookup, postcssNested];

// plugin
var index = postcss.plugin('precss', function (rawopts) {
	// initialize options, defaulting preset-env to stage 0 features
	var opts = Object.assign({ stage: 0 }, rawopts);

	// initialize all plugins
	var initializedPlugins = plugins.map(function (plugin) {
		return plugin(opts);
	});

	// process css with all plugins
	return function (root, result) {
		return initializedPlugins.reduce(function (promise, plugin) {
			return promise.then(function () {
				return plugin(result.root, result);
			});
		}, Promise.resolve());
	};
});

module.exports = index;
