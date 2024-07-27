/******/ var __webpack_modules__ = ({

/***/ "../src/index.ts":
/*!***********************!*\
  !*** ../src/index.ts ***!
  \***********************/
/***/ (() => {

const main = document.querySelector("main");
// fit page height
function updateRatio() {
    const vh = document.documentElement.clientHeight; // without scrollbar
    const mh = main.clientHeight; // height: 148mm
    main.style.setProperty("--scale", `${vh / mh}`);
}
window.addEventListener('resize', updateRatio);
updateRatio();
// change slide
let sections = [
    ...document.querySelectorAll('section')
];
let current = 0;
document.addEventListener("keyup", (ev)=>{
    if (ev.code === "ArrowLeft" && current !== 0) --current;
    if (ev.code === "ArrowRight" && current !== sections.length - 1) ++current;
    main.scrollTo({
        top: sections[current].offsetTop,
        behavior: "instant"
    });
});


/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/compat get default export */
/******/ (() => {
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = (module) => {
/******/ 		var getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/publicPath */
/******/ (() => {
/******/ 	__webpack_require__.p = "";
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _libs_WebSlides_src_index_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../libs/WebSlides/src/index.ts */ "../src/index.ts");
/* harmony import */ var _libs_WebSlides_src_index_ts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_libs_WebSlides_src_index_ts__WEBPACK_IMPORTED_MODULE_0__);


})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
var __webpack_exports__ = {};
/*!***********************!*\
  !*** ./src/index.css ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**********************!*\
  !*** ./src/index.md ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "index.html");
})();

var __webpack_exports__default = __webpack_exports__["default"];
export { __webpack_exports__default as default };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxNQUFNQSxPQUFPQyxTQUFTQyxhQUFhLENBQUM7QUFFcEMsa0JBQWtCO0FBQ2xCLFNBQVNDO0lBQ0wsTUFBTUMsS0FBS0gsU0FBU0ksZUFBZSxDQUFDQyxZQUFZLEVBQUUsb0JBQW9CO0lBQ3RFLE1BQU1DLEtBQUtQLEtBQUtNLFlBQVksRUFBRSxnQkFBZ0I7SUFDOUNOLEtBQUtRLEtBQUssQ0FBQ0MsV0FBVyxDQUFDLFdBQVcsQ0FBQyxFQUFFTCxLQUFHRyxHQUFHLENBQUM7QUFDaEQ7QUFFQUcsT0FBT0MsZ0JBQWdCLENBQUMsVUFBVVI7QUFDbENBO0FBRUEsZUFBZTtBQUNmLElBQUlTLFdBQVc7T0FBSVgsU0FBU1ksZ0JBQWdCLENBQUM7Q0FBVztBQUN4RCxJQUFJQyxVQUFVO0FBQ2RiLFNBQVNVLGdCQUFnQixDQUFDLFNBQVMsQ0FBQ0k7SUFFaEMsSUFBSUEsR0FBR0MsSUFBSSxLQUFJLGVBQWdCRixZQUFZLEdBQ3ZDLEVBQUVBO0lBQ04sSUFBSUMsR0FBR0MsSUFBSSxLQUFJLGdCQUFnQkYsWUFBWUYsU0FBU0ssTUFBTSxHQUFHLEdBQ3pELEVBQUVIO0lBRU5kLEtBQUtrQixRQUFRLENBQUM7UUFDVkMsS0FBS1AsUUFBUSxDQUFDRSxRQUFRLENBQUNNLFNBQVM7UUFDaENDLFVBQVU7SUFDZDtBQUNKOzs7Ozs7O1NDMUJBO1NBQ0E7O1NBRUE7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7U0FDQTtTQUNBO1NBQ0E7O1NBRUE7U0FDQTs7U0FFQTtTQUNBO1NBQ0E7Ozs7O1VDdEJBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQSxpQ0FBaUMsV0FBVztVQUM1QztVQUNBOzs7OztVQ1BBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EseUNBQXlDLHdDQUF3QztVQUNqRjtVQUNBO1VBQ0E7Ozs7O1VDUEE7Ozs7O1VDQUE7VUFDQTtVQUNBO1VBQ0EsdURBQXVELGlCQUFpQjtVQUN4RTtVQUNBLGdEQUFnRCxhQUFhO1VBQzdEOzs7OztVQ05BOzs7Ozs7Ozs7Ozs7OztBQ0F3Qzs7Ozs7Ozs7Ozs7QUNBeEM7Ozs7Ozs7Ozs7Ozs7QUNBQSxpRUFBZSxxQkFBdUIsZUFBZSxFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vW1BST0pFQ1RfTkFNRV0vLi4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL1tQUk9KRUNUX05BTUVdL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1tQUk9KRUNUX05BTUVdL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL1tQUk9KRUNUX05BTUVdL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9bUFJPSkVDVF9OQU1FXS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL1tQUk9KRUNUX05BTUVdL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vW1BST0pFQ1RfTkFNRV0vd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vW1BST0pFQ1RfTkFNRV0vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vW1BST0pFQ1RfTkFNRV0vLi9zcmMvaW5kZXguY3NzIiwid2VicGFjazovL1tQUk9KRUNUX05BTUVdLy4vc3JjL2luZGV4Lm1kIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IG1haW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibWFpblwiKSE7XG5cbi8vIGZpdCBwYWdlIGhlaWdodFxuZnVuY3Rpb24gdXBkYXRlUmF0aW8oKSB7XG4gICAgY29uc3QgdmggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0OyAvLyB3aXRob3V0IHNjcm9sbGJhclxuICAgIGNvbnN0IG1oID0gbWFpbi5jbGllbnRIZWlnaHQ7IC8vIGhlaWdodDogMTQ4bW1cbiAgICBtYWluLnN0eWxlLnNldFByb3BlcnR5KFwiLS1zY2FsZVwiLCBgJHt2aC9taH1gKTtcbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHVwZGF0ZVJhdGlvKTtcbnVwZGF0ZVJhdGlvKCk7XG5cbi8vIGNoYW5nZSBzbGlkZVxubGV0IHNlY3Rpb25zID0gWy4uLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3NlY3Rpb24nKV07XG5sZXQgY3VycmVudCA9IDA7XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgKGV2KSA9PiB7XG5cbiAgICBpZiggZXYuY29kZT09PSBcIkFycm93TGVmdFwiICAmJiBjdXJyZW50ICE9PSAwKVxuICAgICAgICAtLWN1cnJlbnQ7XG4gICAgaWYoIGV2LmNvZGU9PT0gXCJBcnJvd1JpZ2h0XCIgJiYgY3VycmVudCAhPT0gc2VjdGlvbnMubGVuZ3RoIC0gMSApXG4gICAgICAgICsrY3VycmVudDtcblxuICAgIG1haW4uc2Nyb2xsVG8oe1xuICAgICAgICB0b3A6IHNlY3Rpb25zW2N1cnJlbnRdLm9mZnNldFRvcCxcbiAgICAgICAgYmVoYXZpb3I6IFwiaW5zdGFudFwiLFxuICAgIH0pO1xufSk7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7IiwiaW1wb3J0IFwiLi4vbGlicy9XZWJTbGlkZXMvc3JjL2luZGV4LnRzXCI7IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiZXhwb3J0IGRlZmF1bHQgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcImluZGV4Lmh0bWxcIjsiXSwibmFtZXMiOlsibWFpbiIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsInVwZGF0ZVJhdGlvIiwidmgiLCJkb2N1bWVudEVsZW1lbnQiLCJjbGllbnRIZWlnaHQiLCJtaCIsInN0eWxlIiwic2V0UHJvcGVydHkiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwic2VjdGlvbnMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiY3VycmVudCIsImV2IiwiY29kZSIsImxlbmd0aCIsInNjcm9sbFRvIiwidG9wIiwib2Zmc2V0VG9wIiwiYmVoYXZpb3IiXSwic291cmNlUm9vdCI6IiJ9