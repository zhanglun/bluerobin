<style lang="less">
	.task-container{
		max-width:660px;
		min-width: 500px;
		margin: 30px auto;
		height: 65%;
		box-sizing: border-box;
	}
</style>

<template>
 <ul class="collapsible popout" data-collapsible="accordion">
    <li>
      <div class="collapsible-header"><i class="material-icons">filter_drama</i>First</div>
      <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
    </li>
    <li>
      <div class="collapsible-header"><i class="material-icons">place</i>Second</div>
      <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
    </li>
    <li>
      <div class="collapsible-header"><i class="material-icons">whatshot</i>Third</div>
      <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
    </li>
  </ul>
	
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

	  	// router.go('/login');
    $('.dropdown-button').dropdown();
    $('.collapsible').collapsible({
      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });

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
