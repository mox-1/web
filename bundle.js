/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(1);
	
	__webpack_require__(3);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(jQuery, $) {'use strict';
	
	/**
	 * jQuery || Zepto Parallax Plugin
	 * @author Matthew Wagerfield - @wagerfield
	 * @description Creates a parallax effect between an array of layers,
	 *              driving the motion from the gyroscope output of a smartdevice.
	 *              If no gyroscope is available, the cursor position is used.
	 */
	;(function ($, window, document, undefined) {
	
	  // Strict Mode
	  'use strict';
	
	  // Constants
	
	  var NAME = 'parallax';
	  var MAGIC_NUMBER = 30;
	  var DEFAULTS = {
	    relativeInput: false,
	    clipRelativeInput: false,
	    calibrationThreshold: 100,
	    calibrationDelay: 500,
	    supportDelay: 500,
	    calibrateX: false,
	    calibrateY: true,
	    invertX: true,
	    invertY: true,
	    limitX: false,
	    limitY: false,
	    scalarX: 10.0,
	    scalarY: 10.0,
	    frictionX: 0.1,
	    frictionY: 0.1,
	    originX: 0.5,
	    originY: 0.5
	  };
	
	  function Plugin(element, options) {
	
	    // DOM Context
	    this.element = element;
	
	    // Selections
	    this.$context = $(element).data('api', this);
	    this.$layers = this.$context.find('.layer');
	
	    // Data Extraction
	    var data = {
	      calibrateX: this.$context.data('calibrate-x') || null,
	      calibrateY: this.$context.data('calibrate-y') || null,
	      invertX: this.$context.data('invert-x') || null,
	      invertY: this.$context.data('invert-y') || null,
	      limitX: parseFloat(this.$context.data('limit-x')) || null,
	      limitY: parseFloat(this.$context.data('limit-y')) || null,
	      scalarX: parseFloat(this.$context.data('scalar-x')) || null,
	      scalarY: parseFloat(this.$context.data('scalar-y')) || null,
	      frictionX: parseFloat(this.$context.data('friction-x')) || null,
	      frictionY: parseFloat(this.$context.data('friction-y')) || null,
	      originX: parseFloat(this.$context.data('origin-x')) || null,
	      originY: parseFloat(this.$context.data('origin-y')) || null
	    };
	
	    // Delete Null Data Values
	    for (var key in data) {
	      if (data[key] === null) delete data[key];
	    }
	
	    // Compose Settings Object
	    $.extend(this, DEFAULTS, options, data);
	
	    // States
	    this.calibrationTimer = null;
	    this.calibrationFlag = true;
	    this.enabled = false;
	    this.depths = [];
	    this.raf = null;
	
	    // Element Bounds
	    this.bounds = null;
	    this.ex = 0;
	    this.ey = 0;
	    this.ew = 0;
	    this.eh = 0;
	
	    // Element Center
	    this.ecx = 0;
	    this.ecy = 0;
	
	    // Element Range
	    this.erx = 0;
	    this.ery = 0;
	
	    // Calibration
	    this.cx = 0;
	    this.cy = 0;
	
	    // Input
	    this.ix = 0;
	    this.iy = 0;
	
	    // Motion
	    this.mx = 0;
	    this.my = 0;
	
	    // Velocity
	    this.vx = 0;
	    this.vy = 0;
	
	    // Callbacks
	    this.onMouseMove = this.onMouseMove.bind(this);
	    this.onDeviceOrientation = this.onDeviceOrientation.bind(this);
	    this.onOrientationTimer = this.onOrientationTimer.bind(this);
	    this.onCalibrationTimer = this.onCalibrationTimer.bind(this);
	    this.onAnimationFrame = this.onAnimationFrame.bind(this);
	    this.onWindowResize = this.onWindowResize.bind(this);
	
	    // Initialise
	    this.initialise();
	  }
	
	  Plugin.prototype.transformSupport = function (value) {
	    var element = document.createElement('div');
	    var propertySupport = false;
	    var propertyValue = null;
	    var featureSupport = false;
	    var cssProperty = null;
	    var jsProperty = null;
	    for (var i = 0, l = this.vendors.length; i < l; i++) {
	      if (this.vendors[i] !== null) {
	        cssProperty = this.vendors[i][0] + 'transform';
	        jsProperty = this.vendors[i][1] + 'Transform';
	      } else {
	        cssProperty = 'transform';
	        jsProperty = 'transform';
	      }
	      if (element.style[jsProperty] !== undefined) {
	        propertySupport = true;
	        break;
	      }
	    }
	    switch (value) {
	      case '2D':
	        featureSupport = propertySupport;
	        break;
	      case '3D':
	        if (propertySupport) {
	          var body = document.body || document.createElement('body');
	          var documentElement = document.documentElement;
	          var documentOverflow = documentElement.style.overflow;
	          if (!document.body) {
	            documentElement.style.overflow = 'hidden';
	            documentElement.appendChild(body);
	            body.style.overflow = 'hidden';
	            body.style.background = '';
	          }
	          body.appendChild(element);
	          element.style[jsProperty] = 'translate3d(1px,1px,1px)';
	          propertyValue = window.getComputedStyle(element).getPropertyValue(cssProperty);
	          featureSupport = propertyValue !== undefined && propertyValue.length > 0 && propertyValue !== "none";
	          documentElement.style.overflow = documentOverflow;
	          body.removeChild(element);
	        }
	        break;
	    }
	    return featureSupport;
	  };
	
	  Plugin.prototype.ww = null;
	  Plugin.prototype.wh = null;
	  Plugin.prototype.wcx = null;
	  Plugin.prototype.wcy = null;
	  Plugin.prototype.wrx = null;
	  Plugin.prototype.wry = null;
	  Plugin.prototype.portrait = null;
	  Plugin.prototype.desktop = !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i);
	  Plugin.prototype.vendors = [null, ['-webkit-', 'webkit'], ['-moz-', 'Moz'], ['-o-', 'O'], ['-ms-', 'ms']];
	  Plugin.prototype.motionSupport = !!window.DeviceMotionEvent;
	  Plugin.prototype.orientationSupport = !!window.DeviceOrientationEvent;
	  Plugin.prototype.orientationStatus = 0;
	  Plugin.prototype.transform2DSupport = Plugin.prototype.transformSupport('2D');
	  Plugin.prototype.transform3DSupport = Plugin.prototype.transformSupport('3D');
	  Plugin.prototype.propertyCache = {};
	
	  Plugin.prototype.initialise = function () {
	
	    // Configure Styles
	    if (this.$context.css('position') === 'static') {
	      this.$context.css({
	        position: 'relative'
	      });
	    }
	
	    // Hardware Accelerate Context
	    this.accelerate(this.$context);
	
	    // Setup
	    this.updateLayers();
	    this.updateDimensions();
	    this.enable();
	    this.queueCalibration(this.calibrationDelay);
	  };
	
	  Plugin.prototype.updateLayers = function () {
	
	    // Cache Layer Elements
	    this.$layers = this.$context.find('.layer');
	    this.depths = [];
	
	    // Configure Layer Styles
	    this.$layers.css({
	      position: 'absolute',
	      display: 'block',
	      left: 0,
	      top: 0
	    });
	    this.$layers.first().css({
	      position: 'relative'
	    });
	
	    // Hardware Accelerate Layers
	    this.accelerate(this.$layers);
	
	    // Cache Depths
	    this.$layers.each($.proxy(function (index, element) {
	      this.depths.push($(element).data('depth') || 0);
	    }, this));
	  };
	
	  Plugin.prototype.updateDimensions = function () {
	    this.ww = window.innerWidth;
	    this.wh = window.innerHeight;
	    this.wcx = this.ww * this.originX;
	    this.wcy = this.wh * this.originY;
	    this.wrx = Math.max(this.wcx, this.ww - this.wcx);
	    this.wry = Math.max(this.wcy, this.wh - this.wcy);
	  };
	
	  Plugin.prototype.updateBounds = function () {
	    this.bounds = this.element.getBoundingClientRect();
	    this.ex = this.bounds.left;
	    this.ey = this.bounds.top;
	    this.ew = this.bounds.width;
	    this.eh = this.bounds.height;
	    this.ecx = this.ew * this.originX;
	    this.ecy = this.eh * this.originY;
	    this.erx = Math.max(this.ecx, this.ew - this.ecx);
	    this.ery = Math.max(this.ecy, this.eh - this.ecy);
	  };
	
	  Plugin.prototype.queueCalibration = function (delay) {
	    clearTimeout(this.calibrationTimer);
	    this.calibrationTimer = setTimeout(this.onCalibrationTimer, delay);
	  };
	
	  Plugin.prototype.enable = function () {
	    if (!this.enabled) {
	      this.enabled = true;
	      if (this.orientationSupport) {
	        this.portrait = null;
	        window.addEventListener('deviceorientation', this.onDeviceOrientation);
	        setTimeout(this.onOrientationTimer, this.supportDelay);
	      } else {
	        this.cx = 0;
	        this.cy = 0;
	        this.portrait = false;
	        window.addEventListener('mousemove', this.onMouseMove);
	      }
	      window.addEventListener('resize', this.onWindowResize);
	      this.raf = requestAnimationFrame(this.onAnimationFrame);
	    }
	  };
	
	  Plugin.prototype.disable = function () {
	    if (this.enabled) {
	      this.enabled = false;
	      if (this.orientationSupport) {
	        window.removeEventListener('deviceorientation', this.onDeviceOrientation);
	      } else {
	        window.removeEventListener('mousemove', this.onMouseMove);
	      }
	      window.removeEventListener('resize', this.onWindowResize);
	      cancelAnimationFrame(this.raf);
	    }
	  };
	
	  Plugin.prototype.calibrate = function (x, y) {
	    this.calibrateX = x === undefined ? this.calibrateX : x;
	    this.calibrateY = y === undefined ? this.calibrateY : y;
	  };
	
	  Plugin.prototype.invert = function (x, y) {
	    this.invertX = x === undefined ? this.invertX : x;
	    this.invertY = y === undefined ? this.invertY : y;
	  };
	
	  Plugin.prototype.friction = function (x, y) {
	    this.frictionX = x === undefined ? this.frictionX : x;
	    this.frictionY = y === undefined ? this.frictionY : y;
	  };
	
	  Plugin.prototype.scalar = function (x, y) {
	    this.scalarX = x === undefined ? this.scalarX : x;
	    this.scalarY = y === undefined ? this.scalarY : y;
	  };
	
	  Plugin.prototype.limit = function (x, y) {
	    this.limitX = x === undefined ? this.limitX : x;
	    this.limitY = y === undefined ? this.limitY : y;
	  };
	
	  Plugin.prototype.origin = function (x, y) {
	    this.originX = x === undefined ? this.originX : x;
	    this.originY = y === undefined ? this.originY : y;
	  };
	
	  Plugin.prototype.clamp = function (value, min, max) {
	    value = Math.max(value, min);
	    value = Math.min(value, max);
	    return value;
	  };
	
	  Plugin.prototype.css = function (element, property, value) {
	    var jsProperty = this.propertyCache[property];
	    if (!jsProperty) {
	      for (var i = 0, l = this.vendors.length; i < l; i++) {
	        if (this.vendors[i] !== null) {
	          jsProperty = $.camelCase(this.vendors[i][1] + '-' + property);
	        } else {
	          jsProperty = property;
	        }
	        if (element.style[jsProperty] !== undefined) {
	          this.propertyCache[property] = jsProperty;
	          break;
	        }
	      }
	    }
	    element.style[jsProperty] = value;
	  };
	
	  Plugin.prototype.accelerate = function ($element) {
	    for (var i = 0, l = $element.length; i < l; i++) {
	      var element = $element[i];
	      this.css(element, 'transform', 'translate3d(0,0,0)');
	      this.css(element, 'transform-style', 'preserve-3d');
	      this.css(element, 'backface-visibility', 'hidden');
	    }
	  };
	
	  Plugin.prototype.setPosition = function (element, x, y) {
	    x += 'px';
	    y += 'px';
	    if (this.transform3DSupport) {
	      this.css(element, 'transform', 'translate3d(' + x + ',' + y + ',0)');
	    } else if (this.transform2DSupport) {
	      this.css(element, 'transform', 'translate(' + x + ',' + y + ')');
	    } else {
	      element.style.left = x;
	      element.style.top = y;
	    }
	  };
	
	  Plugin.prototype.onOrientationTimer = function (event) {
	    if (this.orientationSupport && this.orientationStatus === 0) {
	      this.disable();
	      this.orientationSupport = false;
	      this.enable();
	    }
	  };
	
	  Plugin.prototype.onCalibrationTimer = function (event) {
	    this.calibrationFlag = true;
	  };
	
	  Plugin.prototype.onWindowResize = function (event) {
	    this.updateDimensions();
	  };
	
	  Plugin.prototype.onAnimationFrame = function () {
	    this.updateBounds();
	    var dx = this.ix - this.cx;
	    var dy = this.iy - this.cy;
	    if (Math.abs(dx) > this.calibrationThreshold || Math.abs(dy) > this.calibrationThreshold) {
	      this.queueCalibration(0);
	    }
	    if (this.portrait) {
	      this.mx = this.calibrateX ? dy : this.iy;
	      this.my = this.calibrateY ? dx : this.ix;
	    } else {
	      this.mx = this.calibrateX ? dx : this.ix;
	      this.my = this.calibrateY ? dy : this.iy;
	    }
	    this.mx *= this.ew * (this.scalarX / 100);
	    this.my *= this.eh * (this.scalarY / 100);
	    if (!isNaN(parseFloat(this.limitX))) {
	      this.mx = this.clamp(this.mx, -this.limitX, this.limitX);
	    }
	    if (!isNaN(parseFloat(this.limitY))) {
	      this.my = this.clamp(this.my, -this.limitY, this.limitY);
	    }
	    this.vx += (this.mx - this.vx) * this.frictionX;
	    this.vy += (this.my - this.vy) * this.frictionY;
	    for (var i = 0, l = this.$layers.length; i < l; i++) {
	      var depth = this.depths[i];
	      var layer = this.$layers[i];
	      var xOffset = this.vx * depth * (this.invertX ? -1 : 1);
	      var yOffset = this.vy * depth * (this.invertY ? -1 : 1);
	      this.setPosition(layer, xOffset, yOffset);
	    }
	    this.raf = requestAnimationFrame(this.onAnimationFrame);
	  };
	
	  Plugin.prototype.onDeviceOrientation = function (event) {
	
	    // Validate environment and event properties.
	    if (!this.desktop && event.beta !== null && event.gamma !== null) {
	
	      // Set orientation status.
	      this.orientationStatus = 1;
	
	      // Extract Rotation
	      var x = (event.beta || 0) / MAGIC_NUMBER; //  -90 :: 90
	      var y = (event.gamma || 0) / MAGIC_NUMBER; // -180 :: 180
	
	      // Detect Orientation Change
	      var portrait = window.innerHeight > window.innerWidth;
	      if (this.portrait !== portrait) {
	        this.portrait = portrait;
	        this.calibrationFlag = true;
	      }
	
	      // Set Calibration
	      if (this.calibrationFlag) {
	        this.calibrationFlag = false;
	        this.cx = x;
	        this.cy = y;
	      }
	
	      // Set Input
	      this.ix = x;
	      this.iy = y;
	    }
	  };
	
	  Plugin.prototype.onMouseMove = function (event) {
	
	    // Cache mouse coordinates.
	    var clientX = event.clientX;
	    var clientY = event.clientY;
	
	    // Calculate Mouse Input
	    if (!this.orientationSupport && this.relativeInput) {
	
	      // Clip mouse coordinates inside element bounds.
	      if (this.clipRelativeInput) {
	        clientX = Math.max(clientX, this.ex);
	        clientX = Math.min(clientX, this.ex + this.ew);
	        clientY = Math.max(clientY, this.ey);
	        clientY = Math.min(clientY, this.ey + this.eh);
	      }
	
	      // Calculate input relative to the element.
	      this.ix = (clientX - this.ex - this.ecx) / this.erx;
	      this.iy = (clientY - this.ey - this.ecy) / this.ery;
	    } else {
	
	      // Calculate input relative to the window.
	      this.ix = (clientX - this.wcx) / this.wrx;
	      this.iy = (clientY - this.wcy) / this.wry;
	    }
	  };
	
	  var API = {
	    enable: Plugin.prototype.enable,
	    disable: Plugin.prototype.disable,
	    updateLayers: Plugin.prototype.updateLayers,
	    calibrate: Plugin.prototype.calibrate,
	    friction: Plugin.prototype.friction,
	    invert: Plugin.prototype.invert,
	    scalar: Plugin.prototype.scalar,
	    limit: Plugin.prototype.limit,
	    origin: Plugin.prototype.origin
	  };
	
	  $.fn[NAME] = function (value) {
	    var args = arguments;
	    return this.each(function () {
	      var $this = $(this);
	      var plugin = $this.data(NAME);
	      if (!plugin) {
	        plugin = new Plugin(this, value);
	        $this.data(NAME, plugin);
	      }
	      if (API[value]) {
	        plugin[value].apply(plugin, Array.prototype.slice.call(args, 1));
	      }
	    });
	  };
	})(jQuery || window.Zepto, window, document);
	
	var letters = ['M', 'A', 'T', 'T'];
	var wrapper1 = $('<div></div>').addClass('wrapper');
	
	for (var i = 0; i < letters.length; i++) {
	  var scene = $('<div></div>').addClass('scene');
	  for (var j = 0; j < 10; j++) {
	    var el = $('<div></div>').text(letters[i]).addClass('layer').attr('data-depth', j * 0.03);
	    scene.append(el);
	  }
	  $(scene).parallax({
	    scalarX: 30,
	    scalarY: 20,
	    originX: 0.65,
	    originY: 0.5
	  });
	  $(wrapper1).append(scene);
	}
	
	var letters2 = ['O', 'X', 'L', 'E', 'Y'];
	var wrapper2 = $('<div></div>').addClass('wrapper');
	
	for (var i = 0; i < letters2.length; i++) {
	  var scene = $('<div></div>').addClass('scene');
	  for (var j = 0; j < 10; j++) {
	    var el = $('<div></div>').text(letters2[i]).addClass('layer').attr('data-depth', j * 0.03);
	    scene.append(el);
	  }
	  $(scene).parallax({
	    scalarX: 30 * -1,
	    scalarY: 20 * -1,
	    originX: 0.65,
	    originY: 0.5
	  });
	  $(wrapper2).append(scene);
	}
	
	//var eyeWrapper = $('<div></div>').addClass('scene eye-wrapper');
	
	// var eye1 = $('<div></div>').addClass('eye');
	// var pupil1 = $('<div></div>').addClass('layer pupil').attr('data-depth', 0.8);
	// var highlight1 = $('<div></div>').addClass('layer highlight').attr('data-depth', 0.3);
	// pupil1.append(highlight1);
	// eye1.append(pupil1);
	// var eye2 = $('<div></div>').addClass('eye');
	// var pupil2 = $('<div></div>').addClass('pupil layer').attr('data-depth', 0.8);
	// var highlight2 = $('<div></div>').addClass('layer highlight').attr('data-depth', 0.3);
	// pupil2.append(highlight2);
	// eye2.append(pupil2);
	// eyeWrapper.append(eye1);
	// eyeWrapper.append(eye2);
	
	var smile = $('<div></div>').addClass('smile');
	var sidePanel = $('.side-panel');
	
	$('.text').append(wrapper1);
	$('.text').append(wrapper2);
	$('body').append(sidePanel);
	//$('body').append(eyeWrapper);
	//$(eyeWrapper).append(smile);
	
	// $(eyeWrapper).parallax({
	// 	scalarX: -10,
	// 	scalarY: -10,
	// 	originX: 0.5,
	// 	originY: 0.5
	// });
	
	
	$(document).ready(function () {
	  $(wrapper1).addClass('loaded');
	  $(wrapper2).addClass('loaded');
	  $(sidePanel).addClass('loaded');
	  $('.logo-wrapper').addClass('loaded');
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(2)))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * jQuery JavaScript Library v3.1.1
	 * https://jquery.com/
	 *
	 * Includes Sizzle.js
	 * https://sizzlejs.com/
	 *
	 * Copyright jQuery Foundation and other contributors
	 * Released under the MIT license
	 * https://jquery.org/license
	 *
	 * Date: 2016-09-22T22:30Z
	 */
	( function( global, factory ) {
	
		"use strict";
	
		if ( typeof module === "object" && typeof module.exports === "object" ) {
	
			// For CommonJS and CommonJS-like environments where a proper `window`
			// is present, execute the factory and get jQuery.
			// For environments that do not have a `window` with a `document`
			// (such as Node.js), expose a factory as module.exports.
			// This accentuates the need for the creation of a real `window`.
			// e.g. var jQuery = require("jquery")(window);
			// See ticket #14549 for more info.
			module.exports = global.document ?
				factory( global, true ) :
				function( w ) {
					if ( !w.document ) {
						throw new Error( "jQuery requires a window with a document" );
					}
					return factory( w );
				};
		} else {
			factory( global );
		}
	
	// Pass this if window is not defined yet
	} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {
	
	// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
	// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
	// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
	// enough that all such attempts are guarded in a try block.
	"use strict";
	
	var arr = [];
	
	var document = window.document;
	
	var getProto = Object.getPrototypeOf;
	
	var slice = arr.slice;
	
	var concat = arr.concat;
	
	var push = arr.push;
	
	var indexOf = arr.indexOf;
	
	var class2type = {};
	
	var toString = class2type.toString;
	
	var hasOwn = class2type.hasOwnProperty;
	
	var fnToString = hasOwn.toString;
	
	var ObjectFunctionString = fnToString.call( Object );
	
	var support = {};
	
	
	
		function DOMEval( code, doc ) {
			doc = doc || document;
	
			var script = doc.createElement( "script" );
	
			script.text = code;
			doc.head.appendChild( script ).parentNode.removeChild( script );
		}
	/* global Symbol */
	// Defining this global in .eslintrc.json would create a danger of using the global
	// unguarded in another place, it seems safer to define global only for this module
	
	
	
	var
		version = "3.1.1",
	
		// Define a local copy of jQuery
		jQuery = function( selector, context ) {
	
			// The jQuery object is actually just the init constructor 'enhanced'
			// Need init if jQuery is called (just allow error to be thrown if not included)
			return new jQuery.fn.init( selector, context );
		},
	
		// Support: Android <=4.0 only
		// Make sure we trim BOM and NBSP
		rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
	
		// Matches dashed string for camelizing
		rmsPrefix = /^-ms-/,
		rdashAlpha = /-([a-z])/g,
	
		// Used by jQuery.camelCase as callback to replace()
		fcamelCase = function( all, letter ) {
			return letter.toUpperCase();
		};
	
	jQuery.fn = jQuery.prototype = {
	
		// The current version of jQuery being used
		jquery: version,
	
		constructor: jQuery,
	
		// The default length of a jQuery object is 0
		length: 0,
	
		toArray: function() {
			return slice.call( this );
		},
	
		// Get the Nth element in the matched element set OR
		// Get the whole matched element set as a clean array
		get: function( num ) {
	
			// Return all the elements in a clean array
			if ( num == null ) {
				return slice.call( this );
			}
	
			// Return just the one element from the set
			return num < 0 ? this[ num + this.length ] : this[ num ];
		},
	
		// Take an array of elements and push it onto the stack
		// (returning the new matched element set)
		pushStack: function( elems ) {
	
			// Build a new jQuery matched element set
			var ret = jQuery.merge( this.constructor(), elems );
	
			// Add the old object onto the stack (as a reference)
			ret.prevObject = this;
	
			// Return the newly-formed element set
			return ret;
		},
	
		// Execute a callback for every element in the matched set.
		each: function( callback ) {
			return jQuery.each( this, callback );
		},
	
		map: function( callback ) {
			return this.pushStack( jQuery.map( this, function( elem, i ) {
				return callback.call( elem, i, elem );
			} ) );
		},
	
		slice: function() {
			return this.pushStack( slice.apply( this, arguments ) );
		},
	
		first: function() {
			return this.eq( 0 );
		},
	
		last: function() {
			return this.eq( -1 );
		},
	
		eq: function( i ) {
			var len = this.length,
				j = +i + ( i < 0 ? len : 0 );
			return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
		},
	
		end: function() {
			return this.prevObject || this.constructor();
		},
	
		// For internal use only.
		// Behaves like an Array's method, not like a jQuery method.
		push: push,
		sort: arr.sort,
		splice: arr.splice
	};
	
	jQuery.extend = jQuery.fn.extend = function() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[ 0 ] || {},
			i = 1,
			length = arguments.length,
			deep = false;
	
		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;
	
			// Skip the boolean and the target
			target = arguments[ i ] || {};
			i++;
		}
	
		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
			target = {};
		}
	
		// Extend jQuery itself if only one argument is passed
		if ( i === length ) {
			target = this;
			i--;
		}
	
		for ( ; i < length; i++ ) {
	
			// Only deal with non-null/undefined values
			if ( ( options = arguments[ i ] ) != null ) {
	
				// Extend the base object
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];
	
					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}
	
					// Recurse if we're merging plain objects or arrays
					if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
						( copyIsArray = jQuery.isArray( copy ) ) ) ) {
	
						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && jQuery.isArray( src ) ? src : [];
	
						} else {
							clone = src && jQuery.isPlainObject( src ) ? src : {};
						}
	
						// Never move original objects, clone them
						target[ name ] = jQuery.extend( deep, clone, copy );
	
					// Don't bring in undefined values
					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}
	
		// Return the modified object
		return target;
	};
	
	jQuery.extend( {
	
		// Unique for each copy of jQuery on the page
		expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),
	
		// Assume jQuery is ready without the ready module
		isReady: true,
	
		error: function( msg ) {
			throw new Error( msg );
		},
	
		noop: function() {},
	
		isFunction: function( obj ) {
			return jQuery.type( obj ) === "function";
		},
	
		isArray: Array.isArray,
	
		isWindow: function( obj ) {
			return obj != null && obj === obj.window;
		},
	
		isNumeric: function( obj ) {
	
			// As of jQuery 3.0, isNumeric is limited to
			// strings and numbers (primitives or objects)
			// that can be coerced to finite numbers (gh-2662)
			var type = jQuery.type( obj );
			return ( type === "number" || type === "string" ) &&
	
				// parseFloat NaNs numeric-cast false positives ("")
				// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
				// subtraction forces infinities to NaN
				!isNaN( obj - parseFloat( obj ) );
		},
	
		isPlainObject: function( obj ) {
			var proto, Ctor;
	
			// Detect obvious negatives
			// Use toString instead of jQuery.type to catch host objects
			if ( !obj || toString.call( obj ) !== "[object Object]" ) {
				return false;
			}
	
			proto = getProto( obj );
	
			// Objects with no prototype (e.g., `Object.create( null )`) are plain
			if ( !proto ) {
				return true;
			}
	
			// Objects with prototype are plain iff they were constructed by a global Object function
			Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
			return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
		},
	
		isEmptyObject: function( obj ) {
	
			/* eslint-disable no-unused-vars */
			// See https://github.com/eslint/eslint/issues/6125
			var name;
	
			for ( name in obj ) {
				return false;
			}
			return true;
		},
	
		type: function( obj ) {
			if ( obj == null ) {
				return obj + "";
			}
	
			// Support: Android <=2.3 only (functionish RegExp)
			return typeof obj === "object" || typeof obj === "function" ?
				class2type[ toString.call( obj ) ] || "object" :
				typeof obj;
		},
	
		// Evaluates a script in a global context
		globalEval: function( code ) {
			DOMEval( code );
		},
	
		// Convert dashed to camelCase; used by the css and data modules
		// Support: IE <=9 - 11, Edge 12 - 13
		// Microsoft forgot to hump their vendor prefix (#9572)
		camelCase: function( string ) {
			return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
		},
	
		nodeName: function( elem, name ) {
			return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
		},
	
		each: function( obj, callback ) {
			var length, i = 0;
	
			if ( isArrayLike( obj ) ) {
				length = obj.length;
				for ( ; i < length; i++ ) {
					if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
						break;
					}
				}
			}
	
			return obj;
		},
	
		// Support: Android <=4.0 only
		trim: function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},
	
		// results is for internal usage only
		makeArray: function( arr, results ) {
			var ret = results || [];
	
			if ( arr != null ) {
				if ( isArrayLike( Object( arr ) ) ) {
					jQuery.merge( ret,
						typeof arr === "string" ?
						[ arr ] : arr
					);
				} else {
					push.call( ret, arr );
				}
			}
	
			return ret;
		},
	
		inArray: function( elem, arr, i ) {
			return arr == null ? -1 : indexOf.call( arr, elem, i );
		},
	
		// Support: Android <=4.0 only, PhantomJS 1 only
		// push.apply(_, arraylike) throws on ancient WebKit
		merge: function( first, second ) {
			var len = +second.length,
				j = 0,
				i = first.length;
	
			for ( ; j < len; j++ ) {
				first[ i++ ] = second[ j ];
			}
	
			first.length = i;
	
			return first;
		},
	
		grep: function( elems, callback, invert ) {
			var callbackInverse,
				matches = [],
				i = 0,
				length = elems.length,
				callbackExpect = !invert;
	
			// Go through the array, only saving the items
			// that pass the validator function
			for ( ; i < length; i++ ) {
				callbackInverse = !callback( elems[ i ], i );
				if ( callbackInverse !== callbackExpect ) {
					matches.push( elems[ i ] );
				}
			}
	
			return matches;
		},
	
		// arg is for internal usage only
		map: function( elems, callback, arg ) {
			var length, value,
				i = 0,
				ret = [];
	
			// Go through the array, translating each of the items to their new values
			if ( isArrayLike( elems ) ) {
				length = elems.length;
				for ( ; i < length; i++ ) {
					value = callback( elems[ i ], i, arg );
	
					if ( value != null ) {
						ret.push( value );
					}
				}
	
			// Go through every key on the object,
			} else {
				for ( i in elems ) {
					value = callback( elems[ i ], i, arg );
	
					if ( value != null ) {
						ret.push( value );
					}
				}
			}
	
			// Flatten any nested arrays
			return concat.apply( [], ret );
		},
	
		// A global GUID counter for objects
		guid: 1,
	
		// Bind a function to a context, optionally partially applying any
		// arguments.
		proxy: function( fn, context ) {
			var tmp, args, proxy;
	
			if ( typeof context === "string" ) {
				tmp = fn[ context ];
				context = fn;
				fn = tmp;
			}
	
			// Quick check to determine if target is callable, in the spec
			// this throws a TypeError, but we will just return undefined.
			if ( !jQuery.isFunction( fn ) ) {
				return undefined;
			}
	
			// Simulated bind
			args = slice.call( arguments, 2 );
			proxy = function() {
				return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
			};
	
			// Set the guid of unique handler to the same of original handler, so it can be removed
			proxy.guid = fn.guid = fn.guid || jQuery.guid++;
	
			return proxy;
		},
	
		now: Date.now,
	
		// jQuery.support is not used in Core but other projects attach their
		// properties to it so it needs to exist.
		support: support
	} );
	
	if ( typeof Symbol === "function" ) {
		jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
	}
	
	// Populate the class2type map
	jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
	function( i, name ) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	} );
	
	function isArrayLike( obj ) {
	
		// Support: real iOS 8.2 only (not reproducible in simulator)
		// `in` check used to prevent JIT error (gh-2145)
		// hasOwn isn't used here due to false negatives
		// regarding Nodelist length in IE
		var length = !!obj && "length" in obj && obj.length,
			type = jQuery.type( obj );
	
		if ( type === "function" || jQuery.isWindow( obj ) ) {
			return false;
		}
	
		return type === "array" || length === 0 ||
			typeof length === "number" && length > 0 && ( length - 1 ) in obj;
	}
	var Sizzle =
	/*!
	 * Sizzle CSS Selector Engine v2.3.3
	 * https://sizzlejs.com/
	 *
	 * Copyright jQuery Foundation and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 *
	 * Date: 2016-08-08
	 */
	(function( window ) {
	
	var i,
		support,
		Expr,
		getText,
		isXML,
		tokenize,
		compile,
		select,
		outermostContext,
		sortInput,
		hasDuplicate,
	
		// Local document vars
		setDocument,
		document,
		docElem,
		documentIsHTML,
		rbuggyQSA,
		rbuggyMatches,
		matches,
		contains,
	
		// Instance-specific data
		expando = "sizzle" + 1 * new Date(),
		preferredDoc = window.document,
		dirruns = 0,
		done = 0,
		classCache = createCache(),
		tokenCache = createCache(),
		compilerCache = createCache(),
		sortOrder = function( a, b ) {
			if ( a === b ) {
				hasDuplicate = true;
			}
			return 0;
		},
	
		// Instance methods
		hasOwn = ({}).hasOwnProperty,
		arr = [],
		pop = arr.pop,
		push_native = arr.push,
		push = arr.push,
		slice = arr.slice,
		// Use a stripped-down indexOf as it's faster than native
		// https://jsperf.com/thor-indexof-vs-for/5
		indexOf = function( list, elem ) {
			var i = 0,
				len = list.length;
			for ( ; i < len; i++ ) {
				if ( list[i] === elem ) {
					return i;
				}
			}
			return -1;
		},
	
		booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
	
		// Regular expressions
	
		// http://www.w3.org/TR/css3-selectors/#whitespace
		whitespace = "[\\x20\\t\\r\\n\\f]",
	
		// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
		identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",
	
		// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
		attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
			// Operator (capture 2)
			"*([*^$|!~]?=)" + whitespace +
			// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
			"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
			"*\\]",
	
		pseudos = ":(" + identifier + ")(?:\\((" +
			// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
			// 1. quoted (capture 3; capture 4 or capture 5)
			"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
			// 2. simple (capture 6)
			"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
			// 3. anything else (capture 2)
			".*" +
			")\\)|)",
	
		// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
		rwhitespace = new RegExp( whitespace + "+", "g" ),
		rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),
	
		rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
		rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),
	
		rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),
	
		rpseudo = new RegExp( pseudos ),
		ridentifier = new RegExp( "^" + identifier + "$" ),
	
		matchExpr = {
			"ID": new RegExp( "^#(" + identifier + ")" ),
			"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
			"TAG": new RegExp( "^(" + identifier + "|[*])" ),
			"ATTR": new RegExp( "^" + attributes ),
			"PSEUDO": new RegExp( "^" + pseudos ),
			"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
				"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
				"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
			"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
			// For use in libraries implementing .is()
			// We use this for POS matching in `select`
			"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
				whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
		},
	
		rinputs = /^(?:input|select|textarea|button)$/i,
		rheader = /^h\d$/i,
	
		rnative = /^[^{]+\{\s*\[native \w/,
	
		// Easily-parseable/retrievable ID or TAG or CLASS selectors
		rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
	
		rsibling = /[+~]/,
	
		// CSS escapes
		// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
		runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
		funescape = function( _, escaped, escapedWhitespace ) {
			var high = "0x" + escaped - 0x10000;
			// NaN means non-codepoint
			// Support: Firefox<24
			// Workaround erroneous numeric interpretation of +"0x"
			return high !== high || escapedWhitespace ?
				escaped :
				high < 0 ?
					// BMP codepoint
					String.fromCharCode( high + 0x10000 ) :
					// Supplemental Plane codepoint (surrogate pair)
					String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
		},
	
		// CSS string/identifier serialization
		// https://drafts.csswg.org/cssom/#common-serializing-idioms
		rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
		fcssescape = function( ch, asCodePoint ) {
			if ( asCodePoint ) {
	
				// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
				if ( ch === "\0" ) {
					return "\uFFFD";
				}
	
				// Control characters and (dependent upon position) numbers get escaped as code points
				return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
			}
	
			// Other potentially-special ASCII characters get backslash-escaped
			return "\\" + ch;
		},
	
		// Used for iframes
		// See setDocument()
		// Removing the function wrapper causes a "Permission Denied"
		// error in IE
		unloadHandler = function() {
			setDocument();
		},
	
		disabledAncestor = addCombinator(
			function( elem ) {
				return elem.disabled === true && ("form" in elem || "label" in elem);
			},
			{ dir: "parentNode", next: "legend" }
		);
	
	// Optimize for push.apply( _, NodeList )
	try {
		push.apply(
			(arr = slice.call( preferredDoc.childNodes )),
			preferredDoc.childNodes
		);
		// Support: Android<4.0
		// Detect silently failing push.apply
		arr[ preferredDoc.childNodes.length ].nodeType;
	} catch ( e ) {
		push = { apply: arr.length ?
	
			// Leverage slice if possible
			function( target, els ) {
				push_native.apply( target, slice.call(els) );
			} :
	
			// Support: IE<9
			// Otherwise append directly
			function( target, els ) {
				var j = target.length,
					i = 0;
				// Can't trust NodeList.length
				while ( (target[j++] = els[i++]) ) {}
				target.length = j - 1;
			}
		};
	}
	
	function Sizzle( selector, context, results, seed ) {
		var m, i, elem, nid, match, groups, newSelector,
			newContext = context && context.ownerDocument,
	
			// nodeType defaults to 9, since context defaults to document
			nodeType = context ? context.nodeType : 9;
	
		results = results || [];
	
		// Return early from calls with invalid selector or context
		if ( typeof selector !== "string" || !selector ||
			nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {
	
			return results;
		}
	
		// Try to shortcut find operations (as opposed to filters) in HTML documents
		if ( !seed ) {
	
			if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
				setDocument( context );
			}
			context = context || document;
	
			if ( documentIsHTML ) {
	
				// If the selector is sufficiently simple, try using a "get*By*" DOM method
				// (excepting DocumentFragment context, where the methods don't exist)
				if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {
	
					// ID selector
					if ( (m = match[1]) ) {
	
						// Document context
						if ( nodeType === 9 ) {
							if ( (elem = context.getElementById( m )) ) {
	
								// Support: IE, Opera, Webkit
								// TODO: identify versions
								// getElementById can match elements by name instead of ID
								if ( elem.id === m ) {
									results.push( elem );
									return results;
								}
							} else {
								return results;
							}
	
						// Element context
						} else {
	
							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( newContext && (elem = newContext.getElementById( m )) &&
								contains( context, elem ) &&
								elem.id === m ) {
	
								results.push( elem );
								return results;
							}
						}
	
					// Type selector
					} else if ( match[2] ) {
						push.apply( results, context.getElementsByTagName( selector ) );
						return results;
	
					// Class selector
					} else if ( (m = match[3]) && support.getElementsByClassName &&
						context.getElementsByClassName ) {
	
						push.apply( results, context.getElementsByClassName( m ) );
						return results;
					}
				}
	
				// Take advantage of querySelectorAll
				if ( support.qsa &&
					!compilerCache[ selector + " " ] &&
					(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
	
					if ( nodeType !== 1 ) {
						newContext = context;
						newSelector = selector;
	
					// qSA looks outside Element context, which is not what we want
					// Thanks to Andrew Dupont for this workaround technique
					// Support: IE <=8
					// Exclude object elements
					} else if ( context.nodeName.toLowerCase() !== "object" ) {
	
						// Capture the context ID, setting it first if necessary
						if ( (nid = context.getAttribute( "id" )) ) {
							nid = nid.replace( rcssescape, fcssescape );
						} else {
							context.setAttribute( "id", (nid = expando) );
						}
	
						// Prefix every selector in the list
						groups = tokenize( selector );
						i = groups.length;
						while ( i-- ) {
							groups[i] = "#" + nid + " " + toSelector( groups[i] );
						}
						newSelector = groups.join( "," );
	
						// Expand context for sibling selectors
						newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
							context;
					}
	
					if ( newSelector ) {
						try {
							push.apply( results,
								newContext.querySelectorAll( newSelector )
							);
							return results;
						} catch ( qsaError ) {
						} finally {
							if ( nid === expando ) {
								context.removeAttribute( "id" );
							}
						}
					}
				}
			}
		}
	
		// All others
		return select( selector.replace( rtrim, "$1" ), context, results, seed );
	}
	
	/**
	 * Create key-value caches of limited size
	 * @returns {function(string, object)} Returns the Object data after storing it on itself with
	 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
	 *	deleting the oldest entry
	 */
	function createCache() {
		var keys = [];
	
		function cache( key, value ) {
			// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
			if ( keys.push( key + " " ) > Expr.cacheLength ) {
				// Only keep the most recent entries
				delete cache[ keys.shift() ];
			}
			return (cache[ key + " " ] = value);
		}
		return cache;
	}
	
	/**
	 * Mark a function for special use by Sizzle
	 * @param {Function} fn The function to mark
	 */
	function markFunction( fn ) {
		fn[ expando ] = true;
		return fn;
	}
	
	/**
	 * Support testing using an element
	 * @param {Function} fn Passed the created element and returns a boolean result
	 */
	function assert( fn ) {
		var el = document.createElement("fieldset");
	
		try {
			return !!fn( el );
		} catch (e) {
			return false;
		} finally {
			// Remove from its parent by default
			if ( el.parentNode ) {
				el.parentNode.removeChild( el );
			}
			// release memory in IE
			el = null;
		}
	}
	
	/**
	 * Adds the same handler for all of the specified attrs
	 * @param {String} attrs Pipe-separated list of attributes
	 * @param {Function} handler The method that will be applied
	 */
	function addHandle( attrs, handler ) {
		var arr = attrs.split("|"),
			i = arr.length;
	
		while ( i-- ) {
			Expr.attrHandle[ arr[i] ] = handler;
		}
	}
	
	/**
	 * Checks document order of two siblings
	 * @param {Element} a
	 * @param {Element} b
	 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
	 */
	function siblingCheck( a, b ) {
		var cur = b && a,
			diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
				a.sourceIndex - b.sourceIndex;
	
		// Use IE sourceIndex if available on both nodes
		if ( diff ) {
			return diff;
		}
	
		// Check if b follows a
		if ( cur ) {
			while ( (cur = cur.nextSibling) ) {
				if ( cur === b ) {
					return -1;
				}
			}
		}
	
		return a ? 1 : -1;
	}
	
	/**
	 * Returns a function to use in pseudos for input types
	 * @param {String} type
	 */
	function createInputPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === type;
		};
	}
	
	/**
	 * Returns a function to use in pseudos for buttons
	 * @param {String} type
	 */
	function createButtonPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && elem.type === type;
		};
	}
	
	/**
	 * Returns a function to use in pseudos for :enabled/:disabled
	 * @param {Boolean} disabled true for :disabled; false for :enabled
	 */
	function createDisabledPseudo( disabled ) {
	
		// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
		return function( elem ) {
	
			// Only certain elements can match :enabled or :disabled
			// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
			// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
			if ( "form" in elem ) {
	
				// Check for inherited disabledness on relevant non-disabled elements:
				// * listed form-associated elements in a disabled fieldset
				//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
				//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
				// * option elements in a disabled optgroup
				//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
				// All such elements have a "form" property.
				if ( elem.parentNode && elem.disabled === false ) {
	
					// Option elements defer to a parent optgroup if present
					if ( "label" in elem ) {
						if ( "label" in elem.parentNode ) {
							return elem.parentNode.disabled === disabled;
						} else {
							return elem.disabled === disabled;
						}
					}
	
					// Support: IE 6 - 11
					// Use the isDisabled shortcut property to check for disabled fieldset ancestors
					return elem.isDisabled === disabled ||
	
						// Where there is no isDisabled, check manually
						/* jshint -W018 */
						elem.isDisabled !== !disabled &&
							disabledAncestor( elem ) === disabled;
				}
	
				return elem.disabled === disabled;
	
			// Try to winnow out elements that can't be disabled before trusting the disabled property.
			// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
			// even exist on them, let alone have a boolean value.
			} else if ( "label" in elem ) {
				return elem.disabled === disabled;
			}
	
			// Remaining elements are neither :enabled nor :disabled
			return false;
		};
	}
	
	/**
	 * Returns a function to use in pseudos for positionals
	 * @param {Function} fn
	 */
	function createPositionalPseudo( fn ) {
		return markFunction(function( argument ) {
			argument = +argument;
			return markFunction(function( seed, matches ) {
				var j,
					matchIndexes = fn( [], seed.length, argument ),
					i = matchIndexes.length;
	
				// Match elements found at the specified indexes
				while ( i-- ) {
					if ( seed[ (j = matchIndexes[i]) ] ) {
						seed[j] = !(matches[j] = seed[j]);
					}
				}
			});
		});
	}
	
	/**
	 * Checks a node for validity as a Sizzle context
	 * @param {Element|Object=} context
	 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
	 */
	function testContext( context ) {
		return context && typeof context.getElementsByTagName !== "undefined" && context;
	}
	
	// Expose support vars for convenience
	support = Sizzle.support = {};
	
	/**
	 * Detects XML nodes
	 * @param {Element|Object} elem An element or a document
	 * @returns {Boolean} True iff elem is a non-HTML XML node
	 */
	isXML = Sizzle.isXML = function( elem ) {
		// documentElement is verified for cases where it doesn't yet exist
		// (such as loading iframes in IE - #4833)
		var documentElement = elem && (elem.ownerDocument || elem).documentElement;
		return documentElement ? documentElement.nodeName !== "HTML" : false;
	};
	
	/**
	 * Sets document-related variables once based on the current document
	 * @param {Element|Object} [doc] An element or document object to use to set the document
	 * @returns {Object} Returns the current document
	 */
	setDocument = Sizzle.setDocument = function( node ) {
		var hasCompare, subWindow,
			doc = node ? node.ownerDocument || node : preferredDoc;
	
		// Return early if doc is invalid or already selected
		if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
			return document;
		}
	
		// Update global variables
		document = doc;
		docElem = document.documentElement;
		documentIsHTML = !isXML( document );
	
		// Support: IE 9-11, Edge
		// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
		if ( preferredDoc !== document &&
			(subWindow = document.defaultView) && subWindow.top !== subWindow ) {
	
			// Support: IE 11, Edge
			if ( subWindow.addEventListener ) {
				subWindow.addEventListener( "unload", unloadHandler, false );
	
			// Support: IE 9 - 10 only
			} else if ( subWindow.attachEvent ) {
				subWindow.attachEvent( "onunload", unloadHandler );
			}
		}
	
		/* Attributes
		---------------------------------------------------------------------- */
	
		// Support: IE<8
		// Verify that getAttribute really returns attributes and not properties
		// (excepting IE8 booleans)
		support.attributes = assert(function( el ) {
			el.className = "i";
			return !el.getAttribute("className");
		});
	
		/* getElement(s)By*
		---------------------------------------------------------------------- */
	
		// Check if getElementsByTagName("*") returns only elements
		support.getElementsByTagName = assert(function( el ) {
			el.appendChild( document.createComment("") );
			return !el.getElementsByTagName("*").length;
		});
	
		// Support: IE<9
		support.getElementsByClassName = rnative.test( document.getElementsByClassName );
	
		// Support: IE<10
		// Check if getElementById returns elements by name
		// The broken getElementById methods don't pick up programmatically-set names,
		// so use a roundabout getElementsByName test
		support.getById = assert(function( el ) {
			docElem.appendChild( el ).id = expando;
			return !document.getElementsByName || !document.getElementsByName( expando ).length;
		});
	
		// ID filter and find
		if ( support.getById ) {
			Expr.filter["ID"] = function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					return elem.getAttribute("id") === attrId;
				};
			};
			Expr.find["ID"] = function( id, context ) {
				if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
					var elem = context.getElementById( id );
					return elem ? [ elem ] : [];
				}
			};
		} else {
			Expr.filter["ID"] =  function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					var node = typeof elem.getAttributeNode !== "undefined" &&
						elem.getAttributeNode("id");
					return node && node.value === attrId;
				};
			};
	
			// Support: IE 6 - 7 only
			// getElementById is not reliable as a find shortcut
			Expr.find["ID"] = function( id, context ) {
				if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
					var node, i, elems,
						elem = context.getElementById( id );
	
					if ( elem ) {
	
						// Verify the id attribute
						node = elem.getAttributeNode("id");
						if ( node && node.value === id ) {
							return [ elem ];
						}
	
						// Fall back on getElementsByName
						elems = context.getElementsByName( id );
						i = 0;
						while ( (elem = elems[i++]) ) {
							node = elem.getAttributeNode("id");
							if ( node && node.value === id ) {
								return [ elem ];
							}
						}
					}
	
					return [];
				}
			};
		}
	
		// Tag
		Expr.find["TAG"] = support.getElementsByTagName ?
			function( tag, context ) {
				if ( typeof context.getElementsByTagName !== "undefined" ) {
					return context.getElementsByTagName( tag );
	
				// DocumentFragment nodes don't have gEBTN
				} else if ( support.qsa ) {
					return context.querySelectorAll( tag );
				}
			} :
	
			function( tag, context ) {
				var elem,
					tmp = [],
					i = 0,
					// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
					results = context.getElementsByTagName( tag );
	
				// Filter out possible comments
				if ( tag === "*" ) {
					while ( (elem = results[i++]) ) {
						if ( elem.nodeType === 1 ) {
							tmp.push( elem );
						}
					}
	
					return tmp;
				}
				return results;
			};
	
		// Class
		Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
			if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
				return context.getElementsByClassName( className );
			}
		};
	
		/* QSA/matchesSelector
		---------------------------------------------------------------------- */
	
		// QSA and matchesSelector support
	
		// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
		rbuggyMatches = [];
	
		// qSa(:focus) reports false when true (Chrome 21)
		// We allow this because of a bug in IE8/9 that throws an error
		// whenever `document.activeElement` is accessed on an iframe
		// So, we allow :focus to pass through QSA all the time to avoid the IE error
		// See https://bugs.jquery.com/ticket/13378
		rbuggyQSA = [];
	
		if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
			// Build QSA regex
			// Regex strategy adopted from Diego Perini
			assert(function( el ) {
				// Select is set to empty string on purpose
				// This is to test IE's treatment of not explicitly
				// setting a boolean content attribute,
				// since its presence should be enough
				// https://bugs.jquery.com/ticket/12359
				docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
					"<select id='" + expando + "-\r\\' msallowcapture=''>" +
					"<option selected=''></option></select>";
	
				// Support: IE8, Opera 11-12.16
				// Nothing should be selected when empty strings follow ^= or $= or *=
				// The test attribute must be unknown in Opera but "safe" for WinRT
				// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
				if ( el.querySelectorAll("[msallowcapture^='']").length ) {
					rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
				}
	
				// Support: IE8
				// Boolean attributes and "value" are not treated correctly
				if ( !el.querySelectorAll("[selected]").length ) {
					rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
				}
	
				// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
				if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
					rbuggyQSA.push("~=");
				}
	
				// Webkit/Opera - :checked should return selected option elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				// IE8 throws error here and will not see later tests
				if ( !el.querySelectorAll(":checked").length ) {
					rbuggyQSA.push(":checked");
				}
	
				// Support: Safari 8+, iOS 8+
				// https://bugs.webkit.org/show_bug.cgi?id=136851
				// In-page `selector#id sibling-combinator selector` fails
				if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
					rbuggyQSA.push(".#.+[+~]");
				}
			});
	
			assert(function( el ) {
				el.innerHTML = "<a href='' disabled='disabled'></a>" +
					"<select disabled='disabled'><option/></select>";
	
				// Support: Windows 8 Native Apps
				// The type and name attributes are restricted during .innerHTML assignment
				var input = document.createElement("input");
				input.setAttribute( "type", "hidden" );
				el.appendChild( input ).setAttribute( "name", "D" );
	
				// Support: IE8
				// Enforce case-sensitivity of name attribute
				if ( el.querySelectorAll("[name=d]").length ) {
					rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
				}
	
				// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
				// IE8 throws error here and will not see later tests
				if ( el.querySelectorAll(":enabled").length !== 2 ) {
					rbuggyQSA.push( ":enabled", ":disabled" );
				}
	
				// Support: IE9-11+
				// IE's :disabled selector does not pick up the children of disabled fieldsets
				docElem.appendChild( el ).disabled = true;
				if ( el.querySelectorAll(":disabled").length !== 2 ) {
					rbuggyQSA.push( ":enabled", ":disabled" );
				}
	
				// Opera 10-11 does not throw on post-comma invalid pseudos
				el.querySelectorAll("*,:x");
				rbuggyQSA.push(",.*:");
			});
		}
	
		if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
			docElem.webkitMatchesSelector ||
			docElem.mozMatchesSelector ||
			docElem.oMatchesSelector ||
			docElem.msMatchesSelector) )) ) {
	
			assert(function( el ) {
				// Check to see if it's possible to do matchesSelector
				// on a disconnected node (IE 9)
				support.disconnectedMatch = matches.call( el, "*" );
	
				// This should fail with an exception
				// Gecko does not error, returns false instead
				matches.call( el, "[s!='']:x" );
				rbuggyMatches.push( "!=", pseudos );
			});
		}
	
		rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
		rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );
	
		/* Contains
		---------------------------------------------------------------------- */
		hasCompare = rnative.test( docElem.compareDocumentPosition );
	
		// Element contains another
		// Purposefully self-exclusive
		// As in, an element does not contain itself
		contains = hasCompare || rnative.test( docElem.contains ) ?
			function( a, b ) {
				var adown = a.nodeType === 9 ? a.documentElement : a,
					bup = b && b.parentNode;
				return a === bup || !!( bup && bup.nodeType === 1 && (
					adown.contains ?
						adown.contains( bup ) :
						a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
				));
			} :
			function( a, b ) {
				if ( b ) {
					while ( (b = b.parentNode) ) {
						if ( b === a ) {
							return true;
						}
					}
				}
				return false;
			};
	
		/* Sorting
		---------------------------------------------------------------------- */
	
		// Document order sorting
		sortOrder = hasCompare ?
		function( a, b ) {
	
			// Flag for duplicate removal
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}
	
			// Sort on method existence if only one input has compareDocumentPosition
			var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
			if ( compare ) {
				return compare;
			}
	
			// Calculate position if both inputs belong to the same document
			compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
				a.compareDocumentPosition( b ) :
	
				// Otherwise we know they are disconnected
				1;
	
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {
	
				// Choose the first element that is related to our preferred document
				if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
					return 1;
				}
	
				// Maintain original order
				return sortInput ?
					( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
					0;
			}
	
			return compare & 4 ? -1 : 1;
		} :
		function( a, b ) {
			// Exit early if the nodes are identical
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}
	
			var cur,
				i = 0,
				aup = a.parentNode,
				bup = b.parentNode,
				ap = [ a ],
				bp = [ b ];
	
			// Parentless nodes are either documents or disconnected
			if ( !aup || !bup ) {
				return a === document ? -1 :
					b === document ? 1 :
					aup ? -1 :
					bup ? 1 :
					sortInput ?
					( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
					0;
	
			// If the nodes are siblings, we can do a quick check
			} else if ( aup === bup ) {
				return siblingCheck( a, b );
			}
	
			// Otherwise we need full lists of their ancestors for comparison
			cur = a;
			while ( (cur = cur.parentNode) ) {
				ap.unshift( cur );
			}
			cur = b;
			while ( (cur = cur.parentNode) ) {
				bp.unshift( cur );
			}
	
			// Walk down the tree looking for a discrepancy
			while ( ap[i] === bp[i] ) {
				i++;
			}
	
			return i ?
				// Do a sibling check if the nodes have a common ancestor
				siblingCheck( ap[i], bp[i] ) :
	
				// Otherwise nodes in our document sort first
				ap[i] === preferredDoc ? -1 :
				bp[i] === preferredDoc ? 1 :
				0;
		};
	
		return document;
	};
	
	Sizzle.matches = function( expr, elements ) {
		return Sizzle( expr, null, null, elements );
	};
	
	Sizzle.matchesSelector = function( elem, expr ) {
		// Set document vars if needed
		if ( ( elem.ownerDocument || elem ) !== document ) {
			setDocument( elem );
		}
	
		// Make sure that attribute selectors are quoted
		expr = expr.replace( rattributeQuotes, "='$1']" );
	
		if ( support.matchesSelector && documentIsHTML &&
			!compilerCache[ expr + " " ] &&
			( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
			( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {
	
			try {
				var ret = matches.call( elem, expr );
	
				// IE 9's matchesSelector returns false on disconnected nodes
				if ( ret || support.disconnectedMatch ||
						// As well, disconnected nodes are said to be in a document
						// fragment in IE 9
						elem.document && elem.document.nodeType !== 11 ) {
					return ret;
				}
			} catch (e) {}
		}
	
		return Sizzle( expr, document, null, [ elem ] ).length > 0;
	};
	
	Sizzle.contains = function( context, elem ) {
		// Set document vars if needed
		if ( ( context.ownerDocument || context ) !== document ) {
			setDocument( context );
		}
		return contains( context, elem );
	};
	
	Sizzle.attr = function( elem, name ) {
		// Set document vars if needed
		if ( ( elem.ownerDocument || elem ) !== document ) {
			setDocument( elem );
		}
	
		var fn = Expr.attrHandle[ name.toLowerCase() ],
			// Don't get fooled by Object.prototype properties (jQuery #13807)
			val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
				fn( elem, name, !documentIsHTML ) :
				undefined;
	
		return val !== undefined ?
			val :
			support.attributes || !documentIsHTML ?
				elem.getAttribute( name ) :
				(val = elem.getAttributeNode(name)) && val.specified ?
					val.value :
					null;
	};
	
	Sizzle.escape = function( sel ) {
		return (sel + "").replace( rcssescape, fcssescape );
	};
	
	Sizzle.error = function( msg ) {
		throw new Error( "Syntax error, unrecognized expression: " + msg );
	};
	
	/**
	 * Document sorting and removing duplicates
	 * @param {ArrayLike} results
	 */
	Sizzle.uniqueSort = function( results ) {
		var elem,
			duplicates = [],
			j = 0,
			i = 0;
	
		// Unless we *know* we can detect duplicates, assume their presence
		hasDuplicate = !support.detectDuplicates;
		sortInput = !support.sortStable && results.slice( 0 );
		results.sort( sortOrder );
	
		if ( hasDuplicate ) {
			while ( (elem = results[i++]) ) {
				if ( elem === results[ i ] ) {
					j = duplicates.push( i );
				}
			}
			while ( j-- ) {
				results.splice( duplicates[ j ], 1 );
			}
		}
	
		// Clear input after sorting to release objects
		// See https://github.com/jquery/sizzle/pull/225
		sortInput = null;
	
		return results;
	};
	
	/**
	 * Utility function for retrieving the text value of an array of DOM nodes
	 * @param {Array|Element} elem
	 */
	getText = Sizzle.getText = function( elem ) {
		var node,
			ret = "",
			i = 0,
			nodeType = elem.nodeType;
	
		if ( !nodeType ) {
			// If no nodeType, this is expected to be an array
			while ( (node = elem[i++]) ) {
				// Do not traverse comment nodes
				ret += getText( node );
			}
		} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent for elements
			// innerText usage removed for consistency of new lines (jQuery #11153)
			if ( typeof elem.textContent === "string" ) {
				return elem.textContent;
			} else {
				// Traverse its children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
		// Do not include comment or processing instruction nodes
	
		return ret;
	};
	
	Expr = Sizzle.selectors = {
	
		// Can be adjusted by the user
		cacheLength: 50,
	
		createPseudo: markFunction,
	
		match: matchExpr,
	
		attrHandle: {},
	
		find: {},
	
		relative: {
			">": { dir: "parentNode", first: true },
			" ": { dir: "parentNode" },
			"+": { dir: "previousSibling", first: true },
			"~": { dir: "previousSibling" }
		},
	
		preFilter: {
			"ATTR": function( match ) {
				match[1] = match[1].replace( runescape, funescape );
	
				// Move the given value to match[3] whether quoted or unquoted
				match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );
	
				if ( match[2] === "~=" ) {
					match[3] = " " + match[3] + " ";
				}
	
				return match.slice( 0, 4 );
			},
	
			"CHILD": function( match ) {
				/* matches from matchExpr["CHILD"]
					1 type (only|nth|...)
					2 what (child|of-type)
					3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
					4 xn-component of xn+y argument ([+-]?\d*n|)
					5 sign of xn-component
					6 x of xn-component
					7 sign of y-component
					8 y of y-component
				*/
				match[1] = match[1].toLowerCase();
	
				if ( match[1].slice( 0, 3 ) === "nth" ) {
					// nth-* requires argument
					if ( !match[3] ) {
						Sizzle.error( match[0] );
					}
	
					// numeric x and y parameters for Expr.filter.CHILD
					// remember that false/true cast respectively to 0/1
					match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
					match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );
	
				// other types prohibit arguments
				} else if ( match[3] ) {
					Sizzle.error( match[0] );
				}
	
				return match;
			},
	
			"PSEUDO": function( match ) {
				var excess,
					unquoted = !match[6] && match[2];
	
				if ( matchExpr["CHILD"].test( match[0] ) ) {
					return null;
				}
	
				// Accept quoted arguments as-is
				if ( match[3] ) {
					match[2] = match[4] || match[5] || "";
	
				// Strip excess characters from unquoted arguments
				} else if ( unquoted && rpseudo.test( unquoted ) &&
					// Get excess from tokenize (recursively)
					(excess = tokenize( unquoted, true )) &&
					// advance to the next closing parenthesis
					(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {
	
					// excess is a negative index
					match[0] = match[0].slice( 0, excess );
					match[2] = unquoted.slice( 0, excess );
				}
	
				// Return only captures needed by the pseudo filter method (type and argument)
				return match.slice( 0, 3 );
			}
		},
	
		filter: {
	
			"TAG": function( nodeNameSelector ) {
				var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
				return nodeNameSelector === "*" ?
					function() { return true; } :
					function( elem ) {
						return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
					};
			},
	
			"CLASS": function( className ) {
				var pattern = classCache[ className + " " ];
	
				return pattern ||
					(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
					classCache( className, function( elem ) {
						return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
					});
			},
	
			"ATTR": function( name, operator, check ) {
				return function( elem ) {
					var result = Sizzle.attr( elem, name );
	
					if ( result == null ) {
						return operator === "!=";
					}
					if ( !operator ) {
						return true;
					}
	
					result += "";
	
					return operator === "=" ? result === check :
						operator === "!=" ? result !== check :
						operator === "^=" ? check && result.indexOf( check ) === 0 :
						operator === "*=" ? check && result.indexOf( check ) > -1 :
						operator === "$=" ? check && result.slice( -check.length ) === check :
						operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
						operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
						false;
				};
			},
	
			"CHILD": function( type, what, argument, first, last ) {
				var simple = type.slice( 0, 3 ) !== "nth",
					forward = type.slice( -4 ) !== "last",
					ofType = what === "of-type";
	
				return first === 1 && last === 0 ?
	
					// Shortcut for :nth-*(n)
					function( elem ) {
						return !!elem.parentNode;
					} :
	
					function( elem, context, xml ) {
						var cache, uniqueCache, outerCache, node, nodeIndex, start,
							dir = simple !== forward ? "nextSibling" : "previousSibling",
							parent = elem.parentNode,
							name = ofType && elem.nodeName.toLowerCase(),
							useCache = !xml && !ofType,
							diff = false;
	
						if ( parent ) {
	
							// :(first|last|only)-(child|of-type)
							if ( simple ) {
								while ( dir ) {
									node = elem;
									while ( (node = node[ dir ]) ) {
										if ( ofType ?
											node.nodeName.toLowerCase() === name :
											node.nodeType === 1 ) {
	
											return false;
										}
									}
									// Reverse direction for :only-* (if we haven't yet done so)
									start = dir = type === "only" && !start && "nextSibling";
								}
								return true;
							}
	
							start = [ forward ? parent.firstChild : parent.lastChild ];
	
							// non-xml :nth-child(...) stores cache data on `parent`
							if ( forward && useCache ) {
	
								// Seek `elem` from a previously-cached index
	
								// ...in a gzip-friendly way
								node = parent;
								outerCache = node[ expando ] || (node[ expando ] = {});
	
								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});
	
								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex && cache[ 2 ];
								node = nodeIndex && parent.childNodes[ nodeIndex ];
	
								while ( (node = ++nodeIndex && node && node[ dir ] ||
	
									// Fallback to seeking `elem` from the start
									(diff = nodeIndex = 0) || start.pop()) ) {
	
									// When found, cache indexes on `parent` and break
									if ( node.nodeType === 1 && ++diff && node === elem ) {
										uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
										break;
									}
								}
	
							} else {
								// Use previously-cached element index if available
								if ( useCache ) {
									// ...in a gzip-friendly way
									node = elem;
									outerCache = node[ expando ] || (node[ expando ] = {});
	
									// Support: IE <9 only
									// Defend against cloned attroperties (jQuery gh-1709)
									uniqueCache = outerCache[ node.uniqueID ] ||
										(outerCache[ node.uniqueID ] = {});
	
									cache = uniqueCache[ type ] || [];
									nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
									diff = nodeIndex;
								}
	
								// xml :nth-child(...)
								// or :nth-last-child(...) or :nth(-last)?-of-type(...)
								if ( diff === false ) {
									// Use the same loop as above to seek `elem` from the start
									while ( (node = ++nodeIndex && node && node[ dir ] ||
										(diff = nodeIndex = 0) || start.pop()) ) {
	
										if ( ( ofType ?
											node.nodeName.toLowerCase() === name :
											node.nodeType === 1 ) &&
											++diff ) {
	
											// Cache the index of each encountered element
											if ( useCache ) {
												outerCache = node[ expando ] || (node[ expando ] = {});
	
												// Support: IE <9 only
												// Defend against cloned attroperties (jQuery gh-1709)
												uniqueCache = outerCache[ node.uniqueID ] ||
													(outerCache[ node.uniqueID ] = {});
	
												uniqueCache[ type ] = [ dirruns, diff ];
											}
	
											if ( node === elem ) {
												break;
											}
										}
									}
								}
							}
	
							// Incorporate the offset, then check against cycle size
							diff -= last;
							return diff === first || ( diff % first === 0 && diff / first >= 0 );
						}
					};
			},
	
			"PSEUDO": function( pseudo, argument ) {
				// pseudo-class names are case-insensitive
				// http://www.w3.org/TR/selectors/#pseudo-classes
				// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
				// Remember that setFilters inherits from pseudos
				var args,
					fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
						Sizzle.error( "unsupported pseudo: " + pseudo );
	
				// The user may use createPseudo to indicate that
				// arguments are needed to create the filter function
				// just as Sizzle does
				if ( fn[ expando ] ) {
					return fn( argument );
				}
	
				// But maintain support for old signatures
				if ( fn.length > 1 ) {
					args = [ pseudo, pseudo, "", argument ];
					return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
						markFunction(function( seed, matches ) {
							var idx,
								matched = fn( seed, argument ),
								i = matched.length;
							while ( i-- ) {
								idx = indexOf( seed, matched[i] );
								seed[ idx ] = !( matches[ idx ] = matched[i] );
							}
						}) :
						function( elem ) {
							return fn( elem, 0, args );
						};
				}
	
				return fn;
			}
		},
	
		pseudos: {
			// Potentially complex pseudos
			"not": markFunction(function( selector ) {
				// Trim the selector passed to compile
				// to avoid treating leading and trailing
				// spaces as combinators
				var input = [],
					results = [],
					matcher = compile( selector.replace( rtrim, "$1" ) );
	
				return matcher[ expando ] ?
					markFunction(function( seed, matches, context, xml ) {
						var elem,
							unmatched = matcher( seed, null, xml, [] ),
							i = seed.length;
	
						// Match elements unmatched by `matcher`
						while ( i-- ) {
							if ( (elem = unmatched[i]) ) {
								seed[i] = !(matches[i] = elem);
							}
						}
					}) :
					function( elem, context, xml ) {
						input[0] = elem;
						matcher( input, null, xml, results );
						// Don't keep the element (issue #299)
						input[0] = null;
						return !results.pop();
					};
			}),
	
			"has": markFunction(function( selector ) {
				return function( elem ) {
					return Sizzle( selector, elem ).length > 0;
				};
			}),
	
			"contains": markFunction(function( text ) {
				text = text.replace( runescape, funescape );
				return function( elem ) {
					return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
				};
			}),
	
			// "Whether an element is represented by a :lang() selector
			// is based solely on the element's language value
			// being equal to the identifier C,
			// or beginning with the identifier C immediately followed by "-".
			// The matching of C against the element's language value is performed case-insensitively.
			// The identifier C does not have to be a valid language name."
			// http://www.w3.org/TR/selectors/#lang-pseudo
			"lang": markFunction( function( lang ) {
				// lang value must be a valid identifier
				if ( !ridentifier.test(lang || "") ) {
					Sizzle.error( "unsupported lang: " + lang );
				}
				lang = lang.replace( runescape, funescape ).toLowerCase();
				return function( elem ) {
					var elemLang;
					do {
						if ( (elemLang = documentIsHTML ?
							elem.lang :
							elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {
	
							elemLang = elemLang.toLowerCase();
							return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
						}
					} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
					return false;
				};
			}),
	
			// Miscellaneous
			"target": function( elem ) {
				var hash = window.location && window.location.hash;
				return hash && hash.slice( 1 ) === elem.id;
			},
	
			"root": function( elem ) {
				return elem === docElem;
			},
	
			"focus": function( elem ) {
				return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
			},
	
			// Boolean properties
			"enabled": createDisabledPseudo( false ),
			"disabled": createDisabledPseudo( true ),
	
			"checked": function( elem ) {
				// In CSS3, :checked should return both checked and selected elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				var nodeName = elem.nodeName.toLowerCase();
				return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
			},
	
			"selected": function( elem ) {
				// Accessing this property makes selected-by-default
				// options in Safari work properly
				if ( elem.parentNode ) {
					elem.parentNode.selectedIndex;
				}
	
				return elem.selected === true;
			},
	
			// Contents
			"empty": function( elem ) {
				// http://www.w3.org/TR/selectors/#empty-pseudo
				// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
				//   but not by others (comment: 8; processing instruction: 7; etc.)
				// nodeType < 6 works because attributes (2) do not appear as children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					if ( elem.nodeType < 6 ) {
						return false;
					}
				}
				return true;
			},
	
			"parent": function( elem ) {
				return !Expr.pseudos["empty"]( elem );
			},
	
			// Element/input types
			"header": function( elem ) {
				return rheader.test( elem.nodeName );
			},
	
			"input": function( elem ) {
				return rinputs.test( elem.nodeName );
			},
	
			"button": function( elem ) {
				var name = elem.nodeName.toLowerCase();
				return name === "input" && elem.type === "button" || name === "button";
			},
	
			"text": function( elem ) {
				var attr;
				return elem.nodeName.toLowerCase() === "input" &&
					elem.type === "text" &&
	
					// Support: IE<8
					// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
					( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
			},
	
			// Position-in-collection
			"first": createPositionalPseudo(function() {
				return [ 0 ];
			}),
	
			"last": createPositionalPseudo(function( matchIndexes, length ) {
				return [ length - 1 ];
			}),
	
			"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
				return [ argument < 0 ? argument + length : argument ];
			}),
	
			"even": createPositionalPseudo(function( matchIndexes, length ) {
				var i = 0;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),
	
			"odd": createPositionalPseudo(function( matchIndexes, length ) {
				var i = 1;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),
	
			"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; --i >= 0; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),
	
			"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; ++i < length; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			})
		}
	};
	
	Expr.pseudos["nth"] = Expr.pseudos["eq"];
	
	// Add button/input type pseudos
	for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
		Expr.pseudos[ i ] = createInputPseudo( i );
	}
	for ( i in { submit: true, reset: true } ) {
		Expr.pseudos[ i ] = createButtonPseudo( i );
	}
	
	// Easy API for creating new setFilters
	function setFilters() {}
	setFilters.prototype = Expr.filters = Expr.pseudos;
	Expr.setFilters = new setFilters();
	
	tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
		var matched, match, tokens, type,
			soFar, groups, preFilters,
			cached = tokenCache[ selector + " " ];
	
		if ( cached ) {
			return parseOnly ? 0 : cached.slice( 0 );
		}
	
		soFar = selector;
		groups = [];
		preFilters = Expr.preFilter;
	
		while ( soFar ) {
	
			// Comma and first run
			if ( !matched || (match = rcomma.exec( soFar )) ) {
				if ( match ) {
					// Don't consume trailing commas as valid
					soFar = soFar.slice( match[0].length ) || soFar;
				}
				groups.push( (tokens = []) );
			}
	
			matched = false;
	
			// Combinators
			if ( (match = rcombinators.exec( soFar )) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					// Cast descendant combinators to space
					type: match[0].replace( rtrim, " " )
				});
				soFar = soFar.slice( matched.length );
			}
	
			// Filters
			for ( type in Expr.filter ) {
				if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
					(match = preFilters[ type ]( match ))) ) {
					matched = match.shift();
					tokens.push({
						value: matched,
						type: type,
						matches: match
					});
					soFar = soFar.slice( matched.length );
				}
			}
	
			if ( !matched ) {
				break;
			}
		}
	
		// Return the length of the invalid excess
		// if we're just parsing
		// Otherwise, throw an error or return tokens
		return parseOnly ?
			soFar.length :
			soFar ?
				Sizzle.error( selector ) :
				// Cache the tokens
				tokenCache( selector, groups ).slice( 0 );
	};
	
	function toSelector( tokens ) {
		var i = 0,
			len = tokens.length,
			selector = "";
		for ( ; i < len; i++ ) {
			selector += tokens[i].value;
		}
		return selector;
	}
	
	function addCombinator( matcher, combinator, base ) {
		var dir = combinator.dir,
			skip = combinator.next,
			key = skip || dir,
			checkNonElements = base && key === "parentNode",
			doneName = done++;
	
		return combinator.first ?
			// Check against closest ancestor/preceding element
			function( elem, context, xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						return matcher( elem, context, xml );
					}
				}
				return false;
			} :
	
			// Check against all ancestor/preceding elements
			function( elem, context, xml ) {
				var oldCache, uniqueCache, outerCache,
					newCache = [ dirruns, doneName ];
	
				// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
				if ( xml ) {
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							if ( matcher( elem, context, xml ) ) {
								return true;
							}
						}
					}
				} else {
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							outerCache = elem[ expando ] || (elem[ expando ] = {});
	
							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});
	
							if ( skip && skip === elem.nodeName.toLowerCase() ) {
								elem = elem[ dir ] || elem;
							} else if ( (oldCache = uniqueCache[ key ]) &&
								oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {
	
								// Assign to newCache so results back-propagate to previous elements
								return (newCache[ 2 ] = oldCache[ 2 ]);
							} else {
								// Reuse newcache so results back-propagate to previous elements
								uniqueCache[ key ] = newCache;
	
								// A match means we're done; a fail means we have to keep checking
								if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
									return true;
								}
							}
						}
					}
				}
				return false;
			};
	}
	
	function elementMatcher( matchers ) {
		return matchers.length > 1 ?
			function( elem, context, xml ) {
				var i = matchers.length;
				while ( i-- ) {
					if ( !matchers[i]( elem, context, xml ) ) {
						return false;
					}
				}
				return true;
			} :
			matchers[0];
	}
	
	function multipleContexts( selector, contexts, results ) {
		var i = 0,
			len = contexts.length;
		for ( ; i < len; i++ ) {
			Sizzle( selector, contexts[i], results );
		}
		return results;
	}
	
	function condense( unmatched, map, filter, context, xml ) {
		var elem,
			newUnmatched = [],
			i = 0,
			len = unmatched.length,
			mapped = map != null;
	
		for ( ; i < len; i++ ) {
			if ( (elem = unmatched[i]) ) {
				if ( !filter || filter( elem, context, xml ) ) {
					newUnmatched.push( elem );
					if ( mapped ) {
						map.push( i );
					}
				}
			}
		}
	
		return newUnmatched;
	}
	
	function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
		if ( postFilter && !postFilter[ expando ] ) {
			postFilter = setMatcher( postFilter );
		}
		if ( postFinder && !postFinder[ expando ] ) {
			postFinder = setMatcher( postFinder, postSelector );
		}
		return markFunction(function( seed, results, context, xml ) {
			var temp, i, elem,
				preMap = [],
				postMap = [],
				preexisting = results.length,
	
				// Get initial elements from seed or context
				elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),
	
				// Prefilter to get matcher input, preserving a map for seed-results synchronization
				matcherIn = preFilter && ( seed || !selector ) ?
					condense( elems, preMap, preFilter, context, xml ) :
					elems,
	
				matcherOut = matcher ?
					// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
					postFinder || ( seed ? preFilter : preexisting || postFilter ) ?
	
						// ...intermediate processing is necessary
						[] :
	
						// ...otherwise use results directly
						results :
					matcherIn;
	
			// Find primary matches
			if ( matcher ) {
				matcher( matcherIn, matcherOut, context, xml );
			}
	
			// Apply postFilter
			if ( postFilter ) {
				temp = condense( matcherOut, postMap );
				postFilter( temp, [], context, xml );
	
				// Un-match failing elements by moving them back to matcherIn
				i = temp.length;
				while ( i-- ) {
					if ( (elem = temp[i]) ) {
						matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
					}
				}
			}
	
			if ( seed ) {
				if ( postFinder || preFilter ) {
					if ( postFinder ) {
						// Get the final matcherOut by condensing this intermediate into postFinder contexts
						temp = [];
						i = matcherOut.length;
						while ( i-- ) {
							if ( (elem = matcherOut[i]) ) {
								// Restore matcherIn since elem is not yet a final match
								temp.push( (matcherIn[i] = elem) );
							}
						}
						postFinder( null, (matcherOut = []), temp, xml );
					}
	
					// Move matched elements from seed to results to keep them synchronized
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) &&
							(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {
	
							seed[temp] = !(results[temp] = elem);
						}
					}
				}
	
			// Add elements to results, through postFinder if defined
			} else {
				matcherOut = condense(
					matcherOut === results ?
						matcherOut.splice( preexisting, matcherOut.length ) :
						matcherOut
				);
				if ( postFinder ) {
					postFinder( null, results, matcherOut, xml );
				} else {
					push.apply( results, matcherOut );
				}
			}
		});
	}
	
	function matcherFromTokens( tokens ) {
		var checkContext, matcher, j,
			len = tokens.length,
			leadingRelative = Expr.relative[ tokens[0].type ],
			implicitRelative = leadingRelative || Expr.relative[" "],
			i = leadingRelative ? 1 : 0,
	
			// The foundational matcher ensures that elements are reachable from top-level context(s)
			matchContext = addCombinator( function( elem ) {
				return elem === checkContext;
			}, implicitRelative, true ),
			matchAnyContext = addCombinator( function( elem ) {
				return indexOf( checkContext, elem ) > -1;
			}, implicitRelative, true ),
			matchers = [ function( elem, context, xml ) {
				var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
					(checkContext = context).nodeType ?
						matchContext( elem, context, xml ) :
						matchAnyContext( elem, context, xml ) );
				// Avoid hanging onto element (issue #299)
				checkContext = null;
				return ret;
			} ];
	
		for ( ; i < len; i++ ) {
			if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
				matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
			} else {
				matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );
	
				// Return special upon seeing a positional matcher
				if ( matcher[ expando ] ) {
					// Find the next relative operator (if any) for proper handling
					j = ++i;
					for ( ; j < len; j++ ) {
						if ( Expr.relative[ tokens[j].type ] ) {
							break;
						}
					}
					return setMatcher(
						i > 1 && elementMatcher( matchers ),
						i > 1 && toSelector(
							// If the preceding token was a descendant combinator, insert an implicit any-element `*`
							tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
						).replace( rtrim, "$1" ),
						matcher,
						i < j && matcherFromTokens( tokens.slice( i, j ) ),
						j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
						j < len && toSelector( tokens )
					);
				}
				matchers.push( matcher );
			}
		}
	
		return elementMatcher( matchers );
	}
	
	function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
		var bySet = setMatchers.length > 0,
			byElement = elementMatchers.length > 0,
			superMatcher = function( seed, context, xml, results, outermost ) {
				var elem, j, matcher,
					matchedCount = 0,
					i = "0",
					unmatched = seed && [],
					setMatched = [],
					contextBackup = outermostContext,
					// We must always have either seed elements or outermost context
					elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
					// Use integer dirruns iff this is the outermost matcher
					dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
					len = elems.length;
	
				if ( outermost ) {
					outermostContext = context === document || context || outermost;
				}
	
				// Add elements passing elementMatchers directly to results
				// Support: IE<9, Safari
				// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
				for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
					if ( byElement && elem ) {
						j = 0;
						if ( !context && elem.ownerDocument !== document ) {
							setDocument( elem );
							xml = !documentIsHTML;
						}
						while ( (matcher = elementMatchers[j++]) ) {
							if ( matcher( elem, context || document, xml) ) {
								results.push( elem );
								break;
							}
						}
						if ( outermost ) {
							dirruns = dirrunsUnique;
						}
					}
	
					// Track unmatched elements for set filters
					if ( bySet ) {
						// They will have gone through all possible matchers
						if ( (elem = !matcher && elem) ) {
							matchedCount--;
						}
	
						// Lengthen the array for every element, matched or not
						if ( seed ) {
							unmatched.push( elem );
						}
					}
				}
	
				// `i` is now the count of elements visited above, and adding it to `matchedCount`
				// makes the latter nonnegative.
				matchedCount += i;
	
				// Apply set filters to unmatched elements
				// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
				// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
				// no element matchers and no seed.
				// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
				// case, which will result in a "00" `matchedCount` that differs from `i` but is also
				// numerically zero.
				if ( bySet && i !== matchedCount ) {
					j = 0;
					while ( (matcher = setMatchers[j++]) ) {
						matcher( unmatched, setMatched, context, xml );
					}
	
					if ( seed ) {
						// Reintegrate element matches to eliminate the need for sorting
						if ( matchedCount > 0 ) {
							while ( i-- ) {
								if ( !(unmatched[i] || setMatched[i]) ) {
									setMatched[i] = pop.call( results );
								}
							}
						}
	
						// Discard index placeholder values to get only actual matches
						setMatched = condense( setMatched );
					}
	
					// Add matches to results
					push.apply( results, setMatched );
	
					// Seedless set matches succeeding multiple successful matchers stipulate sorting
					if ( outermost && !seed && setMatched.length > 0 &&
						( matchedCount + setMatchers.length ) > 1 ) {
	
						Sizzle.uniqueSort( results );
					}
				}
	
				// Override manipulation of globals by nested matchers
				if ( outermost ) {
					dirruns = dirrunsUnique;
					outermostContext = contextBackup;
				}
	
				return unmatched;
			};
	
		return bySet ?
			markFunction( superMatcher ) :
			superMatcher;
	}
	
	compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
		var i,
			setMatchers = [],
			elementMatchers = [],
			cached = compilerCache[ selector + " " ];
	
		if ( !cached ) {
			// Generate a function of recursive functions that can be used to check each element
			if ( !match ) {
				match = tokenize( selector );
			}
			i = match.length;
			while ( i-- ) {
				cached = matcherFromTokens( match[i] );
				if ( cached[ expando ] ) {
					setMatchers.push( cached );
				} else {
					elementMatchers.push( cached );
				}
			}
	
			// Cache the compiled function
			cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	
			// Save selector and tokenization
			cached.selector = selector;
		}
		return cached;
	};
	
	/**
	 * A low-level selection function that works with Sizzle's compiled
	 *  selector functions
	 * @param {String|Function} selector A selector or a pre-compiled
	 *  selector function built with Sizzle.compile
	 * @param {Element} context
	 * @param {Array} [results]
	 * @param {Array} [seed] A set of elements to match against
	 */
	select = Sizzle.select = function( selector, context, results, seed ) {
		var i, tokens, token, type, find,
			compiled = typeof selector === "function" && selector,
			match = !seed && tokenize( (selector = compiled.selector || selector) );
	
		results = results || [];
	
		// Try to minimize operations if there is only one selector in the list and no seed
		// (the latter of which guarantees us context)
		if ( match.length === 1 ) {
	
			// Reduce context if the leading compound selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[1].type ] ) {
	
				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
	
				// Precompiled matchers will still verify ancestry, so step up a level
				} else if ( compiled ) {
					context = context.parentNode;
				}
	
				selector = selector.slice( tokens.shift().value.length );
			}
	
			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];
	
				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
					)) ) {
	
						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}
	
						break;
					}
				}
			}
		}
	
		// Compile and execute a filtering function if one is not provided
		// Provide `match` to avoid retokenization if we modified the selector above
		( compiled || compile( selector, match ) )(
			seed,
			context,
			!documentIsHTML,
			results,
			!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
		);
		return results;
	};
	
	// One-time assignments
	
	// Sort stability
	support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;
	
	// Support: Chrome 14-35+
	// Always assume duplicates if they aren't passed to the comparison function
	support.detectDuplicates = !!hasDuplicate;
	
	// Initialize against the default document
	setDocument();
	
	// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
	// Detached nodes confoundingly follow *each other*
	support.sortDetached = assert(function( el ) {
		// Should return 1, but returns 4 (following)
		return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
	});
	
	// Support: IE<8
	// Prevent attribute/property "interpolation"
	// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
	if ( !assert(function( el ) {
		el.innerHTML = "<a href='#'></a>";
		return el.firstChild.getAttribute("href") === "#" ;
	}) ) {
		addHandle( "type|href|height|width", function( elem, name, isXML ) {
			if ( !isXML ) {
				return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
			}
		});
	}
	
	// Support: IE<9
	// Use defaultValue in place of getAttribute("value")
	if ( !support.attributes || !assert(function( el ) {
		el.innerHTML = "<input/>";
		el.firstChild.setAttribute( "value", "" );
		return el.firstChild.getAttribute( "value" ) === "";
	}) ) {
		addHandle( "value", function( elem, name, isXML ) {
			if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
				return elem.defaultValue;
			}
		});
	}
	
	// Support: IE<9
	// Use getAttributeNode to fetch booleans when getAttribute lies
	if ( !assert(function( el ) {
		return el.getAttribute("disabled") == null;
	}) ) {
		addHandle( booleans, function( elem, name, isXML ) {
			var val;
			if ( !isXML ) {
				return elem[ name ] === true ? name.toLowerCase() :
						(val = elem.getAttributeNode( name )) && val.specified ?
						val.value :
					null;
			}
		});
	}
	
	return Sizzle;
	
	})( window );
	
	
	
	jQuery.find = Sizzle;
	jQuery.expr = Sizzle.selectors;
	
	// Deprecated
	jQuery.expr[ ":" ] = jQuery.expr.pseudos;
	jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
	jQuery.text = Sizzle.getText;
	jQuery.isXMLDoc = Sizzle.isXML;
	jQuery.contains = Sizzle.contains;
	jQuery.escapeSelector = Sizzle.escape;
	
	
	
	
	var dir = function( elem, dir, until ) {
		var matched = [],
			truncate = until !== undefined;
	
		while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
			if ( elem.nodeType === 1 ) {
				if ( truncate && jQuery( elem ).is( until ) ) {
					break;
				}
				matched.push( elem );
			}
		}
		return matched;
	};
	
	
	var siblings = function( n, elem ) {
		var matched = [];
	
		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}
	
		return matched;
	};
	
	
	var rneedsContext = jQuery.expr.match.needsContext;
	
	var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );
	
	
	
	var risSimple = /^.[^:#\[\.,]*$/;
	
	// Implement the identical functionality for filter and not
	function winnow( elements, qualifier, not ) {
		if ( jQuery.isFunction( qualifier ) ) {
			return jQuery.grep( elements, function( elem, i ) {
				return !!qualifier.call( elem, i, elem ) !== not;
			} );
		}
	
		// Single element
		if ( qualifier.nodeType ) {
			return jQuery.grep( elements, function( elem ) {
				return ( elem === qualifier ) !== not;
			} );
		}
	
		// Arraylike of elements (jQuery, arguments, Array)
		if ( typeof qualifier !== "string" ) {
			return jQuery.grep( elements, function( elem ) {
				return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
			} );
		}
	
		// Simple selector that can be filtered directly, removing non-Elements
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}
	
		// Complex selector, compare the two sets, removing non-Elements
		qualifier = jQuery.filter( qualifier, elements );
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not && elem.nodeType === 1;
		} );
	}
	
	jQuery.filter = function( expr, elems, not ) {
		var elem = elems[ 0 ];
	
		if ( not ) {
			expr = ":not(" + expr + ")";
		}
	
		if ( elems.length === 1 && elem.nodeType === 1 ) {
			return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
		}
	
		return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		} ) );
	};
	
	jQuery.fn.extend( {
		find: function( selector ) {
			var i, ret,
				len = this.length,
				self = this;
	
			if ( typeof selector !== "string" ) {
				return this.pushStack( jQuery( selector ).filter( function() {
					for ( i = 0; i < len; i++ ) {
						if ( jQuery.contains( self[ i ], this ) ) {
							return true;
						}
					}
				} ) );
			}
	
			ret = this.pushStack( [] );
	
			for ( i = 0; i < len; i++ ) {
				jQuery.find( selector, self[ i ], ret );
			}
	
			return len > 1 ? jQuery.uniqueSort( ret ) : ret;
		},
		filter: function( selector ) {
			return this.pushStack( winnow( this, selector || [], false ) );
		},
		not: function( selector ) {
			return this.pushStack( winnow( this, selector || [], true ) );
		},
		is: function( selector ) {
			return !!winnow(
				this,
	
				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				typeof selector === "string" && rneedsContext.test( selector ) ?
					jQuery( selector ) :
					selector || [],
				false
			).length;
		}
	} );
	
	
	// Initialize a jQuery object
	
	
	// A central reference to the root jQuery(document)
	var rootjQuery,
	
		// A simple way to check for HTML strings
		// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
		// Strict HTML recognition (#11290: must start with <)
		// Shortcut simple #id case for speed
		rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,
	
		init = jQuery.fn.init = function( selector, context, root ) {
			var match, elem;
	
			// HANDLE: $(""), $(null), $(undefined), $(false)
			if ( !selector ) {
				return this;
			}
	
			// Method init() accepts an alternate rootjQuery
			// so migrate can support jQuery.sub (gh-2101)
			root = root || rootjQuery;
	
			// Handle HTML strings
			if ( typeof selector === "string" ) {
				if ( selector[ 0 ] === "<" &&
					selector[ selector.length - 1 ] === ">" &&
					selector.length >= 3 ) {
	
					// Assume that strings that start and end with <> are HTML and skip the regex check
					match = [ null, selector, null ];
	
				} else {
					match = rquickExpr.exec( selector );
				}
	
				// Match html or make sure no context is specified for #id
				if ( match && ( match[ 1 ] || !context ) ) {
	
					// HANDLE: $(html) -> $(array)
					if ( match[ 1 ] ) {
						context = context instanceof jQuery ? context[ 0 ] : context;
	
						// Option to run scripts is true for back-compat
						// Intentionally let the error be thrown if parseHTML is not present
						jQuery.merge( this, jQuery.parseHTML(
							match[ 1 ],
							context && context.nodeType ? context.ownerDocument || context : document,
							true
						) );
	
						// HANDLE: $(html, props)
						if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
							for ( match in context ) {
	
								// Properties of context are called as methods if possible
								if ( jQuery.isFunction( this[ match ] ) ) {
									this[ match ]( context[ match ] );
	
								// ...and otherwise set as attributes
								} else {
									this.attr( match, context[ match ] );
								}
							}
						}
	
						return this;
	
					// HANDLE: $(#id)
					} else {
						elem = document.getElementById( match[ 2 ] );
	
						if ( elem ) {
	
							// Inject the element directly into the jQuery object
							this[ 0 ] = elem;
							this.length = 1;
						}
						return this;
					}
	
				// HANDLE: $(expr, $(...))
				} else if ( !context || context.jquery ) {
					return ( context || root ).find( selector );
	
				// HANDLE: $(expr, context)
				// (which is just equivalent to: $(context).find(expr)
				} else {
					return this.constructor( context ).find( selector );
				}
	
			// HANDLE: $(DOMElement)
			} else if ( selector.nodeType ) {
				this[ 0 ] = selector;
				this.length = 1;
				return this;
	
			// HANDLE: $(function)
			// Shortcut for document ready
			} else if ( jQuery.isFunction( selector ) ) {
				return root.ready !== undefined ?
					root.ready( selector ) :
	
					// Execute immediately if ready is not present
					selector( jQuery );
			}
	
			return jQuery.makeArray( selector, this );
		};
	
	// Give the init function the jQuery prototype for later instantiation
	init.prototype = jQuery.fn;
	
	// Initialize central reference
	rootjQuery = jQuery( document );
	
	
	var rparentsprev = /^(?:parents|prev(?:Until|All))/,
	
		// Methods guaranteed to produce a unique set when starting from a unique set
		guaranteedUnique = {
			children: true,
			contents: true,
			next: true,
			prev: true
		};
	
	jQuery.fn.extend( {
		has: function( target ) {
			var targets = jQuery( target, this ),
				l = targets.length;
	
			return this.filter( function() {
				var i = 0;
				for ( ; i < l; i++ ) {
					if ( jQuery.contains( this, targets[ i ] ) ) {
						return true;
					}
				}
			} );
		},
	
		closest: function( selectors, context ) {
			var cur,
				i = 0,
				l = this.length,
				matched = [],
				targets = typeof selectors !== "string" && jQuery( selectors );
	
			// Positional selectors never match, since there's no _selection_ context
			if ( !rneedsContext.test( selectors ) ) {
				for ( ; i < l; i++ ) {
					for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {
	
						// Always skip document fragments
						if ( cur.nodeType < 11 && ( targets ?
							targets.index( cur ) > -1 :
	
							// Don't pass non-elements to Sizzle
							cur.nodeType === 1 &&
								jQuery.find.matchesSelector( cur, selectors ) ) ) {
	
							matched.push( cur );
							break;
						}
					}
				}
			}
	
			return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
		},
	
		// Determine the position of an element within the set
		index: function( elem ) {
	
			// No argument, return index in parent
			if ( !elem ) {
				return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
			}
	
			// Index in selector
			if ( typeof elem === "string" ) {
				return indexOf.call( jQuery( elem ), this[ 0 ] );
			}
	
			// Locate the position of the desired element
			return indexOf.call( this,
	
				// If it receives a jQuery object, the first element is used
				elem.jquery ? elem[ 0 ] : elem
			);
		},
	
		add: function( selector, context ) {
			return this.pushStack(
				jQuery.uniqueSort(
					jQuery.merge( this.get(), jQuery( selector, context ) )
				)
			);
		},
	
		addBack: function( selector ) {
			return this.add( selector == null ?
				this.prevObject : this.prevObject.filter( selector )
			);
		}
	} );
	
	function sibling( cur, dir ) {
		while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
		return cur;
	}
	
	jQuery.each( {
		parent: function( elem ) {
			var parent = elem.parentNode;
			return parent && parent.nodeType !== 11 ? parent : null;
		},
		parents: function( elem ) {
			return dir( elem, "parentNode" );
		},
		parentsUntil: function( elem, i, until ) {
			return dir( elem, "parentNode", until );
		},
		next: function( elem ) {
			return sibling( elem, "nextSibling" );
		},
		prev: function( elem ) {
			return sibling( elem, "previousSibling" );
		},
		nextAll: function( elem ) {
			return dir( elem, "nextSibling" );
		},
		prevAll: function( elem ) {
			return dir( elem, "previousSibling" );
		},
		nextUntil: function( elem, i, until ) {
			return dir( elem, "nextSibling", until );
		},
		prevUntil: function( elem, i, until ) {
			return dir( elem, "previousSibling", until );
		},
		siblings: function( elem ) {
			return siblings( ( elem.parentNode || {} ).firstChild, elem );
		},
		children: function( elem ) {
			return siblings( elem.firstChild );
		},
		contents: function( elem ) {
			return elem.contentDocument || jQuery.merge( [], elem.childNodes );
		}
	}, function( name, fn ) {
		jQuery.fn[ name ] = function( until, selector ) {
			var matched = jQuery.map( this, fn, until );
	
			if ( name.slice( -5 ) !== "Until" ) {
				selector = until;
			}
	
			if ( selector && typeof selector === "string" ) {
				matched = jQuery.filter( selector, matched );
			}
	
			if ( this.length > 1 ) {
	
				// Remove duplicates
				if ( !guaranteedUnique[ name ] ) {
					jQuery.uniqueSort( matched );
				}
	
				// Reverse order for parents* and prev-derivatives
				if ( rparentsprev.test( name ) ) {
					matched.reverse();
				}
			}
	
			return this.pushStack( matched );
		};
	} );
	var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );
	
	
	
	// Convert String-formatted options into Object-formatted ones
	function createOptions( options ) {
		var object = {};
		jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
			object[ flag ] = true;
		} );
		return object;
	}
	
	/*
	 * Create a callback list using the following parameters:
	 *
	 *	options: an optional list of space-separated options that will change how
	 *			the callback list behaves or a more traditional option object
	 *
	 * By default a callback list will act like an event callback list and can be
	 * "fired" multiple times.
	 *
	 * Possible options:
	 *
	 *	once:			will ensure the callback list can only be fired once (like a Deferred)
	 *
	 *	memory:			will keep track of previous values and will call any callback added
	 *					after the list has been fired right away with the latest "memorized"
	 *					values (like a Deferred)
	 *
	 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
	 *
	 *	stopOnFalse:	interrupt callings when a callback returns false
	 *
	 */
	jQuery.Callbacks = function( options ) {
	
		// Convert options from String-formatted to Object-formatted if needed
		// (we check in cache first)
		options = typeof options === "string" ?
			createOptions( options ) :
			jQuery.extend( {}, options );
	
		var // Flag to know if list is currently firing
			firing,
	
			// Last fire value for non-forgettable lists
			memory,
	
			// Flag to know if list was already fired
			fired,
	
			// Flag to prevent firing
			locked,
	
			// Actual callback list
			list = [],
	
			// Queue of execution data for repeatable lists
			queue = [],
	
			// Index of currently firing callback (modified by add/remove as needed)
			firingIndex = -1,
	
			// Fire callbacks
			fire = function() {
	
				// Enforce single-firing
				locked = options.once;
	
				// Execute callbacks for all pending executions,
				// respecting firingIndex overrides and runtime changes
				fired = firing = true;
				for ( ; queue.length; firingIndex = -1 ) {
					memory = queue.shift();
					while ( ++firingIndex < list.length ) {
	
						// Run callback and check for early termination
						if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
							options.stopOnFalse ) {
	
							// Jump to end and forget the data so .add doesn't re-fire
							firingIndex = list.length;
							memory = false;
						}
					}
				}
	
				// Forget the data if we're done with it
				if ( !options.memory ) {
					memory = false;
				}
	
				firing = false;
	
				// Clean up if we're done firing for good
				if ( locked ) {
	
					// Keep an empty list if we have data for future add calls
					if ( memory ) {
						list = [];
	
					// Otherwise, this object is spent
					} else {
						list = "";
					}
				}
			},
	
			// Actual Callbacks object
			self = {
	
				// Add a callback or a collection of callbacks to the list
				add: function() {
					if ( list ) {
	
						// If we have memory from a past run, we should fire after adding
						if ( memory && !firing ) {
							firingIndex = list.length - 1;
							queue.push( memory );
						}
	
						( function add( args ) {
							jQuery.each( args, function( _, arg ) {
								if ( jQuery.isFunction( arg ) ) {
									if ( !options.unique || !self.has( arg ) ) {
										list.push( arg );
									}
								} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {
	
									// Inspect recursively
									add( arg );
								}
							} );
						} )( arguments );
	
						if ( memory && !firing ) {
							fire();
						}
					}
					return this;
				},
	
				// Remove a callback from the list
				remove: function() {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
	
							// Handle firing indexes
							if ( index <= firingIndex ) {
								firingIndex--;
							}
						}
					} );
					return this;
				},
	
				// Check if a given callback is in the list.
				// If no argument is given, return whether or not list has callbacks attached.
				has: function( fn ) {
					return fn ?
						jQuery.inArray( fn, list ) > -1 :
						list.length > 0;
				},
	
				// Remove all callbacks from the list
				empty: function() {
					if ( list ) {
						list = [];
					}
					return this;
				},
	
				// Disable .fire and .add
				// Abort any current/pending executions
				// Clear all callbacks and values
				disable: function() {
					locked = queue = [];
					list = memory = "";
					return this;
				},
				disabled: function() {
					return !list;
				},
	
				// Disable .fire
				// Also disable .add unless we have memory (since it would have no effect)
				// Abort any pending executions
				lock: function() {
					locked = queue = [];
					if ( !memory && !firing ) {
						list = memory = "";
					}
					return this;
				},
				locked: function() {
					return !!locked;
				},
	
				// Call all callbacks with the given context and arguments
				fireWith: function( context, args ) {
					if ( !locked ) {
						args = args || [];
						args = [ context, args.slice ? args.slice() : args ];
						queue.push( args );
						if ( !firing ) {
							fire();
						}
					}
					return this;
				},
	
				// Call all the callbacks with the given arguments
				fire: function() {
					self.fireWith( this, arguments );
					return this;
				},
	
				// To know if the callbacks have already been called at least once
				fired: function() {
					return !!fired;
				}
			};
	
		return self;
	};
	
	
	function Identity( v ) {
		return v;
	}
	function Thrower( ex ) {
		throw ex;
	}
	
	function adoptValue( value, resolve, reject ) {
		var method;
	
		try {
	
			// Check for promise aspect first to privilege synchronous behavior
			if ( value && jQuery.isFunction( ( method = value.promise ) ) ) {
				method.call( value ).done( resolve ).fail( reject );
	
			// Other thenables
			} else if ( value && jQuery.isFunction( ( method = value.then ) ) ) {
				method.call( value, resolve, reject );
	
			// Other non-thenables
			} else {
	
				// Support: Android 4.0 only
				// Strict mode functions invoked without .call/.apply get global-object context
				resolve.call( undefined, value );
			}
	
		// For Promises/A+, convert exceptions into rejections
		// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
		// Deferred#then to conditionally suppress rejection.
		} catch ( value ) {
	
			// Support: Android 4.0 only
			// Strict mode functions invoked without .call/.apply get global-object context
			reject.call( undefined, value );
		}
	}
	
	jQuery.extend( {
	
		Deferred: function( func ) {
			var tuples = [
	
					// action, add listener, callbacks,
					// ... .then handlers, argument index, [final state]
					[ "notify", "progress", jQuery.Callbacks( "memory" ),
						jQuery.Callbacks( "memory" ), 2 ],
					[ "resolve", "done", jQuery.Callbacks( "once memory" ),
						jQuery.Callbacks( "once memory" ), 0, "resolved" ],
					[ "reject", "fail", jQuery.Callbacks( "once memory" ),
						jQuery.Callbacks( "once memory" ), 1, "rejected" ]
				],
				state = "pending",
				promise = {
					state: function() {
						return state;
					},
					always: function() {
						deferred.done( arguments ).fail( arguments );
						return this;
					},
					"catch": function( fn ) {
						return promise.then( null, fn );
					},
	
					// Keep pipe for back-compat
					pipe: function( /* fnDone, fnFail, fnProgress */ ) {
						var fns = arguments;
	
						return jQuery.Deferred( function( newDefer ) {
							jQuery.each( tuples, function( i, tuple ) {
	
								// Map tuples (progress, done, fail) to arguments (done, fail, progress)
								var fn = jQuery.isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];
	
								// deferred.progress(function() { bind to newDefer or newDefer.notify })
								// deferred.done(function() { bind to newDefer or newDefer.resolve })
								// deferred.fail(function() { bind to newDefer or newDefer.reject })
								deferred[ tuple[ 1 ] ]( function() {
									var returned = fn && fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise()
											.progress( newDefer.notify )
											.done( newDefer.resolve )
											.fail( newDefer.reject );
									} else {
										newDefer[ tuple[ 0 ] + "With" ](
											this,
											fn ? [ returned ] : arguments
										);
									}
								} );
							} );
							fns = null;
						} ).promise();
					},
					then: function( onFulfilled, onRejected, onProgress ) {
						var maxDepth = 0;
						function resolve( depth, deferred, handler, special ) {
							return function() {
								var that = this,
									args = arguments,
									mightThrow = function() {
										var returned, then;
	
										// Support: Promises/A+ section 2.3.3.3.3
										// https://promisesaplus.com/#point-59
										// Ignore double-resolution attempts
										if ( depth < maxDepth ) {
											return;
										}
	
										returned = handler.apply( that, args );
	
										// Support: Promises/A+ section 2.3.1
										// https://promisesaplus.com/#point-48
										if ( returned === deferred.promise() ) {
											throw new TypeError( "Thenable self-resolution" );
										}
	
										// Support: Promises/A+ sections 2.3.3.1, 3.5
										// https://promisesaplus.com/#point-54
										// https://promisesaplus.com/#point-75
										// Retrieve `then` only once
										then = returned &&
	
											// Support: Promises/A+ section 2.3.4
											// https://promisesaplus.com/#point-64
											// Only check objects and functions for thenability
											( typeof returned === "object" ||
												typeof returned === "function" ) &&
											returned.then;
	
										// Handle a returned thenable
										if ( jQuery.isFunction( then ) ) {
	
											// Special processors (notify) just wait for resolution
											if ( special ) {
												then.call(
													returned,
													resolve( maxDepth, deferred, Identity, special ),
													resolve( maxDepth, deferred, Thrower, special )
												);
	
											// Normal processors (resolve) also hook into progress
											} else {
	
												// ...and disregard older resolution values
												maxDepth++;
	
												then.call(
													returned,
													resolve( maxDepth, deferred, Identity, special ),
													resolve( maxDepth, deferred, Thrower, special ),
													resolve( maxDepth, deferred, Identity,
														deferred.notifyWith )
												);
											}
	
										// Handle all other returned values
										} else {
	
											// Only substitute handlers pass on context
											// and multiple values (non-spec behavior)
											if ( handler !== Identity ) {
												that = undefined;
												args = [ returned ];
											}
	
											// Process the value(s)
											// Default process is resolve
											( special || deferred.resolveWith )( that, args );
										}
									},
	
									// Only normal processors (resolve) catch and reject exceptions
									process = special ?
										mightThrow :
										function() {
											try {
												mightThrow();
											} catch ( e ) {
	
												if ( jQuery.Deferred.exceptionHook ) {
													jQuery.Deferred.exceptionHook( e,
														process.stackTrace );
												}
	
												// Support: Promises/A+ section 2.3.3.3.4.1
												// https://promisesaplus.com/#point-61
												// Ignore post-resolution exceptions
												if ( depth + 1 >= maxDepth ) {
	
													// Only substitute handlers pass on context
													// and multiple values (non-spec behavior)
													if ( handler !== Thrower ) {
														that = undefined;
														args = [ e ];
													}
	
													deferred.rejectWith( that, args );
												}
											}
										};
	
								// Support: Promises/A+ section 2.3.3.3.1
								// https://promisesaplus.com/#point-57
								// Re-resolve promises immediately to dodge false rejection from
								// subsequent errors
								if ( depth ) {
									process();
								} else {
	
									// Call an optional hook to record the stack, in case of exception
									// since it's otherwise lost when execution goes async
									if ( jQuery.Deferred.getStackHook ) {
										process.stackTrace = jQuery.Deferred.getStackHook();
									}
									window.setTimeout( process );
								}
							};
						}
	
						return jQuery.Deferred( function( newDefer ) {
	
							// progress_handlers.add( ... )
							tuples[ 0 ][ 3 ].add(
								resolve(
									0,
									newDefer,
									jQuery.isFunction( onProgress ) ?
										onProgress :
										Identity,
									newDefer.notifyWith
								)
							);
	
							// fulfilled_handlers.add( ... )
							tuples[ 1 ][ 3 ].add(
								resolve(
									0,
									newDefer,
									jQuery.isFunction( onFulfilled ) ?
										onFulfilled :
										Identity
								)
							);
	
							// rejected_handlers.add( ... )
							tuples[ 2 ][ 3 ].add(
								resolve(
									0,
									newDefer,
									jQuery.isFunction( onRejected ) ?
										onRejected :
										Thrower
								)
							);
						} ).promise();
					},
	
					// Get a promise for this deferred
					// If obj is provided, the promise aspect is added to the object
					promise: function( obj ) {
						return obj != null ? jQuery.extend( obj, promise ) : promise;
					}
				},
				deferred = {};
	
			// Add list-specific methods
			jQuery.each( tuples, function( i, tuple ) {
				var list = tuple[ 2 ],
					stateString = tuple[ 5 ];
	
				// promise.progress = list.add
				// promise.done = list.add
				// promise.fail = list.add
				promise[ tuple[ 1 ] ] = list.add;
	
				// Handle state
				if ( stateString ) {
					list.add(
						function() {
	
							// state = "resolved" (i.e., fulfilled)
							// state = "rejected"
							state = stateString;
						},
	
						// rejected_callbacks.disable
						// fulfilled_callbacks.disable
						tuples[ 3 - i ][ 2 ].disable,
	
						// progress_callbacks.lock
						tuples[ 0 ][ 2 ].lock
					);
				}
	
				// progress_handlers.fire
				// fulfilled_handlers.fire
				// rejected_handlers.fire
				list.add( tuple[ 3 ].fire );
	
				// deferred.notify = function() { deferred.notifyWith(...) }
				// deferred.resolve = function() { deferred.resolveWith(...) }
				// deferred.reject = function() { deferred.rejectWith(...) }
				deferred[ tuple[ 0 ] ] = function() {
					deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
					return this;
				};
	
				// deferred.notifyWith = list.fireWith
				// deferred.resolveWith = list.fireWith
				// deferred.rejectWith = list.fireWith
				deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
			} );
	
			// Make the deferred a promise
			promise.promise( deferred );
	
			// Call given func if any
			if ( func ) {
				func.call( deferred, deferred );
			}
	
			// All done!
			return deferred;
		},
	
		// Deferred helper
		when: function( singleValue ) {
			var
	
				// count of uncompleted subordinates
				remaining = arguments.length,
	
				// count of unprocessed arguments
				i = remaining,
	
				// subordinate fulfillment data
				resolveContexts = Array( i ),
				resolveValues = slice.call( arguments ),
	
				// the master Deferred
				master = jQuery.Deferred(),
	
				// subordinate callback factory
				updateFunc = function( i ) {
					return function( value ) {
						resolveContexts[ i ] = this;
						resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
						if ( !( --remaining ) ) {
							master.resolveWith( resolveContexts, resolveValues );
						}
					};
				};
	
			// Single- and empty arguments are adopted like Promise.resolve
			if ( remaining <= 1 ) {
				adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject );
	
				// Use .then() to unwrap secondary thenables (cf. gh-3000)
				if ( master.state() === "pending" ||
					jQuery.isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {
	
					return master.then();
				}
			}
	
			// Multiple arguments are aggregated like Promise.all array elements
			while ( i-- ) {
				adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
			}
	
			return master.promise();
		}
	} );
	
	
	// These usually indicate a programmer mistake during development,
	// warn about them ASAP rather than swallowing them by default.
	var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
	
	jQuery.Deferred.exceptionHook = function( error, stack ) {
	
		// Support: IE 8 - 9 only
		// Console exists when dev tools are open, which can happen at any time
		if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
			window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
		}
	};
	
	
	
	
	jQuery.readyException = function( error ) {
		window.setTimeout( function() {
			throw error;
		} );
	};
	
	
	
	
	// The deferred used on DOM ready
	var readyList = jQuery.Deferred();
	
	jQuery.fn.ready = function( fn ) {
	
		readyList
			.then( fn )
	
			// Wrap jQuery.readyException in a function so that the lookup
			// happens at the time of error handling instead of callback
			// registration.
			.catch( function( error ) {
				jQuery.readyException( error );
			} );
	
		return this;
	};
	
	jQuery.extend( {
	
		// Is the DOM ready to be used? Set to true once it occurs.
		isReady: false,
	
		// A counter to track how many items to wait for before
		// the ready event fires. See #6781
		readyWait: 1,
	
		// Hold (or release) the ready event
		holdReady: function( hold ) {
			if ( hold ) {
				jQuery.readyWait++;
			} else {
				jQuery.ready( true );
			}
		},
	
		// Handle when the DOM is ready
		ready: function( wait ) {
	
			// Abort if there are pending holds or we're already ready
			if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
				return;
			}
	
			// Remember that the DOM is ready
			jQuery.isReady = true;
	
			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}
	
			// If there are functions bound, to execute
			readyList.resolveWith( document, [ jQuery ] );
		}
	} );
	
	jQuery.ready.then = readyList.then;
	
	// The ready event handler and self cleanup method
	function completed() {
		document.removeEventListener( "DOMContentLoaded", completed );
		window.removeEventListener( "load", completed );
		jQuery.ready();
	}
	
	// Catch cases where $(document).ready() is called
	// after the browser event has already occurred.
	// Support: IE <=9 - 10 only
	// Older IE sometimes signals "interactive" too soon
	if ( document.readyState === "complete" ||
		( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {
	
		// Handle it asynchronously to allow scripts the opportunity to delay ready
		window.setTimeout( jQuery.ready );
	
	} else {
	
		// Use the handy event callback
		document.addEventListener( "DOMContentLoaded", completed );
	
		// A fallback to window.onload, that will always work
		window.addEventListener( "load", completed );
	}
	
	
	
	
	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			len = elems.length,
			bulk = key == null;
	
		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				access( elems, fn, i, key[ i ], true, emptyGet, raw );
			}
	
		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;
	
			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}
	
			if ( bulk ) {
	
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;
	
				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}
	
			if ( fn ) {
				for ( ; i < len; i++ ) {
					fn(
						elems[ i ], key, raw ?
						value :
						value.call( elems[ i ], i, fn( elems[ i ], key ) )
					);
				}
			}
		}
	
		if ( chainable ) {
			return elems;
		}
	
		// Gets
		if ( bulk ) {
			return fn.call( elems );
		}
	
		return len ? fn( elems[ 0 ], key ) : emptyGet;
	};
	var acceptData = function( owner ) {
	
		// Accepts only:
		//  - Node
		//    - Node.ELEMENT_NODE
		//    - Node.DOCUMENT_NODE
		//  - Object
		//    - Any
		return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
	};
	
	
	
	
	function Data() {
		this.expando = jQuery.expando + Data.uid++;
	}
	
	Data.uid = 1;
	
	Data.prototype = {
	
		cache: function( owner ) {
	
			// Check if the owner object already has a cache
			var value = owner[ this.expando ];
	
			// If not, create one
			if ( !value ) {
				value = {};
	
				// We can accept data for non-element nodes in modern browsers,
				// but we should not, see #8335.
				// Always return an empty object.
				if ( acceptData( owner ) ) {
	
					// If it is a node unlikely to be stringify-ed or looped over
					// use plain assignment
					if ( owner.nodeType ) {
						owner[ this.expando ] = value;
	
					// Otherwise secure it in a non-enumerable property
					// configurable must be true to allow the property to be
					// deleted when data is removed
					} else {
						Object.defineProperty( owner, this.expando, {
							value: value,
							configurable: true
						} );
					}
				}
			}
	
			return value;
		},
		set: function( owner, data, value ) {
			var prop,
				cache = this.cache( owner );
	
			// Handle: [ owner, key, value ] args
			// Always use camelCase key (gh-2257)
			if ( typeof data === "string" ) {
				cache[ jQuery.camelCase( data ) ] = value;
	
			// Handle: [ owner, { properties } ] args
			} else {
	
				// Copy the properties one-by-one to the cache object
				for ( prop in data ) {
					cache[ jQuery.camelCase( prop ) ] = data[ prop ];
				}
			}
			return cache;
		},
		get: function( owner, key ) {
			return key === undefined ?
				this.cache( owner ) :
	
				// Always use camelCase key (gh-2257)
				owner[ this.expando ] && owner[ this.expando ][ jQuery.camelCase( key ) ];
		},
		access: function( owner, key, value ) {
	
			// In cases where either:
			//
			//   1. No key was specified
			//   2. A string key was specified, but no value provided
			//
			// Take the "read" path and allow the get method to determine
			// which value to return, respectively either:
			//
			//   1. The entire cache object
			//   2. The data stored at the key
			//
			if ( key === undefined ||
					( ( key && typeof key === "string" ) && value === undefined ) ) {
	
				return this.get( owner, key );
			}
	
			// When the key is not a string, or both a key and value
			// are specified, set or extend (existing objects) with either:
			//
			//   1. An object of properties
			//   2. A key and value
			//
			this.set( owner, key, value );
	
			// Since the "set" path can have two possible entry points
			// return the expected data based on which path was taken[*]
			return value !== undefined ? value : key;
		},
		remove: function( owner, key ) {
			var i,
				cache = owner[ this.expando ];
	
			if ( cache === undefined ) {
				return;
			}
	
			if ( key !== undefined ) {
	
				// Support array or space separated string of keys
				if ( jQuery.isArray( key ) ) {
	
					// If key is an array of keys...
					// We always set camelCase keys, so remove that.
					key = key.map( jQuery.camelCase );
				} else {
					key = jQuery.camelCase( key );
	
					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					key = key in cache ?
						[ key ] :
						( key.match( rnothtmlwhite ) || [] );
				}
	
				i = key.length;
	
				while ( i-- ) {
					delete cache[ key[ i ] ];
				}
			}
	
			// Remove the expando if there's no more data
			if ( key === undefined || jQuery.isEmptyObject( cache ) ) {
	
				// Support: Chrome <=35 - 45
				// Webkit & Blink performance suffers when deleting properties
				// from DOM nodes, so set to undefined instead
				// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
				if ( owner.nodeType ) {
					owner[ this.expando ] = undefined;
				} else {
					delete owner[ this.expando ];
				}
			}
		},
		hasData: function( owner ) {
			var cache = owner[ this.expando ];
			return cache !== undefined && !jQuery.isEmptyObject( cache );
		}
	};
	var dataPriv = new Data();
	
	var dataUser = new Data();
	
	
	
	//	Implementation Summary
	//
	//	1. Enforce API surface and semantic compatibility with 1.9.x branch
	//	2. Improve the module's maintainability by reducing the storage
	//		paths to a single mechanism.
	//	3. Use the same single mechanism to support "private" and "user" data.
	//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	//	5. Avoid exposing implementation details on user objects (eg. expando properties)
	//	6. Provide a clear path for implementation upgrade to WeakMap in 2014
	
	var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
		rmultiDash = /[A-Z]/g;
	
	function getData( data ) {
		if ( data === "true" ) {
			return true;
		}
	
		if ( data === "false" ) {
			return false;
		}
	
		if ( data === "null" ) {
			return null;
		}
	
		// Only convert to a number if it doesn't change the string
		if ( data === +data + "" ) {
			return +data;
		}
	
		if ( rbrace.test( data ) ) {
			return JSON.parse( data );
		}
	
		return data;
	}
	
	function dataAttr( elem, key, data ) {
		var name;
	
		// If nothing was found internally, try to fetch any
		// data from the HTML5 data-* attribute
		if ( data === undefined && elem.nodeType === 1 ) {
			name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
			data = elem.getAttribute( name );
	
			if ( typeof data === "string" ) {
				try {
					data = getData( data );
				} catch ( e ) {}
	
				// Make sure we set the data so it isn't changed later
				dataUser.set( elem, key, data );
			} else {
				data = undefined;
			}
		}
		return data;
	}
	
	jQuery.extend( {
		hasData: function( elem ) {
			return dataUser.hasData( elem ) || dataPriv.hasData( elem );
		},
	
		data: function( elem, name, data ) {
			return dataUser.access( elem, name, data );
		},
	
		removeData: function( elem, name ) {
			dataUser.remove( elem, name );
		},
	
		// TODO: Now that all calls to _data and _removeData have been replaced
		// with direct calls to dataPriv methods, these can be deprecated.
		_data: function( elem, name, data ) {
			return dataPriv.access( elem, name, data );
		},
	
		_removeData: function( elem, name ) {
			dataPriv.remove( elem, name );
		}
	} );
	
	jQuery.fn.extend( {
		data: function( key, value ) {
			var i, name, data,
				elem = this[ 0 ],
				attrs = elem && elem.attributes;
	
			// Gets all values
			if ( key === undefined ) {
				if ( this.length ) {
					data = dataUser.get( elem );
	
					if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
						i = attrs.length;
						while ( i-- ) {
	
							// Support: IE 11 only
							// The attrs elements can be null (#14894)
							if ( attrs[ i ] ) {
								name = attrs[ i ].name;
								if ( name.indexOf( "data-" ) === 0 ) {
									name = jQuery.camelCase( name.slice( 5 ) );
									dataAttr( elem, name, data[ name ] );
								}
							}
						}
						dataPriv.set( elem, "hasDataAttrs", true );
					}
				}
	
				return data;
			}
	
			// Sets multiple values
			if ( typeof key === "object" ) {
				return this.each( function() {
					dataUser.set( this, key );
				} );
			}
	
			return access( this, function( value ) {
				var data;
	
				// The calling jQuery object (element matches) is not empty
				// (and therefore has an element appears at this[ 0 ]) and the
				// `value` parameter was not undefined. An empty jQuery object
				// will result in `undefined` for elem = this[ 0 ] which will
				// throw an exception if an attempt to read a data cache is made.
				if ( elem && value === undefined ) {
	
					// Attempt to get data from the cache
					// The key will always be camelCased in Data
					data = dataUser.get( elem, key );
					if ( data !== undefined ) {
						return data;
					}
	
					// Attempt to "discover" the data in
					// HTML5 custom data-* attrs
					data = dataAttr( elem, key );
					if ( data !== undefined ) {
						return data;
					}
	
					// We tried really hard, but the data doesn't exist.
					return;
				}
	
				// Set the data...
				this.each( function() {
	
					// We always store the camelCased key
					dataUser.set( this, key, value );
				} );
			}, null, value, arguments.length > 1, null, true );
		},
	
		removeData: function( key ) {
			return this.each( function() {
				dataUser.remove( this, key );
			} );
		}
	} );
	
	
	jQuery.extend( {
		queue: function( elem, type, data ) {
			var queue;
	
			if ( elem ) {
				type = ( type || "fx" ) + "queue";
				queue = dataPriv.get( elem, type );
	
				// Speed up dequeue by getting out quickly if this is just a lookup
				if ( data ) {
					if ( !queue || jQuery.isArray( data ) ) {
						queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
					} else {
						queue.push( data );
					}
				}
				return queue || [];
			}
		},
	
		dequeue: function( elem, type ) {
			type = type || "fx";
	
			var queue = jQuery.queue( elem, type ),
				startLength = queue.length,
				fn = queue.shift(),
				hooks = jQuery._queueHooks( elem, type ),
				next = function() {
					jQuery.dequeue( elem, type );
				};
	
			// If the fx queue is dequeued, always remove the progress sentinel
			if ( fn === "inprogress" ) {
				fn = queue.shift();
				startLength--;
			}
	
			if ( fn ) {
	
				// Add a progress sentinel to prevent the fx queue from being
				// automatically dequeued
				if ( type === "fx" ) {
					queue.unshift( "inprogress" );
				}
	
				// Clear up the last queue stop function
				delete hooks.stop;
				fn.call( elem, next, hooks );
			}
	
			if ( !startLength && hooks ) {
				hooks.empty.fire();
			}
		},
	
		// Not public - generate a queueHooks object, or return the current one
		_queueHooks: function( elem, type ) {
			var key = type + "queueHooks";
			return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
				empty: jQuery.Callbacks( "once memory" ).add( function() {
					dataPriv.remove( elem, [ type + "queue", key ] );
				} )
			} );
		}
	} );
	
	jQuery.fn.extend( {
		queue: function( type, data ) {
			var setter = 2;
	
			if ( typeof type !== "string" ) {
				data = type;
				type = "fx";
				setter--;
			}
	
			if ( arguments.length < setter ) {
				return jQuery.queue( this[ 0 ], type );
			}
	
			return data === undefined ?
				this :
				this.each( function() {
					var queue = jQuery.queue( this, type, data );
	
					// Ensure a hooks for this queue
					jQuery._queueHooks( this, type );
	
					if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
						jQuery.dequeue( this, type );
					}
				} );
		},
		dequeue: function( type ) {
			return this.each( function() {
				jQuery.dequeue( this, type );
			} );
		},
		clearQueue: function( type ) {
			return this.queue( type || "fx", [] );
		},
	
		// Get a promise resolved when queues of a certain type
		// are emptied (fx is the type by default)
		promise: function( type, obj ) {
			var tmp,
				count = 1,
				defer = jQuery.Deferred(),
				elements = this,
				i = this.length,
				resolve = function() {
					if ( !( --count ) ) {
						defer.resolveWith( elements, [ elements ] );
					}
				};
	
			if ( typeof type !== "string" ) {
				obj = type;
				type = undefined;
			}
			type = type || "fx";
	
			while ( i-- ) {
				tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
				if ( tmp && tmp.empty ) {
					count++;
					tmp.empty.add( resolve );
				}
			}
			resolve();
			return defer.promise( obj );
		}
	} );
	var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;
	
	var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );
	
	
	var cssExpand = [ "Top", "Right", "Bottom", "Left" ];
	
	var isHiddenWithinTree = function( elem, el ) {
	
			// isHiddenWithinTree might be called from jQuery#filter function;
			// in that case, element will be second argument
			elem = el || elem;
	
			// Inline style trumps all
			return elem.style.display === "none" ||
				elem.style.display === "" &&
	
				// Otherwise, check computed style
				// Support: Firefox <=43 - 45
				// Disconnected elements can have computed display: none, so first confirm that elem is
				// in the document.
				jQuery.contains( elem.ownerDocument, elem ) &&
	
				jQuery.css( elem, "display" ) === "none";
		};
	
	var swap = function( elem, options, callback, args ) {
		var ret, name,
			old = {};
	
		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}
	
		ret = callback.apply( elem, args || [] );
	
		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}
	
		return ret;
	};
	
	
	
	
	function adjustCSS( elem, prop, valueParts, tween ) {
		var adjusted,
			scale = 1,
			maxIterations = 20,
			currentValue = tween ?
				function() {
					return tween.cur();
				} :
				function() {
					return jQuery.css( elem, prop, "" );
				},
			initial = currentValue(),
			unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),
	
			// Starting value computation is required for potential unit mismatches
			initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
				rcssNum.exec( jQuery.css( elem, prop ) );
	
		if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {
	
			// Trust units reported by jQuery.css
			unit = unit || initialInUnit[ 3 ];
	
			// Make sure we update the tween properties later on
			valueParts = valueParts || [];
	
			// Iteratively approximate from a nonzero starting point
			initialInUnit = +initial || 1;
	
			do {
	
				// If previous iteration zeroed out, double until we get *something*.
				// Use string for doubling so we don't accidentally see scale as unchanged below
				scale = scale || ".5";
	
				// Adjust and apply
				initialInUnit = initialInUnit / scale;
				jQuery.style( elem, prop, initialInUnit + unit );
	
			// Update scale, tolerating zero or NaN from tween.cur()
			// Break the loop if scale is unchanged or perfect, or if we've just had enough.
			} while (
				scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
			);
		}
	
		if ( valueParts ) {
			initialInUnit = +initialInUnit || +initial || 0;
	
			// Apply relative offset (+=/-=) if specified
			adjusted = valueParts[ 1 ] ?
				initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
				+valueParts[ 2 ];
			if ( tween ) {
				tween.unit = unit;
				tween.start = initialInUnit;
				tween.end = adjusted;
			}
		}
		return adjusted;
	}
	
	
	var defaultDisplayMap = {};
	
	function getDefaultDisplay( elem ) {
		var temp,
			doc = elem.ownerDocument,
			nodeName = elem.nodeName,
			display = defaultDisplayMap[ nodeName ];
	
		if ( display ) {
			return display;
		}
	
		temp = doc.body.appendChild( doc.createElement( nodeName ) );
		display = jQuery.css( temp, "display" );
	
		temp.parentNode.removeChild( temp );
	
		if ( display === "none" ) {
			display = "block";
		}
		defaultDisplayMap[ nodeName ] = display;
	
		return display;
	}
	
	function showHide( elements, show ) {
		var display, elem,
			values = [],
			index = 0,
			length = elements.length;
	
		// Determine new display value for elements that need to change
		for ( ; index < length; index++ ) {
			elem = elements[ index ];
			if ( !elem.style ) {
				continue;
			}
	
			display = elem.style.display;
			if ( show ) {
	
				// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
				// check is required in this first loop unless we have a nonempty display value (either
				// inline or about-to-be-restored)
				if ( display === "none" ) {
					values[ index ] = dataPriv.get( elem, "display" ) || null;
					if ( !values[ index ] ) {
						elem.style.display = "";
					}
				}
				if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
					values[ index ] = getDefaultDisplay( elem );
				}
			} else {
				if ( display !== "none" ) {
					values[ index ] = "none";
	
					// Remember what we're overwriting
					dataPriv.set( elem, "display", display );
				}
			}
		}
	
		// Set the display of the elements in a second loop to avoid constant reflow
		for ( index = 0; index < length; index++ ) {
			if ( values[ index ] != null ) {
				elements[ index ].style.display = values[ index ];
			}
		}
	
		return elements;
	}
	
	jQuery.fn.extend( {
		show: function() {
			return showHide( this, true );
		},
		hide: function() {
			return showHide( this );
		},
		toggle: function( state ) {
			if ( typeof state === "boolean" ) {
				return state ? this.show() : this.hide();
			}
	
			return this.each( function() {
				if ( isHiddenWithinTree( this ) ) {
					jQuery( this ).show();
				} else {
					jQuery( this ).hide();
				}
			} );
		}
	} );
	var rcheckableType = ( /^(?:checkbox|radio)$/i );
	
	var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]+)/i );
	
	var rscriptType = ( /^$|\/(?:java|ecma)script/i );
	
	
	
	// We have to close these tags to support XHTML (#13200)
	var wrapMap = {
	
		// Support: IE <=9 only
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
	
		// XHTML parsers do not magically insert elements in the
		// same way that tag soup parsers do. So we cannot shorten
		// this by omitting <tbody> or other required elements.
		thead: [ 1, "<table>", "</table>" ],
		col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
	
		_default: [ 0, "", "" ]
	};
	
	// Support: IE <=9 only
	wrapMap.optgroup = wrapMap.option;
	
	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;
	
	
	function getAll( context, tag ) {
	
		// Support: IE <=9 - 11 only
		// Use typeof to avoid zero-argument method invocation on host objects (#15151)
		var ret;
	
		if ( typeof context.getElementsByTagName !== "undefined" ) {
			ret = context.getElementsByTagName( tag || "*" );
	
		} else if ( typeof context.querySelectorAll !== "undefined" ) {
			ret = context.querySelectorAll( tag || "*" );
	
		} else {
			ret = [];
		}
	
		if ( tag === undefined || tag && jQuery.nodeName( context, tag ) ) {
			return jQuery.merge( [ context ], ret );
		}
	
		return ret;
	}
	
	
	// Mark scripts as having already been evaluated
	function setGlobalEval( elems, refElements ) {
		var i = 0,
			l = elems.length;
	
		for ( ; i < l; i++ ) {
			dataPriv.set(
				elems[ i ],
				"globalEval",
				!refElements || dataPriv.get( refElements[ i ], "globalEval" )
			);
		}
	}
	
	
	var rhtml = /<|&#?\w+;/;
	
	function buildFragment( elems, context, scripts, selection, ignored ) {
		var elem, tmp, tag, wrap, contains, j,
			fragment = context.createDocumentFragment(),
			nodes = [],
			i = 0,
			l = elems.length;
	
		for ( ; i < l; i++ ) {
			elem = elems[ i ];
	
			if ( elem || elem === 0 ) {
	
				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
	
					// Support: Android <=4.0 only, PhantomJS 1 only
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );
	
				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );
	
				// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild( context.createElement( "div" ) );
	
					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];
	
					// Descend through wrappers to the right content
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}
	
					// Support: Android <=4.0 only, PhantomJS 1 only
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge( nodes, tmp.childNodes );
	
					// Remember the top-level container
					tmp = fragment.firstChild;
	
					// Ensure the created nodes are orphaned (#12392)
					tmp.textContent = "";
				}
			}
		}
	
		// Remove wrapper from fragment
		fragment.textContent = "";
	
		i = 0;
		while ( ( elem = nodes[ i++ ] ) ) {
	
			// Skip elements already in the context collection (trac-4087)
			if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
				if ( ignored ) {
					ignored.push( elem );
				}
				continue;
			}
	
			contains = jQuery.contains( elem.ownerDocument, elem );
	
			// Append to fragment
			tmp = getAll( fragment.appendChild( elem ), "script" );
	
			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}
	
			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( ( elem = tmp[ j++ ] ) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}
	
		return fragment;
	}
	
	
	( function() {
		var fragment = document.createDocumentFragment(),
			div = fragment.appendChild( document.createElement( "div" ) ),
			input = document.createElement( "input" );
	
		// Support: Android 4.0 - 4.3 only
		// Check state lost if the name is set (#11217)
		// Support: Windows Web Apps (WWA)
		// `name` and `type` must use .setAttribute for WWA (#14901)
		input.setAttribute( "type", "radio" );
		input.setAttribute( "checked", "checked" );
		input.setAttribute( "name", "t" );
	
		div.appendChild( input );
	
		// Support: Android <=4.1 only
		// Older WebKit doesn't clone checked state correctly in fragments
		support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;
	
		// Support: IE <=11 only
		// Make sure textarea (and checkbox) defaultValue is properly cloned
		div.innerHTML = "<textarea>x</textarea>";
		support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
	} )();
	var documentElement = document.documentElement;
	
	
	
	var
		rkeyEvent = /^key/,
		rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
		rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
	
	function returnTrue() {
		return true;
	}
	
	function returnFalse() {
		return false;
	}
	
	// Support: IE <=9 only
	// See #13393 for more info
	function safeActiveElement() {
		try {
			return document.activeElement;
		} catch ( err ) { }
	}
	
	function on( elem, types, selector, data, fn, one ) {
		var origFn, type;
	
		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
	
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
	
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				on( elem, type, selector, data, types[ type ], one );
			}
			return elem;
		}
	
		if ( data == null && fn == null ) {
	
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
	
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
	
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return elem;
		}
	
		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
	
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
	
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return elem.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		} );
	}
	
	/*
	 * Helper functions for managing events -- not part of the public interface.
	 * Props to Dean Edwards' addEvent library for many of the ideas.
	 */
	jQuery.event = {
	
		global: {},
	
		add: function( elem, types, handler, data, selector ) {
	
			var handleObjIn, eventHandle, tmp,
				events, t, handleObj,
				special, handlers, type, namespaces, origType,
				elemData = dataPriv.get( elem );
	
			// Don't attach events to noData or text/comment nodes (but allow plain objects)
			if ( !elemData ) {
				return;
			}
	
			// Caller can pass in an object of custom data in lieu of the handler
			if ( handler.handler ) {
				handleObjIn = handler;
				handler = handleObjIn.handler;
				selector = handleObjIn.selector;
			}
	
			// Ensure that invalid selectors throw exceptions at attach time
			// Evaluate against documentElement in case elem is a non-element node (e.g., document)
			if ( selector ) {
				jQuery.find.matchesSelector( documentElement, selector );
			}
	
			// Make sure that the handler has a unique ID, used to find/remove it later
			if ( !handler.guid ) {
				handler.guid = jQuery.guid++;
			}
	
			// Init the element's event structure and main handler, if this is the first
			if ( !( events = elemData.events ) ) {
				events = elemData.events = {};
			}
			if ( !( eventHandle = elemData.handle ) ) {
				eventHandle = elemData.handle = function( e ) {
	
					// Discard the second event of a jQuery.event.trigger() and
					// when an event is called after a page has unloaded
					return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
						jQuery.event.dispatch.apply( elem, arguments ) : undefined;
				};
			}
	
			// Handle multiple events separated by a space
			types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
			t = types.length;
			while ( t-- ) {
				tmp = rtypenamespace.exec( types[ t ] ) || [];
				type = origType = tmp[ 1 ];
				namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();
	
				// There *must* be a type, no attaching namespace-only handlers
				if ( !type ) {
					continue;
				}
	
				// If event changes its type, use the special event handlers for the changed type
				special = jQuery.event.special[ type ] || {};
	
				// If selector defined, determine special event api type, otherwise given type
				type = ( selector ? special.delegateType : special.bindType ) || type;
	
				// Update special based on newly reset type
				special = jQuery.event.special[ type ] || {};
	
				// handleObj is passed to all event handlers
				handleObj = jQuery.extend( {
					type: type,
					origType: origType,
					data: data,
					handler: handler,
					guid: handler.guid,
					selector: selector,
					needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
					namespace: namespaces.join( "." )
				}, handleObjIn );
	
				// Init the event handler queue if we're the first
				if ( !( handlers = events[ type ] ) ) {
					handlers = events[ type ] = [];
					handlers.delegateCount = 0;
	
					// Only use addEventListener if the special events handler returns false
					if ( !special.setup ||
						special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
	
						if ( elem.addEventListener ) {
							elem.addEventListener( type, eventHandle );
						}
					}
				}
	
				if ( special.add ) {
					special.add.call( elem, handleObj );
	
					if ( !handleObj.handler.guid ) {
						handleObj.handler.guid = handler.guid;
					}
				}
	
				// Add to the element's handler list, delegates in front
				if ( selector ) {
					handlers.splice( handlers.delegateCount++, 0, handleObj );
				} else {
					handlers.push( handleObj );
				}
	
				// Keep track of which events have ever been used, for event optimization
				jQuery.event.global[ type ] = true;
			}
	
		},
	
		// Detach an event or set of events from an element
		remove: function( elem, types, handler, selector, mappedTypes ) {
	
			var j, origCount, tmp,
				events, t, handleObj,
				special, handlers, type, namespaces, origType,
				elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );
	
			if ( !elemData || !( events = elemData.events ) ) {
				return;
			}
	
			// Once for each type.namespace in types; type may be omitted
			types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
			t = types.length;
			while ( t-- ) {
				tmp = rtypenamespace.exec( types[ t ] ) || [];
				type = origType = tmp[ 1 ];
				namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();
	
				// Unbind all events (on this namespace, if provided) for the element
				if ( !type ) {
					for ( type in events ) {
						jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
					}
					continue;
				}
	
				special = jQuery.event.special[ type ] || {};
				type = ( selector ? special.delegateType : special.bindType ) || type;
				handlers = events[ type ] || [];
				tmp = tmp[ 2 ] &&
					new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );
	
				// Remove matching events
				origCount = j = handlers.length;
				while ( j-- ) {
					handleObj = handlers[ j ];
	
					if ( ( mappedTypes || origType === handleObj.origType ) &&
						( !handler || handler.guid === handleObj.guid ) &&
						( !tmp || tmp.test( handleObj.namespace ) ) &&
						( !selector || selector === handleObj.selector ||
							selector === "**" && handleObj.selector ) ) {
						handlers.splice( j, 1 );
	
						if ( handleObj.selector ) {
							handlers.delegateCount--;
						}
						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}
				}
	
				// Remove generic event handler if we removed something and no more handlers exist
				// (avoids potential for endless recursion during removal of special event handlers)
				if ( origCount && !handlers.length ) {
					if ( !special.teardown ||
						special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
	
						jQuery.removeEvent( elem, type, elemData.handle );
					}
	
					delete events[ type ];
				}
			}
	
			// Remove data and the expando if it's no longer used
			if ( jQuery.isEmptyObject( events ) ) {
				dataPriv.remove( elem, "handle events" );
			}
		},
	
		dispatch: function( nativeEvent ) {
	
			// Make a writable jQuery.Event from the native event object
			var event = jQuery.event.fix( nativeEvent );
	
			var i, j, ret, matched, handleObj, handlerQueue,
				args = new Array( arguments.length ),
				handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
				special = jQuery.event.special[ event.type ] || {};
	
			// Use the fix-ed jQuery.Event rather than the (read-only) native event
			args[ 0 ] = event;
	
			for ( i = 1; i < arguments.length; i++ ) {
				args[ i ] = arguments[ i ];
			}
	
			event.delegateTarget = this;
	
			// Call the preDispatch hook for the mapped type, and let it bail if desired
			if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
				return;
			}
	
			// Determine handlers
			handlerQueue = jQuery.event.handlers.call( this, event, handlers );
	
			// Run delegates first; they may want to stop propagation beneath us
			i = 0;
			while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
				event.currentTarget = matched.elem;
	
				j = 0;
				while ( ( handleObj = matched.handlers[ j++ ] ) &&
					!event.isImmediatePropagationStopped() ) {
	
					// Triggered event must either 1) have no namespace, or 2) have namespace(s)
					// a subset or equal to those in the bound event (both can have no namespace).
					if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {
	
						event.handleObj = handleObj;
						event.data = handleObj.data;
	
						ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
							handleObj.handler ).apply( matched.elem, args );
	
						if ( ret !== undefined ) {
							if ( ( event.result = ret ) === false ) {
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}
				}
			}
	
			// Call the postDispatch hook for the mapped type
			if ( special.postDispatch ) {
				special.postDispatch.call( this, event );
			}
	
			return event.result;
		},
	
		handlers: function( event, handlers ) {
			var i, handleObj, sel, matchedHandlers, matchedSelectors,
				handlerQueue = [],
				delegateCount = handlers.delegateCount,
				cur = event.target;
	
			// Find delegate handlers
			if ( delegateCount &&
	
				// Support: IE <=9
				// Black-hole SVG <use> instance trees (trac-13180)
				cur.nodeType &&
	
				// Support: Firefox <=42
				// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
				// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
				// Support: IE 11 only
				// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
				!( event.type === "click" && event.button >= 1 ) ) {
	
				for ( ; cur !== this; cur = cur.parentNode || this ) {
	
					// Don't check non-elements (#13208)
					// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
					if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
						matchedHandlers = [];
						matchedSelectors = {};
						for ( i = 0; i < delegateCount; i++ ) {
							handleObj = handlers[ i ];
	
							// Don't conflict with Object.prototype properties (#13203)
							sel = handleObj.selector + " ";
	
							if ( matchedSelectors[ sel ] === undefined ) {
								matchedSelectors[ sel ] = handleObj.needsContext ?
									jQuery( sel, this ).index( cur ) > -1 :
									jQuery.find( sel, this, null, [ cur ] ).length;
							}
							if ( matchedSelectors[ sel ] ) {
								matchedHandlers.push( handleObj );
							}
						}
						if ( matchedHandlers.length ) {
							handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
						}
					}
				}
			}
	
			// Add the remaining (directly-bound) handlers
			cur = this;
			if ( delegateCount < handlers.length ) {
				handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
			}
	
			return handlerQueue;
		},
	
		addProp: function( name, hook ) {
			Object.defineProperty( jQuery.Event.prototype, name, {
				enumerable: true,
				configurable: true,
	
				get: jQuery.isFunction( hook ) ?
					function() {
						if ( this.originalEvent ) {
								return hook( this.originalEvent );
						}
					} :
					function() {
						if ( this.originalEvent ) {
								return this.originalEvent[ name ];
						}
					},
	
				set: function( value ) {
					Object.defineProperty( this, name, {
						enumerable: true,
						configurable: true,
						writable: true,
						value: value
					} );
				}
			} );
		},
	
		fix: function( originalEvent ) {
			return originalEvent[ jQuery.expando ] ?
				originalEvent :
				new jQuery.Event( originalEvent );
		},
	
		special: {
			load: {
	
				// Prevent triggered image.load events from bubbling to window.load
				noBubble: true
			},
			focus: {
	
				// Fire native event if possible so blur/focus sequence is correct
				trigger: function() {
					if ( this !== safeActiveElement() && this.focus ) {
						this.focus();
						return false;
					}
				},
				delegateType: "focusin"
			},
			blur: {
				trigger: function() {
					if ( this === safeActiveElement() && this.blur ) {
						this.blur();
						return false;
					}
				},
				delegateType: "focusout"
			},
			click: {
	
				// For checkbox, fire native event so checked state will be right
				trigger: function() {
					if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
						this.click();
						return false;
					}
				},
	
				// For cross-browser consistency, don't fire native .click() on links
				_default: function( event ) {
					return jQuery.nodeName( event.target, "a" );
				}
			},
	
			beforeunload: {
				postDispatch: function( event ) {
	
					// Support: Firefox 20+
					// Firefox doesn't alert if the returnValue field is not set.
					if ( event.result !== undefined && event.originalEvent ) {
						event.originalEvent.returnValue = event.result;
					}
				}
			}
		}
	};
	
	jQuery.removeEvent = function( elem, type, handle ) {
	
		// This "if" is needed for plain objects
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle );
		}
	};
	
	jQuery.Event = function( src, props ) {
	
		// Allow instantiation without the 'new' keyword
		if ( !( this instanceof jQuery.Event ) ) {
			return new jQuery.Event( src, props );
		}
	
		// Event object
		if ( src && src.type ) {
			this.originalEvent = src;
			this.type = src.type;
	
			// Events bubbling up the document may have been marked as prevented
			// by a handler lower down the tree; reflect the correct value.
			this.isDefaultPrevented = src.defaultPrevented ||
					src.defaultPrevented === undefined &&
	
					// Support: Android <=2.3 only
					src.returnValue === false ?
				returnTrue :
				returnFalse;
	
			// Create target properties
			// Support: Safari <=6 - 7 only
			// Target should not be a text node (#504, #13143)
			this.target = ( src.target && src.target.nodeType === 3 ) ?
				src.target.parentNode :
				src.target;
	
			this.currentTarget = src.currentTarget;
			this.relatedTarget = src.relatedTarget;
	
		// Event type
		} else {
			this.type = src;
		}
	
		// Put explicitly provided properties onto the event object
		if ( props ) {
			jQuery.extend( this, props );
		}
	
		// Create a timestamp if incoming event doesn't have one
		this.timeStamp = src && src.timeStamp || jQuery.now();
	
		// Mark it as fixed
		this[ jQuery.expando ] = true;
	};
	
	// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
	// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
	jQuery.Event.prototype = {
		constructor: jQuery.Event,
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse,
		isSimulated: false,
	
		preventDefault: function() {
			var e = this.originalEvent;
	
			this.isDefaultPrevented = returnTrue;
	
			if ( e && !this.isSimulated ) {
				e.preventDefault();
			}
		},
		stopPropagation: function() {
			var e = this.originalEvent;
	
			this.isPropagationStopped = returnTrue;
	
			if ( e && !this.isSimulated ) {
				e.stopPropagation();
			}
		},
		stopImmediatePropagation: function() {
			var e = this.originalEvent;
	
			this.isImmediatePropagationStopped = returnTrue;
	
			if ( e && !this.isSimulated ) {
				e.stopImmediatePropagation();
			}
	
			this.stopPropagation();
		}
	};
	
	// Includes all common event props including KeyEvent and MouseEvent specific props
	jQuery.each( {
		altKey: true,
		bubbles: true,
		cancelable: true,
		changedTouches: true,
		ctrlKey: true,
		detail: true,
		eventPhase: true,
		metaKey: true,
		pageX: true,
		pageY: true,
		shiftKey: true,
		view: true,
		"char": true,
		charCode: true,
		key: true,
		keyCode: true,
		button: true,
		buttons: true,
		clientX: true,
		clientY: true,
		offsetX: true,
		offsetY: true,
		pointerId: true,
		pointerType: true,
		screenX: true,
		screenY: true,
		targetTouches: true,
		toElement: true,
		touches: true,
	
		which: function( event ) {
			var button = event.button;
	
			// Add which for key events
			if ( event.which == null && rkeyEvent.test( event.type ) ) {
				return event.charCode != null ? event.charCode : event.keyCode;
			}
	
			// Add which for click: 1 === left; 2 === middle; 3 === right
			if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
				if ( button & 1 ) {
					return 1;
				}
	
				if ( button & 2 ) {
					return 3;
				}
	
				if ( button & 4 ) {
					return 2;
				}
	
				return 0;
			}
	
			return event.which;
		}
	}, jQuery.event.addProp );
	
	// Create mouseenter/leave events using mouseover/out and event-time checks
	// so that event delegation works in jQuery.
	// Do the same for pointerenter/pointerleave and pointerover/pointerout
	//
	// Support: Safari 7 only
	// Safari sends mouseenter too often; see:
	// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
	// for the description of the bug (it existed in older Chrome versions as well).
	jQuery.each( {
		mouseenter: "mouseover",
		mouseleave: "mouseout",
		pointerenter: "pointerover",
		pointerleave: "pointerout"
	}, function( orig, fix ) {
		jQuery.event.special[ orig ] = {
			delegateType: fix,
			bindType: fix,
	
			handle: function( event ) {
				var ret,
					target = this,
					related = event.relatedTarget,
					handleObj = event.handleObj;
	
				// For mouseenter/leave call the handler if related is outside the target.
				// NB: No relatedTarget if the mouse left/entered the browser window
				if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
					event.type = handleObj.origType;
					ret = handleObj.handler.apply( this, arguments );
					event.type = fix;
				}
				return ret;
			}
		};
	} );
	
	jQuery.fn.extend( {
	
		on: function( types, selector, data, fn ) {
			return on( this, types, selector, data, fn );
		},
		one: function( types, selector, data, fn ) {
			return on( this, types, selector, data, fn, 1 );
		},
		off: function( types, selector, fn ) {
			var handleObj, type;
			if ( types && types.preventDefault && types.handleObj ) {
	
				// ( event )  dispatched jQuery.Event
				handleObj = types.handleObj;
				jQuery( types.delegateTarget ).off(
					handleObj.namespace ?
						handleObj.origType + "." + handleObj.namespace :
						handleObj.origType,
					handleObj.selector,
					handleObj.handler
				);
				return this;
			}
			if ( typeof types === "object" ) {
	
				// ( types-object [, selector] )
				for ( type in types ) {
					this.off( type, selector, types[ type ] );
				}
				return this;
			}
			if ( selector === false || typeof selector === "function" ) {
	
				// ( types [, fn] )
				fn = selector;
				selector = undefined;
			}
			if ( fn === false ) {
				fn = returnFalse;
			}
			return this.each( function() {
				jQuery.event.remove( this, types, fn, selector );
			} );
		}
	} );
	
	
	var
	
		/* eslint-disable max-len */
	
		// See https://github.com/eslint/eslint/issues/3229
		rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,
	
		/* eslint-enable */
	
		// Support: IE <=10 - 11, Edge 12 - 13
		// In IE/Edge using regex groups here causes severe slowdowns.
		// See https://connect.microsoft.com/IE/feedback/details/1736512/
		rnoInnerhtml = /<script|<style|<link/i,
	
		// checked="checked" or checked
		rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
		rscriptTypeMasked = /^true\/(.*)/,
		rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
	
	function manipulationTarget( elem, content ) {
		if ( jQuery.nodeName( elem, "table" ) &&
			jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {
	
			return elem.getElementsByTagName( "tbody" )[ 0 ] || elem;
		}
	
		return elem;
	}
	
	// Replace/restore the type attribute of script elements for safe DOM manipulation
	function disableScript( elem ) {
		elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
		return elem;
	}
	function restoreScript( elem ) {
		var match = rscriptTypeMasked.exec( elem.type );
	
		if ( match ) {
			elem.type = match[ 1 ];
		} else {
			elem.removeAttribute( "type" );
		}
	
		return elem;
	}
	
	function cloneCopyEvent( src, dest ) {
		var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;
	
		if ( dest.nodeType !== 1 ) {
			return;
		}
	
		// 1. Copy private data: events, handlers, etc.
		if ( dataPriv.hasData( src ) ) {
			pdataOld = dataPriv.access( src );
			pdataCur = dataPriv.set( dest, pdataOld );
			events = pdataOld.events;
	
			if ( events ) {
				delete pdataCur.handle;
				pdataCur.events = {};
	
				for ( type in events ) {
					for ( i = 0, l = events[ type ].length; i < l; i++ ) {
						jQuery.event.add( dest, type, events[ type ][ i ] );
					}
				}
			}
		}
	
		// 2. Copy user data
		if ( dataUser.hasData( src ) ) {
			udataOld = dataUser.access( src );
			udataCur = jQuery.extend( {}, udataOld );
	
			dataUser.set( dest, udataCur );
		}
	}
	
	// Fix IE bugs, see support tests
	function fixInput( src, dest ) {
		var nodeName = dest.nodeName.toLowerCase();
	
		// Fails to persist the checked state of a cloned checkbox or radio button.
		if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
			dest.checked = src.checked;
	
		// Fails to return the selected option to the default selected state when cloning options
		} else if ( nodeName === "input" || nodeName === "textarea" ) {
			dest.defaultValue = src.defaultValue;
		}
	}
	
	function domManip( collection, args, callback, ignored ) {
	
		// Flatten any nested arrays
		args = concat.apply( [], args );
	
		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = collection.length,
			iNoClone = l - 1,
			value = args[ 0 ],
			isFunction = jQuery.isFunction( value );
	
		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction ||
				( l > 1 && typeof value === "string" &&
					!support.checkClone && rchecked.test( value ) ) ) {
			return collection.each( function( index ) {
				var self = collection.eq( index );
				if ( isFunction ) {
					args[ 0 ] = value.call( this, index, self.html() );
				}
				domManip( self, args, callback, ignored );
			} );
		}
	
		if ( l ) {
			fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
			first = fragment.firstChild;
	
			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}
	
			// Require either new content or an interest in ignored elements to invoke the callback
			if ( first || ignored ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;
	
				// Use the original fragment for the last item
				// instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;
	
					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );
	
						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
	
							// Support: Android <=4.0 only, PhantomJS 1 only
							// push.apply(_, arraylike) throws on ancient WebKit
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}
	
					callback.call( collection[ i ], node, i );
				}
	
				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;
	
					// Reenable scripts
					jQuery.map( scripts, restoreScript );
	
					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!dataPriv.access( node, "globalEval" ) &&
							jQuery.contains( doc, node ) ) {
	
							if ( node.src ) {
	
								// Optional AJAX dependency, but won't run scripts if not present
								if ( jQuery._evalUrl ) {
									jQuery._evalUrl( node.src );
								}
							} else {
								DOMEval( node.textContent.replace( rcleanScript, "" ), doc );
							}
						}
					}
				}
			}
		}
	
		return collection;
	}
	
	function remove( elem, selector, keepData ) {
		var node,
			nodes = selector ? jQuery.filter( selector, elem ) : elem,
			i = 0;
	
		for ( ; ( node = nodes[ i ] ) != null; i++ ) {
			if ( !keepData && node.nodeType === 1 ) {
				jQuery.cleanData( getAll( node ) );
			}
	
			if ( node.parentNode ) {
				if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
					setGlobalEval( getAll( node, "script" ) );
				}
				node.parentNode.removeChild( node );
			}
		}
	
		return elem;
	}
	
	jQuery.extend( {
		htmlPrefilter: function( html ) {
			return html.replace( rxhtmlTag, "<$1></$2>" );
		},
	
		clone: function( elem, dataAndEvents, deepDataAndEvents ) {
			var i, l, srcElements, destElements,
				clone = elem.cloneNode( true ),
				inPage = jQuery.contains( elem.ownerDocument, elem );
	
			// Fix IE cloning issues
			if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
					!jQuery.isXMLDoc( elem ) ) {
	
				// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
				destElements = getAll( clone );
				srcElements = getAll( elem );
	
				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					fixInput( srcElements[ i ], destElements[ i ] );
				}
			}
	
			// Copy the events from the original to the clone
			if ( dataAndEvents ) {
				if ( deepDataAndEvents ) {
					srcElements = srcElements || getAll( elem );
					destElements = destElements || getAll( clone );
	
					for ( i = 0, l = srcElements.length; i < l; i++ ) {
						cloneCopyEvent( srcElements[ i ], destElements[ i ] );
					}
				} else {
					cloneCopyEvent( elem, clone );
				}
			}
	
			// Preserve script evaluation history
			destElements = getAll( clone, "script" );
			if ( destElements.length > 0 ) {
				setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
			}
	
			// Return the cloned set
			return clone;
		},
	
		cleanData: function( elems ) {
			var data, elem, type,
				special = jQuery.event.special,
				i = 0;
	
			for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
				if ( acceptData( elem ) ) {
					if ( ( data = elem[ dataPriv.expando ] ) ) {
						if ( data.events ) {
							for ( type in data.events ) {
								if ( special[ type ] ) {
									jQuery.event.remove( elem, type );
	
								// This is a shortcut to avoid jQuery.event.remove's overhead
								} else {
									jQuery.removeEvent( elem, type, data.handle );
								}
							}
						}
	
						// Support: Chrome <=35 - 45+
						// Assign undefined instead of using delete, see Data#remove
						elem[ dataPriv.expando ] = undefined;
					}
					if ( elem[ dataUser.expando ] ) {
	
						// Support: Chrome <=35 - 45+
						// Assign undefined instead of using delete, see Data#remove
						elem[ dataUser.expando ] = undefined;
					}
				}
			}
		}
	} );
	
	jQuery.fn.extend( {
		detach: function( selector ) {
			return remove( this, selector, true );
		},
	
		remove: function( selector ) {
			return remove( this, selector );
		},
	
		text: function( value ) {
			return access( this, function( value ) {
				return value === undefined ?
					jQuery.text( this ) :
					this.empty().each( function() {
						if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
							this.textContent = value;
						}
					} );
			}, null, value, arguments.length );
		},
	
		append: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
					var target = manipulationTarget( this, elem );
					target.appendChild( elem );
				}
			} );
		},
	
		prepend: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
					var target = manipulationTarget( this, elem );
					target.insertBefore( elem, target.firstChild );
				}
			} );
		},
	
		before: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.parentNode ) {
					this.parentNode.insertBefore( elem, this );
				}
			} );
		},
	
		after: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.parentNode ) {
					this.parentNode.insertBefore( elem, this.nextSibling );
				}
			} );
		},
	
		empty: function() {
			var elem,
				i = 0;
	
			for ( ; ( elem = this[ i ] ) != null; i++ ) {
				if ( elem.nodeType === 1 ) {
	
					// Prevent memory leaks
					jQuery.cleanData( getAll( elem, false ) );
	
					// Remove any remaining nodes
					elem.textContent = "";
				}
			}
	
			return this;
		},
	
		clone: function( dataAndEvents, deepDataAndEvents ) {
			dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
			deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
	
			return this.map( function() {
				return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
			} );
		},
	
		html: function( value ) {
			return access( this, function( value ) {
				var elem = this[ 0 ] || {},
					i = 0,
					l = this.length;
	
				if ( value === undefined && elem.nodeType === 1 ) {
					return elem.innerHTML;
				}
	
				// See if we can take a shortcut and just use innerHTML
				if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
					!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {
	
					value = jQuery.htmlPrefilter( value );
	
					try {
						for ( ; i < l; i++ ) {
							elem = this[ i ] || {};
	
							// Remove element nodes and prevent memory leaks
							if ( elem.nodeType === 1 ) {
								jQuery.cleanData( getAll( elem, false ) );
								elem.innerHTML = value;
							}
						}
	
						elem = 0;
	
					// If using innerHTML throws an exception, use the fallback method
					} catch ( e ) {}
				}
	
				if ( elem ) {
					this.empty().append( value );
				}
			}, null, value, arguments.length );
		},
	
		replaceWith: function() {
			var ignored = [];
	
			// Make the changes, replacing each non-ignored context element with the new content
			return domManip( this, arguments, function( elem ) {
				var parent = this.parentNode;
	
				if ( jQuery.inArray( this, ignored ) < 0 ) {
					jQuery.cleanData( getAll( this ) );
					if ( parent ) {
						parent.replaceChild( elem, this );
					}
				}
	
			// Force callback invocation
			}, ignored );
		}
	} );
	
	jQuery.each( {
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function( name, original ) {
		jQuery.fn[ name ] = function( selector ) {
			var elems,
				ret = [],
				insert = jQuery( selector ),
				last = insert.length - 1,
				i = 0;
	
			for ( ; i <= last; i++ ) {
				elems = i === last ? this : this.clone( true );
				jQuery( insert[ i ] )[ original ]( elems );
	
				// Support: Android <=4.0 only, PhantomJS 1 only
				// .get() because push.apply(_, arraylike) throws on ancient WebKit
				push.apply( ret, elems.get() );
			}
	
			return this.pushStack( ret );
		};
	} );
	var rmargin = ( /^margin/ );
	
	var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );
	
	var getStyles = function( elem ) {
	
			// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
			// IE throws on elements created in popups
			// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
			var view = elem.ownerDocument.defaultView;
	
			if ( !view || !view.opener ) {
				view = window;
			}
	
			return view.getComputedStyle( elem );
		};
	
	
	
	( function() {
	
		// Executing both pixelPosition & boxSizingReliable tests require only one layout
		// so they're executed at the same time to save the second computation.
		function computeStyleTests() {
	
			// This is a singleton, we need to execute it only once
			if ( !div ) {
				return;
			}
	
			div.style.cssText =
				"box-sizing:border-box;" +
				"position:relative;display:block;" +
				"margin:auto;border:1px;padding:1px;" +
				"top:1%;width:50%";
			div.innerHTML = "";
			documentElement.appendChild( container );
	
			var divStyle = window.getComputedStyle( div );
			pixelPositionVal = divStyle.top !== "1%";
	
			// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
			reliableMarginLeftVal = divStyle.marginLeft === "2px";
			boxSizingReliableVal = divStyle.width === "4px";
	
			// Support: Android 4.0 - 4.3 only
			// Some styles come back with percentage values, even though they shouldn't
			div.style.marginRight = "50%";
			pixelMarginRightVal = divStyle.marginRight === "4px";
	
			documentElement.removeChild( container );
	
			// Nullify the div so it wouldn't be stored in the memory and
			// it will also be a sign that checks already performed
			div = null;
		}
	
		var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
			container = document.createElement( "div" ),
			div = document.createElement( "div" );
	
		// Finish early in limited (non-browser) environments
		if ( !div.style ) {
			return;
		}
	
		// Support: IE <=9 - 11 only
		// Style of cloned element affects source element cloned (#8908)
		div.style.backgroundClip = "content-box";
		div.cloneNode( true ).style.backgroundClip = "";
		support.clearCloneStyle = div.style.backgroundClip === "content-box";
	
		container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
			"padding:0;margin-top:1px;position:absolute";
		container.appendChild( div );
	
		jQuery.extend( support, {
			pixelPosition: function() {
				computeStyleTests();
				return pixelPositionVal;
			},
			boxSizingReliable: function() {
				computeStyleTests();
				return boxSizingReliableVal;
			},
			pixelMarginRight: function() {
				computeStyleTests();
				return pixelMarginRightVal;
			},
			reliableMarginLeft: function() {
				computeStyleTests();
				return reliableMarginLeftVal;
			}
		} );
	} )();
	
	
	function curCSS( elem, name, computed ) {
		var width, minWidth, maxWidth, ret,
			style = elem.style;
	
		computed = computed || getStyles( elem );
	
		// Support: IE <=9 only
		// getPropertyValue is only needed for .css('filter') (#12537)
		if ( computed ) {
			ret = computed.getPropertyValue( name ) || computed[ name ];
	
			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}
	
			// A tribute to the "awesome hack by Dean Edwards"
			// Android Browser returns percentage for some values,
			// but width seems to be reliably pixels.
			// This is against the CSSOM draft spec:
			// https://drafts.csswg.org/cssom/#resolved-values
			if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {
	
				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;
	
				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;
	
				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}
	
		return ret !== undefined ?
	
			// Support: IE <=9 - 11 only
			// IE returns zIndex value as an integer.
			ret + "" :
			ret;
	}
	
	
	function addGetHookIf( conditionFn, hookFn ) {
	
		// Define the hook, we'll check on the first run if it's really needed.
		return {
			get: function() {
				if ( conditionFn() ) {
	
					// Hook not needed (or it's not possible to use it due
					// to missing dependency), remove it.
					delete this.get;
					return;
				}
	
				// Hook needed; redefine it so that the support test is not executed again.
				return ( this.get = hookFn ).apply( this, arguments );
			}
		};
	}
	
	
	var
	
		// Swappable if display is none or starts with table
		// except "table", "table-cell", or "table-caption"
		// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
		rdisplayswap = /^(none|table(?!-c[ea]).+)/,
		cssShow = { position: "absolute", visibility: "hidden", display: "block" },
		cssNormalTransform = {
			letterSpacing: "0",
			fontWeight: "400"
		},
	
		cssPrefixes = [ "Webkit", "Moz", "ms" ],
		emptyStyle = document.createElement( "div" ).style;
	
	// Return a css property mapped to a potentially vendor prefixed property
	function vendorPropName( name ) {
	
		// Shortcut for names that are not vendor prefixed
		if ( name in emptyStyle ) {
			return name;
		}
	
		// Check for vendor prefixed names
		var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
			i = cssPrefixes.length;
	
		while ( i-- ) {
			name = cssPrefixes[ i ] + capName;
			if ( name in emptyStyle ) {
				return name;
			}
		}
	}
	
	function setPositiveNumber( elem, value, subtract ) {
	
		// Any relative (+/-) values have already been
		// normalized at this point
		var matches = rcssNum.exec( value );
		return matches ?
	
			// Guard against undefined "subtract", e.g., when used as in cssHooks
			Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
			value;
	}
	
	function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
		var i,
			val = 0;
	
		// If we already have the right measurement, avoid augmentation
		if ( extra === ( isBorderBox ? "border" : "content" ) ) {
			i = 4;
	
		// Otherwise initialize for horizontal or vertical properties
		} else {
			i = name === "width" ? 1 : 0;
		}
	
		for ( ; i < 4; i += 2 ) {
	
			// Both box models exclude margin, so add it if we want it
			if ( extra === "margin" ) {
				val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
			}
	
			if ( isBorderBox ) {
	
				// border-box includes padding, so remove it if we want content
				if ( extra === "content" ) {
					val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
				}
	
				// At this point, extra isn't border nor margin, so remove border
				if ( extra !== "margin" ) {
					val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
				}
			} else {
	
				// At this point, extra isn't content, so add padding
				val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
	
				// At this point, extra isn't content nor padding, so add border
				if ( extra !== "padding" ) {
					val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
				}
			}
		}
	
		return val;
	}
	
	function getWidthOrHeight( elem, name, extra ) {
	
		// Start with offset property, which is equivalent to the border-box value
		var val,
			valueIsBorderBox = true,
			styles = getStyles( elem ),
			isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";
	
		// Support: IE <=11 only
		// Running getBoundingClientRect on a disconnected node
		// in IE throws an error.
		if ( elem.getClientRects().length ) {
			val = elem.getBoundingClientRect()[ name ];
		}
	
		// Some non-html elements return undefined for offsetWidth, so check for null/undefined
		// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
		// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
		if ( val <= 0 || val == null ) {
	
			// Fall back to computed then uncomputed css if necessary
			val = curCSS( elem, name, styles );
			if ( val < 0 || val == null ) {
				val = elem.style[ name ];
			}
	
			// Computed unit is not pixels. Stop here and return.
			if ( rnumnonpx.test( val ) ) {
				return val;
			}
	
			// Check for style in case a browser which returns unreliable values
			// for getComputedStyle silently falls back to the reliable elem.style
			valueIsBorderBox = isBorderBox &&
				( support.boxSizingReliable() || val === elem.style[ name ] );
	
			// Normalize "", auto, and prepare for extra
			val = parseFloat( val ) || 0;
		}
	
		// Use the active box-sizing model to add/subtract irrelevant styles
		return ( val +
			augmentWidthOrHeight(
				elem,
				name,
				extra || ( isBorderBox ? "border" : "content" ),
				valueIsBorderBox,
				styles
			)
		) + "px";
	}
	
	jQuery.extend( {
	
		// Add in style property hooks for overriding the default
		// behavior of getting and setting a style property
		cssHooks: {
			opacity: {
				get: function( elem, computed ) {
					if ( computed ) {
	
						// We should always get a number back from opacity
						var ret = curCSS( elem, "opacity" );
						return ret === "" ? "1" : ret;
					}
				}
			}
		},
	
		// Don't automatically add "px" to these possibly-unitless properties
		cssNumber: {
			"animationIterationCount": true,
			"columnCount": true,
			"fillOpacity": true,
			"flexGrow": true,
			"flexShrink": true,
			"fontWeight": true,
			"lineHeight": true,
			"opacity": true,
			"order": true,
			"orphans": true,
			"widows": true,
			"zIndex": true,
			"zoom": true
		},
	
		// Add in properties whose names you wish to fix before
		// setting or getting the value
		cssProps: {
			"float": "cssFloat"
		},
	
		// Get and set the style property on a DOM Node
		style: function( elem, name, value, extra ) {
	
			// Don't set styles on text and comment nodes
			if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
				return;
			}
	
			// Make sure that we're working with the right name
			var ret, type, hooks,
				origName = jQuery.camelCase( name ),
				style = elem.style;
	
			name = jQuery.cssProps[ origName ] ||
				( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );
	
			// Gets hook for the prefixed version, then unprefixed version
			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];
	
			// Check if we're setting a value
			if ( value !== undefined ) {
				type = typeof value;
	
				// Convert "+=" or "-=" to relative numbers (#7345)
				if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
					value = adjustCSS( elem, name, ret );
	
					// Fixes bug #9237
					type = "number";
				}
	
				// Make sure that null and NaN values aren't set (#7116)
				if ( value == null || value !== value ) {
					return;
				}
	
				// If a number was passed in, add the unit (except for certain CSS properties)
				if ( type === "number" ) {
					value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
				}
	
				// background-* props affect original clone's values
				if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
					style[ name ] = "inherit";
				}
	
				// If a hook was provided, use that value, otherwise just set the specified value
				if ( !hooks || !( "set" in hooks ) ||
					( value = hooks.set( elem, value, extra ) ) !== undefined ) {
	
					style[ name ] = value;
				}
	
			} else {
	
				// If a hook was provided get the non-computed value from there
				if ( hooks && "get" in hooks &&
					( ret = hooks.get( elem, false, extra ) ) !== undefined ) {
	
					return ret;
				}
	
				// Otherwise just get the value from the style object
				return style[ name ];
			}
		},
	
		css: function( elem, name, extra, styles ) {
			var val, num, hooks,
				origName = jQuery.camelCase( name );
	
			// Make sure that we're working with the right name
			name = jQuery.cssProps[ origName ] ||
				( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );
	
			// Try prefixed name followed by the unprefixed name
			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];
	
			// If a hook was provided get the computed value from there
			if ( hooks && "get" in hooks ) {
				val = hooks.get( elem, true, extra );
			}
	
			// Otherwise, if a way to get the computed value exists, use that
			if ( val === undefined ) {
				val = curCSS( elem, name, styles );
			}
	
			// Convert "normal" to computed value
			if ( val === "normal" && name in cssNormalTransform ) {
				val = cssNormalTransform[ name ];
			}
	
			// Make numeric if forced or a qualifier was provided and val looks numeric
			if ( extra === "" || extra ) {
				num = parseFloat( val );
				return extra === true || isFinite( num ) ? num || 0 : val;
			}
			return val;
		}
	} );
	
	jQuery.each( [ "height", "width" ], function( i, name ) {
		jQuery.cssHooks[ name ] = {
			get: function( elem, computed, extra ) {
				if ( computed ) {
	
					// Certain elements can have dimension info if we invisibly show them
					// but it must have a current display style that would benefit
					return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&
	
						// Support: Safari 8+
						// Table columns in Safari have non-zero offsetWidth & zero
						// getBoundingClientRect().width unless display is changed.
						// Support: IE <=11 only
						// Running getBoundingClientRect on a disconnected node
						// in IE throws an error.
						( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
							swap( elem, cssShow, function() {
								return getWidthOrHeight( elem, name, extra );
							} ) :
							getWidthOrHeight( elem, name, extra );
				}
			},
	
			set: function( elem, value, extra ) {
				var matches,
					styles = extra && getStyles( elem ),
					subtract = extra && augmentWidthOrHeight(
						elem,
						name,
						extra,
						jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
						styles
					);
	
				// Convert to pixels if value adjustment is needed
				if ( subtract && ( matches = rcssNum.exec( value ) ) &&
					( matches[ 3 ] || "px" ) !== "px" ) {
	
					elem.style[ name ] = value;
					value = jQuery.css( elem, name );
				}
	
				return setPositiveNumber( elem, value, subtract );
			}
		};
	} );
	
	jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
		function( elem, computed ) {
			if ( computed ) {
				return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
					elem.getBoundingClientRect().left -
						swap( elem, { marginLeft: 0 }, function() {
							return elem.getBoundingClientRect().left;
						} )
					) + "px";
			}
		}
	);
	
	// These hooks are used by animate to expand properties
	jQuery.each( {
		margin: "",
		padding: "",
		border: "Width"
	}, function( prefix, suffix ) {
		jQuery.cssHooks[ prefix + suffix ] = {
			expand: function( value ) {
				var i = 0,
					expanded = {},
	
					// Assumes a single number if not a string
					parts = typeof value === "string" ? value.split( " " ) : [ value ];
	
				for ( ; i < 4; i++ ) {
					expanded[ prefix + cssExpand[ i ] + suffix ] =
						parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
				}
	
				return expanded;
			}
		};
	
		if ( !rmargin.test( prefix ) ) {
			jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
		}
	} );
	
	jQuery.fn.extend( {
		css: function( name, value ) {
			return access( this, function( elem, name, value ) {
				var styles, len,
					map = {},
					i = 0;
	
				if ( jQuery.isArray( name ) ) {
					styles = getStyles( elem );
					len = name.length;
	
					for ( ; i < len; i++ ) {
						map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
					}
	
					return map;
				}
	
				return value !== undefined ?
					jQuery.style( elem, name, value ) :
					jQuery.css( elem, name );
			}, name, value, arguments.length > 1 );
		}
	} );
	
	
	function Tween( elem, options, prop, end, easing ) {
		return new Tween.prototype.init( elem, options, prop, end, easing );
	}
	jQuery.Tween = Tween;
	
	Tween.prototype = {
		constructor: Tween,
		init: function( elem, options, prop, end, easing, unit ) {
			this.elem = elem;
			this.prop = prop;
			this.easing = easing || jQuery.easing._default;
			this.options = options;
			this.start = this.now = this.cur();
			this.end = end;
			this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
		},
		cur: function() {
			var hooks = Tween.propHooks[ this.prop ];
	
			return hooks && hooks.get ?
				hooks.get( this ) :
				Tween.propHooks._default.get( this );
		},
		run: function( percent ) {
			var eased,
				hooks = Tween.propHooks[ this.prop ];
	
			if ( this.options.duration ) {
				this.pos = eased = jQuery.easing[ this.easing ](
					percent, this.options.duration * percent, 0, 1, this.options.duration
				);
			} else {
				this.pos = eased = percent;
			}
			this.now = ( this.end - this.start ) * eased + this.start;
	
			if ( this.options.step ) {
				this.options.step.call( this.elem, this.now, this );
			}
	
			if ( hooks && hooks.set ) {
				hooks.set( this );
			} else {
				Tween.propHooks._default.set( this );
			}
			return this;
		}
	};
	
	Tween.prototype.init.prototype = Tween.prototype;
	
	Tween.propHooks = {
		_default: {
			get: function( tween ) {
				var result;
	
				// Use a property on the element directly when it is not a DOM element,
				// or when there is no matching style property that exists.
				if ( tween.elem.nodeType !== 1 ||
					tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
					return tween.elem[ tween.prop ];
				}
	
				// Passing an empty string as a 3rd parameter to .css will automatically
				// attempt a parseFloat and fallback to a string if the parse fails.
				// Simple values such as "10px" are parsed to Float;
				// complex values such as "rotate(1rad)" are returned as-is.
				result = jQuery.css( tween.elem, tween.prop, "" );
	
				// Empty strings, null, undefined and "auto" are converted to 0.
				return !result || result === "auto" ? 0 : result;
			},
			set: function( tween ) {
	
				// Use step hook for back compat.
				// Use cssHook if its there.
				// Use .style if available and use plain properties where available.
				if ( jQuery.fx.step[ tween.prop ] ) {
					jQuery.fx.step[ tween.prop ]( tween );
				} else if ( tween.elem.nodeType === 1 &&
					( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
						jQuery.cssHooks[ tween.prop ] ) ) {
					jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
				} else {
					tween.elem[ tween.prop ] = tween.now;
				}
			}
		}
	};
	
	// Support: IE <=9 only
	// Panic based approach to setting things on disconnected nodes
	Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
		set: function( tween ) {
			if ( tween.elem.nodeType && tween.elem.parentNode ) {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	};
	
	jQuery.easing = {
		linear: function( p ) {
			return p;
		},
		swing: function( p ) {
			return 0.5 - Math.cos( p * Math.PI ) / 2;
		},
		_default: "swing"
	};
	
	jQuery.fx = Tween.prototype.init;
	
	// Back compat <1.8 extension point
	jQuery.fx.step = {};
	
	
	
	
	var
		fxNow, timerId,
		rfxtypes = /^(?:toggle|show|hide)$/,
		rrun = /queueHooks$/;
	
	function raf() {
		if ( timerId ) {
			window.requestAnimationFrame( raf );
			jQuery.fx.tick();
		}
	}
	
	// Animations created synchronously will run synchronously
	function createFxNow() {
		window.setTimeout( function() {
			fxNow = undefined;
		} );
		return ( fxNow = jQuery.now() );
	}
	
	// Generate parameters to create a standard animation
	function genFx( type, includeWidth ) {
		var which,
			i = 0,
			attrs = { height: type };
	
		// If we include width, step value is 1 to do all cssExpand values,
		// otherwise step value is 2 to skip over Left and Right
		includeWidth = includeWidth ? 1 : 0;
		for ( ; i < 4; i += 2 - includeWidth ) {
			which = cssExpand[ i ];
			attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
		}
	
		if ( includeWidth ) {
			attrs.opacity = attrs.width = type;
		}
	
		return attrs;
	}
	
	function createTween( value, prop, animation ) {
		var tween,
			collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {
	
				// We're done with this property
				return tween;
			}
		}
	}
	
	function defaultPrefilter( elem, props, opts ) {
		var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
			isBox = "width" in props || "height" in props,
			anim = this,
			orig = {},
			style = elem.style,
			hidden = elem.nodeType && isHiddenWithinTree( elem ),
			dataShow = dataPriv.get( elem, "fxshow" );
	
		// Queue-skipping animations hijack the fx hooks
		if ( !opts.queue ) {
			hooks = jQuery._queueHooks( elem, "fx" );
			if ( hooks.unqueued == null ) {
				hooks.unqueued = 0;
				oldfire = hooks.empty.fire;
				hooks.empty.fire = function() {
					if ( !hooks.unqueued ) {
						oldfire();
					}
				};
			}
			hooks.unqueued++;
	
			anim.always( function() {
	
				// Ensure the complete handler is called before this completes
				anim.always( function() {
					hooks.unqueued--;
					if ( !jQuery.queue( elem, "fx" ).length ) {
						hooks.empty.fire();
					}
				} );
			} );
		}
	
		// Detect show/hide animations
		for ( prop in props ) {
			value = props[ prop ];
			if ( rfxtypes.test( value ) ) {
				delete props[ prop ];
				toggle = toggle || value === "toggle";
				if ( value === ( hidden ? "hide" : "show" ) ) {
	
					// Pretend to be hidden if this is a "show" and
					// there is still data from a stopped show/hide
					if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
						hidden = true;
	
					// Ignore all other no-op show/hide data
					} else {
						continue;
					}
				}
				orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
			}
		}
	
		// Bail out if this is a no-op like .hide().hide()
		propTween = !jQuery.isEmptyObject( props );
		if ( !propTween && jQuery.isEmptyObject( orig ) ) {
			return;
		}
	
		// Restrict "overflow" and "display" styles during box animations
		if ( isBox && elem.nodeType === 1 ) {
	
			// Support: IE <=9 - 11, Edge 12 - 13
			// Record all 3 overflow attributes because IE does not infer the shorthand
			// from identically-valued overflowX and overflowY
			opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];
	
			// Identify a display type, preferring old show/hide data over the CSS cascade
			restoreDisplay = dataShow && dataShow.display;
			if ( restoreDisplay == null ) {
				restoreDisplay = dataPriv.get( elem, "display" );
			}
			display = jQuery.css( elem, "display" );
			if ( display === "none" ) {
				if ( restoreDisplay ) {
					display = restoreDisplay;
				} else {
	
					// Get nonempty value(s) by temporarily forcing visibility
					showHide( [ elem ], true );
					restoreDisplay = elem.style.display || restoreDisplay;
					display = jQuery.css( elem, "display" );
					showHide( [ elem ] );
				}
			}
	
			// Animate inline elements as inline-block
			if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
				if ( jQuery.css( elem, "float" ) === "none" ) {
	
					// Restore the original display value at the end of pure show/hide animations
					if ( !propTween ) {
						anim.done( function() {
							style.display = restoreDisplay;
						} );
						if ( restoreDisplay == null ) {
							display = style.display;
							restoreDisplay = display === "none" ? "" : display;
						}
					}
					style.display = "inline-block";
				}
			}
		}
	
		if ( opts.overflow ) {
			style.overflow = "hidden";
			anim.always( function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			} );
		}
	
		// Implement show/hide animations
		propTween = false;
		for ( prop in orig ) {
	
			// General show/hide setup for this element animation
			if ( !propTween ) {
				if ( dataShow ) {
					if ( "hidden" in dataShow ) {
						hidden = dataShow.hidden;
					}
				} else {
					dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
				}
	
				// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
				if ( toggle ) {
					dataShow.hidden = !hidden;
				}
	
				// Show elements before animating them
				if ( hidden ) {
					showHide( [ elem ], true );
				}
	
				/* eslint-disable no-loop-func */
	
				anim.done( function() {
	
				/* eslint-enable no-loop-func */
	
					// The final step of a "hide" animation is actually hiding the element
					if ( !hidden ) {
						showHide( [ elem ] );
					}
					dataPriv.remove( elem, "fxshow" );
					for ( prop in orig ) {
						jQuery.style( elem, prop, orig[ prop ] );
					}
				} );
			}
	
			// Per-property setup
			propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = propTween.start;
				if ( hidden ) {
					propTween.end = propTween.start;
					propTween.start = 0;
				}
			}
		}
	}
	
	function propFilter( props, specialEasing ) {
		var index, name, easing, value, hooks;
	
		// camelCase, specialEasing and expand cssHook pass
		for ( index in props ) {
			name = jQuery.camelCase( index );
			easing = specialEasing[ name ];
			value = props[ index ];
			if ( jQuery.isArray( value ) ) {
				easing = value[ 1 ];
				value = props[ index ] = value[ 0 ];
			}
	
			if ( index !== name ) {
				props[ name ] = value;
				delete props[ index ];
			}
	
			hooks = jQuery.cssHooks[ name ];
			if ( hooks && "expand" in hooks ) {
				value = hooks.expand( value );
				delete props[ name ];
	
				// Not quite $.extend, this won't overwrite existing keys.
				// Reusing 'index' because we have the correct "name"
				for ( index in value ) {
					if ( !( index in props ) ) {
						props[ index ] = value[ index ];
						specialEasing[ index ] = easing;
					}
				}
			} else {
				specialEasing[ name ] = easing;
			}
		}
	}
	
	function Animation( elem, properties, options ) {
		var result,
			stopped,
			index = 0,
			length = Animation.prefilters.length,
			deferred = jQuery.Deferred().always( function() {
	
				// Don't match elem in the :animated selector
				delete tick.elem;
			} ),
			tick = function() {
				if ( stopped ) {
					return false;
				}
				var currentTime = fxNow || createFxNow(),
					remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
	
					// Support: Android 2.3 only
					// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
					temp = remaining / animation.duration || 0,
					percent = 1 - temp,
					index = 0,
					length = animation.tweens.length;
	
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( percent );
				}
	
				deferred.notifyWith( elem, [ animation, percent, remaining ] );
	
				if ( percent < 1 && length ) {
					return remaining;
				} else {
					deferred.resolveWith( elem, [ animation ] );
					return false;
				}
			},
			animation = deferred.promise( {
				elem: elem,
				props: jQuery.extend( {}, properties ),
				opts: jQuery.extend( true, {
					specialEasing: {},
					easing: jQuery.easing._default
				}, options ),
				originalProperties: properties,
				originalOptions: options,
				startTime: fxNow || createFxNow(),
				duration: options.duration,
				tweens: [],
				createTween: function( prop, end ) {
					var tween = jQuery.Tween( elem, animation.opts, prop, end,
							animation.opts.specialEasing[ prop ] || animation.opts.easing );
					animation.tweens.push( tween );
					return tween;
				},
				stop: function( gotoEnd ) {
					var index = 0,
	
						// If we are going to the end, we want to run all the tweens
						// otherwise we skip this part
						length = gotoEnd ? animation.tweens.length : 0;
					if ( stopped ) {
						return this;
					}
					stopped = true;
					for ( ; index < length; index++ ) {
						animation.tweens[ index ].run( 1 );
					}
	
					// Resolve when we played the last frame; otherwise, reject
					if ( gotoEnd ) {
						deferred.notifyWith( elem, [ animation, 1, 0 ] );
						deferred.resolveWith( elem, [ animation, gotoEnd ] );
					} else {
						deferred.rejectWith( elem, [ animation, gotoEnd ] );
					}
					return this;
				}
			} ),
			props = animation.props;
	
		propFilter( props, animation.opts.specialEasing );
	
		for ( ; index < length; index++ ) {
			result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
			if ( result ) {
				if ( jQuery.isFunction( result.stop ) ) {
					jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
						jQuery.proxy( result.stop, result );
				}
				return result;
			}
		}
	
		jQuery.map( props, createTween, animation );
	
		if ( jQuery.isFunction( animation.opts.start ) ) {
			animation.opts.start.call( elem, animation );
		}
	
		jQuery.fx.timer(
			jQuery.extend( tick, {
				elem: elem,
				anim: animation,
				queue: animation.opts.queue
			} )
		);
	
		// attach callbacks from options
		return animation.progress( animation.opts.progress )
			.done( animation.opts.done, animation.opts.complete )
			.fail( animation.opts.fail )
			.always( animation.opts.always );
	}
	
	jQuery.Animation = jQuery.extend( Animation, {
	
		tweeners: {
			"*": [ function( prop, value ) {
				var tween = this.createTween( prop, value );
				adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
				return tween;
			} ]
		},
	
		tweener: function( props, callback ) {
			if ( jQuery.isFunction( props ) ) {
				callback = props;
				props = [ "*" ];
			} else {
				props = props.match( rnothtmlwhite );
			}
	
			var prop,
				index = 0,
				length = props.length;
	
			for ( ; index < length; index++ ) {
				prop = props[ index ];
				Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
				Animation.tweeners[ prop ].unshift( callback );
			}
		},
	
		prefilters: [ defaultPrefilter ],
	
		prefilter: function( callback, prepend ) {
			if ( prepend ) {
				Animation.prefilters.unshift( callback );
			} else {
				Animation.prefilters.push( callback );
			}
		}
	} );
	
	jQuery.speed = function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};
	
		// Go to the end state if fx are off or if document is hidden
		if ( jQuery.fx.off || document.hidden ) {
			opt.duration = 0;
	
		} else {
			if ( typeof opt.duration !== "number" ) {
				if ( opt.duration in jQuery.fx.speeds ) {
					opt.duration = jQuery.fx.speeds[ opt.duration ];
	
				} else {
					opt.duration = jQuery.fx.speeds._default;
				}
			}
		}
	
		// Normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}
	
		// Queueing
		opt.old = opt.complete;
	
		opt.complete = function() {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}
	
			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			}
		};
	
		return opt;
	};
	
	jQuery.fn.extend( {
		fadeTo: function( speed, to, easing, callback ) {
	
			// Show any hidden elements after setting opacity to 0
			return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()
	
				// Animate to the value specified
				.end().animate( { opacity: to }, speed, easing, callback );
		},
		animate: function( prop, speed, easing, callback ) {
			var empty = jQuery.isEmptyObject( prop ),
				optall = jQuery.speed( speed, easing, callback ),
				doAnimation = function() {
	
					// Operate on a copy of prop so per-property easing won't be lost
					var anim = Animation( this, jQuery.extend( {}, prop ), optall );
	
					// Empty animations, or finishing resolves immediately
					if ( empty || dataPriv.get( this, "finish" ) ) {
						anim.stop( true );
					}
				};
				doAnimation.finish = doAnimation;
	
			return empty || optall.queue === false ?
				this.each( doAnimation ) :
				this.queue( optall.queue, doAnimation );
		},
		stop: function( type, clearQueue, gotoEnd ) {
			var stopQueue = function( hooks ) {
				var stop = hooks.stop;
				delete hooks.stop;
				stop( gotoEnd );
			};
	
			if ( typeof type !== "string" ) {
				gotoEnd = clearQueue;
				clearQueue = type;
				type = undefined;
			}
			if ( clearQueue && type !== false ) {
				this.queue( type || "fx", [] );
			}
	
			return this.each( function() {
				var dequeue = true,
					index = type != null && type + "queueHooks",
					timers = jQuery.timers,
					data = dataPriv.get( this );
	
				if ( index ) {
					if ( data[ index ] && data[ index ].stop ) {
						stopQueue( data[ index ] );
					}
				} else {
					for ( index in data ) {
						if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
							stopQueue( data[ index ] );
						}
					}
				}
	
				for ( index = timers.length; index--; ) {
					if ( timers[ index ].elem === this &&
						( type == null || timers[ index ].queue === type ) ) {
	
						timers[ index ].anim.stop( gotoEnd );
						dequeue = false;
						timers.splice( index, 1 );
					}
				}
	
				// Start the next in the queue if the last step wasn't forced.
				// Timers currently will call their complete callbacks, which
				// will dequeue but only if they were gotoEnd.
				if ( dequeue || !gotoEnd ) {
					jQuery.dequeue( this, type );
				}
			} );
		},
		finish: function( type ) {
			if ( type !== false ) {
				type = type || "fx";
			}
			return this.each( function() {
				var index,
					data = dataPriv.get( this ),
					queue = data[ type + "queue" ],
					hooks = data[ type + "queueHooks" ],
					timers = jQuery.timers,
					length = queue ? queue.length : 0;
	
				// Enable finishing flag on private data
				data.finish = true;
	
				// Empty the queue first
				jQuery.queue( this, type, [] );
	
				if ( hooks && hooks.stop ) {
					hooks.stop.call( this, true );
				}
	
				// Look for any active animations, and finish them
				for ( index = timers.length; index--; ) {
					if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
						timers[ index ].anim.stop( true );
						timers.splice( index, 1 );
					}
				}
	
				// Look for any animations in the old queue and finish them
				for ( index = 0; index < length; index++ ) {
					if ( queue[ index ] && queue[ index ].finish ) {
						queue[ index ].finish.call( this );
					}
				}
	
				// Turn off finishing flag
				delete data.finish;
			} );
		}
	} );
	
	jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
		var cssFn = jQuery.fn[ name ];
		jQuery.fn[ name ] = function( speed, easing, callback ) {
			return speed == null || typeof speed === "boolean" ?
				cssFn.apply( this, arguments ) :
				this.animate( genFx( name, true ), speed, easing, callback );
		};
	} );
	
	// Generate shortcuts for custom animations
	jQuery.each( {
		slideDown: genFx( "show" ),
		slideUp: genFx( "hide" ),
		slideToggle: genFx( "toggle" ),
		fadeIn: { opacity: "show" },
		fadeOut: { opacity: "hide" },
		fadeToggle: { opacity: "toggle" }
	}, function( name, props ) {
		jQuery.fn[ name ] = function( speed, easing, callback ) {
			return this.animate( props, speed, easing, callback );
		};
	} );
	
	jQuery.timers = [];
	jQuery.fx.tick = function() {
		var timer,
			i = 0,
			timers = jQuery.timers;
	
		fxNow = jQuery.now();
	
		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];
	
			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}
	
		if ( !timers.length ) {
			jQuery.fx.stop();
		}
		fxNow = undefined;
	};
	
	jQuery.fx.timer = function( timer ) {
		jQuery.timers.push( timer );
		if ( timer() ) {
			jQuery.fx.start();
		} else {
			jQuery.timers.pop();
		}
	};
	
	jQuery.fx.interval = 13;
	jQuery.fx.start = function() {
		if ( !timerId ) {
			timerId = window.requestAnimationFrame ?
				window.requestAnimationFrame( raf ) :
				window.setInterval( jQuery.fx.tick, jQuery.fx.interval );
		}
	};
	
	jQuery.fx.stop = function() {
		if ( window.cancelAnimationFrame ) {
			window.cancelAnimationFrame( timerId );
		} else {
			window.clearInterval( timerId );
		}
	
		timerId = null;
	};
	
	jQuery.fx.speeds = {
		slow: 600,
		fast: 200,
	
		// Default speed
		_default: 400
	};
	
	
	// Based off of the plugin by Clint Helfers, with permission.
	// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
	jQuery.fn.delay = function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";
	
		return this.queue( type, function( next, hooks ) {
			var timeout = window.setTimeout( next, time );
			hooks.stop = function() {
				window.clearTimeout( timeout );
			};
		} );
	};
	
	
	( function() {
		var input = document.createElement( "input" ),
			select = document.createElement( "select" ),
			opt = select.appendChild( document.createElement( "option" ) );
	
		input.type = "checkbox";
	
		// Support: Android <=4.3 only
		// Default value for a checkbox should be "on"
		support.checkOn = input.value !== "";
	
		// Support: IE <=11 only
		// Must access selectedIndex to make default options select
		support.optSelected = opt.selected;
	
		// Support: IE <=11 only
		// An input loses its value after becoming a radio
		input = document.createElement( "input" );
		input.value = "t";
		input.type = "radio";
		support.radioValue = input.value === "t";
	} )();
	
	
	var boolHook,
		attrHandle = jQuery.expr.attrHandle;
	
	jQuery.fn.extend( {
		attr: function( name, value ) {
			return access( this, jQuery.attr, name, value, arguments.length > 1 );
		},
	
		removeAttr: function( name ) {
			return this.each( function() {
				jQuery.removeAttr( this, name );
			} );
		}
	} );
	
	jQuery.extend( {
		attr: function( elem, name, value ) {
			var ret, hooks,
				nType = elem.nodeType;
	
			// Don't get/set attributes on text, comment and attribute nodes
			if ( nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}
	
			// Fallback to prop when attributes are not supported
			if ( typeof elem.getAttribute === "undefined" ) {
				return jQuery.prop( elem, name, value );
			}
	
			// Attribute hooks are determined by the lowercase version
			// Grab necessary hook if one is defined
			if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
				hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
					( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
			}
	
			if ( value !== undefined ) {
				if ( value === null ) {
					jQuery.removeAttr( elem, name );
					return;
				}
	
				if ( hooks && "set" in hooks &&
					( ret = hooks.set( elem, value, name ) ) !== undefined ) {
					return ret;
				}
	
				elem.setAttribute( name, value + "" );
				return value;
			}
	
			if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
				return ret;
			}
	
			ret = jQuery.find.attr( elem, name );
	
			// Non-existent attributes return null, we normalize to undefined
			return ret == null ? undefined : ret;
		},
	
		attrHooks: {
			type: {
				set: function( elem, value ) {
					if ( !support.radioValue && value === "radio" &&
						jQuery.nodeName( elem, "input" ) ) {
						var val = elem.value;
						elem.setAttribute( "type", value );
						if ( val ) {
							elem.value = val;
						}
						return value;
					}
				}
			}
		},
	
		removeAttr: function( elem, value ) {
			var name,
				i = 0,
	
				// Attribute names can contain non-HTML whitespace characters
				// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
				attrNames = value && value.match( rnothtmlwhite );
	
			if ( attrNames && elem.nodeType === 1 ) {
				while ( ( name = attrNames[ i++ ] ) ) {
					elem.removeAttribute( name );
				}
			}
		}
	} );
	
	// Hooks for boolean attributes
	boolHook = {
		set: function( elem, value, name ) {
			if ( value === false ) {
	
				// Remove boolean attributes when set to false
				jQuery.removeAttr( elem, name );
			} else {
				elem.setAttribute( name, name );
			}
			return name;
		}
	};
	
	jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
		var getter = attrHandle[ name ] || jQuery.find.attr;
	
		attrHandle[ name ] = function( elem, name, isXML ) {
			var ret, handle,
				lowercaseName = name.toLowerCase();
	
			if ( !isXML ) {
	
				// Avoid an infinite loop by temporarily removing this function from the getter
				handle = attrHandle[ lowercaseName ];
				attrHandle[ lowercaseName ] = ret;
				ret = getter( elem, name, isXML ) != null ?
					lowercaseName :
					null;
				attrHandle[ lowercaseName ] = handle;
			}
			return ret;
		};
	} );
	
	
	
	
	var rfocusable = /^(?:input|select|textarea|button)$/i,
		rclickable = /^(?:a|area)$/i;
	
	jQuery.fn.extend( {
		prop: function( name, value ) {
			return access( this, jQuery.prop, name, value, arguments.length > 1 );
		},
	
		removeProp: function( name ) {
			return this.each( function() {
				delete this[ jQuery.propFix[ name ] || name ];
			} );
		}
	} );
	
	jQuery.extend( {
		prop: function( elem, name, value ) {
			var ret, hooks,
				nType = elem.nodeType;
	
			// Don't get/set properties on text, comment and attribute nodes
			if ( nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}
	
			if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
	
				// Fix name and attach hooks
				name = jQuery.propFix[ name ] || name;
				hooks = jQuery.propHooks[ name ];
			}
	
			if ( value !== undefined ) {
				if ( hooks && "set" in hooks &&
					( ret = hooks.set( elem, value, name ) ) !== undefined ) {
					return ret;
				}
	
				return ( elem[ name ] = value );
			}
	
			if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
				return ret;
			}
	
			return elem[ name ];
		},
	
		propHooks: {
			tabIndex: {
				get: function( elem ) {
	
					// Support: IE <=9 - 11 only
					// elem.tabIndex doesn't always return the
					// correct value when it hasn't been explicitly set
					// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
					// Use proper attribute retrieval(#12072)
					var tabindex = jQuery.find.attr( elem, "tabindex" );
	
					if ( tabindex ) {
						return parseInt( tabindex, 10 );
					}
	
					if (
						rfocusable.test( elem.nodeName ) ||
						rclickable.test( elem.nodeName ) &&
						elem.href
					) {
						return 0;
					}
	
					return -1;
				}
			}
		},
	
		propFix: {
			"for": "htmlFor",
			"class": "className"
		}
	} );
	
	// Support: IE <=11 only
	// Accessing the selectedIndex property
	// forces the browser to respect setting selected
	// on the option
	// The getter ensures a default option is selected
	// when in an optgroup
	// eslint rule "no-unused-expressions" is disabled for this code
	// since it considers such accessions noop
	if ( !support.optSelected ) {
		jQuery.propHooks.selected = {
			get: function( elem ) {
	
				/* eslint no-unused-expressions: "off" */
	
				var parent = elem.parentNode;
				if ( parent && parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
				return null;
			},
			set: function( elem ) {
	
				/* eslint no-unused-expressions: "off" */
	
				var parent = elem.parentNode;
				if ( parent ) {
					parent.selectedIndex;
	
					if ( parent.parentNode ) {
						parent.parentNode.selectedIndex;
					}
				}
			}
		};
	}
	
	jQuery.each( [
		"tabIndex",
		"readOnly",
		"maxLength",
		"cellSpacing",
		"cellPadding",
		"rowSpan",
		"colSpan",
		"useMap",
		"frameBorder",
		"contentEditable"
	], function() {
		jQuery.propFix[ this.toLowerCase() ] = this;
	} );
	
	
	
	
		// Strip and collapse whitespace according to HTML spec
		// https://html.spec.whatwg.org/multipage/infrastructure.html#strip-and-collapse-whitespace
		function stripAndCollapse( value ) {
			var tokens = value.match( rnothtmlwhite ) || [];
			return tokens.join( " " );
		}
	
	
	function getClass( elem ) {
		return elem.getAttribute && elem.getAttribute( "class" ) || "";
	}
	
	jQuery.fn.extend( {
		addClass: function( value ) {
			var classes, elem, cur, curValue, clazz, j, finalValue,
				i = 0;
	
			if ( jQuery.isFunction( value ) ) {
				return this.each( function( j ) {
					jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
				} );
			}
	
			if ( typeof value === "string" && value ) {
				classes = value.match( rnothtmlwhite ) || [];
	
				while ( ( elem = this[ i++ ] ) ) {
					curValue = getClass( elem );
					cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );
	
					if ( cur ) {
						j = 0;
						while ( ( clazz = classes[ j++ ] ) ) {
							if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
								cur += clazz + " ";
							}
						}
	
						// Only assign if different to avoid unneeded rendering.
						finalValue = stripAndCollapse( cur );
						if ( curValue !== finalValue ) {
							elem.setAttribute( "class", finalValue );
						}
					}
				}
			}
	
			return this;
		},
	
		removeClass: function( value ) {
			var classes, elem, cur, curValue, clazz, j, finalValue,
				i = 0;
	
			if ( jQuery.isFunction( value ) ) {
				return this.each( function( j ) {
					jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
				} );
			}
	
			if ( !arguments.length ) {
				return this.attr( "class", "" );
			}
	
			if ( typeof value === "string" && value ) {
				classes = value.match( rnothtmlwhite ) || [];
	
				while ( ( elem = this[ i++ ] ) ) {
					curValue = getClass( elem );
	
					// This expression is here for better compressibility (see addClass)
					cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );
	
					if ( cur ) {
						j = 0;
						while ( ( clazz = classes[ j++ ] ) ) {
	
							// Remove *all* instances
							while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
								cur = cur.replace( " " + clazz + " ", " " );
							}
						}
	
						// Only assign if different to avoid unneeded rendering.
						finalValue = stripAndCollapse( cur );
						if ( curValue !== finalValue ) {
							elem.setAttribute( "class", finalValue );
						}
					}
				}
			}
	
			return this;
		},
	
		toggleClass: function( value, stateVal ) {
			var type = typeof value;
	
			if ( typeof stateVal === "boolean" && type === "string" ) {
				return stateVal ? this.addClass( value ) : this.removeClass( value );
			}
	
			if ( jQuery.isFunction( value ) ) {
				return this.each( function( i ) {
					jQuery( this ).toggleClass(
						value.call( this, i, getClass( this ), stateVal ),
						stateVal
					);
				} );
			}
	
			return this.each( function() {
				var className, i, self, classNames;
	
				if ( type === "string" ) {
	
					// Toggle individual class names
					i = 0;
					self = jQuery( this );
					classNames = value.match( rnothtmlwhite ) || [];
	
					while ( ( className = classNames[ i++ ] ) ) {
	
						// Check each className given, space separated list
						if ( self.hasClass( className ) ) {
							self.removeClass( className );
						} else {
							self.addClass( className );
						}
					}
	
				// Toggle whole class name
				} else if ( value === undefined || type === "boolean" ) {
					className = getClass( this );
					if ( className ) {
	
						// Store className if set
						dataPriv.set( this, "__className__", className );
					}
	
					// If the element has a class name or if we're passed `false`,
					// then remove the whole classname (if there was one, the above saved it).
					// Otherwise bring back whatever was previously saved (if anything),
					// falling back to the empty string if nothing was stored.
					if ( this.setAttribute ) {
						this.setAttribute( "class",
							className || value === false ?
							"" :
							dataPriv.get( this, "__className__" ) || ""
						);
					}
				}
			} );
		},
	
		hasClass: function( selector ) {
			var className, elem,
				i = 0;
	
			className = " " + selector + " ";
			while ( ( elem = this[ i++ ] ) ) {
				if ( elem.nodeType === 1 &&
					( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
						return true;
				}
			}
	
			return false;
		}
	} );
	
	
	
	
	var rreturn = /\r/g;
	
	jQuery.fn.extend( {
		val: function( value ) {
			var hooks, ret, isFunction,
				elem = this[ 0 ];
	
			if ( !arguments.length ) {
				if ( elem ) {
					hooks = jQuery.valHooks[ elem.type ] ||
						jQuery.valHooks[ elem.nodeName.toLowerCase() ];
	
					if ( hooks &&
						"get" in hooks &&
						( ret = hooks.get( elem, "value" ) ) !== undefined
					) {
						return ret;
					}
	
					ret = elem.value;
	
					// Handle most common string cases
					if ( typeof ret === "string" ) {
						return ret.replace( rreturn, "" );
					}
	
					// Handle cases where value is null/undef or number
					return ret == null ? "" : ret;
				}
	
				return;
			}
	
			isFunction = jQuery.isFunction( value );
	
			return this.each( function( i ) {
				var val;
	
				if ( this.nodeType !== 1 ) {
					return;
				}
	
				if ( isFunction ) {
					val = value.call( this, i, jQuery( this ).val() );
				} else {
					val = value;
				}
	
				// Treat null/undefined as ""; convert numbers to string
				if ( val == null ) {
					val = "";
	
				} else if ( typeof val === "number" ) {
					val += "";
	
				} else if ( jQuery.isArray( val ) ) {
					val = jQuery.map( val, function( value ) {
						return value == null ? "" : value + "";
					} );
				}
	
				hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];
	
				// If set returns undefined, fall back to normal setting
				if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
					this.value = val;
				}
			} );
		}
	} );
	
	jQuery.extend( {
		valHooks: {
			option: {
				get: function( elem ) {
	
					var val = jQuery.find.attr( elem, "value" );
					return val != null ?
						val :
	
						// Support: IE <=10 - 11 only
						// option.text throws exceptions (#14686, #14858)
						// Strip and collapse whitespace
						// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
						stripAndCollapse( jQuery.text( elem ) );
				}
			},
			select: {
				get: function( elem ) {
					var value, option, i,
						options = elem.options,
						index = elem.selectedIndex,
						one = elem.type === "select-one",
						values = one ? null : [],
						max = one ? index + 1 : options.length;
	
					if ( index < 0 ) {
						i = max;
	
					} else {
						i = one ? index : 0;
					}
	
					// Loop through all the selected options
					for ( ; i < max; i++ ) {
						option = options[ i ];
	
						// Support: IE <=9 only
						// IE8-9 doesn't update selected after form reset (#2551)
						if ( ( option.selected || i === index ) &&
	
								// Don't return options that are disabled or in a disabled optgroup
								!option.disabled &&
								( !option.parentNode.disabled ||
									!jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {
	
							// Get the specific value for the option
							value = jQuery( option ).val();
	
							// We don't need an array for one selects
							if ( one ) {
								return value;
							}
	
							// Multi-Selects return an array
							values.push( value );
						}
					}
	
					return values;
				},
	
				set: function( elem, value ) {
					var optionSet, option,
						options = elem.options,
						values = jQuery.makeArray( value ),
						i = options.length;
	
					while ( i-- ) {
						option = options[ i ];
	
						/* eslint-disable no-cond-assign */
	
						if ( option.selected =
							jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
						) {
							optionSet = true;
						}
	
						/* eslint-enable no-cond-assign */
					}
	
					// Force browsers to behave consistently when non-matching value is set
					if ( !optionSet ) {
						elem.selectedIndex = -1;
					}
					return values;
				}
			}
		}
	} );
	
	// Radios and checkboxes getter/setter
	jQuery.each( [ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			set: function( elem, value ) {
				if ( jQuery.isArray( value ) ) {
					return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
				}
			}
		};
		if ( !support.checkOn ) {
			jQuery.valHooks[ this ].get = function( elem ) {
				return elem.getAttribute( "value" ) === null ? "on" : elem.value;
			};
		}
	} );
	
	
	
	
	// Return jQuery for attributes-only inclusion
	
	
	var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;
	
	jQuery.extend( jQuery.event, {
	
		trigger: function( event, data, elem, onlyHandlers ) {
	
			var i, cur, tmp, bubbleType, ontype, handle, special,
				eventPath = [ elem || document ],
				type = hasOwn.call( event, "type" ) ? event.type : event,
				namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];
	
			cur = tmp = elem = elem || document;
	
			// Don't do events on text and comment nodes
			if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
				return;
			}
	
			// focus/blur morphs to focusin/out; ensure we're not firing them right now
			if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
				return;
			}
	
			if ( type.indexOf( "." ) > -1 ) {
	
				// Namespaced trigger; create a regexp to match event type in handle()
				namespaces = type.split( "." );
				type = namespaces.shift();
				namespaces.sort();
			}
			ontype = type.indexOf( ":" ) < 0 && "on" + type;
	
			// Caller can pass in a jQuery.Event object, Object, or just an event type string
			event = event[ jQuery.expando ] ?
				event :
				new jQuery.Event( type, typeof event === "object" && event );
	
			// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
			event.isTrigger = onlyHandlers ? 2 : 3;
			event.namespace = namespaces.join( "." );
			event.rnamespace = event.namespace ?
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
				null;
	
			// Clean up the event in case it is being reused
			event.result = undefined;
			if ( !event.target ) {
				event.target = elem;
			}
	
			// Clone any incoming data and prepend the event, creating the handler arg list
			data = data == null ?
				[ event ] :
				jQuery.makeArray( data, [ event ] );
	
			// Allow special events to draw outside the lines
			special = jQuery.event.special[ type ] || {};
			if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
				return;
			}
	
			// Determine event propagation path in advance, per W3C events spec (#9951)
			// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
			if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {
	
				bubbleType = special.delegateType || type;
				if ( !rfocusMorph.test( bubbleType + type ) ) {
					cur = cur.parentNode;
				}
				for ( ; cur; cur = cur.parentNode ) {
					eventPath.push( cur );
					tmp = cur;
				}
	
				// Only add window if we got to document (e.g., not plain obj or detached DOM)
				if ( tmp === ( elem.ownerDocument || document ) ) {
					eventPath.push( tmp.defaultView || tmp.parentWindow || window );
				}
			}
	
			// Fire handlers on the event path
			i = 0;
			while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
	
				event.type = i > 1 ?
					bubbleType :
					special.bindType || type;
	
				// jQuery handler
				handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
					dataPriv.get( cur, "handle" );
				if ( handle ) {
					handle.apply( cur, data );
				}
	
				// Native handler
				handle = ontype && cur[ ontype ];
				if ( handle && handle.apply && acceptData( cur ) ) {
					event.result = handle.apply( cur, data );
					if ( event.result === false ) {
						event.preventDefault();
					}
				}
			}
			event.type = type;
	
			// If nobody prevented the default action, do it now
			if ( !onlyHandlers && !event.isDefaultPrevented() ) {
	
				if ( ( !special._default ||
					special._default.apply( eventPath.pop(), data ) === false ) &&
					acceptData( elem ) ) {
	
					// Call a native DOM method on the target with the same name as the event.
					// Don't do default actions on window, that's where global variables be (#6170)
					if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {
	
						// Don't re-trigger an onFOO event when we call its FOO() method
						tmp = elem[ ontype ];
	
						if ( tmp ) {
							elem[ ontype ] = null;
						}
	
						// Prevent re-triggering of the same event, since we already bubbled it above
						jQuery.event.triggered = type;
						elem[ type ]();
						jQuery.event.triggered = undefined;
	
						if ( tmp ) {
							elem[ ontype ] = tmp;
						}
					}
				}
			}
	
			return event.result;
		},
	
		// Piggyback on a donor event to simulate a different one
		// Used only for `focus(in | out)` events
		simulate: function( type, elem, event ) {
			var e = jQuery.extend(
				new jQuery.Event(),
				event,
				{
					type: type,
					isSimulated: true
				}
			);
	
			jQuery.event.trigger( e, null, elem );
		}
	
	} );
	
	jQuery.fn.extend( {
	
		trigger: function( type, data ) {
			return this.each( function() {
				jQuery.event.trigger( type, data, this );
			} );
		},
		triggerHandler: function( type, data ) {
			var elem = this[ 0 ];
			if ( elem ) {
				return jQuery.event.trigger( type, data, elem, true );
			}
		}
	} );
	
	
	jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
		"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
		"change select submit keydown keypress keyup contextmenu" ).split( " " ),
		function( i, name ) {
	
		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	} );
	
	jQuery.fn.extend( {
		hover: function( fnOver, fnOut ) {
			return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
		}
	} );
	
	
	
	
	support.focusin = "onfocusin" in window;
	
	
	// Support: Firefox <=44
	// Firefox doesn't have focus(in | out) events
	// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
	//
	// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
	// focus(in | out) events fire after focus & blur events,
	// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
	// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
	if ( !support.focusin ) {
		jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {
	
			// Attach a single capturing handler on the document while someone wants focusin/focusout
			var handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
			};
	
			jQuery.event.special[ fix ] = {
				setup: function() {
					var doc = this.ownerDocument || this,
						attaches = dataPriv.access( doc, fix );
	
					if ( !attaches ) {
						doc.addEventListener( orig, handler, true );
					}
					dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
				},
				teardown: function() {
					var doc = this.ownerDocument || this,
						attaches = dataPriv.access( doc, fix ) - 1;
	
					if ( !attaches ) {
						doc.removeEventListener( orig, handler, true );
						dataPriv.remove( doc, fix );
	
					} else {
						dataPriv.access( doc, fix, attaches );
					}
				}
			};
		} );
	}
	var location = window.location;
	
	var nonce = jQuery.now();
	
	var rquery = ( /\?/ );
	
	
	
	// Cross-browser xml parsing
	jQuery.parseXML = function( data ) {
		var xml;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
	
		// Support: IE 9 - 11 only
		// IE throws on parseFromString with invalid input.
		try {
			xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
		} catch ( e ) {
			xml = undefined;
		}
	
		if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	};
	
	
	var
		rbracket = /\[\]$/,
		rCRLF = /\r?\n/g,
		rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
		rsubmittable = /^(?:input|select|textarea|keygen)/i;
	
	function buildParams( prefix, obj, traditional, add ) {
		var name;
	
		if ( jQuery.isArray( obj ) ) {
	
			// Serialize array item.
			jQuery.each( obj, function( i, v ) {
				if ( traditional || rbracket.test( prefix ) ) {
	
					// Treat each array item as a scalar.
					add( prefix, v );
	
				} else {
	
					// Item is non-scalar (array or object), encode its numeric index.
					buildParams(
						prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
						v,
						traditional,
						add
					);
				}
			} );
	
		} else if ( !traditional && jQuery.type( obj ) === "object" ) {
	
			// Serialize object item.
			for ( name in obj ) {
				buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
			}
	
		} else {
	
			// Serialize scalar item.
			add( prefix, obj );
		}
	}
	
	// Serialize an array of form elements or a set of
	// key/values into a query string
	jQuery.param = function( a, traditional ) {
		var prefix,
			s = [],
			add = function( key, valueOrFunction ) {
	
				// If value is a function, invoke it and use its return value
				var value = jQuery.isFunction( valueOrFunction ) ?
					valueOrFunction() :
					valueOrFunction;
	
				s[ s.length ] = encodeURIComponent( key ) + "=" +
					encodeURIComponent( value == null ? "" : value );
			};
	
		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
	
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			} );
	
		} else {
	
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}
	
		// Return the resulting serialization
		return s.join( "&" );
	};
	
	jQuery.fn.extend( {
		serialize: function() {
			return jQuery.param( this.serializeArray() );
		},
		serializeArray: function() {
			return this.map( function() {
	
				// Can add propHook for "elements" to filter or add form elements
				var elements = jQuery.prop( this, "elements" );
				return elements ? jQuery.makeArray( elements ) : this;
			} )
			.filter( function() {
				var type = this.type;
	
				// Use .is( ":disabled" ) so that fieldset[disabled] works
				return this.name && !jQuery( this ).is( ":disabled" ) &&
					rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
					( this.checked || !rcheckableType.test( type ) );
			} )
			.map( function( i, elem ) {
				var val = jQuery( this ).val();
	
				if ( val == null ) {
					return null;
				}
	
				if ( jQuery.isArray( val ) ) {
					return jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					} );
				}
	
				return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
			} ).get();
		}
	} );
	
	
	var
		r20 = /%20/g,
		rhash = /#.*$/,
		rantiCache = /([?&])_=[^&]*/,
		rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
	
		// #7653, #8125, #8152: local protocol detection
		rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
		rnoContent = /^(?:GET|HEAD)$/,
		rprotocol = /^\/\//,
	
		/* Prefilters
		 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
		 * 2) These are called:
		 *    - BEFORE asking for a transport
		 *    - AFTER param serialization (s.data is a string if s.processData is true)
		 * 3) key is the dataType
		 * 4) the catchall symbol "*" can be used
		 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
		 */
		prefilters = {},
	
		/* Transports bindings
		 * 1) key is the dataType
		 * 2) the catchall symbol "*" can be used
		 * 3) selection will start with transport dataType and THEN go to "*" if needed
		 */
		transports = {},
	
		// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
		allTypes = "*/".concat( "*" ),
	
		// Anchor tag for parsing the document origin
		originAnchor = document.createElement( "a" );
		originAnchor.href = location.href;
	
	// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
	function addToPrefiltersOrTransports( structure ) {
	
		// dataTypeExpression is optional and defaults to "*"
		return function( dataTypeExpression, func ) {
	
			if ( typeof dataTypeExpression !== "string" ) {
				func = dataTypeExpression;
				dataTypeExpression = "*";
			}
	
			var dataType,
				i = 0,
				dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];
	
			if ( jQuery.isFunction( func ) ) {
	
				// For each dataType in the dataTypeExpression
				while ( ( dataType = dataTypes[ i++ ] ) ) {
	
					// Prepend if requested
					if ( dataType[ 0 ] === "+" ) {
						dataType = dataType.slice( 1 ) || "*";
						( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );
	
					// Otherwise append
					} else {
						( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
					}
				}
			}
		};
	}
	
	// Base inspection function for prefilters and transports
	function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {
	
		var inspected = {},
			seekingTransport = ( structure === transports );
	
		function inspect( dataType ) {
			var selected;
			inspected[ dataType ] = true;
			jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
				var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
				if ( typeof dataTypeOrTransport === "string" &&
					!seekingTransport && !inspected[ dataTypeOrTransport ] ) {
	
					options.dataTypes.unshift( dataTypeOrTransport );
					inspect( dataTypeOrTransport );
					return false;
				} else if ( seekingTransport ) {
					return !( selected = dataTypeOrTransport );
				}
			} );
			return selected;
		}
	
		return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
	}
	
	// A special extend for ajax options
	// that takes "flat" options (not to be deep extended)
	// Fixes #9887
	function ajaxExtend( target, src ) {
		var key, deep,
			flatOptions = jQuery.ajaxSettings.flatOptions || {};
	
		for ( key in src ) {
			if ( src[ key ] !== undefined ) {
				( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
			}
		}
		if ( deep ) {
			jQuery.extend( true, target, deep );
		}
	
		return target;
	}
	
	/* Handles responses to an ajax request:
	 * - finds the right dataType (mediates between content-type and expected dataType)
	 * - returns the corresponding response
	 */
	function ajaxHandleResponses( s, jqXHR, responses ) {
	
		var ct, type, finalDataType, firstDataType,
			contents = s.contents,
			dataTypes = s.dataTypes;
	
		// Remove auto dataType and get content-type in the process
		while ( dataTypes[ 0 ] === "*" ) {
			dataTypes.shift();
			if ( ct === undefined ) {
				ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
			}
		}
	
		// Check if we're dealing with a known content-type
		if ( ct ) {
			for ( type in contents ) {
				if ( contents[ type ] && contents[ type ].test( ct ) ) {
					dataTypes.unshift( type );
					break;
				}
			}
		}
	
		// Check to see if we have a response for the expected dataType
		if ( dataTypes[ 0 ] in responses ) {
			finalDataType = dataTypes[ 0 ];
		} else {
	
			// Try convertible dataTypes
			for ( type in responses ) {
				if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
					finalDataType = type;
					break;
				}
				if ( !firstDataType ) {
					firstDataType = type;
				}
			}
	
			// Or just use first one
			finalDataType = finalDataType || firstDataType;
		}
	
		// If we found a dataType
		// We add the dataType to the list if needed
		// and return the corresponding response
		if ( finalDataType ) {
			if ( finalDataType !== dataTypes[ 0 ] ) {
				dataTypes.unshift( finalDataType );
			}
			return responses[ finalDataType ];
		}
	}
	
	/* Chain conversions given the request and the original response
	 * Also sets the responseXXX fields on the jqXHR instance
	 */
	function ajaxConvert( s, response, jqXHR, isSuccess ) {
		var conv2, current, conv, tmp, prev,
			converters = {},
	
			// Work with a copy of dataTypes in case we need to modify it for conversion
			dataTypes = s.dataTypes.slice();
	
		// Create converters map with lowercased keys
		if ( dataTypes[ 1 ] ) {
			for ( conv in s.converters ) {
				converters[ conv.toLowerCase() ] = s.converters[ conv ];
			}
		}
	
		current = dataTypes.shift();
	
		// Convert to each sequential dataType
		while ( current ) {
	
			if ( s.responseFields[ current ] ) {
				jqXHR[ s.responseFields[ current ] ] = response;
			}
	
			// Apply the dataFilter if provided
			if ( !prev && isSuccess && s.dataFilter ) {
				response = s.dataFilter( response, s.dataType );
			}
	
			prev = current;
			current = dataTypes.shift();
	
			if ( current ) {
	
				// There's only work to do if current dataType is non-auto
				if ( current === "*" ) {
	
					current = prev;
	
				// Convert response if prev dataType is non-auto and differs from current
				} else if ( prev !== "*" && prev !== current ) {
	
					// Seek a direct converter
					conv = converters[ prev + " " + current ] || converters[ "* " + current ];
	
					// If none found, seek a pair
					if ( !conv ) {
						for ( conv2 in converters ) {
	
							// If conv2 outputs current
							tmp = conv2.split( " " );
							if ( tmp[ 1 ] === current ) {
	
								// If prev can be converted to accepted input
								conv = converters[ prev + " " + tmp[ 0 ] ] ||
									converters[ "* " + tmp[ 0 ] ];
								if ( conv ) {
	
									// Condense equivalence converters
									if ( conv === true ) {
										conv = converters[ conv2 ];
	
									// Otherwise, insert the intermediate dataType
									} else if ( converters[ conv2 ] !== true ) {
										current = tmp[ 0 ];
										dataTypes.unshift( tmp[ 1 ] );
									}
									break;
								}
							}
						}
					}
	
					// Apply converter (if not an equivalence)
					if ( conv !== true ) {
	
						// Unless errors are allowed to bubble, catch and return them
						if ( conv && s.throws ) {
							response = conv( response );
						} else {
							try {
								response = conv( response );
							} catch ( e ) {
								return {
									state: "parsererror",
									error: conv ? e : "No conversion from " + prev + " to " + current
								};
							}
						}
					}
				}
			}
		}
	
		return { state: "success", data: response };
	}
	
	jQuery.extend( {
	
		// Counter for holding the number of active queries
		active: 0,
	
		// Last-Modified header cache for next request
		lastModified: {},
		etag: {},
	
		ajaxSettings: {
			url: location.href,
			type: "GET",
			isLocal: rlocalProtocol.test( location.protocol ),
			global: true,
			processData: true,
			async: true,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
	
			/*
			timeout: 0,
			data: null,
			dataType: null,
			username: null,
			password: null,
			cache: null,
			throws: false,
			traditional: false,
			headers: {},
			*/
	
			accepts: {
				"*": allTypes,
				text: "text/plain",
				html: "text/html",
				xml: "application/xml, text/xml",
				json: "application/json, text/javascript"
			},
	
			contents: {
				xml: /\bxml\b/,
				html: /\bhtml/,
				json: /\bjson\b/
			},
	
			responseFields: {
				xml: "responseXML",
				text: "responseText",
				json: "responseJSON"
			},
	
			// Data converters
			// Keys separate source (or catchall "*") and destination types with a single space
			converters: {
	
				// Convert anything to text
				"* text": String,
	
				// Text to html (true = no transformation)
				"text html": true,
	
				// Evaluate text as a json expression
				"text json": JSON.parse,
	
				// Parse text as xml
				"text xml": jQuery.parseXML
			},
	
			// For options that shouldn't be deep extended:
			// you can add your own custom options here if
			// and when you create one that shouldn't be
			// deep extended (see ajaxExtend)
			flatOptions: {
				url: true,
				context: true
			}
		},
	
		// Creates a full fledged settings object into target
		// with both ajaxSettings and settings fields.
		// If target is omitted, writes into ajaxSettings.
		ajaxSetup: function( target, settings ) {
			return settings ?
	
				// Building a settings object
				ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :
	
				// Extending ajaxSettings
				ajaxExtend( jQuery.ajaxSettings, target );
		},
	
		ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
		ajaxTransport: addToPrefiltersOrTransports( transports ),
	
		// Main method
		ajax: function( url, options ) {
	
			// If url is an object, simulate pre-1.5 signature
			if ( typeof url === "object" ) {
				options = url;
				url = undefined;
			}
	
			// Force options to be an object
			options = options || {};
	
			var transport,
	
				// URL without anti-cache param
				cacheURL,
	
				// Response headers
				responseHeadersString,
				responseHeaders,
	
				// timeout handle
				timeoutTimer,
	
				// Url cleanup var
				urlAnchor,
	
				// Request state (becomes false upon send and true upon completion)
				completed,
	
				// To know if global events are to be dispatched
				fireGlobals,
	
				// Loop variable
				i,
	
				// uncached part of the url
				uncached,
	
				// Create the final options object
				s = jQuery.ajaxSetup( {}, options ),
	
				// Callbacks context
				callbackContext = s.context || s,
	
				// Context for global events is callbackContext if it is a DOM node or jQuery collection
				globalEventContext = s.context &&
					( callbackContext.nodeType || callbackContext.jquery ) ?
						jQuery( callbackContext ) :
						jQuery.event,
	
				// Deferreds
				deferred = jQuery.Deferred(),
				completeDeferred = jQuery.Callbacks( "once memory" ),
	
				// Status-dependent callbacks
				statusCode = s.statusCode || {},
	
				// Headers (they are sent all at once)
				requestHeaders = {},
				requestHeadersNames = {},
	
				// Default abort message
				strAbort = "canceled",
	
				// Fake xhr
				jqXHR = {
					readyState: 0,
	
					// Builds headers hashtable if needed
					getResponseHeader: function( key ) {
						var match;
						if ( completed ) {
							if ( !responseHeaders ) {
								responseHeaders = {};
								while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
									responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
								}
							}
							match = responseHeaders[ key.toLowerCase() ];
						}
						return match == null ? null : match;
					},
	
					// Raw string
					getAllResponseHeaders: function() {
						return completed ? responseHeadersString : null;
					},
	
					// Caches the header
					setRequestHeader: function( name, value ) {
						if ( completed == null ) {
							name = requestHeadersNames[ name.toLowerCase() ] =
								requestHeadersNames[ name.toLowerCase() ] || name;
							requestHeaders[ name ] = value;
						}
						return this;
					},
	
					// Overrides response content-type header
					overrideMimeType: function( type ) {
						if ( completed == null ) {
							s.mimeType = type;
						}
						return this;
					},
	
					// Status-dependent callbacks
					statusCode: function( map ) {
						var code;
						if ( map ) {
							if ( completed ) {
	
								// Execute the appropriate callbacks
								jqXHR.always( map[ jqXHR.status ] );
							} else {
	
								// Lazy-add the new callbacks in a way that preserves old ones
								for ( code in map ) {
									statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
								}
							}
						}
						return this;
					},
	
					// Cancel the request
					abort: function( statusText ) {
						var finalText = statusText || strAbort;
						if ( transport ) {
							transport.abort( finalText );
						}
						done( 0, finalText );
						return this;
					}
				};
	
			// Attach deferreds
			deferred.promise( jqXHR );
	
			// Add protocol if not provided (prefilters might expect it)
			// Handle falsy url in the settings object (#10093: consistency with old signature)
			// We also use the url parameter if available
			s.url = ( ( url || s.url || location.href ) + "" )
				.replace( rprotocol, location.protocol + "//" );
	
			// Alias method option to type as per ticket #12004
			s.type = options.method || options.type || s.method || s.type;
	
			// Extract dataTypes list
			s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];
	
			// A cross-domain request is in order when the origin doesn't match the current origin.
			if ( s.crossDomain == null ) {
				urlAnchor = document.createElement( "a" );
	
				// Support: IE <=8 - 11, Edge 12 - 13
				// IE throws exception on accessing the href property if url is malformed,
				// e.g. http://example.com:80x/
				try {
					urlAnchor.href = s.url;
	
					// Support: IE <=8 - 11 only
					// Anchor's host property isn't correctly set when s.url is relative
					urlAnchor.href = urlAnchor.href;
					s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
						urlAnchor.protocol + "//" + urlAnchor.host;
				} catch ( e ) {
	
					// If there is an error parsing the URL, assume it is crossDomain,
					// it can be rejected by the transport if it is invalid
					s.crossDomain = true;
				}
			}
	
			// Convert data if not already a string
			if ( s.data && s.processData && typeof s.data !== "string" ) {
				s.data = jQuery.param( s.data, s.traditional );
			}
	
			// Apply prefilters
			inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );
	
			// If request was aborted inside a prefilter, stop there
			if ( completed ) {
				return jqXHR;
			}
	
			// We can fire global events as of now if asked to
			// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
			fireGlobals = jQuery.event && s.global;
	
			// Watch for a new set of requests
			if ( fireGlobals && jQuery.active++ === 0 ) {
				jQuery.event.trigger( "ajaxStart" );
			}
	
			// Uppercase the type
			s.type = s.type.toUpperCase();
	
			// Determine if request has content
			s.hasContent = !rnoContent.test( s.type );
	
			// Save the URL in case we're toying with the If-Modified-Since
			// and/or If-None-Match header later on
			// Remove hash to simplify url manipulation
			cacheURL = s.url.replace( rhash, "" );
	
			// More options handling for requests with no content
			if ( !s.hasContent ) {
	
				// Remember the hash so we can put it back
				uncached = s.url.slice( cacheURL.length );
	
				// If data is available, append data to url
				if ( s.data ) {
					cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;
	
					// #9682: remove data so that it's not used in an eventual retry
					delete s.data;
				}
	
				// Add or update anti-cache param if needed
				if ( s.cache === false ) {
					cacheURL = cacheURL.replace( rantiCache, "$1" );
					uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce++ ) + uncached;
				}
	
				// Put hash and anti-cache on the URL that will be requested (gh-1732)
				s.url = cacheURL + uncached;
	
			// Change '%20' to '+' if this is encoded form body content (gh-2658)
			} else if ( s.data && s.processData &&
				( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
				s.data = s.data.replace( r20, "+" );
			}
	
			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if ( s.ifModified ) {
				if ( jQuery.lastModified[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
				}
				if ( jQuery.etag[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
				}
			}
	
			// Set the correct header, if data is being sent
			if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
				jqXHR.setRequestHeader( "Content-Type", s.contentType );
			}
	
			// Set the Accepts header for the server, depending on the dataType
			jqXHR.setRequestHeader(
				"Accept",
				s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
					s.accepts[ s.dataTypes[ 0 ] ] +
						( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
					s.accepts[ "*" ]
			);
	
			// Check for headers option
			for ( i in s.headers ) {
				jqXHR.setRequestHeader( i, s.headers[ i ] );
			}
	
			// Allow custom headers/mimetypes and early abort
			if ( s.beforeSend &&
				( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {
	
				// Abort if not done already and return
				return jqXHR.abort();
			}
	
			// Aborting is no longer a cancellation
			strAbort = "abort";
	
			// Install callbacks on deferreds
			completeDeferred.add( s.complete );
			jqXHR.done( s.success );
			jqXHR.fail( s.error );
	
			// Get transport
			transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );
	
			// If no transport, we auto-abort
			if ( !transport ) {
				done( -1, "No Transport" );
			} else {
				jqXHR.readyState = 1;
	
				// Send global event
				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
				}
	
				// If request was aborted inside ajaxSend, stop there
				if ( completed ) {
					return jqXHR;
				}
	
				// Timeout
				if ( s.async && s.timeout > 0 ) {
					timeoutTimer = window.setTimeout( function() {
						jqXHR.abort( "timeout" );
					}, s.timeout );
				}
	
				try {
					completed = false;
					transport.send( requestHeaders, done );
				} catch ( e ) {
	
					// Rethrow post-completion exceptions
					if ( completed ) {
						throw e;
					}
	
					// Propagate others as results
					done( -1, e );
				}
			}
	
			// Callback for when everything is done
			function done( status, nativeStatusText, responses, headers ) {
				var isSuccess, success, error, response, modified,
					statusText = nativeStatusText;
	
				// Ignore repeat invocations
				if ( completed ) {
					return;
				}
	
				completed = true;
	
				// Clear timeout if it exists
				if ( timeoutTimer ) {
					window.clearTimeout( timeoutTimer );
				}
	
				// Dereference transport for early garbage collection
				// (no matter how long the jqXHR object will be used)
				transport = undefined;
	
				// Cache response headers
				responseHeadersString = headers || "";
	
				// Set readyState
				jqXHR.readyState = status > 0 ? 4 : 0;
	
				// Determine if successful
				isSuccess = status >= 200 && status < 300 || status === 304;
	
				// Get response data
				if ( responses ) {
					response = ajaxHandleResponses( s, jqXHR, responses );
				}
	
				// Convert no matter what (that way responseXXX fields are always set)
				response = ajaxConvert( s, response, jqXHR, isSuccess );
	
				// If successful, handle type chaining
				if ( isSuccess ) {
	
					// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
					if ( s.ifModified ) {
						modified = jqXHR.getResponseHeader( "Last-Modified" );
						if ( modified ) {
							jQuery.lastModified[ cacheURL ] = modified;
						}
						modified = jqXHR.getResponseHeader( "etag" );
						if ( modified ) {
							jQuery.etag[ cacheURL ] = modified;
						}
					}
	
					// if no content
					if ( status === 204 || s.type === "HEAD" ) {
						statusText = "nocontent";
	
					// if not modified
					} else if ( status === 304 ) {
						statusText = "notmodified";
	
					// If we have data, let's convert it
					} else {
						statusText = response.state;
						success = response.data;
						error = response.error;
						isSuccess = !error;
					}
				} else {
	
					// Extract error from statusText and normalize for non-aborts
					error = statusText;
					if ( status || !statusText ) {
						statusText = "error";
						if ( status < 0 ) {
							status = 0;
						}
					}
				}
	
				// Set data for the fake xhr object
				jqXHR.status = status;
				jqXHR.statusText = ( nativeStatusText || statusText ) + "";
	
				// Success/Error
				if ( isSuccess ) {
					deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
				} else {
					deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
				}
	
				// Status-dependent callbacks
				jqXHR.statusCode( statusCode );
				statusCode = undefined;
	
				if ( fireGlobals ) {
					globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
						[ jqXHR, s, isSuccess ? success : error ] );
				}
	
				// Complete
				completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );
	
				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
	
					// Handle the global AJAX counter
					if ( !( --jQuery.active ) ) {
						jQuery.event.trigger( "ajaxStop" );
					}
				}
			}
	
			return jqXHR;
		},
	
		getJSON: function( url, data, callback ) {
			return jQuery.get( url, data, callback, "json" );
		},
	
		getScript: function( url, callback ) {
			return jQuery.get( url, undefined, callback, "script" );
		}
	} );
	
	jQuery.each( [ "get", "post" ], function( i, method ) {
		jQuery[ method ] = function( url, data, callback, type ) {
	
			// Shift arguments if data argument was omitted
			if ( jQuery.isFunction( data ) ) {
				type = type || callback;
				callback = data;
				data = undefined;
			}
	
			// The url can be an options object (which then must have .url)
			return jQuery.ajax( jQuery.extend( {
				url: url,
				type: method,
				dataType: type,
				data: data,
				success: callback
			}, jQuery.isPlainObject( url ) && url ) );
		};
	} );
	
	
	jQuery._evalUrl = function( url ) {
		return jQuery.ajax( {
			url: url,
	
			// Make this explicit, since user can override this through ajaxSetup (#11264)
			type: "GET",
			dataType: "script",
			cache: true,
			async: false,
			global: false,
			"throws": true
		} );
	};
	
	
	jQuery.fn.extend( {
		wrapAll: function( html ) {
			var wrap;
	
			if ( this[ 0 ] ) {
				if ( jQuery.isFunction( html ) ) {
					html = html.call( this[ 0 ] );
				}
	
				// The elements to wrap the target around
				wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );
	
				if ( this[ 0 ].parentNode ) {
					wrap.insertBefore( this[ 0 ] );
				}
	
				wrap.map( function() {
					var elem = this;
	
					while ( elem.firstElementChild ) {
						elem = elem.firstElementChild;
					}
	
					return elem;
				} ).append( this );
			}
	
			return this;
		},
	
		wrapInner: function( html ) {
			if ( jQuery.isFunction( html ) ) {
				return this.each( function( i ) {
					jQuery( this ).wrapInner( html.call( this, i ) );
				} );
			}
	
			return this.each( function() {
				var self = jQuery( this ),
					contents = self.contents();
	
				if ( contents.length ) {
					contents.wrapAll( html );
	
				} else {
					self.append( html );
				}
			} );
		},
	
		wrap: function( html ) {
			var isFunction = jQuery.isFunction( html );
	
			return this.each( function( i ) {
				jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
			} );
		},
	
		unwrap: function( selector ) {
			this.parent( selector ).not( "body" ).each( function() {
				jQuery( this ).replaceWith( this.childNodes );
			} );
			return this;
		}
	} );
	
	
	jQuery.expr.pseudos.hidden = function( elem ) {
		return !jQuery.expr.pseudos.visible( elem );
	};
	jQuery.expr.pseudos.visible = function( elem ) {
		return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
	};
	
	
	
	
	jQuery.ajaxSettings.xhr = function() {
		try {
			return new window.XMLHttpRequest();
		} catch ( e ) {}
	};
	
	var xhrSuccessStatus = {
	
			// File protocol always yields status code 0, assume 200
			0: 200,
	
			// Support: IE <=9 only
			// #1450: sometimes IE returns 1223 when it should be 204
			1223: 204
		},
		xhrSupported = jQuery.ajaxSettings.xhr();
	
	support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
	support.ajax = xhrSupported = !!xhrSupported;
	
	jQuery.ajaxTransport( function( options ) {
		var callback, errorCallback;
	
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( support.cors || xhrSupported && !options.crossDomain ) {
			return {
				send: function( headers, complete ) {
					var i,
						xhr = options.xhr();
	
					xhr.open(
						options.type,
						options.url,
						options.async,
						options.username,
						options.password
					);
	
					// Apply custom fields if provided
					if ( options.xhrFields ) {
						for ( i in options.xhrFields ) {
							xhr[ i ] = options.xhrFields[ i ];
						}
					}
	
					// Override mime type if needed
					if ( options.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( options.mimeType );
					}
	
					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}
	
					// Set headers
					for ( i in headers ) {
						xhr.setRequestHeader( i, headers[ i ] );
					}
	
					// Callback
					callback = function( type ) {
						return function() {
							if ( callback ) {
								callback = errorCallback = xhr.onload =
									xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;
	
								if ( type === "abort" ) {
									xhr.abort();
								} else if ( type === "error" ) {
	
									// Support: IE <=9 only
									// On a manual native abort, IE9 throws
									// errors on any property access that is not readyState
									if ( typeof xhr.status !== "number" ) {
										complete( 0, "error" );
									} else {
										complete(
	
											// File: protocol always yields status 0; see #8605, #14207
											xhr.status,
											xhr.statusText
										);
									}
								} else {
									complete(
										xhrSuccessStatus[ xhr.status ] || xhr.status,
										xhr.statusText,
	
										// Support: IE <=9 only
										// IE9 has no XHR2 but throws on binary (trac-11426)
										// For XHR2 non-text, let the caller handle it (gh-2498)
										( xhr.responseType || "text" ) !== "text"  ||
										typeof xhr.responseText !== "string" ?
											{ binary: xhr.response } :
											{ text: xhr.responseText },
										xhr.getAllResponseHeaders()
									);
								}
							}
						};
					};
	
					// Listen to events
					xhr.onload = callback();
					errorCallback = xhr.onerror = callback( "error" );
	
					// Support: IE 9 only
					// Use onreadystatechange to replace onabort
					// to handle uncaught aborts
					if ( xhr.onabort !== undefined ) {
						xhr.onabort = errorCallback;
					} else {
						xhr.onreadystatechange = function() {
	
							// Check readyState before timeout as it changes
							if ( xhr.readyState === 4 ) {
	
								// Allow onerror to be called first,
								// but that will not handle a native abort
								// Also, save errorCallback to a variable
								// as xhr.onerror cannot be accessed
								window.setTimeout( function() {
									if ( callback ) {
										errorCallback();
									}
								} );
							}
						};
					}
	
					// Create the abort callback
					callback = callback( "abort" );
	
					try {
	
						// Do send the request (this may raise an exception)
						xhr.send( options.hasContent && options.data || null );
					} catch ( e ) {
	
						// #14683: Only rethrow if this hasn't been notified as an error yet
						if ( callback ) {
							throw e;
						}
					}
				},
	
				abort: function() {
					if ( callback ) {
						callback();
					}
				}
			};
		}
	} );
	
	
	
	
	// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
	jQuery.ajaxPrefilter( function( s ) {
		if ( s.crossDomain ) {
			s.contents.script = false;
		}
	} );
	
	// Install script dataType
	jQuery.ajaxSetup( {
		accepts: {
			script: "text/javascript, application/javascript, " +
				"application/ecmascript, application/x-ecmascript"
		},
		contents: {
			script: /\b(?:java|ecma)script\b/
		},
		converters: {
			"text script": function( text ) {
				jQuery.globalEval( text );
				return text;
			}
		}
	} );
	
	// Handle cache's special case and crossDomain
	jQuery.ajaxPrefilter( "script", function( s ) {
		if ( s.cache === undefined ) {
			s.cache = false;
		}
		if ( s.crossDomain ) {
			s.type = "GET";
		}
	} );
	
	// Bind script tag hack transport
	jQuery.ajaxTransport( "script", function( s ) {
	
		// This transport only deals with cross domain requests
		if ( s.crossDomain ) {
			var script, callback;
			return {
				send: function( _, complete ) {
					script = jQuery( "<script>" ).prop( {
						charset: s.scriptCharset,
						src: s.url
					} ).on(
						"load error",
						callback = function( evt ) {
							script.remove();
							callback = null;
							if ( evt ) {
								complete( evt.type === "error" ? 404 : 200, evt.type );
							}
						}
					);
	
					// Use native DOM manipulation to avoid our domManip AJAX trickery
					document.head.appendChild( script[ 0 ] );
				},
				abort: function() {
					if ( callback ) {
						callback();
					}
				}
			};
		}
	} );
	
	
	
	
	var oldCallbacks = [],
		rjsonp = /(=)\?(?=&|$)|\?\?/;
	
	// Default jsonp settings
	jQuery.ajaxSetup( {
		jsonp: "callback",
		jsonpCallback: function() {
			var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
			this[ callback ] = true;
			return callback;
		}
	} );
	
	// Detect, normalize options and install callbacks for jsonp requests
	jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {
	
		var callbackName, overwritten, responseContainer,
			jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
				"url" :
				typeof s.data === "string" &&
					( s.contentType || "" )
						.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
					rjsonp.test( s.data ) && "data"
			);
	
		// Handle iff the expected data type is "jsonp" or we have a parameter to set
		if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {
	
			// Get callback name, remembering preexisting value associated with it
			callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
				s.jsonpCallback() :
				s.jsonpCallback;
	
			// Insert callback into url or form data
			if ( jsonProp ) {
				s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
			} else if ( s.jsonp !== false ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
			}
	
			// Use data converter to retrieve json after script execution
			s.converters[ "script json" ] = function() {
				if ( !responseContainer ) {
					jQuery.error( callbackName + " was not called" );
				}
				return responseContainer[ 0 ];
			};
	
			// Force json dataType
			s.dataTypes[ 0 ] = "json";
	
			// Install callback
			overwritten = window[ callbackName ];
			window[ callbackName ] = function() {
				responseContainer = arguments;
			};
	
			// Clean-up function (fires after converters)
			jqXHR.always( function() {
	
				// If previous value didn't exist - remove it
				if ( overwritten === undefined ) {
					jQuery( window ).removeProp( callbackName );
	
				// Otherwise restore preexisting value
				} else {
					window[ callbackName ] = overwritten;
				}
	
				// Save back as free
				if ( s[ callbackName ] ) {
	
					// Make sure that re-using the options doesn't screw things around
					s.jsonpCallback = originalSettings.jsonpCallback;
	
					// Save the callback name for future use
					oldCallbacks.push( callbackName );
				}
	
				// Call if it was a function and we have a response
				if ( responseContainer && jQuery.isFunction( overwritten ) ) {
					overwritten( responseContainer[ 0 ] );
				}
	
				responseContainer = overwritten = undefined;
			} );
	
			// Delegate to script
			return "script";
		}
	} );
	
	
	
	
	// Support: Safari 8 only
	// In Safari 8 documents created via document.implementation.createHTMLDocument
	// collapse sibling forms: the second one becomes a child of the first one.
	// Because of that, this security measure has to be disabled in Safari 8.
	// https://bugs.webkit.org/show_bug.cgi?id=137337
	support.createHTMLDocument = ( function() {
		var body = document.implementation.createHTMLDocument( "" ).body;
		body.innerHTML = "<form></form><form></form>";
		return body.childNodes.length === 2;
	} )();
	
	
	// Argument "data" should be string of html
	// context (optional): If specified, the fragment will be created in this context,
	// defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	jQuery.parseHTML = function( data, context, keepScripts ) {
		if ( typeof data !== "string" ) {
			return [];
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
	
		var base, parsed, scripts;
	
		if ( !context ) {
	
			// Stop scripts or inline event handlers from being executed immediately
			// by using document.implementation
			if ( support.createHTMLDocument ) {
				context = document.implementation.createHTMLDocument( "" );
	
				// Set the base href for the created document
				// so any parsed elements with URLs
				// are based on the document's URL (gh-2965)
				base = context.createElement( "base" );
				base.href = document.location.href;
				context.head.appendChild( base );
			} else {
				context = document;
			}
		}
	
		parsed = rsingleTag.exec( data );
		scripts = !keepScripts && [];
	
		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[ 1 ] ) ];
		}
	
		parsed = buildFragment( [ data ], context, scripts );
	
		if ( scripts && scripts.length ) {
			jQuery( scripts ).remove();
		}
	
		return jQuery.merge( [], parsed.childNodes );
	};
	
	
	/**
	 * Load a url into a page
	 */
	jQuery.fn.load = function( url, params, callback ) {
		var selector, type, response,
			self = this,
			off = url.indexOf( " " );
	
		if ( off > -1 ) {
			selector = stripAndCollapse( url.slice( off ) );
			url = url.slice( 0, off );
		}
	
		// If it's a function
		if ( jQuery.isFunction( params ) ) {
	
			// We assume that it's the callback
			callback = params;
			params = undefined;
	
		// Otherwise, build a param string
		} else if ( params && typeof params === "object" ) {
			type = "POST";
		}
	
		// If we have elements to modify, make the request
		if ( self.length > 0 ) {
			jQuery.ajax( {
				url: url,
	
				// If "type" variable is undefined, then "GET" method will be used.
				// Make value of this field explicit since
				// user can override it through ajaxSetup method
				type: type || "GET",
				dataType: "html",
				data: params
			} ).done( function( responseText ) {
	
				// Save response for use in complete callback
				response = arguments;
	
				self.html( selector ?
	
					// If a selector was specified, locate the right elements in a dummy div
					// Exclude scripts to avoid IE 'Permission Denied' errors
					jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :
	
					// Otherwise use the full result
					responseText );
	
			// If the request succeeds, this function gets "data", "status", "jqXHR"
			// but they are ignored because response was set above.
			// If it fails, this function gets "jqXHR", "status", "error"
			} ).always( callback && function( jqXHR, status ) {
				self.each( function() {
					callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
				} );
			} );
		}
	
		return this;
	};
	
	
	
	
	// Attach a bunch of functions for handling common AJAX events
	jQuery.each( [
		"ajaxStart",
		"ajaxStop",
		"ajaxComplete",
		"ajaxError",
		"ajaxSuccess",
		"ajaxSend"
	], function( i, type ) {
		jQuery.fn[ type ] = function( fn ) {
			return this.on( type, fn );
		};
	} );
	
	
	
	
	jQuery.expr.pseudos.animated = function( elem ) {
		return jQuery.grep( jQuery.timers, function( fn ) {
			return elem === fn.elem;
		} ).length;
	};
	
	
	
	
	/**
	 * Gets a window from an element
	 */
	function getWindow( elem ) {
		return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
	}
	
	jQuery.offset = {
		setOffset: function( elem, options, i ) {
			var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
				position = jQuery.css( elem, "position" ),
				curElem = jQuery( elem ),
				props = {};
	
			// Set position first, in-case top/left are set even on static elem
			if ( position === "static" ) {
				elem.style.position = "relative";
			}
	
			curOffset = curElem.offset();
			curCSSTop = jQuery.css( elem, "top" );
			curCSSLeft = jQuery.css( elem, "left" );
			calculatePosition = ( position === "absolute" || position === "fixed" ) &&
				( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;
	
			// Need to be able to calculate position if either
			// top or left is auto and position is either absolute or fixed
			if ( calculatePosition ) {
				curPosition = curElem.position();
				curTop = curPosition.top;
				curLeft = curPosition.left;
	
			} else {
				curTop = parseFloat( curCSSTop ) || 0;
				curLeft = parseFloat( curCSSLeft ) || 0;
			}
	
			if ( jQuery.isFunction( options ) ) {
	
				// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
				options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
			}
	
			if ( options.top != null ) {
				props.top = ( options.top - curOffset.top ) + curTop;
			}
			if ( options.left != null ) {
				props.left = ( options.left - curOffset.left ) + curLeft;
			}
	
			if ( "using" in options ) {
				options.using.call( elem, props );
	
			} else {
				curElem.css( props );
			}
		}
	};
	
	jQuery.fn.extend( {
		offset: function( options ) {
	
			// Preserve chaining for setter
			if ( arguments.length ) {
				return options === undefined ?
					this :
					this.each( function( i ) {
						jQuery.offset.setOffset( this, options, i );
					} );
			}
	
			var docElem, win, rect, doc,
				elem = this[ 0 ];
	
			if ( !elem ) {
				return;
			}
	
			// Support: IE <=11 only
			// Running getBoundingClientRect on a
			// disconnected node in IE throws an error
			if ( !elem.getClientRects().length ) {
				return { top: 0, left: 0 };
			}
	
			rect = elem.getBoundingClientRect();
	
			// Make sure element is not hidden (display: none)
			if ( rect.width || rect.height ) {
				doc = elem.ownerDocument;
				win = getWindow( doc );
				docElem = doc.documentElement;
	
				return {
					top: rect.top + win.pageYOffset - docElem.clientTop,
					left: rect.left + win.pageXOffset - docElem.clientLeft
				};
			}
	
			// Return zeros for disconnected and hidden elements (gh-2310)
			return rect;
		},
	
		position: function() {
			if ( !this[ 0 ] ) {
				return;
			}
	
			var offsetParent, offset,
				elem = this[ 0 ],
				parentOffset = { top: 0, left: 0 };
	
			// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
			// because it is its only offset parent
			if ( jQuery.css( elem, "position" ) === "fixed" ) {
	
				// Assume getBoundingClientRect is there when computed position is fixed
				offset = elem.getBoundingClientRect();
	
			} else {
	
				// Get *real* offsetParent
				offsetParent = this.offsetParent();
	
				// Get correct offsets
				offset = this.offset();
				if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
					parentOffset = offsetParent.offset();
				}
	
				// Add offsetParent borders
				parentOffset = {
					top: parentOffset.top + jQuery.css( offsetParent[ 0 ], "borderTopWidth", true ),
					left: parentOffset.left + jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true )
				};
			}
	
			// Subtract parent offsets and element margins
			return {
				top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
				left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
			};
		},
	
		// This method will return documentElement in the following cases:
		// 1) For the element inside the iframe without offsetParent, this method will return
		//    documentElement of the parent window
		// 2) For the hidden or detached element
		// 3) For body or html element, i.e. in case of the html node - it will return itself
		//
		// but those exceptions were never presented as a real life use-cases
		// and might be considered as more preferable results.
		//
		// This logic, however, is not guaranteed and can change at any point in the future
		offsetParent: function() {
			return this.map( function() {
				var offsetParent = this.offsetParent;
	
				while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
					offsetParent = offsetParent.offsetParent;
				}
	
				return offsetParent || documentElement;
			} );
		}
	} );
	
	// Create scrollLeft and scrollTop methods
	jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
		var top = "pageYOffset" === prop;
	
		jQuery.fn[ method ] = function( val ) {
			return access( this, function( elem, method, val ) {
				var win = getWindow( elem );
	
				if ( val === undefined ) {
					return win ? win[ prop ] : elem[ method ];
				}
	
				if ( win ) {
					win.scrollTo(
						!top ? val : win.pageXOffset,
						top ? val : win.pageYOffset
					);
	
				} else {
					elem[ method ] = val;
				}
			}, method, val, arguments.length );
		};
	} );
	
	// Support: Safari <=7 - 9.1, Chrome <=37 - 49
	// Add the top/left cssHooks using jQuery.fn.position
	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
	// getComputedStyle returns percent when specified for top/left/bottom/right;
	// rather than make the css module depend on the offset module, just check for it here
	jQuery.each( [ "top", "left" ], function( i, prop ) {
		jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
			function( elem, computed ) {
				if ( computed ) {
					computed = curCSS( elem, prop );
	
					// If curCSS returns percentage, fallback to offset
					return rnumnonpx.test( computed ) ?
						jQuery( elem ).position()[ prop ] + "px" :
						computed;
				}
			}
		);
	} );
	
	
	// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
	jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
		jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
			function( defaultExtra, funcName ) {
	
			// Margin is only for outerHeight, outerWidth
			jQuery.fn[ funcName ] = function( margin, value ) {
				var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
					extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );
	
				return access( this, function( elem, type, value ) {
					var doc;
	
					if ( jQuery.isWindow( elem ) ) {
	
						// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
						return funcName.indexOf( "outer" ) === 0 ?
							elem[ "inner" + name ] :
							elem.document.documentElement[ "client" + name ];
					}
	
					// Get document width or height
					if ( elem.nodeType === 9 ) {
						doc = elem.documentElement;
	
						// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
						// whichever is greatest
						return Math.max(
							elem.body[ "scroll" + name ], doc[ "scroll" + name ],
							elem.body[ "offset" + name ], doc[ "offset" + name ],
							doc[ "client" + name ]
						);
					}
	
					return value === undefined ?
	
						// Get width or height on the element, requesting but not forcing parseFloat
						jQuery.css( elem, type, extra ) :
	
						// Set width or height on the element
						jQuery.style( elem, type, value, extra );
				}, type, chainable ? margin : undefined, chainable );
			};
		} );
	} );
	
	
	jQuery.fn.extend( {
	
		bind: function( types, data, fn ) {
			return this.on( types, null, data, fn );
		},
		unbind: function( types, fn ) {
			return this.off( types, null, fn );
		},
	
		delegate: function( selector, types, data, fn ) {
			return this.on( types, selector, data, fn );
		},
		undelegate: function( selector, types, fn ) {
	
			// ( namespace ) or ( selector, types [, fn] )
			return arguments.length === 1 ?
				this.off( selector, "**" ) :
				this.off( types, selector || "**", fn );
		}
	} );
	
	jQuery.parseJSON = JSON.parse;
	
	
	
	
	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	
	// Note that for maximum portability, libraries that are not jQuery should
	// declare themselves as anonymous modules, and avoid setting a global if an
	// AMD loader is present. jQuery is a special case. For more information, see
	// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon
	
	if ( true ) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return jQuery;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}
	
	
	
	
	var
	
		// Map over jQuery in case of overwrite
		_jQuery = window.jQuery,
	
		// Map over the $ in case of overwrite
		_$ = window.$;
	
	jQuery.noConflict = function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}
	
		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}
	
		return jQuery;
	};
	
	// Expose jQuery and $ identifiers, even in AMD
	// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
	// and CommonJS for browser emulators (#13566)
	if ( !noGlobal ) {
		window.jQuery = window.$ = jQuery;
	}
	
	
	
	
	
	return jQuery;
	} );


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(4);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(9)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js!!./main.scss", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js!!./main.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports
	
	
	// module
	exports.push([module.id, "html, body {\n  margin: 0;\n  padding: 0;\n  background-color: #e0e0e0; }\n\n.layer {\n  font-family: 'Bungee Shade', cursive;\n  color: #585858; }\n\n.scene {\n  display: inline-block !important; }\n\n.wrapper {\n  display: inline-block;\n  position: relative;\n  top: -500px;\n  transition: top 2s ease; }\n\n.wrapper.loaded {\n  top: 0px; }\n\n.eye-wrapper {\n  vertical-align: top;\n  padding-top: 72px;\n  /* width: 200px; */\n  max-height: 200px;\n  display: inline-block; }\n\n.eye {\n  width: 100px;\n  height: 120px;\n  border: 5px solid #585858;\n  display: inline-block;\n  border-radius: 71px / 77px;\n  margin: 0px -4px;\n  position: relative;\n  background-color: white; }\n\n.highlight {\n  height: 5px;\n  width: 5px;\n  background-color: white;\n  border: 2px solid white;\n  border-radius: 10px;\n  left: 40% !important;\n  top: 40% !important; }\n\n.pupil {\n  height: 35px;\n  width: 31px;\n  top: 35% !important;\n  left: 35% !important;\n  position: absolute;\n  border: 3px solid #585858;\n  border-radius: 24px / 24px;\n  background-color: #585858; }\n\n.smile {\n  background-image: './smile.png';\n  height: 140px;\n  width: 196px;\n  background-size: contain; }\n\n.text {\n  font-size: 155px;\n  display: inline-block;\n  width: 55%;\n  min-width: 700px;\n  padding: 100px 30px;\n  box-sizing: border-box; }\n\n.side-panel {\n  border-top-left-radius: 100px;\n  border-bottom-left-radius: 100px;\n  display: inline-block;\n  width: 0%;\n  float: right;\n  height: 100vh;\n  vertical-align: top;\n  background-color: #585858;\n  box-sizing: border-box;\n  transition: width 1.7s ease;\n  padding: 50px;\n  box-sizing: border-box;\n  box-shadow: 2px 2px 19px 2px black; }\n\n.side-panel.loaded {\n  width: 45%; }\n\n.logo-wrapper {\n  height: 125px;\n  position: relative;\n  top: 1000px;\n  transition: top 2s ease; }\n  .logo-wrapper .github {\n    height: 90px;\n    width: 270px;\n    background-size: contain;\n    background-image: url(" + __webpack_require__(6) + ");\n    position: relative; }\n  .logo-wrapper .github.loaded {\n    top: 0px; }\n  .logo-wrapper .twitter {\n    height: 90px;\n    width: 90px;\n    background-size: contain;\n    background-image: url(" + __webpack_require__(7) + ");\n    position: relative; }\n  .logo-wrapper .twitter.loaded {\n    top: 0px; }\n  .logo-wrapper .linkedin {\n    height: 76px;\n    width: 280px;\n    background-size: contain;\n    background-image: url(" + __webpack_require__(8) + ");\n    position: relative; }\n  .logo-wrapper .linkedin.loaded {\n    top: 0px; }\n\n.logo-text {\n  display: inline-block;\n  font-family: 'Bungee Shade', cursive;\n  transition: font-size 0.5s ease; }\n\n.logo-wrapper.loaded {\n  top: 0px; }\n\n.logo-wrapper:hover {\n  color: white;\n  font-size: 20px;\n  cursor: pointer; }\n  .logo-wrapper:hover .logo {\n    transition: opacity 1s ease;\n    opacity: 1; }\n\n.logo {\n  opacity: 0; }\n", ""]);
	
	// exports


/***/ },
/* 5 */
/***/ function(module, exports) {

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


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAB9AAAAKZCAMAAADXiUBIAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjY4OEVFRjI2Q0QxMTFFNDhDODNBNTdFQkFDQzQ5NTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjY4OEVFRjM2Q0QxMTFFNDhDODNBNTdFQkFDQzQ5NTYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCNjg4RUVGMDZDRDExMUU0OEM4M0E1N0VCQUNDNDk1NiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCNjg4RUVGMTZDRDExMUU0OEM4M0E1N0VCQUNDNDk1NiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PinFKSAAAAMAUExURQ4MDZza8Do5OoyMjOvY1cPCwlNsd6bd8axcUZybmxoZGSwrK6SkpH2ru7hxZsuijPj4+LKyso93aeS7pPX19Xx7e7mWg5HM6NLR0Ye6zWeJlmpZUYPA6I/G2mNiYmxra+Hg4Onp6XOr0pPR7U1MTaWJeebm5iMiIuvBqTlGTLJmXMOEeFJRUe3t7fDw8NXV1fv18qqpqsfHx8emkkRDQ1d1hbm5uVxbW9zy+vP7/dTv+Hd2dtuynJWUleC1npjV7brl9diyrVdKRIzJ6/vs44aFhsrKyuL0+tOqlB0cHNra2t3d3fv7+7a1tc3NzaGhocTp9vz8/IGBgTQyM4jF6vvy7HRiWJGQkfni1MGfjPbRvL29vbPj89u4tOTKxq2srNSrpmmZvMrr9/DGrYGyw2WTtfXNtvrl2dSZhklfaZuBcu34/MyblIC+58SKgvbVwfj8/vjczPLy8v349nFxcazg8vLl422ToS0yNURWXUQ8NwAAADg1NPro3prY7vz+/3Wfrvbs636857/l9bTb8k1CPaPT7v79/J/b8JbQ5i8tLScqK+j2/PTLskZFRujRzvfayfLJsPTKsffYxdCjncWch7ORfjE6PdigjL2bh9Gumf77+SYlJWyfxF2Go5rY8NiumF+AjcmUjcrl9uGsl717cV9RSTU/RDYwLsaPiN6+uiouMeDDv8eeic6ljwkJCXy65tymkvXPuPPo5ldVVni03s7s965gVfjf0P///4BrYCsoJ2KOrRAODz5NVcSbhi42OSQmJ2hnZxMREnRzc3275v/+/p6enllYWP7//7Cvr2BfX9DP0EA/P8C/v6urq//9/Lu6urOzs6emp9TU1KioqIiIiCAfHzk3OElISG9ubykoKOPj45OTk39+fjEwMLy7u2loaXl4eMTDw4OCg/zv6P///pmYmI+Pj4WEhNjX15aWlu7e3Hu55AwMDPTMs/7+/vDh33y55ayNfH675gUFBXu34s2OfRgiJoidpe/5/aK5wYbC6IvF4LKVhP///6HS3q8AAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAABtaklEQVR42uy9C1Rd1b3ovQET5VElycZGc+VxDrJjBJJQBCsmWmtQwkvgmFixjcd4tMaeqjHWF0ZbRwZKm9ikjVbl3KMd1dra2BdHmzgwFjgBeaUhCZtXwAQVQjypvY5ze79+9+v6eD82+7Eec732/v3a0Qpu9pprrjXXb805//M/HRIAAADYHgdVAAAAgNABAAAAoQMAAABCBwAAAIQOAACA0AEAAAChAwAAAEIHAAAAhA4AAIDQAQAAAKEDAAAAQgcAAIDgFvrW43HZmWUut9tdPdCWHN8/1NHq5BJrw9nafCYuPjl8oHq0Wl0DmU1xx7dSKwAACF1XTrjn03byxIdJXGc1JBVG1LV5qdITVA0AAELXFW/2GSd82/FErrUSEmMSunzVZhvVAwCA0PUk1+2P8Jwsxt9lkV6Y0+W3KjOoIwAAhK4jDe4AuLIbGX0PQEpjkytQPW6jmgAAELp+OHvdMkiNTOGq+7T5ULKcOuxlqAMAAKHrxyK3TGpi0rnw80krTpVbg83UFgAAQteNeLdsqhPaK7n2sykoP1ktv/5aqDAAAISuF+kutxK6Ihh6n6YvokJR5bkY4gAAQOh6cdStEFf8Arrpo1R+2KK06tzHqTYAAISuE9lu5bQ1hnx419bGNhUVl03LAQBA6DqJyeVWQ/TpvlC+/H390aqqjTF3AACErhPNbpW4ElaG6sVfmuBSW2ubaDoAAAhdF0661dOSG4qXfjBbQ5WdpOkAACB0PSiIdmshtT3ULnx7qqYKiy6g7QAAIHQ9uptujYSW0rOStdbXAtoOAABC14HTbjdKl907T9ZeWx/RdgAAELoO7HILoCYk5tIzUkXU1S7aDgAAQhdPilsM8UEf8b40W1BVkWgPAAChi6fZLYqeoF6X3tcjrKIO03gAABC6cHKEecpdvS5ok6akfeQSV08NNB4AAIQunHC3QAYag3JNVkFktMhaCqfxAAAgdNGkuMXS9mHwXekjbYIrqY/WAwCA0AWzyC2a7Pzg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"

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

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
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(true) {
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


/***/ }
/******/ ]);