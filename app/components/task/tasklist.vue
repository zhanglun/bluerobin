<style>
	
</style>

<template>
	<h3>Task List</h3>
	<task v-for="task in tasklist" :task="task" :index="$index" track-by="$index"></task>
</template>

<script>

	var Task = require('./task.vue');
	var taskList = require('./_mock.js');

	module.exports = {
		data: function(){
			return {
				tasklist: []
			}
		},
		components: {
			task: Task
		},
		ready: function(){
			this.getTaskList();
		},
		methods: {
			'getTaskList': function(){
				this.tasklist = taskList;
				return taskList;
			}
		},
		events: {
			'add new task': function(data){
				console.log('Component: TaskList 收到了来自 App的new task');
				this.tasklist.push(data);
				console.log(this.tasklist);
			}
		}
	};
</script>