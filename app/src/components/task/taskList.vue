<template>
  <div class="main" >
    <add-item :listid="listId"></add-item>
    <div class="tasklist">
      <task-item v-for="task in tasklist" :task="task" :index="$index" track-by="id"></task-item>
    </div>
    <div class="label-trigger" @click="toggleShowArchivedTask">
      显示当前清单下已经归档的任务
    </div>
    <div class="tasklist--finished" transition="animation_showtask" v-show="showArchived">
      <task-item v-for="task in archivedTasklist" :task="task" :index="$index" track-by="id"></task-item>
    </div>
  </div>
</template>
<script>
  import TaskItemView from './taskItem.vue';
  import addItemView from './addItem.vue';
  import * as tasksActions from '../../vuex/actions/tasks';
  import * as getters from '../../vuex/getter';

  export default {
    route: {
      data(transition) {
        let query = {};
        let name = this.$route.name;
        switch(name){
          case 'archived': {
            query = {
              archived: true,
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
          case 'list': {
            this.list_id = this.$route.params.id;
            query = {
              list_id: this.list_id,
              archived: false,
              sort: '-create_time',
            };
          };
          default: {
            break;
          }
        }
        query.istrash = false;
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
        return false;
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
      tasklist() {
        let result = this.tasks.filter((item) => {
          return item.list_id === this.list_id && !item.archived;
        });
        return result;
      },
      archivedTasklist() {
        return this.tasks.filter((item) => {
          return item.list_id === this.list_id && item.archived;
        });
      },
    },
    data() {
      return {
        list_id: '',
        showArchived: false,
        showCollections: false,
        loaded: false,
      };
    },
    watch: {
      auth: function(val) {
        if (!val) {
          this.$router.go('/login');
        }
      }
    },
    created() {

    },
    ready() {
      this.resetTasks();
    },
    components: {
      'add-item': addItemView,
      'task-item': TaskItemView,
    },
    methods: {
      'loadArchivedTask'() {
        let param = {
          list_id: this.list_id,
          archived: true,
          sort: '-update_time',
        };
        this.fetchTasks(param, () => {
          this.loaded = true;
        });
      },
      'toggleShowArchivedTask'() {
        if (!this.loaded) {
          this.loadArchivedTask();
        }
        this.$data.showArchived = !this.$data.showArchived;
      },
    },
  };
</script>
<style lang="less">
  @import '../../public/stylesheets/variables';

  @labelTriggerBg: #d8d8d8;

  .main {
    padding: 0 10px 10px;
    width: 100%;
    min-height: 100%;
    overflow-y: auto;
    box-sizing: border-box;
  }
  .tasklist {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .label-trigger {
    display: inline-block;
    margin: 6px 0;
    padding: 4px 8px;
    background: fade(@labelTriggerBg, 80%);
    cursor: pointer;
    &:hover{
      background: @labelTriggerBg;
    }
  }
</style>
