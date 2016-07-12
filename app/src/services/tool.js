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

exports.default = Tool;
//# sourceMappingURL=tool.babel.js.map
