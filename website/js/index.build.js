/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


window.addEventListener('load', function () {
    document.getElementsByTagName('body')[0].style.display = 'block';
    setClass('bgScene');
    setClass('bgMan', 500);
    setClass('bgShadow', 400);
    setClass('download', 800, 'button show');
    setClass('github', 700, 'button show');
    setClass('logo', 800);
    setClass('logoText', 1000);
    setClass('text0', 1100);
    setClass('textSymbol', 1300);
    setClass('text1', 1200);

    document.getElementById('download').addEventListener('click', function () {
        document.getElementById('downloads').className = 'show';
        document.getElementById('download').className = 'button hide';
    });
    document.getElementById('github').addEventListener('click', function () {
        window.open('https://github.com/HuQingyang/Luoo.qy', '_black');
    });
    var buttons = document.getElementById('downloads').children;

    var _loop = function _loop(i) {
        buttons[i].addEventListener('click', function () {
            window.open('http://l.page.\u4E2D\u56FD/download/' + i);
        });
    };

    for (var i = 0; i < buttons.length; i++) {
        _loop(i);
    }
});

function setClass(id) {
    var timeOut = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var className = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'show';

    setTimeout(function () {
        return document.getElementById(id).className = className;
    }, timeOut);
}

/***/ })
/******/ ]);