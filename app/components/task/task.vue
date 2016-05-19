<style lang="less">
</style>

<template>
  <div class="custom-container" transition="animate_routerview">
    <div class="mdl-grid">
      <h1>{{$route.params.category}}</h1>
      <taskinputer :category="category"></taskinputer>
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
        category: '',
        taskOpened: null,
	  	}
	  },

    route: {
      data(transition){

        console.log('data!!!!!------>', this.$route);
          var param = null;
          this.$data.category = this.$route.params.category;
          param = {
            category: this.$data.category
          };

          return this.$http.get('tasks', param)
            .then(function(res){
              return {tasklist: res.data}
          });
       },
      activate(transition) {
        // console.log('hook-example activated!')
        transition.next()
      },
      deactivate(transition) {
        // console.log('hook-example deactivated!')
        transition.next()
      },
      canDeactivate(transitio){
        console.log('can deactivated!');
        // transition.next();
        return true;
      },
      canReuse(transition){
      }
    },

	  components: {
			taskitem: TaskItemView,
	    taskinputer: TaskInputer,
	  },

	  ready(){
      console.log(location.href);
			// this.getTaskList();
	  },

	  methods: {
			getTaskList() {
				let vm = this;
				vm.$http
					.get('tasks', {category: this.$route.params.category})
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
