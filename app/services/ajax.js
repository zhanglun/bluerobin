"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var $ajax = {};

var ajax = function ajax(setting) {
  var method = setting.method || "get";
  var callback = setting.success || function () {};
  var params = setting.data || "";
  var dataType = setting.dataType || "";
  var beforeSend = setting.beforeSend || undefined;
  var asnyc = setting.asnyc || true;
  var error = setting.error || function () {};
  var url = setting.url || function () {};

  var xhr = new XMLHttpRequest();
  return new Promise(function (resolve, reject) {

    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        // ready
        var result = xhr.responseText;
        if (dataType == 'json') {

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
    xhr.open(method.toLowerCase(), url, asnyc);
    if (method == "post") {
      // xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    }
    xhr.send(JSON.stringify(params));
  });
};

$ajax.post = function (conf) {
  conf.method = 'post';
  return ajax(conf);
};

$ajax.get = function (conf) {
  return ajax(conf);
};

exports.default = $ajax;
//# sourceMappingURL=ajax.babel.js.map
