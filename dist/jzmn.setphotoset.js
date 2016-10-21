(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.setPhotoset = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
		[".photoset-" + grouping + " .photoset-item:not(.photoset-last-column) { margin-right: calc(" + gutter + "); }", ".photoset-" + grouping + " .photoset-item:not(.photoset-last-row) { margin-bottom: calc(" + gutter + "); }"].forEach(function (rule) {
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
		console.log("applying layout for " + photoset);
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
			item.setAttribute("style", "width: " + width + "%;" + (gutter ? "width: calc(" + width / 100 + "*(100% - " + (numItems - 1) + "*(" + gutter + ")));" : ""));
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
			photoset.classList.add("photoset-loading", "photoset-container", "photoset-" + grouping);
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

module.exports = setPhotoset;

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanptbi5zZXRwaG90b3NldC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOzs7O0FBRUEsSUFBTSxXQUFXLFNBQVgsUUFBVyxDQUFDLEtBQUQ7QUFBQSxRQUFXLE1BQU0sUUFBTixPQUFxQixLQUFoQztBQUFBLENBQWpCO0FBQ0EsSUFBTSxPQUFPLFNBQVAsSUFBTyxHQUFJLENBQUUsQ0FBbkI7QUFDQSxJQUFNLGFBQWEsU0FBYixVQUFhO0FBQUEsUUFBSSxLQUFLLEtBQUwsQ0FBVyxTQUFPLEtBQUssTUFBTCxFQUFQLEdBQXFCLENBQWhDLEVBQW1DLFFBQW5DLEVBQUo7QUFBQSxDQUFuQjtBQUNBLElBQU0saUJBQWlCLFNBQWpCLGNBQWlCLENBQUMsTUFBRDtBQUFBLFFBQVksVUFBVyxVQUFVLFNBQVMsTUFBVCxJQUFtQixFQUFuQixHQUF3QixJQUFsQyxDQUF2QjtBQUFBLENBQXZCO0FBQ0EsSUFBTSxpQkFBaUIsU0FBakIsY0FBaUIsQ0FBQyxNQUFEO0FBQUEsUUFBYSxNQUFNLE9BQU4sQ0FBYyxNQUFkLElBQXdCLE1BQXhCLEdBQWlDLENBQUMsVUFBVSxFQUFYLEVBQWUsS0FBZixDQUFxQixFQUFyQixFQUF5QixHQUF6QixDQUE2QjtBQUFBLFNBQUcsU0FBUyxDQUFULENBQUg7QUFBQSxFQUE3QixDQUE5QztBQUFBLENBQXZCO0FBQ0EsSUFBTSxLQUFLLFNBQUwsRUFBSyxDQUFDLE9BQUQsRUFBYTtBQUN2QixLQUFJLENBQUMsT0FBTCxFQUFjLE1BQU0sSUFBSSxTQUFKLENBQWMsd0NBQWQsQ0FBTjtBQUNkLEtBQUksU0FBUyxPQUFULENBQUosRUFBdUIsT0FBTyxTQUFTLGdCQUFULENBQTBCLE9BQTFCLENBQVA7QUFDdkIsS0FBSSxRQUFRLFFBQVosRUFBc0IsT0FBTyxDQUFDLE9BQUQsQ0FBUDtBQUN0QixL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QUFBOztBQUFBO0FBTTNCLHVCQUFvQixHQUFwQiw4SEFBeUI7QUFBQSxPQUFqQixRQUFpQjs7QUFDeEIsWUFBUyxlQUFlLFVBQVUsU0FBUyxZQUFULENBQXNCLGVBQXRCLENBQXpCLENBQVQ7QUFDQSxZQUFTLFNBQVQsQ0FBbUIsR0FBbkIsQ0FBdUIsa0JBQXZCLEVBQTBDLG9CQUExQyxnQkFBMkUsUUFBM0U7QUFDQSxnQkFBYSxRQUFiLEVBQXNCLEVBQUUsb0JBQUYsRUFBYSxvQkFBYixFQUF0QixFQUNFLElBREYsQ0FDTyxZQUFZLEVBQUMsY0FBRCxFQUFRLGNBQVIsRUFBZ0Isb0JBQWhCLEVBQTJCLHdCQUEzQixFQUF3QyxzQkFBeEMsRUFBWixDQURQLEVBRUUsSUFGRixDQUVPLFFBRlA7QUFHQTtBQVowQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQWMzQixRQUFPLEdBQVA7QUFDQSxDQXpCRDs7QUEyQkEsT0FBTyxPQUFQLEdBQWlCLFdBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgaXNTdHJpbmcgPSAodGhpbmcpID0+IHRoaW5nLnRvU3RyaW5nKCkgPT09IHRoaW5nO1xuY29uc3Qgbm9vcCA9ICgpPT57fTtcbmNvbnN0IGdlbmVyYXRlSWQgPSAoKT0+TWF0aC5mbG9vcigxMDAwMDAqTWF0aC5yYW5kb20oKSsxKS50b1N0cmluZygpO1xuY29uc3Qgc2FuaXRpemVHdXR0ZXIgPSAoZ3V0dGVyKSA9PiBndXR0ZXIgJiYgKGd1dHRlciArIChpc1N0cmluZyhndXR0ZXIpID8gXCJcIiA6IFwicHhcIikpO1xuY29uc3Qgc2FuaXRpemVMYXlvdXQgPSAobGF5b3V0KSA9PiAgQXJyYXkuaXNBcnJheShsYXlvdXQpID8gbGF5b3V0IDogKGxheW91dCB8fCBcIlwiKS5zcGxpdChcIlwiKS5tYXAoaT0+cGFyc2VJbnQoaSkpO1xuY29uc3QgZWwgPSAoZWxlbWVudCkgPT4ge1xuXHRpZiAoIWVsZW1lbnQpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJbc2V0UGhvdG9zZXRdIEFyZ3VtZW50IGNhbm5vdCBiZSBudWxsLlwiKTtcblx0aWYgKGlzU3RyaW5nKGVsZW1lbnQpKSByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChlbGVtZW50KTtcblx0aWYgKGVsZW1lbnQubm9kZVR5cGUpIHJldHVybiBbZWxlbWVudF07XG5cdGlmIChlbGVtZW50Lmxlbmd0aCkgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmNvbnN0IGNyZWF0ZU5ld1N0eWxlU2hlZXQgPSAoKSA9PiB7XG5cdGNvbnN0IHN0eWxlcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcblx0c3R5bGVzLnNldEF0dHJpYnV0ZShcInR5cGVcIixcInRleHQvY3NzXCIpO1xuXHRzdHlsZXMuc2V0QXR0cmlidXRlKFwiaWRcIixcImp6bW4tc2V0cGhvdG9zZXQtc3R5bGVzXCIpO1xuXHRzdHlsZXMuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcIikpO1xuXHRkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlcyk7XG5cdFxuXHRbXHRcIi5waG90b3NldC1jb250YWluZXI6YWZ0ZXIge2NvbnRlbnQ6Jyc7ZGlzcGxheTp0YWJsZTtjbGVhcjpib3RoO31cIixcblx0XHRcIi5waG90b3NldC1pdGVtIHsgZGlzcGxheTpibG9jaztmbG9hdDpsZWZ0O21hcmdpbjowO2hlaWdodDphdXRvO31cIixcblx0XHRcIi5waG90b3NldC1sYXN0LWNvbHVtbiB7bWFyZ2luLXJpZ2h0OjA7fVwiLFxuXHRcdFwiLnBob3Rvc2V0LWZpcnN0LWNvbHVtbiB7Y2xlYXI6bGVmdH1cIixcblx0XHRcIi5waG90b3NldC1sYXN0LXJvdyB7bWFyZ2luLWJvdHRvbTowO31cIlxuXHRdLmZvckVhY2gocnVsZSA9PiBzdHlsZXMuc2hlZXQuaW5zZXJ0UnVsZShydWxlLHN0eWxlcy5zaGVldC5jc3NSdWxlcy5sZW5ndGgpKTtcblxuXHRyZXR1cm4gc3R5bGVzO1xufVxuXG5jb25zdCBncm91cGluZ3MgPSBuZXcgU2V0KCk7XG5sZXQgc3R5bGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNqem1uLXNldHBob3Rvc2V0LXN0eWxlc1wiKTtcbmNvbnN0IGNyZWF0ZVN0eWxlU2hlZXQgPSAoe2dyb3VwaW5nLCBndXR0ZXJ9KSA9PiB7XG5cdGlmICghc3R5bGVzKSB7IHN0eWxlcyA9IGNyZWF0ZU5ld1N0eWxlU2hlZXQoKTsgfVxuXHRpZiAoZ3V0dGVyICYmICFncm91cGluZ3MuaGFzKGdyb3VwaW5nKSkge1xuXHRcdGdyb3VwaW5ncy5hZGQoZ3JvdXBpbmcpO1xuXHRcdFtcblx0XHRcdGAucGhvdG9zZXQtJHtncm91cGluZ30gLnBob3Rvc2V0LWl0ZW06bm90KC5waG90b3NldC1sYXN0LWNvbHVtbikgeyBtYXJnaW4tcmlnaHQ6IGNhbGMoJHtndXR0ZXJ9KTsgfWAsXG5cdFx0XHRgLnBob3Rvc2V0LSR7Z3JvdXBpbmd9IC5waG90b3NldC1pdGVtOm5vdCgucGhvdG9zZXQtbGFzdC1yb3cpIHsgbWFyZ2luLWJvdHRvbTogY2FsYygke2d1dHRlcn0pOyB9YFxuXHRcdF0uZm9yRWFjaChydWxlPT5zdHlsZXMuc2hlZXQuaW5zZXJ0UnVsZShydWxlLHN0eWxlcy5zaGVldC5jc3NSdWxlcy5sZW5ndGgpKTtcblx0fVxufVxuXG5jb25zdCBsb2FkUGhvdG9zZXQgPSAocGhvdG9zZXQsIHtpbW1lZGlhdGUsIGNoaWxkSXRlbX0pID0+IHtcblx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLHJlamVjdCkgPT4ge1xuXHRcdGlmIChpbW1lZGlhdGUgfHwgY2hpbGRJdGVtICE9IFwiaW1nXCIpIHsgcmVzb2x2ZShwaG90b3NldCkgfTtcblxuXHRcdGNvbnN0IGluY3JlbWVudExvYWRlZCA9IChldnQpID0+IHtcblx0XHRcdGlmIChldnQudGFyZ2V0ICYmIGV2dC50YXJnZXQubWF0Y2hlcyhjaGlsZEl0ZW0pICYmIC0tZ29hbCA9PT0gMCkgeyBcblx0XHRcdFx0cmVzb2x2ZShwaG90b3NldCk7XG5cdFx0XHR9XG5cdFx0fSBcblx0XHRjb25zdCBpdGVtcyA9IEFycmF5LmZyb20ocGhvdG9zZXQucXVlcnlTZWxlY3RvckFsbChjaGlsZEl0ZW0pKTtcblx0XHRsZXQgZ29hbCA9IGl0ZW1zLmxlbmd0aDtcblxuXHRcdGl0ZW1zLmZvckVhY2goKGltZyxpKT0+IHsgaWYgKGltZy5jb21wbGV0ZSkge1xuXHRcdFx0aWYgKC0tZ29hbCA9PT0gMCkgcmVzb2x2ZShwaG90b3NldCk7XG5cdFx0fX0pO1xuXHRcdHBob3Rvc2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsaW5jcmVtZW50TG9hZGVkLHRydWUpO1xuXHRcdHBob3Rvc2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLGluY3JlbWVudExvYWRlZCx0cnVlKTtcblx0fSk7XG59XG5cbmNvbnN0IGFwcGx5TGF5b3V0ID0gKHtsYXlvdXQsZ3V0dGVyLGNoaWxkSXRlbSwgY2hpbGRIZWlnaHQsIGNoaWxkV2lkdGh9KSA9PiB7XG5cdHJldHVybiAocGhvdG9zZXQpID0+IHtcblx0XHRjb25zb2xlLmxvZyhgYXBwbHlpbmcgbGF5b3V0IGZvciAke3Bob3Rvc2V0fWApXG5cdFx0Y29uc3QgaXRlbXMgPSBBcnJheS5mcm9tKHBob3Rvc2V0LnF1ZXJ5U2VsZWN0b3JBbGwoY2hpbGRJdGVtKSk7XG5cdFx0Y29uc3QgbnVtUm93cyA9IGxheW91dC5sZW5ndGg7XG5cdFx0Y29uc3QgW2xhc3RDb2x1bW4sbGFzdFJvdyxmaXJzdENvbHVtbl0gPSBbW10sW10sW11dO1xuXHRcdGNvbnN0IHdpZHRocyA9IFtdO1xuXG5cdFx0bGF5b3V0LnJlZHVjZSggKHJvd1N0YXJ0LHJvd0xlbmd0aCxsYXlvdXRJbmRleCwgbGF5b3V0QXJyYXkpID0+IHtcblx0XHRcdGNvbnN0IHJvd0VuZCA9IHJvd1N0YXJ0ICsgcm93TGVuZ3RoO1xuXHRcdFx0Y29uc3Qgcm93SXRlbXMgPSBpdGVtcy5zbGljZShyb3dTdGFydCxyb3dFbmQpO1xuXHRcdFx0Y29uc3QgbnVtSXRlbXMgPSByb3dJdGVtcy5sZW5ndGg7XG5cblx0XHRcdGNvbnN0IGFzcGVjdHMgPSByb3dJdGVtcy5tYXAoKGl0ZW0saXRlbUluZGV4KT0+e1xuXHRcdFx0XHRpZiAoaXRlbUluZGV4ID09PSAwKSB7IGZpcnN0Q29sdW1uLnB1c2goaXRlbSk7IH1cblx0XHRcdFx0aWYgKGl0ZW1JbmRleCA9PT0gbnVtSXRlbXMgLSAxKSB7IGxhc3RDb2x1bW4ucHVzaChpdGVtKTsgfVxuXHRcdFx0XHRpZiAobGF5b3V0SW5kZXggPT09IG51bVJvd3MgLSAxKSB7IGxhc3RSb3cucHVzaChpdGVtKTsgfVxuXG5cdFx0XHRcdGNvbnN0IGFzcGVjdCA9IChpdGVtLm1hdGNoZXMoXCJpbWdcIikpID8gaXRlbS5uYXR1cmFsSGVpZ2h0L2l0ZW0ubmF0dXJhbFdpZHRoXG5cdFx0XHRcdFx0XHRcdFx0XHQ6IHBhcnNlSW50KGl0ZW0uZ2V0QXR0cmlidXRlKGNoaWxkSGVpZ2h0KSkgLyBwYXJzZUludChpdGVtLmdldEF0dHJpYnV0ZShjaGlsZFdpZHRoKSk7XG5cblx0XHRcdFx0cmV0dXJuIE51bWJlci5pc05hTihhc3BlY3QpID8gMSA6IGFzcGVjdDtcblx0XHRcdH0pO1xuXG5cdFx0XHRsZXQgZmlyc3RXaWR0aCA9IDA7XG5cdFx0XHRjb25zdCByb3dXaWR0aHMgPSBhc3BlY3RzLm1hcCgoY3VyckFzcGVjdCxpdGVtSW5kZXgpPT57XG5cdFx0XHRcdGxldCB3aWR0aCA9IDA7XG5cdFx0XHRcdGlmIChpdGVtSW5kZXggPT0gMCkgeyBcblx0XHRcdFx0XHR3aWR0aCA9IGZpcnN0V2lkdGggPSAxMDAvYXNwZWN0cy5yZWR1Y2UoKHByZXYsY3Vycik9PnByZXYgKyBjdXJyQXNwZWN0L2N1cnIsMCk7IFxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgeyBcblx0XHRcdFx0XHR3aWR0aCA9ICBmaXJzdFdpZHRoKiggYXNwZWN0c1swXS9jdXJyQXNwZWN0ICk7IFxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB7IHdpZHRoLCBudW1JdGVtcyB9O1xuXHRcdFx0fSk7XG5cdFx0XHR3aWR0aHMucHVzaCguLi5yb3dXaWR0aHMpO1xuXG5cdFx0XHRyZXR1cm4gcm93RW5kO1xuXHRcdH0sMCk7XG5cblx0XHR3aWR0aHMuZm9yRWFjaCgoe3dpZHRoLG51bUl0ZW1zfSxpdGVtSW5kZXgpPT57XG5cdFx0XHRjb25zdCBpdGVtID0gaXRlbXNbaXRlbUluZGV4XTtcblx0XHRcdGl0ZW0uY2xhc3NMaXN0LmFkZChcInBob3Rvc2V0LWl0ZW1cIik7XG5cdFx0XHRpdGVtLmNsYXNzTGlzdC5yZW1vdmUoXCJwaG90b3NldC1sYXN0LWNvbHVtblwiLFwicGhvdG9zZXQtbGFzdC1yb3dcIixcInBob3Rvc2V0LWZpcnN0LWNvbHVtblwiKTtcblx0XHRcdGl0ZW0uc2V0QXR0cmlidXRlKFwic3R5bGVcIixgd2lkdGg6ICR7d2lkdGh9JTtgICsgKCBndXR0ZXIgPyBgd2lkdGg6IGNhbGMoJHt3aWR0aC8xMDB9KigxMDAlIC0gJHtudW1JdGVtcyAtIDF9Kigke2d1dHRlcn0pKSk7YCA6IFwiXCIgKSk7XG5cdFx0fSlcblx0XHRsYXN0Q29sdW1uLmZvckVhY2goaXRlbT0+aXRlbS5jbGFzc0xpc3QuYWRkKFwicGhvdG9zZXQtbGFzdC1jb2x1bW5cIikpO1xuXHRcdGxhc3RSb3cuZm9yRWFjaChpdGVtPT5pdGVtLmNsYXNzTGlzdC5hZGQoXCJwaG90b3NldC1sYXN0LXJvd1wiKSk7XHRcblx0XHRmaXJzdENvbHVtbi5mb3JFYWNoKGl0ZW09Pml0ZW0uY2xhc3NMaXN0LmFkZChcInBob3Rvc2V0LWZpcnN0LWNvbHVtblwiKSk7XG5cdFx0cGhvdG9zZXQuY2xhc3NMaXN0LnJlbW92ZShcInBob3Rvc2V0LWxvYWRpbmdcIik7XG5cblx0XHRyZXR1cm4gcGhvdG9zZXQ7XG5cdH1cbn1cblxuY29uc3Qgc2V0UGhvdG9zZXQgPSBmdW5jdGlvbihzZXQse1xuXHRsYXlvdXQgPSBudWxsLFxuXHRpbW1lZGlhdGUgPSBmYWxzZSxcblx0Y2hpbGRJdGVtID0gXCJpbWdcIixcblx0Y2hpbGRIZWlnaHQgPSBcImhlaWdodFwiLFxuXHRjaGlsZFdpZHRoID0gXCJ3aWR0aFwiLFxuXHRndXR0ZXIgPSAwLFxuXHRjYWxsYmFjayA9IG5vb3AsXG5cdGNyZWF0ZVNoZWV0ID0gdHJ1ZSxcblx0bGF5b3V0QXR0cmlidXRlID0gXCJkYXRhLWxheW91dFwiXG59PXt9LGdyb3VwaW5nPWdlbmVyYXRlSWQoKSkge1xuXHRcblx0c2V0ID0gZWwoc2V0KTtcblx0Z3V0dGVyID0gc2FuaXRpemVHdXR0ZXIoZ3V0dGVyKTtcblx0aWYgKGNyZWF0ZVNoZWV0KSB7IGNyZWF0ZVN0eWxlU2hlZXQoe2dyb3VwaW5nLGd1dHRlcn0pOyB9XG5cblx0Zm9yKGxldCBwaG90b3NldCBvZiBzZXQpIHtcblx0XHRsYXlvdXQgPSBzYW5pdGl6ZUxheW91dChsYXlvdXQgfHwgcGhvdG9zZXQuZ2V0QXR0cmlidXRlKGxheW91dEF0dHJpYnV0ZSkpO1xuXHRcdHBob3Rvc2V0LmNsYXNzTGlzdC5hZGQoXCJwaG90b3NldC1sb2FkaW5nXCIsXCJwaG90b3NldC1jb250YWluZXJcIixgcGhvdG9zZXQtJHtncm91cGluZ31gKTtcblx0XHRsb2FkUGhvdG9zZXQocGhvdG9zZXQseyBpbW1lZGlhdGUsIGNoaWxkSXRlbX0pXG5cdFx0XHQudGhlbihhcHBseUxheW91dCh7bGF5b3V0LGd1dHRlciwgY2hpbGRJdGVtLCBjaGlsZEhlaWdodCwgY2hpbGRXaWR0aCB9KSlcblx0XHRcdC50aGVuKGNhbGxiYWNrKTtcblx0fVxuXHRcblx0cmV0dXJuIHNldDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzZXRQaG90b3NldDsiXX0=
