<style lang="sass">
	.taks-inputer{
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
	<div class="taks-inputer">
		<input type="text" v-model="newTaskTitle" id="taskInputer" v-on:keyup.enter="createTask" autofocus placeholder="What is your focus today...">
	</div>
</template>

<script>
module.exports = {
	data: function(){
		return {
			title: 'task inputer',
			newTaskTitle: '',
		}
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

		}
	}

};

</script>