import $ajax from './ajax.babel.js';

// let root = 'http://zhanglun.daoapp.io/api';
let root = 'http://127.0.0.1:1234/api';

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

let CONFIG = {};
CONFIG.API = {
  TASKS: root + '/tasks',
};

/**
 * 获取task
 * @param  {[type]} params querystring
 * @return {[type]}        [description]
 */
proxy.Task.get = function(params) {
  return $ajax.get({
    url: CONFIG.API.TASKS,
    data: params,
    token: localStorage.token
  }).then(function(res) {
    return JSON.parse(res);
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
  return fetch(root + '/tasks/' + task._id, {
      method: 'put',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new JSON2FormData(task)
    })
    .then(function(res) {
      if (res.ok) {
        return res.json();
      }
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
