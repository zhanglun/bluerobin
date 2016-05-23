<template>
	<div class="mdl-grid main" transition="animate_routerview">
    <taskinputer :category="category"></taskinputer>		
    <taskitem v-for="task in tasklist" :task="task" :index="$index"></taskitem>
	</div>
</template>
<script>
	
	import TaskItemView from './taskItem.vue';
	import TaskInputer from './taskInputer.vue';

	export default{
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

		data(){
			return {
		  	tasklist: [],
        category: '',
			}
		},
		components: {
			taskinputer: TaskInputer,
			taskitem: TaskItemView,
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
	}
</script>
<style lang="less">
	@import '../../public/stylesheets/variables';
	.main{
		margin-left: @sideMenuWidth;
		max-width: 800px;
	}	
</style>