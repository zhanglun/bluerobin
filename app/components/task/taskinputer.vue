<style lang="sass">
	.task-inputer{
		box-sizing: border-box;
		width:100%;
	  background: rgba(255, 255, 255, 0.8);
		&-bar{
			overflow: hidden;
		  padding: 8px 8px;
		  >.icon-*{
		  	display: inline-block;
		  	margin:0 6px;
		  }
		}
		>input{
	    width: 100%;
	    box-sizing: border-box;
	    display: block;
	    height: 40px;
		  padding: 0 8px;
	    font-size: 14px;
	    outline: none;
	    border:none ;
		  // background: rgba(255, 255, 255, 0.8);
		  background: none;
		  font-family: '微软雅黑';
		  color: #6B6B6B;
		}
	}
	.task-images{
		padding:0 4px;
		width:100%;
	  background: rgba(255, 255, 255, 0.8);
	  box-sizing: border-box;
		>div{
			box-sizing: border-box;
			width:20%;
			padding:8px 4px;
			height:140px;
			display: inline-block;
		}
		.img-box{
			display: block;
			height:100%;
		}
	}
</style>

<template>
	<div class="task-inputer" id="taskWriter">
		<input type="text" v-model="newTaskTitle" id="taskInputer" v-on:keyup.enter="createTask" placeholder="What is your focus today..." v-on:paste="upload($event)" />
		<div class="task-inputer-bar">
			<span id="browse" class="icon-images"></span>
		</div>
	</div>
	<div class="task-images">
		<div v-for="imagesrc in imageList">
			<span class="img-box" v-bind:style="{backgroundImage: 'url('+ imagesrc + ')' }"></span>
			<!-- <img v-bind:src="imagesrc | blob2src" alt="" > -->
		</div>
	</div>
</template>

<script>
import Uploader from '../../services/upload.babel.js';

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

module.exports = {
	data(){
		return {
			title: 'task inputer',
			newTaskTitle: '',
			fileList: [],
			imageList: [],
			uploader: null,
			attachments: []
		}
	},
	filters: {
		blob2src: function(blob){
			return URL.createObjectURL(blob);
		}
	},
	ready(){
	},

	methods: {
		createTask(){
			if(!this.newTaskTitle){
				return false;
			}
			this.$dispatch('create task', {
				title: this.newTaskTitle,
				ctime: new Date(),
				attachments: this.attachments
				});

			this.newTaskTitle = '';
			this.attachments = [];
		},

		upload(e){
			var _this = this;
			var newFiles = [];
			_this.$set('uploader', Uploader({
				container: 'taskWriter'
			}));
			var uploader = _this.uploader;
			var items = e.clipboardData && e.clipboardData.items;
			if(items && items.length){
				for(var i=0; i<items.length; i++){
					var file = items[i].getAsFile && items[i].getAsFile();
					if (file) {
						file.name = guid() + '.' + file.type.replace(/^\w*\//ig, '');
						_this.fileList.push(file);
						newFiles.push(file);
						_this.imageList.push(URL.createObjectURL(file));
					}
				}
			}

    	uploader.bind('PostInit', function(){
    			uploader.addFile(newFiles);
    	});
    	uploader.bind('FileUploaded', function(up, file, res){
    		_this.attachments.push({
    			name: file.name,
    			url: file.key,
    			size: file.size,
    			width: file.width,
    			height: file.height,
    			type: file.type
    		});
    	});
		}
	}

};

</script>