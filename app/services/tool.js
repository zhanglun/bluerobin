'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var Tool = {};

Tool.uploadImageSrc = function (filename, w, h) {
	console.log(filename);
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

Tool.traverseFileTree = function (items) {
	if (!map) {
		var map = {};
	}
	console.log(map);
	var dirReader = null;
	path = path || '';
	if (item.isFile) {
		item.file(function (file) {
			if (map[file.name] === undefined) {
				map[file.name] = [];
			}
			map[file.name].push(path);
		});
	} else if (item.isDirectory) {
		dirReader = item.createReader();
		dirReader.readEntries(function (entries) {
			var n = 0;
			for (n = 0; n < entries.length; n++) {
				argument.callee(entries[n], path + item.name + "/");
			}
			return map;
		});
	}
};

exports.default = Tool;
//# sourceMappingURL=tool.babel.js.map
