'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var postcss = require('postcss');
var postcss__default = _interopDefault(postcss);
var path = _interopDefault(require('path'));
var resolve = _interopDefault(require('@csstools/sass-import-resolve'));

// return the closest variable from a node
function getClosestVariable(name, node, opts) {
	var variables = getVariables(node);

	var variable = variables[name];

	if (requiresAncestorVariable(variable, node)) {
		variable = getClosestVariable(name, node.parent, opts);
	}

	if (requiresFnVariable(variable, opts)) {
		variable = getFnVariable(name, node, opts.variables);
	}

	return variable;
}

// return the variables object of a node
var getVariables = function getVariables(node) {
	return Object(Object(node).variables);
};

// return whether the variable should be replaced using an ancestor variable
var requiresAncestorVariable = function requiresAncestorVariable(variable, node) {
	return undefined === variable && node && node.parent;
};

// return whether variable should be replaced using a variables function
var requiresFnVariable = function requiresFnVariable(value, opts) {
	return value === undefined && Object(opts).variables === Object(Object(opts).variables);
};

// return whether variable should be replaced using a variables function
var getFnVariable = function getFnVariable(name, node, variables) {
	return 'function' === typeof variables ? variables(name, node) : variables[name];
};

function manageUnresolved(node, opts, word, message) {
	if ('warn' === opts.unresolved) {
		node.warn(opts.result, message, { word });
	} else if ('ignore' !== opts.unresolved) {
		throw node.error(message, { word });
	}
}

// tooling

// return content with its variables replaced by the corresponding values of a node
function getReplacedString(string, node, opts) {
	var replacedString = string.replace(matchVariables, function (match, before, name1, name2, name3) {
		// conditionally return an (unescaped) match
		if (before === '\\') {
			return match.slice(1);
		}

		// the first matching variable name
		var name = name1 || name2 || name3;

		// the closest variable value
		var value = getClosestVariable(name, node.parent, opts);

		// if a variable has not been resolved
		if (undefined === value) {
			manageUnresolved(node, opts, name, `Could not resolve the variable "$${name}" within "${string}"`);

			return match;
		}

		// the stringified value
		var stringifiedValue = `${before}${stringify(value)}`;

		return stringifiedValue;
	});

	return replacedString;
}

// match all $name, $(name), and #{$name} variables (and catch the character before it)
var matchVariables = /(.?)(?:\$([A-z][\w-]*)|\$\(([A-z][\w-]*)\)|#\{\$([A-z][\w-]*)\})/g;

// return a sass stringified variable
var stringify = function stringify(object) {
	return Array.isArray(object) ? `(${object.map(stringify).join(',')})` : Object(object) === object ? `(${Object.keys(object).map(function (key) {
		return `${key}:${stringify(object[key])}`;
	}).join(',')})` : String(object);
};

// tooling

// set a variable on a node
function setVariable(node, name, value, opts) {
	// if the value is not a default with a value already defined
	if (!matchDefault.test(value) || getClosestVariable(name, node, opts) === undefined) {
		// the value without a default suffix
		var undefaultedValue = matchDefault.test(value) ? value.replace(matchDefault, '') : value;

		// ensure the node has a variables object
		node.variables = node.variables || {};

		// set the variable
		node.variables[name] = undefaultedValue;
	}
}

// match anything ending with a valid !default
var matchDefault = /\s+!default$/;

// tooling

// transform declarations
function transformDecl(decl, opts) {
	// update the declaration value with its variables replaced by their corresponding values
	decl.value = getReplacedString(decl.value, decl, opts);

	// if the declaration is a variable declaration
	if (isVariableDeclaration(decl)) {
		// set the variable on the parent of the declaration
		setVariable(decl.parent, decl.prop.slice(1), decl.value, opts);

		// remove the declaration
		decl.remove();
	}
}

// return whether the declaration property is a variable declaration
var isVariableDeclaration = function isVariableDeclaration(decl) {
	return matchVariable.test(decl.prop);
};

// match a variable ($any-name)
var matchVariable = /^\$[\w-]+$/;

// tooling

// transform generic at-rules
function transformAtrule(rule, opts) {
	// update the at-rule params with its variables replaced by their corresponding values
	rule.params = getReplacedString(rule.params, rule, opts);
}

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var toArray = function (arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

// tooling

// return sass-like arrays as literal arrays ('(hello), (goodbye)' to [[hello], [goodbye]])
function getValueAsObject(value) {
	var hasWrappingParens = matchWrappingParens.test(value);
	var unwrappedValue = String(hasWrappingParens ? value.replace(matchWrappingParens, '$1') : value).replace(matchTrailingComma, '');
	var separatedValue = postcss.list.comma(unwrappedValue);
	var firstValue = separatedValue[0];

	if (firstValue === value) {
		return value;
	} else {
		var objectValue = {};
		var arrayValue = [];

		separatedValue.forEach(function (subvalue, index) {
			var _ref = subvalue.match(matchDeclaration) || [],
			    _ref2 = slicedToArray(_ref, 3),
			    match = _ref2[0],
			    key = _ref2[1],
			    keyvalue = _ref2[2];

			if (match) {
				objectValue[key] = getValueAsObject(keyvalue);
			} else {
				arrayValue[index] = getValueAsObject(subvalue);
			}
		});

		var transformedValue = Object.keys(objectValue).length > 0 ? Object.assign(objectValue, arrayValue) : arrayValue;

		return transformedValue;
	}
}

// match wrapping parentheses ((), (anything), (anything (anything)))
var matchWrappingParens = /^\(([\W\w]*)\)$/g;

// match a property name (any-possible_name)
var matchDeclaration = /^([\w-]+)\s*:\s*([\W\w]+)\s*$/;

// match a trailing comma
var matchTrailingComma = /\s*,\s*$/;

var waterfall = (function (items, asyncFunction) {
	return items.reduce(function (lastPromise, item) {
		return lastPromise.then(function () {
			return asyncFunction(item);
		});
	}, Promise.resolve());
});

// tooling

// transform @each at-rules
function transformEachAtrule(rule, opts) {
	// if @each is supported
	if (opts.transform.indexOf('@each') !== -1) {
		// @each options
		var _getEachOpts = getEachOpts(rule, opts),
		    varname = _getEachOpts.varname,
		    incname = _getEachOpts.incname,
		    list = _getEachOpts.list;

		var replacements = [];
		var ruleClones = [];

		Object.keys(list).forEach(function (key) {
			// set the current variable
			setVariable(rule, varname, list[key], opts);

			// conditionally set the incremenator variable
			if (incname) {
				setVariable(rule, incname, key, opts);
			}

			// clone the @each at-rule
			var clone = rule.clone({
				parent: rule.parent,
				variables: Object.assign({}, rule.variables)
			});

			ruleClones.push(clone);
		});

		return waterfall(ruleClones, function (clone) {
			return transformNode(clone, opts).then(function () {
				replacements.push.apply(replacements, toConsumableArray(clone.nodes));
			});
		}).then(function () {
			// replace the @each at-rule with the replacements
			rule.parent.insertBefore(rule, replacements);

			rule.remove();
		});
	}
}

// return the @each statement options (@each NAME in LIST, @each NAME ITERATOR in LIST)
var getEachOpts = function getEachOpts(node, opts) {
	var params = node.params.split(matchInOperator);
	var args = (params[0] || '').trim().split(' ');
	var varname = args[0].trim().slice(1);
	var incname = args.length > 1 && args[1].trim().slice(1);
	var rawlist = getValueAsObject(getReplacedString(params.slice(1).join(matchInOperator), node, opts));
	var list = 'string' === typeof rawlist ? [rawlist] : rawlist;

	return { varname, incname, list };
};

// match the opertor separating the name and iterator from the list
var matchInOperator = ' in ';

// tooling

// transform @if at-rules
function transformIfAtrule(rule, opts) {
	// @if options
	var isTruthy = isIfTruthy(rule, opts);
	var next = rule.next();

	var transformAndInsertBeforeParent = function transformAndInsertBeforeParent(node) {
		return transformNode(node, opts).then(function () {
			return node.parent.insertBefore(node, node.nodes);
		});
	};

	return ifPromise(opts.transform.indexOf('@if') !== -1, function () {
		return ifPromise(isTruthy, function () {
			return transformAndInsertBeforeParent(rule);
		}).then(function () {
			rule.remove();
		});
	}).then(function () {
		return ifPromise(opts.transform.indexOf('@else') !== -1 && isElseRule(next), function () {
			return ifPromise(!isTruthy, function () {
				return transformAndInsertBeforeParent(next);
			}).then(function () {
				next.remove();
			});
		});
	});
}

var ifPromise = function ifPromise(condition, trueFunction) {
	return Promise.resolve(condition && trueFunction());
};

// return whether the @if at-rule is truthy
var isIfTruthy = function isIfTruthy(node, opts) {
	// @if statement options (@if EXPRESSION, @if LEFT OPERATOR RIGHT)
	var params = postcss.list.space(node.params);
	var left = getInterprettedString(getReplacedString(params[0] || '', node, opts));
	var operator = params[1];
	var right = getInterprettedString(getReplacedString(params[2] || '', node, opts));

	// evaluate the expression
	var isTruthy = !operator && left || operator === '==' && left === right || operator === '!=' && left !== right || operator === '<' && left < right || operator === '<=' && left <= right || operator === '>' && left > right || operator === '>=' && left >= right;

	return isTruthy;
};

// return the value as a boolean, number, or string
var getInterprettedString = function getInterprettedString(value) {
	return 'true' === value ? true : 'false' === value ? false : isNaN(value) ? value : Number(value);
};

// return whether the node is an else at-rule
var isElseRule = function isElseRule(node) {
	return Object(node) === node && 'atrule' === node.type && 'else' === node.name;
};

// tooling

// transform @import at-rules
function transformImportAtrule(rule, opts) {
	// if @import is supported
	if (opts.transform.indexOf('@import') !== -1) {
		// @import options
		var _getImportOpts = getImportOpts(rule, opts),
		    id = _getImportOpts.id,
		    media = _getImportOpts.media,
		    cwf = _getImportOpts.cwf,
		    cwd = _getImportOpts.cwd;

		if (opts.importFilter instanceof Function && opts.importFilter(id, media) || opts.importFilter instanceof RegExp && opts.importFilter.test(id)) {
			var cwds = [cwd].concat(opts.importPaths);

			// promise the resolved file and its contents using the file resolver
			var importPromise = cwds.reduce(function (promise, thiscwd) {
				return promise.catch(function () {
					return opts.importResolve(id, thiscwd, opts);
				});
			}, Promise.reject());

			return importPromise.then(
			// promise the processed file
			function (_ref) {
				var file = _ref.file,
				    contents = _ref.contents;
				return processor.process(contents, { from: file }).then(function (_ref2) {
					var root = _ref2.root;

					// push a dependency message
					opts.result.messages.push({ type: 'dependency', file: file, parent: cwf });

					// imported nodes
					var nodes = root.nodes.slice(0);

					// if media params were detected
					if (media) {
						// create a new media rule
						var mediaRule = postcss__default.atRule({
							name: 'media',
							params: media,
							source: rule.source
						});

						// append with the imported nodes
						mediaRule.append(nodes);

						// replace the @import at-rule with the @media at-rule
						rule.replaceWith(mediaRule);
					} else {
						// replace the @import at-rule with the imported nodes
						rule.replaceWith(nodes);
					}

					// transform all nodes from the import
					return transformNode({ nodes }, opts);
				});
			}, function () {
				// otherwise, if the @import could not be found
				manageUnresolved(rule, opts, '@import', `Could not resolve the @import for "${id}"`);
			});
		}
	}
}

var processor = postcss__default();

// return the @import statement options (@import ID, @import ID MEDIA)
var getImportOpts = function getImportOpts(node, opts) {
	var _list$space = postcss.list.space(node.params),
	    _list$space2 = toArray(_list$space),
	    rawid = _list$space2[0],
	    medias = _list$space2.slice(1);

	var id = getReplacedString(trimWrappingURL(rawid), node, opts);
	var media = medias.join(' ');

	// current working file and directory
	var cwf = node.source && node.source.input && node.source.input.file || opts.result.from;
	var cwd = cwf ? path.dirname(cwf) : opts.importRoot;

	return { id, media, cwf, cwd };
};

// return a string with the wrapping url() and quotes trimmed
var trimWrappingURL = function trimWrappingURL(string) {
	return trimWrappingQuotes(string.replace(/^url\(([\W\w]*)\)$/, '$1'));
};

// return a string with the wrapping quotes trimmed
var trimWrappingQuotes = function trimWrappingQuotes(string) {
	return string.replace(/^("|')([\W\w]*)\1$/, '$2');
};

// tooling

// transform @include at-rules
function transformIncludeAtrule(rule, opts) {
	// if @include is supported
	if (opts.transform.indexOf('@include') !== -1) {
		// @include options
		var _getIncludeOpts = getIncludeOpts(rule),
		    name = _getIncludeOpts.name,
		    args = _getIncludeOpts.args;

		// the closest @mixin variable


		var mixin = getClosestVariable(`@mixin ${name}`, rule.parent, opts);

		// if the @mixin variable exists
		if (mixin) {
			// set @mixin variables on the @include at-rule
			mixin.params.forEach(function (param, index) {
				var arg = index in args ? getReplacedString(args[index], rule, opts) : param.value;

				setVariable(rule, param.name, arg, opts);
			});

			// clone the @mixin at-rule
			var clone = mixin.rule.clone({
				original: rule,
				parent: rule.parent,
				variables: rule.variables
			});

			// transform the clone children
			return transformNode(clone, opts).then(function () {
				// replace the @include at-rule with the clone children
				rule.parent.insertBefore(rule, clone.nodes);

				rule.remove();
			});
		} else {
			// otherwise, if the @mixin variable does not exist
			manageUnresolved(rule, opts, name, `Could not resolve the mixin for "${name}"`);
		}
	}
}

// return the @include statement options (@include NAME, @include NAME(ARGS))
var getIncludeOpts = function getIncludeOpts(node) {
	// @include name and args
	var _node$params$split = node.params.split(matchOpeningParen, 2),
	    _node$params$split2 = slicedToArray(_node$params$split, 2),
	    name = _node$params$split2[0],
	    sourceArgs = _node$params$split2[1];

	var args = sourceArgs ? postcss.list.comma(sourceArgs.slice(0, -1)) : [];

	return { name, args };
};

// match an opening parenthesis
var matchOpeningParen = '(';

// tooling

// transform @for at-rules
function transformForAtrule(rule, opts) {
	// if @for is supported
	if (opts.transform.indexOf('@for') !== -1) {
		// @for options
		var _getForOpts = getForOpts(rule, opts),
		    varname = _getForOpts.varname,
		    start = _getForOpts.start,
		    end = _getForOpts.end,
		    increment = _getForOpts.increment;

		var direction = start <= end ? 1 : -1;
		var replacements = [];
		var ruleClones = [];

		// for each iteration
		for (var incrementor = start; incrementor * direction <= end * direction; incrementor += increment * direction) {
			// set the current variable
			setVariable(rule, varname, incrementor, opts);

			// clone the @for at-rule
			var clone = rule.clone({
				parent: rule.parent,
				variables: Object.assign({}, rule.variables)
			});

			ruleClones.push(clone);
		}

		return waterfall(ruleClones, function (clone) {
			return transformNode(clone, opts).then(function () {
				replacements.push.apply(replacements, toConsumableArray(clone.nodes));
			});
		}).then(function () {
			// replace the @for at-rule with the replacements
			rule.parent.insertBefore(rule, replacements);

			rule.remove();
		});
	}
}

// return the @for statement options (@for NAME from START through END, @for NAME from START through END by INCREMENT)
var getForOpts = function getForOpts(node, opts) {
	var params = postcss.list.space(node.params);
	var varname = params[0].trim().slice(1);
	var start = Number(getReplacedString(params[2], node, opts));
	var end = Number(getReplacedString(params[4], node, opts));
	var increment = 6 in params && Number(getReplacedString(params[6], node, opts)) || 1;

	return { varname, start, end, increment };
};

// tooling

// transform @mixin at-rules
function transformMixinAtrule(rule, opts) {
	// if @mixin is supported
	if (opts.transform.indexOf('@mixin') !== -1) {
		// @mixin options
		var _getMixinOpts = getMixinOpts(rule),
		    name = _getMixinOpts.name,
		    params = _getMixinOpts.params;

		// set the mixin as a variable on the parent of the @mixin at-rule


		setVariable(rule.parent, `@mixin ${name}`, { params, rule }, opts);

		// remove the @mixin at-rule
		rule.remove();
	}
}

// return the @mixin statement options (@mixin NAME, @mixin NAME(PARAMS))
var getMixinOpts = function getMixinOpts(node) {
	// @mixin name and default params ([{ name, value }, ...])
	var _node$params$split = node.params.split(matchOpeningParen$1, 2),
	    _node$params$split2 = slicedToArray(_node$params$split, 2),
	    name = _node$params$split2[0],
	    sourceParams = _node$params$split2[1];

	var params = sourceParams && sourceParams.slice(0, -1).trim() ? postcss.list.comma(sourceParams.slice(0, -1).trim()).map(function (param) {
		var parts = postcss.list.split(param, ':');
		var paramName = parts[0].slice(1);
		var paramValue = parts.length > 1 ? parts.slice(1).join(':') : undefined;

		return { name: paramName, value: paramValue };
	}) : [];

	return { name, params };
};

// match an opening parenthesis
var matchOpeningParen$1 = '(';

// tooling

// transform rule nodes
function transformRule(rule, opts) {
	// update the rule selector with its variables replaced by their corresponding values
	rule.selector = getReplacedString(rule.selector, rule, opts);
}

// tooling

// transform @content at-rules
function transformContentAtrule(rule, opts) {
	// if @content is supported
	if (opts.transform.indexOf('@content') !== -1) {
		// the closest @mixin at-rule
		var mixin = getClosestMixin(rule);

		// if the @mixin at-rule exists
		if (mixin) {
			// clone the @mixin at-rule
			var clone = mixin.original.clone({
				parent: rule.parent,
				variables: rule.variables
			});

			// transform the clone children
			return transformNode(clone, opts).then(function () {
				// replace the @content at-rule with the clone children
				rule.parent.insertBefore(rule, clone.nodes);

				rule.remove();
			});
		} else {
			// otherwise, if the @mixin at-rule does not exist
			manageUnresolved(rule, opts, '@content', 'Could not resolve the mixin for @content');
		}
	}
}

// return the closest @mixin at-rule
var getClosestMixin = function getClosestMixin(node) {
	return 'atrule' === node.type && 'mixin' === node.name ? node : node.parent && getClosestMixin(node.parent);
};

// tooling

function transformNode(node, opts) {
	return waterfall(getNodesArray(node), function (child) {
		return transformRuleOrDecl(child, opts).then(function () {
			// conditionally walk the children of the attached child
			if (child.parent) {
				return transformNode(child, opts);
			}
		});
	});
}

function transformRuleOrDecl(child, opts) {
	return Promise.resolve().then(function () {
		var type = child.type;

		if ('atrule' === type) {
			var name = child.name.toLowerCase();

			if ('content' === name) {
				// transform @content at-rules
				return transformContentAtrule(child, opts);
			} else if ('each' === name) {
				// transform @each at-rules
				return transformEachAtrule(child, opts);
			} else if ('if' === name) {
				// transform @if at-rules
				return transformIfAtrule(child, opts);
			} else if ('import' === name) {
				return transformImportAtrule(child, opts);
			} else if ('include' === name) {
				// transform @include at-rules
				return transformIncludeAtrule(child, opts);
			} else if ('for' === name) {
				// transform @for at-rules
				return transformForAtrule(child, opts);
			} else if ('mixin' === name) {
				// transform mixin at-rules
				return transformMixinAtrule(child, opts);
			} else {
				// transform all other at-rules
				return transformAtrule(child, opts);
			}
		} else if ('decl' === type) {
			// transform declarations
			return transformDecl(child, opts);
		} else if ('rule' === type) {
			// transform rule
			return transformRule(child, opts);
		}
	});
}

// return the children of a node as an array
var getNodesArray = function getNodesArray(node) {
	return Array.from(Object(node).nodes || []);
};

// tooling

// plugin
var index = postcss__default.plugin('postcss-advanced-variables', function (opts) {
	return function (root, result) {
		// process options
		var transformOpt = ['@content', '@each', '@else', '@if', '@include', '@import', '@for', '@mixin'].filter(function (feature) {
			return !(String(Object(opts).disable || '').split(/\s*,\s*|\s+,?\s*|\s,?\s+/).indexOf(feature) !== -1);
		});
		var unresolvedOpt = String(Object(opts).unresolved || 'throw').toLowerCase();
		var variablesOpt = Object(opts).variables;
		var importCache = Object(Object(opts).importCache);
		var importFilter = Object(opts).filter || function (id) {
			return !matchProtocol.test(id);
		};
		var importPaths = [].concat(Object(opts).importPaths || []);
		var importResolve = Object(opts).resolve || function (id, cwd) {
			return resolve(id, { cwd, readFile: true, cache: importCache });
		};
		var importRoot = Object(opts).importRoot || process.cwd();

		return transformNode(root, {
			result,
			importCache,
			importFilter,
			importPaths,
			importResolve,
			importRoot,
			transform: transformOpt,
			unresolved: unresolvedOpt,
			variables: variablesOpt
		});
	};
});

var matchProtocol = /^(?:[A-z]+:)?\/\//;

module.exports = index;
