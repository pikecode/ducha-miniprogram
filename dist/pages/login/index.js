"use strict";
(wx["webpackJsonp"] = wx["webpackJsonp"] || []).push([["pages/login/index"],{

/***/ "./node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/login/index!./src/pages/login/index.tsx":
/*!****************************************************************************************************************!*\
  !*** ./node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/login/index!./src/pages/login/index.tsx ***!
  \****************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Login; }
/* harmony export */ });
/* harmony import */ var _Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/regenerator.js */ "./node_modules/@babel/runtime/helpers/esm/regenerator.js");
/* harmony import */ var _Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/objectSpread2.js */ "./node_modules/@babel/runtime/helpers/esm/objectSpread2.js");
/* harmony import */ var _Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass.js */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/callSuper.js */ "./node_modules/@babel/runtime/helpers/esm/callSuper.js");
/* harmony import */ var _Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/inherits.js */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/defineProperty.js */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _tarojs_components__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @tarojs/components */ "./node_modules/@tarojs/plugin-platform-weapp/dist/components-react.js");
/* harmony import */ var _tarojs_taro__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @tarojs/taro */ "./node_modules/@tarojs/taro/index.js");
/* harmony import */ var _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_tarojs_taro__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/api */ "./src/utils/api.ts");
/* harmony import */ var _utils_config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/config */ "./src/utils/config.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "./node_modules/react/cjs/react-jsx-runtime.production.min.js");















var Login = /*#__PURE__*/function (_Component) {
  function Login(props) {
    var _this;
    (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_5__["default"])(this, Login);
    _this = (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_callSuper_js__WEBPACK_IMPORTED_MODULE_6__["default"])(this, Login, [props]);
    // 检查登录状态
    (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_7__["default"])(_this, "checkLoginStatus", function () {
      var userInfo = _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().getStorageSync('userInfo');
      var phoneNumber = _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().getStorageSync('phoneNumber');
      if (userInfo && phoneNumber) {
        // 已登录，直接跳转到首页
        _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().reLaunch({
          url: '/pages/index/index'
        });
      }
    });
    // 获取手机号
    (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_7__["default"])(_this, "getPhoneNumber", function (e) {
      console.log('获取手机号回调', e);
      if (e.detail.code) {
        // 保存手机号加密数据
        _this.setState({
          phoneEncryptedData: {
            code: e.detail.code,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
          }
        });
        _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().showToast({
          title: '手机号授权成功',
          icon: 'success'
        });

        // 开始登录流程
        _this.performLogin();
      } else {
        _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().showToast({
          title: '手机号授权失败',
          icon: 'none'
        });
      }
    });
    // 执行登录
    (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_7__["default"])(_this, "performLogin", /*#__PURE__*/(0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_8__["default"])(/*#__PURE__*/(0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_9__["default"])().m(function _callee() {
      var _this$state, wxLoginCode, phoneEncryptedData, userInfo, loginParams, response, _response$data, token, serverUserInfo, _t;
      return (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_9__["default"])().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            _this$state = _this.state, wxLoginCode = _this$state.wxLoginCode, phoneEncryptedData = _this$state.phoneEncryptedData, userInfo = _this$state.userInfo;
            if (!(!wxLoginCode || !phoneEncryptedData)) {
              _context.n = 1;
              break;
            }
            _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().showToast({
              title: '登录信息不完整',
              icon: 'none'
            });
            return _context.a(2);
          case 1:
            _this.setState({
              isLogging: true
            });
            _context.p = 2;
            _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().showLoading({
              title: '正在登录...'
            });

            // 调用登录接口
            loginParams = {
              username: _this.state.inputPhoneNumber,
              // 用户输入的手机号
              captcha: wxLoginCode,
              cryptoCode: JSON.stringify(phoneEncryptedData),
              channel: _utils_config__WEBPACK_IMPORTED_MODULE_3__.API_CONFIG.CHANNEL
            };
            console.log('登录参数:', loginParams);
            _context.n = 3;
            return _utils_api__WEBPACK_IMPORTED_MODULE_2__.apiClient.login(loginParams);
          case 3:
            response = _context.v;
            console.log('登录响应:', response);
            if (!response.success) {
              _context.n = 4;
              break;
            }
            // 登录成功
            _response$data = response.data, token = _response$data.token, serverUserInfo = _response$data.userInfo; // 保存登录信息
            _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().setStorageSync('token', token);
            _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().setStorageSync('userInfo', (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])((0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_10__["default"])({}, userInfo), serverUserInfo));
            _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().setStorageSync('phoneNumber', serverUserInfo.phone);

            // 设置API客户端token
            _utils_api__WEBPACK_IMPORTED_MODULE_2__.apiClient.setAuthToken(token);
            _this.setState({
              phoneNumber: serverUserInfo.phone,
              hasPhoneNumber: true,
              currentStep: 4
            });
            _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().hideLoading();
            _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().showToast({
              title: '登录成功',
              icon: 'success'
            });

            // 跳转到首页
            setTimeout(function () {
              _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().reLaunch({
                url: '/pages/index/index'
              });
            }, 1500);
            _context.n = 5;
            break;
          case 4:
            throw new Error(response.message || '登录失败');
          case 5:
            _context.n = 7;
            break;
          case 6:
            _context.p = 6;
            _t = _context.v;
            console.error('登录失败:', _t);
            _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().hideLoading();
            _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().showToast({
              title: _t.message || '登录失败',
              icon: 'none'
            });
          case 7:
            _context.p = 7;
            _this.setState({
              isLogging: false
            });
            return _context.f(7);
          case 8:
            return _context.a(2);
        }
      }, _callee, null, [[2, 6, 7, 8]]);
    })));
    // 手机号输入处理
    (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_7__["default"])(_this, "handlePhoneInput", function (e) {
      _this.setState({
        inputPhoneNumber: e.detail.value
      });
    });
    // 验证手机号格式
    (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_7__["default"])(_this, "validatePhoneNumber", function (phone) {
      var phoneRegex = /^1[3-9]\d{9}$/;
      return phoneRegex.test(phone);
    });
    // 确认手机号，进入下一步
    (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_7__["default"])(_this, "handlePhoneConfirm", function () {
      var inputPhoneNumber = _this.state.inputPhoneNumber;
      if (!inputPhoneNumber) {
        _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().showToast({
          title: '请输入手机号',
          icon: 'none'
        });
        return;
      }
      if (!_this.validatePhoneNumber(inputPhoneNumber)) {
        _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        });
        return;
      }

      // 进入手机号验证步骤
      _this.setState({
        currentStep: 3
      });
    });
    // 获取微信登录凭证
    (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_7__["default"])(_this, "handleWechatLogin", function () {
      _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().login({
        success: function success(loginRes) {
          console.log('微信登录成功', loginRes);
          if (loginRes.code) {
            // 保存微信登录code
            _this.setState({
              wxLoginCode: loginRes.code
            });
            console.log('获取到登录凭证：', loginRes.code);
            _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().showToast({
              title: '获取登录凭证成功',
              icon: 'success'
            });

            // 进入用户信息授权步骤
            _this.setState({
              currentStep: 1.5
            });
          }
        },
        fail: function fail(err) {
          console.log('微信登录失败', err);
          _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().showToast({
            title: '登录失败',
            icon: 'none'
          });
        }
      });
    });
    // 获取用户信息授权
    (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_7__["default"])(_this, "handleGetUserProfile", function () {
      if (_this.state.canIUseGetUserProfile) {
        _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().getUserProfile({
          desc: '用于完善会员资料',
          success: function success(profileRes) {
            console.log('获取用户信息成功', profileRes);
            _this.setState({
              userInfo: profileRes.userInfo,
              hasUserInfo: true
            });

            // 保存用户信息
            _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().setStorageSync('userInfo', profileRes.userInfo);
            _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().showToast({
              title: '授权成功',
              icon: 'success'
            });

            // 进入下一步：输入手机号
            _this.setState({
              currentStep: 2
            });
          },
          fail: function fail(profileErr) {
            console.log('获取用户信息失败', profileErr);
            _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().showToast({
              title: '授权失败',
              icon: 'none'
            });
          }
        });
      } else {
        // 兼容旧版本
        _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().getUserInfo({
          success: function success(profileRes) {
            console.log('获取用户信息成功', profileRes);
            _this.setState({
              userInfo: profileRes.userInfo,
              hasUserInfo: true,
              currentStep: 2
            });
            _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().setStorageSync('userInfo', profileRes.userInfo);
          }
        });
      }
    });
    _this.state = {
      userInfo: {},
      hasUserInfo: false,
      canIUseGetUserProfile: Boolean((_tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().getUserProfile)),
      phoneNumber: '',
      hasPhoneNumber: false,
      wxLoginCode: '',
      phoneEncryptedData: null,
      isLogging: false,
      inputPhoneNumber: '',
      currentStep: 1
    };
    return _this;
  }
  (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_inherits_js__WEBPACK_IMPORTED_MODULE_11__["default"])(Login, _Component);
  return (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_12__["default"])(Login, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      _tarojs_taro__WEBPACK_IMPORTED_MODULE_1___default().setNavigationBarTitle({
        title: '登录'
      });

      // 检查是否已登录
      this.checkLoginStatus();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state2 = this.state,
        userInfo = _this$state2.userInfo,
        currentStep = _this$state2.currentStep,
        inputPhoneNumber = _this$state2.inputPhoneNumber,
        isLogging = _this$state2.isLogging;
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.View, {
        className: "login",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.View, {
          className: "login-header",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.View, {
            className: "logo",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.Text, {
              className: "logo-icon",
              children: "\uD83E\uDDB7"
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.Text, {
            className: "app-name",
            children: "\u7763\u67E5\u5C0F\u7A0B\u5E8F"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.Text, {
            className: "app-desc",
            children: "\u53E3\u8154\u8D28\u63A7\u4E13\u4E1A\u5E73\u53F0"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.View, {
          className: "login-content",
          children: [currentStep === 1 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.View, {
            className: "auth-section",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.View, {
              className: "auth-info",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.Text, {
                className: "auth-title",
                children: "\u5FAE\u4FE1\u767B\u5F55"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.Text, {
                className: "auth-desc",
                children: "\u83B7\u53D6\u767B\u5F55\u51ED\u8BC1\uFF0C\u5F00\u59CB\u767B\u5F55\u6D41\u7A0B"
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
              className: "auth-btn wechat-btn",
              onClick: this.handleWechatLogin,
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.Text, {
                className: "btn-icon",
                children: "\uD83D\uDD11"
              }), "\u83B7\u53D6\u767B\u5F55\u51ED\u8BC1"]
            })]
          }), currentStep === 1.5 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.View, {
            className: "auth-section",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.View, {
              className: "auth-info",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.Text, {
                className: "auth-title",
                children: "\u6388\u6743\u7528\u6237\u4FE1\u606F"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.Text, {
                className: "auth-desc",
                children: "\u83B7\u53D6\u60A8\u7684\u5FAE\u4FE1\u5934\u50CF\u3001\u6635\u79F0\u7B49\u57FA\u672C\u4FE1\u606F\uFF0C\u7528\u4E8E\u4E2A\u6027\u5316\u670D\u52A1"
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
              className: "auth-btn wechat-btn",
              onClick: this.handleGetUserProfile,
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.Text, {
                className: "btn-icon",
                children: "\uD83D\uDC64"
              }), "\u6388\u6743\u7528\u6237\u4FE1\u606F"]
            })]
          }), currentStep === 2 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.View, {
            className: "auth-section",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.View, {
              className: "user-info",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.Image, {
                className: "avatar",
                src: userInfo.avatarUrl,
                mode: "aspectFill"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.Text, {
                className: "nickname",
                children: userInfo.nickName
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.View, {
              className: "auth-info",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.Text, {
                className: "auth-title",
                children: "\u8F93\u5165\u624B\u673A\u53F7"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.Text, {
                className: "auth-desc",
                children: "\u8BF7\u8F93\u5165\u60A8\u7684\u624B\u673A\u53F7\uFF0C\u7528\u4E8E\u8D26\u53F7\u9A8C\u8BC1\u548C\u5B89\u5168\u767B\u5F55"
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.View, {
              className: "phone-input-section",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.Input, {
                className: "phone-input",
                type: "number",
                placeholder: "\u8BF7\u8F93\u5165\u624B\u673A\u53F7",
                maxlength: 11,
                value: inputPhoneNumber,
                onInput: this.handlePhoneInput
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
                className: "auth-btn confirm-btn",
                onClick: this.handlePhoneConfirm,
                disabled: !inputPhoneNumber,
                children: "\u4E0B\u4E00\u6B65"
              })]
            })]
          }), currentStep === 3 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.View, {
            className: "auth-section",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.View, {
              className: "user-info",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.Image, {
                className: "avatar",
                src: userInfo.avatarUrl,
                mode: "aspectFill"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.Text, {
                className: "nickname",
                children: userInfo.nickName
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.Text, {
                className: "phone-display",
                children: ["\u624B\u673A\u53F7\uFF1A", inputPhoneNumber]
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.View, {
              className: "auth-info",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.Text, {
                className: "auth-title",
                children: "\u624B\u673A\u53F7\u9A8C\u8BC1"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.Text, {
                className: "auth-desc",
                children: "\u9700\u8981\u9A8C\u8BC1\u60A8\u7684\u624B\u673A\u53F7\u4EE5\u786E\u4FDD\u8D26\u53F7\u5B89\u5168"
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.Button, {
              className: "auth-btn phone-btn",
              openType: "getPhoneNumber",
              onGetPhoneNumber: this.getPhoneNumber,
              disabled: isLogging,
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.Text, {
                className: "btn-icon",
                children: "\uD83D\uDCF1"
              }), isLogging ? '正在登录...' : '验证手机号']
            })]
          }), currentStep === 4 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.View, {
            className: "success-section",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.View, {
              className: "user-info",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.Image, {
                className: "avatar",
                src: userInfo.avatarUrl,
                mode: "aspectFill"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.Text, {
                className: "nickname",
                children: userInfo.nickName
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.Text, {
                className: "phone-display",
                children: ["\u624B\u673A\u53F7\uFF1A", this.state.phoneNumber]
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.View, {
              className: "success-icon",
              children: "\u2705"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.Text, {
              className: "success-text",
              children: "\u767B\u5F55\u6210\u529F\uFF0C\u6B63\u5728\u8FDB\u5165\u5E94\u7528..."
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.View, {
          className: "login-footer",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_tarojs_components__WEBPACK_IMPORTED_MODULE_13__.Text, {
            className: "privacy-text",
            children: "\u767B\u5F55\u5373\u8868\u793A\u540C\u610F\u300A\u7528\u6237\u534F\u8BAE\u300B\u548C\u300A\u9690\u79C1\u653F\u7B56\u300B"
          })
        })]
      });
    }
  }]);
}(react__WEBPACK_IMPORTED_MODULE_0__.Component);


/***/ }),

/***/ "./src/pages/login/index.tsx":
/*!***********************************!*\
  !*** ./src/pages/login/index.tsx ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

/* harmony import */ var _tarojs_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @tarojs/runtime */ "./node_modules/@tarojs/runtime/dist/dsl/common.js");
/* harmony import */ var _node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_login_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !!../../../node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/login/index!./index.tsx */ "./node_modules/@tarojs/taro-loader/lib/entry-cache.js?name=pages/login/index!./src/pages/login/index.tsx");


var config = {"navigationBarTitleText":"登录"};



var taroOption = (0,_tarojs_runtime__WEBPACK_IMPORTED_MODULE_1__.createPageConfig)(_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_login_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"], 'pages/login/index', {root:{cn:[]}}, config || {})
if (_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_login_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"] && _node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_login_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"].behaviors) {
  taroOption.behaviors = (taroOption.behaviors || []).concat(_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_login_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"].behaviors)
}
var inst = Page(taroOption)



/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_tarojs_taro_loader_lib_entry_cache_js_name_pages_login_index_index_tsx__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ }),

/***/ "./src/utils/api.ts":
/*!**************************!*\
  !*** ./src/utils/api.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   apiClient: function() { return /* binding */ apiClient; }
/* harmony export */ });
/* harmony import */ var _Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/regenerator.js */ "./node_modules/@babel/runtime/helpers/esm/regenerator.js");
/* harmony import */ var _Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/objectSpread2.js */ "./node_modules/@babel/runtime/helpers/esm/objectSpread2.js");
/* harmony import */ var _Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/createClass.js */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/defineProperty.js */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _tarojs_taro__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tarojs/taro */ "./node_modules/@tarojs/taro/index.js");
/* harmony import */ var _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_tarojs_taro__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config */ "./src/utils/config.ts");









// 接口响应类型

// 登录请求参数

// 登录响应数据
// 封装请求方法
var ApiClient = /*#__PURE__*/function () {
  function ApiClient() {
    (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_classCallCheck_js__WEBPACK_IMPORTED_MODULE_2__["default"])(this, ApiClient);
    (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_3__["default"])(this, "baseURL", void 0);
    this.baseURL = _config__WEBPACK_IMPORTED_MODULE_1__.API_CONFIG.BASE_URL;
  }

  // 通用请求方法
  return (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_createClass_js__WEBPACK_IMPORTED_MODULE_4__["default"])(ApiClient, [{
    key: "request",
    value: function () {
      var _request = (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_5__["default"])(/*#__PURE__*/(0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_6__["default"])().m(function _callee(url) {
        var method,
          data,
          headers,
          fullUrl,
          response,
          result,
          _args = arguments,
          _t;
        return (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_6__["default"])().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              method = _args.length > 1 && _args[1] !== undefined ? _args[1] : 'GET';
              data = _args.length > 2 ? _args[2] : undefined;
              headers = _args.length > 3 ? _args[3] : undefined;
              fullUrl = "".concat(this.baseURL).concat(url);
              _context.p = 1;
              console.log('发起请求:', {
                url: fullUrl,
                method: method,
                data: data,
                headers: headers
              });
              _context.n = 2;
              return _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().request({
                url: fullUrl,
                method: method,
                data: data,
                header: (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_7__["default"])({
                  'Content-Type': 'application/json'
                }, headers),
                timeout: _config__WEBPACK_IMPORTED_MODULE_1__.REQUEST_TIMEOUT
              });
            case 2:
              response = _context.v;
              console.log('接口响应:', response);

              // 检查HTTP状态码
              if (!(response.statusCode !== 200)) {
                _context.n = 3;
                break;
              }
              throw new Error("HTTP\u9519\u8BEF: ".concat(response.statusCode));
            case 3:
              result = response.data; // 检查业务状态码
              if (!(!result.success && result.code !== 200)) {
                _context.n = 4;
                break;
              }
              throw new Error(result.message || '请求失败');
            case 4:
              return _context.a(2, result);
            case 5:
              _context.p = 5;
              _t = _context.v;
              console.error('接口请求失败:', _t);

              // 显示错误提示
              _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().showToast({
                title: _t.message || '网络请求失败',
                icon: 'none',
                duration: 2000
              });
              throw _t;
            case 6:
              return _context.a(2);
          }
        }, _callee, this, [[1, 5]]);
      }));
      function request(_x) {
        return _request.apply(this, arguments);
      }
      return request;
    }() // 登录接口
  }, {
    key: "login",
    value: function () {
      var _login = (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_5__["default"])(/*#__PURE__*/(0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_6__["default"])().m(function _callee2(params) {
        return (0,_Users_peak_work_ducha_miniprogram_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_6__["default"])().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              return _context2.a(2, this.request(_config__WEBPACK_IMPORTED_MODULE_1__.API_CONFIG.ENDPOINTS.OAUTH_LOGIN, 'POST', params));
          }
        }, _callee2, this);
      }));
      function login(_x2) {
        return _login.apply(this, arguments);
      }
      return login;
    }() // 设置请求头（用于设置token等）
  }, {
    key: "setAuthToken",
    value: function setAuthToken(token) {
      // 可以在这里设置全局token
      console.log('设置认证token:', token);
    }
  }]);
}(); // 导出API客户端实例
var apiClient = new ApiClient();

// 导出类型

/***/ }),

/***/ "./src/utils/config.ts":
/*!*****************************!*\
  !*** ./src/utils/config.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   API_CONFIG: function() { return /* binding */ API_CONFIG; },
/* harmony export */   REQUEST_TIMEOUT: function() { return /* binding */ REQUEST_TIMEOUT; }
/* harmony export */ });
// API配置
var API_CONFIG = {
  // 接口域名
  BASE_URL: 'https://bi.hskj.cc',
  // 接口路径
  ENDPOINTS: {
    // 登录接口
    OAUTH_LOGIN: '/api/v1/users/oauthlogin'
  },
  // 渠道标识
  CHANNEL: 'miniprogram'
};

// 请求超时时间
var REQUEST_TIMEOUT = 10000;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _asyncToGenerator; }
/* harmony export */ });
function asyncGeneratorStep(n, t, e, r, o, a, c) {
  try {
    var i = n[a](c),
      u = i.value;
  } catch (n) {
    return void e(n);
  }
  i.done ? t(u) : Promise.resolve(u).then(r, o);
}
function _asyncToGenerator(n) {
  return function () {
    var t = this,
      e = arguments;
    return new Promise(function (r, o) {
      var a = n.apply(t, e);
      function _next(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
      }
      function _throw(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
      }
      _next(void 0);
    });
  };
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/objectSpread2.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/objectSpread2.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _objectSpread2; }
/* harmony export */ });
/* harmony import */ var _defineProperty_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./defineProperty.js */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");

function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      (0,_defineProperty_js__WEBPACK_IMPORTED_MODULE_0__["default"])(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/regenerator.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/regenerator.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _regenerator; }
/* harmony export */ });
/* harmony import */ var _regeneratorDefine_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regeneratorDefine.js */ "./node_modules/@babel/runtime/helpers/esm/regeneratorDefine.js");

function _regenerator() {
  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */
  var e,
    t,
    r = "function" == typeof Symbol ? Symbol : {},
    n = r.iterator || "@@iterator",
    o = r.toStringTag || "@@toStringTag";
  function i(r, n, o, i) {
    var c = n && n.prototype instanceof Generator ? n : Generator,
      u = Object.create(c.prototype);
    return (0,_regeneratorDefine_js__WEBPACK_IMPORTED_MODULE_0__["default"])(u, "_invoke", function (r, n, o) {
      var i,
        c,
        u,
        f = 0,
        p = o || [],
        y = !1,
        G = {
          p: 0,
          n: 0,
          v: e,
          a: d,
          f: d.bind(e, 4),
          d: function d(t, r) {
            return i = t, c = 0, u = e, G.n = r, a;
          }
        };
      function d(r, n) {
        for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) {
          var o,
            i = p[t],
            d = G.p,
            l = i[2];
          r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0));
        }
        if (o || r > 1) return a;
        throw y = !0, n;
      }
      return function (o, p, l) {
        if (f > 1) throw TypeError("Generator is already running");
        for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) {
          i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u);
          try {
            if (f = 2, i) {
              if (c || (o = "next"), t = i[o]) {
                if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object");
                if (!t.done) return t;
                u = t.value, c < 2 && (c = 0);
              } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1);
              i = e;
            } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break;
          } catch (t) {
            i = e, c = 1, u = t;
          } finally {
            f = 1;
          }
        }
        return {
          value: t,
          done: y
        };
      };
    }(r, o, i), !0), u;
  }
  var a = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  t = Object.getPrototypeOf;
  var c = [][n] ? t(t([][n]())) : ((0,_regeneratorDefine_js__WEBPACK_IMPORTED_MODULE_0__["default"])(t = {}, n, function () {
      return this;
    }), t),
    u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c);
  function f(e) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, (0,_regeneratorDefine_js__WEBPACK_IMPORTED_MODULE_0__["default"])(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e;
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, (0,_regeneratorDefine_js__WEBPACK_IMPORTED_MODULE_0__["default"])(u, "constructor", GeneratorFunctionPrototype), (0,_regeneratorDefine_js__WEBPACK_IMPORTED_MODULE_0__["default"])(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", (0,_regeneratorDefine_js__WEBPACK_IMPORTED_MODULE_0__["default"])(GeneratorFunctionPrototype, o, "GeneratorFunction"), (0,_regeneratorDefine_js__WEBPACK_IMPORTED_MODULE_0__["default"])(u), (0,_regeneratorDefine_js__WEBPACK_IMPORTED_MODULE_0__["default"])(u, o, "Generator"), (0,_regeneratorDefine_js__WEBPACK_IMPORTED_MODULE_0__["default"])(u, n, function () {
    return this;
  }), (0,_regeneratorDefine_js__WEBPACK_IMPORTED_MODULE_0__["default"])(u, "toString", function () {
    return "[object Generator]";
  }), (_regenerator = function _regenerator() {
    return {
      w: i,
      m: f
    };
  })();
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/regeneratorDefine.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/regeneratorDefine.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _regeneratorDefine; }
/* harmony export */ });
function _regeneratorDefine(e, r, n, t) {
  var i = Object.defineProperty;
  try {
    i({}, "", {});
  } catch (e) {
    i = 0;
  }
  _regeneratorDefine = function regeneratorDefine(e, r, n, t) {
    function o(r, n) {
      _regeneratorDefine(e, r, function (e) {
        return this._invoke(r, n, e);
      });
    }
    r ? i ? i(e, r, {
      value: n,
      enumerable: !t,
      configurable: !t,
      writable: !t
    }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2));
  }, _regeneratorDefine(e, r, n, t);
}


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["taro","vendors"], function() { return __webpack_exec__("./src/pages/login/index.tsx"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=index.js.map