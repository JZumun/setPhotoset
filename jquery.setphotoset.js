;(function( $ ){
$.fn.setPhotoset = function(options) {
	var settings = $.extend({},{
		layout: 'data-layout',
		pData:	true,
		childHeight: 'data-height',
		childWidth: 'data-width',
	},options);
	var l,m,n,x,y,z;
	var a = [], b = [];
    $.each(this, function () {
		var lay = $(this).attr(settings.layout);
		m=0;l=0;
		for (n=0;n<lay.length;n++) {
			x = parseInt(lay.charAt(n));
			for (y=0;y<x;y++) {
				$(this).children().eq(m).css('float','left')
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
