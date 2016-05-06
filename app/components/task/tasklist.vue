<style lang="less">
.task-list-container{
	box-sizing: border-box;
	margin-top: 15px;
 	transform: perspective(1000px);
}
</style>

<template>
<div class="task-list-container">
		<taskitem v-for="task in tasklist" :task="task" :index="$index"></taskitem>
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
			getTaskList() {
				var vm = this;
				vm.$http.get('tasks')
					.then(function(res){
						vm.tasklist = res.data;
					});
			}
		},
		events: {
			'add task': function(task){
				let vm = this;
        vm.$http.post('tasks', task)
          .then(function(res){
            vm.tasklist.unshift(res.data);
          });
			},
			'delete task': function(task){
				let vm = this;
				vm.$http.delete('tasks/' +  task.id)
     		.then(function(){
	     		vm.tasklist.$remove(task);
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
