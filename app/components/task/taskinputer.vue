<style lang="sass">

</style>

<template>
	<input type="text" v-model="newTaskTitle" id="taskInputer" v-on:keyup.enter="createTask" autofocus>
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