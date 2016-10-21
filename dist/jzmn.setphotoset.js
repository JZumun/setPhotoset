(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.jzmn = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

Object.defineProperty(exports, '__esModule', { value: true });

var isString = function isString(thing) {
	return thing.toString() === thing;
};
var noop = function noop() {};
var generateId = function generateId() {
	return Math.floor(100000 * Math.random() + 1).toString();
};
var sanitizeGutter = function sanitizeGutter(gutter) {
	return gutter && gutter + (isString(gutter) ? "" : "px");
};
var sanitizeLayout = function sanitizeLayout(layout) {
	return Array.isArray(layout) ? layout : (layout || "").split("").map(function (i) {
		return parseInt(i);
	});
};
var el = function el(element) {
	if (!element) throw new TypeError("[setPhotoset] Argument cannot be null.");
	if (isString(element)) return document.querySelectorAll(element);
	if (element.nodeType) return [element];
	if (element.length) return element;
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

var groupings = new Set();
var styles = document.querySelector("#jzmn-setphotoset-styles");
var createStyleSheet = function createStyleSheet(_ref) {
	var grouping = _ref.grouping;
	var gutter = _ref.gutter;

	if (!styles) {
		styles = createNewStyleSheet();
	}
	if (gutter && !groupings.has(grouping)) {
		groupings.add(grouping);
		['.photoset-' + grouping + ' .photoset-item:not(.photoset-last-column) { margin-right: calc(' + gutter + '); }', '.photoset-' + grouping + ' .photoset-item:not(.photoset-last-row) { margin-bottom: calc(' + gutter + '); }'].forEach(function (rule) {
			return styles.sheet.insertRule(rule, styles.sheet.cssRules.length);
		});
	}
};

var loadPhotoset = function loadPhotoset(photoset, _ref2) {
	var immediate = _ref2.immediate;
	var childItem = _ref2.childItem;

	return new Promise(function (resolve, reject) {
		if (immediate || childItem != "img") {
			resolve(photoset);
		};

		var incrementLoaded = function incrementLoaded(evt) {
			if (evt.target && evt.target.matches(childItem) && --goal === 0) {
				resolve(photoset);
			}
		};
		var items = Array.from(photoset.querySelectorAll(childItem));
		var goal = items.length;

		items.forEach(function (img, i) {
			if (img.complete) {
				if (--goal === 0) resolve(photoset);
			}
		});
		photoset.addEventListener("load", incrementLoaded, true);
		photoset.addEventListener("error", incrementLoaded, true);
	});
};

var applyLayout = function applyLayout(_ref3) {
	var layout = _ref3.layout;
	var gutter = _ref3.gutter;
	var childItem = _ref3.childItem;
	var childHeight = _ref3.childHeight;
	var childWidth = _ref3.childWidth;

	return function (photoset) {
		console.log('applying layout for ' + photoset);
		var items = Array.from(photoset.querySelectorAll(childItem));
		var numRows = layout.length;
		var lastColumn = [];
		var lastRow = [];
		var firstColumn = [];

		var widths = [];

		layout.reduce(function (rowStart, rowLength, layoutIndex, layoutArray) {
			var rowEnd = rowStart + rowLength;
			var rowItems = items.slice(rowStart, rowEnd);
			var numItems = rowItems.length;

			var aspects = rowItems.map(function (item, itemIndex) {
				if (itemIndex === 0) {
					firstColumn.push(item);
				}
				if (itemIndex === numItems - 1) {
					lastColumn.push(item);
				}
				if (layoutIndex === numRows - 1) {
					lastRow.push(item);
				}

				var aspect = item.matches("img") ? item.naturalHeight / item.naturalWidth : parseInt(item.getAttribute(childHeight)) / parseInt(item.getAttribute(childWidth));

				return Number.isNaN(aspect) ? 1 : aspect;
			});

			var firstWidth = 0;
			var rowWidths = aspects.map(function (currAspect, itemIndex) {
				var width = 0;
				if (itemIndex == 0) {
					width = firstWidth = 100 / aspects.reduce(function (prev, curr) {
						return prev + currAspect / curr;
					}, 0);
				} else {
					width = firstWidth * (aspects[0] / currAspect);
				}
				return { width: width, numItems: numItems };
			});
			widths.push.apply(widths, _toConsumableArray(rowWidths));

			return rowEnd;
		}, 0);

		widths.forEach(function (_ref4, itemIndex) {
			var width = _ref4.width;
			var numItems = _ref4.numItems;

			var item = items[itemIndex];
			item.classList.add("photoset-item");
			item.classList.remove("photoset-last-column", "photoset-last-row", "photoset-first-column");
			item.setAttribute("style", 'width: ' + width + '%;' + (gutter ? 'width: calc(' + width / 100 + '*(100% - ' + (numItems - 1) + '*(' + gutter + ')));' : ""));
		});
		lastColumn.forEach(function (item) {
			return item.classList.add("photoset-last-column");
		});
		lastRow.forEach(function (item) {
			return item.classList.add("photoset-last-row");
		});
		firstColumn.forEach(function (item) {
			return item.classList.add("photoset-first-column");
		});
		photoset.classList.remove("photoset-loading");

		return photoset;
	};
};

var setPhotoset = function setPhotoset(set) {
	var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	var _ref5$layout = _ref5.layout;
	var layout = _ref5$layout === undefined ? null : _ref5$layout;
	var _ref5$immediate = _ref5.immediate;
	var immediate = _ref5$immediate === undefined ? false : _ref5$immediate;
	var _ref5$childItem = _ref5.childItem;
	var childItem = _ref5$childItem === undefined ? "img" : _ref5$childItem;
	var _ref5$childHeight = _ref5.childHeight;
	var childHeight = _ref5$childHeight === undefined ? "height" : _ref5$childHeight;
	var _ref5$childWidth = _ref5.childWidth;
	var childWidth = _ref5$childWidth === undefined ? "width" : _ref5$childWidth;
	var _ref5$gutter = _ref5.gutter;
	var gutter = _ref5$gutter === undefined ? 0 : _ref5$gutter;
	var _ref5$callback = _ref5.callback;
	var callback = _ref5$callback === undefined ? noop : _ref5$callback;
	var _ref5$createSheet = _ref5.createSheet;
	var createSheet = _ref5$createSheet === undefined ? true : _ref5$createSheet;
	var _ref5$layoutAttribute = _ref5.layoutAttribute;
	var layoutAttribute = _ref5$layoutAttribute === undefined ? "data-layout" : _ref5$layoutAttribute;
	var grouping = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : generateId();


	set = el(set);
	gutter = sanitizeGutter(gutter);
	if (createSheet) {
		createStyleSheet({ grouping: grouping, gutter: gutter });
	}

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = set[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var photoset = _step.value;

			layout = sanitizeLayout(layout || photoset.getAttribute(layoutAttribute));
			photoset.classList.add("photoset-loading", "photoset-container", 'photoset-' + grouping);
			loadPhotoset(photoset, { immediate: immediate, childItem: childItem }).then(applyLayout({ layout: layout, gutter: gutter, childItem: childItem, childHeight: childHeight, childWidth: childWidth })).then(callback);
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	return set;
};

exports.setPhotoset = setPhotoset;

},{}]},{},[1])(1)
});