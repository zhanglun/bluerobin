import $ajax from './ajax.babel.js';
import Tool from './tool.babel.js';

window.CONFIG = {
    // APIROOT: 'http://127.0.0.1:1234/api'
    APIROOT: 'http://zhanglun.daoapp.io/api'
};

let root = window.CONFIG.APIROOT;

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


let proxy = {};
proxy.Task = {};
proxy.User = {};
proxy.Upload = {};

window.CONFIG.API = {
  TASKS: root + '/tasks',
};

/**
 * 获取task
 * @param  {[type]} params querystring
 * @return {[type]}        [description]
 */
proxy.Task.get = function(params) {
  return $.ajax({
    method: 'get',
    url: CONFIG.API.TASKS,
    data: params,
    token: localStorage.token
  }).then(function(res) {
    console.log(res);
    res.map(function(task){
      task.attachments.map(function(attachment){
        attachment.previewUrl = Tool.createImagePreviewUrl(attachment.url, 160, 80);
      });
    });
    console.log(res);
    return res;
  });
};

/**
 * 创建 task
 * @param  {[type]} task [description]
 * @return {[type]}      [description]
 */
proxy.Task.create = function(task) {
  return $ajax.post({
    url: CONFIG.API.TASKS,
    data: task,
    token: localStorage.token
  }).then(function(res) {
    return JSON.parse(res);
  });

};

/**
 * 删除 task
 * @param  {[type]} task [description]
 * @return {[type]}      [description]
 */
proxy.Task.delete = function(task) {
  return $ajax.delete({
    url: CONFIG.API.TASKS + '/' + task._id
  }).then(function(res) {
    return JSON.parse(res);
  });
};

/**
 * [modify description]
 * @param  {[type]} task [description]
 * @return {[type]}      [description]
 */
proxy.Task.edit = function(task) {
  return $.ajax({
    url: root + '/tasks/' + task._id,
    method: 'put',
    data: task,
    dataType: 'json'
  })
  .done(function(res){
    return res;
  })
  .fail(function(xhr){
    return xhr;
  });
};


proxy.User.login = function(user) {
  return $ajax.post({
    url: root + '/user/login',
    data: user
  }).then(function(res) {
    return JSON.parse(res);
  });
};


proxy.User.authenticate = function(user){
  return $.ajax({
    method: 'post',
    url: root + '/user/authenticate',
    dataType: 'json',
    headers: {
      'x-access-token': localStorage.token
    }
  })
};

/**
 * 获取上传token
 * @return {[type]} [description]
 */
proxy.Upload.getUptoken = function() {
  return fetch(root + '/qiniu/token', {
      method: 'get'
    })
    .then(function(res) {
      if (res.ok) {
        return res.json();
      }
    });
};

window.$ajax = $ajax;
window.$get = $ajax.get;


export default proxy;
