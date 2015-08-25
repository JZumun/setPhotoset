;var jzmn = jzmn || {};
jzmn.setPhotoset = function (photoset,userOptions) {

	/* Throws exception if photoset don't exist */
	if (!photoset) throw new Error("[setPhotoset] Element does not exist");

	/*Iterating per element*/
	if (photoset.length) {return Array.prototype.forEach.call(photoset,function(set,i) {jzmn.setPhotoset(set,userOptions)});}
	
	/*User Options extending default settings*/
	userOptions = userOptions || {};
	var settings = {
		layout: 0,				/*sets layout of photoset. If zero, acquires info from data-layout attribute if existing. else the function does nothing*/
		pData:	false,			/*set to true if initial height and width data for all children are provided using data attributes set by childHeight and childWidth. False if height and width of children are unknown. This function must then be run only when the images have been fully loaded*/
		childHeight: 'height',
		childWidth: 'width',
		gutter: 0				/*provides gutter information while calculating percentage widths. DOES NOT SET THE GUTTER*/
	};
	Object.keys(userOptions).map(function (prop) { if (prop in settings) settings[prop] = userOptions[prop]});

	var items = Array.prototype.slice.call(photoset.children);
	var setLayout = (settings.layout || photoset.getAttribute("data-layout") || "").split("").map(function(i){return parseInt(i);});
	var numRows = setLayout.length;
	
	/*Handle Items per row*/
	setLayout.reduce(function (prev,curr,layoutIndex,arr) {
		var aspects = [], widths = [];	
		var tail = prev+curr;

		var currItems = items.slice(prev,tail);
		var numItems = currItems.length;

		/*Initial Loop to add classes and populate aspect ratio array*/
		currItems.forEach(function (el,itemIndex) { 
			/*Add classes to each photoset item to apply general CSS styling*/	
			el.classList.add("photoset-item")
			if (itemIndex === numItems-1) el.classList.add("photoset-last-column");
			if (layoutIndex === numRows-1) el.classList.add("photoset-last-row");

			/*Determines aspect ratio of the current items*/
			if (settings.pData) aspects[itemIndex] = parseInt(el.getAttribute(settings.childHeight)) / parseInt(el.getAttribute(settings.childWidth));
			else aspects[itemIndex] = el.naturalWidth ? el.naturalHeight/el.naturalWidth : el.offsetHeight/el.offsetWidth;

		});
		/*	Second Loop to calculate appropriate widths and apply them to items
			If settings.gutter is nonzero, takes gutter to account using calc() 
			settings.gutter DOES NOT SET MARGINS AUTOMATICALLY. Actual margins should be defined in CSS (see setphotoset-example.css)
		*/
		currItems.forEach(function (el,itemIndex) {
			var currAspect = aspects[itemIndex];
			var k;
			/*First item needs to look ahead*/
			if (itemIndex === 0) {
				k = aspects.reduce(function (prev,curr) { return prev + currAspect/curr; },0);
				widths[itemIndex] = 100/k;	
			}
			/*Last item needs to look behind to make sure not to exceed container width*/
			else if (itemIndex === numItems-1) {
				k = widths.reduce(function (prev,curr) { return prev + curr; },0);
				widths[itemIndex] = 100 - k;
			}
			/*Standard case based on First item's width*/
			else {
				widths[itemIndex] = widths[0]*(aspects[0]/currAspect); 
			}
			el.setAttribute("style","width: " + widths[itemIndex] + "%; " + ( settings.gutter ? "width: calc(" + widths[itemIndex]/100 + "*(100% - " + (numItems - 1) + "*(" + settings.gutter + ")))" : "" ));
		})

		return tail;
	},0);
}
