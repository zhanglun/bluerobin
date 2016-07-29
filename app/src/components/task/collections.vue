<template>
 <div class="main-container" transition="animate_routerview">
  <div class="main">
    <div class="tasklist">
    <task-item v-for="task in tasks" :task="task" :index="$index" :iscollection="true" track-by="id"></task-item>
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
    },
    watch: {
      auth: function(val) {
        if (!val) {
          this.$router.go('/login');
        }
      }
    },
    ready() {
      // this.resetTasks();
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