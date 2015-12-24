'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// var root = 'http://jsonplaceholder.typicode.com';
var root = 'http://localhost:1234/api';

var proxy = {};
proxy.Task = {};

/**
 * 获取task
 * @param  {[type]} params querystring
 * @return {[type]}        [description]
 */
proxy.Task.get = function (params) {
  return fetch(root + '/tasks', {
    method: 'GET',
    body: params
  }).then(function (res) {
    if (res.ok) {
      return res.json();
    }
  });
};

proxy.Task.create = function (task) {
  return fetch(root + '/tasks', {
    method: 'post',
    header: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: task
  }).then(function (res) {
    if (res.ok) {
      return res.json();
    }
  });
};

proxy.getBackgroundImage = function () {
  return fetch('http://ww1.sinaimg.cn/large/7e8b4ac8jw1ez8vuclmvcj21hc0xc7fn.jpg').then(function (res) {
    return res.blob();
  }).then(function (myBlob) {
    var objectURL = URL.createObjectURL(myBlob);
    return objectURL;
  });
};

exports.default = proxy;
//# sourceMappingURL=proxy.babel.js.map
