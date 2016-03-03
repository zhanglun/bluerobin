'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var $ajax = {};

var ajax = function ajax(setting) {
  var method = setting.method || 'get';
  // let callback = setting.success || function() {};
  var params = setting.data || {};
  var dataType = setting.dataType || '';
  // let beforeSend = setting.beforeSend || undefined;
  var asnyc = setting.asnyc || true;
  // let error = setting.error || function() {};
  var url = setting.url || function () {};
  var header = setting.header || null;
  var token = setting.token || null;

  var xhr = new XMLHttpRequest();
  return new Promise(function (resolve, reject) {

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        // ready
        var result = xhr.responseText;
        if (dataType === 'json') {

          resolve(JSON.parse(result));
        } else {
          resolve(result);
        }
      } else {
        // not ready
      }
    };
    xhr.onerror = function (e) {
      reject(xhr, e);
    };

    xhr.open(method.toLowerCase(), url + '?stamp=' + new Date().getTime(), asnyc);

    if (token) {
      xhr.setRequestHeader('x-access-token', token);
    }

    if (method === 'post' || method === 'put') {
      xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
      xhr.send(JSON.stringify(params));
    } else {
      xhr.send();
    }
  });
};

$ajax.set = function () {};

$ajax.post = function (conf) {
  conf.method = 'post';
  return ajax(conf);
};

$ajax.get = function (conf) {
  return ajax(conf);
};

$ajax.delete = function (conf) {
  conf.method = 'delete';
  return ajax(conf);
};

$ajax.put = function (conf) {
  conf.method = 'put';
  return ajax(conf);
};

exports.default = $ajax;
//# sourceMappingURL=ajax.babel.js.map
