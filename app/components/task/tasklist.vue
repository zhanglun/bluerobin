<style lang="sass">
.task-list-container{
	box-sizing: border-box;
	margin-top: 15px;
}
.task-list{
 	transform: perspective(1000px);
}
</style>

<template>
<div class="task-list-container">
	<ul class="task-list collapsible popout" data-collapsible="accordion">
	<li v-for="task in tasklist">
		<taskitem  :task="task" :index="$index"></taskitem>
	</li>
	</ul>
</div>
</template>

<script>
	import Proxy from '../../services/proxy.babel.js';
	import TaskItemView from './taskItem.vue';

	export default {
		data() {
			return {
				tasklist: []
			}
		},
		components: {
			taskitem: TaskItemView
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