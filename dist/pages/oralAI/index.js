"use strict";
(wx["webpackJsonp"] = wx["webpackJsonp"] || []).push([["pages/oralAI/index"],{

/***/ "./node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/oralAI/index!./src/pages/oralAI/index.tsx":
/*!******************************************************************************************************************!*\
  !*** ./node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/oralAI/index!./src/pages/oralAI/index.tsx ***!
  \******************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ OralAI; }
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











var OralAI = /*#__PURE__*/function (_Component) {
  function OralAI() {
    var _this;
    (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this, OralAI);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_5__["default"])(this, OralAI, [].concat(args));
    (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_6__["default"])(_this, "handleDiagnosis", function () {
      _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().showToast({
        title: 'AI诊断功能开发中',
        icon: 'none'
      });
    });
    (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_6__["default"])(_this, "handleAnalysis", function () {
      _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().showToast({
        title: 'AI分析功能开发中',
        icon: 'none'
      });
    });
    (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_6__["default"])(_this, "handleReport", function () {
      _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().showToast({
        title: 'AI报告功能开发中',
        icon: 'none'
      });
    });
    return _this;
  }
  (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_7__["default"])(OralAI, _Component);
  return (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_8__["default"])(OralAI, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // 检查登录状态
      if (!(0,_utils_auth__WEBPACK_IMPORTED_MODULE_2__.requireLogin)()) {
        return;
      }
      _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().setNavigationBarTitle({
        title: '口腔AI'
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
        className: "oral-ai",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
          className: "header",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
            className: "ai-logo",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
              className: "ai-icon",
              children: "\uD83E\uDDE0"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
              className: "ai-title",
              children: "\u667A\u80FD\u53E3\u8154AI\u52A9\u624B"
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
            className: "ai-subtitle",
            children: "AI\u9A71\u52A8\u7684\u53E3\u8154\u5065\u5EB7\u8BCA\u65AD\u4E0E\u5206\u6790"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
          className: "content",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
            className: "section",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
              className: "section-title",
              children: "AI\u8BCA\u65AD\u5DE5\u5177"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
              className: "ai-tools",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
                className: "tool-card",
                onClick: this.handleDiagnosis,
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
                  className: "tool-icon diagnosis-icon",
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                    className: "icon-text",
                    children: "\uD83D\uDD0D"
                  })
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                  className: "tool-name",
                  children: "\u667A\u80FD\u8BCA\u65AD"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                  className: "tool-desc",
                  children: "\u57FA\u4E8E\u56FE\u50CF\u8BC6\u522B\u7684\u53E3\u8154\u75BE\u75C5\u667A\u80FD\u8BCA\u65AD"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
                  className: "tool-action",
                  size: "mini",
                  children: "\u5F00\u59CB\u8BCA\u65AD"
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
                className: "tool-card",
                onClick: this.handleAnalysis,
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
                  className: "tool-icon analysis-icon",
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                    className: "icon-text",
                    children: "\uD83D\uDCCA"
                  })
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                  className: "tool-name",
                  children: "\u6570\u636E\u5206\u6790"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                  className: "tool-desc",
                  children: "AI\u9A71\u52A8\u7684\u53E3\u8154\u5065\u5EB7\u6570\u636E\u6DF1\u5EA6\u5206\u6790"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
                  className: "tool-action",
                  size: "mini",
                  children: "\u67E5\u770B\u5206\u6790"
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
                className: "tool-card",
                onClick: this.handleReport,
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
                  className: "tool-icon report-icon",
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                    className: "icon-text",
                    children: "\uD83D\uDCCB"
                  })
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                  className: "tool-name",
                  children: "\u667A\u80FD\u62A5\u544A"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                  className: "tool-desc",
                  children: "\u81EA\u52A8\u751F\u6210\u4E13\u4E1A\u7684\u53E3\u8154\u5065\u5EB7\u62A5\u544A"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Button, {
                  className: "tool-action",
                  size: "mini",
                  children: "\u751F\u6210\u62A5\u544A"
                })]
              })]
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
            className: "section",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
              className: "section-title",
              children: "AI\u80FD\u529B\u5C55\u793A"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
              className: "capabilities",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
                className: "capability-item",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
                  className: "capability-number",
                  children: "95%"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                  className: "capability-label",
                  children: "\u8BCA\u65AD\u51C6\u786E\u7387"
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
                className: "capability-item",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
                  className: "capability-number",
                  children: "1000+"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                  className: "capability-label",
                  children: "\u75C5\u4F8B\u6570\u636E\u5E93"
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
                className: "capability-item",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
                  className: "capability-number",
                  children: "24/7"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                  className: "capability-label",
                  children: "\u5728\u7EBF\u670D\u52A1"
                })]
              })]
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
            className: "section",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
              className: "section-title",
              children: "\u6700\u65B0\u529F\u80FD"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
              className: "feature-list",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
                className: "feature-item",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
                  className: "feature-dot new"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                  className: "feature-text",
                  children: "\u589E\u5F3A\u578B\u56FE\u50CF\u8BC6\u522B\u7B97\u6CD5"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                  className: "feature-tag",
                  children: "NEW"
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
                className: "feature-item",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
                  className: "feature-dot updated"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                  className: "feature-text",
                  children: "\u591A\u6A21\u6001AI\u8BCA\u65AD\u7CFB\u7EDF"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                  className: "feature-tag",
                  children: "UPDATED"
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
                className: "feature-item",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
                  className: "feature-dot coming"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                  className: "feature-text",
                  children: "\u4E2A\u6027\u5316\u6CBB\u7597\u65B9\u6848\u63A8\u8350"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                  className: "feature-tag",
                  children: "COMING"
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

/***/ "./src/pages/oralAI/index.tsx":
/*!************************************!*\
  !*** ./src/pages/oralAI/index.tsx ***!
  \************************************/
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/@tarojs/runtime/dist/dsl/common.js");
/* harmony import */ var _node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_oralAI_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !!../../../node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/oralAI/index!./index.tsx */ "./node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/oralAI/index!./src/pages/oralAI/index.tsx");


var config = {"navigationBarTitleText":"口腔AI"};



var taroOption = (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_1__.createPageConfig)(_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_oralAI_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"], 'pages/oralAI/index', {root:{cn:[]}}, config || {})
if (_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_oralAI_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"] && _node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_oralAI_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"].behaviors) {
  taroOption.behaviors = (taroOption.behaviors || []).concat(_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_oralAI_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"].behaviors)
}
var inst = Page(taroOption)



/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_oralAI_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["taro","vendors","common"], function() { return __webpack_exec__("./src/pages/oralAI/index.tsx"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=index.js.map