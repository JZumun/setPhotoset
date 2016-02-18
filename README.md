jzmn.setPhotoset
================
**`jzmn.setPhotoset`** is a javascript function for beautifully resizing images in a photoset, without cropping or aspect-ratio distortion, such that all images in a row are of the same height.`jzmn.setPhotoset` makes use of percentage widths, so that the photoset can work for all sizes, and can be resized without problem.

Like most of my coding experiments, it is encapsulated in the `jzmn` namespace. This largely means nothing.

Basic Usage
-----------
The general format of `jzmn.setPhotoset` is shown below:
```javascript
jzmn.setPhotoset(element,userOptions,grouping)
```
*`element`* refers to the element node, nodelist of elements, or CSS-selector string of the photosets you want to set. 
*`userOptions`* is an optional object containing customizable options for the function (listed below).
*`grouping`* is a CSS-selector-friendly string meant to group photosets together in a class for similar styling. If set, gives the photoset elements a class 'photoset-*grouping*'. Will be randomly generated if not set.

User Options
------------
| userOptions        | type           | default  | description |
| ------------- |:-------------:| -----:| ---- |
| layout     	| string OR [number]| 0 		| defines layout of photoset (number of items per row. e.g "121" or [1,2,1]). If falsey, layout information is aquired from data-layout attribute if existing, or else nothing happens. |
| immediate    	| boolean      		| false 	| boolean determining whether to immediately invoke function. If false, waits for all IMG children to load before executing layout application (no other `childItem` is supported). If true immediately applies layout, making use of height and width data provided in the attributes defined in `childHeight` and `childWidth` of `childItems`. |
| childItem		| string			| "img"		| CSS-selector string that determines which children inside element is used to create grid. If set to something other than "img", `immediate` must be set to true and `childHeight` and `childWidth` be set appropriately.|
| childHeight 	| string      		| "height" 	| name of attribute on each childItem that lists item's height. |
| childWidth 	| string      		| "width" 	| name of attribute on each childItem that lists item's width. |
| callback		| function			| null  	| function to execute after a photoset has been worked on. takes photoset DOM element as argument. |
| gutter 		| number OR string 	| 0 		| value that sets spacing between items. If string, must be usable inside calc(). If a number, is set in px. |
| createSheet   | boolean 			| true 		| boolean determining whether a stylesheet is to be created containing the styling required for layouting (if it doesn't yet exist). Set to false if you wish to supply your own stylesheet. See setphotoset-example.css for sample.|

Examples
--------

For examples, visit this [demo page](http://jzumun.tumblr.com/set-photoset)