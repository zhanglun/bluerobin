webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _vue = __webpack_require__(6);

	var _vue2 = _interopRequireDefault(_vue);

	var _vueRouter = __webpack_require__(7);

	var _vueRouter2 = _interopRequireDefault(_vueRouter);

	var _vueResource = __webpack_require__(8);

	var _vueResource2 = _interopRequireDefault(_vueResource);

	var _App = __webpack_require__(10);

	var _App2 = _interopRequireDefault(_App);

	var _Index = __webpack_require__(65);

	var _Index2 = _interopRequireDefault(_Index);

	var _mainContainer = __webpack_require__(68);

	var _mainContainer2 = _interopRequireDefault(_mainContainer);

	var _login = __webpack_require__(82);

	var _login2 = _interopRequireDefault(_login);

	var _signup = __webpack_require__(86);

	var _signup2 = _interopRequireDefault(_signup);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(89);

	_vue2.default.use(_vueRouter2.default);
	_vue2.default.use(_vueResource2.default);
	_vue2.default.config.devtools = true;
	_vue2.default.config.debug = true;

	// routing
	var router = new _vueRouter2.default({
	  linkActiveClass: 'side-menu__item--active'
	});

	router.map({
	  '/lists': {
	    component: _App2.default,
	    subRoutes: {
	      '/:id': {
	        name: 'list',
	        component: _mainContainer2.default
	      }
	    },
	    auth: true
	  },
	  '/login': {
	    component: _login2.default
	  },
	  '/signup': {
	    component: _signup2.default
	  }
	});

	router.redirect({
	  '*': '/lists'
	});

	router.afterEach(function (transition) {
	  console.log('成功浏览到: ' + transition.to.path);
	});

	router.start(_Index2.default, '#app');

/***/ }),
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	/*!
	 * vue-router v0.7.13
	 * (c) 2016 Evan You
	 * Released under the MIT License.
	 */
	(function (global, factory) {
	   true ? module.exports = factory() :
	  typeof define === 'function' && define.amd ? define(factory) :
	  global.VueRouter = factory();
	}(this, function () { 'use strict';

	  var babelHelpers = {};

	  babelHelpers.classCallCheck = function (instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  };
	  function Target(path, matcher, delegate) {
	    this.path = path;
	    this.matcher = matcher;
	    this.delegate = delegate;
	  }

	  Target.prototype = {
	    to: function to(target, callback) {
	      var delegate = this.delegate;

	      if (delegate && delegate.willAddRoute) {
	        target = delegate.willAddRoute(this.matcher.target, target);
	      }

	      this.matcher.add(this.path, target);

	      if (callback) {
	        if (callback.length === 0) {
	          throw new Error("You must have an argument in the function passed to `to`");
	        }
	        this.matcher.addChild(this.path, target, callback, this.delegate);
	      }
	      return this;
	    }
	  };

	  function Matcher(target) {
	    this.routes = {};
	    this.children = {};
	    this.target = target;
	  }

	  Matcher.prototype = {
	    add: function add(path, handler) {
	      this.routes[path] = handler;
	    },

	    addChild: function addChild(path, target, callback, delegate) {
	      var matcher = new Matcher(target);
	      this.children[path] = matcher;

	      var match = generateMatch(path, matcher, delegate);

	      if (delegate && delegate.contextEntered) {
	        delegate.contextEntered(target, match);
	      }

	      callback(match);
	    }
	  };

	  function generateMatch(startingPath, matcher, delegate) {
	    return function (path, nestedCallback) {
	      var fullPath = startingPath + path;

	      if (nestedCallback) {
	        nestedCallback(generateMatch(fullPath, matcher, delegate));
	      } else {
	        return new Target(startingPath + path, matcher, delegate);
	      }
	    };
	  }

	  function addRoute(routeArray, path, handler) {
	    var len = 0;
	    for (var i = 0, l = routeArray.length; i < l; i++) {
	      len += routeArray[i].path.length;
	    }

	    path = path.substr(len);
	    var route = { path: path, handler: handler };
	    routeArray.push(route);
	  }

	  function eachRoute(baseRoute, matcher, callback, binding) {
	    var routes = matcher.routes;

	    for (var path in routes) {
	      if (routes.hasOwnProperty(path)) {
	        var routeArray = baseRoute.slice();
	        addRoute(routeArray, path, routes[path]);

	        if (matcher.children[path]) {
	          eachRoute(routeArray, matcher.children[path], callback, binding);
	        } else {
	          callback.call(binding, routeArray);
	        }
	      }
	    }
	  }

	  function map (callback, addRouteCallback) {
	    var matcher = new Matcher();

	    callback(generateMatch("", matcher, this.delegate));

	    eachRoute([], matcher, function (route) {
	      if (addRouteCallback) {
	        addRouteCallback(this, route);
	      } else {
	        this.add(route);
	      }
	    }, this);
	  }

	  var specials = ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'];

	  var escapeRegex = new RegExp('(\\' + specials.join('|\\') + ')', 'g');

	  var noWarning = false;
	  function warn(msg) {
	    if (!noWarning && typeof console !== 'undefined') {
	      console.error('[vue-router] ' + msg);
	    }
	  }

	  function tryDecode(uri, asComponent) {
	    try {
	      return asComponent ? decodeURIComponent(uri) : decodeURI(uri);
	    } catch (e) {
	      warn('malformed URI' + (asComponent ? ' component: ' : ': ') + uri);
	    }
	  }

	  function isArray(test) {
	    return Object.prototype.toString.call(test) === "[object Array]";
	  }

	  // A Segment represents a segment in the original route description.
	  // Each Segment type provides an `eachChar` and `regex` method.
	  //
	  // The `eachChar` method invokes the callback with one or more character
	  // specifications. A character specification consumes one or more input
	  // characters.
	  //
	  // The `regex` method returns a regex fragment for the segment. If the
	  // segment is a dynamic of star segment, the regex fragment also includes
	  // a capture.
	  //
	  // A character specification contains:
	  //
	  // * `validChars`: a String with a list of all valid characters, or
	  // * `invalidChars`: a String with a list of all invalid characters
	  // * `repeat`: true if the character specification can repeat

	  function StaticSegment(string) {
	    this.string = string;
	  }
	  StaticSegment.prototype = {
	    eachChar: function eachChar(callback) {
	      var string = this.string,
	          ch;

	      for (var i = 0, l = string.length; i < l; i++) {
	        ch = string.charAt(i);
	        callback({ validChars: ch });
	      }
	    },

	    regex: function regex() {
	      return this.string.replace(escapeRegex, '\\$1');
	    },

	    generate: function generate() {
	      return this.string;
	    }
	  };

	  function DynamicSegment(name) {
	    this.name = name;
	  }
	  DynamicSegment.prototype = {
	    eachChar: function eachChar(callback) {
	      callback({ invalidChars: "/", repeat: true });
	    },

	    regex: function regex() {
	      return "([^/]+)";
	    },

	    generate: function generate(params) {
	      var val = params[this.name];
	      return val == null ? ":" + this.name : val;
	    }
	  };

	  function StarSegment(name) {
	    this.name = name;
	  }
	  StarSegment.prototype = {
	    eachChar: function eachChar(callback) {
	      callback({ invalidChars: "", repeat: true });
	    },

	    regex: function regex() {
	      return "(.+)";
	    },

	    generate: function generate(params) {
	      var val = params[this.name];
	      return val == null ? ":" + this.name : val;
	    }
	  };

	  function EpsilonSegment() {}
	  EpsilonSegment.prototype = {
	    eachChar: function eachChar() {},
	    regex: function regex() {
	      return "";
	    },
	    generate: function generate() {
	      return "";
	    }
	  };

	  function parse(route, names, specificity) {
	    // normalize route as not starting with a "/". Recognition will
	    // also normalize.
	    if (route.charAt(0) === "/") {
	      route = route.substr(1);
	    }

	    var segments = route.split("/"),
	        results = [];

	    // A routes has specificity determined by the order that its different segments
	    // appear in. This system mirrors how the magnitude of numbers written as strings
	    // works.
	    // Consider a number written as: "abc". An example would be "200". Any other number written
	    // "xyz" will be smaller than "abc" so long as `a > z`. For instance, "199" is smaller
	    // then "200", even though "y" and "z" (which are both 9) are larger than "0" (the value
	    // of (`b` and `c`). This is because the leading symbol, "2", is larger than the other
	    // leading symbol, "1".
	    // The rule is that symbols to the left carry more weight than symbols to the right
	    // when a number is written out as a string. In the above strings, the leading digit
	    // represents how many 100's are in the number, and it carries more weight than the middle
	    // number which represents how many 10's are in the number.
	    // This system of number magnitude works well for route specificity, too. A route written as
	    // `a/b/c` will be more specific than `x/y/z` as long as `a` is more specific than
	    // `x`, irrespective of the other parts.
	    // Because of this similarity, we assign each type of segment a number value written as a
	    // string. We can find the specificity of compound routes by concatenating these strings
	    // together, from left to right. After we have looped through all of the segments,
	    // we convert the string to a number.
	    specificity.val = '';

	    for (var i = 0, l = segments.length; i < l; i++) {
	      var segment = segments[i],
	          match;

	      if (match = segment.match(/^:([^\/]+)$/)) {
	        results.push(new DynamicSegment(match[1]));
	        names.push(match[1]);
	        specificity.val += '3';
	      } else if (match = segment.match(/^\*([^\/]+)$/)) {
	        results.push(new StarSegment(match[1]));
	        specificity.val += '2';
	        names.push(match[1]);
	      } else if (segment === "") {
	        results.push(new EpsilonSegment());
	        specificity.val += '1';
	      } else {
	        results.push(new StaticSegment(segment));
	        specificity.val += '4';
	      }
	    }

	    specificity.val = +specificity.val;

	    return results;
	  }

	  // A State has a character specification and (`charSpec`) and a list of possible
	  // subsequent states (`nextStates`).
	  //
	  // If a State is an accepting state, it will also have several additional
	  // properties:
	  //
	  // * `regex`: A regular expression that is used to extract parameters from paths
	  //   that reached this accepting state.
	  // * `handlers`: Information on how to convert the list of captures into calls
	  //   to registered handlers with the specified parameters
	  // * `types`: How many static, dynamic or star segments in this route. Used to
	  //   decide which route to use if multiple registered routes match a path.
	  //
	  // Currently, State is implemented naively by looping over `nextStates` and
	  // comparing a character specification against a character. A more efficient
	  // implementation would use a hash of keys pointing at one or more next states.

	  function State(charSpec) {
	    this.charSpec = charSpec;
	    this.nextStates = [];
	  }

	  State.prototype = {
	    get: function get(charSpec) {
	      var nextStates = this.nextStates;

	      for (var i = 0, l = nextStates.length; i < l; i++) {
	        var child = nextStates[i];

	        var isEqual = child.charSpec.validChars === charSpec.validChars;
	        isEqual = isEqual && child.charSpec.invalidChars === charSpec.invalidChars;

	        if (isEqual) {
	          return child;
	        }
	      }
	    },

	    put: function put(charSpec) {
	      var state;

	      // If the character specification already exists in a child of the current
	      // state, just return that state.
	      if (state = this.get(charSpec)) {
	        return state;
	      }

	      // Make a new state for the character spec
	      state = new State(charSpec);

	      // Insert the new state as a child of the current state
	      this.nextStates.push(state);

	      // If this character specification repeats, insert the new state as a child
	      // of itself. Note that this will not trigger an infinite loop because each
	      // transition during recognition consumes a character.
	      if (charSpec.repeat) {
	        state.nextStates.push(state);
	      }

	      // Return the new state
	      return state;
	    },

	    // Find a list of child states matching the next character
	    match: function match(ch) {
	      // DEBUG "Processing `" + ch + "`:"
	      var nextStates = this.nextStates,
	          child,
	          charSpec,
	          chars;

	      // DEBUG "  " + debugState(this)
	      var returned = [];

	      for (var i = 0, l = nextStates.length; i < l; i++) {
	        child = nextStates[i];

	        charSpec = child.charSpec;

	        if (typeof (chars = charSpec.validChars) !== 'undefined') {
	          if (chars.indexOf(ch) !== -1) {
	            returned.push(child);
	          }
	        } else if (typeof (chars = charSpec.invalidChars) !== 'undefined') {
	          if (chars.indexOf(ch) === -1) {
	            returned.push(child);
	          }
	        }
	      }

	      return returned;
	    }

	    /** IF DEBUG
	    , debug: function() {
	      var charSpec = this.charSpec,
	          debug = "[",
	          chars = charSpec.validChars || charSpec.invalidChars;
	       if (charSpec.invalidChars) { debug += "^"; }
	      debug += chars;
	      debug += "]";
	       if (charSpec.repeat) { debug += "+"; }
	       return debug;
	    }
	    END IF **/
	  };

	  /** IF DEBUG
	  function debug(log) {
	    console.log(log);
	  }

	  function debugState(state) {
	    return state.nextStates.map(function(n) {
	      if (n.nextStates.length === 0) { return "( " + n.debug() + " [accepting] )"; }
	      return "( " + n.debug() + " <then> " + n.nextStates.map(function(s) { return s.debug() }).join(" or ") + " )";
	    }).join(", ")
	  }
	  END IF **/

	  // Sort the routes by specificity
	  function sortSolutions(states) {
	    return states.sort(function (a, b) {
	      return b.specificity.val - a.specificity.val;
	    });
	  }

	  function recognizeChar(states, ch) {
	    var nextStates = [];

	    for (var i = 0, l = states.length; i < l; i++) {
	      var state = states[i];

	      nextStates = nextStates.concat(state.match(ch));
	    }

	    return nextStates;
	  }

	  var oCreate = Object.create || function (proto) {
	    function F() {}
	    F.prototype = proto;
	    return new F();
	  };

	  function RecognizeResults(queryParams) {
	    this.queryParams = queryParams || {};
	  }
	  RecognizeResults.prototype = oCreate({
	    splice: Array.prototype.splice,
	    slice: Array.prototype.slice,
	    push: Array.prototype.push,
	    length: 0,
	    queryParams: null
	  });

	  function findHandler(state, path, queryParams) {
	    var handlers = state.handlers,
	        regex = state.regex;
	    var captures = path.match(regex),
	        currentCapture = 1;
	    var result = new RecognizeResults(queryParams);

	    for (var i = 0, l = handlers.length; i < l; i++) {
	      var handler = handlers[i],
	          names = handler.names,
	          params = {};

	      for (var j = 0, m = names.length; j < m; j++) {
	        params[names[j]] = captures[currentCapture++];
	      }

	      result.push({ handler: handler.handler, params: params, isDynamic: !!names.length });
	    }

	    return result;
	  }

	  function addSegment(currentState, segment) {
	    segment.eachChar(function (ch) {
	      var state;

	      currentState = currentState.put(ch);
	    });

	    return currentState;
	  }

	  function decodeQueryParamPart(part) {
	    // http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.1
	    part = part.replace(/\+/gm, '%20');
	    return tryDecode(part, true);
	  }

	  // The main interface

	  var RouteRecognizer = function RouteRecognizer() {
	    this.rootState = new State();
	    this.names = {};
	  };

	  RouteRecognizer.prototype = {
	    add: function add(routes, options) {
	      var currentState = this.rootState,
	          regex = "^",
	          specificity = {},
	          handlers = [],
	          allSegments = [],
	          name;

	      var isEmpty = true;

	      for (var i = 0, l = routes.length; i < l; i++) {
	        var route = routes[i],
	            names = [];

	        var segments = parse(route.path, names, specificity);

	        allSegments = allSegments.concat(segments);

	        for (var j = 0, m = segments.length; j < m; j++) {
	          var segment = segments[j];

	          if (segment instanceof EpsilonSegment) {
	            continue;
	          }

	          isEmpty = false;

	          // Add a "/" for the new segment
	          currentState = currentState.put({ validChars: "/" });
	          regex += "/";

	          // Add a representation of the segment to the NFA and regex
	          currentState = addSegment(currentState, segment);
	          regex += segment.regex();
	        }

	        var handler = { handler: route.handler, names: names };
	        handlers.push(handler);
	      }

	      if (isEmpty) {
	        currentState = currentState.put({ validChars: "/" });
	        regex += "/";
	      }

	      currentState.handlers = handlers;
	      currentState.regex = new RegExp(regex + "$");
	      currentState.specificity = specificity;

	      if (name = options && options.as) {
	        this.names[name] = {
	          segments: allSegments,
	          handlers: handlers
	        };
	      }
	    },

	    handlersFor: function handlersFor(name) {
	      var route = this.names[name],
	          result = [];
	      if (!route) {
	        throw new Error("There is no route named " + name);
	      }

	      for (var i = 0, l = route.handlers.length; i < l; i++) {
	        result.push(route.handlers[i]);
	      }

	      return result;
	    },

	    hasRoute: function hasRoute(name) {
	      return !!this.names[name];
	    },

	    generate: function generate(name, params) {
	      var route = this.names[name],
	          output = "";
	      if (!route) {
	        throw new Error("There is no route named " + name);
	      }

	      var segments = route.segments;

	      for (var i = 0, l = segments.length; i < l; i++) {
	        var segment = segments[i];

	        if (segment instanceof EpsilonSegment) {
	          continue;
	        }

	        output += "/";
	        output += segment.generate(params);
	      }

	      if (output.charAt(0) !== '/') {
	        output = '/' + output;
	      }

	      if (params && params.queryParams) {
	        output += this.generateQueryString(params.queryParams);
	      }

	      return output;
	    },

	    generateQueryString: function generateQueryString(params) {
	      var pairs = [];
	      var keys = [];
	      for (var key in params) {
	        if (params.hasOwnProperty(key)) {
	          keys.push(key);
	        }
	      }
	      keys.sort();
	      for (var i = 0, len = keys.length; i < len; i++) {
	        key = keys[i];
	        var value = params[key];
	        if (value == null) {
	          continue;
	        }
	        var pair = encodeURIComponent(key);
	        if (isArray(value)) {
	          for (var j = 0, l = value.length; j < l; j++) {
	            var arrayPair = key + '[]' + '=' + encodeURIComponent(value[j]);
	            pairs.push(arrayPair);
	          }
	        } else {
	          pair += "=" + encodeURIComponent(value);
	          pairs.push(pair);
	        }
	      }

	      if (pairs.length === 0) {
	        return '';
	      }

	      return "?" + pairs.join("&");
	    },

	    parseQueryString: function parseQueryString(queryString) {
	      var pairs = queryString.split("&"),
	          queryParams = {};
	      for (var i = 0; i < pairs.length; i++) {
	        var pair = pairs[i].split('='),
	            key = decodeQueryParamPart(pair[0]),
	            keyLength = key.length,
	            isArray = false,
	            value;
	        if (pair.length === 1) {
	          value = 'true';
	        } else {
	          //Handle arrays
	          if (keyLength > 2 && key.slice(keyLength - 2) === '[]') {
	            isArray = true;
	            key = key.slice(0, keyLength - 2);
	            if (!queryParams[key]) {
	              queryParams[key] = [];
	            }
	          }
	          value = pair[1] ? decodeQueryParamPart(pair[1]) : '';
	        }
	        if (isArray) {
	          queryParams[key].push(value);
	        } else {
	          queryParams[key] = value;
	        }
	      }
	      return queryParams;
	    },

	    recognize: function recognize(path, silent) {
	      noWarning = silent;
	      var states = [this.rootState],
	          pathLen,
	          i,
	          l,
	          queryStart,
	          queryParams = {},
	          isSlashDropped = false;

	      queryStart = path.indexOf('?');
	      if (queryStart !== -1) {
	        var queryString = path.substr(queryStart + 1, path.length);
	        path = path.substr(0, queryStart);
	        if (queryString) {
	          queryParams = this.parseQueryString(queryString);
	        }
	      }

	      path = tryDecode(path);
	      if (!path) return;

	      // DEBUG GROUP path

	      if (path.charAt(0) !== "/") {
	        path = "/" + path;
	      }

	      pathLen = path.length;
	      if (pathLen > 1 && path.charAt(pathLen - 1) === "/") {
	        path = path.substr(0, pathLen - 1);
	        isSlashDropped = true;
	      }

	      for (i = 0, l = path.length; i < l; i++) {
	        states = recognizeChar(states, path.charAt(i));
	        if (!states.length) {
	          break;
	        }
	      }

	      // END DEBUG GROUP

	      var solutions = [];
	      for (i = 0, l = states.length; i < l; i++) {
	        if (states[i].handlers) {
	          solutions.push(states[i]);
	        }
	      }

	      states = sortSolutions(solutions);

	      var state = solutions[0];

	      if (state && state.handlers) {
	        // if a trailing slash was dropped and a star segment is the last segment
	        // specified, put the trailing slash back
	        if (isSlashDropped && state.regex.source.slice(-5) === "(.+)$") {
	          path = path + "/";
	        }
	        return findHandler(state, path, queryParams);
	      }
	    }
	  };

	  RouteRecognizer.prototype.map = map;

	  var genQuery = RouteRecognizer.prototype.generateQueryString;

	  // export default for holding the Vue reference
	  var exports$1 = {};
	  /**
	   * Warn stuff.
	   *
	   * @param {String} msg
	   */

	  function warn$1(msg) {
	    /* istanbul ignore next */
	    if (typeof console !== 'undefined') {
	      console.error('[vue-router] ' + msg);
	    }
	  }

	  /**
	   * Resolve a relative path.
	   *
	   * @param {String} base
	   * @param {String} relative
	   * @param {Boolean} append
	   * @return {String}
	   */

	  function resolvePath(base, relative, append) {
	    var query = base.match(/(\?.*)$/);
	    if (query) {
	      query = query[1];
	      base = base.slice(0, -query.length);
	    }
	    // a query!
	    if (relative.charAt(0) === '?') {
	      return base + relative;
	    }
	    var stack = base.split('/');
	    // remove trailing segment if:
	    // - not appending
	    // - appending to trailing slash (last segment is empty)
	    if (!append || !stack[stack.length - 1]) {
	      stack.pop();
	    }
	    // resolve relative path
	    var segments = relative.replace(/^\//, '').split('/');
	    for (var i = 0; i < segments.length; i++) {
	      var segment = segments[i];
	      if (segment === '.') {
	        continue;
	      } else if (segment === '..') {
	        stack.pop();
	      } else {
	        stack.push(segment);
	      }
	    }
	    // ensure leading slash
	    if (stack[0] !== '') {
	      stack.unshift('');
	    }
	    return stack.join('/');
	  }

	  /**
	   * Forgiving check for a promise
	   *
	   * @param {Object} p
	   * @return {Boolean}
	   */

	  function isPromise(p) {
	    return p && typeof p.then === 'function';
	  }

	  /**
	   * Retrive a route config field from a component instance
	   * OR a component contructor.
	   *
	   * @param {Function|Vue} component
	   * @param {String} name
	   * @return {*}
	   */

	  function getRouteConfig(component, name) {
	    var options = component && (component.$options || component.options);
	    return options && options.route && options.route[name];
	  }

	  /**
	   * Resolve an async component factory. Have to do a dirty
	   * mock here because of Vue core's internal API depends on
	   * an ID check.
	   *
	   * @param {Object} handler
	   * @param {Function} cb
	   */

	  var resolver = undefined;

	  function resolveAsyncComponent(handler, cb) {
	    if (!resolver) {
	      resolver = {
	        resolve: exports$1.Vue.prototype._resolveComponent,
	        $options: {
	          components: {
	            _: handler.component
	          }
	        }
	      };
	    } else {
	      resolver.$options.components._ = handler.component;
	    }
	    resolver.resolve('_', function (Component) {
	      handler.component = Component;
	      cb(Component);
	    });
	  }

	  /**
	   * Map the dynamic segments in a path to params.
	   *
	   * @param {String} path
	   * @param {Object} params
	   * @param {Object} query
	   */

	  function mapParams(path, params, query) {
	    if (params === undefined) params = {};

	    path = path.replace(/:([^\/]+)/g, function (_, key) {
	      var val = params[key];
	      /* istanbul ignore if */
	      if (!val) {
	        warn$1('param "' + key + '" not found when generating ' + 'path for "' + path + '" with params ' + JSON.stringify(params));
	      }
	      return val || '';
	    });
	    if (query) {
	      path += genQuery(query);
	    }
	    return path;
	  }

	  var hashRE = /#.*$/;

	  var HTML5History = (function () {
	    function HTML5History(_ref) {
	      var root = _ref.root;
	      var onChange = _ref.onChange;
	      babelHelpers.classCallCheck(this, HTML5History);

	      if (root && root !== '/') {
	        // make sure there's the starting slash
	        if (root.charAt(0) !== '/') {
	          root = '/' + root;
	        }
	        // remove trailing slash
	        this.root = root.replace(/\/$/, '');
	        this.rootRE = new RegExp('^\\' + this.root);
	      } else {
	        this.root = null;
	      }
	      this.onChange = onChange;
	      // check base tag
	      var baseEl = document.querySelector('base');
	      this.base = baseEl && baseEl.getAttribute('href');
	    }

	    HTML5History.prototype.start = function start() {
	      var _this = this;

	      this.listener = function (e) {
	        var url = location.pathname + location.search;
	        if (_this.root) {
	          url = url.replace(_this.rootRE, '');
	        }
	        _this.onChange(url, e && e.state, location.hash);
	      };
	      window.addEventListener('popstate', this.listener);
	      this.listener();
	    };

	    HTML5History.prototype.stop = function stop() {
	      window.removeEventListener('popstate', this.listener);
	    };

	    HTML5History.prototype.go = function go(path, replace, append) {
	      var url = this.formatPath(path, append);
	      if (replace) {
	        history.replaceState({}, '', url);
	      } else {
	        // record scroll position by replacing current state
	        history.replaceState({
	          pos: {
	            x: window.pageXOffset,
	            y: window.pageYOffset
	          }
	        }, '', location.href);
	        // then push new state
	        history.pushState({}, '', url);
	      }
	      var hashMatch = path.match(hashRE);
	      var hash = hashMatch && hashMatch[0];
	      path = url
	      // strip hash so it doesn't mess up params
	      .replace(hashRE, '')
	      // remove root before matching
	      .replace(this.rootRE, '');
	      this.onChange(path, null, hash);
	    };

	    HTML5History.prototype.formatPath = function formatPath(path, append) {
	      return path.charAt(0) === '/'
	      // absolute path
	      ? this.root ? this.root + '/' + path.replace(/^\//, '') : path : resolvePath(this.base || location.pathname, path, append);
	    };

	    return HTML5History;
	  })();

	  var HashHistory = (function () {
	    function HashHistory(_ref) {
	      var hashbang = _ref.hashbang;
	      var onChange = _ref.onChange;
	      babelHelpers.classCallCheck(this, HashHistory);

	      this.hashbang = hashbang;
	      this.onChange = onChange;
	    }

	    HashHistory.prototype.start = function start() {
	      var self = this;
	      this.listener = function () {
	        var path = location.hash;
	        var raw = path.replace(/^#!?/, '');
	        // always
	        if (raw.charAt(0) !== '/') {
	          raw = '/' + raw;
	        }
	        var formattedPath = self.formatPath(raw);
	        if (formattedPath !== path) {
	          location.replace(formattedPath);
	          return;
	        }
	        // determine query
	        // note it's possible to have queries in both the actual URL
	        // and the hash fragment itself.
	        var query = location.search && path.indexOf('?') > -1 ? '&' + location.search.slice(1) : location.search;
	        self.onChange(path.replace(/^#!?/, '') + query);
	      };
	      window.addEventListener('hashchange', this.listener);
	      this.listener();
	    };

	    HashHistory.prototype.stop = function stop() {
	      window.removeEventListener('hashchange', this.listener);
	    };

	    HashHistory.prototype.go = function go(path, replace, append) {
	      path = this.formatPath(path, append);
	      if (replace) {
	        location.replace(path);
	      } else {
	        location.hash = path;
	      }
	    };

	    HashHistory.prototype.formatPath = function formatPath(path, append) {
	      var isAbsoloute = path.charAt(0) === '/';
	      var prefix = '#' + (this.hashbang ? '!' : '');
	      return isAbsoloute ? prefix + path : prefix + resolvePath(location.hash.replace(/^#!?/, ''), path, append);
	    };

	    return HashHistory;
	  })();

	  var AbstractHistory = (function () {
	    function AbstractHistory(_ref) {
	      var onChange = _ref.onChange;
	      babelHelpers.classCallCheck(this, AbstractHistory);

	      this.onChange = onChange;
	      this.currentPath = '/';
	    }

	    AbstractHistory.prototype.start = function start() {
	      this.onChange('/');
	    };

	    AbstractHistory.prototype.stop = function stop() {
	      // noop
	    };

	    AbstractHistory.prototype.go = function go(path, replace, append) {
	      path = this.currentPath = this.formatPath(path, append);
	      this.onChange(path);
	    };

	    AbstractHistory.prototype.formatPath = function formatPath(path, append) {
	      return path.charAt(0) === '/' ? path : resolvePath(this.currentPath, path, append);
	    };

	    return AbstractHistory;
	  })();

	  /**
	   * Determine the reusability of an existing router view.
	   *
	   * @param {Directive} view
	   * @param {Object} handler
	   * @param {Transition} transition
	   */

	  function canReuse(view, handler, transition) {
	    var component = view.childVM;
	    if (!component || !handler) {
	      return false;
	    }
	    // important: check view.Component here because it may
	    // have been changed in activate hook
	    if (view.Component !== handler.component) {
	      return false;
	    }
	    var canReuseFn = getRouteConfig(component, 'canReuse');
	    return typeof canReuseFn === 'boolean' ? canReuseFn : canReuseFn ? canReuseFn.call(component, {
	      to: transition.to,
	      from: transition.from
	    }) : true; // defaults to true
	  }

	  /**
	   * Check if a component can deactivate.
	   *
	   * @param {Directive} view
	   * @param {Transition} transition
	   * @param {Function} next
	   */

	  function canDeactivate(view, transition, next) {
	    var fromComponent = view.childVM;
	    var hook = getRouteConfig(fromComponent, 'canDeactivate');
	    if (!hook) {
	      next();
	    } else {
	      transition.callHook(hook, fromComponent, next, {
	        expectBoolean: true
	      });
	    }
	  }

	  /**
	   * Check if a component can activate.
	   *
	   * @param {Object} handler
	   * @param {Transition} transition
	   * @param {Function} next
	   */

	  function canActivate(handler, transition, next) {
	    resolveAsyncComponent(handler, function (Component) {
	      // have to check due to async-ness
	      if (transition.aborted) {
	        return;
	      }
	      // determine if this component can be activated
	      var hook = getRouteConfig(Component, 'canActivate');
	      if (!hook) {
	        next();
	      } else {
	        transition.callHook(hook, null, next, {
	          expectBoolean: true
	        });
	      }
	    });
	  }

	  /**
	   * Call deactivate hooks for existing router-views.
	   *
	   * @param {Directive} view
	   * @param {Transition} transition
	   * @param {Function} next
	   */

	  function deactivate(view, transition, next) {
	    var component = view.childVM;
	    var hook = getRouteConfig(component, 'deactivate');
	    if (!hook) {
	      next();
	    } else {
	      transition.callHooks(hook, component, next);
	    }
	  }

	  /**
	   * Activate / switch component for a router-view.
	   *
	   * @param {Directive} view
	   * @param {Transition} transition
	   * @param {Number} depth
	   * @param {Function} [cb]
	   */

	  function activate(view, transition, depth, cb, reuse) {
	    var handler = transition.activateQueue[depth];
	    if (!handler) {
	      saveChildView(view);
	      if (view._bound) {
	        view.setComponent(null);
	      }
	      cb && cb();
	      return;
	    }

	    var Component = view.Component = handler.component;
	    var activateHook = getRouteConfig(Component, 'activate');
	    var dataHook = getRouteConfig(Component, 'data');
	    var waitForData = getRouteConfig(Component, 'waitForData');

	    view.depth = depth;
	    view.activated = false;

	    var component = undefined;
	    var loading = !!(dataHook && !waitForData);

	    // "reuse" is a flag passed down when the parent view is
	    // either reused via keep-alive or as a child of a kept-alive view.
	    // of course we can only reuse if the current kept-alive instance
	    // is of the correct type.
	    reuse = reuse && view.childVM && view.childVM.constructor === Component;

	    if (reuse) {
	      // just reuse
	      component = view.childVM;
	      component.$loadingRouteData = loading;
	    } else {
	      saveChildView(view);

	      // unbuild current component. this step also destroys
	      // and removes all nested child views.
	      view.unbuild(true);

	      // build the new component. this will also create the
	      // direct child view of the current one. it will register
	      // itself as view.childView.
	      component = view.build({
	        _meta: {
	          $loadingRouteData: loading
	        },
	        created: function created() {
	          this._routerView = view;
	        }
	      });

	      // handle keep-alive.
	      // when a kept-alive child vm is restored, we need to
	      // add its cached child views into the router's view list,
	      // and also properly update current view's child view.
	      if (view.keepAlive) {
	        component.$loadingRouteData = loading;
	        var cachedChildView = component._keepAliveRouterView;
	        if (cachedChildView) {
	          view.childView = cachedChildView;
	          component._keepAliveRouterView = null;
	        }
	      }
	    }

	    // cleanup the component in case the transition is aborted
	    // before the component is ever inserted.
	    var cleanup = function cleanup() {
	      component.$destroy();
	    };

	    // actually insert the component and trigger transition
	    var insert = function insert() {
	      if (reuse) {
	        cb && cb();
	        return;
	      }
	      var router = transition.router;
	      if (router._rendered || router._transitionOnLoad) {
	        view.transition(component);
	      } else {
	        // no transition on first render, manual transition
	        /* istanbul ignore if */
	        if (view.setCurrent) {
	          // 0.12 compat
	          view.setCurrent(component);
	        } else {
	          // 1.0
	          view.childVM = component;
	        }
	        component.$before(view.anchor, null, false);
	      }
	      cb && cb();
	    };

	    var afterData = function afterData() {
	      // activate the child view
	      if (view.childView) {
	        activate(view.childView, transition, depth + 1, null, reuse || view.keepAlive);
	      }
	      insert();
	    };

	    // called after activation hook is resolved
	    var afterActivate = function afterActivate() {
	      view.activated = true;
	      if (dataHook && waitForData) {
	        // wait until data loaded to insert
	        loadData(component, transition, dataHook, afterData, cleanup);
	      } else {
	        // load data and insert at the same time
	        if (dataHook) {
	          loadData(component, transition, dataHook);
	        }
	        afterData();
	      }
	    };

	    if (activateHook) {
	      transition.callHooks(activateHook, component, afterActivate, {
	        cleanup: cleanup,
	        postActivate: true
	      });
	    } else {
	      afterActivate();
	    }
	  }

	  /**
	   * Reuse a view, just reload data if necessary.
	   *
	   * @param {Directive} view
	   * @param {Transition} transition
	   */

	  function reuse(view, transition) {
	    var component = view.childVM;
	    var dataHook = getRouteConfig(component, 'data');
	    if (dataHook) {
	      loadData(component, transition, dataHook);
	    }
	  }

	  /**
	   * Asynchronously load and apply data to component.
	   *
	   * @param {Vue} component
	   * @param {Transition} transition
	   * @param {Function} hook
	   * @param {Function} cb
	   * @param {Function} cleanup
	   */

	  function loadData(component, transition, hook, cb, cleanup) {
	    component.$loadingRouteData = true;
	    transition.callHooks(hook, component, function () {
	      component.$loadingRouteData = false;
	      component.$emit('route-data-loaded', component);
	      cb && cb();
	    }, {
	      cleanup: cleanup,
	      postActivate: true,
	      processData: function processData(data) {
	        // handle promise sugar syntax
	        var promises = [];
	        if (isPlainObject(data)) {
	          Object.keys(data).forEach(function (key) {
	            var val = data[key];
	            if (isPromise(val)) {
	              promises.push(val.then(function (resolvedVal) {
	                component.$set(key, resolvedVal);
	              }));
	            } else {
	              component.$set(key, val);
	            }
	          });
	        }
	        if (promises.length) {
	          return promises[0].constructor.all(promises);
	        }
	      }
	    });
	  }

	  /**
	   * Save the child view for a kept-alive view so that
	   * we can restore it when it is switched back to.
	   *
	   * @param {Directive} view
	   */

	  function saveChildView(view) {
	    if (view.keepAlive && view.childVM && view.childView) {
	      view.childVM._keepAliveRouterView = view.childView;
	    }
	    view.childView = null;
	  }

	  /**
	   * Check plain object.
	   *
	   * @param {*} val
	   */

	  function isPlainObject(val) {
	    return Object.prototype.toString.call(val) === '[object Object]';
	  }

	  /**
	   * A RouteTransition object manages the pipeline of a
	   * router-view switching process. This is also the object
	   * passed into user route hooks.
	   *
	   * @param {Router} router
	   * @param {Route} to
	   * @param {Route} from
	   */

	  var RouteTransition = (function () {
	    function RouteTransition(router, to, from) {
	      babelHelpers.classCallCheck(this, RouteTransition);

	      this.router = router;
	      this.to = to;
	      this.from = from;
	      this.next = null;
	      this.aborted = false;
	      this.done = false;
	    }

	    /**
	     * Abort current transition and return to previous location.
	     */

	    RouteTransition.prototype.abort = function abort() {
	      if (!this.aborted) {
	        this.aborted = true;
	        // if the root path throws an error during validation
	        // on initial load, it gets caught in an infinite loop.
	        var abortingOnLoad = !this.from.path && this.to.path === '/';
	        if (!abortingOnLoad) {
	          this.router.replace(this.from.path || '/');
	        }
	      }
	    };

	    /**
	     * Abort current transition and redirect to a new location.
	     *
	     * @param {String} path
	     */

	    RouteTransition.prototype.redirect = function redirect(path) {
	      if (!this.aborted) {
	        this.aborted = true;
	        if (typeof path === 'string') {
	          path = mapParams(path, this.to.params, this.to.query);
	        } else {
	          path.params = path.params || this.to.params;
	          path.query = path.query || this.to.query;
	        }
	        this.router.replace(path);
	      }
	    };

	    /**
	     * A router view transition's pipeline can be described as
	     * follows, assuming we are transitioning from an existing
	     * <router-view> chain [Component A, Component B] to a new
	     * chain [Component A, Component C]:
	     *
	     *  A    A
	     *  | => |
	     *  B    C
	     *
	     * 1. Reusablity phase:
	     *   -> canReuse(A, A)
	     *   -> canReuse(B, C)
	     *   -> determine new queues:
	     *      - deactivation: [B]
	     *      - activation: [C]
	     *
	     * 2. Validation phase:
	     *   -> canDeactivate(B)
	     *   -> canActivate(C)
	     *
	     * 3. Activation phase:
	     *   -> deactivate(B)
	     *   -> activate(C)
	     *
	     * Each of these steps can be asynchronous, and any
	     * step can potentially abort the transition.
	     *
	     * @param {Function} cb
	     */

	    RouteTransition.prototype.start = function start(cb) {
	      var transition = this;

	      // determine the queue of views to deactivate
	      var deactivateQueue = [];
	      var view = this.router._rootView;
	      while (view) {
	        deactivateQueue.unshift(view);
	        view = view.childView;
	      }
	      var reverseDeactivateQueue = deactivateQueue.slice().reverse();

	      // determine the queue of route handlers to activate
	      var activateQueue = this.activateQueue = toArray(this.to.matched).map(function (match) {
	        return match.handler;
	      });

	      // 1. Reusability phase
	      var i = undefined,
	          reuseQueue = undefined;
	      for (i = 0; i < reverseDeactivateQueue.length; i++) {
	        if (!canReuse(reverseDeactivateQueue[i], activateQueue[i], transition)) {
	          break;
	        }
	      }
	      if (i > 0) {
	        reuseQueue = reverseDeactivateQueue.slice(0, i);
	        deactivateQueue = reverseDeactivateQueue.slice(i).reverse();
	        activateQueue = activateQueue.slice(i);
	      }

	      // 2. Validation phase
	      transition.runQueue(deactivateQueue, canDeactivate, function () {
	        transition.runQueue(activateQueue, canActivate, function () {
	          transition.runQueue(deactivateQueue, deactivate, function () {
	            // 3. Activation phase

	            // Update router current route
	            transition.router._onTransitionValidated(transition);

	            // trigger reuse for all reused views
	            reuseQueue && reuseQueue.forEach(function (view) {
	              return reuse(view, transition);
	            });

	            // the root of the chain that needs to be replaced
	            // is the top-most non-reusable view.
	            if (deactivateQueue.length) {
	              var _view = deactivateQueue[deactivateQueue.length - 1];
	              var depth = reuseQueue ? reuseQueue.length : 0;
	              activate(_view, transition, depth, cb);
	            } else {
	              cb();
	            }
	          });
	        });
	      });
	    };

	    /**
	     * Asynchronously and sequentially apply a function to a
	     * queue.
	     *
	     * @param {Array} queue
	     * @param {Function} fn
	     * @param {Function} cb
	     */

	    RouteTransition.prototype.runQueue = function runQueue(queue, fn, cb) {
	      var transition = this;
	      step(0);
	      function step(index) {
	        if (index >= queue.length) {
	          cb();
	        } else {
	          fn(queue[index], transition, function () {
	            step(index + 1);
	          });
	        }
	      }
	    };

	    /**
	     * Call a user provided route transition hook and handle
	     * the response (e.g. if the user returns a promise).
	     *
	     * If the user neither expects an argument nor returns a
	     * promise, the hook is assumed to be synchronous.
	     *
	     * @param {Function} hook
	     * @param {*} [context]
	     * @param {Function} [cb]
	     * @param {Object} [options]
	     *                 - {Boolean} expectBoolean
	     *                 - {Boolean} postActive
	     *                 - {Function} processData
	     *                 - {Function} cleanup
	     */

	    RouteTransition.prototype.callHook = function callHook(hook, context, cb) {
	      var _ref = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

	      var _ref$expectBoolean = _ref.expectBoolean;
	      var expectBoolean = _ref$expectBoolean === undefined ? false : _ref$expectBoolean;
	      var _ref$postActivate = _ref.postActivate;
	      var postActivate = _ref$postActivate === undefined ? false : _ref$postActivate;
	      var processData = _ref.processData;
	      var cleanup = _ref.cleanup;

	      var transition = this;
	      var nextCalled = false;

	      // abort the transition
	      var abort = function abort() {
	        cleanup && cleanup();
	        transition.abort();
	      };

	      // handle errors
	      var onError = function onError(err) {
	        postActivate ? next() : abort();
	        if (err && !transition.router._suppress) {
	          warn$1('Uncaught error during transition: ');
	          throw err instanceof Error ? err : new Error(err);
	        }
	      };

	      // since promise swallows errors, we have to
	      // throw it in the next tick...
	      var onPromiseError = function onPromiseError(err) {
	        try {
	          onError(err);
	        } catch (e) {
	          setTimeout(function () {
	            throw e;
	          }, 0);
	        }
	      };

	      // advance the transition to the next step
	      var next = function next() {
	        if (nextCalled) {
	          warn$1('transition.next() should be called only once.');
	          return;
	        }
	        nextCalled = true;
	        if (transition.aborted) {
	          cleanup && cleanup();
	          return;
	        }
	        cb && cb();
	      };

	      var nextWithBoolean = function nextWithBoolean(res) {
	        if (typeof res === 'boolean') {
	          res ? next() : abort();
	        } else if (isPromise(res)) {
	          res.then(function (ok) {
	            ok ? next() : abort();
	          }, onPromiseError);
	        } else if (!hook.length) {
	          next();
	        }
	      };

	      var nextWithData = function nextWithData(data) {
	        var res = undefined;
	        try {
	          res = processData(data);
	        } catch (err) {
	          return onError(err);
	        }
	        if (isPromise(res)) {
	          res.then(next, onPromiseError);
	        } else {
	          next();
	        }
	      };

	      // expose a clone of the transition object, so that each
	      // hook gets a clean copy and prevent the user from
	      // messing with the internals.
	      var exposed = {
	        to: transition.to,
	        from: transition.from,
	        abort: abort,
	        next: processData ? nextWithData : next,
	        redirect: function redirect() {
	          transition.redirect.apply(transition, arguments);
	        }
	      };

	      // actually call the hook
	      var res = undefined;
	      try {
	        res = hook.call(context, exposed);
	      } catch (err) {
	        return onError(err);
	      }

	      if (expectBoolean) {
	        // boolean hooks
	        nextWithBoolean(res);
	      } else if (isPromise(res)) {
	        // promise
	        if (processData) {
	          res.then(nextWithData, onPromiseError);
	        } else {
	          res.then(next, onPromiseError);
	        }
	      } else if (processData && isPlainOjbect(res)) {
	        // data promise sugar
	        nextWithData(res);
	      } else if (!hook.length) {
	        next();
	      }
	    };

	    /**
	     * Call a single hook or an array of async hooks in series.
	     *
	     * @param {Array} hooks
	     * @param {*} context
	     * @param {Function} cb
	     * @param {Object} [options]
	     */

	    RouteTransition.prototype.callHooks = function callHooks(hooks, context, cb, options) {
	      var _this = this;

	      if (Array.isArray(hooks)) {
	        this.runQueue(hooks, function (hook, _, next) {
	          if (!_this.aborted) {
	            _this.callHook(hook, context, next, options);
	          }
	        }, cb);
	      } else {
	        this.callHook(hooks, context, cb, options);
	      }
	    };

	    return RouteTransition;
	  })();

	  function isPlainOjbect(val) {
	    return Object.prototype.toString.call(val) === '[object Object]';
	  }

	  function toArray(val) {
	    return val ? Array.prototype.slice.call(val) : [];
	  }

	  var internalKeysRE = /^(component|subRoutes|fullPath)$/;

	  /**
	   * Route Context Object
	   *
	   * @param {String} path
	   * @param {Router} router
	   */

	  var Route = function Route(path, router) {
	    var _this = this;

	    babelHelpers.classCallCheck(this, Route);

	    var matched = router._recognizer.recognize(path);
	    if (matched) {
	      // copy all custom fields from route configs
	      [].forEach.call(matched, function (match) {
	        for (var key in match.handler) {
	          if (!internalKeysRE.test(key)) {
	            _this[key] = match.handler[key];
	          }
	        }
	      });
	      // set query and params
	      this.query = matched.queryParams;
	      this.params = [].reduce.call(matched, function (prev, cur) {
	        if (cur.params) {
	          for (var key in cur.params) {
	            prev[key] = cur.params[key];
	          }
	        }
	        return prev;
	      }, {});
	    }
	    // expose path and router
	    this.path = path;
	    // for internal use
	    this.matched = matched || router._notFoundHandler;
	    // internal reference to router
	    Object.defineProperty(this, 'router', {
	      enumerable: false,
	      value: router
	    });
	    // Important: freeze self to prevent observation
	    Object.freeze(this);
	  };

	  function applyOverride (Vue) {
	    var _Vue$util = Vue.util;
	    var extend = _Vue$util.extend;
	    var isArray = _Vue$util.isArray;
	    var defineReactive = _Vue$util.defineReactive;

	    // override Vue's init and destroy process to keep track of router instances
	    var init = Vue.prototype._init;
	    Vue.prototype._init = function (options) {
	      options = options || {};
	      var root = options._parent || options.parent || this;
	      var router = root.$router;
	      var route = root.$route;
	      if (router) {
	        // expose router
	        this.$router = router;
	        router._children.push(this);
	        /* istanbul ignore if */
	        if (this._defineMeta) {
	          // 0.12
	          this._defineMeta('$route', route);
	        } else {
	          // 1.0
	          defineReactive(this, '$route', route);
	        }
	      }
	      init.call(this, options);
	    };

	    var destroy = Vue.prototype._destroy;
	    Vue.prototype._destroy = function () {
	      if (!this._isBeingDestroyed && this.$router) {
	        this.$router._children.$remove(this);
	      }
	      destroy.apply(this, arguments);
	    };

	    // 1.0 only: enable route mixins
	    var strats = Vue.config.optionMergeStrategies;
	    var hooksToMergeRE = /^(data|activate|deactivate)$/;

	    if (strats) {
	      strats.route = function (parentVal, childVal) {
	        if (!childVal) return parentVal;
	        if (!parentVal) return childVal;
	        var ret = {};
	        extend(ret, parentVal);
	        for (var key in childVal) {
	          var a = ret[key];
	          var b = childVal[key];
	          // for data, activate and deactivate, we need to merge them into
	          // arrays similar to lifecycle hooks.
	          if (a && hooksToMergeRE.test(key)) {
	            ret[key] = (isArray(a) ? a : [a]).concat(b);
	          } else {
	            ret[key] = b;
	          }
	        }
	        return ret;
	      };
	    }
	  }

	  function View (Vue) {

	    var _ = Vue.util;
	    var componentDef =
	    // 0.12
	    Vue.directive('_component') ||
	    // 1.0
	    Vue.internalDirectives.component;
	    // <router-view> extends the internal component directive
	    var viewDef = _.extend({}, componentDef);

	    // with some overrides
	    _.extend(viewDef, {

	      _isRouterView: true,

	      bind: function bind() {
	        var route = this.vm.$route;
	        /* istanbul ignore if */
	        if (!route) {
	          warn$1('<router-view> can only be used inside a ' + 'router-enabled app.');
	          return;
	        }
	        // force dynamic directive so v-component doesn't
	        // attempt to build right now
	        this._isDynamicLiteral = true;
	        // finally, init by delegating to v-component
	        componentDef.bind.call(this);

	        // locate the parent view
	        var parentView = undefined;
	        var parent = this.vm;
	        while (parent) {
	          if (parent._routerView) {
	            parentView = parent._routerView;
	            break;
	          }
	          parent = parent.$parent;
	        }
	        if (parentView) {
	          // register self as a child of the parent view,
	          // instead of activating now. This is so that the
	          // child's activate hook is called after the
	          // parent's has resolved.
	          this.parentView = parentView;
	          parentView.childView = this;
	        } else {
	          // this is the root view!
	          var router = route.router;
	          router._rootView = this;
	        }

	        // handle late-rendered view
	        // two possibilities:
	        // 1. root view rendered after transition has been
	        //    validated;
	        // 2. child view rendered after parent view has been
	        //    activated.
	        var transition = route.router._currentTransition;
	        if (!parentView && transition.done || parentView && parentView.activated) {
	          var depth = parentView ? parentView.depth + 1 : 0;
	          activate(this, transition, depth);
	        }
	      },

	      unbind: function unbind() {
	        if (this.parentView) {
	          this.parentView.childView = null;
	        }
	        componentDef.unbind.call(this);
	      }
	    });

	    Vue.elementDirective('router-view', viewDef);
	  }

	  var trailingSlashRE = /\/$/;
	  var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;
	  var queryStringRE = /\?.*$/;

	  // install v-link, which provides navigation support for
	  // HTML5 history mode
	  function Link (Vue) {
	    var _Vue$util = Vue.util;
	    var _bind = _Vue$util.bind;
	    var isObject = _Vue$util.isObject;
	    var addClass = _Vue$util.addClass;
	    var removeClass = _Vue$util.removeClass;

	    var onPriority = Vue.directive('on').priority;
	    var LINK_UPDATE = '__vue-router-link-update__';

	    var activeId = 0;

	    Vue.directive('link-active', {
	      priority: 9999,
	      bind: function bind() {
	        var _this = this;

	        var id = String(activeId++);
	        // collect v-links contained within this element.
	        // we need do this here before the parent-child relationship
	        // gets messed up by terminal directives (if, for, components)
	        var childLinks = this.el.querySelectorAll('[v-link]');
	        for (var i = 0, l = childLinks.length; i < l; i++) {
	          var link = childLinks[i];
	          var existingId = link.getAttribute(LINK_UPDATE);
	          var value = existingId ? existingId + ',' + id : id;
	          // leave a mark on the link element which can be persisted
	          // through fragment clones.
	          link.setAttribute(LINK_UPDATE, value);
	        }
	        this.vm.$on(LINK_UPDATE, this.cb = function (link, path) {
	          if (link.activeIds.indexOf(id) > -1) {
	            link.updateClasses(path, _this.el);
	          }
	        });
	      },
	      unbind: function unbind() {
	        this.vm.$off(LINK_UPDATE, this.cb);
	      }
	    });

	    Vue.directive('link', {
	      priority: onPriority - 2,

	      bind: function bind() {
	        var vm = this.vm;
	        /* istanbul ignore if */
	        if (!vm.$route) {
	          warn$1('v-link can only be used inside a router-enabled app.');
	          return;
	        }
	        this.router = vm.$route.router;
	        // update things when the route changes
	        this.unwatch = vm.$watch('$route', _bind(this.onRouteUpdate, this));
	        // check v-link-active ids
	        var activeIds = this.el.getAttribute(LINK_UPDATE);
	        if (activeIds) {
	          this.el.removeAttribute(LINK_UPDATE);
	          this.activeIds = activeIds.split(',');
	        }
	        // no need to handle click if link expects to be opened
	        // in a new window/tab.
	        /* istanbul ignore if */
	        if (this.el.tagName === 'A' && this.el.getAttribute('target') === '_blank') {
	          return;
	        }
	        // handle click
	        this.handler = _bind(this.onClick, this);
	        this.el.addEventListener('click', this.handler);
	      },

	      update: function update(target) {
	        this.target = target;
	        if (isObject(target)) {
	          this.append = target.append;
	          this.exact = target.exact;
	          this.prevActiveClass = this.activeClass;
	          this.activeClass = target.activeClass;
	        }
	        this.onRouteUpdate(this.vm.$route);
	      },

	      onClick: function onClick(e) {
	        // don't redirect with control keys
	        /* istanbul ignore if */
	        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
	        // don't redirect when preventDefault called
	        /* istanbul ignore if */
	        if (e.defaultPrevented) return;
	        // don't redirect on right click
	        /* istanbul ignore if */
	        if (e.button !== 0) return;

	        var target = this.target;
	        if (target) {
	          // v-link with expression, just go
	          e.preventDefault();
	          this.router.go(target);
	        } else {
	          // no expression, delegate for an <a> inside
	          var el = e.target;
	          while (el.tagName !== 'A' && el !== this.el) {
	            el = el.parentNode;
	          }
	          if (el.tagName === 'A' && sameOrigin(el)) {
	            e.preventDefault();
	            var path = el.pathname;
	            if (this.router.history.root) {
	              path = path.replace(this.router.history.rootRE, '');
	            }
	            this.router.go({
	              path: path,
	              replace: target && target.replace,
	              append: target && target.append
	            });
	          }
	        }
	      },

	      onRouteUpdate: function onRouteUpdate(route) {
	        // router.stringifyPath is dependent on current route
	        // and needs to be called again whenver route changes.
	        var newPath = this.router.stringifyPath(this.target);
	        if (this.path !== newPath) {
	          this.path = newPath;
	          this.updateActiveMatch();
	          this.updateHref();
	        }
	        if (this.activeIds) {
	          this.vm.$emit(LINK_UPDATE, this, route.path);
	        } else {
	          this.updateClasses(route.path, this.el);
	        }
	      },

	      updateActiveMatch: function updateActiveMatch() {
	        this.activeRE = this.path && !this.exact ? new RegExp('^' + this.path.replace(/\/$/, '').replace(queryStringRE, '').replace(regexEscapeRE, '\\$&') + '(\\/|$)') : null;
	      },

	      updateHref: function updateHref() {
	        if (this.el.tagName !== 'A') {
	          return;
	        }
	        var path = this.path;
	        var router = this.router;
	        var isAbsolute = path.charAt(0) === '/';
	        // do not format non-hash relative paths
	        var href = path && (router.mode === 'hash' || isAbsolute) ? router.history.formatPath(path, this.append) : path;
	        if (href) {
	          this.el.href = href;
	        } else {
	          this.el.removeAttribute('href');
	        }
	      },

	      updateClasses: function updateClasses(path, el) {
	        var activeClass = this.activeClass || this.router._linkActiveClass;
	        // clear old class
	        if (this.prevActiveClass && this.prevActiveClass !== activeClass) {
	          toggleClasses(el, this.prevActiveClass, removeClass);
	        }
	        // remove query string before matching
	        var dest = this.path.replace(queryStringRE, '');
	        path = path.replace(queryStringRE, '');
	        // add new class
	        if (this.exact) {
	          if (dest === path ||
	          // also allow additional trailing slash
	          dest.charAt(dest.length - 1) !== '/' && dest === path.replace(trailingSlashRE, '')) {
	            toggleClasses(el, activeClass, addClass);
	          } else {
	            toggleClasses(el, activeClass, removeClass);
	          }
	        } else {
	          if (this.activeRE && this.activeRE.test(path)) {
	            toggleClasses(el, activeClass, addClass);
	          } else {
	            toggleClasses(el, activeClass, removeClass);
	          }
	        }
	      },

	      unbind: function unbind() {
	        this.el.removeEventListener('click', this.handler);
	        this.unwatch && this.unwatch();
	      }
	    });

	    function sameOrigin(link) {
	      return link.protocol === location.protocol && link.hostname === location.hostname && link.port === location.port;
	    }

	    // this function is copied from v-bind:class implementation until
	    // we properly expose it...
	    function toggleClasses(el, key, fn) {
	      key = key.trim();
	      if (key.indexOf(' ') === -1) {
	        fn(el, key);
	        return;
	      }
	      var keys = key.split(/\s+/);
	      for (var i = 0, l = keys.length; i < l; i++) {
	        fn(el, keys[i]);
	      }
	    }
	  }

	  var historyBackends = {
	    abstract: AbstractHistory,
	    hash: HashHistory,
	    html5: HTML5History
	  };

	  // late bind during install
	  var Vue = undefined;

	  /**
	   * Router constructor
	   *
	   * @param {Object} [options]
	   */

	  var Router = (function () {
	    function Router() {
	      var _this = this;

	      var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	      var _ref$hashbang = _ref.hashbang;
	      var hashbang = _ref$hashbang === undefined ? true : _ref$hashbang;
	      var _ref$abstract = _ref.abstract;
	      var abstract = _ref$abstract === undefined ? false : _ref$abstract;
	      var _ref$history = _ref.history;
	      var history = _ref$history === undefined ? false : _ref$history;
	      var _ref$saveScrollPosition = _ref.saveScrollPosition;
	      var saveScrollPosition = _ref$saveScrollPosition === undefined ? false : _ref$saveScrollPosition;
	      var _ref$transitionOnLoad = _ref.transitionOnLoad;
	      var transitionOnLoad = _ref$transitionOnLoad === undefined ? false : _ref$transitionOnLoad;
	      var _ref$suppressTransitionError = _ref.suppressTransitionError;
	      var suppressTransitionError = _ref$suppressTransitionError === undefined ? false : _ref$suppressTransitionError;
	      var _ref$root = _ref.root;
	      var root = _ref$root === undefined ? null : _ref$root;
	      var _ref$linkActiveClass = _ref.linkActiveClass;
	      var linkActiveClass = _ref$linkActiveClass === undefined ? 'v-link-active' : _ref$linkActiveClass;
	      babelHelpers.classCallCheck(this, Router);

	      /* istanbul ignore if */
	      if (!Router.installed) {
	        throw new Error('Please install the Router with Vue.use() before ' + 'creating an instance.');
	      }

	      // Vue instances
	      this.app = null;
	      this._children = [];

	      // route recognizer
	      this._recognizer = new RouteRecognizer();
	      this._guardRecognizer = new RouteRecognizer();

	      // state
	      this._started = false;
	      this._startCb = null;
	      this._currentRoute = {};
	      this._currentTransition = null;
	      this._previousTransition = null;
	      this._notFoundHandler = null;
	      this._notFoundRedirect = null;
	      this._beforeEachHooks = [];
	      this._afterEachHooks = [];

	      // trigger transition on initial render?
	      this._rendered = false;
	      this._transitionOnLoad = transitionOnLoad;

	      // history mode
	      this._root = root;
	      this._abstract = abstract;
	      this._hashbang = hashbang;

	      // check if HTML5 history is available
	      var hasPushState = typeof window !== 'undefined' && window.history && window.history.pushState;
	      this._history = history && hasPushState;
	      this._historyFallback = history && !hasPushState;

	      // create history object
	      var inBrowser = Vue.util.inBrowser;
	      this.mode = !inBrowser || this._abstract ? 'abstract' : this._history ? 'html5' : 'hash';

	      var History = historyBackends[this.mode];
	      this.history = new History({
	        root: root,
	        hashbang: this._hashbang,
	        onChange: function onChange(path, state, anchor) {
	          _this._match(path, state, anchor);
	        }
	      });

	      // other options
	      this._saveScrollPosition = saveScrollPosition;
	      this._linkActiveClass = linkActiveClass;
	      this._suppress = suppressTransitionError;
	    }

	    /**
	     * Allow directly passing components to a route
	     * definition.
	     *
	     * @param {String} path
	     * @param {Object} handler
	     */

	    // API ===================================================

	    /**
	    * Register a map of top-level paths.
	    *
	    * @param {Object} map
	    */

	    Router.prototype.map = function map(_map) {
	      for (var route in _map) {
	        this.on(route, _map[route]);
	      }
	      return this;
	    };

	    /**
	     * Register a single root-level path
	     *
	     * @param {String} rootPath
	     * @param {Object} handler
	     *                 - {String} component
	     *                 - {Object} [subRoutes]
	     *                 - {Boolean} [forceRefresh]
	     *                 - {Function} [before]
	     *                 - {Function} [after]
	     */

	    Router.prototype.on = function on(rootPath, handler) {
	      if (rootPath === '*') {
	        this._notFound(handler);
	      } else {
	        this._addRoute(rootPath, handler, []);
	      }
	      return this;
	    };

	    /**
	     * Set redirects.
	     *
	     * @param {Object} map
	     */

	    Router.prototype.redirect = function redirect(map) {
	      for (var path in map) {
	        this._addRedirect(path, map[path]);
	      }
	      return this;
	    };

	    /**
	     * Set aliases.
	     *
	     * @param {Object} map
	     */

	    Router.prototype.alias = function alias(map) {
	      for (var path in map) {
	        this._addAlias(path, map[path]);
	      }
	      return this;
	    };

	    /**
	     * Set global before hook.
	     *
	     * @param {Function} fn
	     */

	    Router.prototype.beforeEach = function beforeEach(fn) {
	      this._beforeEachHooks.push(fn);
	      return this;
	    };

	    /**
	     * Set global after hook.
	     *
	     * @param {Function} fn
	     */

	    Router.prototype.afterEach = function afterEach(fn) {
	      this._afterEachHooks.push(fn);
	      return this;
	    };

	    /**
	     * Navigate to a given path.
	     * The path can be an object describing a named path in
	     * the format of { name: '...', params: {}, query: {}}
	     * The path is assumed to be already decoded, and will
	     * be resolved against root (if provided)
	     *
	     * @param {String|Object} path
	     * @param {Boolean} [replace]
	     */

	    Router.prototype.go = function go(path) {
	      var replace = false;
	      var append = false;
	      if (Vue.util.isObject(path)) {
	        replace = path.replace;
	        append = path.append;
	      }
	      path = this.stringifyPath(path);
	      if (path) {
	        this.history.go(path, replace, append);
	      }
	    };

	    /**
	     * Short hand for replacing current path
	     *
	     * @param {String} path
	     */

	    Router.prototype.replace = function replace(path) {
	      if (typeof path === 'string') {
	        path = { path: path };
	      }
	      path.replace = true;
	      this.go(path);
	    };

	    /**
	     * Start the router.
	     *
	     * @param {VueConstructor} App
	     * @param {String|Element} container
	     * @param {Function} [cb]
	     */

	    Router.prototype.start = function start(App, container, cb) {
	      /* istanbul ignore if */
	      if (this._started) {
	        warn$1('already started.');
	        return;
	      }
	      this._started = true;
	      this._startCb = cb;
	      if (!this.app) {
	        /* istanbul ignore if */
	        if (!App || !container) {
	          throw new Error('Must start vue-router with a component and a ' + 'root container.');
	        }
	        /* istanbul ignore if */
	        if (App instanceof Vue) {
	          throw new Error('Must start vue-router with a component, not a ' + 'Vue instance.');
	        }
	        this._appContainer = container;
	        var Ctor = this._appConstructor = typeof App === 'function' ? App : Vue.extend(App);
	        // give it a name for better debugging
	        Ctor.options.name = Ctor.options.name || 'RouterApp';
	      }

	      // handle history fallback in browsers that do not
	      // support HTML5 history API
	      if (this._historyFallback) {
	        var _location = window.location;
	        var _history = new HTML5History({ root: this._root });
	        var path = _history.root ? _location.pathname.replace(_history.rootRE, '') : _location.pathname;
	        if (path && path !== '/') {
	          _location.assign((_history.root || '') + '/' + this.history.formatPath(path) + _location.search);
	          return;
	        }
	      }

	      this.history.start();
	    };

	    /**
	     * Stop listening to route changes.
	     */

	    Router.prototype.stop = function stop() {
	      this.history.stop();
	      this._started = false;
	    };

	    /**
	     * Normalize named route object / string paths into
	     * a string.
	     *
	     * @param {Object|String|Number} path
	     * @return {String}
	     */

	    Router.prototype.stringifyPath = function stringifyPath(path) {
	      var generatedPath = '';
	      if (path && typeof path === 'object') {
	        if (path.name) {
	          var extend = Vue.util.extend;
	          var currentParams = this._currentTransition && this._currentTransition.to.params;
	          var targetParams = path.params || {};
	          var params = currentParams ? extend(extend({}, currentParams), targetParams) : targetParams;
	          generatedPath = encodeURI(this._recognizer.generate(path.name, params));
	        } else if (path.path) {
	          generatedPath = encodeURI(path.path);
	        }
	        if (path.query) {
	          // note: the generated query string is pre-URL-encoded by the recognizer
	          var query = this._recognizer.generateQueryString(path.query);
	          if (generatedPath.indexOf('?') > -1) {
	            generatedPath += '&' + query.slice(1);
	          } else {
	            generatedPath += query;
	          }
	        }
	      } else {
	        generatedPath = encodeURI(path ? path + '' : '');
	      }
	      return generatedPath;
	    };

	    // Internal methods ======================================

	    /**
	    * Add a route containing a list of segments to the internal
	    * route recognizer. Will be called recursively to add all
	    * possible sub-routes.
	    *
	    * @param {String} path
	    * @param {Object} handler
	    * @param {Array} segments
	    */

	    Router.prototype._addRoute = function _addRoute(path, handler, segments) {
	      guardComponent(path, handler);
	      handler.path = path;
	      handler.fullPath = (segments.reduce(function (path, segment) {
	        return path + segment.path;
	      }, '') + path).replace('//', '/');
	      segments.push({
	        path: path,
	        handler: handler
	      });
	      this._recognizer.add(segments, {
	        as: handler.name
	      });
	      // add sub routes
	      if (handler.subRoutes) {
	        for (var subPath in handler.subRoutes) {
	          // recursively walk all sub routes
	          this._addRoute(subPath, handler.subRoutes[subPath],
	          // pass a copy in recursion to avoid mutating
	          // across branches
	          segments.slice());
	        }
	      }
	    };

	    /**
	     * Set the notFound route handler.
	     *
	     * @param {Object} handler
	     */

	    Router.prototype._notFound = function _notFound(handler) {
	      guardComponent('*', handler);
	      this._notFoundHandler = [{ handler: handler }];
	    };

	    /**
	     * Add a redirect record.
	     *
	     * @param {String} path
	     * @param {String} redirectPath
	     */

	    Router.prototype._addRedirect = function _addRedirect(path, redirectPath) {
	      if (path === '*') {
	        this._notFoundRedirect = redirectPath;
	      } else {
	        this._addGuard(path, redirectPath, this.replace);
	      }
	    };

	    /**
	     * Add an alias record.
	     *
	     * @param {String} path
	     * @param {String} aliasPath
	     */

	    Router.prototype._addAlias = function _addAlias(path, aliasPath) {
	      this._addGuard(path, aliasPath, this._match);
	    };

	    /**
	     * Add a path guard.
	     *
	     * @param {String} path
	     * @param {String} mappedPath
	     * @param {Function} handler
	     */

	    Router.prototype._addGuard = function _addGuard(path, mappedPath, _handler) {
	      var _this2 = this;

	      this._guardRecognizer.add([{
	        path: path,
	        handler: function handler(match, query) {
	          var realPath = mapParams(mappedPath, match.params, query);
	          _handler.call(_this2, realPath);
	        }
	      }]);
	    };

	    /**
	     * Check if a path matches any redirect records.
	     *
	     * @param {String} path
	     * @return {Boolean} - if true, will skip normal match.
	     */

	    Router.prototype._checkGuard = function _checkGuard(path) {
	      var matched = this._guardRecognizer.recognize(path, true);
	      if (matched) {
	        matched[0].handler(matched[0], matched.queryParams);
	        return true;
	      } else if (this._notFoundRedirect) {
	        matched = this._recognizer.recognize(path);
	        if (!matched) {
	          this.replace(this._notFoundRedirect);
	          return true;
	        }
	      }
	    };

	    /**
	     * Match a URL path and set the route context on vm,
	     * triggering view updates.
	     *
	     * @param {String} path
	     * @param {Object} [state]
	     * @param {String} [anchor]
	     */

	    Router.prototype._match = function _match(path, state, anchor) {
	      var _this3 = this;

	      if (this._checkGuard(path)) {
	        return;
	      }

	      var currentRoute = this._currentRoute;
	      var currentTransition = this._currentTransition;

	      if (currentTransition) {
	        if (currentTransition.to.path === path) {
	          // do nothing if we have an active transition going to the same path
	          return;
	        } else if (currentRoute.path === path) {
	          // We are going to the same path, but we also have an ongoing but
	          // not-yet-validated transition. Abort that transition and reset to
	          // prev transition.
	          currentTransition.aborted = true;
	          this._currentTransition = this._prevTransition;
	          return;
	        } else {
	          // going to a totally different path. abort ongoing transition.
	          currentTransition.aborted = true;
	        }
	      }

	      // construct new route and transition context
	      var route = new Route(path, this);
	      var transition = new RouteTransition(this, route, currentRoute);

	      // current transition is updated right now.
	      // however, current route will only be updated after the transition has
	      // been validated.
	      this._prevTransition = currentTransition;
	      this._currentTransition = transition;

	      if (!this.app) {
	        (function () {
	          // initial render
	          var router = _this3;
	          _this3.app = new _this3._appConstructor({
	            el: _this3._appContainer,
	            created: function created() {
	              this.$router = router;
	            },
	            _meta: {
	              $route: route
	            }
	          });
	        })();
	      }

	      // check global before hook
	      var beforeHooks = this._beforeEachHooks;
	      var startTransition = function startTransition() {
	        transition.start(function () {
	          _this3._postTransition(route, state, anchor);
	        });
	      };

	      if (beforeHooks.length) {
	        transition.runQueue(beforeHooks, function (hook, _, next) {
	          if (transition === _this3._currentTransition) {
	            transition.callHook(hook, null, next, {
	              expectBoolean: true
	            });
	          }
	        }, startTransition);
	      } else {
	        startTransition();
	      }

	      if (!this._rendered && this._startCb) {
	        this._startCb.call(null);
	      }

	      // HACK:
	      // set rendered to true after the transition start, so
	      // that components that are acitvated synchronously know
	      // whether it is the initial render.
	      this._rendered = true;
	    };

	    /**
	     * Set current to the new transition.
	     * This is called by the transition object when the
	     * validation of a route has succeeded.
	     *
	     * @param {Transition} transition
	     */

	    Router.prototype._onTransitionValidated = function _onTransitionValidated(transition) {
	      // set current route
	      var route = this._currentRoute = transition.to;
	      // update route context for all children
	      if (this.app.$route !== route) {
	        this.app.$route = route;
	        this._children.forEach(function (child) {
	          child.$route = route;
	        });
	      }
	      // call global after hook
	      if (this._afterEachHooks.length) {
	        this._afterEachHooks.forEach(function (hook) {
	          return hook.call(null, {
	            to: transition.to,
	            from: transition.from
	          });
	        });
	      }
	      this._currentTransition.done = true;
	    };

	    /**
	     * Handle stuff after the transition.
	     *
	     * @param {Route} route
	     * @param {Object} [state]
	     * @param {String} [anchor]
	     */

	    Router.prototype._postTransition = function _postTransition(route, state, anchor) {
	      // handle scroll positions
	      // saved scroll positions take priority
	      // then we check if the path has an anchor
	      var pos = state && state.pos;
	      if (pos && this._saveScrollPosition) {
	        Vue.nextTick(function () {
	          window.scrollTo(pos.x, pos.y);
	        });
	      } else if (anchor) {
	        Vue.nextTick(function () {
	          var el = document.getElementById(anchor.slice(1));
	          if (el) {
	            window.scrollTo(window.scrollX, el.offsetTop);
	          }
	        });
	      }
	    };

	    return Router;
	  })();

	  function guardComponent(path, handler) {
	    var comp = handler.component;
	    if (Vue.util.isPlainObject(comp)) {
	      comp = handler.component = Vue.extend(comp);
	    }
	    /* istanbul ignore if */
	    if (typeof comp !== 'function') {
	      handler.component = null;
	      warn$1('invalid component for route "' + path + '".');
	    }
	  }

	  /* Installation */

	  Router.installed = false;

	  /**
	   * Installation interface.
	   * Install the necessary directives.
	   */

	  Router.install = function (externalVue) {
	    /* istanbul ignore if */
	    if (Router.installed) {
	      warn$1('already installed.');
	      return;
	    }
	    Vue = externalVue;
	    applyOverride(Vue);
	    View(Vue);
	    Link(Vue);
	    exports$1.Vue = Vue;
	    Router.installed = true;
	  };

	  // auto install
	  /* istanbul ignore if */
	  if (typeof window !== 'undefined' && window.Vue) {
	    window.Vue.use(Router);
	  }

	  return Router;

	}));

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	/*!
	 * vue-resource v1.3.3
	 * https://github.com/pagekit/vue-resource
	 * Released under the MIT License.
	 */

	'use strict';

	/**
	 * Promises/A+ polyfill v1.1.4 (https://github.com/bramstein/promis)
	 */

	var RESOLVED = 0;
	var REJECTED = 1;
	var PENDING  = 2;

	function Promise$1(executor) {

	    this.state = PENDING;
	    this.value = undefined;
	    this.deferred = [];

	    var promise = this;

	    try {
	        executor(function (x) {
	            promise.resolve(x);
	        }, function (r) {
	            promise.reject(r);
	        });
	    } catch (e) {
	        promise.reject(e);
	    }
	}

	Promise$1.reject = function (r) {
	    return new Promise$1(function (resolve, reject) {
	        reject(r);
	    });
	};

	Promise$1.resolve = function (x) {
	    return new Promise$1(function (resolve, reject) {
	        resolve(x);
	    });
	};

	Promise$1.all = function all(iterable) {
	    return new Promise$1(function (resolve, reject) {
	        var count = 0, result = [];

	        if (iterable.length === 0) {
	            resolve(result);
	        }

	        function resolver(i) {
	            return function (x) {
	                result[i] = x;
	                count += 1;

	                if (count === iterable.length) {
	                    resolve(result);
	                }
	            };
	        }

	        for (var i = 0; i < iterable.length; i += 1) {
	            Promise$1.resolve(iterable[i]).then(resolver(i), reject);
	        }
	    });
	};

	Promise$1.race = function race(iterable) {
	    return new Promise$1(function (resolve, reject) {
	        for (var i = 0; i < iterable.length; i += 1) {
	            Promise$1.resolve(iterable[i]).then(resolve, reject);
	        }
	    });
	};

	var p$1 = Promise$1.prototype;

	p$1.resolve = function resolve(x) {
	    var promise = this;

	    if (promise.state === PENDING) {
	        if (x === promise) {
	            throw new TypeError('Promise settled with itself.');
	        }

	        var called = false;

	        try {
	            var then = x && x['then'];

	            if (x !== null && typeof x === 'object' && typeof then === 'function') {
	                then.call(x, function (x) {
	                    if (!called) {
	                        promise.resolve(x);
	                    }
	                    called = true;

	                }, function (r) {
	                    if (!called) {
	                        promise.reject(r);
	                    }
	                    called = true;
	                });
	                return;
	            }
	        } catch (e) {
	            if (!called) {
	                promise.reject(e);
	            }
	            return;
	        }

	        promise.state = RESOLVED;
	        promise.value = x;
	        promise.notify();
	    }
	};

	p$1.reject = function reject(reason) {
	    var promise = this;

	    if (promise.state === PENDING) {
	        if (reason === promise) {
	            throw new TypeError('Promise settled with itself.');
	        }

	        promise.state = REJECTED;
	        promise.value = reason;
	        promise.notify();
	    }
	};

	p$1.notify = function notify() {
	    var promise = this;

	    nextTick(function () {
	        if (promise.state !== PENDING) {
	            while (promise.deferred.length) {
	                var deferred = promise.deferred.shift(),
	                    onResolved = deferred[0],
	                    onRejected = deferred[1],
	                    resolve = deferred[2],
	                    reject = deferred[3];

	                try {
	                    if (promise.state === RESOLVED) {
	                        if (typeof onResolved === 'function') {
	                            resolve(onResolved.call(undefined, promise.value));
	                        } else {
	                            resolve(promise.value);
	                        }
	                    } else if (promise.state === REJECTED) {
	                        if (typeof onRejected === 'function') {
	                            resolve(onRejected.call(undefined, promise.value));
	                        } else {
	                            reject(promise.value);
	                        }
	                    }
	                } catch (e) {
	                    reject(e);
	                }
	            }
	        }
	    });
	};

	p$1.then = function then(onResolved, onRejected) {
	    var promise = this;

	    return new Promise$1(function (resolve, reject) {
	        promise.deferred.push([onResolved, onRejected, resolve, reject]);
	        promise.notify();
	    });
	};

	p$1.catch = function (onRejected) {
	    return this.then(undefined, onRejected);
	};

	/**
	 * Promise adapter.
	 */

	if (typeof Promise === 'undefined') {
	    window.Promise = Promise$1;
	}

	function PromiseObj(executor, context) {

	    if (executor instanceof Promise) {
	        this.promise = executor;
	    } else {
	        this.promise = new Promise(executor.bind(context));
	    }

	    this.context = context;
	}

	PromiseObj.all = function (iterable, context) {
	    return new PromiseObj(Promise.all(iterable), context);
	};

	PromiseObj.resolve = function (value, context) {
	    return new PromiseObj(Promise.resolve(value), context);
	};

	PromiseObj.reject = function (reason, context) {
	    return new PromiseObj(Promise.reject(reason), context);
	};

	PromiseObj.race = function (iterable, context) {
	    return new PromiseObj(Promise.race(iterable), context);
	};

	var p = PromiseObj.prototype;

	p.bind = function (context) {
	    this.context = context;
	    return this;
	};

	p.then = function (fulfilled, rejected) {

	    if (fulfilled && fulfilled.bind && this.context) {
	        fulfilled = fulfilled.bind(this.context);
	    }

	    if (rejected && rejected.bind && this.context) {
	        rejected = rejected.bind(this.context);
	    }

	    return new PromiseObj(this.promise.then(fulfilled, rejected), this.context);
	};

	p.catch = function (rejected) {

	    if (rejected && rejected.bind && this.context) {
	        rejected = rejected.bind(this.context);
	    }

	    return new PromiseObj(this.promise.catch(rejected), this.context);
	};

	p.finally = function (callback) {

	    return this.then(function (value) {
	            callback.call(this);
	            return value;
	        }, function (reason) {
	            callback.call(this);
	            return Promise.reject(reason);
	        }
	    );
	};

	/**
	 * Utility functions.
	 */

	var ref = {};
	var hasOwnProperty = ref.hasOwnProperty;

	var ref$1 = [];
	var slice = ref$1.slice;
	var debug = false;
	var ntick;

	var inBrowser = typeof window !== 'undefined';

	var Util = function (ref) {
	    var config = ref.config;
	    var nextTick = ref.nextTick;

	    ntick = nextTick;
	    debug = config.debug || !config.silent;
	};

	function warn(msg) {
	    if (typeof console !== 'undefined' && debug) {
	        console.warn('[VueResource warn]: ' + msg);
	    }
	}

	function error(msg) {
	    if (typeof console !== 'undefined') {
	        console.error(msg);
	    }
	}

	function nextTick(cb, ctx) {
	    return ntick(cb, ctx);
	}

	function trim(str) {
	    return str ? str.replace(/^\s*|\s*$/g, '') : '';
	}

	function trimEnd(str, chars) {

	    if (str && chars === undefined) {
	        return str.replace(/\s+$/, '');
	    }

	    if (!str || !chars) {
	        return str;
	    }

	    return str.replace(new RegExp(("[" + chars + "]+$")), '');
	}

	function toLower(str) {
	    return str ? str.toLowerCase() : '';
	}

	function toUpper(str) {
	    return str ? str.toUpperCase() : '';
	}

	var isArray = Array.isArray;

	function isString(val) {
	    return typeof val === 'string';
	}



	function isFunction(val) {
	    return typeof val === 'function';
	}

	function isObject(obj) {
	    return obj !== null && typeof obj === 'object';
	}

	function isPlainObject(obj) {
	    return isObject(obj) && Object.getPrototypeOf(obj) == Object.prototype;
	}

	function isBlob(obj) {
	    return typeof Blob !== 'undefined' && obj instanceof Blob;
	}

	function isFormData(obj) {
	    return typeof FormData !== 'undefined' && obj instanceof FormData;
	}

	function when(value, fulfilled, rejected) {

	    var promise = PromiseObj.resolve(value);

	    if (arguments.length < 2) {
	        return promise;
	    }

	    return promise.then(fulfilled, rejected);
	}

	function options(fn, obj, opts) {

	    opts = opts || {};

	    if (isFunction(opts)) {
	        opts = opts.call(obj);
	    }

	    return merge(fn.bind({$vm: obj, $options: opts}), fn, {$options: opts});
	}

	function each(obj, iterator) {

	    var i, key;

	    if (isArray(obj)) {
	        for (i = 0; i < obj.length; i++) {
	            iterator.call(obj[i], obj[i], i);
	        }
	    } else if (isObject(obj)) {
	        for (key in obj) {
	            if (hasOwnProperty.call(obj, key)) {
	                iterator.call(obj[key], obj[key], key);
	            }
	        }
	    }

	    return obj;
	}

	var assign = Object.assign || _assign;

	function merge(target) {

	    var args = slice.call(arguments, 1);

	    args.forEach(function (source) {
	        _merge(target, source, true);
	    });

	    return target;
	}

	function defaults(target) {

	    var args = slice.call(arguments, 1);

	    args.forEach(function (source) {

	        for (var key in source) {
	            if (target[key] === undefined) {
	                target[key] = source[key];
	            }
	        }

	    });

	    return target;
	}

	function _assign(target) {

	    var args = slice.call(arguments, 1);

	    args.forEach(function (source) {
	        _merge(target, source);
	    });

	    return target;
	}

	function _merge(target, source, deep) {
	    for (var key in source) {
	        if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
	            if (isPlainObject(source[key]) && !isPlainObject(target[key])) {
	                target[key] = {};
	            }
	            if (isArray(source[key]) && !isArray(target[key])) {
	                target[key] = [];
	            }
	            _merge(target[key], source[key], deep);
	        } else if (source[key] !== undefined) {
	            target[key] = source[key];
	        }
	    }
	}

	/**
	 * Root Prefix Transform.
	 */

	var root = function (options$$1, next) {

	    var url = next(options$$1);

	    if (isString(options$$1.root) && !/^(https?:)?\//.test(url)) {
	        url = trimEnd(options$$1.root, '/') + '/' + url;
	    }

	    return url;
	};

	/**
	 * Query Parameter Transform.
	 */

	var query = function (options$$1, next) {

	    var urlParams = Object.keys(Url.options.params), query = {}, url = next(options$$1);

	    each(options$$1.params, function (value, key) {
	        if (urlParams.indexOf(key) === -1) {
	            query[key] = value;
	        }
	    });

	    query = Url.params(query);

	    if (query) {
	        url += (url.indexOf('?') == -1 ? '?' : '&') + query;
	    }

	    return url;
	};

	/**
	 * URL Template v2.0.6 (https://github.com/bramstein/url-template)
	 */

	function expand(url, params, variables) {

	    var tmpl = parse(url), expanded = tmpl.expand(params);

	    if (variables) {
	        variables.push.apply(variables, tmpl.vars);
	    }

	    return expanded;
	}

	function parse(template) {

	    var operators = ['+', '#', '.', '/', ';', '?', '&'], variables = [];

	    return {
	        vars: variables,
	        expand: function expand(context) {
	            return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
	                if (expression) {

	                    var operator = null, values = [];

	                    if (operators.indexOf(expression.charAt(0)) !== -1) {
	                        operator = expression.charAt(0);
	                        expression = expression.substr(1);
	                    }

	                    expression.split(/,/g).forEach(function (variable) {
	                        var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
	                        values.push.apply(values, getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
	                        variables.push(tmp[1]);
	                    });

	                    if (operator && operator !== '+') {

	                        var separator = ',';

	                        if (operator === '?') {
	                            separator = '&';
	                        } else if (operator !== '#') {
	                            separator = operator;
	                        }

	                        return (values.length !== 0 ? operator : '') + values.join(separator);
	                    } else {
	                        return values.join(',');
	                    }

	                } else {
	                    return encodeReserved(literal);
	                }
	            });
	        }
	    };
	}

	function getValues(context, operator, key, modifier) {

	    var value = context[key], result = [];

	    if (isDefined(value) && value !== '') {
	        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
	            value = value.toString();

	            if (modifier && modifier !== '*') {
	                value = value.substring(0, parseInt(modifier, 10));
	            }

	            result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : null));
	        } else {
	            if (modifier === '*') {
	                if (Array.isArray(value)) {
	                    value.filter(isDefined).forEach(function (value) {
	                        result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : null));
	                    });
	                } else {
	                    Object.keys(value).forEach(function (k) {
	                        if (isDefined(value[k])) {
	                            result.push(encodeValue(operator, value[k], k));
	                        }
	                    });
	                }
	            } else {
	                var tmp = [];

	                if (Array.isArray(value)) {
	                    value.filter(isDefined).forEach(function (value) {
	                        tmp.push(encodeValue(operator, value));
	                    });
	                } else {
	                    Object.keys(value).forEach(function (k) {
	                        if (isDefined(value[k])) {
	                            tmp.push(encodeURIComponent(k));
	                            tmp.push(encodeValue(operator, value[k].toString()));
	                        }
	                    });
	                }

	                if (isKeyOperator(operator)) {
	                    result.push(encodeURIComponent(key) + '=' + tmp.join(','));
	                } else if (tmp.length !== 0) {
	                    result.push(tmp.join(','));
	                }
	            }
	        }
	    } else {
	        if (operator === ';') {
	            result.push(encodeURIComponent(key));
	        } else if (value === '' && (operator === '&' || operator === '?')) {
	            result.push(encodeURIComponent(key) + '=');
	        } else if (value === '') {
	            result.push('');
	        }
	    }

	    return result;
	}

	function isDefined(value) {
	    return value !== undefined && value !== null;
	}

	function isKeyOperator(operator) {
	    return operator === ';' || operator === '&' || operator === '?';
	}

	function encodeValue(operator, value, key) {

	    value = (operator === '+' || operator === '#') ? encodeReserved(value) : encodeURIComponent(value);

	    if (key) {
	        return encodeURIComponent(key) + '=' + value;
	    } else {
	        return value;
	    }
	}

	function encodeReserved(str) {
	    return str.split(/(%[0-9A-Fa-f]{2})/g).map(function (part) {
	        if (!/%[0-9A-Fa-f]/.test(part)) {
	            part = encodeURI(part);
	        }
	        return part;
	    }).join('');
	}

	/**
	 * URL Template (RFC 6570) Transform.
	 */

	var template = function (options) {

	    var variables = [], url = expand(options.url, options.params, variables);

	    variables.forEach(function (key) {
	        delete options.params[key];
	    });

	    return url;
	};

	/**
	 * Service for URL templating.
	 */

	function Url(url, params) {

	    var self = this || {}, options$$1 = url, transform;

	    if (isString(url)) {
	        options$$1 = {url: url, params: params};
	    }

	    options$$1 = merge({}, Url.options, self.$options, options$$1);

	    Url.transforms.forEach(function (handler) {

	        if (isString(handler)) {
	            handler = Url.transform[handler];
	        }

	        if (isFunction(handler)) {
	            transform = factory(handler, transform, self.$vm);
	        }

	    });

	    return transform(options$$1);
	}

	/**
	 * Url options.
	 */

	Url.options = {
	    url: '',
	    root: null,
	    params: {}
	};

	/**
	 * Url transforms.
	 */

	Url.transform = {template: template, query: query, root: root};
	Url.transforms = ['template', 'query', 'root'];

	/**
	 * Encodes a Url parameter string.
	 *
	 * @param {Object} obj
	 */

	Url.params = function (obj) {

	    var params = [], escape = encodeURIComponent;

	    params.add = function (key, value) {

	        if (isFunction(value)) {
	            value = value();
	        }

	        if (value === null) {
	            value = '';
	        }

	        this.push(escape(key) + '=' + escape(value));
	    };

	    serialize(params, obj);

	    return params.join('&').replace(/%20/g, '+');
	};

	/**
	 * Parse a URL and return its components.
	 *
	 * @param {String} url
	 */

	Url.parse = function (url) {

	    var el = document.createElement('a');

	    if (document.documentMode) {
	        el.href = url;
	        url = el.href;
	    }

	    el.href = url;

	    return {
	        href: el.href,
	        protocol: el.protocol ? el.protocol.replace(/:$/, '') : '',
	        port: el.port,
	        host: el.host,
	        hostname: el.hostname,
	        pathname: el.pathname.charAt(0) === '/' ? el.pathname : '/' + el.pathname,
	        search: el.search ? el.search.replace(/^\?/, '') : '',
	        hash: el.hash ? el.hash.replace(/^#/, '') : ''
	    };
	};

	function factory(handler, next, vm) {
	    return function (options$$1) {
	        return handler.call(vm, options$$1, next);
	    };
	}

	function serialize(params, obj, scope) {

	    var array = isArray(obj), plain = isPlainObject(obj), hash;

	    each(obj, function (value, key) {

	        hash = isObject(value) || isArray(value);

	        if (scope) {
	            key = scope + '[' + (plain || hash ? key : '') + ']';
	        }

	        if (!scope && array) {
	            params.add(value.name, value.value);
	        } else if (hash) {
	            serialize(params, value, key);
	        } else {
	            params.add(key, value);
	        }
	    });
	}

	/**
	 * XDomain client (Internet Explorer).
	 */

	var xdrClient = function (request) {
	    return new PromiseObj(function (resolve) {

	        var xdr = new XDomainRequest(), handler = function (ref) {
	            var type = ref.type;


	            var status = 0;

	            if (type === 'load') {
	                status = 200;
	            } else if (type === 'error') {
	                status = 500;
	            }

	            resolve(request.respondWith(xdr.responseText, {status: status}));
	        };

	        request.abort = function () { return xdr.abort(); };

	        xdr.open(request.method, request.getUrl());

	        if (request.timeout) {
	            xdr.timeout = request.timeout;
	        }

	        xdr.onload = handler;
	        xdr.onabort = handler;
	        xdr.onerror = handler;
	        xdr.ontimeout = handler;
	        xdr.onprogress = function () {};
	        xdr.send(request.getBody());
	    });
	};

	/**
	 * CORS Interceptor.
	 */

	var SUPPORTS_CORS = inBrowser && 'withCredentials' in new XMLHttpRequest();

	var cors = function (request, next) {

	    if (inBrowser) {

	        var orgUrl = Url.parse(location.href);
	        var reqUrl = Url.parse(request.getUrl());

	        if (reqUrl.protocol !== orgUrl.protocol || reqUrl.host !== orgUrl.host) {

	            request.crossOrigin = true;
	            request.emulateHTTP = false;

	            if (!SUPPORTS_CORS) {
	                request.client = xdrClient;
	            }
	        }
	    }

	    next();
	};

	/**
	 * Form data Interceptor.
	 */

	var form = function (request, next) {

	    if (isFormData(request.body)) {

	        request.headers.delete('Content-Type');

	    } else if (isObject(request.body) && request.emulateJSON) {

	        request.body = Url.params(request.body);
	        request.headers.set('Content-Type', 'application/x-www-form-urlencoded');
	    }

	    next();
	};

	/**
	 * JSON Interceptor.
	 */

	var json = function (request, next) {

	    var type = request.headers.get('Content-Type') || '';

	    if (isObject(request.body) && type.indexOf('application/json') === 0) {
	        request.body = JSON.stringify(request.body);
	    }

	    next(function (response) {

	        return response.bodyText ? when(response.text(), function (text) {

	            type = response.headers.get('Content-Type') || '';

	            if (type.indexOf('application/json') === 0 || isJson(text)) {

	                try {
	                    response.body = JSON.parse(text);
	                } catch (e) {
	                    response.body = null;
	                }

	            } else {
	                response.body = text;
	            }

	            return response;

	        }) : response;

	    });
	};

	function isJson(str) {

	    var start = str.match(/^\[|^\{(?!\{)/), end = {'[': /]$/, '{': /}$/};

	    return start && end[start[0]].test(str);
	}

	/**
	 * JSONP client (Browser).
	 */

	var jsonpClient = function (request) {
	    return new PromiseObj(function (resolve) {

	        var name = request.jsonp || 'callback', callback = request.jsonpCallback || '_jsonp' + Math.random().toString(36).substr(2), body = null, handler, script;

	        handler = function (ref) {
	            var type = ref.type;


	            var status = 0;

	            if (type === 'load' && body !== null) {
	                status = 200;
	            } else if (type === 'error') {
	                status = 500;
	            }

	            if (status && window[callback]) {
	                delete window[callback];
	                document.body.removeChild(script);
	            }

	            resolve(request.respondWith(body, {status: status}));
	        };

	        window[callback] = function (result) {
	            body = JSON.stringify(result);
	        };

	        request.abort = function () {
	            handler({type: 'abort'});
	        };

	        request.params[name] = callback;

	        if (request.timeout) {
	            setTimeout(request.abort, request.timeout);
	        }

	        script = document.createElement('script');
	        script.src = request.getUrl();
	        script.type = 'text/javascript';
	        script.async = true;
	        script.onload = handler;
	        script.onerror = handler;

	        document.body.appendChild(script);
	    });
	};

	/**
	 * JSONP Interceptor.
	 */

	var jsonp = function (request, next) {

	    if (request.method == 'JSONP') {
	        request.client = jsonpClient;
	    }

	    next();
	};

	/**
	 * Before Interceptor.
	 */

	var before = function (request, next) {

	    if (isFunction(request.before)) {
	        request.before.call(this, request);
	    }

	    next();
	};

	/**
	 * HTTP method override Interceptor.
	 */

	var method = function (request, next) {

	    if (request.emulateHTTP && /^(PUT|PATCH|DELETE)$/i.test(request.method)) {
	        request.headers.set('X-HTTP-Method-Override', request.method);
	        request.method = 'POST';
	    }

	    next();
	};

	/**
	 * Header Interceptor.
	 */

	var header = function (request, next) {

	    var headers = assign({}, Http.headers.common,
	        !request.crossOrigin ? Http.headers.custom : {},
	        Http.headers[toLower(request.method)]
	    );

	    each(headers, function (value, name) {
	        if (!request.headers.has(name)) {
	            request.headers.set(name, value);
	        }
	    });

	    next();
	};

	/**
	 * XMLHttp client (Browser).
	 */

	var xhrClient = function (request) {
	    return new PromiseObj(function (resolve) {

	        var xhr = new XMLHttpRequest(), handler = function (event) {

	            var response = request.respondWith(
	                'response' in xhr ? xhr.response : xhr.responseText, {
	                    status: xhr.status === 1223 ? 204 : xhr.status, // IE9 status bug
	                    statusText: xhr.status === 1223 ? 'No Content' : trim(xhr.statusText)
	                }
	            );

	            each(trim(xhr.getAllResponseHeaders()).split('\n'), function (row) {
	                response.headers.append(row.slice(0, row.indexOf(':')), row.slice(row.indexOf(':') + 1));
	            });

	            resolve(response);
	        };

	        request.abort = function () { return xhr.abort(); };

	        if (request.progress) {
	            if (request.method === 'GET') {
	                xhr.addEventListener('progress', request.progress);
	            } else if (/^(POST|PUT)$/i.test(request.method)) {
	                xhr.upload.addEventListener('progress', request.progress);
	            }
	        }

	        xhr.open(request.method, request.getUrl(), true);

	        if (request.timeout) {
	            xhr.timeout = request.timeout;
	        }

	        if (request.responseType && 'responseType' in xhr) {
	            xhr.responseType = request.responseType;
	        }

	        if (request.withCredentials || request.credentials) {
	            xhr.withCredentials = true;
	        }

	        if (!request.crossOrigin) {
	            request.headers.set('X-Requested-With', 'XMLHttpRequest');
	        }

	        request.headers.forEach(function (value, name) {
	            xhr.setRequestHeader(name, value);
	        });

	        xhr.onload = handler;
	        xhr.onabort = handler;
	        xhr.onerror = handler;
	        xhr.ontimeout = handler;
	        xhr.send(request.getBody());
	    });
	};

	/**
	 * Http client (Node).
	 */

	var nodeClient = function (request) {

	    var client = __webpack_require__(9);

	    return new PromiseObj(function (resolve) {

	        var url = request.getUrl();
	        var body = request.getBody();
	        var method = request.method;
	        var headers = {}, handler;

	        request.headers.forEach(function (value, name) {
	            headers[name] = value;
	        });

	        client(url, {body: body, method: method, headers: headers}).then(handler = function (resp) {

	            var response = request.respondWith(resp.body, {
	                    status: resp.statusCode,
	                    statusText: trim(resp.statusMessage)
	                }
	            );

	            each(resp.headers, function (value, name) {
	                response.headers.set(name, value);
	            });

	            resolve(response);

	        }, function (error$$1) { return handler(error$$1.response); });
	    });
	};

	/**
	 * Base client.
	 */

	var Client = function (context) {

	    var reqHandlers = [sendRequest], resHandlers = [], handler;

	    if (!isObject(context)) {
	        context = null;
	    }

	    function Client(request) {
	        return new PromiseObj(function (resolve) {

	            function exec() {

	                handler = reqHandlers.pop();

	                if (isFunction(handler)) {
	                    handler.call(context, request, next);
	                } else {
	                    warn(("Invalid interceptor of type " + (typeof handler) + ", must be a function"));
	                    next();
	                }
	            }

	            function next(response) {

	                if (isFunction(response)) {

	                    resHandlers.unshift(response);

	                } else if (isObject(response)) {

	                    resHandlers.forEach(function (handler) {
	                        response = when(response, function (response) {
	                            return handler.call(context, response) || response;
	                        });
	                    });

	                    when(response, resolve);

	                    return;
	                }

	                exec();
	            }

	            exec();

	        }, context);
	    }

	    Client.use = function (handler) {
	        reqHandlers.push(handler);
	    };

	    return Client;
	};

	function sendRequest(request, resolve) {

	    var client = request.client || (inBrowser ? xhrClient : nodeClient);

	    resolve(client(request));
	}

	/**
	 * HTTP Headers.
	 */

	var Headers = function Headers(headers) {
	    var this$1 = this;


	    this.map = {};

	    each(headers, function (value, name) { return this$1.append(name, value); });
	};

	Headers.prototype.has = function has (name) {
	    return getName(this.map, name) !== null;
	};

	Headers.prototype.get = function get (name) {

	    var list = this.map[getName(this.map, name)];

	    return list ? list.join() : null;
	};

	Headers.prototype.getAll = function getAll (name) {
	    return this.map[getName(this.map, name)] || [];
	};

	Headers.prototype.set = function set (name, value) {
	    this.map[normalizeName(getName(this.map, name) || name)] = [trim(value)];
	};

	Headers.prototype.append = function append (name, value){

	    var list = this.map[getName(this.map, name)];

	    if (list) {
	        list.push(trim(value));
	    } else {
	        this.set(name, value);
	    }
	};

	Headers.prototype.delete = function delete$1 (name){
	    delete this.map[getName(this.map, name)];
	};

	Headers.prototype.deleteAll = function deleteAll (){
	    this.map = {};
	};

	Headers.prototype.forEach = function forEach (callback, thisArg) {
	        var this$1 = this;

	    each(this.map, function (list, name) {
	        each(list, function (value) { return callback.call(thisArg, value, name, this$1); });
	    });
	};

	function getName(map, name) {
	    return Object.keys(map).reduce(function (prev, curr) {
	        return toLower(name) === toLower(curr) ? curr : prev;
	    }, null);
	}

	function normalizeName(name) {

	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	        throw new TypeError('Invalid character in header field name');
	    }

	    return trim(name);
	}

	/**
	 * HTTP Response.
	 */

	var Response = function Response(body, ref) {
	    var url = ref.url;
	    var headers = ref.headers;
	    var status = ref.status;
	    var statusText = ref.statusText;


	    this.url = url;
	    this.ok = status >= 200 && status < 300;
	    this.status = status || 0;
	    this.statusText = statusText || '';
	    this.headers = new Headers(headers);
	    this.body = body;

	    if (isString(body)) {

	        this.bodyText = body;

	    } else if (isBlob(body)) {

	        this.bodyBlob = body;

	        if (isBlobText(body)) {
	            this.bodyText = blobText(body);
	        }
	    }
	};

	Response.prototype.blob = function blob () {
	    return when(this.bodyBlob);
	};

	Response.prototype.text = function text () {
	    return when(this.bodyText);
	};

	Response.prototype.json = function json () {
	    return when(this.text(), function (text) { return JSON.parse(text); });
	};

	Object.defineProperty(Response.prototype, 'data', {

	    get: function get() {
	        return this.body;
	    },

	    set: function set(body) {
	        this.body = body;
	    }

	});

	function blobText(body) {
	    return new PromiseObj(function (resolve) {

	        var reader = new FileReader();

	        reader.readAsText(body);
	        reader.onload = function () {
	            resolve(reader.result);
	        };

	    });
	}

	function isBlobText(body) {
	    return body.type.indexOf('text') === 0 || body.type.indexOf('json') !== -1;
	}

	/**
	 * HTTP Request.
	 */

	var Request = function Request(options$$1) {

	    this.body = null;
	    this.params = {};

	    assign(this, options$$1, {
	        method: toUpper(options$$1.method || 'GET')
	    });

	    if (!(this.headers instanceof Headers)) {
	        this.headers = new Headers(this.headers);
	    }
	};

	Request.prototype.getUrl = function getUrl (){
	    return Url(this);
	};

	Request.prototype.getBody = function getBody (){
	    return this.body;
	};

	Request.prototype.respondWith = function respondWith (body, options$$1) {
	    return new Response(body, assign(options$$1 || {}, {url: this.getUrl()}));
	};

	/**
	 * Service for sending network requests.
	 */

	var COMMON_HEADERS = {'Accept': 'application/json, text/plain, */*'};
	var JSON_CONTENT_TYPE = {'Content-Type': 'application/json;charset=utf-8'};

	function Http(options$$1) {

	    var self = this || {}, client = Client(self.$vm);

	    defaults(options$$1 || {}, self.$options, Http.options);

	    Http.interceptors.forEach(function (handler) {

	        if (isString(handler)) {
	            handler = Http.interceptor[handler];
	        }

	        if (isFunction(handler)) {
	            client.use(handler);
	        }

	    });

	    return client(new Request(options$$1)).then(function (response) {

	        return response.ok ? response : PromiseObj.reject(response);

	    }, function (response) {

	        if (response instanceof Error) {
	            error(response);
	        }

	        return PromiseObj.reject(response);
	    });
	}

	Http.options = {};

	Http.headers = {
	    put: JSON_CONTENT_TYPE,
	    post: JSON_CONTENT_TYPE,
	    patch: JSON_CONTENT_TYPE,
	    delete: JSON_CONTENT_TYPE,
	    common: COMMON_HEADERS,
	    custom: {}
	};

	Http.interceptor = {before: before, method: method, jsonp: jsonp, json: json, form: form, header: header, cors: cors};
	Http.interceptors = ['before', 'method', 'jsonp', 'json', 'form', 'header', 'cors'];

	['get', 'delete', 'head', 'jsonp'].forEach(function (method$$1) {

	    Http[method$$1] = function (url, options$$1) {
	        return this(assign(options$$1 || {}, {url: url, method: method$$1}));
	    };

	});

	['post', 'put', 'patch'].forEach(function (method$$1) {

	    Http[method$$1] = function (url, body, options$$1) {
	        return this(assign(options$$1 || {}, {url: url, method: method$$1, body: body}));
	    };

	});

	/**
	 * Service for interacting with RESTful services.
	 */

	function Resource(url, params, actions, options$$1) {

	    var self = this || {}, resource = {};

	    actions = assign({},
	        Resource.actions,
	        actions
	    );

	    each(actions, function (action, name) {

	        action = merge({url: url, params: assign({}, params)}, options$$1, action);

	        resource[name] = function () {
	            return (self.$http || Http)(opts(action, arguments));
	        };
	    });

	    return resource;
	}

	function opts(action, args) {

	    var options$$1 = assign({}, action), params = {}, body;

	    switch (args.length) {

	        case 2:

	            params = args[0];
	            body = args[1];

	            break;

	        case 1:

	            if (/^(POST|PUT|PATCH)$/i.test(options$$1.method)) {
	                body = args[0];
	            } else {
	                params = args[0];
	            }

	            break;

	        case 0:

	            break;

	        default:

	            throw 'Expected up to 2 arguments [params, body], got ' + args.length + ' arguments';
	    }

	    options$$1.body = body;
	    options$$1.params = assign({}, options$$1.params, params);

	    return options$$1;
	}

	Resource.actions = {

	    get: {method: 'GET'},
	    save: {method: 'POST'},
	    query: {method: 'GET'},
	    update: {method: 'PUT'},
	    remove: {method: 'DELETE'},
	    delete: {method: 'DELETE'}

	};

	/**
	 * Install plugin.
	 */

	function plugin(Vue) {

	    if (plugin.installed) {
	        return;
	    }

	    Util(Vue);

	    Vue.url = Url;
	    Vue.http = Http;
	    Vue.resource = Resource;
	    Vue.Promise = PromiseObj;

	    Object.defineProperties(Vue.prototype, {

	        $url: {
	            get: function get() {
	                return options(Vue.url, this, this.$options.url);
	            }
	        },

	        $http: {
	            get: function get() {
	                return options(Vue.http, this, this.$options.http);
	            }
	        },

	        $resource: {
	            get: function get() {
	                return Vue.resource.bind(this);
	            }
	        },

	        $promise: {
	            get: function get() {
	                var this$1 = this;

	                return function (executor) { return new Vue.Promise(executor, this$1); };
	            }
	        }

	    });
	}

	if (typeof window !== 'undefined' && window.Vue) {
	    window.Vue.use(plugin);
	}

	module.exports = plugin;


/***/ }),
/* 9 */
/***/ (function(module, exports) {

	/* (ignored) */

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	__webpack_require__(11)
	__vue_script__ = __webpack_require__(13)
	if (Object.keys(__vue_script__).some(function (key) { return key !== "default" && key !== "__esModule" })) {
	  console.warn("[vue-loader] app/src/components/App.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(64)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
	if (__vue_template__) {
	__vue_options__.template = __vue_template__
	}
	if (!__vue_options__.computed) __vue_options__.computed = {}
	Object.keys(__vue_styles__).forEach(function (key) {
	var module = __vue_styles__[key]
	__vue_options__.computed[key] = function () { return module }
	})
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-13476bd7/App.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }),
/* 12 */
/***/ (function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _vue = __webpack_require__(6);

	var _vue2 = _interopRequireDefault(_vue);

	var _store = __webpack_require__(14);

	var _store2 = _interopRequireDefault(_store);

	var _user = __webpack_require__(39);

	var userActions = _interopRequireWildcard(_user);

	var _lists = __webpack_require__(47);

	var listsActions = _interopRequireWildcard(_lists);

	var _getter = __webpack_require__(48);

	var getters = _interopRequireWildcard(_getter);

	var _SideContainer = __webpack_require__(49);

	var _SideContainer2 = _interopRequireDefault(_SideContainer);

	var _TaskDetail = __webpack_require__(53);

	var _TaskDetail2 = _interopRequireDefault(_TaskDetail);

	var _Header = __webpack_require__(60);

	var _Header2 = _interopRequireDefault(_Header);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// 创建 modal 组件
	// <template>
	//   <side-container></side-container>
	//   <div class="main">
	//     <router-view></router-view>
	//   </div>
	//   <task-detail v-if="show" transition="animation-showtaskdetail"></task-detail>
	// </template>
	//
	// <script>
	_vue2.default.component('modal', {
	  template: '' + '<div class="modal-mask" v-if="show" transition="modal-animation_default">' + '<div class="modal-wrapper">' + '<div class="modal-container">' + '<slot name="content"></slot>' + '</div>' + '</div>' + '</div>',
	  props: ['show']
	});

	exports.default = {
	  vuex: {
	    actions: {
	      fetchLists: listsActions.fetchLists
	    },
	    getters: {
	      auth: getters.getUserAuth,
	      show: getters.isShowDetail,
	      lists: getters.getLists
	    }
	  },
	  data: function data() {
	    return {};
	  },

	  computed: {},
	  watch: {
	    lists: function lists() {},
	    auth: function auth() {
	      if (!this.auth) {
	        this.$router.go('/login');
	      }
	    }
	  },
	  created: function created() {
	    this.fetchLists();
	  },
	  ready: function ready() {},

	  methods: {},
	  components: {
	    'side-container': _SideContainer2.default,
	    'main-header': _Header2.default,
	    'task-detail': _TaskDetail2.default
	  }
	};
	// </script>
	//
	// <style lang="less">
	//   .app {
	//     min-height: 100%;
	//     height: 100%;
	//     display: flex;
	//   }
	//   .main{
	//     min-height: 100%;
	//     height: 100%;
	//     box-sizing: border-box;
	//     display: flex;
	//     flex: 1;
	//     flex-direction: column;
	//     overflow: hidden;
	//   }
	//   .animate_routerview-transition{
	//     transition: all 0.4s ease;
	//   }
	//   .animate_routerview-enter, .animate_routerview-leave{
	//     opacity: 0;
	//     height:0;
	//     transform: translate3d(20px, 0, 0);
	//   }
	//   .loading{
	//     position: absolute;
	//     left: 0;
	//     top: 0;
	//     width: 100%;
	//     background: #f1f1f1;
	//     z-index: 100;
	//     height: 100%;
	//   }
	//
	// </style>

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _vue = __webpack_require__(6);

	var _vue2 = _interopRequireDefault(_vue);

	var _vuex = __webpack_require__(15);

	var _vuex2 = _interopRequireDefault(_vuex);

	var _user = __webpack_require__(16);

	var _user2 = _interopRequireDefault(_user);

	var _lists = __webpack_require__(37);

	var _lists2 = _interopRequireDefault(_lists);

	var _tasks = __webpack_require__(38);

	var _tasks2 = _interopRequireDefault(_tasks);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_vue2.default.use(_vuex2.default);
	_vue2.default.config.debug = true;
	var debug = ("production") !== 'production';

	// 整合初始状态和变更函数，我们就得到了我们所需的 store
	// 至此，这个 store 就可以连接到我们的应用中
	exports.default = new _vuex2.default.Store({
	  modules: {
	    user: _user2.default,
	    lists: _lists2.default,
	    tasks: _tasks2.default
	  }
	});

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	/*!
	 * Vuex v1.0.1
	 * (c) 2017 Evan You
	 * Released under the MIT License.
	 */
	(function (global, factory) {
		 true ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
		(global.Vuex = factory());
	}(this, (function () { 'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	  return typeof obj;
	} : function (obj) {
	  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};











	var classCallCheck = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

	var createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();









































	var toConsumableArray = function (arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

	    return arr2;
	  } else {
	    return Array.from(arr);
	  }
	};

	/**
	 * Merge an array of objects into one.
	 *
	 * @param {Array<Object>} arr
	 * @return {Object}
	 */

	function mergeObjects(arr) {
	  return arr.reduce(function (prev, obj) {
	    Object.keys(obj).forEach(function (key) {
	      var existing = prev[key];
	      if (existing) {
	        // allow multiple mutation objects to contain duplicate
	        // handlers for the same mutation type
	        if (Array.isArray(existing)) {
	          prev[key] = existing.concat(obj[key]);
	        } else {
	          prev[key] = [existing].concat(obj[key]);
	        }
	      } else {
	        prev[key] = obj[key];
	      }
	    });
	    return prev;
	  }, {});
	}

	/**
	 * Deep copy the given object considering circular structure.
	 * This function caches all nested objects and its copies.
	 * If it detects circular structure, use cached copy to avoid infinite loop.
	 *
	 * @param {*} obj
	 * @param {Array<Object>} cache
	 * @return {*}
	 */


	/**
	 * Check whether the given value is Object or not
	 *
	 * @param {*} obj
	 * @return {Boolean}
	 */

	function isObject(obj) {
	  return obj !== null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
	}

	/**
	 * Get state sub tree by given keys.
	 *
	 * @param {Object} state
	 * @param {Array<String>} nestedKeys
	 * @return {Object}
	 */
	function getNestedState(state, nestedKeys) {
	  return nestedKeys.reduce(function (state, key) {
	    return state[key];
	  }, state);
	}

	/**
	 * Hacks to get access to Vue internals.
	 * Maybe we should expose these...
	 */

	var Watcher = void 0;
	function getWatcher(vm) {
	  if (!Watcher) {
	    var noop = function noop() {};
	    var unwatch = vm.$watch(noop, noop);
	    Watcher = vm._watchers[0].constructor;
	    unwatch();
	  }
	  return Watcher;
	}

	var Dep = void 0;
	function getDep(vm) {
	  if (!Dep) {
	    Dep = vm._data.__ob__.dep.constructor;
	  }
	  return Dep;
	}

	var hook = typeof window !== 'undefined' && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

	function devtoolPlugin(store) {
	  if (!hook) return;

	  hook.emit('vuex:init', store);

	  hook.on('vuex:travel-to-state', function (targetState) {
	    store.replaceState(targetState);
	  });

	  store.subscribe(function (mutation, state) {
	    hook.emit('vuex:mutation', mutation, state);
	  });
	}

	var override = function (Vue) {
	  var version = Number(Vue.version.split('.')[0]);

	  if (version >= 2) {
	    var usesInit = Vue.config._lifecycleHooks.indexOf('init') > -1;
	    Vue.mixin(usesInit ? { init: vuexInit } : { beforeCreate: vuexInit });
	  } else {
	    (function () {
	      // override init and inject vuex init procedure
	      // for 1.x backwards compatibility.
	      var _init = Vue.prototype._init;
	      Vue.prototype._init = function () {
	        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	        options.init = options.init ? [vuexInit].concat(options.init) : vuexInit;
	        _init.call(this, options);
	      };
	    })();
	  }

	  /**
	   * Vuex init hook, injected into each instances init hooks list.
	   */

	  function vuexInit() {
	    var options = this.$options;
	    var store = options.store,
	        vuex = options.vuex;
	    // store injection

	    if (store) {
	      this.$store = store;
	    } else if (options.parent && options.parent.$store) {
	      this.$store = options.parent.$store;
	    }
	    // vuex option handling
	    if (vuex) {
	      if (!this.$store) {
	        console.warn('[vuex] store not injected. make sure to ' + 'provide the store option in your root component.');
	      }
	      var state = vuex.state,
	          actions = vuex.actions;
	      var getters = vuex.getters;
	      // handle deprecated state option

	      if (state && !getters) {
	        console.warn('[vuex] vuex.state option will been deprecated in 1.0. ' + 'Use vuex.getters instead.');
	        getters = state;
	      }
	      // getters
	      if (getters) {
	        options.computed = options.computed || {};
	        for (var key in getters) {
	          defineVuexGetter(this, key, getters[key]);
	        }
	      }
	      // actions
	      if (actions) {
	        options.methods = options.methods || {};
	        for (var _key in actions) {
	          options.methods[_key] = makeBoundAction(this.$store, actions[_key], _key);
	        }
	      }
	    }
	  }

	  /**
	   * Setter for all getter properties.
	   */

	  function setter() {
	    throw new Error('vuex getter properties are read-only.');
	  }

	  /**
	   * Define a Vuex getter on an instance.
	   *
	   * @param {Vue} vm
	   * @param {String} key
	   * @param {Function} getter
	   */

	  function defineVuexGetter(vm, key, getter) {
	    if (typeof getter !== 'function') {
	      console.warn('[vuex] Getter bound to key \'vuex.getters.' + key + '\' is not a function.');
	    } else {
	      Object.defineProperty(vm, key, {
	        enumerable: true,
	        configurable: true,
	        get: makeComputedGetter(vm.$store, getter),
	        set: setter
	      });
	    }
	  }

	  /**
	   * Make a computed getter, using the same caching mechanism of computed
	   * properties. In addition, it is cached on the raw getter function using
	   * the store's unique cache id. This makes the same getter shared
	   * across all components use the same underlying watcher, and makes
	   * the getter evaluated only once during every flush.
	   *
	   * @param {Store} store
	   * @param {Function} getter
	   */

	  function makeComputedGetter(store, getter) {
	    var id = store._getterCacheId;

	    // cached
	    if (getter[id]) {
	      return getter[id];
	    }
	    var vm = store._vm;
	    var Watcher = getWatcher(vm);
	    var Dep = getDep(vm);
	    var watcher = new Watcher(vm, function (vm) {
	      return getter(vm.state);
	    }, null, { lazy: true });
	    var computedGetter = function computedGetter() {
	      if (watcher.dirty) {
	        watcher.evaluate();
	      }
	      if (Dep.target) {
	        watcher.depend();
	      }
	      return watcher.value;
	    };
	    getter[id] = computedGetter;
	    return computedGetter;
	  }

	  /**
	   * Make a bound-to-store version of a raw action function.
	   *
	   * @param {Store} store
	   * @param {Function} action
	   * @param {String} key
	   */

	  function makeBoundAction(store, action, key) {
	    if (typeof action !== 'function') {
	      console.warn('[vuex] Action bound to key \'vuex.actions.' + key + '\' is not a function.');
	    }
	    return function vuexBoundAction() {
	      for (var _len = arguments.length, args = Array(_len), _key2 = 0; _key2 < _len; _key2++) {
	        args[_key2] = arguments[_key2];
	      }

	      return action.call.apply(action, [this, store].concat(args));
	    };
	  }

	  // option merging
	  var merge = Vue.config.optionMergeStrategies.computed;
	  Vue.config.optionMergeStrategies.vuex = function (toVal, fromVal) {
	    if (!toVal) return fromVal;
	    if (!fromVal) return toVal;
	    return {
	      getters: merge(toVal.getters, fromVal.getters),
	      state: merge(toVal.state, fromVal.state),
	      actions: merge(toVal.actions, fromVal.actions)
	    };
	  };
	};

	var Vue = void 0;
	var uid = 0;

	var Store = function () {

	  /**
	   * @param {Object} options
	   *        - {Object} state
	   *        - {Object} actions
	   *        - {Object} mutations
	   *        - {Array} plugins
	   *        - {Boolean} strict
	   */

	  function Store() {
	    var _this = this;

	    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	        _ref$state = _ref.state,
	        state = _ref$state === undefined ? {} : _ref$state,
	        _ref$mutations = _ref.mutations,
	        mutations = _ref$mutations === undefined ? {} : _ref$mutations,
	        _ref$modules = _ref.modules,
	        modules = _ref$modules === undefined ? {} : _ref$modules,
	        _ref$plugins = _ref.plugins,
	        plugins = _ref$plugins === undefined ? [] : _ref$plugins,
	        _ref$strict = _ref.strict,
	        strict = _ref$strict === undefined ? false : _ref$strict;

	    classCallCheck(this, Store);

	    this._getterCacheId = 'vuex_store_' + uid++;
	    this._dispatching = false;
	    this._rootMutations = this._mutations = mutations;
	    this._modules = modules;
	    this._subscribers = [];
	    // bind dispatch to self
	    var dispatch = this.dispatch;
	    this.dispatch = function () {
	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      dispatch.apply(_this, args);
	    };
	    // use a Vue instance to store the state tree
	    // suppress warnings just in case the user has added
	    // some funky global mixins
	    if (!Vue) {
	      throw new Error('[vuex] must call Vue.use(Vuex) before creating a store instance.');
	    }
	    var silent = Vue.config.silent;
	    Vue.config.silent = true;
	    this._vm = new Vue({
	      data: {
	        state: state
	      }
	    });
	    Vue.config.silent = silent;
	    this._setupModuleState(state, modules);
	    this._setupModuleMutations(modules);
	    // add extra warnings in strict mode
	    if (strict) {
	      this._setupMutationCheck();
	    }
	    // apply plugins
	    devtoolPlugin(this);
	    plugins.forEach(function (plugin) {
	      return plugin(_this);
	    });
	  }

	  /**
	   * Getter for the entire state tree.
	   * Read only.
	   *
	   * @return {Object}
	   */

	  createClass(Store, [{
	    key: 'replaceState',


	    /**
	     * Replace root state.
	     *
	     * @param {Object} state
	     */

	    value: function replaceState(state) {
	      this._dispatching = true;
	      this._vm.state = state;
	      this._dispatching = false;
	    }

	    /**
	     * Dispatch an action.
	     *
	     * @param {String} type
	     */

	  }, {
	    key: 'dispatch',
	    value: function dispatch(type) {
	      var _this2 = this;

	      for (var _len2 = arguments.length, payload = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	        payload[_key2 - 1] = arguments[_key2];
	      }

	      var silent = false;
	      var isObjectStyleDispatch = false;
	      // compatibility for object actions, e.g. FSA
	      if ((typeof type === 'undefined' ? 'undefined' : _typeof(type)) === 'object' && type.type && arguments.length === 1) {
	        isObjectStyleDispatch = true;
	        payload = type;
	        if (type.silent) silent = true;
	        type = type.type;
	      }
	      var handler = this._mutations[type];
	      var state = this.state;
	      if (handler) {
	        this._dispatching = true;
	        // apply the mutation
	        if (Array.isArray(handler)) {
	          handler.forEach(function (h) {
	            isObjectStyleDispatch ? h(state, payload) : h.apply(undefined, [state].concat(toConsumableArray(payload)));
	          });
	        } else {
	          isObjectStyleDispatch ? handler(state, payload) : handler.apply(undefined, [state].concat(toConsumableArray(payload)));
	        }
	        this._dispatching = false;
	        if (!silent) {
	          (function () {
	            var mutation = isObjectStyleDispatch ? payload : { type: type, payload: payload };
	            _this2._subscribers.forEach(function (sub) {
	              return sub(mutation, state);
	            });
	          })();
	        }
	      } else {
	        console.warn('[vuex] Unknown mutation: ' + type);
	      }
	    }

	    /**
	     * Watch state changes on the store.
	     * Same API as Vue's $watch, except when watching a function,
	     * the function gets the state as the first argument.
	     *
	     * @param {Function} fn
	     * @param {Function} cb
	     * @param {Object} [options]
	     */

	  }, {
	    key: 'watch',
	    value: function watch(fn, cb, options) {
	      var _this3 = this;

	      if (typeof fn !== 'function') {
	        console.error('Vuex store.watch only accepts function.');
	        return;
	      }
	      return this._vm.$watch(function () {
	        return fn(_this3.state);
	      }, cb, options);
	    }

	    /**
	     * Subscribe to state changes. Fires after every mutation.
	     */

	  }, {
	    key: 'subscribe',
	    value: function subscribe(fn) {
	      var subs = this._subscribers;
	      if (subs.indexOf(fn) < 0) {
	        subs.push(fn);
	      }
	      return function () {
	        var i = subs.indexOf(fn);
	        if (i > -1) {
	          subs.splice(i, 1);
	        }
	      };
	    }

	    /**
	     * Hot update mutations & modules.
	     *
	     * @param {Object} options
	     *        - {Object} [mutations]
	     *        - {Object} [modules]
	     */

	  }, {
	    key: 'hotUpdate',
	    value: function hotUpdate() {
	      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	          mutations = _ref2.mutations,
	          modules = _ref2.modules;

	      this._rootMutations = this._mutations = mutations || this._rootMutations;
	      this._setupModuleMutations(modules || this._modules);
	    }

	    /**
	     * Attach sub state tree of each module to the root tree.
	     *
	     * @param {Object} state
	     * @param {Object} modules
	     */

	  }, {
	    key: '_setupModuleState',
	    value: function _setupModuleState(state, modules) {
	      var _this4 = this;

	      if (!isObject(modules)) return;

	      Object.keys(modules).forEach(function (key) {
	        var module = modules[key];

	        // set this module's state
	        Vue.set(state, key, module.state || {});

	        // retrieve nested modules
	        _this4._setupModuleState(state[key], module.modules);
	      });
	    }

	    /**
	     * Bind mutations for each module to its sub tree and
	     * merge them all into one final mutations map.
	     *
	     * @param {Object} updatedModules
	     */

	  }, {
	    key: '_setupModuleMutations',
	    value: function _setupModuleMutations(updatedModules) {
	      var modules = this._modules;
	      Object.keys(updatedModules).forEach(function (key) {
	        modules[key] = updatedModules[key];
	      });
	      var updatedMutations = this._createModuleMutations(modules, []);
	      this._mutations = mergeObjects([this._rootMutations].concat(toConsumableArray(updatedMutations)));
	    }

	    /**
	     * Helper method for _setupModuleMutations.
	     * The method retrieve nested sub modules and
	     * bind each mutations to its sub tree recursively.
	     *
	     * @param {Object} modules
	     * @param {Array<String>} nestedKeys
	     * @return {Array<Object>}
	     */

	  }, {
	    key: '_createModuleMutations',
	    value: function _createModuleMutations(modules, nestedKeys) {
	      var _this5 = this;

	      if (!isObject(modules)) return [];

	      return Object.keys(modules).map(function (key) {
	        var module = modules[key];
	        var newNestedKeys = nestedKeys.concat(key);

	        // retrieve nested modules
	        var nestedMutations = _this5._createModuleMutations(module.modules, newNestedKeys);

	        if (!module || !module.mutations) {
	          return mergeObjects(nestedMutations);
	        }

	        // bind mutations to sub state tree
	        var mutations = {};
	        Object.keys(module.mutations).forEach(function (name) {
	          var original = module.mutations[name];
	          mutations[name] = function (state) {
	            for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
	              args[_key3 - 1] = arguments[_key3];
	            }

	            original.apply(undefined, [getNestedState(state, newNestedKeys)].concat(args));
	          };
	        });

	        // merge mutations of this module and nested modules
	        return mergeObjects([mutations].concat(toConsumableArray(nestedMutations)));
	      });
	    }

	    /**
	     * Setup mutation check: if the Vuex instance's state is mutated
	     * outside of a mutation handler, we throw en error. This effectively
	     * enforces all mutations to the state to be trackable and hot-reloadable.
	     * However, this comes at a run time cost since we are doing a deep
	     * watch on the entire state tree, so it is only enabled if the
	     * strict option is set to true.
	     */

	  }, {
	    key: '_setupMutationCheck',
	    value: function _setupMutationCheck() {
	      var _this6 = this;

	      var Watcher = getWatcher(this._vm);
	      /* eslint-disable no-new */
	      new Watcher(this._vm, 'state', function () {
	        if (!_this6._dispatching) {
	          throw new Error('[vuex] Do not mutate vuex store state outside mutation handlers.');
	        }
	      }, { deep: true, sync: true });
	      /* eslint-enable no-new */
	    }
	  }, {
	    key: 'state',
	    get: function get$$1() {
	      return this._vm.state;
	    },
	    set: function set$$1(v) {
	      throw new Error('[vuex] Use store.replaceState() to explicit replace store state.');
	    }
	  }]);
	  return Store;
	}();

	function install(_Vue) {
	  if (Vue) {
	    console.warn('[vuex] already installed. Vue.use(Vuex) should be called only once.');
	    return;
	  }
	  Vue = _Vue;
	  override(Vue);
	}

	// auto install in dist mode
	if (typeof window !== 'undefined' && window.Vue) {
	  install(window.Vue);
	}

	var index = {
	  Store: Store,
	  install: install
	};

	return index;

	})));


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _defineProperty2 = __webpack_require__(17);

	var _defineProperty3 = _interopRequireDefault(_defineProperty2);

	var _mutations;

	var _mutationType = __webpack_require__(36);

	var mutationType = _interopRequireWildcard(_mutationType);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var state = {
	  data: {},
	  auth: false
	};

	var mutations = (_mutations = {}, (0, _defineProperty3.default)(_mutations, mutationType.AUTHENTICATE, function (state, user) {
	  console.log('mutations: AUTHENTICATE');
	  state.data = user;
	  state.auth = true;
	}), (0, _defineProperty3.default)(_mutations, mutationType.AUTHENTICATE_ERROR, function (state, user) {
	  console.log('mutations: AUTHENTICATE_ERROR');
	  state.data = null;
	  state.auth = false;
	}), (0, _defineProperty3.default)(_mutations, mutationType.LOGIN, function (state, user) {
	  console.log('mutations: LOGIN');
	  state.data = user;
	  state.auth = true;
	}), _mutations);

	exports.default = {
	  state: state,
	  mutations: mutations
	};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(18);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (obj, key, value) {
	  if (key in obj) {
	    (0, _defineProperty2.default)(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(19), __esModule: true };

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(20);
	var $Object = __webpack_require__(23).Object;
	module.exports = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(21);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(31), 'Object', {defineProperty: __webpack_require__(27).f});

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(22)
	  , core      = __webpack_require__(23)
	  , ctx       = __webpack_require__(24)
	  , hide      = __webpack_require__(26)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ }),
/* 22 */
/***/ (function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 23 */
/***/ (function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(25);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ }),
/* 25 */
/***/ (function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(27)
	  , createDesc = __webpack_require__(35);
	module.exports = __webpack_require__(31) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(28)
	  , IE8_DOM_DEFINE = __webpack_require__(30)
	  , toPrimitive    = __webpack_require__(34)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(31) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(29);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ }),
/* 29 */
/***/ (function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(31) && !__webpack_require__(32)(function(){
	  return Object.defineProperty(__webpack_require__(33)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(32)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ }),
/* 32 */
/***/ (function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(29)
	  , document = __webpack_require__(22).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(29);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ }),
/* 35 */
/***/ (function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ }),
/* 36 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var AUTHENTICATE = exports.AUTHENTICATE = 'AUTHENTICATE';
	var AUTHENTICATE_ERROR = exports.AUTHENTICATE_ERROR = 'AUTHENTICATE_ERROR';
	var LOGIN = exports.LOGIN = 'LOGIN';
	var LOGIN_ERROR = exports.LOGIN_ERROR = 'LOGIN_ERROR';

	var REQUST_TASKS = exports.REQUST_TASKS = 'REQUST_TASKS';
	var RECEIVE_TASKS = exports.RECEIVE_TASKS = 'RECEIVE_TASKS';
	var RECEIVE_TASKS_ERROR = exports.RECEIVE_TASKS_ERROR = 'FETCH_TASKS_ERROR';

	var RECEIVE_TASK_DETAIL = exports.RECEIVE_TASK_DETAIL = 'RECEIVE_TASK_DETAIL';
	var RECEIVE_TASK_DETAIL_ERROR = exports.RECEIVE_TASK_DETAIL_ERROR = 'RECEIVE_TASK_DETAIL_ERROR';
	var HIDE_DETAIL_WINDOW = exports.HIDE_DETAIL_WINDOW = 'HIDE_DETAIL_WINDOW';
	var ADD_TASK = exports.ADD_TASK = 'ADD_TASK';
	var ADD_TASK_ERROR = exports.ADD_TASK_ERROR = 'ADD_TASK_ERROR';
	var RESET_TASKS = exports.RESET_TASKS = 'RESET_TASKS';
	var DELETE_TASK = exports.DELETE_TASK = 'DELETE_TASK';
	var EDIT_TASK = exports.EDIT_TASK = 'EDIT_TASK';
	var COMPLETE_TASK = exports.COMPLETE_TASK = 'COMPLETE_TASK';

	// list 相关
	var FETCH_LISTS = exports.FETCH_LISTS = 'FETCH_LISTS';
	var FETCH_LISTS_ERROR = exports.FETCH_LISTS_ERROR = 'FETCH_LISTS_ERROR';
	var ADD_LIST = exports.ADD_LIST = 'ADD_LIST';
	var ADD_LIST_ERROR = exports.ADD_LIST_ERROR = 'ADD_LIST_ERROR';
	var EDIT_LIST = exports.EDIT_LIST = 'EDIT_LIST';
	var DELETE_LIST = exports.DELETE_LIST = 'DELETE_LIST';
	var DELETE_LIST_ERROR = exports.DELETE_LIST_ERROR = 'DELETE_LIST_ERROR';

	var UPDATE_LIST = exports.UPDATE_LIST = 'UPDATE_LIST';

	var FETCHING = exports.FETCHING = 'FETCHING';

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _defineProperty2 = __webpack_require__(17);

	var _defineProperty3 = _interopRequireDefault(_defineProperty2);

	var _mutations;

	var _mutationType = __webpack_require__(36);

	var mutationType = _interopRequireWildcard(_mutationType);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var state = {
	  all: [],
	  current: {}
	};

	// 创建一个对象存储一系列我们接下来要写的 mutation 函数
	var mutations = (_mutations = {}, (0, _defineProperty3.default)(_mutations, mutationType.FETCH_LISTS, function (state, lists) {
	  state.all = lists;
	}), (0, _defineProperty3.default)(_mutations, mutationType.ADD_LIST, function (state, list) {
	  console.log('mutations: ADD_LIST');
	  console.log(list);
	  state.all = state.all.concat(list);
	}), (0, _defineProperty3.default)(_mutations, mutationType.DELETE_LIST, function (state, listid) {
	  state.all = state.all.filter(function (item) {
	    return item.id !== listid;
	  });
	}), (0, _defineProperty3.default)(_mutations, mutationType.EDIT_LIST, function (state, list) {
	  state.all.map(function (item) {
	    if (item.id === list.id) {
	      return list;
	    }
	    return item;
	  });
	}), (0, _defineProperty3.default)(_mutations, mutationType.UPDATE_LIST, function (state, data) {
	  state.all.map(function (item) {
	    if (item.id === data.id) {
	      switch (data.type) {
	        case 'total':
	          item.task_count_total += data.update;
	          break;
	        case 'archived':
	          item.task_count_archived += data.update;
	          break;
	        case 'istrash':
	          item.task_count_istrash += data.update;
	        default:
	          break;
	      }
	      return item;
	    }
	    return item;
	  });
	}), _mutations);

	exports.default = {
	  state: state,
	  mutations: mutations
	};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _defineProperty2 = __webpack_require__(17);

	var _defineProperty3 = _interopRequireDefault(_defineProperty2);

	var _mutations;

	var _mutationType = __webpack_require__(36);

	var mutationType = _interopRequireWildcard(_mutationType);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var state = {
	  active: [],
	  archieved: [],
	  all: [],
	  taskDetail: null,
	  showDetail: false,
	  isRequestingTasks: false,
	  isRequestingTaskDetail: false
	};

	var mutations = (_mutations = {}, (0, _defineProperty3.default)(_mutations, mutationType.REQUST_TASKS, function (state) {
	  state.isRequestingTasks = true;
	}), (0, _defineProperty3.default)(_mutations, mutationType.REQUST_TASKS_DETAIL, function (state) {
	  state.isRequestingTaskDetail = true;
	}), (0, _defineProperty3.default)(_mutations, mutationType.RECEIVE_TASKS, function (state, query, tasks) {
	  state.showDetail = false;
	  state.isRequestingTasks = false;
	  if (query.archived && query.list_id) {
	    state.all = state.all.concat(tasks);
	  } else {
	    state.all = tasks;
	  }
	}), (0, _defineProperty3.default)(_mutations, mutationType.RECEIVE_TASK_DETAIL, function (state, task) {
	  console.log('mutations: RECEIVE_TASK_DETAIL');
	  state.showDetail = true;
	  state.isRequestingTaskDetail = false;
	  state.taskDetail = task;
	}), (0, _defineProperty3.default)(_mutations, mutationType.HIDE_DETAIL_WINDOW, function (state) {
	  state.showDetail = false;
	}), (0, _defineProperty3.default)(_mutations, mutationType.ADD_TASK, function (state, task) {
	  state.all = [task].concat(state.all);
	}), (0, _defineProperty3.default)(_mutations, mutationType.EDIT_TASK, function (state, task) {
	  console.log('mutations: EDIT_TASK');
	  state.all = state.all.map(function (item) {
	    if (item.id === task.id) {
	      return task;
	    }
	    return item;
	  });
	  state.taskDetail = task;
	}), (0, _defineProperty3.default)(_mutations, mutationType.DELETE_TASK, function (state, task) {
	  console.log('mutations: DELETE_TASK');
	  state.all = state.all.filter(function (item) {
	    return item.id !== task.id;
	  });
	}), (0, _defineProperty3.default)(_mutations, mutationType.RESET_TASKS, function (state, task) {
	  state.all = [];
	}), _mutations);

	exports.default = {
	  state: state,
	  mutations: mutations
	};

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.login = exports.authenticate = undefined;

	var _superagent = __webpack_require__(40);

	var _superagent2 = _interopRequireDefault(_superagent);

	var _mutationType = __webpack_require__(36);

	var mutationType = _interopRequireWildcard(_mutationType);

	var _base = __webpack_require__(45);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// 用户认证
	var authenticate = exports.authenticate = function authenticate(_ref, callback) {
	  var dispatch = _ref.dispatch,
	      state = _ref.state;

	  _superagent2.default.get('/authenticate').set('x-access-token', window.localStorage.token).use(_base2.default).then(function (res) {
	    dispatch(mutationType.AUTHENTICATE, res.body);
	    if (callback) {
	      callback(res.body);
	    }
	  }, function () {
	    dispatch(mutationType.AUTHENTICATE_ERROR, {});
	    if (callback) {
	      callback(null);
	    }
	  });
	};

	// 用户登录
	var login = exports.login = function login(_ref2, param) {
	  var dispatch = _ref2.dispatch,
	      state = _ref2.state;

	  _superagent2.default.post('/users/login').use(_base2.default).send(param).then(function (res) {
	    window.localStorage.token = res.body.token;
	    dispatch(mutationType.LOGIN, res.body);
	  }, function () {});
	};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Root reference for iframes.
	 */

	var root;
	if (typeof window !== 'undefined') { // Browser window
	  root = window;
	} else if (typeof self !== 'undefined') { // Web Worker
	  root = self;
	} else { // Other environments
	  console.warn("Using browser-only version of superagent in non-browser environment");
	  root = this;
	}

	var Emitter = __webpack_require__(41);
	var requestBase = __webpack_require__(42);
	var isObject = __webpack_require__(43);

	/**
	 * Noop.
	 */

	function noop(){};

	/**
	 * Expose `request`.
	 */

	var request = module.exports = __webpack_require__(44).bind(null, Request);

	/**
	 * Determine XHR.
	 */

	request.getXHR = function () {
	  if (root.XMLHttpRequest
	      && (!root.location || 'file:' != root.location.protocol
	          || !root.ActiveXObject)) {
	    return new XMLHttpRequest;
	  } else {
	    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
	  }
	  throw Error("Browser-only verison of superagent could not find XHR");
	};

	/**
	 * Removes leading and trailing whitespace, added to support IE.
	 *
	 * @param {String} s
	 * @return {String}
	 * @api private
	 */

	var trim = ''.trim
	  ? function(s) { return s.trim(); }
	  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

	/**
	 * Serialize the given `obj`.
	 *
	 * @param {Object} obj
	 * @return {String}
	 * @api private
	 */

	function serialize(obj) {
	  if (!isObject(obj)) return obj;
	  var pairs = [];
	  for (var key in obj) {
	    pushEncodedKeyValuePair(pairs, key, obj[key]);
	  }
	  return pairs.join('&');
	}

	/**
	 * Helps 'serialize' with serializing arrays.
	 * Mutates the pairs array.
	 *
	 * @param {Array} pairs
	 * @param {String} key
	 * @param {Mixed} val
	 */

	function pushEncodedKeyValuePair(pairs, key, val) {
	  if (val != null) {
	    if (Array.isArray(val)) {
	      val.forEach(function(v) {
	        pushEncodedKeyValuePair(pairs, key, v);
	      });
	    } else if (isObject(val)) {
	      for(var subkey in val) {
	        pushEncodedKeyValuePair(pairs, key + '[' + subkey + ']', val[subkey]);
	      }
	    } else {
	      pairs.push(encodeURIComponent(key)
	        + '=' + encodeURIComponent(val));
	    }
	  } else if (val === null) {
	    pairs.push(encodeURIComponent(key));
	  }
	}

	/**
	 * Expose serialization method.
	 */

	 request.serializeObject = serialize;

	 /**
	  * Parse the given x-www-form-urlencoded `str`.
	  *
	  * @param {String} str
	  * @return {Object}
	  * @api private
	  */

	function parseString(str) {
	  var obj = {};
	  var pairs = str.split('&');
	  var pair;
	  var pos;

	  for (var i = 0, len = pairs.length; i < len; ++i) {
	    pair = pairs[i];
	    pos = pair.indexOf('=');
	    if (pos == -1) {
	      obj[decodeURIComponent(pair)] = '';
	    } else {
	      obj[decodeURIComponent(pair.slice(0, pos))] =
	        decodeURIComponent(pair.slice(pos + 1));
	    }
	  }

	  return obj;
	}

	/**
	 * Expose parser.
	 */

	request.parseString = parseString;

	/**
	 * Default MIME type map.
	 *
	 *     superagent.types.xml = 'application/xml';
	 *
	 */

	request.types = {
	  html: 'text/html',
	  json: 'application/json',
	  xml: 'application/xml',
	  urlencoded: 'application/x-www-form-urlencoded',
	  'form': 'application/x-www-form-urlencoded',
	  'form-data': 'application/x-www-form-urlencoded'
	};

	/**
	 * Default serialization map.
	 *
	 *     superagent.serialize['application/xml'] = function(obj){
	 *       return 'generated xml here';
	 *     };
	 *
	 */

	 request.serialize = {
	   'application/x-www-form-urlencoded': serialize,
	   'application/json': JSON.stringify
	 };

	 /**
	  * Default parsers.
	  *
	  *     superagent.parse['application/xml'] = function(str){
	  *       return { object parsed from str };
	  *     };
	  *
	  */

	request.parse = {
	  'application/x-www-form-urlencoded': parseString,
	  'application/json': JSON.parse
	};

	/**
	 * Parse the given header `str` into
	 * an object containing the mapped fields.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */

	function parseHeader(str) {
	  var lines = str.split(/\r?\n/);
	  var fields = {};
	  var index;
	  var line;
	  var field;
	  var val;

	  lines.pop(); // trailing CRLF

	  for (var i = 0, len = lines.length; i < len; ++i) {
	    line = lines[i];
	    index = line.indexOf(':');
	    field = line.slice(0, index).toLowerCase();
	    val = trim(line.slice(index + 1));
	    fields[field] = val;
	  }

	  return fields;
	}

	/**
	 * Check if `mime` is json or has +json structured syntax suffix.
	 *
	 * @param {String} mime
	 * @return {Boolean}
	 * @api private
	 */

	function isJSON(mime) {
	  return /[\/+]json\b/.test(mime);
	}

	/**
	 * Return the mime type for the given `str`.
	 *
	 * @param {String} str
	 * @return {String}
	 * @api private
	 */

	function type(str){
	  return str.split(/ *; */).shift();
	};

	/**
	 * Return header field parameters.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */

	function params(str){
	  return str.split(/ *; */).reduce(function(obj, str){
	    var parts = str.split(/ *= */),
	        key = parts.shift(),
	        val = parts.shift();

	    if (key && val) obj[key] = val;
	    return obj;
	  }, {});
	};

	/**
	 * Initialize a new `Response` with the given `xhr`.
	 *
	 *  - set flags (.ok, .error, etc)
	 *  - parse header
	 *
	 * Examples:
	 *
	 *  Aliasing `superagent` as `request` is nice:
	 *
	 *      request = superagent;
	 *
	 *  We can use the promise-like API, or pass callbacks:
	 *
	 *      request.get('/').end(function(res){});
	 *      request.get('/', function(res){});
	 *
	 *  Sending data can be chained:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' })
	 *        .end(function(res){});
	 *
	 *  Or passed to `.send()`:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' }, function(res){});
	 *
	 *  Or passed to `.post()`:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' })
	 *        .end(function(res){});
	 *
	 * Or further reduced to a single call for simple cases:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' }, function(res){});
	 *
	 * @param {XMLHTTPRequest} xhr
	 * @param {Object} options
	 * @api private
	 */

	function Response(req, options) {
	  options = options || {};
	  this.req = req;
	  this.xhr = this.req.xhr;
	  // responseText is accessible only if responseType is '' or 'text' and on older browsers
	  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
	     ? this.xhr.responseText
	     : null;
	  this.statusText = this.req.xhr.statusText;
	  this._setStatusProperties(this.xhr.status);
	  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
	  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
	  // getResponseHeader still works. so we get content-type even if getting
	  // other headers fails.
	  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
	  this._setHeaderProperties(this.header);
	  this.body = this.req.method != 'HEAD'
	    ? this._parseBody(this.text ? this.text : this.xhr.response)
	    : null;
	}

	/**
	 * Get case-insensitive `field` value.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api public
	 */

	Response.prototype.get = function(field){
	  return this.header[field.toLowerCase()];
	};

	/**
	 * Set header related properties:
	 *
	 *   - `.type` the content type without params
	 *
	 * A response of "Content-Type: text/plain; charset=utf-8"
	 * will provide you with a `.type` of "text/plain".
	 *
	 * @param {Object} header
	 * @api private
	 */

	Response.prototype._setHeaderProperties = function(header){
	  // content-type
	  var ct = this.header['content-type'] || '';
	  this.type = type(ct);

	  // params
	  var obj = params(ct);
	  for (var key in obj) this[key] = obj[key];
	};

	/**
	 * Parse the given body `str`.
	 *
	 * Used for auto-parsing of bodies. Parsers
	 * are defined on the `superagent.parse` object.
	 *
	 * @param {String} str
	 * @return {Mixed}
	 * @api private
	 */

	Response.prototype._parseBody = function(str){
	  var parse = request.parse[this.type];
	  if (!parse && isJSON(this.type)) {
	    parse = request.parse['application/json'];
	  }
	  return parse && str && (str.length || str instanceof Object)
	    ? parse(str)
	    : null;
	};

	/**
	 * Set flags such as `.ok` based on `status`.
	 *
	 * For example a 2xx response will give you a `.ok` of __true__
	 * whereas 5xx will be __false__ and `.error` will be __true__. The
	 * `.clientError` and `.serverError` are also available to be more
	 * specific, and `.statusType` is the class of error ranging from 1..5
	 * sometimes useful for mapping respond colors etc.
	 *
	 * "sugar" properties are also defined for common cases. Currently providing:
	 *
	 *   - .noContent
	 *   - .badRequest
	 *   - .unauthorized
	 *   - .notAcceptable
	 *   - .notFound
	 *
	 * @param {Number} status
	 * @api private
	 */

	Response.prototype._setStatusProperties = function(status){
	  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
	  if (status === 1223) {
	    status = 204;
	  }

	  var type = status / 100 | 0;

	  // status / class
	  this.status = this.statusCode = status;
	  this.statusType = type;

	  // basics
	  this.info = 1 == type;
	  this.ok = 2 == type;
	  this.clientError = 4 == type;
	  this.serverError = 5 == type;
	  this.error = (4 == type || 5 == type)
	    ? this.toError()
	    : false;

	  // sugar
	  this.accepted = 202 == status;
	  this.noContent = 204 == status;
	  this.badRequest = 400 == status;
	  this.unauthorized = 401 == status;
	  this.notAcceptable = 406 == status;
	  this.notFound = 404 == status;
	  this.forbidden = 403 == status;
	};

	/**
	 * Return an `Error` representative of this response.
	 *
	 * @return {Error}
	 * @api public
	 */

	Response.prototype.toError = function(){
	  var req = this.req;
	  var method = req.method;
	  var url = req.url;

	  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
	  var err = new Error(msg);
	  err.status = this.status;
	  err.method = method;
	  err.url = url;

	  return err;
	};

	/**
	 * Expose `Response`.
	 */

	request.Response = Response;

	/**
	 * Initialize a new `Request` with the given `method` and `url`.
	 *
	 * @param {String} method
	 * @param {String} url
	 * @api public
	 */

	function Request(method, url) {
	  var self = this;
	  this._query = this._query || [];
	  this.method = method;
	  this.url = url;
	  this.header = {}; // preserves header name case
	  this._header = {}; // coerces header names to lowercase
	  this.on('end', function(){
	    var err = null;
	    var res = null;

	    try {
	      res = new Response(self);
	    } catch(e) {
	      err = new Error('Parser is unable to parse the response');
	      err.parse = true;
	      err.original = e;
	      // issue #675: return the raw response if the response parsing fails
	      err.rawResponse = self.xhr && self.xhr.responseText ? self.xhr.responseText : null;
	      // issue #876: return the http status code if the response parsing fails
	      err.statusCode = self.xhr && self.xhr.status ? self.xhr.status : null;
	      return self.callback(err);
	    }

	    self.emit('response', res);

	    var new_err;
	    try {
	      if (res.status < 200 || res.status >= 300) {
	        new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
	        new_err.original = err;
	        new_err.response = res;
	        new_err.status = res.status;
	      }
	    } catch(e) {
	      new_err = e; // #985 touching res may cause INVALID_STATE_ERR on old Android
	    }

	    // #1000 don't catch errors from the callback to avoid double calling it
	    if (new_err) {
	      self.callback(new_err, res);
	    } else {
	      self.callback(null, res);
	    }
	  });
	}

	/**
	 * Mixin `Emitter` and `requestBase`.
	 */

	Emitter(Request.prototype);
	for (var key in requestBase) {
	  Request.prototype[key] = requestBase[key];
	}

	/**
	 * Set Content-Type to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.xml = 'application/xml';
	 *
	 *      request.post('/')
	 *        .type('xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 *      request.post('/')
	 *        .type('application/xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 * @param {String} type
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.type = function(type){
	  this.set('Content-Type', request.types[type] || type);
	  return this;
	};

	/**
	 * Set responseType to `val`. Presently valid responseTypes are 'blob' and
	 * 'arraybuffer'.
	 *
	 * Examples:
	 *
	 *      req.get('/')
	 *        .responseType('blob')
	 *        .end(callback);
	 *
	 * @param {String} val
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.responseType = function(val){
	  this._responseType = val;
	  return this;
	};

	/**
	 * Set Accept to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.json = 'application/json';
	 *
	 *      request.get('/agent')
	 *        .accept('json')
	 *        .end(callback);
	 *
	 *      request.get('/agent')
	 *        .accept('application/json')
	 *        .end(callback);
	 *
	 * @param {String} accept
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.accept = function(type){
	  this.set('Accept', request.types[type] || type);
	  return this;
	};

	/**
	 * Set Authorization field value with `user` and `pass`.
	 *
	 * @param {String} user
	 * @param {String} pass
	 * @param {Object} options with 'type' property 'auto' or 'basic' (default 'basic')
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.auth = function(user, pass, options){
	  if (!options) {
	    options = {
	      type: 'basic'
	    }
	  }

	  switch (options.type) {
	    case 'basic':
	      var str = btoa(user + ':' + pass);
	      this.set('Authorization', 'Basic ' + str);
	    break;

	    case 'auto':
	      this.username = user;
	      this.password = pass;
	    break;
	  }
	  return this;
	};

	/**
	* Add query-string `val`.
	*
	* Examples:
	*
	*   request.get('/shoes')
	*     .query('size=10')
	*     .query({ color: 'blue' })
	*
	* @param {Object|String} val
	* @return {Request} for chaining
	* @api public
	*/

	Request.prototype.query = function(val){
	  if ('string' != typeof val) val = serialize(val);
	  if (val) this._query.push(val);
	  return this;
	};

	/**
	 * Queue the given `file` as an attachment to the specified `field`,
	 * with optional `filename`.
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .attach('content', new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
	 *   .end(callback);
	 * ```
	 *
	 * @param {String} field
	 * @param {Blob|File} file
	 * @param {String} filename
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.attach = function(field, file, filename){
	  this._getFormData().append(field, file, filename || file.name);
	  return this;
	};

	Request.prototype._getFormData = function(){
	  if (!this._formData) {
	    this._formData = new root.FormData();
	  }
	  return this._formData;
	};

	/**
	 * Invoke the callback with `err` and `res`
	 * and handle arity check.
	 *
	 * @param {Error} err
	 * @param {Response} res
	 * @api private
	 */

	Request.prototype.callback = function(err, res){
	  var fn = this._callback;
	  this.clearTimeout();
	  fn(err, res);
	};

	/**
	 * Invoke callback with x-domain error.
	 *
	 * @api private
	 */

	Request.prototype.crossDomainError = function(){
	  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
	  err.crossDomain = true;

	  err.status = this.status;
	  err.method = this.method;
	  err.url = this.url;

	  this.callback(err);
	};

	/**
	 * Invoke callback with timeout error.
	 *
	 * @api private
	 */

	Request.prototype._timeoutError = function(){
	  var timeout = this._timeout;
	  var err = new Error('timeout of ' + timeout + 'ms exceeded');
	  err.timeout = timeout;
	  this.callback(err);
	};

	/**
	 * Compose querystring to append to req.url
	 *
	 * @api private
	 */

	Request.prototype._appendQueryString = function(){
	  var query = this._query.join('&');
	  if (query) {
	    this.url += ~this.url.indexOf('?')
	      ? '&' + query
	      : '?' + query;
	  }
	};

	/**
	 * Initiate request, invoking callback `fn(res)`
	 * with an instanceof `Response`.
	 *
	 * @param {Function} fn
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.end = function(fn){
	  var self = this;
	  var xhr = this.xhr = request.getXHR();
	  var timeout = this._timeout;
	  var data = this._formData || this._data;

	  // store callback
	  this._callback = fn || noop;

	  // state change
	  xhr.onreadystatechange = function(){
	    if (4 != xhr.readyState) return;

	    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
	    // result in the error "Could not complete the operation due to error c00c023f"
	    var status;
	    try { status = xhr.status } catch(e) { status = 0; }

	    if (0 == status) {
	      if (self.timedout) return self._timeoutError();
	      if (self._aborted) return;
	      return self.crossDomainError();
	    }
	    self.emit('end');
	  };

	  // progress
	  var handleProgress = function(direction, e) {
	    if (e.total > 0) {
	      e.percent = e.loaded / e.total * 100;
	    }
	    e.direction = direction;
	    self.emit('progress', e);
	  }
	  if (this.hasListeners('progress')) {
	    try {
	      xhr.onprogress = handleProgress.bind(null, 'download');
	      if (xhr.upload) {
	        xhr.upload.onprogress = handleProgress.bind(null, 'upload');
	      }
	    } catch(e) {
	      // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
	      // Reported here:
	      // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
	    }
	  }

	  // timeout
	  if (timeout && !this._timer) {
	    this._timer = setTimeout(function(){
	      self.timedout = true;
	      self.abort();
	    }, timeout);
	  }

	  // querystring
	  this._appendQueryString();

	  // initiate request
	  if (this.username && this.password) {
	    xhr.open(this.method, this.url, true, this.username, this.password);
	  } else {
	    xhr.open(this.method, this.url, true);
	  }

	  // CORS
	  if (this._withCredentials) xhr.withCredentials = true;

	  // body
	  if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !this._isHost(data)) {
	    // serialize stuff
	    var contentType = this._header['content-type'];
	    var serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];
	    if (!serialize && isJSON(contentType)) serialize = request.serialize['application/json'];
	    if (serialize) data = serialize(data);
	  }

	  // set header fields
	  for (var field in this.header) {
	    if (null == this.header[field]) continue;
	    xhr.setRequestHeader(field, this.header[field]);
	  }

	  if (this._responseType) {
	    xhr.responseType = this._responseType;
	  }

	  // send stuff
	  this.emit('request', this);

	  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
	  // We need null here if data is undefined
	  xhr.send(typeof data !== 'undefined' ? data : null);
	  return this;
	};


	/**
	 * Expose `Request`.
	 */

	request.Request = Request;

	/**
	 * GET `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */

	request.get = function(url, data, fn){
	  var req = request('GET', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.query(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * HEAD `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */

	request.head = function(url, data, fn){
	  var req = request('HEAD', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * OPTIONS query to `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */

	request.options = function(url, data, fn){
	  var req = request('OPTIONS', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * DELETE `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */

	function del(url, fn){
	  var req = request('DELETE', url);
	  if (fn) req.end(fn);
	  return req;
	};

	request['del'] = del;
	request['delete'] = del;

	/**
	 * PATCH `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} [data]
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */

	request.patch = function(url, data, fn){
	  var req = request('PATCH', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * POST `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} [data]
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */

	request.post = function(url, data, fn){
	  var req = request('POST', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * PUT `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */

	request.put = function(url, data, fn){
	  var req = request('PUT', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	
	/**
	 * Expose `Emitter`.
	 */

	if (true) {
	  module.exports = Emitter;
	}

	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */

	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};

	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */

	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}

	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
	    .push(fn);
	  return this;
	};

	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.once = function(event, fn){
	  function on() {
	    this.off(event, on);
	    fn.apply(this, arguments);
	  }

	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};

	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};

	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }

	  // specific event
	  var callbacks = this._callbacks['$' + event];
	  if (!callbacks) return this;

	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks['$' + event];
	    return this;
	  }

	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};

	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */

	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1)
	    , callbacks = this._callbacks['$' + event];

	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }

	  return this;
	};

	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */

	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks['$' + event] || [];
	};

	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */

	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Module of mixed-in functions shared between node and client code
	 */
	var isObject = __webpack_require__(43);

	/**
	 * Clear previous timeout.
	 *
	 * @return {Request} for chaining
	 * @api public
	 */

	exports.clearTimeout = function _clearTimeout(){
	  this._timeout = 0;
	  clearTimeout(this._timer);
	  return this;
	};

	/**
	 * Override default response body parser
	 *
	 * This function will be called to convert incoming data into request.body
	 *
	 * @param {Function}
	 * @api public
	 */

	exports.parse = function parse(fn){
	  this._parser = fn;
	  return this;
	};

	/**
	 * Override default request body serializer
	 *
	 * This function will be called to convert data set via .send or .attach into payload to send
	 *
	 * @param {Function}
	 * @api public
	 */

	exports.serialize = function serialize(fn){
	  this._serializer = fn;
	  return this;
	};

	/**
	 * Set timeout to `ms`.
	 *
	 * @param {Number} ms
	 * @return {Request} for chaining
	 * @api public
	 */

	exports.timeout = function timeout(ms){
	  this._timeout = ms;
	  return this;
	};

	/**
	 * Promise support
	 *
	 * @param {Function} resolve
	 * @param {Function} reject
	 * @return {Request}
	 */

	exports.then = function then(resolve, reject) {
	  if (!this._fullfilledPromise) {
	    var self = this;
	    this._fullfilledPromise = new Promise(function(innerResolve, innerReject){
	      self.end(function(err, res){
	        if (err) innerReject(err); else innerResolve(res);
	      });
	    });
	  }
	  return this._fullfilledPromise.then(resolve, reject);
	}

	exports.catch = function(cb) {
	  return this.then(undefined, cb);
	};

	/**
	 * Allow for extension
	 */

	exports.use = function use(fn) {
	  fn(this);
	  return this;
	}


	/**
	 * Get request header `field`.
	 * Case-insensitive.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api public
	 */

	exports.get = function(field){
	  return this._header[field.toLowerCase()];
	};

	/**
	 * Get case-insensitive header `field` value.
	 * This is a deprecated internal API. Use `.get(field)` instead.
	 *
	 * (getHeader is no longer used internally by the superagent code base)
	 *
	 * @param {String} field
	 * @return {String}
	 * @api private
	 * @deprecated
	 */

	exports.getHeader = exports.get;

	/**
	 * Set header `field` to `val`, or multiple fields with one object.
	 * Case-insensitive.
	 *
	 * Examples:
	 *
	 *      req.get('/')
	 *        .set('Accept', 'application/json')
	 *        .set('X-API-Key', 'foobar')
	 *        .end(callback);
	 *
	 *      req.get('/')
	 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
	 *        .end(callback);
	 *
	 * @param {String|Object} field
	 * @param {String} val
	 * @return {Request} for chaining
	 * @api public
	 */

	exports.set = function(field, val){
	  if (isObject(field)) {
	    for (var key in field) {
	      this.set(key, field[key]);
	    }
	    return this;
	  }
	  this._header[field.toLowerCase()] = val;
	  this.header[field] = val;
	  return this;
	};

	/**
	 * Remove header `field`.
	 * Case-insensitive.
	 *
	 * Example:
	 *
	 *      req.get('/')
	 *        .unset('User-Agent')
	 *        .end(callback);
	 *
	 * @param {String} field
	 */
	exports.unset = function(field){
	  delete this._header[field.toLowerCase()];
	  delete this.header[field];
	  return this;
	};

	/**
	 * Write the field `name` and `val`, or multiple fields with one object
	 * for "multipart/form-data" request bodies.
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .field('foo', 'bar')
	 *   .end(callback);
	 *
	 * request.post('/upload')
	 *   .field({ foo: 'bar', baz: 'qux' })
	 *   .end(callback);
	 * ```
	 *
	 * @param {String|Object} name
	 * @param {String|Blob|File|Buffer|fs.ReadStream} val
	 * @return {Request} for chaining
	 * @api public
	 */
	exports.field = function(name, val) {

	  // name should be either a string or an object.
	  if (null === name ||  undefined === name) {
	    throw new Error('.field(name, val) name can not be empty');
	  }

	  if (isObject(name)) {
	    for (var key in name) {
	      this.field(key, name[key]);
	    }
	    return this;
	  }

	  // val should be defined now
	  if (null === val || undefined === val) {
	    throw new Error('.field(name, val) val can not be empty');
	  }
	  this._getFormData().append(name, val);
	  return this;
	};

	/**
	 * Abort the request, and clear potential timeout.
	 *
	 * @return {Request}
	 * @api public
	 */
	exports.abort = function(){
	  if (this._aborted) {
	    return this;
	  }
	  this._aborted = true;
	  this.xhr && this.xhr.abort(); // browser
	  this.req && this.req.abort(); // node
	  this.clearTimeout();
	  this.emit('abort');
	  return this;
	};

	/**
	 * Enable transmission of cookies with x-domain requests.
	 *
	 * Note that for this to work the origin must not be
	 * using "Access-Control-Allow-Origin" with a wildcard,
	 * and also must set "Access-Control-Allow-Credentials"
	 * to "true".
	 *
	 * @api public
	 */

	exports.withCredentials = function(){
	  // This is browser-only functionality. Node side is no-op.
	  this._withCredentials = true;
	  return this;
	};

	/**
	 * Set the max redirects to `n`. Does noting in browser XHR implementation.
	 *
	 * @param {Number} n
	 * @return {Request} for chaining
	 * @api public
	 */

	exports.redirects = function(n){
	  this._maxRedirects = n;
	  return this;
	};

	/**
	 * Convert to a plain javascript object (not JSON string) of scalar properties.
	 * Note as this method is designed to return a useful non-this value,
	 * it cannot be chained.
	 *
	 * @return {Object} describing method, url, and data of this request
	 * @api public
	 */

	exports.toJSON = function(){
	  return {
	    method: this.method,
	    url: this.url,
	    data: this._data,
	    headers: this._header
	  };
	};

	/**
	 * Check if `obj` is a host object,
	 * we don't want to serialize these :)
	 *
	 * TODO: future proof, move to compoent land
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */

	exports._isHost = function _isHost(obj) {
	  var str = {}.toString.call(obj);

	  switch (str) {
	    case '[object File]':
	    case '[object Blob]':
	    case '[object FormData]':
	      return true;
	    default:
	      return false;
	  }
	}

	/**
	 * Send `data` as the request body, defaulting the `.type()` to "json" when
	 * an object is given.
	 *
	 * Examples:
	 *
	 *       // manual json
	 *       request.post('/user')
	 *         .type('json')
	 *         .send('{"name":"tj"}')
	 *         .end(callback)
	 *
	 *       // auto json
	 *       request.post('/user')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // manual x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send('name=tj')
	 *         .end(callback)
	 *
	 *       // auto x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // defaults to x-www-form-urlencoded
	 *      request.post('/user')
	 *        .send('name=tobi')
	 *        .send('species=ferret')
	 *        .end(callback)
	 *
	 * @param {String|Object} data
	 * @return {Request} for chaining
	 * @api public
	 */

	exports.send = function(data){
	  var obj = isObject(data);
	  var type = this._header['content-type'];

	  // merge
	  if (obj && isObject(this._data)) {
	    for (var key in data) {
	      this._data[key] = data[key];
	    }
	  } else if ('string' == typeof data) {
	    // default to x-www-form-urlencoded
	    if (!type) this.type('form');
	    type = this._header['content-type'];
	    if ('application/x-www-form-urlencoded' == type) {
	      this._data = this._data
	        ? this._data + '&' + data
	        : data;
	    } else {
	      this._data = (this._data || '') + data;
	    }
	  } else {
	    this._data = data;
	  }

	  if (!obj || this._isHost(data)) return this;

	  // default to json
	  if (!type) this.type('json');
	  return this;
	};


/***/ }),
/* 43 */
/***/ (function(module, exports) {

	/**
	 * Check if `obj` is an object.
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */

	function isObject(obj) {
	  return null !== obj && 'object' === typeof obj;
	}

	module.exports = isObject;


/***/ }),
/* 44 */
/***/ (function(module, exports) {

	// The node and browser modules expose versions of this with the
	// appropriate constructor function bound as first argument
	/**
	 * Issue a request:
	 *
	 * Examples:
	 *
	 *    request('GET', '/users').end(callback)
	 *    request('/users').end(callback)
	 *    request('/users', callback)
	 *
	 * @param {String} method
	 * @param {String|Function} url or callback
	 * @return {Request}
	 * @api public
	 */

	function request(RequestConstructor, method, url) {
	  // callback
	  if ('function' == typeof url) {
	    return new RequestConstructor('GET', method).end(url);
	  }

	  // url first
	  if (2 == arguments.length) {
	    return new RequestConstructor('GET', method);
	  }

	  return new RequestConstructor(method, url);
	}

	module.exports = request;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _superagentPrefix = __webpack_require__(46);

	var _superagentPrefix2 = _interopRequireDefault(_superagentPrefix);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var url = window.localStorage.apiurl || 'http://zhanglun.daoapp.io/api';
	var url = 'http://localhost:1234/api';

	var baseURL = (0, _superagentPrefix2.default)(url);
	// let baseURL = agentPrefix('http://localhost:1234/api');
	// let baseURL = agentPrefix('http://zhanglun.daoapp.io/api');

	exports.default = baseURL;

/***/ }),
/* 46 */
/***/ (function(module, exports) {

	module.exports = function (prefix) {
	    return function (request) {
	        if (request.url[0] === '/') {
	            request.url = prefix + request.url;
	        }

	        return request;
	    };
	}

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.editList = exports.deleteList = exports.addList = exports.fetchLists = undefined;

	var _superagent = __webpack_require__(40);

	var _superagent2 = _interopRequireDefault(_superagent);

	var _mutationType = __webpack_require__(36);

	var mutationType = _interopRequireWildcard(_mutationType);

	var _base = __webpack_require__(45);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var fetchLists = exports.fetchLists = function fetchLists(_ref) {
	  var dispatch = _ref.dispatch;

	  _superagent2.default.get('/lists').set('x-access-token', window.localStorage.token).use(_base2.default).then(function (res) {
	    dispatch(mutationType.FETCH_LISTS, res.body);
	  }, function (err) {
	    dispatch(mutationType.FETCH_LISTS_ERROR, err);
	  });
	};

	var addList = exports.addList = function addList(_ref2, param) {
	  var dispatch = _ref2.dispatch;

	  _superagent2.default.post('/lists').set('x-access-token', window.localStorage.token).send(param).use(_base2.default).then(function (res) {
	    console.log(res);
	    dispatch(mutationType.ADD_LIST, res.body);
	  }, function (err) {
	    dispatch(mutationType.ADD_LIST_ERROR, err);
	  });
	};

	var deleteList = exports.deleteList = function deleteList(_ref3, param) {
	  var dispatch = _ref3.dispatch;

	  _superagent2.default.delete('/lists/' + param.id).send(param).set('x-access-token', window.localStorage.token).use(_base2.default).then(function () {
	    dispatch(mutationType.DELETE_LIST, param.id);
	  }, function (err) {
	    dispatch(mutationType.DELETE_LIST_ERROR, err);
	  });
	};

	var editList = exports.editList = function editList(_ref4, id, param) {
	  var dispatch = _ref4.dispatch;

	  _superagent2.default.put('/lists/' + id).send(param).set('x-access-token', window.localStorage.token).use(_base2.default).then(function (res) {
	    dispatch(mutationType.EDIT_LIST, res.body);
	  }, function (err) {
	    dispatch(mutationType.EDIT_LIST_ERROR, err);
	  });
	};

/***/ }),
/* 48 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var getUserInfo = exports.getUserInfo = function getUserInfo(state) {
	  return state.user.data;
	};

	var getUserAuth = exports.getUserAuth = function getUserAuth(state) {
	  return state.user.auth;
	};

	var getLists = exports.getLists = function getLists(state) {
	  return state.lists.all;
	};

	var getTasks = exports.getTasks = function getTasks(state) {
	  return state.tasks.all;
	};

	var isShowDetail = exports.isShowDetail = function isShowDetail(state) {
	  return state.tasks.showDetail;
	};

	var getTaskDetail = exports.getTaskDetail = function getTaskDetail(state) {
	  return state.tasks.taskDetail;
	};

	// ajax 加载相关
	var isRequestingTaskDetail = exports.isRequestingTaskDetail = function isRequestingTaskDetail(state) {
	  return state.tasks.isRequestingTaskDetail;
	};
	var isRequestingTasks = exports.isRequestingTasks = function isRequestingTasks(state) {
	  return state.tasks.isRequestingTasks;
	};

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	__webpack_require__(50)
	__vue_script__ = __webpack_require__(51)
	if (Object.keys(__vue_script__).some(function (key) { return key !== "default" && key !== "__esModule" })) {
	  console.warn("[vue-loader] app/src/components/SideContainer.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(52)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
	if (__vue_template__) {
	__vue_options__.template = __vue_template__
	}
	if (!__vue_options__.computed) __vue_options__.computed = {}
	Object.keys(__vue_styles__).forEach(function (key) {
	var module = __vue_styles__[key]
	__vue_options__.computed[key] = function () { return module }
	})
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-66c6cec0/SideContainer.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ }),
/* 50 */
11,
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _lists = __webpack_require__(47);

	var listsActions = _interopRequireWildcard(_lists);

	var _getter = __webpack_require__(48);

	var getters = _interopRequireWildcard(_getter);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	// <template>
	//   <div class="sidebar">
	//     <div class="sidebar-header">
	//       <!-- <span class="material-icons">list</span> -->
	//     </div>
	//     <div class="sidebar-toolbar">
	//       <div v-if="user" class="sidebar-toolbar-account">
	//         <img v-bind:src="user.avatar" alt="">
	//         {{user.username}}
	//       </div>
	//     </div>
	//     <div class="sidebar-body list-scroll">
	//       <ul class="side-menu">
	//         <li>
	//           <a class="side-menu__item" v-link="{name: 'list', params: {id: 'archive'}}">
	//             <span class="material-icons">archive</span>
	//             <span class="side-menu__item-content">归档</span>
	//           </a>
	//         </li>
	//         <li>
	//           <a class="side-menu__item" v-link="{name: 'list', params: {id: 'trash'}}">
	//             <span class="material-icons">delete</span>
	//             <span class="side-menu__item-content">回收站</span>
	//           </a>
	//         </li>
	//       </ul>
	//       <ul class="side-menu">
	//         <li v-for="list in lists">
	//           <a class="side-menu__item" v-link="{name: 'list', params: {id: list.id}}">
	//             <span class="material-icons">list</span>
	//             <span class="side-menu__item-content">{{list.name}}</span>
	//             <span class="side-menu__item-count">{{list.task_count_total - list.task_count_archived - list.task_count_istrash || ''}}</span>
	//             <span class="material-icons edit" @click="showCurrent(e, list)" data-tooltip="编辑" data-tooltip-pos="down">edit</span>
	//           </a>
	//         </li>
	//       </ul>
	//
	//     </div>
	//     <div class="sidebar-footer">
	//       <div class="side-actions">
	//         <span class="side-actions__item" @click="showModal = true">
	//           <span class="material-icons">add</span>
	//           <span class="side-actions__item-content">新建分类</span>
	//         </span>
	//       </div>
	//     </div>
	//     <modal :show="showModal">
	//       <div slot="content" class="list-editor">
	//         <div class="list-editor-header">
	//           <h3 class="list-editor-header--title">创建新的清单</h3>
	//         </div>
	//         <div class="list-editor-body">
	//           <div class="robin-textfield">
	//             <input type="text" class="robin-textfield--input robin-textfield--input_default" v-model="newList.name"/>
	//           </div>
	//         </div>
	//         <div class="list-editor-footer">
	//           <span></span>
	//           <button class="robin-btn robin-btn__default" @click="createNewList">创建</button>
	//         </div>
	//       </div>
	//     </modal>
	//     <modal :show="showSelectedList">
	//       <div slot="content" class="list-editor">
	//         <div class="list-editor-header">
	//           <h3 class="list-editor-header--title">编辑清单</h3>
	//         </div>
	//         <div class="list-editor-body">
	//           <div class="robin-textfield">
	//             <input type="text" class="robin-textfield--input robin-textfield--input_default" v-model="selectedList.name"/>
	//           </div>
	//         </div>
	//         <div class="list-editor-footer">
	//           <span class="material-icons" @click="deleteList(this.selectedList)">delete</span>
	//           <button class="robin-btn robin-btn__default" @click="doEditList">确定</button>
	//         </div>
	//       </div>
	//     </modal>
	//   </div>
	//
	// </template>
	// <script>
	exports.default = {
	  data: function data() {
	    return {
	      showModal: false,
	      newList: {
	        name: ''
	      },
	      selectedList: null,
	      showSelectedList: false
	    };
	  },

	  vuex: {
	    actions: {
	      addList: listsActions.addList,
	      deleteList: listsActions.deleteList,
	      editList: listsActions.editList
	    },
	    getters: {
	      lists: getters.getLists,
	      user: getters.getUserInfo
	    }
	  },
	  watch: {
	    // 监控左侧 list 列表，默认选中第一个
	    lists: function lists() {
	      this.showModal = false;
	      this.showSelectedList = false;
	      this.newList.name = '';
	    }
	  },
	  ready: function ready() {
	    var _this = this;

	    document.addEventListener('keyup', function (e) {
	      if (e.keyCode === 27) {
	        _this.showModal = false;
	        _this.showSelectedList = false;
	      }
	    });
	  },

	  methods: {
	    createNewList: function createNewList() {
	      if (!this.newList.name) {
	        return false;
	      }
	      var param = {
	        name: this.newList.name
	      };
	      this.showModal = false;
	      this.newList.name = '';
	      this.addList(param);
	    },
	    showCurrent: function showCurrent(e, list) {
	      this.selectedList = list;
	      this.showSelectedList = true;
	    },
	    doEditList: function doEditList() {
	      var param = {};
	      param.name = this.selectedList.name;
	      this.showSelectedList = false;
	      this.editList(this.selectedList.id, param);
	    }
	  }
	};
	// </script>
	//
	// <style lang="less">
	//
	//   @import '../public/stylesheets/variables';
	//   .sidebar{
	//     max-width: @sidemenu-width;
	//     box-sizing: border-box;
	//     flex: 1 0 @sidemenu-width;
	//     background: #fff;
	//     display: flex;
	//     flex-direction: column;
	//     &-header{
	//       min-height: 45px;
	//       background: #ffc952 ;
	//     }
	//     &-body {
	//       flex: 1 1 auto;
	//       overflow-y: auto;
	//     }
	//     &-toolbar {
	//       padding: 6px 0 6px;
	//       box-sizing: border-box;
	//       display: flex;
	//       &-account{
	//         width: 60%;
	//         display: flex;
	//         align-items: center;
	//         justify-content: flex-start;
	//         img{
	//           min-width: 32px;
	//           width: 32px;
	//           height: 32px;
	//           flex: 0 1 32px;
	//           border-radius: 100%;
	//           padding: 0 6px 0 6px;
	//         }
	//       }
	//     }
	//   }
	//
	//   .side-menu{
	//     padding:2px 0;
	//     margin: 0;
	//     border-bottom: 1px solid @sidemenu-spearate-line;
	//     li {
	//       list-style-type: none;
	//     }
	//     &__item{
	//       box-sizing: border-box;
	//       border-radius: 2px;
	//       padding: 8px 14px 8px 12px;
	//       color: #000;
	//       text-decoration: none;
	//       display: flex;
	//       cursor: pointer;
	//       .edit{
	//         display: none;
	//       }
	//       &:hover{
	//         background: rgba(0,0,0,.03);
	//       }
	//       &--active{
	//         background: #e0e0e0;
	//         .edit{
	//           float:right;
	//           display: block;
	//         }
	//       }
	//       &-content{
	//         margin-left: 10px;
	//         flex: 1 0 26px;
	//         .text-overflow();
	//       }
	//       &-count {
	//         margin-right: 6px;
	//       }
	//     }
	//   }
	//   .sidebar-footer {
	//     min-height: 40px;
	//     .side-actions{
	//       width: @sidemenu-width;
	//       border-top: 1px solid @sidemenu-spearate-line;
	//       font-size: 14px;
	//       &__item {
	//         width: 100%;
	//         box-sizing: border-box;
	//         border-radius: 2px;
	//         line-height: 24px;
	//         padding: 8px;
	//         color: #000;
	//         text-decoration: none;
	//         display: flex;
	//         justify-content: center;
	//         cursor: pointer;
	//         &:hover{
	//           background: rgba(0,0,0,.03);
	//         }
	//         &-content {
	//           margin-left: 10px;
	//           flex: 0 1 76px;
	//           overflow: hidden;
	//           text-overflow: ellipsis;
	//           white-space: nowrap;
	//         }
	//       }
	//     }
	//   }
	//
	//   .list-editor {
	//     width: 340px;
	//     margin: 0 auto;
	//     background: #fff;
	//     border-radius: 2px;
	//     &-header {
	//       padding: 14px 14px 0px;
	//       text-align: center;
	//       &--title {
	//         font-size: 26px;
	//         margin: 0px;
	//       }
	//     }
	//     &-body {
	//       padding: 4px 14px 10px;
	//     }
	//     &-footer {
	//       padding: 12px;
	//       border-top: 1px solid #e0e0df;
	//       display: flex;
	//       align-items: center;
	//       justify-content: space-between;
	//     }
	//   }
	//
	//
	//   </style>

/***/ }),
/* 52 */
/***/ (function(module, exports) {

	module.exports = "\n<div class=\"sidebar\">\n  <div class=\"sidebar-header\">\n    <!-- <span class=\"material-icons\">list</span> -->\n  </div>\n  <div class=\"sidebar-toolbar\">\n    <div v-if=\"user\" class=\"sidebar-toolbar-account\">\n      <img v-bind:src=\"user.avatar\" alt=\"\">\n      {{user.username}}\n    </div>\n  </div>\n  <div class=\"sidebar-body list-scroll\">\n    <ul class=\"side-menu\">\n      <li>\n        <a class=\"side-menu__item\" v-link=\"{name: 'list', params: {id: 'archive'}}\">\n          <span class=\"material-icons\">archive</span>\n          <span class=\"side-menu__item-content\">归档</span>\n        </a>\n      </li>\n      <li>\n        <a class=\"side-menu__item\" v-link=\"{name: 'list', params: {id: 'trash'}}\">\n          <span class=\"material-icons\">delete</span>\n          <span class=\"side-menu__item-content\">回收站</span>\n        </a>\n      </li>\n    </ul>\n    <ul class=\"side-menu\">\n      <li v-for=\"list in lists\">\n        <a class=\"side-menu__item\" v-link=\"{name: 'list', params: {id: list.id}}\">\n          <span class=\"material-icons\">list</span>\n          <span class=\"side-menu__item-content\">{{list.name}}</span>\n          <span class=\"side-menu__item-count\">{{list.task_count_total - list.task_count_archived - list.task_count_istrash || ''}}</span>\n          <span class=\"material-icons edit\" @click=\"showCurrent(e, list)\" data-tooltip=\"编辑\" data-tooltip-pos=\"down\">edit</span>\n        </a>\n      </li>\n    </ul>\n\n  </div>\n  <div class=\"sidebar-footer\">\n    <div class=\"side-actions\">\n      <span class=\"side-actions__item\" @click=\"showModal = true\">\n        <span class=\"material-icons\">add</span>\n        <span class=\"side-actions__item-content\">新建分类</span>\n      </span>\n    </div>\n  </div>\n  <modal :show=\"showModal\">\n    <div slot=\"content\" class=\"list-editor\">\n      <div class=\"list-editor-header\">\n        <h3 class=\"list-editor-header--title\">创建新的清单</h3>\n      </div>\n      <div class=\"list-editor-body\">\n        <div class=\"robin-textfield\">\n          <input type=\"text\" class=\"robin-textfield--input robin-textfield--input_default\" v-model=\"newList.name\"/>\n        </div>\n      </div>\n      <div class=\"list-editor-footer\">\n        <span></span>\n        <button class=\"robin-btn robin-btn__default\" @click=\"createNewList\">创建</button>\n      </div>\n    </div>\n  </modal>\n  <modal :show=\"showSelectedList\">\n    <div slot=\"content\" class=\"list-editor\">\n      <div class=\"list-editor-header\">\n        <h3 class=\"list-editor-header--title\">编辑清单</h3>\n      </div>\n      <div class=\"list-editor-body\">\n        <div class=\"robin-textfield\">\n          <input type=\"text\" class=\"robin-textfield--input robin-textfield--input_default\" v-model=\"selectedList.name\"/>\n        </div>\n      </div>\n      <div class=\"list-editor-footer\">\n        <span class=\"material-icons\" @click=\"deleteList(this.selectedList)\">delete</span>\n        <button class=\"robin-btn robin-btn__default\" @click=\"doEditList\">确定</button>\n      </div>\n    </div>\n  </modal>\n</div>\n\n";

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	__webpack_require__(54)
	__vue_script__ = __webpack_require__(55)
	if (Object.keys(__vue_script__).some(function (key) { return key !== "default" && key !== "__esModule" })) {
	  console.warn("[vue-loader] app/src/components/TaskDetail.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(59)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
	if (__vue_template__) {
	__vue_options__.template = __vue_template__
	}
	if (!__vue_options__.computed) __vue_options__.computed = {}
	Object.keys(__vue_styles__).forEach(function (key) {
	var module = __vue_styles__[key]
	__vue_options__.computed[key] = function () { return module }
	})
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-d3d0f720/TaskDetail.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ }),
/* 54 */
11,
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _tasks = __webpack_require__(56);

	var tasksActions = _interopRequireWildcard(_tasks);

	var _getter = __webpack_require__(48);

	var getters = _interopRequireWildcard(_getter);

	var _marked = __webpack_require__(57);

	var _marked2 = _interopRequireDefault(_marked);

	var _tool = __webpack_require__(58);

	var _tool2 = _interopRequireDefault(_tool);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	// <template>
	//   <div class="card" @click.stop v-bind:class="{card__trash: task.istrash}">
	//     <div class="loader loader__hover" v-show="isRequestingTaskDetail" transition="animation-loader">
	//       <div class="loader-inner ball-clip-rotate-multiple">
	//         <div></div>
	//         <div></div>
	//       </div>
	//     </div>
	//     <div class="card-status card-status__archived" v-if="task.archived && !task.istrash">
	//       该任务已经归档
	//     </div>
	//     <div class="card-status card-status__trash" v-if="task.istrash">
	//       该任务已被删除，无法编辑
	//     </div>
	//     <div class="card-header">
	//       <input class="card-header--title card-header--input" :value="task.title" v-autoblur="isTitleEditing" @focus="isTitleEditing = true" @keyup.esc="doEditTitle" @keyup.enter="doEditTitle" :disabled="task.istrash" />
	//     </div>
	//     <div class="card-body">
	//       <div class="card-metadata">
	//         <!--  标签 -->
	//         <div class="card-metadata-item">
	//           <span class="material-icons card-metadata-item--icons">label_outline</span>
	//         </div>
	//         <div class="card-metadata-item">
	//           <i class="material-icons card-metadata-item--icons" data-tooltip="更新时间">update</i>
	//           <span class="card-metadata-item--content">{{task.update_time}}</span>
	//         </div>
	//         <div class="card-metadata-item">
	//           <i class="material-icons card-metadata-item--icons" data-tooltip="截止时间">alarm</i>
	//           <span class="card-metadata-item--content">Due: {{task.deadline}}</span>
	//         </div>
	//         <div class="card-metadata-item">
	//           <span class="material-icons card-metadata-item--icons">create</span>
	//           <div class="card-metadata-item--content" v-bind:class="{editing: isDescEditing}" @dblclick="modifyDesc">
	//             <div class="content-value markdownPrased">{{{descriptionMarked}}}</div>
	//             <textarea class="content-input" v-autofocus="isDescEditing" @keyup.esc="doEditDesc" @blur="doEditDesc" v-model="task.description"></textarea>
	//           </div>
	//         </div>
	//         <!-- 子任务 -->
	// <!--               <div class="card-subtasks">
	//           <ul>
	//             <li></li>
	//           </ul>
	//           <div class="card-metadata-item">
	//             <span class="material-icons card-metadata-item--icons">add</span>
	//           </div>
	//         </div> -->
	//       </div>
	//     </div>
	//     <div class="card-footer">
	//       <span></span>
	//       <div> 创建于：{{task.create_time}}</div>
	//       <div class="card-footer--toolbar">
	//         <i class="material-icons" @click="toggleTask(task)" data-tooltip="归档" data-tooltip-pos="down" v-if="!task.archived">archive</i>
	//         <i class="material-icons" @click="toggleTask(task)" data-tooltip="取消归档" data-tooltip-pos="down" v-if="task.archived">unarchive</i>
	//         <i class="material-icons" @click="deleteTask(task)" v-if="task.istrash" data-tooltip="彻底删除">delete_forever</i>
	//         <i class="material-icons" @click="deleteTask(task)" v-if="!task.istrash" data-tooltip="删除">delete</i>
	//       </div>
	//     </div>
	//   </div>
	// </template>
	// <script>
	var markedRenderer = new _marked2.default.Renderer();
	markedRenderer.listitem = function (text) {
	  if (/^\s*\[[x ]\]\s*/.test(text)) {
	    text = text.replace(/^\s*\[ \]\s*/, '<input type="checkbox" class="empty checkbox icon" />').replace(/^\s*\[x\]\s*/, '<input type="checkbox" checked class="checked checkbox icon" />');
	    return '<li style="list-style: none">' + text + '</li>';
	  } else {
	    return '<li>' + text + '</li>';
	  }
	};
	_marked2.default.setOptions({
	  renderer: markedRenderer,
	  gfm: true,
	  tables: true,
	  breaks: false,
	  pedantic: false,
	  sanitize: true,
	  smartypants: false
	});

	exports.default = {
	  data: function data() {
	    return {
	      isTitleEditing: false,
	      isDescEditing: false
	    };
	  },

	  vuex: {
	    actions: {
	      edit: tasksActions.editTask,
	      toggle: tasksActions.toggleTask,
	      delete: tasksActions.deleteTask,
	      hideTaskDetail: tasksActions.hideTaskDetail
	    },
	    getters: {
	      task: getters.getTaskDetail,
	      isRequestingTaskDetail: getters.isRequestingTaskDetail
	    }
	  },
	  ready: function ready() {
	    var _this = this;
	    document.addEventListener('keyup', function (e) {
	      if (e.keyCode === 27) {
	        _this.hideTaskDetail();
	      }
	    });
	  },

	  computed: {
	    descriptionMarked: function descriptionMarked() {
	      return (0, _marked2.default)(this.task.description || '暂无描述');
	    },
	    descriptionEncode: function descriptionEncode() {
	      return _tool2.default.htmlEncode(this.task.description);
	    }
	  },
	  directives: {
	    'autofocus': function autofocus(value) {
	      if (!value) {
	        return;
	      }
	      var el = this.el;
	      setTimeout(function () {
	        el.focus();
	      }, 0);
	    },
	    'autoblur': function autoblur(value) {
	      if (value) {
	        return;
	      }
	      var el = this.el;
	      setTimeout(function () {
	        el.blur();
	      }, 0);
	    }
	  },
	  methods: {
	    close: function close() {
	      this.hideTaskDetail();
	    },
	    cancelEdit: function cancelEdit(e) {
	      e.target.value = this.task.title;
	      this.isTitleEditing = false;
	      e.stopPropagation();
	    },
	    modifyDesc: function modifyDesc() {
	      console.log('modifyDesc');
	      if (this.task.istrash) {
	        this.isDescEditing = false;
	        return false;
	      }
	      this.isDescEditing = true;
	    },
	    toggleTask: function toggleTask(task) {
	      task.archived = !task.archived;
	      this.toggle(task.id, { archived: task.archived });
	    },
	    deleteTask: function deleteTask(task) {
	      this.delete(task.id);
	    },
	    doEditTitle: function doEditTitle(e) {
	      var task = this.task;
	      var param = {
	        title: e.target.value.trim()
	      };
	      if (!param.title) {
	        return false;
	      }
	      this.isTitleEditing = false;
	      this.edit(task.id, param);
	      e.stopPropagation();
	    },
	    doEditDesc: function doEditDesc(e) {
	      var task = this.task;
	      var param = {
	        description: e.target.value.trim()
	      };
	      if (!param.description) {
	        return false;
	      }
	      this.isDescEditing = false;
	      this.edit(task.id, param);
	      e.stopPropagation();
	    }
	  }
	};
	// </script>
	// <style lang="less">
	//   @import '../public/stylesheets/variables';
	//   .card {
	//     display: flex;
	//     flex-direction: column;
	//     flex: 0 0 @taskdetail-card-width;
	//     height: 100%;
	//     margin: 0 auto;
	//     background: @taskdetail-container-background;
	//     border-radius: 2px;
	//     // box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
	//     transition: all 300ms 0s;
	//     position: relative;
	//     &__trash {
	//       .card-header, .card-metadata {
	//         cursor: not-allowed;
	//       }
	//     }
	//     &-status{
	//       color: fadeout(#000, 60%);
	//       font-size: 14px;
	//       padding: 12px 18px;
	//       &__archived{
	//         background-color: #fdfae5;
	//         background-image: -webkit-linear-gradient(top left, rgba(0,0,0,.05) 25%, transparent 25%, transparent 50%, rgba(0,0,0,.05) 50%, rgba(0,0,0,.05) 75%, transparent 75%, transparent);
	//         background-image: -o-linear-gradient(top left, rgba(0,0,0,.05) 25%, transparent 25%, transparent 50%, rgba(0,0,0,.05) 50%, rgba(0,0,0,.05) 75%, transparent 75%, transparent);
	//         background-image: linear-gradient(to bottom right, rgba(0,0,0,.05) 25%, transparent 25%, transparent 50%, rgba(0,0,0,.05) 50%, rgba(0,0,0,.05) 75%, transparent 75%, transparent);
	//         background-size: 14px 14px;
	//       }
	//       &__trash{
	//         background-color: fade(#ff7473, 80%);
	//         background-image: linear-gradient(to bottom right, #ff7473 25%, transparent 25%, transparent 50%, #ff7473 50%, #ff7473 75%, transparent 75%, transparent);
	//         background-size: 14px 14px;
	//       }
	//     }
	//   }
	//
	//   .card-header {
	//     display: flex;
	//     min-height: 55px;
	//     box-sizing: border-box;
	//     align-items: center;
	//     color: fadeout(#000, 60%);
	//     margin-top: 0;
	//     padding: 16px 18px;
	//     border-bottom: 1px solid @taskdetail-spearate-line;
	//     background: @taskdetail-container-header-background;
	//     &--input {
	//       width: 100%;
	//       background: none;
	//       font-size: 18px;
	//       font-weight: bolder;
	//       box-sizing: border-box;
	//       border: none;
	//       outline: none;
	//       .text-overflow();
	//       &:focus {
	//         background: @taskdetail-container-header-background;
	//       }
	//     }
	//   }
	//
	//   .card-body {
	//     overflow-y: auto;
	//     flex: 1 1 auto;
	//   }
	//
	//   .card-metadata {
	//     padding: 8px 0;
	//     &-item {
	//       display: flex;
	//       min-height: 46px;
	//       box-sizing: border-box;
	//       align-items: flex-start;
	//       padding: 6px 14px;
	//       position: relative;
	//       &::after {
	//         content: '';
	//         height: 0;
	//         border-bottom: 1px solid @taskdetail-spearate-line;
	//         position: absolute;
	//         left: 50px;
	//         right: 50px;
	//         bottom: 0;
	//       }
	//       &--icons {
	//         margin-right: 6px;
	//         padding: 4px;
	//       }
	//       &--content {
	//         font-size: 14px;
	//         padding: 5px 0;
	//         width: @taskdetail-card-width - 100px;
	//         word-break: break-all;
	//         .content-input {
	//           display: none;
	//           height: 300px;
	//           width: 100%;
	//           box-sizing: border-box;
	//           border: none;
	//           resize: none;
	//           outline: none;
	//           font-size: 14px;
	//           background: none;
	//         }
	//         &.editing {
	//           .content-input {
	//             display: block;
	//           }
	//           .content-value {
	//             display: none;
	//           }
	//         }
	//       }
	//     }
	//   }
	//
	//   .card-footer {
	//     font-size: 14px;
	//     padding: 12px;
	//     min-height: 26px;
	//     color: #a3a3a2;
	//     border-top: 1px solid @taskdetail-spearate-line;
	//     background: @taskdetail-container-header-background;
	//     text-align: center;
	//     display: flex;
	//     justify-content: space-between;
	//     align-items: center;
	//     &--toolbar {
	//       cursor: pointer;
	//       display: flex;
	//       align-items: center;
	//       color: fadeout(#000, 30%);
	//       &:hover{
	//         color:#000;
	//       }
	//     }
	//   }
	//
	//   /**
	//    * animation slide
	//    */
	//
	//   .animation-showtaskdetail{
	//     &-transition {
	//       transition: all 0.3s ease;
	//       overflow: hidden;
	//     }
	//     &-enter,
	//     &-leave {
	//       flex: 0;
	//     }
	//   }
	//
	//   </style>

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.resetTasks = exports.editTask = exports.deleteTask = exports.toggleTask = exports.addTask = exports.hideTaskDetail = exports.fetchTaskDetail = exports.fetchTasks = undefined;

	var _superagent = __webpack_require__(40);

	var _superagent2 = _interopRequireDefault(_superagent);

	var _mutationType = __webpack_require__(36);

	var mutationType = _interopRequireWildcard(_mutationType);

	var _base = __webpack_require__(45);

	var _base2 = _interopRequireDefault(_base);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var requestTasks = function requestTasks(query) {
	  return _superagent2.default.get('/tasks').query(query).set('x-access-token', window.localStorage.token).use(_base2.default);
	};

	var fetchTasks = exports.fetchTasks = function fetchTasks(_ref, query, callback) {
	  var dispatch = _ref.dispatch,
	      state = _ref.state;

	  dispatch(mutationType.REQUST_TASKS);
	  requestTasks(query).then(function (res) {
	    if (typeof callback === 'function') {
	      callback(res);
	    }
	    dispatch(mutationType.RECEIVE_TASKS, query, res.body);
	  }, function (err) {
	    dispatch(mutationType.RECEIVE_TASKS_ERROR, err);
	  });
	};

	var fetchTaskDetail = exports.fetchTaskDetail = function fetchTaskDetail(_ref2, taskid) {
	  var dispatch = _ref2.dispatch,
	      state = _ref2.state;

	  dispatch(mutationType.REQUEST_TASK_DETAIL);
	  _superagent2.default.get('/tasks/' + taskid).set('x-access-token', window.localStorage.token).use(_base2.default).then(function (res) {
	    dispatch(mutationType.RECEIVE_TASK_DETAIL, res.body);
	  }, function (err) {
	    dispatch(mutationType.RECEIVE_TASK_DETAIL_ERROR, err);
	  });
	};

	var hideTaskDetail = exports.hideTaskDetail = function hideTaskDetail(_ref3) {
	  var dispatch = _ref3.dispatch;

	  dispatch(mutationType.HIDE_DETAIL_WINDOW);
	};

	var addTask = exports.addTask = function addTask(_ref4, task) {
	  var dispatch = _ref4.dispatch,
	      state = _ref4.state;

	  _superagent2.default.post('/tasks').send(task).set('x-access-token', window.localStorage.token).use(_base2.default).then(function (res) {
	    dispatch(mutationType.ADD_TASK, res.body);
	    dispatch(mutationType.UPDATE_LIST, { id: task.list_id, type: 'total', update: 1 });
	  }, function (err) {
	    dispatch(mutationType.ADD_TASK_ERROR, err);
	  });
	};

	var toggleTask = exports.toggleTask = function toggleTask(_ref5, taskid, param) {
	  var dispatch = _ref5.dispatch,
	      state = _ref5.state;

	  _superagent2.default.put('/tasks/' + taskid).send(param).set('x-access-token', window.localStorage.token).use(_base2.default).then(function (res) {
	    console.log('actions toggle task');
	    dispatch(mutationType.EDIT_TASK, res.body);
	    if (param.hasOwnProperty('archived') && param.archived) {
	      dispatch(mutationType.UPDATE_LIST, { id: res.body.list_id, type: 'archived', update: 1 });
	    } else if (param.hasOwnProperty('archived') && !param.archived) {
	      dispatch(mutationType.UPDATE_LIST, { id: res.body.list_id, type: 'archived', update: -1 });
	    }
	  }, function (err) {
	    dispatch(mutationType.EDIT_TASK_ERROR, err);
	  });
	};

	var deleteTask = exports.deleteTask = function deleteTask(_ref6, task) {
	  var dispatch = _ref6.dispatch,
	      state = _ref6.state;

	  _superagent2.default.delete('/tasks/' + task.id).set('x-access-token', window.localStorage.token).use(_base2.default).then(function (res) {
	    dispatch(mutationType.DELETE_TASK, res.body);
	    if (task.istrash == false) {
	      dispatch(mutationType.UPDATE_LIST, { id: res.body.list_id, type: 'istrash', update: 1 });
	    }
	    if (task.archived == true) {
	      dispatch(mutationType.UPDATE_LIST, { id: res.body.list_id, type: 'archived', update: -1 });
	    }
	    if (task.istrash == true) {
	      dispatch(mutationType.UPDATE_LIST, { id: res.body.list_id, type: 'istrash', update: -1 });
	      dispatch(mutationType.UPDATE_LIST, { id: res.body.list_id, type: 'total', update: -1 });
	    }
	  }, function (err) {
	    dispatch(mutationType.EDIT_TASK_ERROR, err);
	  });
	};

	var editTask = exports.editTask = function editTask(_ref7, taskid, param) {
	  var dispatch = _ref7.dispatch,
	      state = _ref7.state;

	  _superagent2.default.put('/tasks/' + taskid).set('x-access-token', window.localStorage.token).send(param).use(_base2.default).then(function (res) {
	    dispatch(mutationType.EDIT_TASK, res.body);
	    if (param.hasOwnProperty('istrash')) {
	      if (param.istrash) {
	        dispatch(mutationType.UPDATE_LIST, { id: res.body.list_id, type: 'istrash', update: 1 });
	      } else {
	        dispatch(mutationType.UPDATE_LIST, { id: res.body.list_id, type: 'istrash', update: -1 });
	      }
	    }
	  });
	};

	var resetTasks = exports.resetTasks = function resetTasks(_ref8, taskid, param) {
	  var dispatch = _ref8.dispatch,
	      state = _ref8.state;

	  dispatch(mutationType.RESET_TASKS);
	};

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * marked - a markdown parser
	 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
	 * https://github.com/chjj/marked
	 */

	;(function() {

	/**
	 * Block-Level Grammar
	 */

	var block = {
	  newline: /^\n+/,
	  code: /^( {4}[^\n]+\n*)+/,
	  fences: noop,
	  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
	  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
	  nptable: noop,
	  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
	  blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
	  list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
	  html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
	  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
	  table: noop,
	  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
	  text: /^[^\n]+/
	};

	block.bullet = /(?:[*+-]|\d+\.)/;
	block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
	block.item = replace(block.item, 'gm')
	  (/bull/g, block.bullet)
	  ();

	block.list = replace(block.list)
	  (/bull/g, block.bullet)
	  ('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')
	  ('def', '\\n+(?=' + block.def.source + ')')
	  ();

	block.blockquote = replace(block.blockquote)
	  ('def', block.def)
	  ();

	block._tag = '(?!(?:'
	  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
	  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
	  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

	block.html = replace(block.html)
	  ('comment', /<!--[\s\S]*?-->/)
	  ('closed', /<(tag)[\s\S]+?<\/\1>/)
	  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
	  (/tag/g, block._tag)
	  ();

	block.paragraph = replace(block.paragraph)
	  ('hr', block.hr)
	  ('heading', block.heading)
	  ('lheading', block.lheading)
	  ('blockquote', block.blockquote)
	  ('tag', '<' + block._tag)
	  ('def', block.def)
	  ();

	/**
	 * Normal Block Grammar
	 */

	block.normal = merge({}, block);

	/**
	 * GFM Block Grammar
	 */

	block.gfm = merge({}, block.normal, {
	  fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,
	  paragraph: /^/,
	  heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
	});

	block.gfm.paragraph = replace(block.paragraph)
	  ('(?!', '(?!'
	    + block.gfm.fences.source.replace('\\1', '\\2') + '|'
	    + block.list.source.replace('\\1', '\\3') + '|')
	  ();

	/**
	 * GFM + Tables Block Grammar
	 */

	block.tables = merge({}, block.gfm, {
	  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
	  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
	});

	/**
	 * Block Lexer
	 */

	function Lexer(options) {
	  this.tokens = [];
	  this.tokens.links = {};
	  this.options = options || marked.defaults;
	  this.rules = block.normal;

	  if (this.options.gfm) {
	    if (this.options.tables) {
	      this.rules = block.tables;
	    } else {
	      this.rules = block.gfm;
	    }
	  }
	}

	/**
	 * Expose Block Rules
	 */

	Lexer.rules = block;

	/**
	 * Static Lex Method
	 */

	Lexer.lex = function(src, options) {
	  var lexer = new Lexer(options);
	  return lexer.lex(src);
	};

	/**
	 * Preprocessing
	 */

	Lexer.prototype.lex = function(src) {
	  src = src
	    .replace(/\r\n|\r/g, '\n')
	    .replace(/\t/g, '    ')
	    .replace(/\u00a0/g, ' ')
	    .replace(/\u2424/g, '\n');

	  return this.token(src, true);
	};

	/**
	 * Lexing
	 */

	Lexer.prototype.token = function(src, top, bq) {
	  var src = src.replace(/^ +$/gm, '')
	    , next
	    , loose
	    , cap
	    , bull
	    , b
	    , item
	    , space
	    , i
	    , l;

	  while (src) {
	    // newline
	    if (cap = this.rules.newline.exec(src)) {
	      src = src.substring(cap[0].length);
	      if (cap[0].length > 1) {
	        this.tokens.push({
	          type: 'space'
	        });
	      }
	    }

	    // code
	    if (cap = this.rules.code.exec(src)) {
	      src = src.substring(cap[0].length);
	      cap = cap[0].replace(/^ {4}/gm, '');
	      this.tokens.push({
	        type: 'code',
	        text: !this.options.pedantic
	          ? cap.replace(/\n+$/, '')
	          : cap
	      });
	      continue;
	    }

	    // fences (gfm)
	    if (cap = this.rules.fences.exec(src)) {
	      src = src.substring(cap[0].length);
	      this.tokens.push({
	        type: 'code',
	        lang: cap[2],
	        text: cap[3] || ''
	      });
	      continue;
	    }

	    // heading
	    if (cap = this.rules.heading.exec(src)) {
	      src = src.substring(cap[0].length);
	      this.tokens.push({
	        type: 'heading',
	        depth: cap[1].length,
	        text: cap[2]
	      });
	      continue;
	    }

	    // table no leading pipe (gfm)
	    if (top && (cap = this.rules.nptable.exec(src))) {
	      src = src.substring(cap[0].length);

	      item = {
	        type: 'table',
	        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
	        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
	        cells: cap[3].replace(/\n$/, '').split('\n')
	      };

	      for (i = 0; i < item.align.length; i++) {
	        if (/^ *-+: *$/.test(item.align[i])) {
	          item.align[i] = 'right';
	        } else if (/^ *:-+: *$/.test(item.align[i])) {
	          item.align[i] = 'center';
	        } else if (/^ *:-+ *$/.test(item.align[i])) {
	          item.align[i] = 'left';
	        } else {
	          item.align[i] = null;
	        }
	      }

	      for (i = 0; i < item.cells.length; i++) {
	        item.cells[i] = item.cells[i].split(/ *\| */);
	      }

	      this.tokens.push(item);

	      continue;
	    }

	    // lheading
	    if (cap = this.rules.lheading.exec(src)) {
	      src = src.substring(cap[0].length);
	      this.tokens.push({
	        type: 'heading',
	        depth: cap[2] === '=' ? 1 : 2,
	        text: cap[1]
	      });
	      continue;
	    }

	    // hr
	    if (cap = this.rules.hr.exec(src)) {
	      src = src.substring(cap[0].length);
	      this.tokens.push({
	        type: 'hr'
	      });
	      continue;
	    }

	    // blockquote
	    if (cap = this.rules.blockquote.exec(src)) {
	      src = src.substring(cap[0].length);

	      this.tokens.push({
	        type: 'blockquote_start'
	      });

	      cap = cap[0].replace(/^ *> ?/gm, '');

	      // Pass `top` to keep the current
	      // "toplevel" state. This is exactly
	      // how markdown.pl works.
	      this.token(cap, top, true);

	      this.tokens.push({
	        type: 'blockquote_end'
	      });

	      continue;
	    }

	    // list
	    if (cap = this.rules.list.exec(src)) {
	      src = src.substring(cap[0].length);
	      bull = cap[2];

	      this.tokens.push({
	        type: 'list_start',
	        ordered: bull.length > 1
	      });

	      // Get each top-level item.
	      cap = cap[0].match(this.rules.item);

	      next = false;
	      l = cap.length;
	      i = 0;

	      for (; i < l; i++) {
	        item = cap[i];

	        // Remove the list item's bullet
	        // so it is seen as the next token.
	        space = item.length;
	        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

	        // Outdent whatever the
	        // list item contains. Hacky.
	        if (~item.indexOf('\n ')) {
	          space -= item.length;
	          item = !this.options.pedantic
	            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
	            : item.replace(/^ {1,4}/gm, '');
	        }

	        // Determine whether the next list item belongs here.
	        // Backpedal if it does not belong in this list.
	        if (this.options.smartLists && i !== l - 1) {
	          b = block.bullet.exec(cap[i + 1])[0];
	          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
	            src = cap.slice(i + 1).join('\n') + src;
	            i = l - 1;
	          }
	        }

	        // Determine whether item is loose or not.
	        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
	        // for discount behavior.
	        loose = next || /\n\n(?!\s*$)/.test(item);
	        if (i !== l - 1) {
	          next = item.charAt(item.length - 1) === '\n';
	          if (!loose) loose = next;
	        }

	        this.tokens.push({
	          type: loose
	            ? 'loose_item_start'
	            : 'list_item_start'
	        });

	        // Recurse.
	        this.token(item, false, bq);

	        this.tokens.push({
	          type: 'list_item_end'
	        });
	      }

	      this.tokens.push({
	        type: 'list_end'
	      });

	      continue;
	    }

	    // html
	    if (cap = this.rules.html.exec(src)) {
	      src = src.substring(cap[0].length);
	      this.tokens.push({
	        type: this.options.sanitize
	          ? 'paragraph'
	          : 'html',
	        pre: !this.options.sanitizer
	          && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
	        text: cap[0]
	      });
	      continue;
	    }

	    // def
	    if ((!bq && top) && (cap = this.rules.def.exec(src))) {
	      src = src.substring(cap[0].length);
	      this.tokens.links[cap[1].toLowerCase()] = {
	        href: cap[2],
	        title: cap[3]
	      };
	      continue;
	    }

	    // table (gfm)
	    if (top && (cap = this.rules.table.exec(src))) {
	      src = src.substring(cap[0].length);

	      item = {
	        type: 'table',
	        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
	        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
	        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
	      };

	      for (i = 0; i < item.align.length; i++) {
	        if (/^ *-+: *$/.test(item.align[i])) {
	          item.align[i] = 'right';
	        } else if (/^ *:-+: *$/.test(item.align[i])) {
	          item.align[i] = 'center';
	        } else if (/^ *:-+ *$/.test(item.align[i])) {
	          item.align[i] = 'left';
	        } else {
	          item.align[i] = null;
	        }
	      }

	      for (i = 0; i < item.cells.length; i++) {
	        item.cells[i] = item.cells[i]
	          .replace(/^ *\| *| *\| *$/g, '')
	          .split(/ *\| */);
	      }

	      this.tokens.push(item);

	      continue;
	    }

	    // top-level paragraph
	    if (top && (cap = this.rules.paragraph.exec(src))) {
	      src = src.substring(cap[0].length);
	      this.tokens.push({
	        type: 'paragraph',
	        text: cap[1].charAt(cap[1].length - 1) === '\n'
	          ? cap[1].slice(0, -1)
	          : cap[1]
	      });
	      continue;
	    }

	    // text
	    if (cap = this.rules.text.exec(src)) {
	      // Top-level should never reach here.
	      src = src.substring(cap[0].length);
	      this.tokens.push({
	        type: 'text',
	        text: cap[0]
	      });
	      continue;
	    }

	    if (src) {
	      throw new
	        Error('Infinite loop on byte: ' + src.charCodeAt(0));
	    }
	  }

	  return this.tokens;
	};

	/**
	 * Inline-Level Grammar
	 */

	var inline = {
	  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
	  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
	  url: noop,
	  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
	  link: /^!?\[(inside)\]\(href\)/,
	  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
	  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
	  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
	  em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
	  code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
	  br: /^ {2,}\n(?!\s*$)/,
	  del: noop,
	  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
	};

	inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
	inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

	inline.link = replace(inline.link)
	  ('inside', inline._inside)
	  ('href', inline._href)
	  ();

	inline.reflink = replace(inline.reflink)
	  ('inside', inline._inside)
	  ();

	/**
	 * Normal Inline Grammar
	 */

	inline.normal = merge({}, inline);

	/**
	 * Pedantic Inline Grammar
	 */

	inline.pedantic = merge({}, inline.normal, {
	  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
	  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
	});

	/**
	 * GFM Inline Grammar
	 */

	inline.gfm = merge({}, inline.normal, {
	  escape: replace(inline.escape)('])', '~|])')(),
	  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
	  del: /^~~(?=\S)([\s\S]*?\S)~~/,
	  text: replace(inline.text)
	    (']|', '~]|')
	    ('|', '|https?://|')
	    ()
	});

	/**
	 * GFM + Line Breaks Inline Grammar
	 */

	inline.breaks = merge({}, inline.gfm, {
	  br: replace(inline.br)('{2,}', '*')(),
	  text: replace(inline.gfm.text)('{2,}', '*')()
	});

	/**
	 * Inline Lexer & Compiler
	 */

	function InlineLexer(links, options) {
	  this.options = options || marked.defaults;
	  this.links = links;
	  this.rules = inline.normal;
	  this.renderer = this.options.renderer || new Renderer;
	  this.renderer.options = this.options;

	  if (!this.links) {
	    throw new
	      Error('Tokens array requires a `links` property.');
	  }

	  if (this.options.gfm) {
	    if (this.options.breaks) {
	      this.rules = inline.breaks;
	    } else {
	      this.rules = inline.gfm;
	    }
	  } else if (this.options.pedantic) {
	    this.rules = inline.pedantic;
	  }
	}

	/**
	 * Expose Inline Rules
	 */

	InlineLexer.rules = inline;

	/**
	 * Static Lexing/Compiling Method
	 */

	InlineLexer.output = function(src, links, options) {
	  var inline = new InlineLexer(links, options);
	  return inline.output(src);
	};

	/**
	 * Lexing/Compiling
	 */

	InlineLexer.prototype.output = function(src) {
	  var out = ''
	    , link
	    , text
	    , href
	    , cap;

	  while (src) {
	    // escape
	    if (cap = this.rules.escape.exec(src)) {
	      src = src.substring(cap[0].length);
	      out += cap[1];
	      continue;
	    }

	    // autolink
	    if (cap = this.rules.autolink.exec(src)) {
	      src = src.substring(cap[0].length);
	      if (cap[2] === '@') {
	        text = cap[1].charAt(6) === ':'
	          ? this.mangle(cap[1].substring(7))
	          : this.mangle(cap[1]);
	        href = this.mangle('mailto:') + text;
	      } else {
	        text = escape(cap[1]);
	        href = text;
	      }
	      out += this.renderer.link(href, null, text);
	      continue;
	    }

	    // url (gfm)
	    if (!this.inLink && (cap = this.rules.url.exec(src))) {
	      src = src.substring(cap[0].length);
	      text = escape(cap[1]);
	      href = text;
	      out += this.renderer.link(href, null, text);
	      continue;
	    }

	    // tag
	    if (cap = this.rules.tag.exec(src)) {
	      if (!this.inLink && /^<a /i.test(cap[0])) {
	        this.inLink = true;
	      } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
	        this.inLink = false;
	      }
	      src = src.substring(cap[0].length);
	      out += this.options.sanitize
	        ? this.options.sanitizer
	          ? this.options.sanitizer(cap[0])
	          : escape(cap[0])
	        : cap[0]
	      continue;
	    }

	    // link
	    if (cap = this.rules.link.exec(src)) {
	      src = src.substring(cap[0].length);
	      this.inLink = true;
	      out += this.outputLink(cap, {
	        href: cap[2],
	        title: cap[3]
	      });
	      this.inLink = false;
	      continue;
	    }

	    // reflink, nolink
	    if ((cap = this.rules.reflink.exec(src))
	        || (cap = this.rules.nolink.exec(src))) {
	      src = src.substring(cap[0].length);
	      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
	      link = this.links[link.toLowerCase()];
	      if (!link || !link.href) {
	        out += cap[0].charAt(0);
	        src = cap[0].substring(1) + src;
	        continue;
	      }
	      this.inLink = true;
	      out += this.outputLink(cap, link);
	      this.inLink = false;
	      continue;
	    }

	    // strong
	    if (cap = this.rules.strong.exec(src)) {
	      src = src.substring(cap[0].length);
	      out += this.renderer.strong(this.output(cap[2] || cap[1]));
	      continue;
	    }

	    // em
	    if (cap = this.rules.em.exec(src)) {
	      src = src.substring(cap[0].length);
	      out += this.renderer.em(this.output(cap[2] || cap[1]));
	      continue;
	    }

	    // code
	    if (cap = this.rules.code.exec(src)) {
	      src = src.substring(cap[0].length);
	      out += this.renderer.codespan(escape(cap[2], true));
	      continue;
	    }

	    // br
	    if (cap = this.rules.br.exec(src)) {
	      src = src.substring(cap[0].length);
	      out += this.renderer.br();
	      continue;
	    }

	    // del (gfm)
	    if (cap = this.rules.del.exec(src)) {
	      src = src.substring(cap[0].length);
	      out += this.renderer.del(this.output(cap[1]));
	      continue;
	    }

	    // text
	    if (cap = this.rules.text.exec(src)) {
	      src = src.substring(cap[0].length);
	      out += this.renderer.text(escape(this.smartypants(cap[0])));
	      continue;
	    }

	    if (src) {
	      throw new
	        Error('Infinite loop on byte: ' + src.charCodeAt(0));
	    }
	  }

	  return out;
	};

	/**
	 * Compile Link
	 */

	InlineLexer.prototype.outputLink = function(cap, link) {
	  var href = escape(link.href)
	    , title = link.title ? escape(link.title) : null;

	  return cap[0].charAt(0) !== '!'
	    ? this.renderer.link(href, title, this.output(cap[1]))
	    : this.renderer.image(href, title, escape(cap[1]));
	};

	/**
	 * Smartypants Transformations
	 */

	InlineLexer.prototype.smartypants = function(text) {
	  if (!this.options.smartypants) return text;
	  return text
	    // em-dashes
	    .replace(/---/g, '\u2014')
	    // en-dashes
	    .replace(/--/g, '\u2013')
	    // opening singles
	    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
	    // closing singles & apostrophes
	    .replace(/'/g, '\u2019')
	    // opening doubles
	    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
	    // closing doubles
	    .replace(/"/g, '\u201d')
	    // ellipses
	    .replace(/\.{3}/g, '\u2026');
	};

	/**
	 * Mangle Links
	 */

	InlineLexer.prototype.mangle = function(text) {
	  if (!this.options.mangle) return text;
	  var out = ''
	    , l = text.length
	    , i = 0
	    , ch;

	  for (; i < l; i++) {
	    ch = text.charCodeAt(i);
	    if (Math.random() > 0.5) {
	      ch = 'x' + ch.toString(16);
	    }
	    out += '&#' + ch + ';';
	  }

	  return out;
	};

	/**
	 * Renderer
	 */

	function Renderer(options) {
	  this.options = options || {};
	}

	Renderer.prototype.code = function(code, lang, escaped) {
	  if (this.options.highlight) {
	    var out = this.options.highlight(code, lang);
	    if (out != null && out !== code) {
	      escaped = true;
	      code = out;
	    }
	  }

	  if (!lang) {
	    return '<pre><code>'
	      + (escaped ? code : escape(code, true))
	      + '\n</code></pre>';
	  }

	  return '<pre><code class="'
	    + this.options.langPrefix
	    + escape(lang, true)
	    + '">'
	    + (escaped ? code : escape(code, true))
	    + '\n</code></pre>\n';
	};

	Renderer.prototype.blockquote = function(quote) {
	  return '<blockquote>\n' + quote + '</blockquote>\n';
	};

	Renderer.prototype.html = function(html) {
	  return html;
	};

	Renderer.prototype.heading = function(text, level, raw) {
	  return '<h'
	    + level
	    + ' id="'
	    + this.options.headerPrefix
	    + raw.toLowerCase().replace(/[^\w]+/g, '-')
	    + '">'
	    + text
	    + '</h'
	    + level
	    + '>\n';
	};

	Renderer.prototype.hr = function() {
	  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
	};

	Renderer.prototype.list = function(body, ordered) {
	  var type = ordered ? 'ol' : 'ul';
	  return '<' + type + '>\n' + body + '</' + type + '>\n';
	};

	Renderer.prototype.listitem = function(text) {
	  return '<li>' + text + '</li>\n';
	};

	Renderer.prototype.paragraph = function(text) {
	  return '<p>' + text + '</p>\n';
	};

	Renderer.prototype.table = function(header, body) {
	  return '<table>\n'
	    + '<thead>\n'
	    + header
	    + '</thead>\n'
	    + '<tbody>\n'
	    + body
	    + '</tbody>\n'
	    + '</table>\n';
	};

	Renderer.prototype.tablerow = function(content) {
	  return '<tr>\n' + content + '</tr>\n';
	};

	Renderer.prototype.tablecell = function(content, flags) {
	  var type = flags.header ? 'th' : 'td';
	  var tag = flags.align
	    ? '<' + type + ' style="text-align:' + flags.align + '">'
	    : '<' + type + '>';
	  return tag + content + '</' + type + '>\n';
	};

	// span level renderer
	Renderer.prototype.strong = function(text) {
	  return '<strong>' + text + '</strong>';
	};

	Renderer.prototype.em = function(text) {
	  return '<em>' + text + '</em>';
	};

	Renderer.prototype.codespan = function(text) {
	  return '<code>' + text + '</code>';
	};

	Renderer.prototype.br = function() {
	  return this.options.xhtml ? '<br/>' : '<br>';
	};

	Renderer.prototype.del = function(text) {
	  return '<del>' + text + '</del>';
	};

	Renderer.prototype.link = function(href, title, text) {
	  if (this.options.sanitize) {
	    try {
	      var prot = decodeURIComponent(unescape(href))
	        .replace(/[^\w:]/g, '')
	        .toLowerCase();
	    } catch (e) {
	      return '';
	    }
	    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) {
	      return '';
	    }
	  }
	  var out = '<a href="' + href + '"';
	  if (title) {
	    out += ' title="' + title + '"';
	  }
	  out += '>' + text + '</a>';
	  return out;
	};

	Renderer.prototype.image = function(href, title, text) {
	  var out = '<img src="' + href + '" alt="' + text + '"';
	  if (title) {
	    out += ' title="' + title + '"';
	  }
	  out += this.options.xhtml ? '/>' : '>';
	  return out;
	};

	Renderer.prototype.text = function(text) {
	  return text;
	};

	/**
	 * Parsing & Compiling
	 */

	function Parser(options) {
	  this.tokens = [];
	  this.token = null;
	  this.options = options || marked.defaults;
	  this.options.renderer = this.options.renderer || new Renderer;
	  this.renderer = this.options.renderer;
	  this.renderer.options = this.options;
	}

	/**
	 * Static Parse Method
	 */

	Parser.parse = function(src, options, renderer) {
	  var parser = new Parser(options, renderer);
	  return parser.parse(src);
	};

	/**
	 * Parse Loop
	 */

	Parser.prototype.parse = function(src) {
	  this.inline = new InlineLexer(src.links, this.options, this.renderer);
	  this.tokens = src.reverse();

	  var out = '';
	  while (this.next()) {
	    out += this.tok();
	  }

	  return out;
	};

	/**
	 * Next Token
	 */

	Parser.prototype.next = function() {
	  return this.token = this.tokens.pop();
	};

	/**
	 * Preview Next Token
	 */

	Parser.prototype.peek = function() {
	  return this.tokens[this.tokens.length - 1] || 0;
	};

	/**
	 * Parse Text Tokens
	 */

	Parser.prototype.parseText = function() {
	  var body = this.token.text;

	  while (this.peek().type === 'text') {
	    body += '\n' + this.next().text;
	  }

	  return this.inline.output(body);
	};

	/**
	 * Parse Current Token
	 */

	Parser.prototype.tok = function() {
	  switch (this.token.type) {
	    case 'space': {
	      return '';
	    }
	    case 'hr': {
	      return this.renderer.hr();
	    }
	    case 'heading': {
	      return this.renderer.heading(
	        this.inline.output(this.token.text),
	        this.token.depth,
	        this.token.text);
	    }
	    case 'code': {
	      return this.renderer.code(this.token.text,
	        this.token.lang,
	        this.token.escaped);
	    }
	    case 'table': {
	      var header = ''
	        , body = ''
	        , i
	        , row
	        , cell
	        , flags
	        , j;

	      // header
	      cell = '';
	      for (i = 0; i < this.token.header.length; i++) {
	        flags = { header: true, align: this.token.align[i] };
	        cell += this.renderer.tablecell(
	          this.inline.output(this.token.header[i]),
	          { header: true, align: this.token.align[i] }
	        );
	      }
	      header += this.renderer.tablerow(cell);

	      for (i = 0; i < this.token.cells.length; i++) {
	        row = this.token.cells[i];

	        cell = '';
	        for (j = 0; j < row.length; j++) {
	          cell += this.renderer.tablecell(
	            this.inline.output(row[j]),
	            { header: false, align: this.token.align[j] }
	          );
	        }

	        body += this.renderer.tablerow(cell);
	      }
	      return this.renderer.table(header, body);
	    }
	    case 'blockquote_start': {
	      var body = '';

	      while (this.next().type !== 'blockquote_end') {
	        body += this.tok();
	      }

	      return this.renderer.blockquote(body);
	    }
	    case 'list_start': {
	      var body = ''
	        , ordered = this.token.ordered;

	      while (this.next().type !== 'list_end') {
	        body += this.tok();
	      }

	      return this.renderer.list(body, ordered);
	    }
	    case 'list_item_start': {
	      var body = '';

	      while (this.next().type !== 'list_item_end') {
	        body += this.token.type === 'text'
	          ? this.parseText()
	          : this.tok();
	      }

	      return this.renderer.listitem(body);
	    }
	    case 'loose_item_start': {
	      var body = '';

	      while (this.next().type !== 'list_item_end') {
	        body += this.tok();
	      }

	      return this.renderer.listitem(body);
	    }
	    case 'html': {
	      var html = !this.token.pre && !this.options.pedantic
	        ? this.inline.output(this.token.text)
	        : this.token.text;
	      return this.renderer.html(html);
	    }
	    case 'paragraph': {
	      return this.renderer.paragraph(this.inline.output(this.token.text));
	    }
	    case 'text': {
	      return this.renderer.paragraph(this.parseText());
	    }
	  }
	};

	/**
	 * Helpers
	 */

	function escape(html, encode) {
	  return html
	    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
	    .replace(/</g, '&lt;')
	    .replace(/>/g, '&gt;')
	    .replace(/"/g, '&quot;')
	    .replace(/'/g, '&#39;');
	}

	function unescape(html) {
		// explicitly match decimal, hex, and named HTML entities 
	  return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/g, function(_, n) {
	    n = n.toLowerCase();
	    if (n === 'colon') return ':';
	    if (n.charAt(0) === '#') {
	      return n.charAt(1) === 'x'
	        ? String.fromCharCode(parseInt(n.substring(2), 16))
	        : String.fromCharCode(+n.substring(1));
	    }
	    return '';
	  });
	}

	function replace(regex, opt) {
	  regex = regex.source;
	  opt = opt || '';
	  return function self(name, val) {
	    if (!name) return new RegExp(regex, opt);
	    val = val.source || val;
	    val = val.replace(/(^|[^\[])\^/g, '$1');
	    regex = regex.replace(name, val);
	    return self;
	  };
	}

	function noop() {}
	noop.exec = noop;

	function merge(obj) {
	  var i = 1
	    , target
	    , key;

	  for (; i < arguments.length; i++) {
	    target = arguments[i];
	    for (key in target) {
	      if (Object.prototype.hasOwnProperty.call(target, key)) {
	        obj[key] = target[key];
	      }
	    }
	  }

	  return obj;
	}


	/**
	 * Marked
	 */

	function marked(src, opt, callback) {
	  if (callback || typeof opt === 'function') {
	    if (!callback) {
	      callback = opt;
	      opt = null;
	    }

	    opt = merge({}, marked.defaults, opt || {});

	    var highlight = opt.highlight
	      , tokens
	      , pending
	      , i = 0;

	    try {
	      tokens = Lexer.lex(src, opt)
	    } catch (e) {
	      return callback(e);
	    }

	    pending = tokens.length;

	    var done = function(err) {
	      if (err) {
	        opt.highlight = highlight;
	        return callback(err);
	      }

	      var out;

	      try {
	        out = Parser.parse(tokens, opt);
	      } catch (e) {
	        err = e;
	      }

	      opt.highlight = highlight;

	      return err
	        ? callback(err)
	        : callback(null, out);
	    };

	    if (!highlight || highlight.length < 3) {
	      return done();
	    }

	    delete opt.highlight;

	    if (!pending) return done();

	    for (; i < tokens.length; i++) {
	      (function(token) {
	        if (token.type !== 'code') {
	          return --pending || done();
	        }
	        return highlight(token.text, token.lang, function(err, code) {
	          if (err) return done(err);
	          if (code == null || code === token.text) {
	            return --pending || done();
	          }
	          token.text = code;
	          token.escaped = true;
	          --pending || done();
	        });
	      })(tokens[i]);
	    }

	    return;
	  }
	  try {
	    if (opt) opt = merge({}, marked.defaults, opt);
	    return Parser.parse(Lexer.lex(src, opt), opt);
	  } catch (e) {
	    e.message += '\nPlease report this to https://github.com/chjj/marked.';
	    if ((opt || marked.defaults).silent) {
	      return '<p>An error occured:</p><pre>'
	        + escape(e.message + '', true)
	        + '</pre>';
	    }
	    throw e;
	  }
	}

	/**
	 * Options
	 */

	marked.options =
	marked.setOptions = function(opt) {
	  merge(marked.defaults, opt);
	  return marked;
	};

	marked.defaults = {
	  gfm: true,
	  tables: true,
	  breaks: false,
	  pedantic: false,
	  sanitize: false,
	  sanitizer: null,
	  mangle: true,
	  smartLists: false,
	  silent: false,
	  highlight: null,
	  langPrefix: 'lang-',
	  smartypants: false,
	  headerPrefix: '',
	  renderer: new Renderer,
	  xhtml: false
	};

	/**
	 * Expose
	 */

	marked.Parser = Parser;
	marked.parser = Parser.parse;

	marked.Renderer = Renderer;

	marked.Lexer = Lexer;
	marked.lexer = Lexer.lex;

	marked.InlineLexer = InlineLexer;
	marked.inlineLexer = InlineLexer.output;

	marked.parse = marked;

	if (true) {
	  module.exports = marked;
	} else if (typeof define === 'function' && define.amd) {
	  define(function() { return marked; });
	} else {
	  this.marked = marked;
	}

	}).call(function() {
	  return this || (typeof window !== 'undefined' ? window : global);
	}());

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 58 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var Tool = {};

	Tool.uploadImageSrc = function (filename, w, h) {
	  var query = '';
	  if (w && h) {
	    query = '?imageView2/1/w/' + w + '/h/' + h;
	  }
	  return 'http://7xnrrd.com1.z0.glb.clouddn.com/' + filename + query;
	};

	Tool.createImagePreviewUrl = function (origin, w, h) {
	  w = w || 40;
	  h = h || 40;
	  return origin + '?imageView2/1/w/' + w + '/h/' + h;
	};

	Tool.guid = function () {
	  function s4() {
	    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	  }
	  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	};

	Tool.htmlDecode = function (str) {
	  var s = "";
	  if (str.length == 0) return "";
	  s = str.replace(/&/g, "&amp;");
	  s = s.replace(/</g, "&lt;");
	  s = s.replace(/>/g, "&gt;");
	  s = s.replace(/ /g, "&nbsp;");
	  s = s.replace(/\'/g, "&#39;");
	  s = s.replace(/\"/g, "&quot;");
	  s = s.replace(/\n/g, "<br>");
	  return s;
	};

	Tool.htmlEncode = function (str) {
	  var s = "";
	  if (str.length == 0) return "";
	  s = str.replace(/&amp;/g, "&");
	  s = s.replace(/&lt;/g, "<");
	  s = s.replace(/&gt;/g, ">");
	  s = s.replace(/&nbsp;/g, " ");
	  s = s.replace(/&#39;/g, "\'");
	  s = s.replace(/&quot;/g, "\"");
	  s = s.replace(/<br>/g, "\n");
	  return s;
	};

	Tool.linkify = function (text) {
	  if (text) {
	    text = text.replace(/((https?\:\/\/)|(www\.))(\S+)(\w{2,4})(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi, function (url) {
	      var full_url = url;
	      if (!full_url.match('^https?:\/\/')) {
	        full_url = 'http://' + full_url;
	      }
	      return '<a  target="_blank" href="' + full_url + '">' + url + '</a>';
	    });
	  }
	  return text;
	};
	exports.default = Tool;

/***/ }),
/* 59 */
/***/ (function(module, exports) {

	module.exports = "\n  <div class=\"card\" @click.stop v-bind:class=\"{card__trash: task.istrash}\">\n    <div class=\"loader loader__hover\" v-show=\"isRequestingTaskDetail\" transition=\"animation-loader\">\n      <div class=\"loader-inner ball-clip-rotate-multiple\">\n        <div></div>\n        <div></div>\n      </div>\n    </div>\n    <div class=\"card-status card-status__archived\" v-if=\"task.archived && !task.istrash\">\n      该任务已经归档\n    </div>\n    <div class=\"card-status card-status__trash\" v-if=\"task.istrash\">\n      该任务已被删除，无法编辑\n    </div>\n    <div class=\"card-header\">\n      <input class=\"card-header--title card-header--input\" :value=\"task.title\" v-autoblur=\"isTitleEditing\" @focus=\"isTitleEditing = true\" @keyup.esc=\"doEditTitle\" @keyup.enter=\"doEditTitle\" :disabled=\"task.istrash\" />\n    </div>\n    <div class=\"card-body\">\n      <div class=\"card-metadata\">\n        <!--  标签 -->\n        <div class=\"card-metadata-item\">\n          <span class=\"material-icons card-metadata-item--icons\">label_outline</span>\n        </div>\n        <div class=\"card-metadata-item\">\n          <i class=\"material-icons card-metadata-item--icons\" data-tooltip=\"更新时间\">update</i>\n          <span class=\"card-metadata-item--content\">{{task.update_time}}</span>\n        </div>\n        <div class=\"card-metadata-item\">\n          <i class=\"material-icons card-metadata-item--icons\" data-tooltip=\"截止时间\">alarm</i>\n          <span class=\"card-metadata-item--content\">Due: {{task.deadline}}</span>\n        </div>\n        <div class=\"card-metadata-item\">\n          <span class=\"material-icons card-metadata-item--icons\">create</span>\n          <div class=\"card-metadata-item--content\" v-bind:class=\"{editing: isDescEditing}\" @dblclick=\"modifyDesc\">\n            <div class=\"content-value markdownPrased\">{{{descriptionMarked}}}</div>\n            <textarea class=\"content-input\" v-autofocus=\"isDescEditing\" @keyup.esc=\"doEditDesc\" @blur=\"doEditDesc\" v-model=\"task.description\"></textarea>\n          </div>\n        </div>\n        <!-- 子任务 -->\n<!--               <div class=\"card-subtasks\">\n          <ul>\n            <li></li>\n          </ul>\n          <div class=\"card-metadata-item\">\n            <span class=\"material-icons card-metadata-item--icons\">add</span>\n          </div>\n        </div> -->\n      </div>\n    </div>\n    <div class=\"card-footer\">\n      <span></span>\n      <div> 创建于：{{task.create_time}}</div>\n      <div class=\"card-footer--toolbar\">\n        <i class=\"material-icons\" @click=\"toggleTask(task)\" data-tooltip=\"归档\" data-tooltip-pos=\"down\" v-if=\"!task.archived\">archive</i>\n        <i class=\"material-icons\" @click=\"toggleTask(task)\" data-tooltip=\"取消归档\" data-tooltip-pos=\"down\" v-if=\"task.archived\">unarchive</i>\n        <i class=\"material-icons\" @click=\"deleteTask(task)\" v-if=\"task.istrash\" data-tooltip=\"彻底删除\">delete_forever</i>\n        <i class=\"material-icons\" @click=\"deleteTask(task)\" v-if=\"!task.istrash\" data-tooltip=\"删除\">delete</i>\n      </div>\n    </div>\n  </div>\n";

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	__webpack_require__(61)
	__vue_script__ = __webpack_require__(62)
	if (Object.keys(__vue_script__).some(function (key) { return key !== "default" && key !== "__esModule" })) {
	  console.warn("[vue-loader] app/src/components/Header.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(63)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
	if (__vue_template__) {
	__vue_options__.template = __vue_template__
	}
	if (!__vue_options__.computed) __vue_options__.computed = {}
	Object.keys(__vue_styles__).forEach(function (key) {
	var module = __vue_styles__[key]
	__vue_options__.computed[key] = function () { return module }
	})
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-6eea7b72/Header.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ }),
/* 61 */
11,
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getter = __webpack_require__(48);

	var getters = _interopRequireWildcard(_getter);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	exports.default = {
	  props: ['list'],
	  data: function data() {
	    return {
	      useRemoteAPI: window.localStorage.apiurl === 'http://zhanglun.daoapp.io/api' ? true : false
	    };
	  },

	  vuex: {
	    actions: {},
	    getters: {}
	  },
	  ready: function ready() {},

	  methods: {}

	};

	// </script>
	// <style lang="less">
	//   @import '../public/stylesheets/variables';
	//
	//   .main-header{
	//     display: flex;
	//     box-sizing: border-box;
	//     flex: 1 0 45px;
	//     max-height: 45px;
	//     width: 100%;
	//     padding: 0 14px;
	//     background: #ffc952;
	//     box-shadow: 0 1px 2px rgba(0,0,0,0.05);
	//     align-items: center;
	//     justify-content: space-between;
	//   }
	//   .header-toolbar {
	//     &__title{
	//       font-size: 20px;
	//       color: #fff;
	//     }
	//   }
	// </style>
	// <template>
	//   <div class="main-header header-toolbar">
	//     <div class="header-toolbar__title">
	//       {{list.name}}
	//     </div>
	//   </div>
	// </template>
	//
	// <script>

/***/ }),
/* 63 */
/***/ (function(module, exports) {

	module.exports = "\n<div class=\"main-header header-toolbar\">\n  <div class=\"header-toolbar__title\">\n    {{list.name}}\n  </div>\n</div>\n";

/***/ }),
/* 64 */
/***/ (function(module, exports) {

	module.exports = "\n<side-container></side-container>\n<div class=\"main\">\n  <router-view></router-view>\n</div>\n<task-detail v-if=\"show\" transition=\"animation-showtaskdetail\"></task-detail>\n";

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	__vue_script__ = __webpack_require__(66)
	if (Object.keys(__vue_script__).some(function (key) { return key !== "default" && key !== "__esModule" })) {
	  console.warn("[vue-loader] app/src/components/Index.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(67)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
	if (__vue_template__) {
	__vue_options__.template = __vue_template__
	}
	if (!__vue_options__.computed) __vue_options__.computed = {}
	Object.keys(__vue_styles__).forEach(function (key) {
	var module = __vue_styles__[key]
	__vue_options__.computed[key] = function () { return module }
	})
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-1488ea88/Index.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _vue = __webpack_require__(6);

	var _vue2 = _interopRequireDefault(_vue);

	var _store = __webpack_require__(14);

	var _store2 = _interopRequireDefault(_store);

	var _user = __webpack_require__(39);

	var userActions = _interopRequireWildcard(_user);

	var _getter = __webpack_require__(48);

	var getters = _interopRequireWildcard(_getter);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// <template>
	//   <div class="app">
	//     <router-view ></router-view>
	//   </div>
	// </template>
	//
	// <script>
	exports.default = {
	  vuex: {
	    actions: {
	      authenticate: userActions.authenticate
	    },
	    getters: {
	      user: getters.getUserInfo,
	      lists: getters.getLists
	    }
	  },
	  data: function data() {
	    return {
	      msg: 'Hello from BlueRobin',
	      finished: false
	    };
	  },

	  computed: {},
	  created: function created() {
	    // this.authenticate((user) => {
	    //   if (!user) {
	    // this.$router.push('/login');
	    // }
	    // });
	  },
	  ready: function ready() {},

	  methods: {},
	  store: _store2.default
	};
	// </script>

/***/ }),
/* 67 */
/***/ (function(module, exports) {

	module.exports = "\n<div class=\"app\">\n  <router-view ></router-view>\n</div>\n";

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	__webpack_require__(69)
	__vue_script__ = __webpack_require__(70)
	if (Object.keys(__vue_script__).some(function (key) { return key !== "default" && key !== "__esModule" })) {
	  console.warn("[vue-loader] app/src/components/mainContainer.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(81)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
	if (__vue_template__) {
	__vue_options__.template = __vue_template__
	}
	if (!__vue_options__.computed) __vue_options__.computed = {}
	Object.keys(__vue_styles__).forEach(function (key) {
	var module = __vue_styles__[key]
	__vue_options__.computed[key] = function () { return module }
	})
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-b93940c4/mainContainer.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ }),
/* 69 */
11,
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _Header = __webpack_require__(60);

	var _Header2 = _interopRequireDefault(_Header);

	var _TaskItem = __webpack_require__(71);

	var _TaskItem2 = _interopRequireDefault(_TaskItem);

	var _AddItem = __webpack_require__(75);

	var _AddItem2 = _interopRequireDefault(_AddItem);

	var _tasks = __webpack_require__(56);

	var tasksActions = _interopRequireWildcard(_tasks);

	var _getter = __webpack_require__(48);

	var getters = _interopRequireWildcard(_getter);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  route: {
	    data: function data(transition) {
	      var query = {};
	      var id = this.$route.params.id;
	      switch (id) {
	        case 'archive':
	          {
	            query = {
	              archived: true,
	              sort: 'desc',
	              order: 'update_time'
	            };
	            this.isCollection = true;
	            break;
	          };
	        case 'trash':
	          {
	            query = {
	              istrash: true,
	              sort: 'desc',
	              order: 'update_time'
	            };
	            this.isCollection = true;
	            break;
	          };
	        case 'search':
	          {
	            break;
	          };
	        default:
	          {
	            this.list_id = id;
	            this.showInputer = true;
	            query = {
	              list_id: this.list_id,
	              archived: false,
	              sort: 'desc',
	              order: 'create_time',
	              istrash: false
	            };

	            break;
	          }
	      }
	      this.fetchTasks(query);
	      transition.next();
	    },
	    activate: function activate(transition) {
	      // 每次切换路由时
	      var id = this.$route.params.id;
	      if (id == 'archive') {
	        this.currentList = {
	          name: '归档'
	        };
	      } else if (id == 'trash') {
	        this.currentList = {
	          name: '回收站'
	        };
	      } else {
	        this.currentList = this.lists.filter(function (list) {
	          return list.id === id;
	        })[0];
	      }
	      transition.next();
	    },
	    deactivate: function deactivate(transition) {
	      transition.next();
	    },
	    canDeactivate: function canDeactivate() {
	      return true;
	    },
	    canReuse: function canReuse() {
	      return false;
	    }
	  },
	  vuex: {
	    actions: {
	      fetchTasks: tasksActions.fetchTasks,
	      resetTasks: tasksActions.resetTasks },
	    getters: {
	      tasks: getters.getTasks,
	      isRequestingTasks: getters.isRequestingTasks,
	      auth: getters.getUserAuth,
	      lists: getters.getLists

	    }
	  },
	  computed: {
	    tasklist: function tasklist() {
	      var _this = this;

	      var result = null;
	      var id = this.$route.params.id;
	      if (id == 'archive') {
	        result = this.tasks.filter(function (task) {
	          return task.archived && !task.istrash;
	        });
	      } else if (id == 'trash') {
	        result = this.tasks.filter(function (task) {
	          return task.istrash;
	        });
	      } else {
	        result = this.tasks.filter(function (item) {
	          return item.list_id === _this.list_id && !item.archived;
	        });
	      }
	      result.sort(function (a, b) {
	        if (a.list_name > b.list_name) {
	          return 1;
	        } else if (a.list_name < b.list_name) {
	          return -1;
	        } else {
	          return 0;
	        }
	      });
	      return result;
	    },
	    archivedTasklist: function archivedTasklist() {
	      var _this2 = this;

	      return this.tasks.filter(function (item) {
	        return item.list_id === _this2.list_id && item.archived;
	      });
	    }
	  },
	  data: function data() {
	    return {
	      list_id: '',
	      showArchived: false,
	      showInputer: false,
	      loaded: false,
	      currentList: {}
	    };
	  },

	  watch: {
	    auth: function auth(val) {
	      if (!val) {
	        this.$router.go('/login');
	      }
	    },
	    lists: function lists() {
	      var currentListId = this.$route.params.id;
	      if (currentListId == 'archive') {
	        this.currentList = {
	          name: '归档'
	        };
	      } else if (currentListId == 'archive') {
	        this.currentList = {
	          name: '回收站'
	        };
	      } else {
	        this.currentList = this.lists.filter(function (list) {
	          return list.id === currentListId;
	        })[0];
	      }
	    }
	  },
	  created: function created() {},
	  ready: function ready() {

	    this.resetTasks();
	  },

	  components: {
	    'main-header': _Header2.default,
	    'add-item': _AddItem2.default,
	    'task-item': _TaskItem2.default
	  },
	  methods: {
	    'loadArchivedTask': function loadArchivedTask() {
	      var _this3 = this;

	      var param = {
	        list_id: this.list_id,
	        archived: true,
	        sort: 'update_time',
	        order: 'desc'
	      };
	      this.fetchTasks(param, function () {
	        _this3.loaded = true;
	      });
	    },
	    'toggleShowArchivedTask': function toggleShowArchivedTask() {
	      if (!this.loaded) {
	        this.loadArchivedTask();
	      }
	      this.$data.showArchived = !this.$data.showArchived;
	    }
	  }
	};
	// </script>
	// <style lang="less">
	//   @import '../public/stylesheets/variables';
	//
	//   @labelTriggerBg: #d8d8d8;
	//
	//   .main-body {
	//     padding: 14px;
	//     width: 100%;
	//     min-height: 100%;
	//     overflow-y: auto;
	//     box-sizing: border-box;
	//     flex: 1 1 auto;
	//     overflow-y: auto;
	//   }
	//   .tasklist {
	//     display: flex;
	//     flex-wrap: wrap;
	//     justify-content: space-between;
	//   }
	//   .label-trigger {
	//     display: inline-block;
	//     margin: 10px 0;
	//     padding: 4px 8px;
	//     background: fade(@labelTriggerBg, 80%);
	//     cursor: pointer;
	//     &:hover{
	//       background: @labelTriggerBg;
	//     }
	//   }
	// </style>
	// <template>
	//   <main-header :list="currentList"></main-header>
	//   <div class="main-body" >
	//     <add-item :listid="listId" v-show="showInputer"></add-item>
	//     <div class="tasklist">
	//       <task-item v-for="task in tasklist" :task="task" :index="$index" track-by="id" :iscollection='isCollection'></task-item>
	//     </div>
	//     <div class="label-trigger" @click="toggleShowArchivedTask"  v-show="showInputer">
	//       显示已经归档的任务
	//     </div>
	//     <div class="loader" v-show="isRequestingTasks">
	//       <div class="loader-inner ball-clip-rotate-multiple">
	//         <div></div>
	//         <div></div>
	//       </div>
	//     </div>
	//     <div class="tasklist--finished" transition="animation_showtask" v-show="showArchived">
	//       <task-item v-for="task in archivedTasklist" :task="task" :index="$index" track-by="id"></task-item>
	//     </div>
	//
	//   </div>
	// </template>
	// <script>

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	__webpack_require__(72)
	__vue_script__ = __webpack_require__(73)
	if (Object.keys(__vue_script__).some(function (key) { return key !== "default" && key !== "__esModule" })) {
	  console.warn("[vue-loader] app/src/components/TaskItem.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(74)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
	if (__vue_template__) {
	__vue_options__.template = __vue_template__
	}
	if (!__vue_options__.computed) __vue_options__.computed = {}
	Object.keys(__vue_styles__).forEach(function (key) {
	var module = __vue_styles__[key]
	__vue_options__.computed[key] = function () { return module }
	})
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-7f148bf2/TaskItem.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ }),
/* 72 */
11,
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _tasks = __webpack_require__(56);

	var tasksActions = _interopRequireWildcard(_tasks);

	var _getter = __webpack_require__(48);

	var getters = _interopRequireWildcard(_getter);

	var _tool = __webpack_require__(58);

	var _tool2 = _interopRequireDefault(_tool);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	exports.default = {
	  props: ['iscollection', 'task', 'index'],
	  data: function data() {
	    return {
	      editing: false,
	      titleAfterParse: '',
	      taskEditing: null,
	      taskDetail: {}
	    };
	  },

	  vuex: {
	    actions: {
	      toggle: tasksActions.toggleTask,
	      delete: tasksActions.deleteTask,
	      edit: tasksActions.editTask,
	      fetchDetail: tasksActions.fetchTaskDetail
	    },
	    getters: {}
	  },
	  computed: {
	    titleAfterParse: function titleAfterParse() {
	      return _tool2.default.linkify(this.task.title);
	    }
	  },
	  ready: function ready() {},


	  directives: {
	    'task-autofocus': function taskAutofocus(value) {
	      if (!value) {
	        return;
	      }
	      var el = this.el;
	      setTimeout(function () {
	        el.focus();
	      }, 0);
	    }
	  },
	  methods: {
	    toggleTask: function toggleTask() {
	      this.task.archived = !this.task.archived;
	      this.toggle(this.task.id, { archived: this.task.archived });
	    },
	    modifyTask: function modifyTask(task) {
	      if (task.archived) {
	        return false;
	      }
	      this.taskEditing = task;
	    },
	    showTaskDetail: function showTaskDetail(task) {
	      if (!this.istrash) {
	        this.fetchDetail(task.id);
	      }
	    },
	    deleteTask: function deleteTask(task) {
	      this.delete(task);
	    },
	    undoTask: function undoTask(task) {
	      var param = {
	        istrash: false
	      };
	      this.edit(task.id, param);
	      task.istrash = false;
	    }
	  }
	};
	// </script>
	//
	// <style lang="less">
	//
	//   @import '../public/stylesheets/variables';
	//
	//   @editbox-height: 34px;
	//
	//   .modify {
	//     width: 100%;
	//     box-sizing: border-box;
	//     line-height: @editbox-height;
	//     height: @editbox-height;
	//     padding: 0 4px;
	//   }
	//   .task {
	//     width: 100%;
	//     height: 46px;
	//     box-sizing: border-box;
	//     font-size: 1.4rem;
	//     color: #343434;
	//     background: fade(@white, 85%);
	//     border-bottom: 1px solid #DCDCDC;
	//     display: flex;
	//     flex-direction: row;
	//     align-items: center;
	//     position: relative;
	//     &:hover {
	//       background: fade(#000, 10%)
	//     }
	//     &.archived {
	//       .task-content {
	//         cursor: default;
	//         text-decoration: line-through;
	//         color: lighten(#343434, 40%);
	//       }
	//     }
	//
	//     &.editing {
	//       .task-content {
	//         &-box {
	//           display: none;
	//         }
	//         &-input {
	//           display: block;
	//         }
	//       }
	//     }
	//     &:hover {
	//       .task-toolbar {
	//         display: block;
	//       }
	//     }
	//   }
	//   .task-content {
	//     flex: 1 1 auto;
	//     overflow: hidden;
	//     margin-right: 6rem;
	//     padding: 12px;
	//     cursor: pointer;
	//     &-input {
	//       display: none;
	//       width: 100%;
	//       box-sizing: border-box;
	//     }
	//     &-box {
	//       line-height: 20px;
	//       white-space: nowrap;
	//       overflow: hidden;
	//       text-overflow: ellipsis;
	//     }
	//   }
	//   .task-toolbar {
	//     display: none;
	//     font-size: 0;
	//     position: absolute;
	//     right: 8px;
	//     top: 30%;
	//     &--icons {
	//       margin:0 2px;
	//       cursor: pointer;
	//       transition: all 0.3 ease-in-out 0s;
	//       color: fadeout(#000, 30%);
	//       &:hover{
	//         color: #000;
	//       }
	//     }
	//   }
	//
	//   .collection-item{
	//     width: 100%;
	//     height: 46px;
	//     box-sizing: border-box;
	//     font-size: 1.4rem;
	//     color: #343434;
	//     background: fade(@white, 85%);
	//     border-bottom: 1px solid #DCDCDC;
	//     display: flex;
	//     flex-direction: row;
	//     align-items: center;
	//     position: relative;
	//     box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.1);
	//     &.archived {
	//       font-size: 12px;
	//       .task-content {
	//         cursor: default;
	//         text-decoration: line-through;
	//         color: lighten(#343434, 40%);
	//       }
	//     }
	//     &:hover {
	//       .task-toolbar {
	//         visibility: visible;
	//         display: flex;
	//       }
	//     }
	//     .task-content {
	//       padding: 12px;
	//       margin: 0;
	//       box-sizing: border-box;
	//     }
	//     .task-labels {
	//       padding: 2px 12px;
	//       box-sizing: border-box;
	//
	//       &--item{
	//         padding: 4px 6px;
	//         border-radius: 2px;
	//         font-size: 12px;
	//         background-color: #ff7473;
	//         color: #fff;
	//       }
	//     }
	//     .task-metadata {
	//       padding: 6px 10px;
	//       &--item {
	//         display: inline-block;
	//       }
	//     }
	//     .task-toolbar {
	//       visibility: hidden;
	//       display: flex;
	//       position: static;
	//       padding: 2px 6px 6px;
	//       box-sizing: border-box;
	//       font-size: 0;
	//       line-height: normal;
	//       align-items: center;
	//       justify-content: flex-end;
	//       &--icons {
	//         margin: 0 2px;
	//         cursor: pointer;
	//         color: fadeout(#000, 30%);
	//         &:hover{
	//           color: #000;
	//         }
	//       }
	//     }
	//   }
	//
	//
	// /*
	//   Task item animation
	//   */
	//   .animation_showtask-transition {
	//     transition: all 0.5s ease;
	//   }
	//   .animation_showtask {
	//     &-enter {
	//       opacity: 0;
	//       // transform: rotateX(180deg);
	//     }
	//     &-leave {
	//       opacity: 0;
	//       // transform: rotateX(180deg);
	//       transition: all 0.5s cubic-bezier(0.55,0,0.1,1);
	//     }
	//   }
	// </style>
	// <template>
	//   <div transition="animation_showtask" v-bind:class="{archived: task.archived, editing: task == taskEditing, 'collection-item': iscollection, 'task': !iscollection}" @click="showTaskDetail(task)">
	//     <div class="task-content">
	//       <div class="task-content-box" v-html="titleAfterParse"></div>
	//     </div>
	//     <div class="task-labels" v-if="iscollection">
	//       <span class="task-labels--item">{{task.list_name}}</span>
	//     </div>
	//     <div class="task-toolbar" @click.stop>
	//       <i class="material-icons task-toolbar--icons" @click="toggleTask(task)" data-tooltip="归档" v-if="!task.archived && !task.istrash">archive</i>
	//       <i class="material-icons task-toolbar--icons" @click="toggleTask(task)" data-tooltip="取消归档" v-if="task.archived && !task.istrash">unarchive</i>
	//       <i class="material-icons task-toolbar--icons" v-if="task.istrash" data-tooltip="还原" @click="undoTask(task)">undo</i>
	//       <i class="material-icons task-toolbar--icons" @click="deleteTask(task)" v-if="task.istrash" data-tooltip="彻底删除">delete_forever</i>
	//       <i class="material-icons task-toolbar--icons" @click="deleteTask(task)" v-if="!task.istrash" data-tooltip="删除">delete</i>
	//     </span>
	//
	//   </div>
	// </template>
	// <script>

/***/ }),
/* 74 */
/***/ (function(module, exports) {

	module.exports = "\n<div transition=\"animation_showtask\" v-bind:class=\"{archived: task.archived, editing: task == taskEditing, 'collection-item': iscollection, 'task': !iscollection}\" @click=\"showTaskDetail(task)\">\n  <div class=\"task-content\">\n    <div class=\"task-content-box\" v-html=\"titleAfterParse\"></div>\n  </div>\n  <div class=\"task-labels\" v-if=\"iscollection\">\n    <span class=\"task-labels--item\">{{task.list_name}}</span>\n  </div>\n  <div class=\"task-toolbar\" @click.stop>\n    <i class=\"material-icons task-toolbar--icons\" @click=\"toggleTask(task)\" data-tooltip=\"归档\" v-if=\"!task.archived && !task.istrash\">archive</i>\n    <i class=\"material-icons task-toolbar--icons\" @click=\"toggleTask(task)\" data-tooltip=\"取消归档\" v-if=\"task.archived && !task.istrash\">unarchive</i>\n    <i class=\"material-icons task-toolbar--icons\" v-if=\"task.istrash\" data-tooltip=\"还原\" @click=\"undoTask(task)\">undo</i>\n    <i class=\"material-icons task-toolbar--icons\" @click=\"deleteTask(task)\" v-if=\"task.istrash\" data-tooltip=\"彻底删除\">delete_forever</i>\n    <i class=\"material-icons task-toolbar--icons\" @click=\"deleteTask(task)\" v-if=\"!task.istrash\" data-tooltip=\"删除\">delete</i>\n  </span>\n\n</div>\n";

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	__webpack_require__(76)
	__vue_script__ = __webpack_require__(77)
	if (Object.keys(__vue_script__).some(function (key) { return key !== "default" && key !== "__esModule" })) {
	  console.warn("[vue-loader] app/src/components/AddItem.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(80)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
	if (__vue_template__) {
	__vue_options__.template = __vue_template__
	}
	if (!__vue_options__.computed) __vue_options__.computed = {}
	Object.keys(__vue_styles__).forEach(function (key) {
	var module = __vue_styles__[key]
	__vue_options__.computed[key] = function () { return module }
	})
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-10f6508a/AddItem.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ }),
/* 76 */
11,
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _stringify = __webpack_require__(78);

	var _stringify2 = _interopRequireDefault(_stringify);

	var _tasks = __webpack_require__(56);

	var taskActions = _interopRequireWildcard(_tasks);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  data: function data() {
	    return {
	      list_id: '',
	      newTask: {
	        title: '',
	        list_id: '',
	        create_time: '',
	        attachments: []
	      }
	    };
	  },

	  vuex: {
	    actions: {
	      addTask: taskActions.addTask
	    }
	  },
	  watch: {
	    'newTask.title': function newTaskTitle() {
	      localStorage.newTask = (0, _stringify2.default)(this.newTask);
	    }
	  },
	  ready: function ready() {
	    this.list_id = this.$route.params.id;
	    this.newTask = window.localStorage.newTask ? JSON.parse(localStorage.newTask) : {};
	  },


	  methods: {
	    // 创建任务
	    createTask: function createTask(listid) {
	      if (!this.newTask.title) {
	        return false;
	      }

	      this.$set('newTask.create_time', new Date());
	      this.$set('newTask.list_id', listid);

	      this.addTask(this.newTask);

	      this.$set('newTask', {
	        title: '',
	        create_time: '',
	        attachments: []
	      });
	    }
	  }

	};

	// </script>
	//
	// <style lang="less">
	//
	// @import '../public/stylesheets/variables';
	//
	// .modal.bottom-sheet{
	//   max-height: 60%;
	// }
	//
	// .task-textfield{
	//   width: 100%;
	//   background: #fff;
	//   margin-bottom: 10px;
	//   box-sizing: border-box;
	//   &--input{
	//     width: 100%;
	//     height: 46px;
	//     font-size: 15px;
	//     padding: 6px 10px;
	//     box-sizing: border-box;
	//     border: none;
	//     outline: none;
	//     &:focus{
	//       box-shadow: 0 0 5px #ABABAB;
	//     }
	//   }
	// }
	//
	// </style>
	// <template>
	//     <div class="task-textfield">
	//       <input class="task-textfield--input" type="text" v-model="newTask.title" @keyup.enter="createTask(list_id)" placeholder="添加任务...">
	//     </div>
	// </template>
	//
	// <script>

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(79), __esModule: true };

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

	var core  = __webpack_require__(23)
	  , $JSON = core.JSON || (core.JSON = {stringify: JSON.stringify});
	module.exports = function stringify(it){ // eslint-disable-line no-unused-vars
	  return $JSON.stringify.apply($JSON, arguments);
	};

/***/ }),
/* 80 */
/***/ (function(module, exports) {

	module.exports = "\n<div class=\"task-textfield\">\n  <input class=\"task-textfield--input\" type=\"text\" v-model=\"newTask.title\" @keyup.enter=\"createTask(list_id)\" placeholder=\"添加任务...\">\n</div>\n";

/***/ }),
/* 81 */
/***/ (function(module, exports) {

	module.exports = "\n<main-header :list=\"currentList\"></main-header>\n<div class=\"main-body\" >\n  <add-item :listid=\"listId\" v-show=\"showInputer\"></add-item>\n  <div class=\"tasklist\">\n    <task-item v-for=\"task in tasklist\" :task=\"task\" :index=\"$index\" track-by=\"id\" :iscollection='isCollection'></task-item>\n  </div>\n  <div class=\"label-trigger\" @click=\"toggleShowArchivedTask\"  v-show=\"showInputer\">\n    显示已经归档的任务\n  </div>\n  <div class=\"loader\" v-show=\"isRequestingTasks\">\n    <div class=\"loader-inner ball-clip-rotate-multiple\">\n      <div></div>\n      <div></div>\n    </div>\n  </div>\n  <div class=\"tasklist--finished\" transition=\"animation_showtask\" v-show=\"showArchived\">\n    <task-item v-for=\"task in archivedTasklist\" :task=\"task\" :index=\"$index\" track-by=\"id\"></task-item>\n  </div>\n\n</div>\n";

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	__webpack_require__(83)
	__vue_script__ = __webpack_require__(84)
	if (Object.keys(__vue_script__).some(function (key) { return key !== "default" && key !== "__esModule" })) {
	  console.warn("[vue-loader] app/src/components/user/login.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(85)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
	if (__vue_template__) {
	__vue_options__.template = __vue_template__
	}
	if (!__vue_options__.computed) __vue_options__.computed = {}
	Object.keys(__vue_styles__).forEach(function (key) {
	var module = __vue_styles__[key]
	__vue_options__.computed[key] = function () { return module }
	})
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-596342bf/login.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ }),
/* 83 */
11,
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _user = __webpack_require__(39);

	var userActions = _interopRequireWildcard(_user);

	var _getter = __webpack_require__(48);

	var getters = _interopRequireWildcard(_getter);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	// <template>
	//   <div class="custom-container login-form" transition="animate_routerview">
	//     <div class="mdl-grid">
	//       <div class="mdl-cell mdl-cell-6-col">
	//         <h3>登录</h3>
	//       </div>
	//     </div>
	//     <div class="mdl-grid">
	//       <div class="mdl-cell mdl-cell-6-col">
	//         <div class="robin-textfield">
	//           <label class="" for="email">Email</label>
	//           <input class="robin-textfield--input robin-textfield--input_default" type="text" id="email" v-model="account.username">
	//         </div>
	//       </div>
	//     </div>
	//     <div class="mdl-cell mdl-cell-6-col">
	//       <div class="mdl-textfield mdl-js-textfield">
	//         <label class="mdl-textfield__label" for="password">Password</label>
	//         <input class="robin-textfield--input robin-textfield--input_default" type="password" id="password" v-model="account.password">
	//       </div>
	//     </div>
	//     <div class="mdl-cell mdl-cell-6-col">
	//       <div class="robin-textfield">
	//         <button class="robin-btn robin-btn__default"  v-on:click="doLogin">GO!</button>
	//         <a v-link="{path: '/signup', exact: true}">还没有账号？立马注册</a>
	//       </div>
	//     </div>
	//   </div>
	// </div>
	// </template>
	// <script>
	exports.default = {
	  data: function data() {
	    return {
	      account: {
	        username: '',
	        password: ''
	      }
	    };
	  },

	  vuex: {
	    actions: {
	      login: userActions.login
	    },
	    getters: {
	      user: getters.getUserInfo
	    }
	  },
	  ready: function ready() {},

	  watch: {
	    user: function user(newVal, old) {
	      if (!newVal) {
	        this.$router.go('login');
	      }
	      if (newVal && newVal.username) {
	        this.$router.go('lists');
	      }
	    }
	  },
	  methods: {
	    doLogin: function doLogin() {
	      this.login(this.account);
	    }
	  }
	};
	// </script>
	// <style lang="less">
	//  .login-form {
	//   width:400px;
	//   padding:14px;
	//   box-sizing: border-box;
	//   margin: 120px auto;
	//   background: rgba(255,255,255,0.8);
	//  }
	// </style>

/***/ }),
/* 85 */
/***/ (function(module, exports) {

	module.exports = "\n  <div class=\"custom-container login-form\" transition=\"animate_routerview\">\n    <div class=\"mdl-grid\">\n      <div class=\"mdl-cell mdl-cell-6-col\">\n        <h3>登录</h3>\n      </div>\n    </div>\n    <div class=\"mdl-grid\">\n      <div class=\"mdl-cell mdl-cell-6-col\">\n        <div class=\"robin-textfield\">\n          <label class=\"\" for=\"email\">Email</label>\n          <input class=\"robin-textfield--input robin-textfield--input_default\" type=\"text\" id=\"email\" v-model=\"account.username\">\n        </div>\n      </div>\n    </div>\n    <div class=\"mdl-cell mdl-cell-6-col\">\n      <div class=\"mdl-textfield mdl-js-textfield\">\n        <label class=\"mdl-textfield__label\" for=\"password\">Password</label>\n        <input class=\"robin-textfield--input robin-textfield--input_default\" type=\"password\" id=\"password\" v-model=\"account.password\">\n      </div>\n    </div>\n    <div class=\"mdl-cell mdl-cell-6-col\">\n      <div class=\"robin-textfield\">\n        <button class=\"robin-btn robin-btn__default\"  v-on:click=\"doLogin\">GO!</button>\n        <a v-link=\"{path: '/signup', exact: true}\">还没有账号？立马注册</a>\n      </div>\n    </div>\n  </div>\n</div>\n";

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	var __vue_styles__ = {}
	__vue_script__ = __webpack_require__(87)
	if (Object.keys(__vue_script__).some(function (key) { return key !== "default" && key !== "__esModule" })) {
	  console.warn("[vue-loader] app/src/components/user/signup.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(88)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	var __vue_options__ = typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports
	if (__vue_template__) {
	__vue_options__.template = __vue_template__
	}
	if (!__vue_options__.computed) __vue_options__.computed = {}
	Object.keys(__vue_styles__).forEach(function (key) {
	var module = __vue_styles__[key]
	__vue_options__.computed[key] = function () { return module }
	})
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "_v-1f5f0232/signup.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ }),
/* 87 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	// <template>
	//   <div class="custom-container login-form" transition="animate_routerview">
	//     <div class="mdl-grid">
	//       <div class="mdl-cell mdl-cell-6-col">
	//         <h3>注册</h3>
	//       </div>
	//       <div class="robin-textfield">
	//         <label class="mdl-textfield__label" for="email">邮箱</label>
	//         <input class="robin-textfield--input robin-textfield--input_default" type="text" id="email" v-model="registerData.email"/>
	//       </div>
	//       <div class="robin-textfield">
	//         <label class="mdl-textfield__label" for="password">密码</label>
	//         <input class="robin-textfield--input robin-textfield--input_default" type="password" id="password" v-model="registerData.password"/>
	//       </div>
	//       <div class="robin-textfield">
	//         <button class="robin-btn robin-btn__default" v-on:click="signUp()">注册</button>
	//         <a v-link="'login'">已有账号？直接登录</a>
	//       </div>
	//     </div>
	//   </div>
	// </template>
	// <script>
	exports.default = {
	  data: function data() {
	    return {
	      registerData: {
	        email: '',
	        password: ''
	      }
	    };
	  },
	  ready: function ready() {
	    console.log('sign up --->');
	  },


	  methods: {
	    signUp: function signUp() {
	      var vm = this;
	      var data = this.$data.registerData;
	      vm.$http.post('http://zhanglun.daoapp.io/api/users/signup', data)
	      // vm.$http.post('http://localhost:1234/api/users/signup', data)
	      .then(function (res) {
	        localStorage.token = res.body.token;
	        vm.$router.go('/');
	      }, function (err) {
	        console.log(err);
	      });
	    }
	  }
	};
	// </script>

/***/ }),
/* 88 */
/***/ (function(module, exports) {

	module.exports = "\n<div class=\"custom-container login-form\" transition=\"animate_routerview\">\n  <div class=\"mdl-grid\">\n    <div class=\"mdl-cell mdl-cell-6-col\">\n      <h3>注册</h3>\n    </div>\n    <div class=\"robin-textfield\">\n      <label class=\"mdl-textfield__label\" for=\"email\">邮箱</label>\n      <input class=\"robin-textfield--input robin-textfield--input_default\" type=\"text\" id=\"email\" v-model=\"registerData.email\"/>\n    </div>\n    <div class=\"robin-textfield\">\n      <label class=\"mdl-textfield__label\" for=\"password\">密码</label>\n      <input class=\"robin-textfield--input robin-textfield--input_default\" type=\"password\" id=\"password\" v-model=\"registerData.password\"/>\n    </div>\n    <div class=\"robin-textfield\">\n      <button class=\"robin-btn robin-btn__default\" v-on:click=\"signUp()\">注册</button>\n      <a v-link=\"'login'\">已有账号？直接登录</a>\n    </div>\n  </div>\n</div>\n";

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(90);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(91)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../../../node_modules/css-loader/index.js?sourceMap!../../../../node_modules/less-loader/index.js!./style.less", function() {
				var newContent = require("!!../../../../node_modules/css-loader/index.js?sourceMap!../../../../node_modules/less-loader/index.js!./style.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(12)();
	// imports


	// module
	exports.push([module.id, "/* ====================================================== */\n/* Variables\n/* ====================================================== */\n/**\n * side menu\n */\n.text-overflow {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n/**\n * task detail card\n */\nhtml,\nbody {\n  font-size: 10px;\n  font-weight: 400;\n  width: 100%;\n  height: 100%;\n  line-height: 20px;\n  margin: 0;\n  padding: 0;\n}\nbody {\n  min-height: 100%;\n  max-width: 100%;\n  font-family: 'Helvetica Neue', Tahoma, Arial, 'Microsoft Yahei', '\\5B8B\\4F53', '\\9ED1\\4F53', sans-serif;\n  background-color: #eceff1;\n  background-size: cover;\n  background-attachment: fixed;\n  overflow-x: hidden;\n}\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\np {\n  margin: 0;\n  padding: 0;\n}\n/**\n  * Styles for HTML elements\n  */\nh1 small,\nh2 small,\nh3 small,\nh4 small,\nh5 small,\nh6 small {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 56px;\n  font-weight: 400;\n  line-height: 1.35;\n  letter-spacing: -0.02em;\n  opacity: 0.54;\n  font-size: 0.6em;\n}\nh1 {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 56px;\n  font-weight: 400;\n  line-height: 1.35;\n  letter-spacing: -0.02em;\n  margin-top: 24px;\n  margin-bottom: 24px;\n}\nh2 {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 45px;\n  font-weight: 400;\n  line-height: 48px;\n  margin-top: 24px;\n  margin-bottom: 24px;\n}\nh3 {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 34px;\n  font-weight: 400;\n  line-height: 40px;\n  margin-top: 24px;\n  margin-bottom: 24px;\n}\nh4 {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 24px;\n  font-weight: 400;\n  line-height: 32px;\n  -moz-osx-font-smoothing: grayscale;\n  margin-top: 24px;\n  margin-bottom: 16px;\n}\nh5 {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 20px;\n  font-weight: 500;\n  line-height: 1;\n  letter-spacing: 0.02em;\n  margin-top: 24px;\n  margin-bottom: 16px;\n}\nh6 {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 16px;\n  font-weight: 400;\n  line-height: 24px;\n  letter-spacing: 0.04em;\n  margin-top: 24px;\n  margin-bottom: 16px;\n}\np {\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 24px;\n  letter-spacing: 0;\n  margin-bottom: 16px;\n}\na {\n  color: #ff7473;\n  font-weight: 500;\n}\nblockquote {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  position: relative;\n  font-size: 24px;\n  font-weight: 300;\n  font-style: italic;\n  line-height: 1.35;\n  letter-spacing: 0.08em;\n}\nblockquote:before {\n  position: absolute;\n  left: -0.5em;\n  content: '\\201C';\n}\nblockquote:after {\n  content: '\\201D';\n  margin-left: -0.05em;\n}\nmark {\n  background-color: #f4ff81;\n}\ndt {\n  font-weight: 700;\n}\naddress {\n  font-size: 12px;\n  font-weight: 400;\n  line-height: 1;\n  letter-spacing: 0;\n  font-style: normal;\n}\nul,\nol {\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 24px;\n  letter-spacing: 0;\n}\ninput {\n  font-family: 'Helvetica Neue', Tahoma, Arial, 'Microsoft Yahei', '\\5B8B\\4F53', '\\9ED1\\4F53', sans-serif;\n}\naudio,\ncanvas,\niframe,\nimg,\nsvg,\nvideo {\n  vertical-align: middle;\n}\n.container {\n  width: 100%;\n  max-width: 960px;\n  margin: 0 auto;\n}\n.box-center {\n  margin-right: auto;\n  margin-left: auto;\n}\n.text-center {\n  text-align: center;\n}\n.bg-layer {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n}\n.custom-container {\n  margin: 0 auto;\n}\n.text-overflow {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n/* Let's get this party started */\n::-webkit-scrollbar {\n  width: 4px;\n}\n/* Track */\n::-webkit-scrollbar-track {\n  border-radius: 10px;\n}\n/* Handle */\n::-webkit-scrollbar-thumb {\n  background: rgba(31, 27, 27, 0.8);\n  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);\n}\n::-webkit-scrollbar-thumb:window-inactive {\n  background: rgba(255, 0, 0, 0.4);\n}\n::-webkit-scrollbar {\n  width: 0 !important;\n}\n.loader {\n  width: 40px;\n  height: 40px;\n  margin: 0 auto;\n}\n.loader__hover {\n  margin: 0 auto;\n  width: 100%;\n  height: 100%;\n  background: #fefefe;\n  position: absolute;\n  z-index: 1;\n  top: 0;\n}\n.ball-clip-rotate-multiple {\n  position: relative;\n  width: 40px;\n  margin: 200px auto;\n}\n.ball-clip-rotate-multiple > div {\n  position: absolute;\n  left: 0;\n  top: 0;\n  border: 2px solid #000;\n  border-bottom-color: transparent;\n  border-top-color: transparent;\n  border-radius: 100%;\n  height: 35px;\n  width: 35px;\n  animation: rotate 1s 0s ease-in-out infinite;\n}\n.ball-clip-rotate-multiple > div:last-child {\n  display: inline-block;\n  top: 10px;\n  left: 10px;\n  width: 15px;\n  height: 15px;\n  animation-duration: .5s;\n  border-color: #000 transparent;\n  animation-direction: reverse;\n}\n@keyframes rotate {\n  0% {\n    transform: rotate(0);\n  }\n  50% {\n    transform: rotate(180deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\nbutton[data-tooltip] {\n  overflow: visible;\n}\n[data-tooltip] {\n  position: relative;\n}\n[data-tooltip]:before,\n[data-tooltip]:after {\n  font-family: 'Helvetica Neue', Tahoma, Arial, 'Microsoft Yahei', '\\5B8B\\4F53', '\\9ED1\\4F53', sans-serif;\n  opacity: 0;\n  pointer-events: none;\n  transition: all 0.18s ease-out 0.18s;\n  bottom: auto;\n  top: 100%;\n  left: 50%;\n  position: absolute;\n  z-index: 10;\n  transform: translate(-50%, -10px);\n  transform-origin: top;\n}\n[data-tooltip]:after {\n  background: rgba(17, 17, 17, 0.9);\n  border-radius: 2px;\n  color: #fff;\n  content: attr(data-tooltip);\n  font-size: 12px;\n  padding: 0.6em 0.8em;\n  white-space: nowrap;\n  line-height: 16px;\n  margin-top: 9px;\n}\n[data-tooltip]:before {\n  background: url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2236px%22%20height%3D%2212px%22%3E%3Cpath%20fill%3D%22rgba%2817,%2017,%2017,%200.9%29%22%20transform%3D%22rotate%28180%2018%206%29%22%20d%3D%22M2.658,0.000%20C-13.615,0.000%2050.938,0.000%2034.662,0.000%20C28.662,0.000%2023.035,12.002%2018.660,12.002%20C14.285,12.002%208.594,0.000%202.658,0.000%20Z%22/%3E%3C/svg%3E') no-repeat;\n  background-size: 100% auto;\n  height: 6px;\n  width: 18px;\n  content: \"\";\n  margin-top: 5px;\n  margin-bottom: 0;\n}\n[data-tooltip]:hover:before,\n[data-tooltip][data-tooltip-visible]:before,\n[data-tooltip]:hover:after,\n[data-tooltip][data-tooltip-visible]:after {\n  opacity: 1;\n  pointer-events: auto;\n  transform: translate(-50%, 0);\n}\n[data-tooltip][data-tooltip-break]:after {\n  white-space: normal;\n}\n[data-tooltip-pos=\"up\"]:before,\n[data-tooltip-pos=\"up\"]:after {\n  bottom: 100%;\n  left: 50%;\n  top: auto;\n  transform: translate(-50%, 10px);\n}\n[data-tooltip-pos=\"up\"]:after {\n  margin-bottom: 9px;\n}\n[data-tooltip-pos=\"up\"]:before {\n  background: url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2236px%22%20height%3D%2212px%22%3E%3Cpath%20fill%3D%22rgba%2817,%2017,%2017,%200.9%29%22%20transform%3D%22rotate%280%29%22%20d%3D%22M2.658,0.000%20C-13.615,0.000%2050.938,0.000%2034.662,0.000%20C28.662,0.000%2023.035,12.002%2018.660,12.002%20C14.285,12.002%208.594,0.000%202.658,0.000%20Z%22/%3E%3C/svg%3E') no-repeat;\n  background-size: 100% auto;\n  height: 6px;\n  width: 18px;\n  margin-bottom: 3px;\n  margin-left: 0;\n}\n[data-tooltip-pos=\"up\"]:hover:before,\n[data-tooltip-pos=\"up\"][data-tooltip-visible]:before,\n[data-tooltip-pos=\"up\"]:hover:after,\n[data-tooltip-pos=\"up\"][data-tooltip-visible]:after {\n  opacity: 1;\n  pointer-events: auto;\n  transform: translate(-50%, 0);\n}\n[data-tooltip-pos=\"down\"]:before,\n[data-tooltip-pos=\"down\"]:after {\n  bottom: auto;\n  left: 50%;\n  top: 100%;\n  transform: translate(-50%, -10px);\n}\n[data-tooltip-pos=\"down\"]:after {\n  margin-top: 11px;\n}\n[data-tooltip-pos=\"down\"]:before {\n  background: url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2236px%22%20height%3D%2212px%22%3E%3Cpath%20fill%3D%22rgba%2817,%2017,%2017,%200.9%29%22%20transform%3D%22rotate%28180%2018%206%29%22%20d%3D%22M2.658,0.000%20C-13.615,0.000%2050.938,0.000%2034.662,0.000%20C28.662,0.000%2023.035,12.002%2018.660,12.002%20C14.285,12.002%208.594,0.000%202.658,0.000%20Z%22/%3E%3C/svg%3E') no-repeat;\n  background-size: 100% auto;\n  height: 6px;\n  width: 18px;\n  margin-top: 5px;\n  margin-bottom: 0;\n}\n[data-tooltip-pos=\"down\"]:hover:before,\n[data-tooltip-pos=\"down\"][data-tooltip-visible]:before,\n[data-tooltip-pos=\"down\"]:hover:after,\n[data-tooltip-pos=\"down\"][data-tooltip-visible]:after {\n  transform: translate(-50%, 0);\n}\n[data-tooltip-pos=\"left\"]:before,\n[data-tooltip-pos=\"left\"]:after {\n  bottom: auto;\n  left: auto;\n  right: 100%;\n  top: 50%;\n  transform: translate(10px, -50%);\n}\n[data-tooltip-pos=\"left\"]:after {\n  margin-right: 11px;\n}\n[data-tooltip-pos=\"left\"]:before {\n  background: url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2212px%22%20height%3D%2236px%22%3E%3Cpath%20fill%3D%22rgba%2817,%2017,%2017,%200.9%29%22%20transform%3D%22rotate%28-90%2018%2018%29%22%20d%3D%22M2.658,0.000%20C-13.615,0.000%2050.938,0.000%2034.662,0.000%20C28.662,0.000%2023.035,12.002%2018.660,12.002%20C14.285,12.002%208.594,0.000%202.658,0.000%20Z%22/%3E%3C/svg%3E') no-repeat;\n  background-size: 100% auto;\n  height: 18px;\n  width: 6px;\n  margin-right: 5px;\n  margin-bottom: 0;\n}\n[data-tooltip-pos=\"left\"]:hover:before,\n[data-tooltip-pos=\"left\"][data-tooltip-visible]:before,\n[data-tooltip-pos=\"left\"]:hover:after,\n[data-tooltip-pos=\"left\"][data-tooltip-visible]:after {\n  transform: translate(0, -50%);\n}\n[data-tooltip-pos=\"right\"]:before,\n[data-tooltip-pos=\"right\"]:after {\n  bottom: auto;\n  left: 100%;\n  top: 50%;\n  transform: translate(-10px, -50%);\n}\n[data-tooltip-pos=\"right\"]:after {\n  margin-left: 11px;\n}\n[data-tooltip-pos=\"right\"]:before {\n  background: url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2212px%22%20height%3D%2236px%22%3E%3Cpath%20fill%3D%22rgba%2817,%2017,%2017,%200.9%29%22%20transform%3D%22rotate%2890%206%206%29%22%20d%3D%22M2.658,0.000%20C-13.615,0.000%2050.938,0.000%2034.662,0.000%20C28.662,0.000%2023.035,12.002%2018.660,12.002%20C14.285,12.002%208.594,0.000%202.658,0.000%20Z%22/%3E%3C/svg%3E') no-repeat;\n  background-size: 100% auto;\n  height: 18px;\n  width: 6px;\n  margin-bottom: 0;\n  margin-left: 5px;\n}\n[data-tooltip-pos=\"right\"]:hover:before,\n[data-tooltip-pos=\"right\"][data-tooltip-visible]:before,\n[data-tooltip-pos=\"right\"]:hover:after,\n[data-tooltip-pos=\"right\"][data-tooltip-visible]:after {\n  transform: translate(0, -50%);\n}\n[data-tooltip-length]:after {\n  white-space: normal;\n}\n[data-tooltip-length=\"small\"]:after {\n  width: 80px;\n}\n[data-tooltip-length=\"medium\"]:after {\n  width: 150px;\n}\n[data-tooltip-length=\"large\"]:after {\n  width: 260px;\n}\n[data-tooltip-length=\"xlarge\"]:after {\n  width: 90vw;\n}\n@media screen and (min-width: 768px) {\n  [data-tooltip-length=\"xlarge\"]:after {\n    width: 380px;\n  }\n}\n[data-tooltip-length=\"fit\"]:after {\n  width: 100%;\n}\n.modal-mask {\n  position: fixed;\n  z-index: 9998;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.5);\n  display: table;\n  transition: opacity .3s ease;\n}\n.modal-mask.modal-animation_sign .modal-wrapper {\n  perspective: 1300px;\n}\n.modal-mask.modal-animation_sign .modal-container {\n  transform-origin: 50% 0;\n}\n.modal-wrapper {\n  display: table-cell;\n  vertical-align: middle;\n}\n.modal-container {\n  transition: all .3s ease;\n}\n/**\n * animation default \n */\n.modal-animation_default-enter,\n.modal-animation_default-leave {\n  opacity: 0;\n}\n.modal-animation_default-enter .modal-animation_default-container,\n.modal-animation_default-leave .modal-animation_default-container {\n  -webkit-transform: scale(1.1);\n  transform: scale(1.1);\n}\n/**\n * animation sign\n */\n.modal-animation_sign-enter,\n.modal-animation_sign-leave {\n  opacity: 0;\n}\n.modal-animation_sign-enter .modal-container {\n  transform: rotateX(60deg);\n  opacity: 1;\n}\n.modal-animation_sign-leave .modal-container {\n  transform: rotateX(-60deg);\n  opacity: 1;\n}\n.animation-loader-transition {\n  transition: all 0.5s ease-in-out;\n}\n.animation-loader-enter,\n.animation-loader-leave {\n  opacity: 0;\n}\n.robin-textfield {\n  width: 100%;\n  margin: 4px 0;\n}\n.robin-textfield--input {\n  width: 100%;\n  height: 40px;\n  padding: 0 8px;\n  font-size: 15px;\n  box-sizing: border-box;\n  border: 1px solid #969da3;\n  border-radius: 2px;\n  outline: none;\n}\n.robin-textfield--input_default :focus {\n  box-shadow: 0 2px 2px 3px red;\n}\n.robin-btn {\n  border: none;\n  text-align: center;\n  box-sizing: border-box;\n  border-radius: 2px;\n  color: #fff;\n  font-size: 13px;\n  letter-spacing: 2px;\n}\n.robin-btn__default {\n  min-width: 76px;\n  height: 34px;\n  background: #00a9e8;\n  border: 1px solid #009ed7;\n}\n.robin-checkbox {\n  height: 16px;\n  padding: 2px 0 2px 20px;\n  display: flex;\n  align-items: center;\n  border: #969da3;\n  border-radius: 2px;\n  position: relative;\n}\n.robin-checkbox--input {\n  display: none;\n}\n.robin-checkbox--input:checked ~ .robin-checkbox--label {\n  border: 2px solid #47b8e0;\n  background: #47b8e0;\n}\n.robin-checkbox--input:checked ~ .robin-checkbox--tick {\n  display: block;\n}\n.robin-checkbox--label {\n  display: inline-block;\n  box-sizing: border-box;\n  width: 16px;\n  height: 16px;\n  margin: 0;\n  cursor: pointer;\n  overflow: hidden;\n  border: 2px solid rgba(0, 0, 0, 0.54);\n  border-radius: 2px;\n  transition-duration: .28s;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-property: background;\n  position: absolute;\n  left: 2px;\n  top: 2px;\n}\n.robin-checkbox--tick {\n  display: none;\n  box-sizing: border-box;\n  width: 12px;\n  height: 6px;\n  margin: 0;\n  cursor: pointer;\n  overflow: hidden;\n  border-radius: 2px;\n  transition-duration: .28s;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-property: background;\n  position: absolute;\n  left: 4px;\n  top: 6px;\n  border-style: solid;\n  border-color: transparent transparent #fff #fff;\n  border-width: 0 0 2px 2px;\n  transform: rotateZ(-50deg);\n}\n", "", {"version":3,"sources":["/./app/src/public/stylesheets/style.less"],"names":[],"mappings":"AAAA,4DAA4D;AAC5D;4DAC4D;AAC5D;;GAEG;AACH;EACE,iBAAiB;EACjB,wBAAwB;EACxB,oBAAoB;CACrB;AACD;;GAEG;AACH;;EAEE,gBAAgB;EAChB,iBAAiB;EACjB,YAAY;EACZ,aAAa;EACb,kBAAkB;EAClB,UAAU;EACV,WAAW;CACZ;AACD;EACE,iBAAiB;EACjB,gBAAgB;EAChB,wGAAwF;EACxF,0BAA0B;EAC1B,uBAAuB;EACvB,6BAA6B;EAC7B,mBAAmB;CACpB;AACD;;;;;;;EAOE,UAAU;EACV,WAAW;CACZ;AACD;;IAEI;AACJ;;;;;;EAME,wDAAwD;EACxD,gBAAgB;EAChB,iBAAiB;EACjB,kBAAkB;EAClB,wBAAwB;EACxB,cAAc;EACd,iBAAiB;CAClB;AACD;EACE,wDAAwD;EACxD,gBAAgB;EAChB,iBAAiB;EACjB,kBAAkB;EAClB,wBAAwB;EACxB,iBAAiB;EACjB,oBAAoB;CACrB;AACD;EACE,wDAAwD;EACxD,gBAAgB;EAChB,iBAAiB;EACjB,kBAAkB;EAClB,iBAAiB;EACjB,oBAAoB;CACrB;AACD;EACE,wDAAwD;EACxD,gBAAgB;EAChB,iBAAiB;EACjB,kBAAkB;EAClB,iBAAiB;EACjB,oBAAoB;CACrB;AACD;EACE,wDAAwD;EACxD,gBAAgB;EAChB,iBAAiB;EACjB,kBAAkB;EAClB,mCAAmC;EACnC,iBAAiB;EACjB,oBAAoB;CACrB;AACD;EACE,wDAAwD;EACxD,gBAAgB;EAChB,iBAAiB;EACjB,eAAe;EACf,uBAAuB;EACvB,iBAAiB;EACjB,oBAAoB;CACrB;AACD;EACE,wDAAwD;EACxD,gBAAgB;EAChB,iBAAiB;EACjB,kBAAkB;EAClB,uBAAuB;EACvB,iBAAiB;EACjB,oBAAoB;CACrB;AACD;EACE,gBAAgB;EAChB,iBAAiB;EACjB,kBAAkB;EAClB,kBAAkB;EAClB,oBAAoB;CACrB;AACD;EACE,eAAe;EACf,iBAAiB;CAClB;AACD;EACE,wDAAwD;EACxD,mBAAmB;EACnB,gBAAgB;EAChB,iBAAiB;EACjB,mBAAmB;EACnB,kBAAkB;EAClB,uBAAuB;CACxB;AACD;EACE,mBAAmB;EACnB,aAAa;EACb,iBAAa;CACd;AACD;EACE,iBAAa;EACb,qBAAqB;CACtB;AACD;EACE,0BAA0B;CAC3B;AACD;EACE,iBAAiB;CAClB;AACD;EACE,gBAAgB;EAChB,iBAAiB;EACjB,eAAe;EACf,kBAAkB;EAClB,mBAAmB;CACpB;AACD;;EAEE,gBAAgB;EAChB,iBAAiB;EACjB,kBAAkB;EAClB,kBAAkB;CACnB;AACD;EACE,wGAAwF;CACzF;AACD;;;;;;EAME,uBAAuB;CACxB;AACD;EACE,YAAY;EACZ,iBAAiB;EACjB,eAAe;CAChB;AACD;EACE,mBAAmB;EACnB,kBAAkB;CACnB;AACD;EACE,mBAAmB;CACpB;AACD;EACE,mBAAmB;EACnB,QAAQ;EACR,SAAS;EACT,OAAO;EACP,UAAU;CACX;AACD;EACE,eAAe;CAChB;AACD;EACE,iBAAiB;EACjB,wBAAwB;EACxB,oBAAoB;CACrB;AACD,kCAAkC;AAClC;EACE,WAAW;CACZ;AACD,WAAW;AACX;EACE,oBAAoB;CACrB;AACD,YAAY;AACZ;EACE,kCAAkC;EAClC,qDAAqD;CACtD;AACD;EACE,iCAAiC;CAClC;AACD;EACE,oBAAoB;CACrB;AACD;EACE,YAAY;EACZ,aAAa;EACb,eAAe;CAChB;AACD;EACE,eAAe;EACf,YAAY;EACZ,aAAa;EACb,oBAAoB;EACpB,mBAAmB;EACnB,WAAW;EACX,OAAO;CACR;AACD;EACE,mBAAmB;EACnB,YAAY;EACZ,mBAAmB;CACpB;AACD;EACE,mBAAmB;EACnB,QAAQ;EACR,OAAO;EACP,uBAAuB;EACvB,iCAAiC;EACjC,8BAA8B;EAC9B,oBAAoB;EACpB,aAAa;EACb,YAAY;EACZ,6CAA6C;CAC9C;AACD;EACE,sBAAsB;EACtB,UAAU;EACV,WAAW;EACX,YAAY;EACZ,aAAa;EACb,wBAAwB;EACxB,+BAA+B;EAC/B,6BAA6B;CAC9B;AACD;EACE;IACE,qBAAqB;GACtB;EACD;IACE,0BAA0B;GAC3B;EACD;IACE,0BAA0B;GAC3B;CACF;AACD;EACE,kBAAkB;CACnB;AACD;EACE,mBAAmB;CACpB;AACD;;EAEE,wGAAwG;EACxG,WAAW;EACX,qBAAqB;EACrB,qCAAqC;EACrC,aAAa;EACb,UAAU;EACV,UAAU;EACV,mBAAmB;EACnB,YAAY;EACZ,kCAAkC;EAClC,sBAAsB;CACvB;AACD;EACE,kCAAkC;EAClC,mBAAmB;EACnB,YAAY;EACZ,4BAA4B;EAC5B,gBAAgB;EAChB,qBAAqB;EACrB,oBAAoB;EACpB,kBAAkB;EAClB,gBAAgB;CACjB;AACD;EACE,0bAA0b;EAC1b,2BAA2B;EAC3B,YAAY;EACZ,YAAY;EACZ,YAAY;EACZ,gBAAgB;EAChB,iBAAiB;CAClB;AACD;;;;EAIE,WAAW;EACX,qBAAqB;EACrB,8BAA8B;CAC/B;AACD;EACE,oBAAoB;CACrB;AACD;;EAEE,aAAa;EACb,UAAU;EACV,UAAU;EACV,iCAAiC;CAClC;AACD;EACE,mBAAmB;CACpB;AACD;EACE,+aAA+a;EAC/a,2BAA2B;EAC3B,YAAY;EACZ,YAAY;EACZ,mBAAmB;EACnB,eAAe;CAChB;AACD;;;;EAIE,WAAW;EACX,qBAAqB;EACrB,8BAA8B;CAC/B;AACD;;EAEE,aAAa;EACb,UAAU;EACV,UAAU;EACV,kCAAkC;CACnC;AACD;EACE,iBAAiB;CAClB;AACD;EACE,0bAA0b;EAC1b,2BAA2B;EAC3B,YAAY;EACZ,YAAY;EACZ,gBAAgB;EAChB,iBAAiB;CAClB;AACD;;;;EAIE,8BAA8B;CAC/B;AACD;;EAEE,aAAa;EACb,WAAW;EACX,YAAY;EACZ,SAAS;EACT,iCAAiC;CAClC;AACD;EACE,mBAAmB;CACpB;AACD;EACE,2bAA2b;EAC3b,2BAA2B;EAC3B,aAAa;EACb,WAAW;EACX,kBAAkB;EAClB,iBAAiB;CAClB;AACD;;;;EAIE,8BAA8B;CAC/B;AACD;;EAEE,aAAa;EACb,WAAW;EACX,SAAS;EACT,kCAAkC;CACnC;AACD;EACE,kBAAkB;CACnB;AACD;EACE,wbAAwb;EACxb,2BAA2B;EAC3B,aAAa;EACb,WAAW;EACX,iBAAiB;EACjB,iBAAiB;CAClB;AACD;;;;EAIE,8BAA8B;CAC/B;AACD;EACE,oBAAoB;CACrB;AACD;EACE,YAAY;CACb;AACD;EACE,aAAa;CACd;AACD;EACE,aAAa;CACd;AACD;EACE,YAAY;CACb;AACD;EACE;IACE,aAAa;GACd;CACF;AACD;EACE,YAAY;CACb;AACD;EACE,gBAAgB;EAChB,cAAc;EACd,OAAO;EACP,QAAQ;EACR,YAAY;EACZ,aAAa;EACb,+BAA+B;EAC/B,eAAe;EACf,6BAA6B;CAC9B;AACD;EACE,oBAAoB;CACrB;AACD;EACE,wBAAwB;CACzB;AACD;EACE,oBAAoB;EACpB,uBAAuB;CACxB;AACD;EACE,yBAAyB;CAC1B;AACD;;GAEG;AACH;;EAEE,WAAW;CACZ;AACD;;EAEE,8BAA8B;EAC9B,sBAAsB;CACvB;AACD;;GAEG;AACH;;EAEE,WAAW;CACZ;AACD;EACE,0BAA0B;EAC1B,WAAW;CACZ;AACD;EACE,2BAA2B;EAC3B,WAAW;CACZ;AACD;EACE,iCAAiC;CAClC;AACD;;EAEE,WAAW;CACZ;AACD;EACE,YAAY;EACZ,cAAc;CACf;AACD;EACE,YAAY;EACZ,aAAa;EACb,eAAe;EACf,gBAAgB;EAChB,uBAAuB;EACvB,0BAA0B;EAC1B,mBAAmB;EACnB,cAAc;CACf;AACD;EACE,8BAA8B;CAC/B;AACD;EACE,aAAa;EACb,mBAAmB;EACnB,uBAAuB;EACvB,mBAAmB;EACnB,YAAY;EACZ,gBAAgB;EAChB,oBAAoB;CACrB;AACD;EACE,gBAAgB;EAChB,aAAa;EACb,oBAAoB;EACpB,0BAA0B;CAC3B;AACD;EACE,aAAa;EACb,wBAAwB;EACxB,cAAc;EACd,oBAAoB;EACpB,gBAAgB;EAChB,mBAAmB;EACnB,mBAAmB;CACpB;AACD;EACE,cAAc;CACf;AACD;EACE,0BAA0B;EAC1B,oBAAoB;CACrB;AACD;EACE,eAAe;CAChB;AACD;EACE,sBAAsB;EACtB,uBAAuB;EACvB,YAAY;EACZ,aAAa;EACb,UAAU;EACV,gBAAgB;EAChB,iBAAiB;EACjB,sCAAsC;EACtC,mBAAmB;EACnB,0BAA0B;EAC1B,yDAAyD;EACzD,gCAAgC;EAChC,mBAAmB;EACnB,UAAU;EACV,SAAS;CACV;AACD;EACE,cAAc;EACd,uBAAuB;EACvB,YAAY;EACZ,YAAY;EACZ,UAAU;EACV,gBAAgB;EAChB,iBAAiB;EACjB,mBAAmB;EACnB,0BAA0B;EAC1B,yDAAyD;EACzD,gCAAgC;EAChC,mBAAmB;EACnB,UAAU;EACV,SAAS;EACT,oBAAoB;EACpB,gDAAgD;EAChD,0BAA0B;EAC1B,2BAA2B;CAC5B","file":"style.less","sourcesContent":["/* ====================================================== */\n/* Variables\n/* ====================================================== */\n/**\n * side menu\n */\n.text-overflow {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n/**\n * task detail card\n */\nhtml,\nbody {\n  font-size: 10px;\n  font-weight: 400;\n  width: 100%;\n  height: 100%;\n  line-height: 20px;\n  margin: 0;\n  padding: 0;\n}\nbody {\n  min-height: 100%;\n  max-width: 100%;\n  font-family: 'Helvetica Neue', Tahoma, Arial, 'Microsoft Yahei', '宋体', '黑体', sans-serif;\n  background-color: #eceff1;\n  background-size: cover;\n  background-attachment: fixed;\n  overflow-x: hidden;\n}\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\np {\n  margin: 0;\n  padding: 0;\n}\n/**\n  * Styles for HTML elements\n  */\nh1 small,\nh2 small,\nh3 small,\nh4 small,\nh5 small,\nh6 small {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 56px;\n  font-weight: 400;\n  line-height: 1.35;\n  letter-spacing: -0.02em;\n  opacity: 0.54;\n  font-size: 0.6em;\n}\nh1 {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 56px;\n  font-weight: 400;\n  line-height: 1.35;\n  letter-spacing: -0.02em;\n  margin-top: 24px;\n  margin-bottom: 24px;\n}\nh2 {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 45px;\n  font-weight: 400;\n  line-height: 48px;\n  margin-top: 24px;\n  margin-bottom: 24px;\n}\nh3 {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 34px;\n  font-weight: 400;\n  line-height: 40px;\n  margin-top: 24px;\n  margin-bottom: 24px;\n}\nh4 {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 24px;\n  font-weight: 400;\n  line-height: 32px;\n  -moz-osx-font-smoothing: grayscale;\n  margin-top: 24px;\n  margin-bottom: 16px;\n}\nh5 {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 20px;\n  font-weight: 500;\n  line-height: 1;\n  letter-spacing: 0.02em;\n  margin-top: 24px;\n  margin-bottom: 16px;\n}\nh6 {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 16px;\n  font-weight: 400;\n  line-height: 24px;\n  letter-spacing: 0.04em;\n  margin-top: 24px;\n  margin-bottom: 16px;\n}\np {\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 24px;\n  letter-spacing: 0;\n  margin-bottom: 16px;\n}\na {\n  color: #ff7473;\n  font-weight: 500;\n}\nblockquote {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  position: relative;\n  font-size: 24px;\n  font-weight: 300;\n  font-style: italic;\n  line-height: 1.35;\n  letter-spacing: 0.08em;\n}\nblockquote:before {\n  position: absolute;\n  left: -0.5em;\n  content: '“';\n}\nblockquote:after {\n  content: '”';\n  margin-left: -0.05em;\n}\nmark {\n  background-color: #f4ff81;\n}\ndt {\n  font-weight: 700;\n}\naddress {\n  font-size: 12px;\n  font-weight: 400;\n  line-height: 1;\n  letter-spacing: 0;\n  font-style: normal;\n}\nul,\nol {\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 24px;\n  letter-spacing: 0;\n}\ninput {\n  font-family: 'Helvetica Neue', Tahoma, Arial, 'Microsoft Yahei', '宋体', '黑体', sans-serif;\n}\naudio,\ncanvas,\niframe,\nimg,\nsvg,\nvideo {\n  vertical-align: middle;\n}\n.container {\n  width: 100%;\n  max-width: 960px;\n  margin: 0 auto;\n}\n.box-center {\n  margin-right: auto;\n  margin-left: auto;\n}\n.text-center {\n  text-align: center;\n}\n.bg-layer {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n}\n.custom-container {\n  margin: 0 auto;\n}\n.text-overflow {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n/* Let's get this party started */\n::-webkit-scrollbar {\n  width: 4px;\n}\n/* Track */\n::-webkit-scrollbar-track {\n  border-radius: 10px;\n}\n/* Handle */\n::-webkit-scrollbar-thumb {\n  background: rgba(31, 27, 27, 0.8);\n  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);\n}\n::-webkit-scrollbar-thumb:window-inactive {\n  background: rgba(255, 0, 0, 0.4);\n}\n::-webkit-scrollbar {\n  width: 0 !important;\n}\n.loader {\n  width: 40px;\n  height: 40px;\n  margin: 0 auto;\n}\n.loader__hover {\n  margin: 0 auto;\n  width: 100%;\n  height: 100%;\n  background: #fefefe;\n  position: absolute;\n  z-index: 1;\n  top: 0;\n}\n.ball-clip-rotate-multiple {\n  position: relative;\n  width: 40px;\n  margin: 200px auto;\n}\n.ball-clip-rotate-multiple > div {\n  position: absolute;\n  left: 0;\n  top: 0;\n  border: 2px solid #000;\n  border-bottom-color: transparent;\n  border-top-color: transparent;\n  border-radius: 100%;\n  height: 35px;\n  width: 35px;\n  animation: rotate 1s 0s ease-in-out infinite;\n}\n.ball-clip-rotate-multiple > div:last-child {\n  display: inline-block;\n  top: 10px;\n  left: 10px;\n  width: 15px;\n  height: 15px;\n  animation-duration: .5s;\n  border-color: #000 transparent;\n  animation-direction: reverse;\n}\n@keyframes rotate {\n  0% {\n    transform: rotate(0);\n  }\n  50% {\n    transform: rotate(180deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\nbutton[data-tooltip] {\n  overflow: visible;\n}\n[data-tooltip] {\n  position: relative;\n}\n[data-tooltip]:before,\n[data-tooltip]:after {\n  font-family: 'Helvetica Neue', Tahoma, Arial, 'Microsoft Yahei', '\\5B8B\\4F53', '\\9ED1\\4F53', sans-serif;\n  opacity: 0;\n  pointer-events: none;\n  transition: all 0.18s ease-out 0.18s;\n  bottom: auto;\n  top: 100%;\n  left: 50%;\n  position: absolute;\n  z-index: 10;\n  transform: translate(-50%, -10px);\n  transform-origin: top;\n}\n[data-tooltip]:after {\n  background: rgba(17, 17, 17, 0.9);\n  border-radius: 2px;\n  color: #fff;\n  content: attr(data-tooltip);\n  font-size: 12px;\n  padding: 0.6em 0.8em;\n  white-space: nowrap;\n  line-height: 16px;\n  margin-top: 9px;\n}\n[data-tooltip]:before {\n  background: url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2236px%22%20height%3D%2212px%22%3E%3Cpath%20fill%3D%22rgba%2817,%2017,%2017,%200.9%29%22%20transform%3D%22rotate%28180%2018%206%29%22%20d%3D%22M2.658,0.000%20C-13.615,0.000%2050.938,0.000%2034.662,0.000%20C28.662,0.000%2023.035,12.002%2018.660,12.002%20C14.285,12.002%208.594,0.000%202.658,0.000%20Z%22/%3E%3C/svg%3E') no-repeat;\n  background-size: 100% auto;\n  height: 6px;\n  width: 18px;\n  content: \"\";\n  margin-top: 5px;\n  margin-bottom: 0;\n}\n[data-tooltip]:hover:before,\n[data-tooltip][data-tooltip-visible]:before,\n[data-tooltip]:hover:after,\n[data-tooltip][data-tooltip-visible]:after {\n  opacity: 1;\n  pointer-events: auto;\n  transform: translate(-50%, 0);\n}\n[data-tooltip][data-tooltip-break]:after {\n  white-space: normal;\n}\n[data-tooltip-pos=\"up\"]:before,\n[data-tooltip-pos=\"up\"]:after {\n  bottom: 100%;\n  left: 50%;\n  top: auto;\n  transform: translate(-50%, 10px);\n}\n[data-tooltip-pos=\"up\"]:after {\n  margin-bottom: 9px;\n}\n[data-tooltip-pos=\"up\"]:before {\n  background: url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2236px%22%20height%3D%2212px%22%3E%3Cpath%20fill%3D%22rgba%2817,%2017,%2017,%200.9%29%22%20transform%3D%22rotate%280%29%22%20d%3D%22M2.658,0.000%20C-13.615,0.000%2050.938,0.000%2034.662,0.000%20C28.662,0.000%2023.035,12.002%2018.660,12.002%20C14.285,12.002%208.594,0.000%202.658,0.000%20Z%22/%3E%3C/svg%3E') no-repeat;\n  background-size: 100% auto;\n  height: 6px;\n  width: 18px;\n  margin-bottom: 3px;\n  margin-left: 0;\n}\n[data-tooltip-pos=\"up\"]:hover:before,\n[data-tooltip-pos=\"up\"][data-tooltip-visible]:before,\n[data-tooltip-pos=\"up\"]:hover:after,\n[data-tooltip-pos=\"up\"][data-tooltip-visible]:after {\n  opacity: 1;\n  pointer-events: auto;\n  transform: translate(-50%, 0);\n}\n[data-tooltip-pos=\"down\"]:before,\n[data-tooltip-pos=\"down\"]:after {\n  bottom: auto;\n  left: 50%;\n  top: 100%;\n  transform: translate(-50%, -10px);\n}\n[data-tooltip-pos=\"down\"]:after {\n  margin-top: 11px;\n}\n[data-tooltip-pos=\"down\"]:before {\n  background: url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2236px%22%20height%3D%2212px%22%3E%3Cpath%20fill%3D%22rgba%2817,%2017,%2017,%200.9%29%22%20transform%3D%22rotate%28180%2018%206%29%22%20d%3D%22M2.658,0.000%20C-13.615,0.000%2050.938,0.000%2034.662,0.000%20C28.662,0.000%2023.035,12.002%2018.660,12.002%20C14.285,12.002%208.594,0.000%202.658,0.000%20Z%22/%3E%3C/svg%3E') no-repeat;\n  background-size: 100% auto;\n  height: 6px;\n  width: 18px;\n  margin-top: 5px;\n  margin-bottom: 0;\n}\n[data-tooltip-pos=\"down\"]:hover:before,\n[data-tooltip-pos=\"down\"][data-tooltip-visible]:before,\n[data-tooltip-pos=\"down\"]:hover:after,\n[data-tooltip-pos=\"down\"][data-tooltip-visible]:after {\n  transform: translate(-50%, 0);\n}\n[data-tooltip-pos=\"left\"]:before,\n[data-tooltip-pos=\"left\"]:after {\n  bottom: auto;\n  left: auto;\n  right: 100%;\n  top: 50%;\n  transform: translate(10px, -50%);\n}\n[data-tooltip-pos=\"left\"]:after {\n  margin-right: 11px;\n}\n[data-tooltip-pos=\"left\"]:before {\n  background: url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2212px%22%20height%3D%2236px%22%3E%3Cpath%20fill%3D%22rgba%2817,%2017,%2017,%200.9%29%22%20transform%3D%22rotate%28-90%2018%2018%29%22%20d%3D%22M2.658,0.000%20C-13.615,0.000%2050.938,0.000%2034.662,0.000%20C28.662,0.000%2023.035,12.002%2018.660,12.002%20C14.285,12.002%208.594,0.000%202.658,0.000%20Z%22/%3E%3C/svg%3E') no-repeat;\n  background-size: 100% auto;\n  height: 18px;\n  width: 6px;\n  margin-right: 5px;\n  margin-bottom: 0;\n}\n[data-tooltip-pos=\"left\"]:hover:before,\n[data-tooltip-pos=\"left\"][data-tooltip-visible]:before,\n[data-tooltip-pos=\"left\"]:hover:after,\n[data-tooltip-pos=\"left\"][data-tooltip-visible]:after {\n  transform: translate(0, -50%);\n}\n[data-tooltip-pos=\"right\"]:before,\n[data-tooltip-pos=\"right\"]:after {\n  bottom: auto;\n  left: 100%;\n  top: 50%;\n  transform: translate(-10px, -50%);\n}\n[data-tooltip-pos=\"right\"]:after {\n  margin-left: 11px;\n}\n[data-tooltip-pos=\"right\"]:before {\n  background: url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2212px%22%20height%3D%2236px%22%3E%3Cpath%20fill%3D%22rgba%2817,%2017,%2017,%200.9%29%22%20transform%3D%22rotate%2890%206%206%29%22%20d%3D%22M2.658,0.000%20C-13.615,0.000%2050.938,0.000%2034.662,0.000%20C28.662,0.000%2023.035,12.002%2018.660,12.002%20C14.285,12.002%208.594,0.000%202.658,0.000%20Z%22/%3E%3C/svg%3E') no-repeat;\n  background-size: 100% auto;\n  height: 18px;\n  width: 6px;\n  margin-bottom: 0;\n  margin-left: 5px;\n}\n[data-tooltip-pos=\"right\"]:hover:before,\n[data-tooltip-pos=\"right\"][data-tooltip-visible]:before,\n[data-tooltip-pos=\"right\"]:hover:after,\n[data-tooltip-pos=\"right\"][data-tooltip-visible]:after {\n  transform: translate(0, -50%);\n}\n[data-tooltip-length]:after {\n  white-space: normal;\n}\n[data-tooltip-length=\"small\"]:after {\n  width: 80px;\n}\n[data-tooltip-length=\"medium\"]:after {\n  width: 150px;\n}\n[data-tooltip-length=\"large\"]:after {\n  width: 260px;\n}\n[data-tooltip-length=\"xlarge\"]:after {\n  width: 90vw;\n}\n@media screen and (min-width: 768px) {\n  [data-tooltip-length=\"xlarge\"]:after {\n    width: 380px;\n  }\n}\n[data-tooltip-length=\"fit\"]:after {\n  width: 100%;\n}\n.modal-mask {\n  position: fixed;\n  z-index: 9998;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.5);\n  display: table;\n  transition: opacity .3s ease;\n}\n.modal-mask.modal-animation_sign .modal-wrapper {\n  perspective: 1300px;\n}\n.modal-mask.modal-animation_sign .modal-container {\n  transform-origin: 50% 0;\n}\n.modal-wrapper {\n  display: table-cell;\n  vertical-align: middle;\n}\n.modal-container {\n  transition: all .3s ease;\n}\n/**\n * animation default \n */\n.modal-animation_default-enter,\n.modal-animation_default-leave {\n  opacity: 0;\n}\n.modal-animation_default-enter .modal-animation_default-container,\n.modal-animation_default-leave .modal-animation_default-container {\n  -webkit-transform: scale(1.1);\n  transform: scale(1.1);\n}\n/**\n * animation sign\n */\n.modal-animation_sign-enter,\n.modal-animation_sign-leave {\n  opacity: 0;\n}\n.modal-animation_sign-enter .modal-container {\n  transform: rotateX(60deg);\n  opacity: 1;\n}\n.modal-animation_sign-leave .modal-container {\n  transform: rotateX(-60deg);\n  opacity: 1;\n}\n.animation-loader-transition {\n  transition: all 0.5s ease-in-out;\n}\n.animation-loader-enter,\n.animation-loader-leave {\n  opacity: 0;\n}\n.robin-textfield {\n  width: 100%;\n  margin: 4px 0;\n}\n.robin-textfield--input {\n  width: 100%;\n  height: 40px;\n  padding: 0 8px;\n  font-size: 15px;\n  box-sizing: border-box;\n  border: 1px solid #969da3;\n  border-radius: 2px;\n  outline: none;\n}\n.robin-textfield--input_default :focus {\n  box-shadow: 0 2px 2px 3px red;\n}\n.robin-btn {\n  border: none;\n  text-align: center;\n  box-sizing: border-box;\n  border-radius: 2px;\n  color: #fff;\n  font-size: 13px;\n  letter-spacing: 2px;\n}\n.robin-btn__default {\n  min-width: 76px;\n  height: 34px;\n  background: #00a9e8;\n  border: 1px solid #009ed7;\n}\n.robin-checkbox {\n  height: 16px;\n  padding: 2px 0 2px 20px;\n  display: flex;\n  align-items: center;\n  border: #969da3;\n  border-radius: 2px;\n  position: relative;\n}\n.robin-checkbox--input {\n  display: none;\n}\n.robin-checkbox--input:checked ~ .robin-checkbox--label {\n  border: 2px solid #47b8e0;\n  background: #47b8e0;\n}\n.robin-checkbox--input:checked ~ .robin-checkbox--tick {\n  display: block;\n}\n.robin-checkbox--label {\n  display: inline-block;\n  box-sizing: border-box;\n  width: 16px;\n  height: 16px;\n  margin: 0;\n  cursor: pointer;\n  overflow: hidden;\n  border: 2px solid rgba(0, 0, 0, 0.54);\n  border-radius: 2px;\n  transition-duration: .28s;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-property: background;\n  position: absolute;\n  left: 2px;\n  top: 2px;\n}\n.robin-checkbox--tick {\n  display: none;\n  box-sizing: border-box;\n  width: 12px;\n  height: 6px;\n  margin: 0;\n  cursor: pointer;\n  overflow: hidden;\n  border-radius: 2px;\n  transition-duration: .28s;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-property: background;\n  position: absolute;\n  left: 4px;\n  top: 6px;\n  border-style: solid;\n  border-color: transparent transparent #fff #fff;\n  border-width: 0 0 2px 2px;\n  transform: rotateZ(-50deg);\n}\n"],"sourceRoot":"webpack://"}]);

	// exports


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ })
]);