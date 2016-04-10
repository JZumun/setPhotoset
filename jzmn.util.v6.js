var jzmn = (function(){
	//Some Helper Variables and Functions
	var arr = Array.prototype;	
	var isNodeList = function(n) {
		var s = Object.prototype.toString.call(n);
		return typeof n === 'object'
			&&  /^\[object (HTMLCollection|NodeList|Object)\]$/.test(s) 
			&& (n.length == 0 || (typeof n[0] === 'object' && n[0].nodeType));
	};
	function isString(o) {
        return (Object.prototype.toString.call(o) === '[object String]');
    }
	var arrifyFactoryArg = function(el) {
		return    !el ? []
				: Array.isArray(el) ? el
				: el.nodeType ? [el]
				: isNodeList(el) ? arr.slice.call(el)
				: isString(el) ? arr.slice.call(document.querySelectorAll(el))
				: el;
	};
	var flatten = function(el,ret) {
		ret = ret || [];
		arrifyFactoryArg(el).forEach(function(el,i){ 
			if (Array.isArray(el)) flatten(el,ret);
			else ret.push(el);
		})
		return ret;
	}

	//Factory Function
	var factory = function(list) {
		var j = Object.create(factory.fn);
		j.els = arrifyFactoryArg(list);
		j.el  = j.els[0];
		return j;
	};

	//Utility method masking querySelector
	factory.el = document.querySelector.bind(document);
	factory.els = document.querySelectorAll.bind(document);

	//Instance Methods container and Extender
	factory.fn = {};
	factory.extendFn = function(obj,takesMultiple) {
		Object.keys(obj).forEach(function(method){
			factory.fn[method] = takesMultiple ?
				function() {
					return factory(flatten(obj[method].bind(null,this.els).apply(null,arguments))||this.els);
				}
				: function() {
					var args = arguments;
					return factory(flatten(this.els.map(function(el){
						return obj[method].bind(null,el).apply(null,args) || el;
					})));
				} 
		});
		return obj;
	};

	factory.extendFactory = function(obj,takesMultiples) {
		Object.keys(factory.extendFn(obj,takesMultiples)).forEach(function(fn,i){
			factory[fn] = obj[fn];
		});
	}

	//Utility Method for getting the nth element in a collection
	factory.fn.at = function (n) { return factory(this.els[n]); }

	//Utility Methods for Iterating over Arrays and Objects;
	var iterator = function (method) {
		return function(obj,fn,context) {
			if (!fn) return;
			if (obj.length || obj.length === 0) { return arr[method].call(obj,fn,context); }
			else {
				var retVal = {};
				Object.keys(obj)[method](function(key,i){
					var x = fn.call(context||obj,obj[key],key,obj);
					if (x) retVal[key] = x;
					return x;
				});
				return retVal;
			}
		}
	}

	factory.util = {
		each: 	iterator("forEach"),
		map: 	iterator("map"),
		filter:	iterator("filter"),
		reduce: function(el,fn,def) {
				if (el.length || el.length === 0) { return arr.reduce.apply(el,fn,def); }
				else {
					return Object.keys(el).reduce(function(acc,key,i){
						if (!i) {
							if (!def) return el[key];
							else acc = def;
						}
						return fn.call(el,acc,el[key],key);
					},"");
				}
			},
		flatten: flatten,
		parseEls: arrifyFactoryArg
	};
	factory.extendFn(factory.util,true);

	return factory;
})();


/*DOM Class functionalities*/
(function(factory) {
	function changeClass(elems,cname,add) {
		var els = factory.util.parseEls(elems);
		if (Array.isArray(cname)) { factory.util.each(cname,function(cn){ changeClass(els,cn,add) }); return els; }

		/*Where the fun begins*/
		return els.map(function(el,i){
			var test = Object.prototype.toString.call(add) == '[object Function]' ? add(el,cname) : add; 
			if (!el.nodeType) throw new TypeError("Element is not a node");
			if (el.classList && cname.search(" ")<0) el.classList[test?"add":"remove"](cname);
			else if (el.className) el.className = test ?  el.className += " " + cname : el.className.replace(new RegExp('(^|\\b)' + cname.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
			return el;
		});
	}

	factory.classMethods = {
		changeClass : changeClass,
		toggleClass : 	function (el,cname) { return changeClass(el,cname,function(x,c) { return x.className.search(c) === -1 })},
		removeClass : 	function (el,cname) { return changeClass(el,cname,false); },
		addClass : 		function (el,cname) { return changeClass(el,cname,true); },
	}

	factory.extendFn(factory.classMethods,true);
})(jzmn);

//For backwards compatibility to older versions of jzmn
jzmn.util.addClass = jzmn.classMethods.addClass;
jzmn.util.removeClass = jzmn.classMethods.removeClass;

/*Element Creation Shortcut*/
(function(factory){
	var idMatcher = /#(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/,
		classMatcher = /\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g,
		tagMatcher = /[^.#][a-zA-Z]*/;


	factory.appendChildren = function(element,child) {
		if (!child) return;
		if (child.nodeType) 					{ element.appendChild(child); }
		else if (child === child.toString()) 	{ element.innerHTML += child; }
		else if (child.length) 					{ Array.prototype.forEach.call(child,factory.appendChildren.bind(null,element)); } 
	}
	factory.replaceChildren = function(element,child) {
		element.innerHTML = "";
		factory.appendChildren(element,child);
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
		if (attributes)	Object.keys(attributes).forEach(function(key,i){
			var attrVal = attributes[key] instanceof Array ? attributes[key].join(" ") : attributes[key];
			element.setAttribute(key,attrVal);
		});
		factory.appendChildren(element,children);
		return element;
	};
})(jzmn);

/*Some Useful DOM method shortcuts*/
(function(factory){
	factory.extendFactory({
		find: function(element,child) { return Array.prototype.slice.apply(element.querySelectorAll(child)); },
		ancestor: function(element,parent) {
			if (!parent) return element.parentNode;
			else return element.closest(parent);
		},
		attr: function(element,attribute,value) {
				if (value !== undefined) return (value === null) ? element.removeAttribute(attribute) : element.setAttribute(attribute,value);
				else return element.getAttribute(attribute);
			},
		html: function(element,value) {
				if (value !== undefined) element.innerHTML = value;
				else return element.innerHTML;
			},
		on:   function(element,event,callback) { element.addEventListener(event,callback); }
	});
})(jzmn);