'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var convertColors = require('@csstools/convert-colors');
var parser = _interopDefault(require('postcss-values-parser'));
var postcss = _interopDefault(require('postcss'));

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* Convert Degree to Hue Degree
/* ========================================================================== */

function convertDtoD(deg) {
	return deg % 360;
}

/* Convert Gradian to Hue Degree
/* ========================================================================== */

function convertGtoD(grad) {
	return grad * 0.9 % 360;
}

/* Convert Radian to Hue Degree
/* ========================================================================== */

function convertRtoD(rad) {
	return rad * 180 / Math.PI % 360;
}

/* Convert Turn to Hue Degree
/* ========================================================================== */

function convertTtoD(turn) {
	return turn * 360 % 360;
}

/* Convert a Name to Red/Green/Blue
/* ========================================================================== */

function convertNtoRGB(name) {
	var names = {
		aliceblue: [240, 248, 255],
		antiquewhite: [250, 235, 215],
		aqua: [0, 255, 255],
		aquamarine: [127, 255, 212],
		azure: [240, 255, 255],
		beige: [245, 245, 220],
		bisque: [255, 228, 196],
		black: [0, 0, 0],
		blanchedalmond: [255, 235, 205],
		blue: [0, 0, 255],
		blueviolet: [138, 43, 226],
		brown: [165, 42, 42],
		burlywood: [222, 184, 135],
		cadetblue: [95, 158, 160],
		chartreuse: [127, 255, 0],
		chocolate: [210, 105, 30],
		coral: [255, 127, 80],
		cornflowerblue: [100, 149, 237],
		cornsilk: [255, 248, 220],
		crimson: [220, 20, 60],
		cyan: [0, 255, 255],
		darkblue: [0, 0, 139],
		darkcyan: [0, 139, 139],
		darkgoldenrod: [184, 134, 11],
		darkgray: [169, 169, 169],
		darkgreen: [0, 100, 0],
		darkgrey: [169, 169, 169],
		darkkhaki: [189, 183, 107],
		darkmagenta: [139, 0, 139],
		darkolivegreen: [85, 107, 47],
		darkorange: [255, 140, 0],
		darkorchid: [153, 50, 204],
		darkred: [139, 0, 0],
		darksalmon: [233, 150, 122],
		darkseagreen: [143, 188, 143],
		darkslateblue: [72, 61, 139],
		darkslategray: [47, 79, 79],
		darkslategrey: [47, 79, 79],
		darkturquoise: [0, 206, 209],
		darkviolet: [148, 0, 211],
		deeppink: [255, 20, 147],
		deepskyblue: [0, 191, 255],
		dimgray: [105, 105, 105],
		dimgrey: [105, 105, 105],
		dodgerblue: [30, 144, 255],
		firebrick: [178, 34, 34],
		floralwhite: [255, 250, 240],
		forestgreen: [34, 139, 34],
		fuchsia: [255, 0, 255],
		gainsboro: [220, 220, 220],
		ghostwhite: [248, 248, 255],
		gold: [255, 215, 0],
		goldenrod: [218, 165, 32],
		gray: [128, 128, 128],
		green: [0, 128, 0],
		greenyellow: [173, 255, 47],
		grey: [128, 128, 128],
		honeydew: [240, 255, 240],
		hotpink: [255, 105, 180],
		indianred: [205, 92, 92],
		indigo: [75, 0, 130],
		ivory: [255, 255, 240],
		khaki: [240, 230, 140],
		lavender: [230, 230, 250],
		lavenderblush: [255, 240, 245],
		lawngreen: [124, 252, 0],
		lemonchiffon: [255, 250, 205],
		lightblue: [173, 216, 230],
		lightcoral: [240, 128, 128],
		lightcyan: [224, 255, 255],
		lightgoldenrodyellow: [250, 250, 210],
		lightgray: [211, 211, 211],
		lightgreen: [144, 238, 144],
		lightgrey: [211, 211, 211],
		lightpink: [255, 182, 193],
		lightsalmon: [255, 160, 122],
		lightseagreen: [32, 178, 170],
		lightskyblue: [135, 206, 250],
		lightslategray: [119, 136, 153],
		lightslategrey: [119, 136, 153],
		lightsteelblue: [176, 196, 222],
		lightyellow: [255, 255, 224],
		lime: [0, 255, 0],
		limegreen: [50, 205, 50],
		linen: [250, 240, 230],
		magenta: [255, 0, 255],
		maroon: [128, 0, 0],
		mediumaquamarine: [102, 205, 170],
		mediumblue: [0, 0, 205],
		mediumorchid: [186, 85, 211],
		mediumpurple: [147, 112, 219],
		mediumseagreen: [60, 179, 113],
		mediumslateblue: [123, 104, 238],
		mediumspringgreen: [0, 250, 154],
		mediumturquoise: [72, 209, 204],
		mediumvioletred: [199, 21, 133],
		midnightblue: [25, 25, 112],
		mintcream: [245, 255, 250],
		mistyrose: [255, 228, 225],
		moccasin: [255, 228, 181],
		navajowhite: [255, 222, 173],
		navy: [0, 0, 128],
		oldlace: [253, 245, 230],
		olive: [128, 128, 0],
		olivedrab: [107, 142, 35],
		orange: [255, 165, 0],
		orangered: [255, 69, 0],
		orchid: [218, 112, 214],
		palegoldenrod: [238, 232, 170],
		palegreen: [152, 251, 152],
		paleturquoise: [175, 238, 238],
		palevioletred: [219, 112, 147],
		papayawhip: [255, 239, 213],
		peachpuff: [255, 218, 185],
		peru: [205, 133, 63],
		pink: [255, 192, 203],
		plum: [221, 160, 221],
		powderblue: [176, 224, 230],
		purple: [128, 0, 128],
		rebeccapurple: [102, 51, 153],
		red: [255, 0, 0],
		rosybrown: [188, 143, 143],
		royalblue: [65, 105, 225],
		saddlebrown: [139, 69, 19],
		salmon: [250, 128, 114],
		sandybrown: [244, 164, 96],
		seagreen: [46, 139, 87],
		seashell: [255, 245, 238],
		sienna: [160, 82, 45],
		silver: [192, 192, 192],
		skyblue: [135, 206, 235],
		slateblue: [106, 90, 205],
		slategray: [112, 128, 144],
		slategrey: [112, 128, 144],
		snow: [255, 250, 250],
		springgreen: [0, 255, 127],
		steelblue: [70, 130, 180],
		tan: [210, 180, 140],
		teal: [0, 128, 128],
		thistle: [216, 191, 216],
		tomato: [255, 99, 71],
		turquoise: [64, 224, 208],
		violet: [238, 130, 238],
		wheat: [245, 222, 179],
		white: [255, 255, 255],
		whitesmoke: [245, 245, 245],
		yellow: [255, 255, 0],
		yellowgreen: [154, 205, 50]
	};

	return names[name] && names[name].map(function (c) {
		return c / 2.55;
	});
}

/* Convert a Hex to Red/Green/Blue
/* ========================================================================== */

function convertHtoRGB(hex) {
	// #<hex-color>{3,4,6,8}
	var _slice = (hex.match(hexColorMatch) || []).slice(1),
	    _slice2 = _slicedToArray(_slice, 8),
	    r = _slice2[0],
	    g = _slice2[1],
	    b = _slice2[2],
	    a = _slice2[3],
	    rr = _slice2[4],
	    gg = _slice2[5],
	    bb = _slice2[6],
	    aa = _slice2[7];

	if (rr !== undefined || r !== undefined) {
		var red = rr !== undefined ? parseInt(rr, 16) : r !== undefined ? parseInt(r + r, 16) : 0;
		var green = gg !== undefined ? parseInt(gg, 16) : g !== undefined ? parseInt(g + g, 16) : 0;
		var blue = bb !== undefined ? parseInt(bb, 16) : b !== undefined ? parseInt(b + b, 16) : 0;
		var alpha = aa !== undefined ? parseInt(aa, 16) : a !== undefined ? parseInt(a + a, 16) : 255;

		return [red, green, blue, alpha].map(function (c) {
			return c / 2.55;
		});
	}

	return undefined;
}

var hexColorMatch = /^#(?:([a-f0-9])([a-f0-9])([a-f0-9])([a-f0-9])?|([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})?)$/i;

var _slicedToArray$1 = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Color = function () {
	function Color(color) {
		_classCallCheck(this, Color);

		this.color = Object(Object(color).color || color);

		this.color.colorspace = this.color.colorspace ? this.color.colorspace : 'red' in color && 'green' in color && 'blue' in color ? 'rgb' : 'hue' in color && 'saturation' in color && 'lightness' in color ? 'hsl' : 'hue' in color && 'whiteness' in color && 'blackness' in color ? 'hwb' : 'unknown';

		if (color.colorspace === 'rgb') {
			this.color.hue = convertColors.rgb2hue(color.red, color.green, color.blue, color.hue || 0);
		}
	}

	_createClass(Color, [{
		key: 'alpha',
		value: function alpha(_alpha) {
			var color = this.color;

			return _alpha === undefined ? color.alpha : new Color(assign(color, { alpha: _alpha }));
		}
	}, {
		key: 'blackness',
		value: function blackness(_blackness) {
			var hwb = color2hwb(this.color);

			return _blackness === undefined ? hwb.blackness : new Color(assign(hwb, { blackness: _blackness }));
		}
	}, {
		key: 'blend',
		value: function blend(color, percentage) {
			var colorspace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'rgb';

			var base = this.color;

			return new Color(_blend(base, color, percentage, colorspace));
		}
	}, {
		key: 'blenda',
		value: function blenda(color, percentage) {
			var colorspace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'rgb';

			var base = this.color;

			return new Color(_blend(base, color, percentage, colorspace, true));
		}
	}, {
		key: 'blue',
		value: function blue(_blue) {
			var rgb = color2rgb(this.color);

			return _blue === undefined ? rgb.blue : new Color(assign(rgb, { blue: _blue }));
		}
	}, {
		key: 'contrast',
		value: function contrast(percentage) {
			var base = this.color;

			return new Color(_contrast(base, percentage));
		}
	}, {
		key: 'green',
		value: function green(_green) {
			var rgb = color2rgb(this.color);

			return _green === undefined ? rgb.green : new Color(assign(rgb, { green: _green }));
		}
	}, {
		key: 'hue',
		value: function hue(_hue) {
			var hsl = color2hsl(this.color);

			return _hue === undefined ? hsl.hue : new Color(assign(hsl, { hue: _hue }));
		}
	}, {
		key: 'lightness',
		value: function lightness(_lightness) {
			var hsl = color2hsl(this.color);

			return _lightness === undefined ? hsl.lightness : new Color(assign(hsl, { lightness: _lightness }));
		}
	}, {
		key: 'red',
		value: function red(_red) {
			var rgb = color2rgb(this.color);

			return _red === undefined ? rgb.red : new Color(assign(rgb, { red: _red }));
		}
	}, {
		key: 'rgb',
		value: function rgb(red, green, blue) {
			var rgb = color2rgb(this.color);

			return new Color(assign(rgb, { red, green, blue }));
		}
	}, {
		key: 'saturation',
		value: function saturation(_saturation) {
			var hsl = color2hsl(this.color);

			return _saturation === undefined ? hsl.saturation : new Color(assign(hsl, { saturation: _saturation }));
		}
	}, {
		key: 'shade',
		value: function shade(percentage) {
			var hwb = color2hwb(this.color);
			var shade = { hue: 0, whiteness: 0, blackness: 100, colorspace: 'hwb' };
			var colorspace = 'rgb';

			return percentage === undefined ? hwb.blackness : new Color(_blend(hwb, shade, percentage, colorspace));
		}
	}, {
		key: 'tint',
		value: function tint(percentage) {
			var hwb = color2hwb(this.color);
			var tint = { hue: 0, whiteness: 100, blackness: 0, colorspace: 'hwb' };
			var colorspace = 'rgb';

			return percentage === undefined ? hwb.blackness : new Color(_blend(hwb, tint, percentage, colorspace));
		}
	}, {
		key: 'whiteness',
		value: function whiteness(_whiteness) {
			var hwb = color2hwb(this.color);

			return _whiteness === undefined ? hwb.whiteness : new Color(assign(hwb, { whiteness: _whiteness }));
		}
	}, {
		key: 'toHSL',
		value: function toHSL() {
			return color2hslString(this.color);
		}
	}, {
		key: 'toHWB',
		value: function toHWB() {
			return color2hwbString(this.color);
		}
	}, {
		key: 'toLegacy',
		value: function toLegacy() {
			return color2legacyString(this.color);
		}
	}, {
		key: 'toRGB',
		value: function toRGB() {
			return color2rgbString(this.color);
		}
	}, {
		key: 'toRGBLegacy',
		value: function toRGBLegacy() {
			return color2rgbLegacyString(this.color);
		}
	}, {
		key: 'toString',
		value: function toString() {
			return color2string(this.color);
		}
	}]);

	return Color;
}();
function _blend(base, color, percentage, colorspace, isBlendingAlpha) {
	var addition = percentage / 100;
	var subtraction = 1 - addition;

	if (colorspace === 'hsl') {
		var _color2hsl = color2hsl(base),
		    h1 = _color2hsl.hue,
		    s1 = _color2hsl.saturation,
		    l1 = _color2hsl.lightness,
		    a1 = _color2hsl.alpha;

		var _color2hsl2 = color2hsl(color),
		    h2 = _color2hsl2.hue,
		    s2 = _color2hsl2.saturation,
		    l2 = _color2hsl2.lightness,
		    a2 = _color2hsl2.alpha;

		var hue = h1 * subtraction + h2 * addition,
		    saturation = s1 * subtraction + s2 * addition,
		    lightness = l1 * subtraction + l2 * addition,
		    alpha = isBlendingAlpha ? a1 * subtraction + a2 * addition : a1;


		return { hue, saturation, lightness, alpha, colorspace: 'hsl' };
	} else if (colorspace === 'hwb') {
		var _color2hwb = color2hwb(base),
		    _h = _color2hwb.hue,
		    w1 = _color2hwb.whiteness,
		    b1 = _color2hwb.blackness,
		    _a = _color2hwb.alpha;

		var _color2hwb2 = color2hwb(color),
		    _h2 = _color2hwb2.hue,
		    w2 = _color2hwb2.whiteness,
		    b2 = _color2hwb2.blackness,
		    _a2 = _color2hwb2.alpha;

		var _hue2 = _h * subtraction + _h2 * addition,
		    whiteness = w1 * subtraction + w2 * addition,
		    blackness = b1 * subtraction + b2 * addition,
		    _alpha2 = isBlendingAlpha ? _a * subtraction + _a2 * addition : _a;

		return { hue: _hue2, whiteness, blackness, alpha: _alpha2, colorspace: 'hwb' };
	} else {
		var _color2rgb = color2rgb(base),
		    r1 = _color2rgb.red,
		    g1 = _color2rgb.green,
		    _b = _color2rgb.blue,
		    _a3 = _color2rgb.alpha;

		var _color2rgb2 = color2rgb(color),
		    r2 = _color2rgb2.red,
		    g2 = _color2rgb2.green,
		    _b2 = _color2rgb2.blue,
		    _a4 = _color2rgb2.alpha;

		var red = r1 * subtraction + r2 * addition,
		    green = g1 * subtraction + g2 * addition,
		    blue = _b * subtraction + _b2 * addition,
		    _alpha3 = isBlendingAlpha ? _a3 * subtraction + _a4 * addition : _a3;

		return { red, green, blue, alpha: _alpha3, colorspace: 'rgb' };
	}
}

/* Assign channels to a new instance of a base color
/* ========================================================================== */

function assign(base, channels) {
	var color = Object.assign({}, base);

	Object.keys(channels).forEach(function (channel) {
		// detect channel
		var isHue = channel === 'hue';
		var isRGB = !isHue && blueGreenRedMatch.test(channel);

		// normalized value of the channel
		var value = normalize(channels[channel], channel);

		// assign channel to new object
		color[channel] = value;

		if (isRGB) {
			// conditionally preserve the hue
			color.hue = convertColors.rgb2hue(color.red, color.green, color.blue, base.hue || 0);
		}
	});

	return color;
}

function normalize(value, channel) {
	// detect channel
	var isHue = channel === 'hue';

	// value limitations
	var min = 0;
	var max = isHue ? 360 : 100;

	var normalizedValue = Math.min(Math.max(isHue ? value % 360 : value, min), max);

	return normalizedValue;
}

/* Convert colors
/* ========================================================================== */

function color2rgb(color) {
	var _ref = color.colorspace === 'hsl' ? convertColors.hsl2rgb(color.hue, color.saturation, color.lightness) : color.colorspace === 'hwb' ? convertColors.hwb2rgb(color.hue, color.whiteness, color.blackness) : [color.red, color.green, color.blue],
	    _ref2 = _slicedToArray$1(_ref, 3),
	    red = _ref2[0],
	    green = _ref2[1],
	    blue = _ref2[2];

	return { red, green, blue, hue: color.hue, alpha: color.alpha, colorspace: 'rgb' };
}

function color2hsl(color) {
	var _ref3 = color.colorspace === 'rgb' ? convertColors.rgb2hsl(color.red, color.green, color.blue, color.hue) : color.colorspace === 'hwb' ? convertColors.hwb2hsl(color.hue, color.whiteness, color.blackness) : [color.hue, color.saturation, color.lightness],
	    _ref4 = _slicedToArray$1(_ref3, 3),
	    hue = _ref4[0],
	    saturation = _ref4[1],
	    lightness = _ref4[2];

	return { hue, saturation, lightness, alpha: color.alpha, colorspace: 'hsl' };
}

function color2hwb(color) {
	var _ref5 = color.colorspace === 'rgb' ? convertColors.rgb2hwb(color.red, color.green, color.blue, color.hue) : color.colorspace === 'hsl' ? convertColors.hsl2hwb(color.hue, color.saturation, color.lightness) : [color.hue, color.whiteness, color.blackness],
	    _ref6 = _slicedToArray$1(_ref5, 3),
	    hue = _ref6[0],
	    whiteness = _ref6[1],
	    blackness = _ref6[2];

	return { hue, whiteness, blackness, alpha: color.alpha, colorspace: 'hwb' };
}

/* Contrast functions
/* ========================================================================== */

function _contrast(color, percentage) {
	// https://drafts.csswg.org/css-color/#contrast-adjuster
	var hwb = color2hwb(color);
	var rgb = color2rgb(color);

	// compute the luminance of the color.
	var luminance = rgb2luminance(rgb.red, rgb.green, rgb.blue);

	// the maximum-contrast color, if it is less than .5
	var maxContrastColor = luminance < 0.5
	// hwb(X, 100%, 0%), where X is the hue angle of the color
	? { hue: hwb.hue, whiteness: 100, blackness: 0, alpha: hwb.alpha, colorspace: 'hwb'
		// otherwise, hwb(X, 0%, 100%), where X is the hue angle of the color
	} : { hue: hwb.hue, whiteness: 0, blackness: 100, alpha: hwb.alpha, colorspace: 'hwb' };

	// contrast ratio
	var contrastRatio = colors2contrast(color, maxContrastColor);

	var minContrastColor = contrastRatio > 4.5
	// the color with the smallest contrast ratio with the base color that is greater than 4.5
	? colors2contrastRatioColor(hwb, maxContrastColor)
	// otherwise, the maximum-contrast color
	: maxContrastColor;

	// color(maximum-contrast blend(minimum-contrast <percentage> hwb)));
	return _blend(maxContrastColor, minContrastColor, percentage, 'hwb', false);
}

function colors2contrast(color1, color2) {
	// https://drafts.csswg.org/css-color/#contrast-ratio
	var rgb1 = color2rgb(color1);
	var rgb2 = color2rgb(color2);
	var l1 = rgb2luminance(rgb1.red, rgb1.green, rgb1.blue);
	var l2 = rgb2luminance(rgb2.red, rgb2.green, rgb2.blue);

	return l1 > l2
	// if l1 is the relative luminance of the lighter of the colors
	? (l1 + 0.05) / (l2 + 0.05)
	// otherwise, if l2 is the relative luminance of the lighter of the colors
	: (l2 + 0.05) / (l1 + 0.05);
}

function rgb2luminance(red, green, blue) {
	var _ref7 = [channel2luminance(red), channel2luminance(green), channel2luminance(blue)],
	    redLuminance = _ref7[0],
	    greenLuminance = _ref7[1],
	    blueLuminance = _ref7[2];

	// https://drafts.csswg.org/css-color/#luminance

	var luminance = 0.2126 * redLuminance + 0.7152 * greenLuminance + 0.0722 * blueLuminance;

	return luminance;
}

function channel2luminance(value) {
	// https://drafts.csswg.org/css-color/#luminance
	var luminance = value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);

	return luminance;
}

// return the smallest contrast ratio from a color and a maximum contrast (credit: @thetalecrafter)
function colors2contrastRatioColor(hwb, maxHWB) {
	var modifiedHWB = Object.assign({}, hwb);

	// values to be used for linear interpolations in HWB space
	var minW = hwb.whiteness;
	var minB = hwb.blackness;
	var maxW = maxHWB.whiteness;
	var maxB = maxHWB.blackness;

	// find the color with the smallest contrast ratio with the base color that is greater than 4.5
	while (Math.abs(minW - maxW) > 100 || Math.abs(minB - maxB) > 100) {
		var midW = Math.round((maxW + minW) / 2);
		var midB = Math.round((maxB + minB) / 2);

		modifiedHWB.whiteness = midW;
		modifiedHWB.blackness = midB;

		if (colors2contrast(modifiedHWB, hwb) > 4.5) {
			maxW = midW;
			maxB = midB;
		} else {
			minW = midW;
			minB = midB;
		}
	}

	return modifiedHWB;
}

/* Match
/* ========================================================================== */

var blueGreenRedMatch = /^(blue|green|red)$/i;

/* Stringifiers
/* ========================================================================== */

function color2string(color) {
	return color.colorspace === 'hsl' ? color2hslString(color) : color.colorspace === 'hwb' ? color2hwbString(color) : color2rgbString(color);
}

function color2hslString(color) {
	var hsl = color2hsl(color);
	var isOpaque = hsl.alpha === 100;
	var hue = hsl.hue;
	var saturation = Math.round(hsl.saturation * 10000000000) / 10000000000;
	var lightness = Math.round(hsl.lightness * 10000000000) / 10000000000;
	var alpha = Math.round(hsl.alpha * 10000000000) / 10000000000;

	return `hsl(${hue} ${saturation}% ${lightness}%${isOpaque ? '' : ` / ${alpha}%`})`;
}

function color2hwbString(color) {
	var hwb = color2hwb(color);
	var isOpaque = hwb.alpha === 100;
	var hue = hwb.hue;
	var whiteness = Math.round(hwb.whiteness * 10000000000) / 10000000000;
	var blackness = Math.round(hwb.blackness * 10000000000) / 10000000000;
	var alpha = Math.round(hwb.alpha * 10000000000) / 10000000000;

	return `hwb(${hue} ${whiteness}% ${blackness}%${isOpaque ? '' : ` / ${alpha}%`})`;
}

function color2rgbString(color) {
	var rgb = color2rgb(color);
	var isOpaque = rgb.alpha === 100;
	var red = Math.round(rgb.red * 10000000000) / 10000000000;
	var green = Math.round(rgb.green * 10000000000) / 10000000000;
	var blue = Math.round(rgb.blue * 10000000000) / 10000000000;
	var alpha = Math.round(rgb.alpha * 10000000000) / 10000000000;

	return `rgb(${red}% ${green}% ${blue}%${isOpaque ? '' : ` / ${alpha}%`})`;
}

function color2legacyString(color) {
	return color.colorspace === 'hsl' ? color2hslLegacyString(color) : color2rgbLegacyString(color);
}

function color2rgbLegacyString(color) {
	var rgb = color2rgb(color);
	var isOpaque = rgb.alpha === 100;
	var name = isOpaque ? 'rgb' : 'rgba';
	var red = Math.round(rgb.red * 255 / 100);
	var green = Math.round(rgb.green * 255 / 100);
	var blue = Math.round(rgb.blue * 255 / 100);
	var alpha = Math.round(rgb.alpha / 100 * 10000000000) / 10000000000;

	return `${name}(${red}, ${green}, ${blue}${isOpaque ? '' : `, ${alpha}`})`;
}

function color2hslLegacyString(color) {
	var hsl = color2hsl(color);
	var isOpaque = hsl.alpha === 100;
	var name = isOpaque ? 'hsl' : 'hsla';
	var hue = hsl.hue;
	var saturation = Math.round(hsl.saturation * 10000000000) / 10000000000;
	var lightness = Math.round(hsl.lightness * 10000000000) / 10000000000;
	var alpha = Math.round(hsl.alpha / 100 * 10000000000) / 10000000000;

	return `${name}(${hue}, ${saturation}%, ${lightness}%${isOpaque ? '' : `, ${alpha}`})`;
}

function manageUnresolved(node, opts, word, message) {
	if ('warn' === opts.unresolved) {
		opts.decl.warn(opts.result, message, { word });
	} else if ('ignore' !== opts.unresolved) {
		throw opts.decl.error(message, { word });
	}
}

var _slicedToArray$2 = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/* Transform AST
/* ========================================================================== */

function transformAST(node, opts) {
	node.nodes.slice(0).forEach(function (child) {
		if (isColorModFunction(child)) {
			// transform any variables within the color-mod() function
			if (opts.transformVars) {
				transformVariables(child, opts);
			}

			// transform any color-mod() functions
			var color = transformColorModFunction(child, opts);

			if (color) {
				// update the color-mod() function with the transformed value
				child.replaceWith(parser.word({
					raws: child.raws,
					value: opts.stringifier(color)
				}));
			}
		} else if (child.nodes && Object(child.nodes).length) {
			transformAST(child, opts);
		}
	});
}

/* Transform <var> functions
/* ========================================================================== */

function transformVariables(node, opts) {
	node.walk(function (child) {
		if (isVariable(child)) {
			var _transformArgsByParam = transformArgsByParams(child, [
			// <value> , [ <fallback> ]?
			[transformWord, isComma, transformNode]]),
			    _transformArgsByParam2 = _slicedToArray$2(_transformArgsByParam, 2),
			    variableName = _transformArgsByParam2[0],
			    fallbackNode = _transformArgsByParam2[1];

			if (variableName) {
				var variableNode = void 0;

				opts.result.root.walkRules(':root', function (rule) {
					rule.nodes.filter(function (rootChild) {
						return rootChild.prop === variableName;
					}).slice(-1).forEach(function (rootChild) {
						var rootChildValue = rootChild.value;

						var rootChildAST = parser(rootChildValue, { loose: true }).parse();

						transformVariables(rootChildAST, opts);

						variableNode = rootChildAST.nodes[0];
					});
				});

				if (variableNode) {
					child.replaceWith.apply(child, _toConsumableArray(variableNode.nodes));
				}
			} else if (fallbackNode) {
				transformVariables(fallbackNode, opts);

				child.replaceWith.apply(child, _toConsumableArray(fallbackNode.nodes[0].nodes));
			}
		}
	});
}

/* Transform <color> functions
/* ========================================================================== */

function transformColor(node, opts) {
	if (isRGBFunction(node)) {
		return transformRGBFunction(node, opts);
	} else if (isHSLFunction(node)) {
		return transformHSLFunction(node, opts);
	} else if (isHWBFunction(node)) {
		return transformHWBFunction(node, opts);
	} else if (isColorModFunction(node)) {
		return transformColorModFunction(node, opts);
	} else if (isHexColor(node)) {
		return transformHexColor(node, opts);
	} else if (isNamedColor(node)) {
		return transformNamedColor(node, opts);
	} else {
		return manageUnresolved(node, opts, node.value, `Expected a color`);
	}
}

// return a transformed rgb/rgba color function
function transformRGBFunction(node, opts) {
	var _transformArgsByParam3 = transformArgsByParams(node, [
	// <percentage> <percentage> <percentage> [ , <alpha-value> ]?
	[transformPercentage, transformPercentage, transformPercentage, isSlash, transformAlpha],
	// <number> <number> <number> [ , <alpha-value> ]?
	[transformRGBNumber, transformRGBNumber, transformRGBNumber, isSlash, transformAlpha],
	// <percentage> , <percentage> , <percentage> [ , <alpha-value> ]?
	[transformPercentage, isComma, transformPercentage, isComma, transformPercentage, isComma, transformAlpha],
	// <number> , <number> , <number> [ , <alpha-value> ]?
	[transformRGBNumber, isComma, transformRGBNumber, isComma, transformRGBNumber, isComma, transformAlpha]]),
	    _transformArgsByParam4 = _slicedToArray$2(_transformArgsByParam3, 4),
	    red = _transformArgsByParam4[0],
	    green = _transformArgsByParam4[1],
	    blue = _transformArgsByParam4[2],
	    _transformArgsByParam5 = _transformArgsByParam4[3],
	    alpha = _transformArgsByParam5 === undefined ? 100 : _transformArgsByParam5;

	if (red !== undefined) {
		var color = new Color({ red, green, blue, alpha, colorspace: 'rgb' });

		return color;
	} else {
		return manageUnresolved(node, opts, node.value, `Expected a valid rgb() function`);
	}
}

// return a transformed hsl/hsla color function
function transformHSLFunction(node, opts) {
	var _transformArgsByParam6 = transformArgsByParams(node, [
	// <hue> <percentage> <percentage> [ / <alpha-value> ]?
	[transformHue, transformPercentage, transformPercentage, isSlash, transformAlpha],
	// <hue> , <percentage> , <percentage> [ , <alpha-value> ]?
	[transformHue, isComma, transformPercentage, isComma, transformPercentage, isComma, transformAlpha]]),
	    _transformArgsByParam7 = _slicedToArray$2(_transformArgsByParam6, 4),
	    hue = _transformArgsByParam7[0],
	    saturation = _transformArgsByParam7[1],
	    lightness = _transformArgsByParam7[2],
	    _transformArgsByParam8 = _transformArgsByParam7[3],
	    alpha = _transformArgsByParam8 === undefined ? 100 : _transformArgsByParam8;

	if (lightness !== undefined) {
		var color = new Color({ hue, saturation, lightness, alpha, colorspace: 'hsl' });

		return color;
	} else {
		return manageUnresolved(node, opts, node.value, `Expected a valid hsl() function`);
	}
}

// return a transformed hwb color function
function transformHWBFunction(node, opts) {
	var _transformArgsByParam9 = transformArgsByParams(node, [
	// <hue> <percentage> <percentage> [ / <alpha-value> ]?
	[transformHue, transformPercentage, transformPercentage, isSlash, transformAlpha]]),
	    _transformArgsByParam10 = _slicedToArray$2(_transformArgsByParam9, 4),
	    hue = _transformArgsByParam10[0],
	    whiteness = _transformArgsByParam10[1],
	    blackness = _transformArgsByParam10[2],
	    _transformArgsByParam11 = _transformArgsByParam10[3],
	    alpha = _transformArgsByParam11 === undefined ? 100 : _transformArgsByParam11;

	if (blackness !== undefined) {
		var color = new Color({ hue, whiteness, blackness, alpha, colorspace: 'hwb' });

		return color;
	} else {
		return manageUnresolved(node, opts, node.value, `Expected a valid hwb() function`);
	}
}

// return a transformed color-mod color function
function transformColorModFunction(node, opts) {
	// [ <color> | <hue> ] <color-adjuster>*
	var _ref = (node.nodes || []).slice(1, -1) || [],
	    _ref2 = _toArray(_ref),
	    colorOrHueNode = _ref2[0],
	    adjusterNodes = _ref2.slice(1);

	if (colorOrHueNode !== undefined) {
		var color = isHue(colorOrHueNode) ? new Color({
			hue: transformHue(colorOrHueNode, opts),
			saturation: 100,
			lightness: 50,
			alpha: 100,
			colorspace: 'hsl'
		}) : transformColor(colorOrHueNode, opts);

		if (color) {
			var adjustedColor = transformColorByAdjusters(color, adjusterNodes, opts);

			return adjustedColor;
		} else {
			return manageUnresolved(node, opts, node.value, `Expected a valid color`);
		}
	} else {
		return manageUnresolved(node, opts, node.value, `Expected a valid color-mod() function`);
	}
}

// return a transformed hex color
function transformHexColor(node, opts) {
	if (hexColorMatch$1.test(node.value)) {
		// #<hex-color>{3,4,6,8}
		var _convertHtoRGB = convertHtoRGB(node.value),
		    _convertHtoRGB2 = _slicedToArray$2(_convertHtoRGB, 4),
		    red = _convertHtoRGB2[0],
		    green = _convertHtoRGB2[1],
		    blue = _convertHtoRGB2[2],
		    alpha = _convertHtoRGB2[3];

		var color = new Color({ red, green, blue, alpha });

		return color;
	} else {
		return manageUnresolved(node, opts, node.value, `Expected a valid hex color`);
	}
}

// return a transformed named-color
function transformNamedColor(node, opts) {
	if (isNamedColor(node)) {
		// <named-color>
		var _convertNtoRGB = convertNtoRGB(node.value),
		    _convertNtoRGB2 = _slicedToArray$2(_convertNtoRGB, 3),
		    red = _convertNtoRGB2[0],
		    green = _convertNtoRGB2[1],
		    blue = _convertNtoRGB2[2];

		var color = new Color({ red, green, blue, alpha: 100, colorspace: 'rgb' });

		return color;
	} else {
		return manageUnresolved(node, opts, node.value, `Expected a valid named-color`);
	}
}

/* Transform <color-adjuster> functions
/* ========================================================================== */

// return a transformed color using adjustments
function transformColorByAdjusters(color, adjusterNodes, opts) {
	var adjustedColor = adjusterNodes.reduce(function (base, node) {
		if (isAlphaBlueGreenRedAdjuster(node)) {
			return transformAlphaBlueGreenRedAdjuster(base, node, opts);
		} else if (isRGBAdjuster(node)) {
			return transformRGBAdjuster(base, node, opts);
		} else if (isHueAdjuster(node)) {
			return transformHueAdjuster(base, node, opts);
		} else if (isBlacknessLightnessSaturationWhitenessAdjuster(node)) {
			return transformBlacknessLightnessSaturationWhitenessAdjuster(base, node, opts);
		} else if (isShadeTintAdjuster(node)) {
			return transformShadeTintAdjuster(base, node, opts);
		} else if (isBlendAdjuster(node)) {
			return transformBlendAdjuster(base, node, node.value === 'blenda', opts);
		} else if (isContrastAdjuster(node)) {
			return transformContrastAdjuster(base, node, opts);
		} else {
			manageUnresolved(node, opts, node.value, `Expected a valid color adjuster`);

			return base;
		}
	}, color);

	return adjustedColor;
}

// return a transformed color using a/alpha/blue/green/red adjustments
function transformAlphaBlueGreenRedAdjuster(base, node, opts) {
	var _transformArgsByParam12 = transformArgsByParams(node, alphaMatch.test(node.value)
	// a/alpha adjustments
	? [
	// [ + | - ] <alpha-value>
	[transformMinusPlusOperator, transformAlpha],
	// * <percentage>
	[transformTimesOperator, transformPercentage],
	// <alpha-value>
	[transformAlpha]]
	// blue/green/red adjustments
	: [
	// [ + | - ] <percentage>
	[transformMinusPlusOperator, transformPercentage],
	// [ + | - ] <number>
	[transformMinusPlusOperator, transformRGBNumber],
	// * <percentage>
	[transformTimesOperator, transformPercentage],
	// <percentage>
	[transformPercentage],
	// <number>
	[transformRGBNumber]]),
	    _transformArgsByParam13 = _slicedToArray$2(_transformArgsByParam12, 2),
	    operatorOrValue = _transformArgsByParam13[0],
	    adjustment = _transformArgsByParam13[1];

	if (operatorOrValue !== undefined) {
		// normalized channel name
		var channel = node.value.toLowerCase().replace(alphaMatch, 'alpha');

		var existingValue = base[channel]();

		var modifiedValue = adjustment !== undefined ? operatorOrValue === '+' ? existingValue + Number(adjustment) : operatorOrValue === '-' ? existingValue - Number(adjustment) : operatorOrValue === '*' ? existingValue * Number(adjustment) : Number(adjustment) : Number(operatorOrValue);

		var modifiedColor = base[channel](modifiedValue);

		return modifiedColor;
	} else {
		return manageUnresolved(node, opts, node.value, `Expected a valid modifier()`);
	}
}

// return a transformed color using an rgb adjustment
function transformRGBAdjuster(base, node, opts) {
	var _transformArgsByParam14 = transformArgsByParams(node, [
	// [ + | - ] <percentage> <percentage> <percentage>
	[transformMinusPlusOperator, transformPercentage, transformPercentage, transformPercentage],
	// [ + | - ] <number> <number> <number>
	[transformMinusPlusOperator, transformRGBNumber, transformRGBNumber, transformRGBNumber],
	// [ + | - ] <hash-token>
	[transformMinusPlusOperator, transformHexColor],
	// [ * ] <percentage>
	[transformTimesOperator, transformPercentage]]),
	    _transformArgsByParam15 = _slicedToArray$2(_transformArgsByParam14, 4),
	    arg1 = _transformArgsByParam15[0],
	    arg2 = _transformArgsByParam15[1],
	    arg3 = _transformArgsByParam15[2],
	    arg4 = _transformArgsByParam15[3];

	if (arg2 !== undefined && arg2.color) {
		var modifiedColor = base.rgb(arg1 === '+' ? base.red() + arg2.red() : base.red() - arg2.red(), arg1 === '+' ? base.green() + arg2.green() : base.green() - arg2.green(), arg1 === '+' ? base.blue() + arg2.blue() : base.blue() - arg2.blue());

		return modifiedColor;
	} else if (arg1 !== undefined && minusPlusMatch.test(arg1)) {
		var _modifiedColor = base.rgb(arg1 === '+' ? base.red() + arg2 : base.red() - arg2, arg1 === '+' ? base.green() + arg3 : base.green() - arg3, arg1 === '+' ? base.blue() + arg4 : base.blue() - arg4);

		return _modifiedColor;
	} else if (arg1 !== undefined && arg2 !== undefined) {
		var _modifiedColor2 = base.rgb(base.red() * arg2, base.green() * arg2, base.blue() * arg2);

		return _modifiedColor2;
	} else {
		return manageUnresolved(node, opts, node.value, `Expected a valid rgb() adjuster`);
	}
}

// return a transformed color using a blend/blenda adjustment
function transformBlendAdjuster(base, node, isAlphaBlend, opts) {
	var _transformArgsByParam16 = transformArgsByParams(node, [[transformColor, transformPercentage, transformColorSpace]]),
	    _transformArgsByParam17 = _slicedToArray$2(_transformArgsByParam16, 3),
	    color = _transformArgsByParam17[0],
	    percentage = _transformArgsByParam17[1],
	    _transformArgsByParam18 = _transformArgsByParam17[2],
	    colorspace = _transformArgsByParam18 === undefined ? 'rgb' : _transformArgsByParam18;

	if (percentage !== undefined) {
		var modifiedColor = isAlphaBlend ? base.blenda(color.color, percentage, colorspace) : base.blend(color.color, percentage, colorspace);

		return modifiedColor;
	} else {
		return manageUnresolved(node, opts, node.value, `Expected a valid blend() adjuster)`);
	}
}

// return a transformed color using a contrast adjustment
function transformContrastAdjuster(base, node, opts) {
	var _transformArgsByParam19 = transformArgsByParams(node, [
	// <percentage>
	[transformPercentage]]),
	    _transformArgsByParam20 = _slicedToArray$2(_transformArgsByParam19, 1),
	    percentage = _transformArgsByParam20[0];

	if (percentage !== undefined) {
		var modifiedColor = base.contrast(percentage);

		return modifiedColor;
	} else {
		return manageUnresolved(node, opts, node.value, `Expected a valid contrast() adjuster)`);
	}
}

// return a transformed color using a hue adjustment
function transformHueAdjuster(base, node, opts) {
	var _transformArgsByParam21 = transformArgsByParams(node, [
	// [ + | - | * ] <angle>
	[transformMinusPlusTimesOperator, transformHue],
	// <angle>
	[transformHue]]),
	    _transformArgsByParam22 = _slicedToArray$2(_transformArgsByParam21, 2),
	    operatorOrHue = _transformArgsByParam22[0],
	    adjustment = _transformArgsByParam22[1];

	if (operatorOrHue !== undefined) {
		var existingHue = base.hue();

		var modifiedValue = adjustment !== undefined ? operatorOrHue === '+' ? existingHue + Number(adjustment) : operatorOrHue === '-' ? existingHue - Number(adjustment) : operatorOrHue === '*' ? existingHue * Number(adjustment) : Number(adjustment) : Number(operatorOrHue);

		return base.hue(modifiedValue);
	} else {
		return manageUnresolved(node, opts, node.value, `Expected a valid hue() function)`);
	}
}

// [ b | blackness | l | lightness | s | saturation | w | whiteness ]( [ + | - | * ]? <percentage> )
function transformBlacknessLightnessSaturationWhitenessAdjuster(base, node, opts) {
	var channel = node.value.toLowerCase().replace(/^b$/, 'blackness').replace(/^l$/, 'lightness').replace(/^s$/, 'saturation').replace(/^w$/, 'whiteness');

	var _transformArgsByParam23 = transformArgsByParams(node, [[transformMinusPlusTimesOperator, transformPercentage], [transformPercentage]]),
	    _transformArgsByParam24 = _slicedToArray$2(_transformArgsByParam23, 2),
	    operatorOrValue = _transformArgsByParam24[0],
	    adjustment = _transformArgsByParam24[1];

	if (operatorOrValue !== undefined) {
		var existingValue = base[channel]();

		var modifiedValue = adjustment !== undefined ? operatorOrValue === '+' ? existingValue + Number(adjustment) : operatorOrValue === '-' ? existingValue - Number(adjustment) : operatorOrValue === '*' ? existingValue * Number(adjustment) : Number(adjustment) : Number(operatorOrValue);

		return base[channel](modifiedValue);
	} else {
		return manageUnresolved(node, opts, node.value, `Expected a valid ${channel}() function)`);
	}
}

// return a transformed color using shade/tint adjustments
function transformShadeTintAdjuster(base, node, opts) {
	var channel = node.value.toLowerCase();

	var _transformArgsByParam25 = transformArgsByParams(node, [
	// [ shade | tint ]( <percentage> )
	[transformPercentage]]),
	    _transformArgsByParam26 = _slicedToArray$2(_transformArgsByParam25, 1),
	    percentage = _transformArgsByParam26[0];

	if (percentage !== undefined) {
		var modifiedValue = Number(percentage);

		return base[channel](modifiedValue);
	} else {
		return manageUnresolved(node, opts, node.value, `Expected valid ${channel}() arguments`);
	}
}

/* Argument Transforms
/* ========================================================================== */

// return a transformed color space
function transformColorSpace(node, opts) {
	if (isColorSpace(node)) {
		// [ hsl | hwb | rgb ]
		return node.value;
	} else {
		return manageUnresolved(node, opts, node.value, `Expected a valid color space)`);
	}
}

// return a transformed alpha value
function transformAlpha(node, opts) {
	if (isNumber(node)) {
		// <number>
		return node.value * 100;
	} else if (isPercentage(node)) {
		// <percentage>
		return transformPercentage(node, opts);
	} else {
		return manageUnresolved(node, opts, node.value, `Expected a valid alpha value)`);
	}
}

// return a transformed rgb number
function transformRGBNumber(node, opts) {
	if (isNumber(node)) {
		// <number>
		return node.value / 2.55;
	} else {
		return manageUnresolved(node, opts, node.value, `Expected a valid RGB value)`);
	}
}

// return a transformed hue
function transformHue(node, opts) {
	if (isHue(node)) {
		// <hue> = <number> | <angle>
		var unit = node.unit.toLowerCase();

		if (unit === 'grad') {
			// if <angle> = <gradian> (400 per circle)
			return convertGtoD(node.value);
		} else if (unit === 'rad') {
			// if <angle> = <radian> (2π per circle)
			return convertRtoD(node.value);
		} else if (unit === 'turn') {
			// if <angle> = <turn> (1 per circle)
			return convertTtoD(node.value);
		} else {
			// if <angle> = [ <degree> | <number> ] (360 per circle)
			return convertDtoD(node.value);
		}
	} else {
		return manageUnresolved(node, opts, node.value, `Expected a valid hue`);
	}
}

// return a transformed percentage
function transformPercentage(node, opts) {
	if (isPercentage(node)) {
		// <percentage>
		return Number(node.value);
	} else {
		return manageUnresolved(node, opts, node.value, `Expected a valid hue`);
	}
}

// return a transformed minus-plus operator
function transformMinusPlusOperator(node, opts) {
	if (isMinusPlusOperator(node)) {
		// [ - | + ]
		return node.value;
	} else {
		return manageUnresolved(node, opts, node.value, `Expected a plus or minus operator`);
	}
}

// return a transformed times operator
function transformTimesOperator(node, opts) {
	if (isTimesOperator(node)) {
		// [ * ]
		return node.value;
	} else {
		return manageUnresolved(node, opts, node.value, `Expected a times operator`);
	}
}

// return a transformed minus-plus-times operator
function transformMinusPlusTimesOperator(node, opts) {
	if (isMinusPlusTimesOperator(node)) {
		// [ - | + | * ]
		return node.value;
	} else {
		return manageUnresolved(node, opts, node.value, `Expected a plus, minus, or times operator`);
	}
}

/* Additional transforms
/* ========================================================================== */

function transformWord(node, opts) {
	if (isWord(node)) {
		return node.value;
	} else {
		return manageUnresolved(node, opts, node.value, `Expected a valid word`);
	}
}

function transformNode(node) {
	return Object(node);
}

/* Transform helper
/* ========================================================================== */

// return the first set of transformed arguments allowable by the parameters
function transformArgsByParams(node, params) {
	var nodes = (node.nodes || []).slice(1, -1);
	var opts = { unresolved: 'ignore' };

	return params.map(function (param) {
		return nodes.map(function (childNode, index) {
			return typeof param[index] === 'function' ? param[index](childNode, opts) : undefined;
		}).filter(function (child) {
			return typeof child !== 'boolean';
		});
	}).filter(function (param) {
		return param.every(function (result) {
			return result !== undefined;
		});
	})[0] || [];
}

/* Variable validators
/* ========================================================================== */

// return whether the node is a var function
function isVariable(node) {
	// var()
	return Object(node).type === 'func' && varMatch.test(node.value);
}

/* Adjustment validators
/* ========================================================================== */

// return whether the node is an a/alpha/blue/green/red adjuster
function isAlphaBlueGreenRedAdjuster(node) {
	// [ a(), alpha(), blue(), green(), red() ]
	return Object(node).type === 'func' && alphaBlueGreenRedMatch.test(node.value);
}

// return whether the node is an rgb adjuster
function isRGBAdjuster(node) {
	return Object(node).type === 'func' && rgbMatch.test(node.value);
}

// return whether the node is a hue adjuster
function isHueAdjuster(node) {
	// [ h() | hue() ]
	return Object(node).type === 'func' && hueMatch.test(node.value);
}

// return whether the node is a blackness/lightness/saturation/whiteness adjuster
function isBlacknessLightnessSaturationWhitenessAdjuster(node) {
	// [ b() | blackness() | l() | lightness() | s() | saturation() | w() | whiteness() ]
	return Object(node).type === 'func' && blacknessLightnessSaturationWhitenessMatch.test(node.value);
}

// return whether the node is a shade/tint adjuster
function isShadeTintAdjuster(node) {
	// [ shade() | tint() ]
	return Object(node).type === 'func' && shadeTintMatch.test(node.value);
}

// return whether the node is a blend adjuster
function isBlendAdjuster(node) {
	// [ blend(), blenda() ]
	return Object(node).type === 'func' && blendMatch.test(node.value);
}

// return whether the node is a contrast adjuster
function isContrastAdjuster(node) {
	// [ contrast() ]
	return Object(node).type === 'func' && contrastMatch.test(node.value);
}

/* Color validators
/* ========================================================================== */

// return whether the node is an rgb/rgba color function
function isRGBFunction(node) {
	// [ rgb(), rgba() ]
	return Object(node).type === 'func' && rgbaMatch.test(node.value);
}

// return whether the node is an hsl color function
function isHSLFunction(node) {
	// [ hsl(), hsla() ]
	return Object(node).type === 'func' && hslaMatch.test(node.value);
}

// return whether the node is an hwb color function
function isHWBFunction(node) {
	// hwb()
	return Object(node).type === 'func' && hwbMatch.test(node.value);
}

// return whether the node is a color-mod function
function isColorModFunction(node) {
	// color-mod()
	return Object(node).type === 'func' && colorModMatch.test(node.value);
}

// return whether the node is a valid named-color
function isNamedColor(node) {
	return Object(node).type === 'word' && Boolean(convertNtoRGB(node.value));
}

// return whether the node is a valid hex color
function isHexColor(node) {
	// #<hex-color>{3,4,6,8}
	return Object(node).type === 'word' && hexColorMatch$1.test(node.value);
}

// return whether the node is a valid color space
function isColorSpace(node) {
	// [ hsl | hwb | rgb ]
	return Object(node).type === 'word' && colorSpaceMatch.test(node.value);
}

/* Additional validators
/* ========================================================================== */

// return whether the hue value is valid
function isHue(node) {
	return Object(node).type === 'number' && hueUnitMatch.test(node.unit);
}

// return whether the comma is valid
function isComma(node) {
	return Object(node).type === 'comma';
}

// return whether the slash operator is valid
function isSlash(node) {
	return Object(node).type === 'operator' && node.value === '/';
}

// return whether the number is valid
function isNumber(node) {
	return Object(node).type === 'number' && node.unit === '';
}

// return whether the mind-plus operator is valid
function isMinusPlusOperator(node) {
	return Object(node).type === 'operator' && minusPlusMatch.test(node.value);
}

// return whether the minus-plus-times operator is valid
function isMinusPlusTimesOperator(node) {
	return Object(node).type === 'operator' && minusPlusTimesMatch.test(node.value);
}

// return whether the times operator is valid
function isTimesOperator(node) {
	return Object(node).type === 'operator' && timesMatch.test(node.value);
}

// return whether the percentage is valid
function isPercentage(node) {
	return Object(node).type === 'number' && (node.unit === '%' || node.value === '0');
}

// return whether the node is a word
function isWord(node) {
	// <word>
	return Object(node).type === 'word';
}

/* Matchers
/* ========================================================================== */

var alphaMatch = /^a(lpha)?$/i;
var alphaBlueGreenRedMatch = /^(a(lpha)?|blue|green|red)$/i;
var blacknessLightnessSaturationWhitenessMatch = /^(b(lackness)?|l(ightness)?|s(aturation)?|w(hiteness)?)$/i;
var blendMatch = /^blenda?$/i;
var colorModMatch = /^color-mod$/i;
var colorSpaceMatch = /^(hsl|hwb|rgb)$/i;
var contrastMatch = /^contrast$/i;
var hexColorMatch$1 = /^#(?:([a-f0-9])([a-f0-9])([a-f0-9])([a-f0-9])?|([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})?)$/i;
var hslaMatch = /^hsla?$/i;
var hueUnitMatch = /^(deg|grad|rad|turn)?$/i;
var hueMatch = /^h(ue)?$/i;
var hwbMatch = /^hwb$/i;
var minusPlusMatch = /^[+-]$/;
var minusPlusTimesMatch = /^[*+-]$/;
var rgbMatch = /^rgb$/i;
var rgbaMatch = /^rgba?$/i;
var shadeTintMatch = /^(shade|tint)$/i;
var varMatch = /^var$/i;
var timesMatch = /^[*]$/;

// tooling

// plugin
var index = postcss.plugin('postcss-color-mod-function', function (opts) {
	var unresolvedOpt = String(Object(opts).unresolved || 'throw').toLowerCase();
	var stringifierOpt = Object(opts).stringifier || function (color) {
		return color.toLegacy();
	};
	var transformVarsOpt = 'transformVars' in Object(opts) ? opts.transformVars : true;

	return function (root, result) {
		root.walkDecls(function (decl) {
			var originalValue = decl.value;

			if (colorModFunctionMatch.test(originalValue)) {
				var ast = parser(originalValue, { loose: true }).parse();

				transformAST(ast, {
					unresolved: unresolvedOpt,
					stringifier: stringifierOpt,
					transformVars: transformVarsOpt,
					decl,
					result
				});

				var modifiedValue = ast.toString();

				if (originalValue !== modifiedValue) {
					decl.value = modifiedValue;
				}
			}
		});
	};
});

var colorModFunctionMatch = /(^|\s)color-mod\(/i;

module.exports = index;
