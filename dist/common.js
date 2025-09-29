"use strict";
(wx["webpackJsonp"] = wx["webpackJsonp"] || []).push([["common"],{

/***/ "./src/utils/auth.ts":
/*!***************************!*\
  !*** ./src/utils/auth.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clearLoginInfo: function() { return /* binding */ clearLoginInfo; },
/* harmony export */   getPhoneNumber: function() { return /* binding */ getPhoneNumber; },
/* harmony export */   getUserInfo: function() { return /* binding */ getUserInfo; },
/* harmony export */   requireLogin: function() { return /* binding */ requireLogin; }
/* harmony export */ });
/* unused harmony exports checkLoginStatus, getToken, navigateToLogin */
/* harmony import */ var _tarojs_taro__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tarojs/taro */ "./node_modules/@tarojs/taro/index.js");
/* harmony import */ var _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_tarojs_taro__WEBPACK_IMPORTED_MODULE_0__);


// 检查用户是否已登录
var checkLoginStatus = function checkLoginStatus() {
  var userInfo = _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().getStorageSync('userInfo');
  var phoneNumber = _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().getStorageSync('phoneNumber');
  var token = _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().getStorageSync('token');
  return !!(userInfo && phoneNumber && token);
};

// 获取用户信息
var getUserInfo = function getUserInfo() {
  return _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().getStorageSync('userInfo');
};

// 获取手机号
var getPhoneNumber = function getPhoneNumber() {
  return _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().getStorageSync('phoneNumber');
};

// 获取登录token
var getToken = function getToken() {
  return _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().getStorageSync('token');
};

// 清除登录信息
var clearLoginInfo = function clearLoginInfo() {
  _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().removeStorageSync('userInfo');
  _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().removeStorageSync('phoneNumber');
  _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().removeStorageSync('token');
};

// 跳转到登录页
var navigateToLogin = function navigateToLogin() {
  _tarojs_taro__WEBPACK_IMPORTED_MODULE_0___default().reLaunch({
    url: '/pages/login/index'
  });
};

// 检查登录状态，未登录则跳转
var requireLogin = function requireLogin() {
  if (!checkLoginStatus()) {
    navigateToLogin();
    return false;
  }
  return true;
};

/***/ })

}]);
//# sourceMappingURL=common.js.map