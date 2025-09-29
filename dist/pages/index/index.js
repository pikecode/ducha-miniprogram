"use strict";
(wx["webpackJsonp"] = wx["webpackJsonp"] || []).push([["pages/index/index"],{

/***/ "./node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/index/index!./src/pages/index/index.tsx":
/*!****************************************************************************************************************!*\
  !*** ./node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/index/index!./src/pages/index/index.tsx ***!
  \****************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Index; }
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











var Index = /*#__PURE__*/function (_Component) {
  function Index(props) {
    var _this;
    (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this, Index);
    _this = (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_5__["default"])(this, Index, [props]);
    // 加载用户信息
    (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_6__["default"])(_this, "loadUserInfo", function () {
      var userInfo = (0,_utils_auth__WEBPACK_IMPORTED_MODULE_2__.getUserInfo)();
      var phoneNumber = (0,_utils_auth__WEBPACK_IMPORTED_MODULE_2__.getPhoneNumber)();
      _this.setState({
        userInfo: userInfo,
        phoneNumber: phoneNumber
      });
    });
    (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_6__["default"])(_this, "handleDataReport", function () {
      _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().navigateTo({
        url: '/pages/dataReport/index'
      });
    });
    (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_6__["default"])(_this, "handleQualityControl", function () {
      _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().navigateTo({
        url: '/pages/qualityControl/index'
      });
    });
    // 退出登录
    (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_6__["default"])(_this, "handleLogout", function () {
      _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().showModal({
        title: '确认退出',
        content: '您确定要退出登录吗？',
        success: function success(res) {
          if (res.confirm) {
            (0,_utils_auth__WEBPACK_IMPORTED_MODULE_2__.clearLoginInfo)();
            _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().showToast({
              title: '已退出登录',
              icon: 'success'
            });
            setTimeout(function () {
              _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().reLaunch({
                url: '/pages/login/index'
              });
            }, 1500);
          }
        }
      });
    });
    _this.state = {
      userInfo: {},
      phoneNumber: ''
    };
    return _this;
  }
  (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_7__["default"])(Index, _Component);
  return (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_8__["default"])(Index, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // 检查登录状态
      if ((0,_utils_auth__WEBPACK_IMPORTED_MODULE_2__.requireLogin)()) {
        this.loadUserInfo();
      }
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
        className: "index",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
          className: "banner",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Image, {
            className: "banner-image",
            src: "https://via.placeholder.com/750x400/4a90e2/ffffff?text=\u7763\u67E5\u5C0F\u7A0B\u5E8F",
            mode: "aspectFill"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
            className: "user-overlay",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
              className: "user-info-header",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
                className: "user-avatar-section",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Image, {
                  className: "user-avatar",
                  src: this.state.userInfo.avatarUrl || 'https://via.placeholder.com/80x80/cccccc/ffffff?text=👤',
                  mode: "aspectFill"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
                  className: "user-details",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                    className: "user-name",
                    children: this.state.userInfo.nickName || '用户'
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                    className: "user-phone",
                    children: this.state.phoneNumber || ''
                  })]
                })]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
                className: "logout-btn",
                onClick: this.handleLogout,
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                  className: "logout-text",
                  children: "\u9000\u51FA"
                })
              })]
            })
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
          className: "function-area",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
            className: "function-item",
            onClick: this.handleDataReport,
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
              className: "function-icon",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
                className: "icon-chart"
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
              className: "function-content",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                className: "function-title",
                children: "\u6570\u636E\u4E0A\u62A5"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                className: "function-desc",
                children: "\u53E3\u8154\u79D1\u8D28\u63A7\u6570\u636E\u586B\u62A5\u3001\u5BA1\u6838\u5206\u6790"
              })]
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
            className: "function-item",
            onClick: this.handleQualityControl,
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
              className: "function-icon",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
                className: "icon-check"
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.View, {
              className: "function-content",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                className: "function-title",
                children: "\u8D28\u63A7\u7763\u67E5"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_9__.Text, {
                className: "function-desc",
                children: "\u8D28\u63A7\u4E13\u5BB6\u73B0\u573A\u7763\u67E5\u3001\u8BC4\u4F30\u5DE5\u5177"
              })]
            })]
          })]
        })]
      });
    }
  }]);
}(react__WEBPACK_IMPORTED_MODULE_0__.Component);


/***/ }),

/***/ "./src/pages/index/index.tsx":
/*!***********************************!*\
  !*** ./src/pages/index/index.tsx ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/@tarojs/runtime/dist/dsl/common.js");
/* harmony import */ var _node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_index_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !!../../../node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/index/index!./index.tsx */ "./node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/index/index!./src/pages/index/index.tsx");


var config = {"navigationBarTitleText":"督查首页"};



var taroOption = (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_1__.createPageConfig)(_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_index_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"], 'pages/index/index', {root:{cn:[]}}, config || {})
if (_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_index_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"] && _node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_index_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"].behaviors) {
  taroOption.behaviors = (taroOption.behaviors || []).concat(_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_index_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"].behaviors)
}
var inst = Page(taroOption)



/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_index_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["taro","vendors","common"], function() { return __webpack_exec__("./src/pages/index/index.tsx"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=index.js.map