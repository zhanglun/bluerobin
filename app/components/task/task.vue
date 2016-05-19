<style lang="less">
</style>

<template>
  <div class="custom-container" transition="animate_routerview">
    <div class="mdl-grid">
    <taskinputer></taskinputer>
      <div class="mdl-cell mdl-cell--12-col">
        <taskitem v-for="task in tasklist" :task="task" :index="$index"></taskitem>
      </div>
    </div>
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

    // route: {
    //    data: function(transition){
    //      console.log('data!!!!!------>');
    //    },
    //   activate: function (transition) {
    //     console.log('hook-example activated!')
    //     transition.next()
    //   },
    //   deactivate: function (transition) {
    //     console.log('hook-example deactivated!')
    //     transition.next()
    //   },
    //   canDeactivate: function(transitio){
    //     console.log('can deactivated!');
    //     // transition.next();
    //     return true;
    //   },
    //   canReuse: function(transition){
    //     console.log(transition);
    //     return true;
    //   }
    // },

	  components: {
			taskitem: TaskItemView,
	    taskinputer: TaskInputer,
	  },

	  ready(){
      console.log(location.href);
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
              setTimeout(function() {
                componentHandler.upgradeDom('MaterialCheckbox');
              }, 0);
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
				let vm = this;
        vm.$http.put('tasks/' + task.id, task)
				  .then(function(res){
					 console.log('edit task success!');
				  });
			}
	  }
	};

</script>
