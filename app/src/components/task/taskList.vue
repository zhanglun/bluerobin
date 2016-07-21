<template>
  <div class="main-container" transition="animate_routerview">
    <div class="main">
      <additem :listid="listId"></additem>
      <div class="tasklist">
        <taskitem v-for="task in tasklist" :task="task" :index="$index" track-by="id"></taskitem>
      </div>
      <div class="label-trigger" @click="toggleShowCompletedTask">
        显示已完成的task
      </div>
      <div class="tasklist--finished" transition="animation_showtask" v-show="completedShow">
        <taskitem v-for="task in completedTasklist" :task="task" :index="$index" track-by="id"></taskitem>
      </div>
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
        this.list_id = this.$route.params.id;
        var query = {
          list_id: this.list_id,
          completed: false,
          sort: '-update_time',
        };
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
      },
      getters: {
        tasks: getters.getTasks,
        auth: getters.getUserAuth,
      }
    },
    computed: {
      tasklist() {
        let result = this.tasks.filter((item) => {
          return item.list_id === this.list_id && !item.completed;
        });
        return result;
      },
      completedTasklist() {
        return this.tasks.filter((item) => {
          return item.list_id === this.list_id && item.completed;
        });
      },
    },
    data() {
      return {
        list_id: '',
        completedShow: false,
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
    },
    components: {
      additem: addItemView,
      taskitem: TaskItemView,
    },
    methods: {
      'loadCompletedTask'() {
        let param = {
          list_id: this.list_id,
          completed: true,
          sort: '-update_time',
        };
        this.fetchTasks(param, () => {
          this.loaded = true;
        });
      },
      'toggleShowCompletedTask'() {
        if (!this.loaded) {
          this.loadCompletedTask();
        }
        this.$data.completedShow = !this.$data.completedShow;
      },
    },
    // events: {
    //   'edit task'(task) {
    //     let vm = this;
    //     vm.$http.put('tasks/' + task.id, task)
    //       .then(() => {
    //         console.log('edit task success!');
    //         if (task.completed) {
    //           vm.tasklist.$remove(task);
    //           vm.completedTasklist.unshift(task);
    //         } else {
    //           vm.completedTasklist.$remove(task);
    //           vm.tasklist.unshift(task);
    //         }
    //       });
    //   },
    // },
  };
</script>
<style lang="less">
  @import '../../public/stylesheets/variables';

  @labelTriggerBg: #d8d8d8;

  .main-container {
    padding-left: @sideMenuWidth + 20;
    padding-right: 20px;
    width: 100%;
    box-sizing: border-box;
  }
  .main {
    // max-width: 980px;
    // margin: 0 auto;
  }
  .tasklist {
    display: flex;
    flex-wrap: wrap;
  }
  .label-trigger {
    display: inline-block;
    margin: 6px 0;
    padding: 6px 12px;
    background: fade(@labelTriggerBg, 80%);
    cursor: pointer;
    &:hover{
      background: @labelTriggerBg;
    }
  }
</style>
