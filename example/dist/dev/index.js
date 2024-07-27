/******/ // The require scope
/******/ var __webpack_require__ = {};
/******/ 
/************************************************************************/
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
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJtYXBwaW5ncyI6IlNBQUE7U0FDQTs7Ozs7VUNEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBLHlDQUF5Qyx3Q0FBd0M7VUFDakY7VUFDQTtVQUNBOzs7OztVQ1BBOzs7OztVQ0FBO1VBQ0E7VUFDQTtVQUNBLHVEQUF1RCxpQkFBaUI7VUFDeEU7VUFDQSxnREFBZ0QsYUFBYTtVQUM3RDs7Ozs7VUNOQTs7Ozs7Ozs7OztBQ0FBLE1BQU1BLE9BQU9DLFNBQVNDLGFBQWEsQ0FBQztBQUVwQyxrQkFBa0I7QUFDbEIsU0FBU0M7SUFDTCxNQUFNQyxLQUFLSCxTQUFTSSxlQUFlLENBQUNDLFlBQVksRUFBRSxvQkFBb0I7SUFDdEUsTUFBTUMsS0FBS1AsS0FBS00sWUFBWSxFQUFFLGdCQUFnQjtJQUM5Q04sS0FBS1EsS0FBSyxDQUFDQyxXQUFXLENBQUMsV0FBVyxDQUFDLEVBQUVMLEtBQUdHLEdBQUcsQ0FBQztBQUNoRDtBQUVBRyxPQUFPQyxnQkFBZ0IsQ0FBQyxVQUFVUjtBQUNsQ0E7QUFFQSxlQUFlO0FBQ2YsSUFBSVMsV0FBVztPQUFJWCxTQUFTWSxnQkFBZ0IsQ0FBQztDQUFXO0FBQ3hELElBQUlDLFVBQVU7QUFDZGIsU0FBU1UsZ0JBQWdCLENBQUMsU0FBUyxDQUFDSTtJQUVoQyxJQUFJQSxHQUFHQyxJQUFJLEtBQUksZUFBZ0JGLFlBQVksR0FDdkMsRUFBRUE7SUFDTixJQUFJQyxHQUFHQyxJQUFJLEtBQUksZ0JBQWdCRixZQUFZRixTQUFTSyxNQUFNLEdBQUcsR0FDekQsRUFBRUg7SUFFTmQsS0FBS2tCLFFBQVEsQ0FBQztRQUNWQyxLQUFLUCxRQUFRLENBQUNFLFFBQVEsQ0FBQ00sU0FBUztRQUNoQ0MsVUFBVTtJQUNkO0FBQ0o7Ozs7Ozs7Ozs7O0FDMUJBOzs7Ozs7Ozs7Ozs7O0FDQUEsaUVBQWUscUJBQXVCLGVBQWUsRSIsInNvdXJjZXMiOlsid2VicGFjazovL1tQUk9KRUNUX05BTUVdL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1tQUk9KRUNUX05BTUVdL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9bUFJPSkVDVF9OQU1FXS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL1tQUk9KRUNUX05BTUVdL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vW1BST0pFQ1RfTkFNRV0vd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vW1BST0pFQ1RfTkFNRV0vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vW1BST0pFQ1RfTkFNRV0vLi9zcmMvaW5kZXguY3NzP2M0MGQiLCJ3ZWJwYWNrOi8vW1BST0pFQ1RfTkFNRV0vLi9zcmMvaW5kZXgubWQiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhlIHJlcXVpcmUgc2NvcGVcbnZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiOyIsImNvbnN0IG1haW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibWFpblwiKSE7XG5cbi8vIGZpdCBwYWdlIGhlaWdodFxuZnVuY3Rpb24gdXBkYXRlUmF0aW8oKSB7XG4gICAgY29uc3QgdmggPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0OyAvLyB3aXRob3V0IHNjcm9sbGJhclxuICAgIGNvbnN0IG1oID0gbWFpbi5jbGllbnRIZWlnaHQ7IC8vIGhlaWdodDogMTQ4bW1cbiAgICBtYWluLnN0eWxlLnNldFByb3BlcnR5KFwiLS1zY2FsZVwiLCBgJHt2aC9taH1gKTtcbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHVwZGF0ZVJhdGlvKTtcbnVwZGF0ZVJhdGlvKCk7XG5cbi8vIGNoYW5nZSBzbGlkZVxubGV0IHNlY3Rpb25zID0gWy4uLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3NlY3Rpb24nKV07XG5sZXQgY3VycmVudCA9IDA7XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgKGV2KSA9PiB7XG5cbiAgICBpZiggZXYuY29kZT09PSBcIkFycm93TGVmdFwiICAmJiBjdXJyZW50ICE9PSAwKVxuICAgICAgICAtLWN1cnJlbnQ7XG4gICAgaWYoIGV2LmNvZGU9PT0gXCJBcnJvd1JpZ2h0XCIgJiYgY3VycmVudCAhPT0gc2VjdGlvbnMubGVuZ3RoIC0gMSApXG4gICAgICAgICsrY3VycmVudDtcblxuICAgIG1haW4uc2Nyb2xsVG8oe1xuICAgICAgICB0b3A6IHNlY3Rpb25zW2N1cnJlbnRdLm9mZnNldFRvcCxcbiAgICAgICAgYmVoYXZpb3I6IFwiaW5zdGFudFwiLFxuICAgIH0pO1xufSk7IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiZXhwb3J0IGRlZmF1bHQgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcImluZGV4Lmh0bWxcIjsiXSwibmFtZXMiOlsibWFpbiIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsInVwZGF0ZVJhdGlvIiwidmgiLCJkb2N1bWVudEVsZW1lbnQiLCJjbGllbnRIZWlnaHQiLCJtaCIsInN0eWxlIiwic2V0UHJvcGVydHkiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwic2VjdGlvbnMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiY3VycmVudCIsImV2IiwiY29kZSIsImxlbmd0aCIsInNjcm9sbFRvIiwidG9wIiwib2Zmc2V0VG9wIiwiYmVoYXZpb3IiXSwic291cmNlUm9vdCI6IiJ9