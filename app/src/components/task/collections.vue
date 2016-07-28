<template>
 <div class="main-container" transition="animate_routerview">
  <div class="main">
    <div class="collection" v-for="item in collection">
      <div class="collection--title">{{item.name}}</div>
      <div class="tasklist">
        <task-item v-for="task in item.tasks" :task="task" :index="$index" track-by="id"></task-item>
      </div>
    </div>
  </div>
</div>
</template>
<script>
  import TaskItemView from './taskItem.vue';
  import * as tasksActions from '../../vuex/actions/tasks';
  import * as getters from '../../vuex/getter';
  export default {
    data() {
      return {
      };
    },
    route: {
      data(transition) {
        let name = this.$route.name;
        console.log(this.$route.name);
        let query = {};
        switch(name){
          case 'completed': {
            query = {
              completed: true,
              sort: '-update_time',
            };
            break;
          };
          case 'trash': {
            query = {
              istrash: true,
              sort: '-update_time',
            };
            break;
          };
          case 'search': {
            break;
          };
          default: {
            break;
          }
        }
        this.fetchTasks(query);
        transition.next();
      },
      activate(transition) {
        transition.next();
      },
      deactivate(transition) {
        transition.next();
      },
      canDeactivate() {
        return true;
      },
      canReuse() {
        return true;
      },
    },
    vuex: {
      actions: {
        fetchTasks: tasksActions.fetchTasks,
        resetTasks: tasksActions.resetTasks, // state.tasks还没有修改就切换了路由，导致会以之前路由对应的数据渲染一次。所以手动清空一次
      },
      getters: {
        tasks: getters.getTasks,
        auth: getters.getUserAuth,
      }
    },
    computed: {
      collection() {
        console.log('collection computed');
        let collection = [];
        let tasks = this.tasks;
        this.tasks.sort((a, b) =>{
          if(a.list_name > b.list_name) {
            return 1;
          }else if(a.list_name < b.list_name) {
            return -1;
          }else {
            return 0;
          }
        });
        let flag = 0;
        this.tasks.map((task,i) => {
          if(this.tasks[i + 1] && task.list_name !== this.tasks[i+1].list_name) {
            collection.push({
              name: task.list_name,
              count: i + 1 - flag,
              tasks: this.tasks.slice(flag, i+1),
            });
            flag = i+1;
          }
          if(i == this.tasks.length -1 ){
            collection.push({
              name: task.list_name,
              count: i + 1 - flag,
              tasks: this.tasks.slice(flag),
            });
          }
        });
        console.log(collection);
        return collection;
      },
    },
    watch: {
      auth: function(val) {
        if (!val) {
          this.$router.go('/login');
        }
      }
    },
    ready() {
      this.resetTasks();
    },
    components: {
      'task-item': TaskItemView,
    },
  };
</script>
<style lang="less">
  .collection {
    padding-top: 2px;
    &--title{
      font-size: 22px;
      padding: 10px 0;
    }
  }
  
</style>