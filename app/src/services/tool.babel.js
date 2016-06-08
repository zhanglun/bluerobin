let Tool = {};

Tool.uploadImageSrc = function(filename, w, h) {
  var query = '';
  if (w && h) {
    query = '?imageView2/1/w/' + w + '/h/' + h;
  }
  return 'http://7xnrrd.com1.z0.glb.clouddn.com/' + filename + query;
};

Tool.createImagePreviewUrl = function(origin, w, h) {
  w = w || 40;
  h = h || 40;
  return origin + '?imageView2/1/w/' + w + '/h/' + h;
};

export default Tool;
