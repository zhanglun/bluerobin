<template>
	<div class="container">
      <ul class="collection with-header" id="filelist">
        <li class="collection-header" id="uploadcontainer">
        	<h4>File List</h4>
				<span class="material-icons" id="uploadfile">cloud_upload</span>
        	</li>
        	<li class="collection-item" v-for="file in filelist">id:{{file._id}} --- isFile:{{file.isfile}} ---- {{file.name}}</li>
      </ul>
      <ul id="filelist"></ul>
	</div>

</template>
<script>
	import Uploader from '../../services/upload.babel.js';
	import Tool from '../../services/tool.babel.js';
	export default{
		data(){
			return {
				uploader: {},
				fileMap: {},
				filelist: []
			}
		},
		ready(){
			this.init();

			var _this = this;
			$.ajax({
				url: CONFIG.APIROOT + '/file'
			})
			.then(function(files){
				_this.filelist = files;
			});


			document.getElementById('filelist').addEventListener('drop', function(e) {
			  var items = e.dataTransfer.items,
			    n, item;
			  for (n = 0; n < items.length; n++) {
			    item = items[n].webkitGetAsEntry();
			    if (item) {
			      _this.traverseFileTree(item);
			    }
			  }
			}, false);


		},
		methods: {
			init(){
				var _this = this;
		    function setKey(up, file){
		      var filepath = file.name;
		    	var map = _this.$data.fileMap;
		      if (map[file.name] !== undefined) {
		        filepath = map[file.name] + file.name
		      }
		      return filepath;
		    }

				this.$set('uploader', Uploader({
					browse_button: 'uploadfile',
					drop_element: 'filelist',
					container: 'uploadcontainer'
				}, setKey));

		    this.uploader.bind('PostInit', function(){
		      _this.uploader.addFile(_this.newFile);
		    });

		    this.uploader.bind('FilesAdded', function(up, files){
		    	var html = '';
		    	var map = _this.$data.fileMap;

		      plupload.each(files, function(file) {
	        // 文件添加进队列后,处理相关的事情
	        var filepath = file.name;
	        if (map[file.name] !== undefined) {
	          filepath = map[file.name] + file.name
	        }
	        html += '<li id="' + file.id + '">' + filepath + ' (' + plupload.formatSize(file.size) + ') <b></b></li>';
		      });
		      document.getElementById('filelist').innerHTML += html;
		    });




		    this.uploader.bind('BeforeUpload', function(up, files){

		    });

		    this.uploader.bind('FileUploaded', function(up, file, res){
		      _this.filelist.push({
		        name: file.name,
		        url: Tool.uploadImageSrc(file.name),
		        size: file.size,
		        width: file.width,
		        height: file.height,
		        type: file.type
		      });

		    });
			},

			traverseFileTree(item, path) {
				
				var _this = this;
				var fileMap = _this.$data.fileMap;
			  var dirReader = null;
			  path = path || '';

			  if (item.isFile) {
			    item.file(function(file) {
			      // careful here, could be several files of the same name
			      // we assume files will be in the same order here than in plupload
			      if (fileMap[file.name] === undefined) {
			        fileMap[file.name] = [];
			      }
			      fileMap[file.name].push(path);
			    });
			  } else if (item.isDirectory) {
			    dirReader = item.createReader();
			    dirReader.readEntries(function(entries) {
			      var n = 0;
			      for (n = 0; n < entries.length; n++) {
			        _this.traverseFileTree(entries[n], path + item.name + "/");
			      }
			    });
			  }
			}
		}
	}
</script>
<style>

	#uploadfile{
		cursor: pointer;
	}

</style>
