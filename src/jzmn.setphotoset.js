const isString = (thing) => thing.toString() === thing;
const isArray = Array.isArray;
const noop = ()=>{};

const parseNum = i => parseInt(i,10);
const arrify = arrable => Array.prototype.slice.call(arrable);
const arrifyLayoutString = (layoutString) => layoutString.charAt(0) === "[" 
				? layoutString.replace(/\[([0-9,]*)\]/,"$1").split(",").map(parseNum)
				: layoutString.split("").map(parseNum);
const sanitizeLayout = (layout) =>  isArray(layout)? layout : isString(layout)? arrifyLayoutString(layout) : [];
const sanitizeGutter = (gutter) => gutter && (gutter + (isString(gutter) ? "" : "px"));

const generateId = ()=>Math.floor(100000*Math.random()+1).toString();
const el = (element) => {
	if (!element) return [];
	if (isString(element)) return arrify(document.querySelectorAll(element));
	if (element.nodeType) return [element];
	if (element.length) return arrify(element);
}

const createNewStyleSheet = () => {
	const styles = document.createElement("style");
	styles.setAttribute("type","text/css");
	styles.setAttribute("id","jzmn-setphotoset-styles");
	styles.appendChild(document.createTextNode(""));
	document.head.appendChild(styles);
	
	[	".photoset-container:after {content:'';display:table;clear:both;}",
		".photoset-item { display:block;float:left;margin:0;height:auto;}",
		".photoset-last-column {margin-right:0;}",
		".photoset-first-column {clear:left}",
		".photoset-last-row {margin-bottom:0;}"
	].forEach(rule => styles.sheet.insertRule(rule,styles.sheet.cssRules.length));

	return styles;
}
const groupings = {};
let styles = document.querySelector("#jzmn-setphotoset-styles");
const createStyleSheet = ({grouping, gutter}) => {
	if (!styles) { styles = createNewStyleSheet(); }
	if (gutter && !groupings[grouping]) {
		groupings[grouping] = gutter;
		[
			`.photoset-${grouping} .photoset-item:not(.photoset-last-column) { margin-right: calc(${gutter}); }`,
			`.photoset-${grouping} .photoset-item:not(.photoset-last-row) { margin-bottom: calc(${gutter}); }`
		].forEach(rule=>styles.sheet.insertRule(rule,styles.sheet.cssRules.length));
	}
}
const loadPhotoset = (photoset, {immediate, childItem,childHeight,childWidth}) => {
	return new Promise((resolve,reject) => {
		const items = arrify(photoset.querySelectorAll(childItem));
		const complete = _=> resolve(items);
		let goal = items.length;

		if (immediate) { complete() };
		
		const incrementLoaded = (evt) => {
			if (evt.target && evt.target.matches(childItem) && --goal === 0) { 
				complete();
			}
		} 
		
		

		items.forEach((img,i)=> { if (img.complete) {
			if (--goal === 0) complete();
		}});
		photoset.addEventListener("load",incrementLoaded,true);
		photoset.addEventListener("error",incrementLoaded,true);
	});
}

const calcAspects = (natural, {childHeight,childWidth}={}) => {
	return (items) => {
		return items.map((item,i)=>{
			if (natural) {
				return item.naturalHeight/item.naturalWidth
			} else {
				const aspect = parseInt(item.getAttribute(childHeight)) / parseInt(item.getAttribute(childWidth))
				return isNan(aspect) ? 1 : aspect;
			}
		})
	}
}

const calcLayout = ({layout,gutter}) => {
	return (aspects) => {
		const numRows = layout.length;
		const widths = [];

		layout.reduce( (rowStart,rowLength,layoutIndex, layoutArray) => {
			const rowEnd = rowStart + rowLength;
			const rowAspects = aspects.slice(rowStart,rowEnd);
			const numItems = rowAspects.length;

			let firstWidth = 0;
			const rowWidths = rowAspects.forEach((currAspect,itemIndex)=>{
				let width = 0;
				if (itemIndex == 0) { 
					width = firstWidth = 100/rowAspects.reduce((prev,curr)=>prev + currAspect/curr,0); 
				}
				else { 
					width =  firstWidth*( rowAspects[0]/currAspect ); 
				}

				const positioning = {
					firstColumn: itemIndex===0,
					lastColumn: itemIndex ===numItems-1,
					lastRow: layoutIndex=== numRows - 1
				}

				widths.push({width, numItems, positioning});
			});

			return rowEnd;
		},0);

		return widths;
	}
}

const applyLayout = (photoset,{childItem,gutter}) => {
	const items = arrify(photoset.querySelectorAll(childItem));
	return (widths) => {
		widths.forEach(({width,numItems,positioning:{firstColumn,lastColumn,lastRow}},itemIndex)=>{
			const item = items[itemIndex];
			item.classList.add("photoset-item");
			item.classList.remove("photoset-last-column","photoset-last-row","photoset-first-column");
			item.setAttribute("style",`width: ${width}%;` + ( gutter ? `width: calc(${width/100}*(100% - ${numItems - 1}*(${gutter})));` : "" ));
			if (firstColumn) item.classList.add("photoset-first-column");
			if (lastColumn) item.classList.add("photoset-last-column");
			if (lastRow) item.classList.add("photoset-last-row");
		});
	}
	return photoset;
}

const setPhotoset = function(set,{
	layout = null,
	immediate = false,
	childItem = "img",
	childHeight = "height",
	childWidth = "width",
	gutter = 0,
	callback = noop,
	createSheet = true,
	layoutAttribute = "data-layout"
}={},grouping=generateId()) {
	
	immediate = immediate || childItem != 'img';
	set = el(set);
	gutter = sanitizeGutter(gutter);
	if (createSheet) { createStyleSheet({grouping,gutter}); }

	set.forEach(photoset => {
		layout = sanitizeLayout(layout || photoset.getAttribute(layoutAttribute));
		photoset.classList.add("photoset-loading","photoset-container",`photoset-${grouping}`);

		loadPhotoset(photoset,{ immediate, childItem })
			.then(calcAspects({immediate, childHeight,childWidth}))
			.then(calcLayout({layout}))
			.then(applyLayout(photoset,{childItem,gutter}))
			.then(callback);
	});
	
	return set;
}

export default setPhotoset;
