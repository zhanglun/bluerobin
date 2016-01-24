"use strict";

var $ajax = {};

var ajax = function ajax(setting) {
  var promise = new Promise();

  var method = setting.method || "get";
  var callback = setting.success || function () {};
  var params = setting.params || "";
  var dataType = setting.dataType || "";
  var beforeSend = setting.beforeSend || undefined;
  var asnyc = setting.asnyc || true;
  var error = setting.error || function () {};
  var url = setting.url || function () {};

  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      // ready
      var statusCode = xhr.status;
      if (statusCode == 200) {
        promise.resolve(JSON.parse(xhr.responseText));
      } else {
        promise.reject(xhr);
      }
    } else {
      // not ready
    }
  };
  xhr.open(method, url, asnyc);
  xhr.send(params);
  return promise;
};

$ajax.get = ajax;

$ajax.get({
  url: 'http://zhanglun.daoapp.io/api/tasks'
});

module.exports = $ajax;
//# sourceMappingURL=ajax.babel.js.map
