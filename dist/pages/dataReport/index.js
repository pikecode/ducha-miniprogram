"use strict";
(wx["webpackJsonp"] = wx["webpackJsonp"] || []).push([["pages/dataReport/index"],{

/***/ "./node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/dataReport/index!./src/pages/dataReport/index.tsx":
/*!**************************************************************************************************************************!*\
  !*** ./node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/dataReport/index!./src/pages/dataReport/index.tsx ***!
  \**************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ DataReport; }
/* harmony export */ });
/* harmony import */ var _Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass.js */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/callSuper.js */ "./node_modules/@babel/runtime/helpers/esm/callSuper.js");
/* harmony import */ var _Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/inherits.js */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/defineProperty.js */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _tarojs_components__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @tarojs/components */ "./node_modules/@tarojs/plugin-platform-weapp/dist/components-react.js");
/* harmony import */ var _tarojs_taro__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @tarojs/taro */ "./node_modules/@tarojs/taro/index.js");
/* harmony import */ var _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_tarojs_taro__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/auth */ "./src/utils/auth.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/cjs/react-jsx-runtime.production.min.js");











var DataReport = /*#__PURE__*/function (_Component) {
  function DataReport() {
    var _this;
    (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this, DataReport);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_5__["default"])(this, DataReport, [].concat(args));
    (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_6__["default"])(_this, "handleBack", function () {
      _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().navigateBack();
    });
    return _this;
  }
  (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_7__["default"])(DataReport, _Component);
  return (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_8__["default"])(DataReport, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // 检查登录状态
      if (!(0,_utils_auth__WEBPACK_IMPORTED_MODULE_2__.requireLogin)()) {
        return;
      }
      _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().setNavigationBarTitle({
        title: '数据上报'
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
        className: "data-report",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
          className: "header",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
            className: "title",
            children: "\u53E3\u8154\u79D1\u8D28\u63A7\u6570\u636E\u4E0A\u62A5"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
            className: "subtitle",
            children: "\u8BF7\u586B\u5199\u76F8\u5173\u6570\u636E\u4FE1\u606F"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
          className: "content",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
            className: "section",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
              className: "section-title",
              children: "\u57FA\u7840\u6570\u636E\u586B\u62A5"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
              className: "card-list",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
                className: "card",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                  className: "card-title",
                  children: "\u60A3\u8005\u4FE1\u606F\u7EDF\u8BA1"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                  className: "card-desc",
                  children: "\u95E8\u8BCA\u91CF\u3001\u4F4F\u9662\u91CF\u7B49\u57FA\u7840\u6570\u636E"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
                  className: "card-btn",
                  size: "mini",
                  children: "\u7ACB\u5373\u586B\u62A5"
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
                className: "card",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                  className: "card-title",
                  children: "\u533B\u7597\u8D28\u91CF\u6307\u6807"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                  className: "card-desc",
                  children: "\u6CBB\u7597\u6210\u529F\u7387\u3001\u5E76\u53D1\u75C7\u7387\u7B49"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
                  className: "card-btn",
                  size: "mini",
                  children: "\u7ACB\u5373\u586B\u62A5"
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
                className: "card",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                  className: "card-title",
                  children: "\u8BBE\u5907\u4F7F\u7528\u60C5\u51B5"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                  className: "card-desc",
                  children: "\u8BBE\u5907\u5229\u7528\u7387\u3001\u7EF4\u62A4\u8BB0\u5F55\u7B49"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
                  className: "card-btn",
                  size: "mini",
                  children: "\u7ACB\u5373\u586B\u62A5"
                })]
              })]
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
            className: "section",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
              className: "section-title",
              children: "\u6570\u636E\u5BA1\u6838\u5206\u6790"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
              className: "analysis-area",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
                className: "stat-item",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                  className: "stat-number",
                  children: "85%"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                  className: "stat-label",
                  children: "\u6570\u636E\u5B8C\u6574\u7387"
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
                className: "stat-item",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                  className: "stat-number",
                  children: "12"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                  className: "stat-label",
                  children: "\u5F85\u5BA1\u6838\u9879\u76EE"
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
                className: "stat-item",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                  className: "stat-number",
                  children: "3"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                  className: "stat-label",
                  children: "\u5F02\u5E38\u6570\u636E"
                })]
              })]
            })]
          })]
        })]
      });
    }
  }]);
}(react__WEBPACK_IMPORTED_MODULE_0__.Component);


/***/ }),

/***/ "./src/pages/dataReport/index.tsx":
/*!****************************************!*\
  !*** ./src/pages/dataReport/index.tsx ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/@tarojs/runtime/dist/dsl/common.js");
/* harmony import */ var _node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_dataReport_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !!../../../node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/dataReport/index!./index.tsx */ "./node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/dataReport/index!./src/pages/dataReport/index.tsx");


var config = {"navigationBarTitleText":"数据上报"};



var taroOption = (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_1__.createPageConfig)(_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_dataReport_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"], 'pages/dataReport/index', {root:{cn:[]}}, config || {})
if (_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_dataReport_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"] && _node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_dataReport_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"].behaviors) {
  taroOption.behaviors = (taroOption.behaviors || []).concat(_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_dataReport_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"].behaviors)
}
var inst = Page(taroOption)



/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_dataReport_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["taro","vendors","common"], function() { return __webpack_exec__("./src/pages/dataReport/index.tsx"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=index.js.map