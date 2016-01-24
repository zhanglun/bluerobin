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
      if (xhr.readyState == 4) {
        // ready
        var statusCode = xhr.status;
        if (statusCode == 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(xhr);
        }
      } else {
        // not ready
      }
    };
    xhr.open(method, url, asnyc);
    xhr.send(params);
  });

};

ajax({url: 'http://zhanglun.daoapp.io/api/tasks'})
.then(function(res){
	console.log(res);
});

export default $ajax;
