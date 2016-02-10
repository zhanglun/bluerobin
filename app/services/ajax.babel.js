let $ajax = {};

let ajax = function(setting) {
  let method = setting.method || 'get';
  // let callback = setting.success || function() {};
  let params = setting.data || '';
  let dataType = setting.dataType || '';
  // let beforeSend = setting.beforeSend || undefined;
  let asnyc = setting.asnyc || true;
  // let error = setting.error || function() {};
  let url = setting.url || function() {};
  let header  = setting.header || null;
  let token = setting.token || null;

  let xhr = new XMLHttpRequest();
  return new Promise(function(resolve, reject) {

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        // ready
        let result = xhr.responseText;
        if (dataType === 'json') {

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
    };
    if(header && header.token){
      xhr.setRequestHeader('x-access-token', header.token);
    }
    xhr.open(method.toLowerCase(), url, asnyc);
    if (method === 'post' || method === 'put') {
      xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
      xhr.send(JSON.stringify(params));
    }else{
      xhr.send();
    }
    
  });

};



$ajax.post = function(conf) {
  conf.method = 'post';
  return ajax(conf);
};

$ajax.get = function(conf) {
  return ajax(conf);
};

$ajax.delete = function(conf){
  conf.method = 'delete';
  return ajax(conf);
};

$ajax.put = function(conf){
  conf.method = 'put';
  return ajax(conf);
};

export default $ajax;
