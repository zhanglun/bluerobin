'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var Tool = {};

Tool.uploadImageSrc = function (filename, w, h) {
	console.log(filename);
	var query = '';
	if (w && h) {
		query = '?imageView2/1/' + w + '/h/' + h;
	}
	return 'http://7xnrrd.com1.z0.glb.clouddn.com/' + filename + query;
};

exports.default = Tool;
//# sourceMappingURL=tool.babel.js.map
