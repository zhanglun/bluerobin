<template>
  <div class="">
    	<taskmenu :lists="lists"></taskmenu>
    	<router-view></router-view>
  </div>
</template>

<script>

	import TaskMenuView from './taskmenu.vue';
	import CategoryView from './category.vue';

	export default {

	  data(){
	  	return {
		  	value: '',
		  	lists: [],
        category: '',
        taskOpened: null,
	  	}
	  },

    route: {
      data(transition){
        // console.log('data!!!!!------>', this.$route);
          transition.next();
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
        return true;
      }

    },

	  components: {
			taskmenu: TaskMenuView,
	    category: CategoryView,
	  },

	  ready(){
      console.log(location.href);
			this.$http.get('lists')
        .then(res => {
          this.lists =  res.data;
      });
	  },

	  methods: {
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
<style lang="less">
</style>
