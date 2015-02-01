;(function( $ ){
$.fn.setPhotoset = function(options) {
	/*User Options extending default settings*/
	var settings = $.extend({},{
		layout: 0,
						/*sets layout of photoset. If zero, acquires info from data-layout attribute if existing. else the function does nothing*/
		pData:	true,
						/*set to true if initial height and width data for all children are provided using data attributes set bychildHeight and childWidth.
						False if height and width of children are unknown. This function must then be run only when the images have been fully loaded
								*/
		childHeight: 'height',
		childWidth: 'width',
	},options);
	var l,m,n,x,y,z;
	var a = [], b = [];
	
	/*iterating per photoset container*/
    $.each(this, function () {
		$(this).children().css('float','left');
		var lay = layout || $(this).attr("data-layout") || "";
		m=0;l=0;		
		
		/*children are handled by rows*/
		for (n=0;n<lay.length;n++) {
			x = parseInt(lay.charAt(n));
			for (y=0;y<x;y++) {
				if(y==0) {$(this).children().eq(m).css('clear','left')};
				m++};
			if (settings.pData) {
				for(y=0;y<x;y++) {
					a[y] = parseInt($(this).children().eq(l+y).attr(settings.childHeight))/parseInt($(this).children().eq(l+y).attr(settings.childWidth));
				}
			}
			else {
				for(y=0;y<x;y++) {a[y] = parseInt($(this).children().eq(l+y).height())/parseInt($(this).children().eq(l+y).width());}
			}
			
			for(y=0;y<x;y++) {
				if (y==0) {
					for(i=0,z=0;z<x;z++) {i += (a[0]/a[z]);}
					b[y] = 100/i;
				}
				else if (y==x-1) {
					for(i=0,z=0;z<x-1;z++) {i += b[z];}
					b[y] = 100-i;
				}
				else {
					b[y] = b[0]*(a[0]/a[y]);
				}
				$(this).children().eq(l+y).css('width',b[y]+'%')
			}
			l+=x;
			
		}
	});
return this;
}
})(jQuery);
