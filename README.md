<h1>setPhotoset</h1>
<p>JQuery Plugin / Javascript Function for Dynamic, Proportional Resizing of Images in a Photoset</p>
<p><strong><code>setPhotoset</code></strong> is a javascript function/jquery plugin for beautifully resizing images in a photoset, without cropping or aspect-ratio distortion, such that all images in a row are of the same height. [<a href="https://github.com/JZumun/setPhotoset"
    target="_blank">Github</a>]&nbsp;</p>
<h2><strong>Basic Usage</strong></h2>
<p><span style="line-height: 19.6000003814697px;"><span style="line-height: 19.6000003814697px;">The general format of&nbsp;</span><code style="line-height: 19.6000003814697px;">setPhotoset</code><span style="line-height: 19.6000003814697px;">&nbsp;is shown below:</span></span>
</p>
<pre><code>/* Javascript *<br />window.addEventListener("load",function() {<br />&nbsp;&nbsp;&nbsp;&nbsp;setPhotoset(<em>element,userOptions</em>);<br />});<br /><br /> /* JQuery */ <br />$(window).load(function() {<br />&nbsp;&nbsp;&nbsp;&nbsp;$(<em>element).setPhotoset(<em>userOptions</em>);<br />});<br /></em>/</code></pre>
<p>In both cases,&nbsp;<em>element&nbsp;</em>refers to the element node (or nodelist of elements) that contain your photoset, while&nbsp;<em>userOptions</em> is an object containing customizable options for the function (more info below).&nbsp;</p>
<p><span style="line-height: 19.6000003814697px; font-family: monospace;">setPhotoset</span><span style="line-height: 19.6000003814697px;">&nbsp;makes use of&nbsp;</span><span style="line-height: 19.6000003814697px;">&nbsp;img.naturalWidth and naturalHeight to automatically get dimensional information from the images. Because of this, the function is best called inside a window load event handler. However, if the height and width attribute of the images are provided in the markup,&nbsp;</span>
    <span style="line-height: 19.6000003814697px; font-family: monospace;">setPhotoset</span><span style="line-height: 19.6000003814697px;">&nbsp;</span><span style="line-height: 19.6000003814697px;">can be called outside an onload event handler in the following manner:</span>
</p>
<pre><code>/* Javascript */<br />setPhotoset(<em>element,</em>{pData:true,<em> userOptions</em>});<br /><br /> /* JQuery */ <br />$(<em>element).</em>setPhotoset<em>(</em>{pData:true,<em>userOptions</em>}<em>);</em></code></pre>
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
<h3>userOptions</h3>
| userOptions        | type           | default  | description |
| ------------- |:-------------:| -----:| ---- |
| layout     | string | "" | lists the number of items per row. e.g "121" |
| pData      | boolean      |   false | set to true if height and width data are available in the html |
| childHeight | string      |    "height" | name of attribute on each item that lists item's height. |
| childWidth | string      |    "width" | name of attribute on each item that lists item's width. |
| gutter | string | "" | CSS length value of desired margin between items. Does not set this margin. |
<h3>Examples</h3>
<p>For examples, visit this <a href="http://jzumun.tumblr.com/set-photoset">demo page</a>.</p>
