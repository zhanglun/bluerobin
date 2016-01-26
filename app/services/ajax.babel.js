let $ajax = {};

let ajax = function(setting) {
  let method = setting.method || "get";
  let callback = setting.success || function() {};
  let params = setting.data || "";
  let dataType = setting.dataType || "";
  let beforeSend = setting.beforeSend || undefined;
  let asnyc = setting.asnyc || true;
  let error = setting.error || function() {};
  let url = setting.url || function() {};

  let xhr = new XMLHttpRequest();
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
      // xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    }
    xhr.send(JSON.stringify(params));
  });

};


function obj2form(obj, form, namespace) {

  let fd = form || new FormData();
  let formKey;

  for (let property in obj) {
    if (obj.hasOwnProperty(property)) {

      if (namespace) {
        formKey = namespace + '[' + property + ']';
      } else {
        formKey = property;
      }

      // if the property is an object, but not a File,
      // use recursivity.
      if (typeof obj[property] === 'object' && !(obj[property] instanceof File)) {

        objectToFormData(obj[property], fd, property);

      } else {

        // if it's a string or a File object
        fd.append(formKey, obj[property]);
      }

    }
  }

  return fd;

}


$ajax.post = function(conf) {
  conf.method = 'post';
  return ajax(conf);
}

$ajax.get = function(conf) {
  return ajax(conf);
}

export default $ajax;
