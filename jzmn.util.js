/*Basic Utilities*/
var jzmn = (function(){
	function isNodeList(n) { 
		var s = Object.prototype.toString.call(n);
		return typeof n === 'object' 
			&&  /^\[object (HTMLCollection|NodeList|Object)\]$/.test(s) 
			&& (n.length == 0 || (typeof n[0] === 'object' && n[0].nodeType));
	};
	var arr = Array.prototype;

	var flatten = function(arr,ret) {
		ret = ret || [];
		arr.forEach(function(el,i){ 
			if (Array.isArray(el)) flatten(el,ret);
			else ret.push(el);
		})
		return ret;
	}
	var updateInstance = function(ins,els) {
		ins.els = els;
		ins.el  = els[0];
		return ins;
	}
	var factory = function(el){
		var J = Object.create(factory.fn);
	
		J.els = !el ? [] :
				el.nodeType ? [el] :
				Array.isArray(el)? el :
				isNodeList(el) ? arr.slice.call(el) :
				arr.slice.call(document.querySelectorAll(el));

		J.el  = J.els[0];
		return J;
	};
	
	factory.el = function(el) {
		var t = document.querySelectorAll(el);
		return (t.length > 1) ? t : ((t.length) ? t[0] : null);
	}

	factory.fn = {};
	factory.extendFn = function(obj,takesMultiples) {
		var u = [];
		Object.keys(obj).forEach(function(method){
			factory.fn[method] = takesMultiples ?
				function(){
					return updateInstance(this,flatten(obj[method].bind(null,this.els).apply(null,arguments)) || this.els);
				} : 
				function() {
					var args = arguments;
					return updateInstance(this,flatten(this.els.map(function(el){
						return obj[method].bind(null,el).apply(null,args);
				})) || this.els);
			}
		});
	}

	factory.util = {
		each: 	function(el) { arr.forEach.apply(el,arr.slice.call(arguments,1)); return el; } ,
		map: 	function(el) { return arr.map.apply(el,arr.slice.call(arguments,1)); 	} ,
		reduce: function(el) { return arr.reduce.apply(el,arr.slice.call(arguments,1)); },
		filter: function(el) { return arr.filter.apply(el,arr.slice.call(arguments,1)); },
		flatten: flatten
	};	
	factory.extendFn(factory.util,true);
	
	return factory;
})();

/*DOM Class functionalities*/
(function(factory) {
	function changeClass(el,cname,add) {
		if (!el) return;
		if (el.length !== undefined && !el.nodeType) return factory.util.each(el,function(il){ changeClass(il,cname,add) });
		if (cname.constructor === Array) { factory.util.each(cname,function(cn){ changeClass(el,cn,add) }); return el; }

		/*Where the fun begins*/
		var test = Object.prototype.toString.call(add) == '[object Function]' ? add(el,cname) : add; 
		if (!el.nodeType) throw new TypeError("Element is not a node");
		if (el.classList && cname.search(" ")<0) el.classList[test?"add":"remove"](cname);
		else if (el.className) el.className = test ?  el.className += " " + cname : el.className.replace(new RegExp('(^|\\b)' + cname.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
		return el;
	}

	factory.classMethods = {
		changeClass : changeClass,
		toggleClass : 	function tc (el,cname) { return changeClass(el,cname,function(x,c) { return x.className.search(c) === -1 })},
		removeClass : 	function rc (el,cname) { return changeClass(el,cname,false); },
		addClass : 		function ac (el,cname) { return changeClass(el,cname,true); },
	}

	factory.extendFn(factory.classMethods);
})(jzmn);
jzmn.util.addClass = jzmn.classMethods.addClass;
jzmn.util.removeClass = jzmn.classMethods.removeClass;

/*Element Creation Shortcut*/
(function(factory){
	var idMatcher = /#(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/,
		classMatcher = /\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g,
		tagMatcher = /[^.#][a-zA-Z]*/;


	factory.appendChildren = function(element,child) {
		if (child) {
			if (child.nodeType) 					{ element.appendChild(child); }
			else if (child === child.toString()) 	{ element.innerHTML += child; }
			else if (child.length) 					{ Array.prototype.forEach.call(child,factory.appendChildren.bind(null,element)); } 
		}
		return element;
	}
	factory.replaceChildren = function(element,child) {
		element.innerHTML = "";
		return factory.appendChildren(element,child);
	}
	factory.extendFn({
		appendChildren: factory.appendChildren,
		replaceChildren: factory.replaceChildren
	});

	factory.createEl = function(tag,attributes,children) {
		var tagElement = tag.match(tagMatcher)[0];
		var elID       = tag.match(idMatcher);
		var elClasses  = tag.match(classMatcher);

		var element = document.createElement(tagElement);
		if (elID) element.setAttribute("id",elID[1])
		if (elClasses) element.setAttribute("class",elClasses.join("").split(".").join(" "));
		if (attributes) {
			Object.keys(attributes).forEach(function(key,i){
				var attrVal = attributes[key] instanceof Array ? attributes[key].join(" ") : attributes[key];
				element.setAttribute(key,attrVal);
			})
		}
		factory.appendChildren(element,children);
		return element;
	};

})(jzmn);

/*Query Selector Shortcut*/
(function(factory){
	factory.find = function(element,child) {
		return Array.prototype.slice.apply(element.querySelectorAll(child));
	}
	factory.extendFn({find: factory.find});
})(jzmn);

/*Add Event Listener Shortcut*/
(function(factory){
	factory.on = function(element,event,callback) {
		element.addEventListener(event,callback);
		return element;
	}
	factory.extendFn({on: factory.on});
})(jzmn);