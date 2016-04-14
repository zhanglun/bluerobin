'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toolBabel = require('./tool.babel.js');

var _toolBabel2 = _interopRequireDefault(_toolBabel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.CONFIG = {
  APIROOT: 'http://localhost:1234/api'
  // APIROOT: 'http://zhanglun.daoapp.io/api'
};

var CONFIG = window.CONFIG;
var root = CONFIG.APIROOT;
var proxy = {};

CONFIG.API = {
  TASKS: root + '/tasks'
};
proxy.Task = {};
proxy.User = {};
proxy.Upload = {};

/**
 * 获取task
 * @param  {[type]} params querystring
 * @return {[type]}        [description]
 */
proxy.Task.get = function (id) {
  var url = CONFIG.API.TASKS;
  if (id) {
    url = CONFIG.API.TASKS + '/' + id;
  }
  return $.ajax({
    method: 'get',
    url: url,
    headers: {
      'x-access-token': localStorage.token
    }
  }).then(function (res) {
    res.map(function (task) {
      task.attachments.map(function (attachment) {
        attachment.previewUrl = _toolBabel2.default.createImagePreviewUrl(attachment.url, 160, 80);
      });
    });
    return res;
  });
};

/**
 * 创建 task
 * @param  {[type]} task [description]
 * @return {[type]}      [description]
 */
proxy.Task.create = function (task) {
  return $.ajax({
    method: 'post',
    url: CONFIG.API.TASKS,
    data: task,
    headers: {
      'x-access-token': localStorage.token
    }
  }).then(function (res) {
    return res;
  });
};

/**
 * 删除 task
 * @param  {[type]} task [description]
 * @return {[type]}      [description]
 */
proxy.Task.delete = function (task) {
  return $.ajax({
    method: 'delete',
    url: CONFIG.API.TASKS + '/' + task.id
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
  return $.ajax({
    url: root + '/tasks/' + task._id,
    method: 'put',
    data: task,
    dataType: 'json'
  }).done(function (res) {
    return res;
  }).fail(function (xhr) {
    return xhr;
  });
};

proxy.User.login = function (user) {
  return $.ajax({
    method: 'post',
    url: root + '/user/login',
    data: user
  });
};

proxy.User.signUp = function (user) {
  return $.ajax({
    type: 'post',
    url: root + '/user/signup',
    data: user,
    dataType: 'json'
  });
};

proxy.User.authenticate = function () {
  return $.ajax({
    method: 'post',
    url: root + '/user/authenticate',
    dataType: 'json',
    headers: {
      'x-access-token': localStorage.token
    }
  });
};

/**
 * 获取上传token
 * @return {[type]} [description]
 */
proxy.Upload.getUptoken = function () {
  return $.ajax({
    method: 'get'
  }).done(function (res) {
    return res;
  });
};

exports.default = proxy;
//# sourceMappingURL=proxy.babel.js.map
