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


var T = THREE;

window.addEventListener('load', init);

function init() {
    var stats = initStats();
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    var webGLRenderer = new THREE.WebGLRenderer();

    // webGLRenderer.setClearColor(new THREE.Color('black', 1.0));
    webGLRenderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.x = 20;
    camera.position.y = 0;
    camera.position.z = 150;
    document.getElementsByTagName("body")[0].appendChild(webGLRenderer.domElement);

    var controls = new function () {
        this.size = 8;
        this.transparent = true;
        this.opacity = 1;
        this.vertexColors = true;
        this.color = 0xffffff;
        this.sizeAttenuation = true;
        this.rotateSystem = true;

        this.redraw = function () {
            if (scene.getObjectByName("particles")) {
                scene.remove(scene.getObjectByName("particles"));
            }
            createParticles(controls.size, controls.transparent, controls.opacity, controls.vertexColors, controls.sizeAttenuation, controls.color);
        };
    }();

    var cloud = void 0;

    var gui = new dat.GUI();
    gui.add(controls, 'size', 0, 10).onChange(controls.redraw);
    gui.add(controls, 'transparent').onChange(controls.redraw);
    gui.add(controls, 'opacity', 0, 1).onChange(controls.redraw);
    gui.add(controls, 'vertexColors').onChange(controls.redraw);
    gui.addColor(controls, 'color').onChange(controls.redraw);
    gui.add(controls, 'sizeAttenuation').onChange(controls.redraw);
    gui.add(controls, 'rotateSystem');
    controls.redraw();

    render();

    function createParticles(size, transparent, opacity, vertexColors, sizeAttenuation, color) {
        var geom = new THREE.Geometry();
        var material = new THREE.PointsMaterial({
            size: size,
            transparent: transparent,
            opacity: opacity,
            vertexColors: vertexColors,
            sizeAttenuation: sizeAttenuation,
            color: color
        });

        var range = 500;
        for (var i = 0; i < 5000; i++) {
            var particle = new THREE.Vector3(Math.random() * range - range / 2, Math.random() * range - range / 2, Math.random() * range - range / 2);
            geom.vertices.push(particle);
            var _ref = [Math.ceil(Math.random() * 255), Math.ceil(Math.random() * 255), Math.ceil(Math.random() * 255)],
                r = _ref[0],
                g = _ref[1],
                b = _ref[2];

            var _color = new THREE.Color("rgb(" + r + ", " + g + ", " + b + ")");
            _color.setHSL(_color.getHSL().h, _color.getHSL().s, Math.random() * _color.getHSL().l);
            geom.colors.push(_color);
        }

        cloud = new THREE.Points(geom, material);
        cloud.name = "particles";
        scene.add(cloud);
    }

    var step = 0;
    function render() {
        stats.update();
        if (controls.rotateSystem) {
            step += 0.004;
            cloud.rotation.x = step;
            cloud.rotation.z = -step;
            cloud.position.x = step * 0.5;
            cloud.position.y = -step * 0.6;
        }
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);
    }

    function initStats() {
        var stats = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        document.getElementById("stats").appendChild(stats.domElement);
        return stats;
    }
}

function initStats() {
    var stats = new Stats();
    stats.setMode(0);
    document.getElementById('stats').appendChild(stats.domElement);
    return stats;
}

/***/ })
/******/ ]);