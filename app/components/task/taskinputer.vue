<template>
    <div class="mdl-cell mdl-cell--12-col mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <input class="mdl-textfield__input" type="text" v-model="newTask.title" @keyup.enter="createTask">
      <label for="" class="mdl-textfield__label">Title</label>
    </div>
</template>

<script>
import Uploader from '../../services/upload.babel.js';
import Tool from '../../services/tool.babel.js';

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

export default {
	data(){
		return {
			title: 'task inputer',
			newTask: {
				title: '',
				create_time: '',
				attachments: []
			},
			imagePreviewList: [],
			uploader: null,
      newFile: null,
      watchData: []
		}
	},
	filters: {
		blob2src: function(blob){
			return URL.createObjectURL(blob);
		}
	},
	watch: {
		'newTask.title': function(val, oldval){
			localStorage.newTask = JSON.stringify(this.newTask);
		},
		'newTask.attachments': function(val, oldval){
			localStorage.newTask = JSON.stringify(this.newTask);
		}
	},
	ready(){
		this.watchData = [this.newTask.title, this.newTask.attachments];
		localStorage.newTask ? this.newTask = JSON.parse(localStorage.newTask) : null;

		this.init();

	},

	methods: {
		// 初始化
		init(){

	    var _this = this;
			this.$set('uploader', Uploader({
				container: 'taskWriter'
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
		},

		// 创建任务
		createTask(){

			if(!this.newTask.title){
				return false;
			}

			this.newTask.ctime = new Date();

			this.$dispatch('create task', this.newTask);

			this.newTask = {
				title: '',
				ctime: '',
				attachments: []
			};

		},

		// 粘贴复制
		uploadByPaste(e){
			var _this = this;
			var items = e.clipboardData && e.clipboardData.items;
			if(!(items && items.length)){
				return false;
			}
			for(var i=0; i<items.length; i++){
				var file = items[i].getAsFile && items[i].getAsFile();
				if (file) {
					file.name = guid() + '.' + file.type.replace(/^\w*\//ig, '');
		      _this.uploader.addFile(file);
					_this.newFile = file;
				}
			}
		}
	}

};

</script>



<style lang="less">

@import '../../public/stylesheets/variables';

.modal.bottom-sheet{
	max-height: 60%;
}
.task-inputer{
	box-sizing: border-box;
	width:100%;
	height: 300px;
	background: @white;
	&-bar{
		overflow: hidden;
	  // padding: 8px;
	  // border-top: 1px solid #E0E0E0;
	  >[class^="icon"]{
	  	display: inline-block;
	  	width: 20px;
	  	text-algin: center;
	  	margin:0 6px;
	  	font-size: 16px;
	  }
	}
	>textarea{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: block;
	  padding: 8px;
    font-size: 14px;
    outline: none;
    border:none ;
	  background: none;
	  font-family: '微软雅黑';
	  color: #6B6B6B;
	  outline: none;
	  resize:none;
	  transition: all 0.3s ease-in;

	}
}

.task-images{
	padding:0 4px;
	width:100%;
	background: $white;
  box-sizing: border-box;
	>div{
		box-sizing: border-box;
		width:2	0%;
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
