/*
Dynamic Resizing of Images in a Photoset

USAGE:
jzmn.setPhotoset(photoset,userOptions);
				- 
				or, 
	  if with the jzmn function 
				- 
jzmn(photoset).setPhotoset(userOptions);

ARGUMENTS
	photoset    - an element node, nodelist, or css-selector string

	userOptions - [OPTIONAL] object containing user-defined settings:
		layout      - string or array of numbers defining layout of photoset. 
					  Defaults to zero, wherein layout info is acquired from 
					  data-layout attribute if existing, or else nothing happens;

		immediate   - boolean determining whether to immediately invoke function.
					  Default is false (function executes when all IMG have loaded. If childItem is set, is assumed true). 
					  Set this to true if height and width data are provided.
					  using data attributes in the img element defined in childHeight and childWidth.

		childHeight - attribute used to retrieve height to use, if immediate. Default is 'height'
		childWidth  - attribute used to retrieve width to use, if immediate. Default is 'width'
		childItem   - CSS-selector string used to determine what elements to turn into a photoset. 
					  Default is 'img'. Requires setting appropriate childHeight and childWidth if set to something else.

		gutter      - Number or CSS measure string that sets the spacing b/w images
					  Default is zero. If string, can be any valid string inside a 
					  CSS calc() function. If number, is set in pixels.

		callback    - callback function invoked after a photoset is layouted.
					  Takes photoset DOM element as first argument

		createSheet	- boolean determining whether a stylesheet containing 
					  the needed stylings for jzmn classes shouled be created, if it doesnt exist.
					  Default is true. Set to false if you want to make your own stylesheet. See setphotoset-example.css for sample.

	grouping    - [OPTIONAL] CSS-selector friendly string to group photosets together, for similar styling. 
				  Resulting CSS selector will be of the format "photoset-{grouping}". 
				  If not provided, is randomly generated for a nodelist or jzmn collection.
RETURNS
	DOM element of photoset || Array of photoset DOM elements;
*/
var jzmn = (function(jzmn){
	"use strict";
	/*Listens to IMG events to determine if a photoset has finished loading*/
	function photosetLoaded(el,callback,args) {

		var imgs = el.querySelectorAll("img");
		var goal = imgs.length;
		
		/*Checks if any image has already finished loading*/
		Array.prototype.forEach.call(imgs, function(img,i) { if (img.complete) goal -= 1; });
		if (goal === 0) { callback.apply(el,args); return; }

		/*Instead of iterating over the images and adding a listener to all of them
			make use of useCapture to just keep it in el */
		function incrementLoaded(event) {
			if (event.target && event.target.nodeName==="IMG") goal -= 1;
			if (goal === 0) callback.apply(el,args);
		}
		el.addEventListener("load",incrementLoaded,true);
		el.addEventListener("error",incrementLoaded,true);
	}

	/*Actual function that layouts the photoset.*/
	function applyLayout(photoset,settings,grouping) {
		var items = Array.prototype.slice.call(photoset.querySelectorAll(settings.childItem));
		var setLayout = Array.isArray(settings.layout) 
			?  settings.layout 
			: (settings.layout || photoset.getAttribute("data-layout") || "")
				.split("").map(function(i){return parseInt(i);});
		var numRows = setLayout.length;

		/*Handle Items per row*/
		setLayout.reduce( function (memo,curr,layoutIndex,layoutArray) {
			var      tail = memo + curr;
			var currItems = items.slice(memo,tail);
			var  numItems = currItems.length;

			/*Initial Loop to add classes and populate aspect ratio array*/
			photoset.classList.add("photoset-container");
			photoset.classList.add("photoset-"+grouping);

			var aspects = currItems.map( function getAspects(el,itemIndex) { 
				var aspect;
				el.classList.add("photoset-item");
				el.classList.remove("photoset-last-column");
				el.classList.remove("photoset-last-row");
				if ( itemIndex   === numItems - 1 ) el.classList.add("photoset-last-column");
				if ( layoutIndex ===  numRows - 1 ) el.classList.add("photoset-last-row");

				/*Determines aspect ratio of the current items. Defaults to 1 if Image is unavailable*/
				if (settings.immediate) aspect = parseInt(el.getAttribute(settings.childHeight)) / parseInt(el.getAttribute(settings.childWidth));
				else                    aspect = el.naturalHeight/el.naturalWidth;

				if (aspect !== aspect) aspect = 1;

				return aspect;
			});

			/*  Second Loop to calculate appropriate widths and apply them to items
				If settings.gutter is nonzero, takes gutter to account using calc().
				- First items need to look ahead;
				- Last items need to look behind to make sure sum is 100%
				- Other items based on first item's width;
			*/
			var widths = [];
			var gutter = settings.gutter;
			currItems.forEach( function setWidth(el,itemIndex) {
				var currAspect = aspects[itemIndex];
				if      (itemIndex === 0){           widths[itemIndex] = 100/(aspects.reduce(function (prev,curr) { return prev + currAspect/curr; },0)); }
				else if (itemIndex === numItems-1) { widths[itemIndex] = 100 - widths.reduce(function (prev,curr) { return prev + curr; },0); }
				else {                               widths[itemIndex] = widths[0]*(aspects[0]/currAspect); }
				
				el.setAttribute("style",
					"width: " + widths[itemIndex] + "%; "
					+ (gutter ? "width: calc(" + widths[itemIndex]/100 + "*(100% - " + (numItems - 1) + "*(" + gutter + ")))" : "")
				);
			});

			return tail;
		},0);

		/*Callback*/
		if (settings.callback) settings.callback(photoset);
	}

	var groupings = {};
	function applyStyling(settings,grouping) {
		var styles = document.querySelector("#jzmn-setphotoset-styles");
		if (!styles) {
			/*Creates Stylesheet*/
			styles = document.createElement("style");
			styles.setAttribute("type","text/css");
			styles.setAttribute("id","jzmn-setphotoset-styles");
			styles.appendChild(document.createTextNode(""));
			document.head.appendChild(styles);
			
			/*Insert Universal Rules*/
			[	".photoset-container:after {content:'';display:table;clear:both;}",
				".photoset-item { display:block;float:left;margin:0;height:auto;}",
				".photoset-last-column {margin-right:0 !important;}",
				".photoset-last-column + .photoset-item {clear:left}", 
				".photoset-last-row {margin-bottom:0 !important;}"
			].forEach(function(rule) {
				styles.sheet.insertRule(rule,styles.sheet.cssRules.length);
			});
		}
		/*Insert Grouping-related Rules*/
		if (!groupings[grouping] && settings.gutter) {
			groupings[grouping] = settings.gutter;
			styles.sheet.insertRule(
				".photoset-"+grouping+" .photoset-item {margin:calc(" + settings.gutter + ");margin-left:0;margin-top:0;}",
				styles.sheet.cssRules.length
			);
		}
	}


	/*setPhotoset Interface*/
	jzmn.setPhotoset = function setPhotoset(photoset,userOptions,grouping){
		
		grouping = grouping || Math.floor(100000*Math.random()+1).toString();
		
		if (!photoset)                          throw new Error("[setPhotoset] Argument cannot be null.");
		if ( photoset.toString() === photoset)  return setPhotoset(document.querySelectorAll(photoset), userOptions, grouping);
		if ( photoset.length)                   return Array.prototype.map.call(photoset,function(set,i) { setPhotoset(set,userOptions,grouping) });
		if (!photoset.nodeType)                 throw new Error("[setPhotoset] Argument is not an Element")		

		/*User Options extending default settings*/
		userOptions = userOptions || {};
		var settings = {
			layout:         0,
			immediate:      false,
			childItem: 		"img",
			childHeight:    "height",
			childWidth:     "width",
			gutter:         0,
			callback:       null,
			createSheet: 	true
		}
		Object.keys(userOptions).map(function (prop) { if (prop in settings) settings[prop] = userOptions[prop]});

		/*Sanitize Gutter*/
		settings.gutter = settings.gutter ? ((settings.gutter.toString() === settings.gutter) ? settings.gutter : settings.gutter + "px") : null;

		/*Create Styling Rules*/
		if (settings.createSheet) applyStyling(settings,grouping);

		/* Run layouting either immediately or after all images have loaded */
		if (!settings.immediate) photosetLoaded(photoset,applyLayout,[photoset,settings,grouping]);
		else applyLayout(photoset,settings,grouping);

		return photoset;
	}

	/*If jzmn.extendFn exists, apply it to include setPhotoset with jzmn collection methods*/
	if (jzmn.extendFn) jzmn.extendFn({setPhotoset: jzmn.setPhotoset})
	return jzmn;

})(jzmn||{});