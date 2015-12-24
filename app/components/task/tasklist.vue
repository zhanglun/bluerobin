<style>

</style>

<template>
	<h3>Task List</h3>
	<task v-for="task in tasklist" :task="task" :index="$index" track-by="$index"></task>
</template>

<script>
// http://zhanglun.daoapp.io/api/todo/tasks
	import Proxy from '../../services/proxy.babel.js';
	import Task from './task.vue';

	export default {
		data() {
			return {
				tasklist: []
			}
		},
		components: {
			task: Task
		},
		ready() {
			this.getTaskList();
		},
		methods: {
			'getTaskList': function() {
				var _this = this;
				Proxy.Task.get()
				.then(function(data){
					console.log(data);
					_this.tasklist = data.splice(180);
					return data;
				});
			}
		},
		events: {
			'add new task': function(data){
				var _this = this;
				console.log('Component: TaskList 收到了来自 App的new task');
				Proxy.Task.create(JSON.stringify(data))
				.then(function(){
					_this.tasklist.push(data);
				});
			}
		}
	};
</script>