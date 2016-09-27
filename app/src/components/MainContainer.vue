<template>
  <main-header :list="currentList"></main-header>
  <div class="main-body" >
    <add-item :listid="listId" v-show="showInputer"></add-item>
    <div class="tasklist">
      <task-item v-for="task in tasklist" :task="task" :index="$index" track-by="id" :iscollection='isCollection'></task-item>
    </div>
    <div class="label-trigger" @click="toggleShowArchivedTask"  v-show="showInputer">
      显示已经归档的任务
    </div>
    <div class="loader" v-show="isRequestingTasks">
      <div class="loader-inner ball-clip-rotate-multiple">
        <div></div>
        <div></div>
      </div>
    </div>
    <div class="tasklist--finished" transition="animation_showtask" v-show="showArchived">
      <task-item v-for="task in archivedTasklist" :task="task" :index="$index" track-by="id"></task-item>
    </div>

  </div>
</template>
<script>
  import HeaderView from './Header.vue';
  import TaskItemView from './TaskItem.vue';
  import addItemView from './AddItem.vue';
  import * as tasksActions from '../vuex/actions/tasks';
  import * as getters from '../vuex/getter';

  export default {
    route: {
      data(transition) {
        let query = {};
        let id = this.$route.params.id;
        switch(id){
          case 'archive': {
            query = {
              archived: true,
              sort: 'desc',
              order: 'update_time',
            };
            this.isCollection = true;
            break;
          };
          case 'trash': {
            query = {
              istrash: true,
              sort: 'desc',
              order: 'update_time',
            };
            this.isCollection = true;
            break;
          };
          case 'search': {
            break;
          };
          default: {
            this.list_id = id;
            this.showInputer = true;
            query = {
              list_id: this.list_id,
              archived: false,
              sort: 'desc',
              order: 'create_time',
              istrash: false,
            };

            break;
          }
        }
        this.fetchTasks(query);
        transition.next();
      },
      activate(transition) {
        // 每次切换路由时
        let id = this.$route.params.id;
        if(id == 'archive'){
          this.currentList = {
            name: '归档'
          };
        } else if(id == 'trash') {
          this.currentList = {
            name: '回收站'
          };
        } else {
          this.currentList = this.lists.filter((list) => {
            return list.id === id;
          })[0];
        }
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
        isRequestingTasks: getters.isRequestingTasks,
        auth: getters.getUserAuth,
        lists: getters.getLists,

      }
    },
    computed: {
      tasklist() {
        var result = null;
        var id = this.$route.params.id;
        if(id == 'archive') {
          result = this.tasks.filter((task) => {
            return task.archived && !task.istrash;
          });
        } else if(id == 'trash') {
          result = this.tasks.filter((task) => {
            return task.istrash;
          });
        } else {
          result = this.tasks.filter((item) => {
            return item.list_id === this.list_id && !item.archived;
          });
        }
        result.sort((a, b) => {
          if (a.list_name > b.list_name) {
            return 1;
          } else if (a.list_name < b.list_name) {
            return -1;
          } else {
            return 0;
          }
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
        showInputer: false,
        loaded: false,
        currentList: {},
      };
    },
    watch: {
      auth: function(val) {
        if (!val) {
          this.$router.go('/login');
        }
      },
      lists() {
        let currentListId = this.$route.params.id;
        if(currentListId == 'archive'){
          this.currentList = {
            name: '归档'
          };
        } else if(currentListId == 'archive') {
          this.currentList = {
            name: '回收站'
          };
        }else {
          this.currentList = this.lists.filter((list) => {
            return list.id === currentListId;
          })[0];
        }
      }
    },
    created() {

    },
    ready() {

      this.resetTasks();
    },
    components: {
      'main-header': HeaderView,
      'add-item': addItemView,
      'task-item': TaskItemView,
    },
    methods: {
      'loadArchivedTask'() {
        let param = {
          list_id: this.list_id,
          archived: true,
          sort: 'update_time',
          order: 'desc',
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
  @import '../public/stylesheets/variables';

  @labelTriggerBg: #d8d8d8;

  .main-body {
    padding: 14px;
    width: 100%;
    min-height: 100%;
    overflow-y: auto;
    box-sizing: border-box;
    flex: 1 1 auto;
    overflow-y: auto;
  }
  .tasklist {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .label-trigger {
    display: inline-block;
    margin: 10px 0;
    padding: 4px 8px;
    background: fade(@labelTriggerBg, 80%);
    cursor: pointer;
    &:hover{
      background: @labelTriggerBg;
    }
  }
</style>
