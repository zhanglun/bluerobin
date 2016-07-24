'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Tool = {};

Tool.uploadImageSrc = function (filename, w, h) {
  var query = '';
  if (w && h) {
    query = '?imageView2/1/w/' + w + '/h/' + h;
  }
  return 'http://7xnrrd.com1.z0.glb.clouddn.com/' + filename + query;
};

Tool.createImagePreviewUrl = function (origin, w, h) {
  w = w || 40;
  h = h || 40;
  return origin + '?imageView2/1/w/' + w + '/h/' + h;
};

Tool.guid = function () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

Tool.htmlDecode = function (str) {
  var s = "";
  if (str.length == 0) return "";
  s = str.replace(/&/g, "&amp;");
  s = s.replace(/</g, "&lt;");
  s = s.replace(/>/g, "&gt;");
  s = s.replace(/ /g, "&nbsp;");
  s = s.replace(/\'/g, "&#39;");
  s = s.replace(/\"/g, "&quot;");
  s = s.replace(/\n/g, "<br>");
  return s;
};

Tool.htmlEncode = function (str) {
  var s = "";
  if (str.length == 0) return "";
  s = str.replace(/&amp;/g, "&");
  s = s.replace(/&lt;/g, "<");
  s = s.replace(/&gt;/g, ">");
  s = s.replace(/&nbsp;/g, " ");
  s = s.replace(/&#39;/g, "\'");
  s = s.replace(/&quot;/g, "\"");
  s = s.replace(/<br>/g, "\n");
  return s;
};

exports.default = Tool;
//# sourceMappingURL=tool.babel.js.map
