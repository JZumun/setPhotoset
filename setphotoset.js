function setPhotoset (identifier,userOptions) {
	/*User Options extending default settings*/
	userOptions = userOptions || {};
	var settings = {
		layout: 0,	/*sets layout of photoset. If zero, acquires info from data-layout attribute if existing. else the function does nothing*/
		pData:	false,	/*set to true if initial height and width data for all children are provided using data attributes set by childHeight and childWidth. False if height and width of children are unknown. This function must then be run only when the images have been fully loaded*/
		childHeight: 'height',
		childWidth: 'width'
	};
	for (var key in settings) {
		if (userOptions.hasOwnProperty(key))
			settings[key] = userOptions[key];
	}
	/*Iterating per element that matches identifier*/
	var psets = document.querySelectorAll(identifier);
	Array.prototype.forEach.call(psets, function (set,i) {
		var lay = settings.layout || set.getAttribute("data-layout") || "";
		var els = set.children;
		var cLay, cOff = 0, cEl = 0;
		var x,y;
		var a = [], b = []		
		
		/*Children are handled by rows*/
		for (x = 0; x<lay.length; x++) {
			cLay = parseInt(lay.charAt(x));
			
			/* Floats children to the left. First of every row gets clear: left */
			for (y = 0 ; y < cLay; y++) {
				els[cEl].style.float = "left";
				if (y==0) els[cEl].style.clear = "left";
				cEl++;
			}
			
			/*stores aspect ratios of elements in an array a*/
			for ( y = 0 ; y < cLay ; y++) {
				if (settings.pData) {
					a[y] = parseInt(els[cOff+y].getAttribute(settings.childHeight)) / parseInt(els[cOff+y].getAttribute(settings.childWidth));
					}
				else {
					a[y] = els[cOff+y].offsetHeight/els[cOff+y].offsetWidth;
				}
			}
			
			/*calculates percentage width of children*/
			for (y = 0; y < cLay; y++) {
				if (y==0) {
					for(k = 0, z = 0; z < cLay; z++) { k += (a[0]/a[z])}
					b[y] = 100/k;
				}
				else if (y==cLay-1) {
					for(k = 0, z = 0; z < cLay-1; z++) { k += b[z]}
					b[y] = 100 - k;
				}
				else {
					b[y] = b[0]*(a[0]/a[y]);
				}
				els[cOff+y].style.width = b[y] + "%";
			}
			cOff += cLay;
		}
		
	});
	
	return lay;
}
