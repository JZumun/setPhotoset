const isString = (thing) => thing.toString() === thing;
const isArray = Array.isArray;
const noop = ()=>{};

const parseNum = i => parseInt(i,10);
const arrifyLayoutString = (layoutString) => layoutString.charAt(0) === "[" 
				? layoutString.replace(/\[([0-9,]*)\]/,"$1").split(",").map(parseNum)
				: layoutString.split("").map(parseNum);
const sanitizeLayout = (layout) =>  isArray(layout)? layout : isString(layout)? arrifyLayoutString(layout) : [];
const sanitizeGutter = (gutter) => gutter && (gutter + (isString(gutter) ? "" : "px"));

const generateId = ()=>Math.floor(100000*Math.random()+1).toString();
const el = (element) => {
	if (!element) return [];
	if (isString(element)) return document.querySelectorAll(element);
	if (element.nodeType) return [element];
	if (element.length) return element;
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
const groupings = new Set();
let styles = document.querySelector("#jzmn-setphotoset-styles");
const createStyleSheet = ({grouping, gutter}) => {
	if (!styles) { styles = createNewStyleSheet(); }
	if (gutter && !groupings.has(grouping)) {
		groupings.add(grouping);
		[
			`.photoset-${grouping} .photoset-item:not(.photoset-last-column) { margin-right: calc(${gutter}); }`,
			`.photoset-${grouping} .photoset-item:not(.photoset-last-row) { margin-bottom: calc(${gutter}); }`
		].forEach(rule=>styles.sheet.insertRule(rule,styles.sheet.cssRules.length));
	}
}

const loadPhotoset = (photoset, {immediate, childItem}) => {
	return new Promise((resolve,reject) => {
		if (immediate || childItem != "img") { resolve(photoset) };

		const incrementLoaded = (evt) => {
			if (evt.target && evt.target.matches(childItem) && --goal === 0) { 
				resolve(photoset);
			}
		} 
		const items = Array.from(photoset.querySelectorAll(childItem));
		let goal = items.length;

		items.forEach((img,i)=> { if (img.complete) {
			if (--goal === 0) resolve(photoset);
		}});
		photoset.addEventListener("load",incrementLoaded,true);
		photoset.addEventListener("error",incrementLoaded,true);
	});
}

const applyLayout = ({layout,gutter,childItem, childHeight, childWidth,immediate}) => {
	return (photoset) => {
		const items = Array.from(photoset.querySelectorAll(childItem));
		const numRows = layout.length;
		const [lastColumn,lastRow,firstColumn] = [[],[],[]];
		const widths = [];

		layout.reduce( (rowStart,rowLength,layoutIndex, layoutArray) => {
			const rowEnd = rowStart + rowLength;
			const rowItems = items.slice(rowStart,rowEnd);
			const numItems = rowItems.length;

			const aspects = rowItems.map((item,itemIndex)=>{
				if (itemIndex === 0) { firstColumn.push(item); }
				if (itemIndex === numItems - 1) { lastColumn.push(item); }
				if (layoutIndex === numRows - 1) { lastRow.push(item); }

				const aspect = (item.matches("img") && immediate==false) ? item.naturalHeight/item.naturalWidth
									: parseInt(item.getAttribute(childHeight)) / parseInt(item.getAttribute(childWidth));

				return Number.isNaN(aspect) ? 1 : aspect;
			});

			let firstWidth = 0;
			const rowWidths = aspects.map((currAspect,itemIndex)=>{
				let width = 0;
				if (itemIndex == 0) { 
					width = firstWidth = 100/aspects.reduce((prev,curr)=>prev + currAspect/curr,0); 
				}
				else { 
					width =  firstWidth*( aspects[0]/currAspect ); 
				}
				return { width, numItems };
			});
			widths.push(...rowWidths);

			return rowEnd;
		},0);

		widths.forEach(({width,numItems},itemIndex)=>{
			const item = items[itemIndex];
			item.classList.add("photoset-item");
			item.classList.remove("photoset-last-column","photoset-last-row","photoset-first-column");
			item.setAttribute("style",`width: ${width}%;` + ( gutter ? `width: calc(${width/100}*(100% - ${numItems - 1}*(${gutter})));` : "" ));
		})
		lastColumn.forEach(item=>item.classList.add("photoset-last-column"));
		lastRow.forEach(item=>item.classList.add("photoset-last-row"));	
		firstColumn.forEach(item=>item.classList.add("photoset-first-column"));
		photoset.classList.remove("photoset-loading");

		return photoset;
	}
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
	
	set = el(set);
	gutter = sanitizeGutter(gutter);
	if (createSheet) { createStyleSheet({grouping,gutter}); }

	for(let photoset of set) {
		layout = sanitizeLayout(layout || photoset.getAttribute(layoutAttribute));
		photoset.classList.add("photoset-loading","photoset-container",`photoset-${grouping}`);
		loadPhotoset(photoset,{ immediate, childItem})
			.then(applyLayout({layout,gutter, childItem, childHeight, childWidth,immediate}))
			.then(callback);
	}
	
	return set;
}

export default setPhotoset;
