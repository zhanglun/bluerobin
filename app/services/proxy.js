"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// var root = 'http://jsonplaceholder.typicode.com';
// var root = 'http://localhost:1234/api';
var root = 'http://zhanglun.daoapp.io/api';

function JSON2FormData(json) {

  var str = "";
  for (var key in json) {
    if (str != "") {
      str += "&";
    }
    str += key + "=" + encodeURIComponent(json[key]);
  }
  return str;
};

var proxy = {};
proxy.Task = {};
proxy.User = {};
proxy.Upload = {};

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

/**
 * 创建 task
 * @param  {[type]} task [description]
 * @return {[type]}      [description]
 */
proxy.Task.create = function (task) {
  return fetch(root + '/tasks', {
    method: 'post',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: JSON2FormData(task)
  }).then(function (res) {
    if (res.ok) {
      return res.json();
    }
  });
};

/**
 * 删除 task
 * @param  {[type]} task [description]
 * @return {[type]}      [description]
 */
proxy.Task.delete = function (task) {
  return fetch(root + '/tasks/' + task._id, {
    method: 'delete',
    body: task
  }).then(function (res) {
    if (res.ok) {
      return res.json();
    }
  });
};

/**
 * [modify description]
 * @param  {[type]} task [description]
 * @return {[type]}      [description]
 */
proxy.Task.edit = function (task) {
  return fetch(root + '/tasks/' + task._id, {
    method: 'put',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: JSON2FormData(task)
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

proxy.User.login = function (user) {
  return fetch(root + "/user/login", {
    method: 'post',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: JSON2FormData(user)
  }).then(function (res) {
    if (res.ok) {
      return res.json();
    }
  });
};

/**
 * 获取上传token
 * @return {[type]} [description]
 */
proxy.Upload.getUptoken = function () {
  return fetch(root + '/qiniu/token', {
    method: 'get'
  }).then(function (res) {
    if (res.ok) {
      return res.json();
    }
  });
};

exports.default = proxy;
//# sourceMappingURL=proxy.babel.js.map
