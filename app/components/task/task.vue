<style lang="less">
	.task-container{
		max-width:860px;
		min-width: 600px;
		margin: 30px auto;
		height: 65%;
		box-sizing: border-box;
	}
</style>

<template>
  <div class="task-container" transition="animate_routerview">
		<div class="task-list-container">
				<taskitem v-for="task in tasklist" :task="task" :index="$index"></taskitem>
		</div>
	 	<taskinputer></taskinputer>
  </div>
</template>

<script>
	import TaskItemView from './taskItem.vue';
	import TaskInputer from './taskInputer.vue';


	export default {

	  data(){
	  	return {
		  	value: '',
		  	tasklist: [],
        taskOpened: null,
	  	}
	  },

	  components: {
			taskitem: TaskItemView,
	    taskinputer: TaskInputer,
	  },

	  ready(){
			this.getTaskList();
	  },

	  methods: {
			getTaskList() {
				let vm = this;
				vm.$http
					.get('tasks')
					.then(function(res){
						vm.tasklist = res.data;
					});
			}
	  },
	  events: {
			'create task': function(task){
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
        vm.$http.put('task/' + task.id)
				  .then(function(res){
					 console.log('edit task success!');
				  });
			}
	  }
	};

</script>
