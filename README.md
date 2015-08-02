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
<h2>Example</h2>
<p>Suppose you have a set of five images, which you want to lay out into 2 rows, with 2 images on the first row and the 3 on the second.</p>
<pre><code>&lt;div class="photoset" id="#photoset1"&gt;<br />&nbsp;&nbsp;&nbsp;&nbsp;&lt;img src="1.png" /&gt;<br />&nbsp;&nbsp;&nbsp;&nbsp;&lt;img src="2.png" /&gt;<br />&nbsp;&nbsp;&nbsp;&nbsp;&lt;img src="3.png" /&gt;<br />&nbsp;&nbsp;&nbsp;&nbsp;&lt;img src="4.png" /&gt;<br />&nbsp;&nbsp;&nbsp;&nbsp;&lt;img src="5.png" /&gt;<br />&lt;/div&gt;
</code></pre>
<p>Without <code>setPhotoset</code>, this set will look something like the following. Note that the following has been scaled by 50%, because at original scale, it was very tall.</p>
<div class="set-example" id="example1">
    <img src="http://36.media.tumblr.com/bc89569703eab6abbdad7ed2c6d8f0a6/tumblr_nl8w6f8ZAf1qhqme0o1_250.png" />
    <img src="http://41.media.tumblr.com/b0a4f04c924bc7bf2df544d26aaf2686/tumblr_nl8w6f8ZAf1qhqme0o2_400.png" />
    <img src="http://40.media.tumblr.com/64c3ca8afec7f5c1678436a03a312fa2/tumblr_nl8w6f8ZAf1qhqme0o3_250.png" />
    <img src="http://41.media.tumblr.com/0c9a6bc78bc44ef488ff2f585ce47077/tumblr_nl8w6f8ZAf1qhqme0o4_400.png" />
    <img src="http://40.media.tumblr.com/b5b898014b7caebf8009178fa38e0010/tumblr_nl8w6f8ZAf1qhqme0o5_250.png" />
</div>
<p>Applying&nbsp; <code>setPhotoset</code>, we get:</p>
<pre><code>var photoset = document.querySelector("#photoset1");<br />setPhotoset(photoset,{layout:"23"});<br />
/* or, in JQuery */<br />$("#photoset1").setPhotoset({layout:"23"});</code></pre>
<p>Now it would look like</p>
<div class="set-example" id="example2">
    <img src="http://36.media.tumblr.com/bc89569703eab6abbdad7ed2c6d8f0a6/tumblr_nl8w6f8ZAf1qhqme0o1_250.png" />
    <img src="http://41.media.tumblr.com/b0a4f04c924bc7bf2df544d26aaf2686/tumblr_nl8w6f8ZAf1qhqme0o2_400.png" />
    <img src="http://40.media.tumblr.com/64c3ca8afec7f5c1678436a03a312fa2/tumblr_nl8w6f8ZAf1qhqme0o3_250.png" />
    <img src="http://41.media.tumblr.com/0c9a6bc78bc44ef488ff2f585ce47077/tumblr_nl8w6f8ZAf1qhqme0o4_400.png" />
    <img src="http://40.media.tumblr.com/b5b898014b7caebf8009178fa38e0010/tumblr_nl8w6f8ZAf1qhqme0o5_250.png" />
</div>
<h2><strong>Multiple Photosets</strong></h2>
<p>a single <code>setPhotoset</code> function call is capable of serving multiple photosets with different layouts, as long as a <code>data-layout</code> attribute is specified per photoset:</p>
<pre><code>&lt;div class="photoset" id="#photoset1" data-layout="23"&gt;<br />&nbsp;&nbsp;&nbsp;&nbsp;&lt;img src="1.png" /&gt;<br />&nbsp;&nbsp;&nbsp;&nbsp;&lt;img src="2.png" /&gt;<br />&nbsp;&nbsp;&nbsp;&nbsp;&lt;img src="3.png" /&gt;<br />&nbsp;&nbsp;&nbsp;&nbsp;&lt;img src="4.png" /&gt;<br />&nbsp;&nbsp;&nbsp;&nbsp;&lt;img src="5.png" /&gt;<br />&lt;/div&gt;
&lt;div class="photoset" id="#photoset2" data-layout="121" &gt;<br />&nbsp;&nbsp;&nbsp;&nbsp;&lt;img src="6.png" /&gt;<br />&nbsp;&nbsp;&nbsp;&nbsp;&lt;img src="7.png" /&gt;<br />&nbsp;&nbsp;&nbsp;&nbsp;&lt;img src="8.png" /&gt;<br />&nbsp;&nbsp;&nbsp;&nbsp;&lt;img src="9.png" /&gt;<br />&lt;/div&gt;
</code></pre>
<p>In this case, the javascript code is:</p>
<pre><code>var photosets = document.querySelectorAll(".photoset");<br />setPhotoset(photosets);<br />
/* or, in JQuery */<br />$(".photoset").setPhotoset();</code></pre>
<p>If <code>data-layout</code>&nbsp;is not specified for an element in this case, setPhotoset won&rsquo;t do anything to that set.</p>
<div class="set-example" id="example3">
    <div class="photoset" data-layout="23">
        <img src="http://36.media.tumblr.com/bc89569703eab6abbdad7ed2c6d8f0a6/tumblr_nl8w6f8ZAf1qhqme0o1_250.png" />
        <img src="http://41.media.tumblr.com/b0a4f04c924bc7bf2df544d26aaf2686/tumblr_nl8w6f8ZAf1qhqme0o2_400.png" />
        <img src="http://40.media.tumblr.com/64c3ca8afec7f5c1678436a03a312fa2/tumblr_nl8w6f8ZAf1qhqme0o3_250.png" />
        <img src="http://41.media.tumblr.com/0c9a6bc78bc44ef488ff2f585ce47077/tumblr_nl8w6f8ZAf1qhqme0o4_400.png" />
        <img src="http://40.media.tumblr.com/b5b898014b7caebf8009178fa38e0010/tumblr_nl8w6f8ZAf1qhqme0o5_250.png" />
    </div>
    <div class="photoset" data-layout="121">
        <img src="http://40.media.tumblr.com/c4a8d6a6003a9680fa82ccc5b16d030b/tumblr_nl8w6f8ZAf1qhqme0o6_250.png" />
        <img src="http://40.media.tumblr.com/5f11a300cfddebda3c04cdd9b03e07b9/tumblr_nl8w6f8ZAf1qhqme0o7_250.png" />
        <img src="http://41.media.tumblr.com/1d7f893e13e5b8857f8709ecdda2e408/tumblr_nl8w6f8ZAf1qhqme0o8_250.png" />
        <img src="http://36.media.tumblr.com/98e22e46a8b3b36f60247ea859e74d6a/tumblr_nl8w6f8ZAf1qhqme0o9_400.png" />
    </div>
</div>
<h2><strong>A Photoset of&hellip; <em>not</em> Photos?</strong></h2>
<p><code>setPhotoset</code>&nbsp;uses img.naturalWidth and naturalHeight to automatically get dimensional information from the images. If the children of the element is not an img (or if the browser does not support naturalWidth/Height), it might be necessary
    to explicitly define the dimensions on these children. This could be the case if the images are wrapped in anchor tags</p>
<p>This is done by defining width and height attributes per child, and setting&nbsp;<code>pData</code> to true in <em>userOptions</em>. Alternatively, user-defined attributes can also be used (such as <em>data-height</em> and <em>data-width</em>, for example,
    on elements where <em>width</em> and <em>height</em> attributes are not semantically appropriate), as long as the <code>setPhotoset</code> function call sets <code>childHeight</code> and <code>childWidth</code> in <em>userOptions</em> to the name of these attributes.</p>
<p>In the following example:</p>
<pre><code>&lt;div class="photoset" id="#photoset1" data-layout="12" &gt;<br />&nbsp;&nbsp;&nbsp;&nbsp;&lt;a href="1.png" data-height="200" data-width"200"&gt;<br />&nbsp;&nbsp;&nbsp;&nbsp; &lt;img src="1.png" /&gt;<br />&nbsp;&nbsp;&nbsp;&nbsp;&lt;/a&gt;<br />&nbsp;&nbsp;&nbsp;&nbsp;&lt;a href="2.png" data-height="150" data-width"300"&gt;<br />&nbsp;&nbsp;&nbsp;&nbsp; &lt;img src="2.png" /&gt;<br />&nbsp;&nbsp;&nbsp;&nbsp;&lt;/a&gt;<br />&nbsp;&nbsp;&nbsp;&nbsp;&lt;a href="1.png" data-height="200" data-width"150"&gt;<br />&nbsp;&nbsp;&nbsp;&nbsp; &lt;img src="1.png" /&gt;<br />&nbsp;&nbsp;&nbsp;&nbsp;&lt;/a&gt;&lt;/div&gt;
</code></pre>
<p>Using the following javascript code will work:</p>
<pre><code>var photoset = document.querySelector("#photoset1")<br />setPhotoset(photoset,{pData:true, childHeight:'data-height', childWidth: 'data-width'});<br />
/* or, in JQuery */<br />$("#photoset1").setPhotoset({pData:true, childHeight:'data-height', childWidth: 'data-width'});</code></pre>
<div class="set-example" id="example4" data-layout="12">
    <a href="#" data-width="200" data-height="200">
        <img src="http://36.media.tumblr.com/bc89569703eab6abbdad7ed2c6d8f0a6/tumblr_nl8w6f8ZAf1qhqme0o1_250.png" />
    </a>
    <a href="#" data-width="300" data-height="150">
        <img src="http://41.media.tumblr.com/b0a4f04c924bc7bf2df544d26aaf2686/tumblr_nl8w6f8ZAf1qhqme0o2_400.png" />
    </a>
    <a href="#" data-width="150" data-height="200">
        <img src="http://40.media.tumblr.com/64c3ca8afec7f5c1678436a03a312fa2/tumblr_nl8w6f8ZAf1qhqme0o3_250.png" />
    </a>
</div>
<h2>Gutters</h2>
<p>With the Javascript function, You can now set gutters using the following syntax:</p>
<pre><code>
setPhotoset(<em>photoset</em>,{gutter:<em>gutterWidth</em>});</code></pre>
<p><em>gutterWidth</em> is a string representing the width of the gutter.  It can be in px or em, or in fact any expression valid within a css <code>calc()</code> function. This is because, when calculating for the width of photoset items with gutters, <code>calc()</code> is used. If the browser does not support <code>calc()</code>, then the default, percentage only width is still provided.</p>
<p>Here is what our first photoset would look like if the pictures had margins of 5px, using the following javascript code:</p>
<pre><code>var photoset = document.querySelector("#example5");
setPhotoset(photoset,{gutter:<em>gutterWidth</em>});</code></pre>
<div class="set-example" id="example5">
    <img src="http://36.media.tumblr.com/bc89569703eab6abbdad7ed2c6d8f0a6/tumblr_nl8w6f8ZAf1qhqme0o1_250.png" />
    <img src="http://41.media.tumblr.com/b0a4f04c924bc7bf2df544d26aaf2686/tumblr_nl8w6f8ZAf1qhqme0o2_400.png" />
    <img src="http://40.media.tumblr.com/64c3ca8afec7f5c1678436a03a312fa2/tumblr_nl8w6f8ZAf1qhqme0o3_250.png" />
    <img src="http://41.media.tumblr.com/0c9a6bc78bc44ef488ff2f585ce47077/tumblr_nl8w6f8ZAf1qhqme0o4_400.png" />
    <img src="http://40.media.tumblr.com/b5b898014b7caebf8009178fa38e0010/tumblr_nl8w6f8ZAf1qhqme0o5_250.png" />
</div>

<h1>Known Issues</h1>
<p><code>setPhotoset</code>'s calculated widths may not be accurate if the images have paddings or borders.</p>

<script src="http://static.tumblr.com/wvoc5tm/i6Dnsgxc8/jzmn.setphotoset-min.js" type="text/javascript"></script>
<script type="text/javascript">
    // <![CDATA[
    window.addEventListener("load", function() {
        if (console) console.log("[jzmn] setPhotoset examples working!");
        jzmn.setPhotoset(document.querySelectorAll("#example2"), {
            layout: "23"
        });
        jzmn.setPhotoset(document.querySelectorAll("#example3 .photoset"));
        jzmn.setPhotoset(document.querySelectorAll("#example5"), {
            layout: "23",
            gutter: "5px"
        });
    });

    jzmn.setPhotoset(document.querySelectorAll("#example4"), {
        pData: true,
        childHeight: 'data-height',
        childWidth: 'data-width'
    });
    // ]]>
</script>
<style>

	.set-example {
		width:500px;
		overflow:hidden;
	}

	.photoset {		
		margin:10px;
	}

	.photoset-item {
		display: block;		
		float: left;		/*[1]*/
		margin: 0px;		/*[2]*/
		margin-left: 0;
		margin-top: 0;
	}

	.photoset-item > * {
		width:100%;
	}

	.photoset-last-column {
		margin-right:0 !important;		/*[3]*/
	}

	.photoset-last-column + .photoset-item {
		clear:left;			/*[4]*/
	}

	.photoset-last-row {
		margin-bottom:0 !important;	/*[3]*/
	}

	#example5 .photoset-item { margin-top: 5px ; margin-right: 5px ; }
</style>