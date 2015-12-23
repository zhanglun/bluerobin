<style lang="sass">
	
</style>

<template>
	<div class="task-container">
		<taskinputer></taskinputer>
		<tasklist></taskist>
	</div>
</template>

<script>
	var Vue = require('vue');
	var TaskList = require('./taskList.vue');
	var TaskInputer = require('./taskInputer.vue');

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
