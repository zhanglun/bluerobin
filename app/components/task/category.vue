<template>
	<div class="main" transition="animate_routerview">
    <taskinputer :category="category"></taskinputer>
    <div class="tasklist">
			<taskitem v-for="task in tasklist" :task="task" :index="$index" track-by="$index"></taskitem>
    </div>
		<div class="label-trigger" @click="toggleShowCompletedTask">
			显示已完成的task
		</div>
		<div class="tasklist--finished" v-show="completedShow">
			<taskitem v-for="task in completedTasklist" :task="task" :index="$index" track-by="$index"></taskitem>
		</div>
	</div>
</template>
<script>

	import TaskItemView from './taskItem.vue';
	import TaskInputer from './taskInputer.vue';

	export default {
		route: {
      data(transition){

        let param = null;
        this.$data.category = this.$route.params.category;
        param = {
          category: this.$data.category,
					completed: false,
        };

        return this.$http.get('tasks', param)
          .then(function(res){
            return {tasklist: res.data}
        });
       },
      activate(transition) {
        transition.next()
      },
      deactivate(transition) {
        transition.next()
      },
      canDeactivate(transitio){
        return true;
      },
      canReuse(transition){
      }
    },

		data(){
			return {
		  	tasklist: [],
        category: '',
				completedTasklist: [],
				completedShow: false,
			}
		},
		components: {
			taskinputer: TaskInputer,
			taskitem: TaskItemView,
		},
		methods: {
			'loadCompletedTask'(){
          let param = {
						category: this.$data.category,
						completed: true,
					};
					let vm = this;
					this.$http.get('tasks', param)
					.then(function(res){
						vm.$data.completedTasklist = res.data;
					}, function(err){

					});
			},
			'toggleShowCompletedTask'(){

				if(this.$data.completedShow){
				}else{
					this.loadCompletedTask();
				}
				this.$data.completedShow = !this.$data.completedShow;
			}
		},
		events: {
			'create task'(task){
				let vm = this;
        vm.$http.post('tasks', task)
          .then(function(res){
            vm.tasklist.unshift(res.data);
              setTimeout(function() {
                componentHandler.upgradeDom('MaterialCheckbox');
              }, 0);
          });
			},
			'delete task'(task){
				let vm = this;
				vm.$http.delete('tasks/' +  task.id)
     		.then(function(){
	     		vm.tasklist.$remove(task);
     		});
			},
			'edit task'(task){
				let vm = this;
        vm.$http.put('tasks/' + task.id, task)
				  .then(function(res){
					 console.log('edit task success!');
					 if(task.completed){
						 vm.tasklist.$remove(task);
						 vm.completedTasklist.unshift(task);
					 }else{
						 vm.completedTasklist.$remove(task);
						 vm.tasklist.unshift(task);
					 }
				  });
			}
	  }
	}
</script>
<style lang="less">
	@import '../../public/stylesheets/variables';

	@labelTriggerBg: #d8d8d8;

	.main{
		padding-left: @sideMenuWidth;
		padding-right: 100px;
		width: 100%;
		box-sizing: border-box;
		// margin: 0 auto;
	}
	.label-trigger{
		// display: inline-block;
		margin: 6px 0;
		padding: 6px 12px;
		background: fade(@labelTriggerBg, 80%);
		cursor: pointer;
		&:hover{
			background: @labelTriggerBg;
		}
	}
</style>
