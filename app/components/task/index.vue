<style lang="sass">
	.task-container{
		max-width:660px;
		min-width: 500px;
		margin: 0 auto;
		box-sizing: border-sizing;
	}
</style>

<template>
	<div class="task-container">
		<taskinputer></taskinputer>
		<tasklist></taskist>
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
	  },

	  methods: {

	  },
	  events: {
	  	'create new task': function(data){
	  		console.log('components: App 收到了 来自 taskinputer 的数据');
	  		this.$broadcast('add new task', data);
	  	}
	  }
	};

</script>
