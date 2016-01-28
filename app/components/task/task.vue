<style lang="sass">
	.task-container{
		max-width:660px;
		min-width: 500px;
		margin: 80px auto;
		height: 65%;
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
		  	taskList: TaskList,
        taskOpened: null,
	  	}
	  },

	  components: {
	    tasklist: TaskList,
	    taskinputer: TaskInputer,
	  },

	  ready: function(){
	  },

	  methods: {

	  },
	  events: {
	  	'create task': function(task){
	  		this.$broadcast('add task', task);
	  	},
	  	'delete task': function(task){
	  		this.$broadcast('delete task', task);
	  	},
	  	'edit task': function(task){
	  		this.$broadcast('edit task', task);
	  	},
	  }
	};

</script>
