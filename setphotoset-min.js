;(function($){$.fn.setPhotoset=function(d){var e=$.extend({},{layout:'data-layout',pData:true,childHeight:'data-height',childWidth:'data-width',},d);var l,m,n,x,y,z;var a=[],b=[];$.each(this,function(){var c=$(this).attr(e.layout);m=0;l=0;for(n=0;n<c.length;n++){x=parseInt(c.charAt(n));for(y=0;y<x;y++){$(this).children().eq(m).css('float','left');if(y==0){$(this).children().eq(m).css('clear','left')};m++};if(e.pData){for(y=0;y<x;y++){a[y]=parseInt($(this).children().eq(l+y).attr(e.childHeight))/parseInt($(this).children().eq(l+y).attr(e.childWidth))}}else{for(y=0;y<x;y++){a[y]=parseInt($(this).children().eq(l+y).height())/parseInt($(this).children().eq(l+y).width())}}for(y=0;y<x;y++){if(y==0){for(i=0,z=0;z<x;z++){i+=(a[0]/a[z])}b[y]=100/i}else if(y==x-1){for(i=0,z=0;z<x-1;z++){i+=b[z]}b[y]=100-i}else{b[y]=b[0]*(a[0]/a[y])}$(this).children().eq(l+y).css('width',b[y]+'%')}l+=x}});return this}})(jQuery);
