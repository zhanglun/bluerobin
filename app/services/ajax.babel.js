let $ajax = {};

var ajax = function(setting) {
  let method = setting.method || "get";
  let callback = setting.success || function() {};
  let params = setting.params || "";
  let dataType = setting.dataType || "";
  let beforeSend = setting.beforeSend || undefined;
  let asnyc = setting.asnyc || true;
  let error = setting.error || function() {};
  let url = setting.url || function() {};

  var xhr = new XMLHttpRequest();
  return new Promise(function(resolve, reject) {

    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        // ready
        let result = xhr.responseText;
        if (dataType == 'json') {

          resolve(JSON.parse(result));
        } else {
          resolve(result);
        }
      } else {
        // not ready
      }
    };
    xhr.onerror = function(e) {
      reject(xhr, e);
    }
    xhr.open(method.toLowerCase(), url, asnyc);
    if (method == "post") {
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }
    xhr.send(params);
  });

};



$ajax.post = function(conf) {
  confg.method = 'post';
  return ajax(conf);
}

$ajax.get = function(conf) {
  return ajax(conf);
}

export default $ajax;
