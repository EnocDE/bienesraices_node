/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapaInicio.js":
/*!******************************!*\
  !*** ./src/js/mapaInicio.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(async function () {\r\n  const lat = 18.8290\r\n  const lng = -98.9436\r\n  const mapa = L.map(\"mapa-inicio\").setView([lat, lng], 13)\r\n\r\n  const categorias = document.querySelector(\"#categoria\")\r\n  const precios = document.querySelector(\"#precio\")\r\n\r\n  let markers = L.featureGroup().addTo(mapa)\r\n\r\n  let propiedades = []\r\n\r\n  const filtros = {\r\n    categoria: '',\r\n    precio: ''\r\n  }\r\n\r\n  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n    maxZoom: 17\r\n  }).addTo(mapa);\r\n\r\n  categorias.addEventListener(\"change\", (e) => {\r\n    filtros.categoria = +e.currentTarget.value\r\n    filtrarPropiedades()\r\n  })\r\n\r\n  precios.addEventListener(\"change\", (e) => {\r\n    filtros.precio = +e.currentTarget.value\r\n    filtrarPropiedades()\r\n  })\r\n\r\n  const obtenerPropiedades = async () => {\r\n    try {\r\n      const url = \"/api/propiedades\"\r\n      const respuesta = await fetch(url)\r\n      if (!respuesta.ok) throw new Error(\"Error fetching data\")\r\n      propiedades = await respuesta.json()\r\n      mostrarPropiedades(propiedades)\r\n    } catch (error) {\r\n      return console.error(error);\r\n    }\r\n  }\r\n\r\n  const mostrarPropiedades = (propiedades) => {\r\n    propiedades.forEach(propiedad => {\r\n      const marker = new L.marker([propiedad?.lat, propiedad?.lng], {\r\n        autoPan: true\r\n      }).addTo(mapa).bindPopup(`\r\n          <h1 class=\"text-xl font-extrabold my-5\">${propiedad.title}</h1>\r\n          <div class=\"overflow-hidden\">\r\n            <img class=\"object-cover h-full w-full\" src='/uploads/${propiedad.image}' alt='${propiedad.title}'>\r\n          </div>\r\n          <div class=\"flex justify-between gap-5 items-center\">\r\n            <p class=\"text-indigo-500 font-bold text-xs\">${propiedad.categoria.name}</p>\r\n            <p class=\"font-bold text-xs\">${propiedad.precio.name}</p>\r\n          </div>\r\n          <a href=\"/propiedad/${propiedad.id}\" class=\"py-3 w-full block bg-blackligth font-bold text-center cursor-pointer\" style=\"color:#fff;\">Ver Propiedad</a>\r\n        `)\r\n      markers.addLayer(marker)\r\n    });\r\n  }\r\n\r\n  const filtrarPropiedades = () => {\r\n    const resultado = propiedades.filter(propiedad => filtros.categoria ? propiedad.categoria.id == filtros.categoria : propiedad).filter(propiedad => filtros.precio ? propiedad.precio.id == filtros.precio : propiedad)\r\n\r\n    markers.clearLayers()\r\n    markers = L.featureGroup().addTo(mapa)\r\n    \r\n    mostrarPropiedades(resultado)\r\n  }\r\n\r\n  await obtenerPropiedades()\r\n\r\n})()\n\n//# sourceURL=webpack://bienesraices-mvc/./src/js/mapaInicio.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapaInicio.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;