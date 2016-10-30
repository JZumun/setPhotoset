(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.setPhotoset = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var isString = function isString(thing) {
	return thing.toString() === thing;
};
var isArray = Array.isArray;
var noop = function noop() {};

var parseNum = function parseNum(i) {
	return parseInt(i, 10);
};
var arrify = function arrify(arrable) {
	return Array.prototype.slice.call(arrable);
};
var arrifyLayoutString = function arrifyLayoutString(layoutString) {
	return layoutString.charAt(0) === "[" ? layoutString.replace(/\[([0-9,]*)\]/, "$1").split(",").map(parseNum) : layoutString.split("").map(parseNum);
};
var sanitizeLayout = function sanitizeLayout(layout) {
	return isArray(layout) ? layout : isString(layout) ? arrifyLayoutString(layout) : [];
};
var sanitizeGutter = function sanitizeGutter(gutter) {
	return gutter && gutter + (isString(gutter) ? "" : "px");
};

var generateId = function generateId() {
	return Math.floor(100000 * Math.random() + 1).toString();
};
var el = function el(element) {
	if (!element) return [];
	if (isString(element)) return arrify(document.querySelectorAll(element));
	if (element.nodeType) return [element];
	if (element.length) return arrify(element);
};

var createNewStyleSheet = function createNewStyleSheet() {
	var styles = document.createElement("style");
	styles.setAttribute("type", "text/css");
	styles.setAttribute("id", "jzmn-setphotoset-styles");
	styles.appendChild(document.createTextNode(""));
	document.head.appendChild(styles);

	[".photoset-container:after {content:'';display:table;clear:both;}", ".photoset-item { display:block;float:left;margin:0;height:auto;}", ".photoset-last-column {margin-right:0;}", ".photoset-first-column {clear:left}", ".photoset-last-row {margin-bottom:0;}"].forEach(function (rule) {
		return styles.sheet.insertRule(rule, styles.sheet.cssRules.length);
	});

	return styles;
};
var groupings = {};
var styles = document.querySelector("#jzmn-setphotoset-styles");
var createStyleSheet = function createStyleSheet(_ref) {
	var grouping = _ref.grouping;
	var gutter = _ref.gutter;

	if (!styles) {
		styles = createNewStyleSheet();
	}
	if (gutter && !groupings[grouping]) {
		groupings[grouping] = gutter;
		[".photoset-" + grouping + " .photoset-item:not(.photoset-last-column) { margin-right: calc(" + gutter + "); }", ".photoset-" + grouping + " .photoset-item:not(.photoset-last-row) { margin-bottom: calc(" + gutter + "); }"].forEach(function (rule) {
			return styles.sheet.insertRule(rule, styles.sheet.cssRules.length);
		});
	}
};
var loadPhotoset = function loadPhotoset(photoset) {
	var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	var immediate = _ref2.immediate;
	var childItem = _ref2.childItem;
	var childHeight = _ref2.childHeight;
	var childWidth = _ref2.childWidth;

	return new Promise(function (resolve, reject) {
		var items = arrify(photoset.querySelectorAll(childItem));
		var complete = function complete(_) {
			return resolve(items);
		};
		var goal = items.length;

		if (immediate) {
			complete();
		};

		var incrementLoaded = function incrementLoaded(evt) {
			if (evt.target && evt.target.matches(childItem) && --goal === 0) {
				complete();
			}
		};

		items.forEach(function (img, i) {
			if (img.complete) {
				if (--goal === 0) complete();
			}
		});
		photoset.addEventListener("load", incrementLoaded, true);
		photoset.addEventListener("error", incrementLoaded, true);
	});
};

var calcAspects = function calcAspects() {
	var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	var immediate = _ref3.immediate;
	var childHeight = _ref3.childHeight;
	var childWidth = _ref3.childWidth;

	return function (items) {
		return items.map(function (item, i) {
			if (immediate) {
				return item.naturalHeight / item.naturalWidth;
			} else {
				var aspect = parseInt(item.getAttribute(childHeight)) / parseInt(item.getAttribute(childWidth));
				return isNan(aspect) ? 1 : aspect;
			}
		});
	};
};

var calcLayout = function calcLayout() {
	var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	var layout = _ref4.layout;
	var gutter = _ref4.gutter;

	return function (aspects) {
		var numRows = layout.length;
		var widths = [];

		layout.reduce(function (rowStart, rowLength, layoutIndex, layoutArray) {
			var rowEnd = rowStart + rowLength;
			var rowAspects = aspects.slice(rowStart, rowEnd);
			var numItems = rowAspects.length;

			var firstWidth = 0;
			var rowWidths = rowAspects.forEach(function (currAspect, itemIndex) {
				var width = 0;
				if (itemIndex == 0) {
					width = firstWidth = 100 / rowAspects.reduce(function (prev, curr) {
						return prev + currAspect / curr;
					}, 0);
				} else {
					width = firstWidth * (rowAspects[0] / currAspect);
				}

				var positioning = {
					firstColumn: itemIndex === 0,
					lastColumn: itemIndex === numItems - 1,
					lastRow: layoutIndex === numRows - 1
				};

				widths.push({ width: width, numItems: numItems, positioning: positioning });
			});

			return rowEnd;
		}, 0);

		return widths;
	};
};

var applyLayout = function applyLayout(photoset) {
	var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	var childItem = _ref5.childItem;
	var gutter = _ref5.gutter;

	var items = arrify(photoset.querySelectorAll(childItem));
	return function (widths) {
		widths.forEach(function (_ref6, itemIndex) {
			var width = _ref6.width;
			var numItems = _ref6.numItems;
			var _ref6$positioning = _ref6.positioning;
			var firstColumn = _ref6$positioning.firstColumn;
			var lastColumn = _ref6$positioning.lastColumn;
			var lastRow = _ref6$positioning.lastRow;

			var item = items[itemIndex];
			item.classList.add("photoset-item");
			item.classList.remove("photoset-last-column", "photoset-last-row", "photoset-first-column");
			item.setAttribute("style", "width: " + width + "%;" + (gutter ? "width: calc(" + width / 100 + "*(100% - " + (numItems - 1) + "*(" + gutter + ")));" : ""));
			if (firstColumn) item.classList.add("photoset-first-column");
			if (lastColumn) item.classList.add("photoset-last-column");
			if (lastRow) item.classList.add("photoset-last-row");
		});

		photoset.classList.remove("photoset-loading");
		return photoset;
	};
};

var setPhotoset = function setPhotoset(set) {
	var _ref7 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	var _ref7$layout = _ref7.layout;
	var layout = _ref7$layout === undefined ? null : _ref7$layout;
	var _ref7$immediate = _ref7.immediate;
	var immediate = _ref7$immediate === undefined ? false : _ref7$immediate;
	var _ref7$childItem = _ref7.childItem;
	var childItem = _ref7$childItem === undefined ? "img" : _ref7$childItem;
	var _ref7$childHeight = _ref7.childHeight;
	var childHeight = _ref7$childHeight === undefined ? "height" : _ref7$childHeight;
	var _ref7$childWidth = _ref7.childWidth;
	var childWidth = _ref7$childWidth === undefined ? "width" : _ref7$childWidth;
	var _ref7$gutter = _ref7.gutter;
	var gutter = _ref7$gutter === undefined ? 0 : _ref7$gutter;
	var _ref7$callback = _ref7.callback;
	var callback = _ref7$callback === undefined ? noop : _ref7$callback;
	var _ref7$createSheet = _ref7.createSheet;
	var createSheet = _ref7$createSheet === undefined ? true : _ref7$createSheet;
	var _ref7$layoutAttribute = _ref7.layoutAttribute;
	var layoutAttribute = _ref7$layoutAttribute === undefined ? "data-layout" : _ref7$layoutAttribute;
	var grouping = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : generateId();


	immediate = immediate || childItem != 'img';
	set = el(set);
	gutter = sanitizeGutter(gutter);
	if (createSheet) {
		createStyleSheet({ grouping: grouping, gutter: gutter });
	}

	set.forEach(function (photoset) {
		layout = sanitizeLayout(layout || photoset.getAttribute(layoutAttribute));
		photoset.classList.add("photoset-loading", "photoset-container", "photoset-" + grouping);

		loadPhotoset(photoset, { immediate: immediate, childItem: childItem }).then(calcAspects({ immediate: immediate, childHeight: childHeight, childWidth: childWidth })).then(calcLayout({ layout: layout })).then(applyLayout(photoset, { childItem: childItem, gutter: gutter })).then(callback);
	});

	return set;
};

module.exports = setPhotoset;

},{}]},{},[1])(1)
});