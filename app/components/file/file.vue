<template>
	<div class="container">
      <ul class="collection with-header" id="filelist">
        <li class="collection-header" id="uploadcontainer">
        	<h4>File List</h4>
					<span class="material-icons" id="uploadfile">cloud_upload</span>
							<!-- <span class="material-icons">file_upload</span> -->
        	</li>
        <li class="collection-item">Alvin</li>
        <li class="collection-item">Alvin</li>
        <li class="collection-item">Alvin</li>
        <li class="collection-item">Alvin</li>
      </ul>
	</div>

</template>
<script>
	import Uploader from '../../services/upload.babel.js';
	import Tool from '../../services/tool.babel.js';
	export default{
		data(){
			return {
				uploader: {}

			}
		},
		ready(){
			this.init();

		},
		methods: {
			init(){
				var _this = this;
				this.$set('uploader', Uploader({
					browse_button: 'uploadfile',
					drop_element: 'filelist',
					container: 'uploadcontainer'
				}));

		    this.uploader.bind('PostInit', function(){
		      _this.uploader.addFile(_this.newFile);
		    });

		    this.uploader.bind('BeforeUpload', function(up, file){

		    });

		    this.uploader.bind('FileUploaded', function(up, file, res){
		      _this.newTask.attachments.push({
		        name: file.name,
		        url: Tool.uploadImageSrc(file.name),
		        size: file.size,
		        width: file.width,
		        height: file.height,
		        type: file.type
		      });

		    });
			}
		}
	}
</script>
<style>

	#uploadfile{
		cursor: pointer;
	}
	
</style>