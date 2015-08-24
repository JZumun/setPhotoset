<h1>setPhotoset</h1>
<p><strong><code>jzmn.setPhotoset</code></strong> is a javascript function for beautifully resizing images in a photoset, without cropping or aspect-ratio distortion, such that all images in a row are of the same height. <code>jzmn.setPhotoset</code> makes use of percentage widths, so that the photoset can work for all sizes, and can be resized without problem. [<a href="https://github.com/JZumun/jzmn.setPhotoset" target="_blank">Github</a>]</p>
<p>Like most of my coding experiments, it is encapsulated in the <code>jzmn</code> namespace. This largely means nothing.</p>
<h2>Basic Usage</h2>
<p>The general format of <code>jzmn.setPhotoset</code> is shown below:</p>
<pre><code>window.addEventListener("load",function() {
    jzmn.setPhotoset(<em>element,userOptions</em>);
});
</code></pre>
<p><em>element</em>refers to the element node (or nodelist of elements) that contains the photoset, while <em>userOptions</em> is an object containing customizable options for the function (more info below).</p>
<p><code>jzmn.setPhotoset</code> makes use of img.naturalWidth and naturalHeight to automatically get dimensional information from the images. Because of this, the function is best called inside a window load event handler. However, if the height and width attribute of the images are provided in the markup, <code>jzmn.setPhotoset</code> can be called outside an onload event handler in the following manner:</p>
<pre><code>jzmn.setPhotoset(<em>element,</em>{pData:true,<em> userOptions</em>});</code></pre>
<h2>The CSS</h2>
<p><code>setPhotoset</code> only sets the widths of the elements in the photoset using javascript. The rest of the styling is delegated to CSS, by means of attaching classes to each photoset elements.</p>
<p><code>setPhotoset</code> provides the following classes for styling hooks:
<ul>
	<li><code>photoset-item</code> - for all elements that are children of the photoset-container.</li>
	<li><code>photoset-last-column</code> - for all photoset items that are the last item in their row.</li>
	<li><code>photoset-last-row</code> - for all photoset items that are in the last row.</li>
</ul>
</p>
<p>The provided classes can then be utilized as in the following sample CSS (for more information, visit <em>set-photoset-example.css</em> in the github repository):</p>
<pre><code>
.photoset-item {
	display: block;		
	float: left;		
	margin: 5px;		
	margin-left: 0;
	margin-top: 0;
}

.photoset-last-column {
	margin-right:0;		
}

.photoset-last-column + .photoset-item {
	clear:left;			
}

.photoset-last-row {
	margin-bottom:0;	
}
</code></pre>
<h3>Examples</h3>
<p>For examples, visit this <a href="http://jzumun.tumblr.com/set-photoset">demo page</a>.</p>