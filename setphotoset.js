;var jzmn = jzmn || {};
jzmn.setPhotoset = function (elements,userOptions) {

	/* Throws exception if elements don't exist */
	if (!elements) throw new Error("[setPhotoset] Element does not exist");
	/*User Options extending default settings*/
	userOptions = userOptions || {};
	var settings = {
		layout: 0,				/*sets layout of photoset. If zero, acquires info from data-layout attribute if existing. else the function does nothing*/
		pData:	false,			/*set to true if initial height and width data for all children are provided using data attributes set by childHeight and childWidth. False if height and width of children are unknown. This function must then be run only when the images have been fully loaded*/
		childHeight: 'height',
		childWidth: 'width',
		gutter: 0				/*provides gutter information while calculating percentage widths. DOES NOT SET THE GUTTER*/
	};
	for (var key in settings) {
		if (userOptions.hasOwnProperty(key))
			settings[key] = userOptions[key];
	}

	/*Iterating per element*/
	var pSet = (elements.length) ? elements : [elements];
	Array.prototype.forEach.call(pSet, function (set,i) {
		var setLayout = settings.layout || set.getAttribute("data-layout") || "";
		var items = set.children;
		var currLayout, currOffset = 0, currItem = 0;
		var layoutIndex,j,k,z;
		var aspects = [], widths = [];		
		
	
		/*Items are handled by rows*/
		for (layoutIndex = 0; layoutIndex < setLayout.length; layoutIndex++) {
			currLayout = parseInt(setLayout.charAt(layoutIndex));

			/*Adds classes to each photoset item to apply general CSS styling (see setphotoset-example.css for an example)*/
			for (j = 0 ; j < currLayout; j++) {
				items[currItem].classList.add("photoset-item");
				if (j==currLayout-1) items[currItem].classList.add("photoset-last-column");
				if (layoutIndex==setLayout.length-1) items[currItem].classList.add("photoset-last-row");
				currItem++;
			}
			
			/*stores aspects ratios of children in an array aspects*/
			for ( j = 0 ; j < currLayout ; j++) {
				if (settings.pData) {
					aspects[j] = parseInt(items[currOffset+j].getAttribute(settings.childHeight)) / parseInt(items[currOffset+j].getAttribute(settings.childWidth));
				}
				else {
					if (items[currOffset+j].naturalWidth) 
						aspects[j] = items[currOffset+j].naturalHeight/items[currOffset+j].naturalWidth;
					else 
						aspects[j] = items[currOffset+j].offsetHeight/items[currOffset+j].offsetWidth;
				}
			}
			
			/*	
				calculates percentage width of children, stored in array j
				If settings.gutter is nonzero, takes gutter to account using calc() 
				settings.gutter DOES NOT SET MARGINS AUTOMATICALLY. Actual margins should be defined in CSS (see setphotoset-example.css)
			*/
			for (j = 0; j < currLayout; j++) {
				if (j==0) {
					for(k = 0, z = 0; z < currLayout; z++) { k += (aspects[0]/aspects[z])}
					widths[j] = 100/k;
				}
				else if (j==currLayout-1) {
					for(k = 0, z = 0; z < currLayout-1; z++) { k += widths[z]}
					widths[j] = 100 - k;
				}
				else {
					widths[j] = widths[0]*(aspects[0]/aspects[j]);
				}
				items[currOffset+j].setAttribute("style","width: " + widths[j] + "%; " + ( settings.gutter ? "width: calc(" + widths[j]/100 + "*(100% - " + (currLayout - 1) + "*(" + settings.gutter + ")))" : "" ));
			}

			/*Updates currOffset for next row*/
			currOffset += currLayout;
		}

	});

}
