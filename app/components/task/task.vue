cd <style lang="less">
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
	  <tasklist></tasklist>
  </div>
 	<taskinputer></taskinputer>
</template>

<script>
	import Proxy from '../../services/proxy.babel.js';
	import Vue from 'vue';
	import router from './../../route/index.js';
	import TaskList from './taskList.vue';
	import TaskInputer from './taskInputer.vue';


	export default {

	  data(){
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

	  ready(){
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
