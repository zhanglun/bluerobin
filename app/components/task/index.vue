<style lang="sass">
	.task-container{
		max-width:660px;
		min-width: 500px;
		margin: 0px auto;
		box-sizing: border-box;
	}
</style>

<template>
  <div class="task-container" transition="animate_routerview">
	  <taskinputer></taskinputer>
	  <tasklist></tasklist>
  </div>
</template>

<script>

	import Vue from 'vue';
	import TaskList from './taskList.vue';
	import TaskInputer from './taskInputer.vue';


	module.exports = {

	  data: function(){
	  	return {
		  	value: '',
		  	taskList: TaskList
	  	}
	  },

	  components: {
	    tasklist: TaskList,
	    taskinputer: TaskInputer
	  },

	  ready: function(){
	  	console.log('tasklistbbb');
	  },

	  methods: {

	  },
	  events: {
	  	'create task': function(task){
	  		console.log('components: App 收到了 来自 taskinputer 的数据');
	  		this.$broadcast('add task', task);
	  	},
	  	'delete task': function(task){
	  		console.log('components: App 收到了 来自 Task 的消息');
	  		this.$broadcast('delete task', task);
	  	},
	  	'edit task': function(task){
	  		console.log('task !edit!!!------------!!!');
	  		this.$broadcast('edit task', task);
	  	}
	  }
	};

</script>
