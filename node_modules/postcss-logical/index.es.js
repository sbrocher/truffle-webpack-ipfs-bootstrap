import postcss from 'postcss';

var cloneRule = (function (decl, dir) {
	var node = decl.parent;

	while (node && 'rule' !== node.type) {
		node = node.parent;
	}

	if (node) {
		node = node.clone({
			raws: {}
		}).removeAll();
	} else {
		node = postcss.rule();
	}

	node.selector = `&:dir(${dir})`;

	return node;
});

var matchLogical = /^\s*logical\s+/i;
var matchLogicalBorder = /^border(-width|-style|-color)?$/i;
var matchLogicalBorderSide = /^border-(block|block-start|block-end|inline|inline-start|inline-end|start|end)(-(width|style|color))?$/i;

var transformBorder = {
	// border
	'border': function border(decl, values, dir) {
		var isLogical = matchLogical.test(values[0]);

		if (isLogical) {
			values[0] = values[0].replace(matchLogical, '');
		}

		var ltrDecls = [decl.clone({
			prop: `border-top${decl.prop.replace(matchLogicalBorder, '$1')}`,
			value: values[0]
		}), decl.clone({
			prop: `border-left${decl.prop.replace(matchLogicalBorder, '$1')}`,
			value: values[1] || values[0]
		}), decl.clone({
			prop: `border-bottom${decl.prop.replace(matchLogicalBorder, '$1')}`,
			value: values[2] || values[0]
		}), decl.clone({
			prop: `border-right${decl.prop.replace(matchLogicalBorder, '$1')}`,
			value: values[3] || values[1] || values[0]
		})];

		var rtlDecls = [decl.clone({
			prop: `border-top${decl.prop.replace(matchLogicalBorder, '$1')}`,
			value: values[0]
		}), decl.clone({
			prop: `border-right${decl.prop.replace(matchLogicalBorder, '$1')}`,
			value: values[1] || values[0]
		}), decl.clone({
			prop: `border-bottom${decl.prop.replace(matchLogicalBorder, '$1')}`,
			value: values[2] || values[0]
		}), decl.clone({
			prop: `border-left${decl.prop.replace(matchLogicalBorder, '$1')}`,
			value: values[3] || values[1] || values[0]
		})];

		return isLogical ? 1 === values.length ? decl.clone({
			value: decl.value.replace(matchLogical, '')
		}) : !values[3] || values[3] === values[1] ? [decl.clone({
			prop: `border-top${decl.prop.replace(matchLogicalBorder, '$1')}`,
			value: values[0]
		}), decl.clone({
			prop: `border-right${decl.prop.replace(matchLogicalBorder, '$1')}`,
			value: values[3] || values[1] || values[0]
		}), decl.clone({
			prop: `border-bottom${decl.prop.replace(matchLogicalBorder, '$1')}`,
			value: values[2] || values[0]
		}), decl.clone({
			prop: `border-left${decl.prop.replace(matchLogicalBorder, '$1')}`,
			value: values[1] || values[0]
		})] : 'ltr' === dir ? ltrDecls : 'rtl' === dir ? rtlDecls : [cloneRule(decl, 'ltr').append(ltrDecls), cloneRule(decl, 'rtl').append(rtlDecls)] : null;
	},

	// border-block
	'border-block': function borderBlock(decl, values) {
		return [decl.clone({
			prop: `border-top${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			value: values[0]
		}), decl.clone({
			prop: `border-bottom${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			value: values[0]
		})];
	},

	// border-block-start
	'border-block-start': function borderBlockStart(decl) {
		decl.prop = 'border-top';
	},

	// border-block-end
	'border-block-end': function borderBlockEnd(decl) {
		decl.prop = 'border-bottom';
	},

	// border-inline
	'border-inline': function borderInline(decl, values, dir) {
		var ltrDecls = [decl.clone({
			prop: `border-left${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			value: values[0]
		}), decl.clone({
			prop: `border-right${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			value: values[1] || values[0]
		})];

		var rtlDecls = [decl.clone({
			prop: `border-right${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			value: values[0]
		}), decl.clone({
			prop: `border-left${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			value: values[1] || values[0]
		})];

		var isLTR = 1 === values.length || 2 === values.length && values[0] === values[1];

		return isLTR ? ltrDecls : 'ltr' === dir ? ltrDecls : 'rtl' === dir ? rtlDecls : [cloneRule(decl, 'ltr').append(ltrDecls), cloneRule(decl, 'rtl').append(rtlDecls)];
	},

	// border-inline-start
	'border-inline-start': function borderInlineStart(decl, values, dir) {
		var ltrDecl = decl.clone({
			prop: `border-left${decl.prop.replace(matchLogicalBorderSide, '$2')}`
		});

		var rtlDecl = decl.clone({
			prop: `border-right${decl.prop.replace(matchLogicalBorderSide, '$2')}`
		});

		return 'ltr' === dir ? ltrDecl : 'rtl' === dir ? rtlDecl : [cloneRule(decl, 'ltr').append(ltrDecl), cloneRule(decl, 'rtl').append(rtlDecl)];
	},

	// border-inline-end
	'border-inline-end': function borderInlineEnd(decl, values, dir) {
		var ltrDecl = decl.clone({
			prop: `border-right${decl.prop.replace(matchLogicalBorderSide, '$2')}`
		});

		var rtlDecl = decl.clone({
			prop: `border-left${decl.prop.replace(matchLogicalBorderSide, '$2')}`
		});

		return 'ltr' === dir ? ltrDecl : 'rtl' === dir ? rtlDecl : [cloneRule(decl, 'ltr').append(ltrDecl), cloneRule(decl, 'rtl').append(rtlDecl)];
	},

	// border-start
	'border-start': function borderStart(decl, values, dir) {
		var ltrDecls = [decl.clone({
			prop: `border-top${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			value: values[0]
		}), decl.clone({
			prop: `border-left${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			value: values[1] || values[0]
		})];

		var rtlDecls = [decl.clone({
			prop: `border-top${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			value: values[0]
		}), decl.clone({
			prop: `border-right${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			value: values[1] || values[0]
		})];

		return 'ltr' === dir ? ltrDecls : 'rtl' === dir ? rtlDecls : [cloneRule(decl, 'ltr').append(ltrDecls), cloneRule(decl, 'rtl').append(rtlDecls)];
	},

	// border-end
	'border-end': function borderEnd(decl, values, dir) {
		var ltrDecls = [decl.clone({
			prop: `border-bottom${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			value: values[0]
		}), decl.clone({
			prop: `border-right${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			value: values[1] || values[0]
		})];

		var rtlDecls = [decl.clone({
			prop: `border-bottom${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			value: values[0]
		}), decl.clone({
			prop: `border-left${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			value: values[1] || values[0]
		})];

		return 'ltr' === dir ? ltrDecls : 'rtl' === dir ? rtlDecls : [cloneRule(decl, 'ltr').append(ltrDecls), cloneRule(decl, 'rtl').append(rtlDecls)];
	}
};

var transformFloat = (function (decl, values, dir) {
	var lDecl = decl.clone({ value: 'left' });
	var rDecl = decl.clone({ value: 'right' });

	return (/^inline-start$/i.test(decl.value) ? 'ltr' === dir ? lDecl : 'rtl' === dir ? rDecl : [cloneRule(decl, 'ltr').append(lDecl), cloneRule(decl, 'rtl').append(rDecl)] : /^inline-end$/i.test(decl.value) ? 'ltr' === dir ? rDecl : 'rtl' === dir ? lDecl : [cloneRule(decl, 'ltr').append(rDecl), cloneRule(decl, 'rtl').append(lDecl)] : null
	);
});

var transformInset = (function (decl, values, dir) {
	if ('logical' !== values[0]) {
		return [decl.clone({ prop: 'top', value: values[0] }), decl.clone({ prop: 'right', value: values[1] || values[0] }), decl.clone({ prop: 'bottom', value: values[2] || values[0] }), decl.clone({ prop: 'left', value: values[3] || values[1] || values[0] })];
	}

	var isLTR = !values[4] || values[4] === values[2];

	var ltrDecls = [decl.clone({ prop: 'top', value: values[1] }), decl.clone({ prop: 'left', value: values[2] || values[1] }), decl.clone({ prop: 'bottom', value: values[3] || values[1] }), decl.clone({ prop: 'right', value: values[4] || values[2] || values[1] })];

	var rtlDecls = [decl.clone({ prop: 'top', value: values[1] }), decl.clone({ prop: 'right', value: values[2] || values[1] }), decl.clone({ prop: 'bottom', value: values[3] || values[1] }), decl.clone({ prop: 'left', value: values[4] || values[2] || values[1] })];

	return isLTR || 'ltr' === dir ? ltrDecls : 'rtl' === dir ? rtlDecls : [cloneRule(decl, 'ltr').append(ltrDecls), cloneRule(decl, 'rtl').append(rtlDecls)];
});

var transformResize = (function (decl) {
	return (/^block$/i.test(decl.value) ? decl.clone({ value: 'vertical' }) : /^inline$/i.test(decl.value) ? decl.clone({ value: 'horizontal' }) : null
	);
});

var matchSide = /^(inset|margin|padding)(?:-(block|block-start|block-end|inline|inline-start|inline-end|start|end))$/i;

var matchInsetPrefix = /^inset-/i;

var cloneDecl = (function (decl, suffix, value) {
	return decl.clone({
		prop: `${decl.prop.replace(matchSide, '$1')}${suffix}`.replace(matchInsetPrefix, ''),
		value
	});
});

var transformSide = {
	// inset-block, margin-block, padding-block
	'block': function block(decl, values) {
		return [cloneDecl(decl, '-top', values[0]), cloneDecl(decl, '-bottom', values[1] || values[0])];
	},

	// inset-block-start, margin-block-start, padding-block-start
	'block-start': function blockStart(decl) {
		decl.prop = decl.prop.replace(matchSide, '$1-top').replace(matchInsetPrefix, '');
	},

	// inset-block-end, margin-block-end, padding-block-end
	'block-end': function blockEnd(decl) {
		decl.prop = decl.prop.replace(matchSide, '$1-bottom').replace(matchInsetPrefix, '');
	},

	// inset-inline, margin-inline, padding-inline
	'inline': function inline(decl, values, dir) {
		var ltrDecls = [cloneDecl(decl, '-left', values[0]), cloneDecl(decl, '-right', values[1] || values[0])];

		var rtlDecls = [cloneDecl(decl, '-right', values[0]), cloneDecl(decl, '-left', values[1] || values[0])];

		var isLTR = 1 === values.length || 2 === values.length && values[0] === values[1];

		return isLTR ? ltrDecls : 'ltr' === dir ? ltrDecls : 'rtl' === dir ? rtlDecls : [cloneRule(decl, 'ltr').append(ltrDecls), cloneRule(decl, 'rtl').append(rtlDecls)];
	},

	// inset-inline-start, margin-inline-start, padding-inline-start
	'inline-start': function inlineStart(decl, values, dir) {
		var ltrDecl = cloneDecl(decl, '-left', decl.value);
		var rtlDecl = cloneDecl(decl, '-right', decl.value);

		return 'ltr' === dir ? ltrDecl : 'rtl' === dir ? rtlDecl : [cloneRule(decl, 'ltr').append(ltrDecl), cloneRule(decl, 'rtl').append(rtlDecl)];
	},

	// inset-inline-end, margin-inline-end, padding-inline-end
	'inline-end': function inlineEnd(decl, values, dir) {
		var ltrDecl = cloneDecl(decl, '-right', decl.value);
		var rtlDecl = cloneDecl(decl, '-left', decl.value);

		return 'ltr' === dir ? ltrDecl : 'rtl' === dir ? rtlDecl : [cloneRule(decl, 'ltr').append(ltrDecl), cloneRule(decl, 'rtl').append(rtlDecl)];
	},

	// inset-start, margin-start, padding-start
	'start': function start(decl, values, dir) {
		var ltrDecls = [cloneDecl(decl, '-top', values[0]), cloneDecl(decl, '-left', values[1] || values[0])];

		var rtlDecls = [cloneDecl(decl, '-top', values[0]), cloneDecl(decl, '-right', values[1] || values[0])];

		return 'ltr' === dir ? ltrDecls : 'rtl' === dir ? rtlDecls : [cloneRule(decl, 'ltr').append(ltrDecls), cloneRule(decl, 'rtl').append(rtlDecls)];
	},

	// inset-end, margin-end, padding-end
	'end': function end(decl, values, dir) {
		var ltrDecls = [cloneDecl(decl, '-bottom', values[0]), cloneDecl(decl, '-right', values[1] || values[0])];

		var rtlDecls = [cloneDecl(decl, '-bottom', values[0]), cloneDecl(decl, '-left', values[1] || values[0])];

		return 'ltr' === dir ? ltrDecls : 'rtl' === dir ? rtlDecls : [cloneRule(decl, 'ltr').append(ltrDecls), cloneRule(decl, 'rtl').append(rtlDecls)];
	}
};

var matchSize = /^(min-|max-)?(block|inline)-(size)$/i;

var transformSize = (function (decl) {
	decl.prop = decl.prop.replace(matchSize, function ($0, minmax, flow) {
		return `${minmax || ''}${'block' === flow ? 'height' : 'width'}`;
	});
});

var transformSpacing = (function (decl, values, dir) {
	if ('logical' !== values[0]) {
		return null;
	}

	var isLTR = !values[4] || values[4] === values[2];

	var ltrDecl = decl.clone({
		value: [values[1], values[4] || values[2] || values[1], values[3] || values[1], values[2] || values[1]].join(' ')
	});

	var rtlDecl = decl.clone({
		value: [values[1], values[2] || values[1], values[3] || values[1], values[4] || values[2] || values[1]].join(' ')
	});

	return isLTR ? decl.clone({
		value: decl.value.replace(/^\s*logical\s+/i, '')
	}) : 'ltr' === dir ? ltrDecl : 'rtl' === dir ? rtlDecl : [cloneRule(decl, 'ltr').append(ltrDecl), cloneRule(decl, 'rtl').append(rtlDecl)];
});

var transformTextAlign = (function (decl, values, dir) {
	var lDecl = decl.clone({ value: 'left' });
	var rDecl = decl.clone({ value: 'right' });

	return (/^start$/i.test(decl.value) ? 'ltr' === dir ? lDecl : 'rtl' === dir ? rDecl : [cloneRule(decl, 'ltr').append(lDecl), cloneRule(decl, 'rtl').append(rDecl)] : /^end$/i.test(decl.value) ? 'ltr' === dir ? rDecl : 'rtl' === dir ? lDecl : [cloneRule(decl, 'ltr').append(rDecl), cloneRule(decl, 'rtl').append(lDecl)] : null
	);
});

var matchSupportedProperties = /^(?:(inset|margin|padding)(?:-(block|block-start|block-end|inline|inline-start|inline-end|start|end))|(min-|max-)?(block|inline)-(size))$/i;

// tooling

// supported transforms
var transforms = {
	'border': transformBorder['border'], 'border-width': transformBorder['border'], 'border-style': transformBorder['border'], 'border-color': transformBorder['border'],
	'border-block': transformBorder['border-block'], 'border-block-width': transformBorder['border-block'], 'border-block-style': transformBorder['border-block'], 'border-block-color': transformBorder['border-block'],
	'border-block-start': transformBorder['border-block-start'], 'border-block-start-width': transformBorder['border-block-start'], 'border-block-start-style': transformBorder['border-block-start'], 'border-block-start-color': transformBorder['border-block-start'],
	'border-block-end': transformBorder['border-block-end'], 'border-block-end-width': transformBorder['border-block-end'], 'border-block-end-style': transformBorder['border-block-end'], 'border-block-end-color': transformBorder['border-block-end'],
	'border-inline': transformBorder['border-inline'], 'border-inline-width': transformBorder['border-inline'], 'border-inline-style': transformBorder['border-inline'], 'border-inline-color': transformBorder['border-inline'],
	'border-inline-start': transformBorder['border-inline-start'], 'border-inline-start-width': transformBorder['border-inline-start'], 'border-inline-start-style': transformBorder['border-inline-start'], 'border-inline-start-color': transformBorder['border-inline-start'],
	'border-inline-end': transformBorder['border-inline-end'], 'border-inline-end-width': transformBorder['border-inline-end'], 'border-inline-end-style': transformBorder['border-inline-end'], 'border-inline-end-color': transformBorder['border-inline-end'],
	'border-start': transformBorder['border-start'], 'border-start-width': transformBorder['border-start'], 'border-start-style': transformBorder['border-start'], 'border-start-color': transformBorder['border-start'],
	'border-end': transformBorder['border-end'], 'border-end-width': transformBorder['border-end'], 'border-end-style': transformBorder['border-end'], 'border-end-color': transformBorder['border-end'],
	'clear': transformFloat,
	'inset': transformInset,
	'margin': transformSpacing,
	'padding': transformSpacing,
	'block': transformSide['block'],
	'block-start': transformSide['block-start'],
	'block-end': transformSide['block-end'],
	'inline': transformSide['inline'],
	'inline-start': transformSide['inline-start'],
	'inline-end': transformSide['inline-end'],
	'start': transformSide['start'],
	'end': transformSide['end'],
	'float': transformFloat,
	'resize': transformResize,
	'size': transformSize,
	'text-align': transformTextAlign
};

// plugin
var index = postcss.plugin('postcss-logical-properties', function (opts) {
	var preserve = Boolean(Object(opts).preserve);
	var dir = !preserve && typeof Object(opts).dir === 'string' ? /^rtl$/i.test(opts.dir) ? 'rtl' : 'ltr' : false;

	return function (root) {
		root.walkDecls(function (decl) {
			var values = postcss.list.split(decl.value, /^border(-block|-inline|-start|-end)?(-width|-style|-color)?$/i.test(decl.prop) ? '/' : ' ');
			var prop = decl.prop.replace(matchSupportedProperties, '$2$5').toLowerCase();

			if (prop in transforms) {
				var replacer = transforms[prop](decl, values, dir);

				if (replacer) {
					if (preserve) {
						decl.before(replacer);
					} else {
						decl.replaceWith(replacer);
					}
				}
			}
		});
	};
});

export default index;
