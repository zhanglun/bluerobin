<style lang="sass">
.task-list{
	margin-top:14px;
 transform: perspective(1000px);
}
</style>

<template>
	<div class="task-list">
		<task v-for="task in tasklist" :task="task" :index="$index" track-by="$index"></task>
	</div>
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
					_this.tasklist = data;
					return data;
				});
			}
		},
		events: {
			'add task': function(task){
				var _this = this;
				console.log('Component: TaskList 收到了来自 App 的 new task');
				Proxy.Task.create(task)
				.then(function(res){
					_this.tasklist.push(res);
				});
			},
			'delete task': function(task){
				var _this = this;
    		Proxy.Task.delete(task)
     		.then(function(){
	     		_this.tasklist.$remove(task);
     		});
			},
			'edit task': function(task){
				var _this = this;
				console.log('Component: TaskList 收到了来自 App 的 edit task');
				Proxy.Task.edit(task)
				.then(function(res){
					console.log('edit task success!');
				})
			}
		}
	};
</script>