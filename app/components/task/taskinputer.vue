<style lang="sass">
	.task-inputer{
		box-sizing: border-box;
		width:100%;
		>input{
	    width: 100%;
	    box-sizing: border-box;
	    display: block;
	    height: 40px;
	    font-size: 14px;
	    padding: 0 8px;
	    outline: none;
	    border:none ;
		  background: rgba(255, 255, 255, 0.8);
		  font-family: '微软雅黑';
		  color: #6B6B6B;
		}
	}
</style>

<template>
	<div class="task-inputer">
		<input type="text" v-model="newTaskTitle" id="taskInputer" v-on:keyup.enter="createTask" autofocus placeholder="What is your focus today..." v-on:paste="upload($event)">
	</div>
	<div>
		<img v-bind:src="imagesrc | blob2src" alt="" v-for="imagesrc in fileList">
	</div>
</template>

<script>
import Uploader from '../../services/upload.babel.js';

module.exports = {
	data(){
		return {
			title: 'task inputer',
			newTaskTitle: '',
			fileList: [],
			imageList: []
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
		createTask: function(){
			if(!this.newTaskTitle){
				return false;
			}
			this.$dispatch('create task', {
				title: this.newTaskTitle,
				ctime: new Date()
				});

			this.newTaskTitle = '';
		},

		upload(e){
			var _this = this;
			var uploader = Uploader();
			var items = e.clipboardData && e.clipboardData.items;
			if(items && items.length){
				for(var i=0; i<items.length; i++){
					var file = items[i].getAsFile && items[i].getAsFile();
					if (file) {
						_this.fileList.push(file);
					}
				}
			}

    	uploader.bind('PostInit', function(){
    			uploader.addFile(_this.fileList);
    	});

		}
	}

};

</script>