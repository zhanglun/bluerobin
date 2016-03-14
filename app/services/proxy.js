'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ajaxBabel = require('./ajax.babel.js');

var _ajaxBabel2 = _interopRequireDefault(_ajaxBabel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.CONFIG = {
  APIROOT: 'http://127.0.0.1:1234/api'
  // APIROOT: 'http://zhanglun.daoapp.io/api'
};

var root = window.CONFIG.APIROOT;

function JSON2FormData(json) {

  var str = '';
  for (var key in json) {
    if (str !== '') {
      str += '&';
    }
    str += key + '=' + encodeURIComponent(json[key]);
  }
  return str;
}

var proxy = {};
proxy.Task = {};
proxy.User = {};
proxy.Upload = {};

window.CONFIG.API = {
  TASKS: root + '/tasks'
};

/**
 * 获取task
 * @param  {[type]} params querystring
 * @return {[type]}        [description]
 */
proxy.Task.get = function (params) {
  return _ajaxBabel2.default.get({
    url: CONFIG.API.TASKS,
    data: params,
    token: localStorage.token
  }).then(function (res) {
    return JSON.parse(res);
  });
};

/**
 * 创建 task
 * @param  {[type]} task [description]
 * @return {[type]}      [description]
 */
proxy.Task.create = function (task) {
  return _ajaxBabel2.default.post({
    url: CONFIG.API.TASKS,
    data: task,
    token: localStorage.token
  }).then(function (res) {
    return JSON.parse(res);
  });
};

/**
 * 删除 task
 * @param  {[type]} task [description]
 * @return {[type]}      [description]
 */
proxy.Task.delete = function (task) {
  return _ajaxBabel2.default.delete({
    url: CONFIG.API.TASKS + '/' + task._id
  }).then(function (res) {
    return JSON.parse(res);
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
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new JSON2FormData(task)
  }).then(function (res) {
    if (res.ok) {
      return res.json();
    }
  });
};

proxy.User.login = function (user) {
  return _ajaxBabel2.default.post({
    url: root + '/user/login',
    data: user
  }).then(function (res) {
    return JSON.parse(res);
  });
};

proxy.User.authenticate = function (user) {
  return _ajaxBabel2.default.post({
    url: root + '/user/authenticate',
    token: localStorage.token
  }).then(function (token) {
    return JSON.parse(token);
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

window.$ajax = _ajaxBabel2.default;
window.$get = _ajaxBabel2.default.get;

exports.default = proxy;
//# sourceMappingURL=proxy.babel.js.map
