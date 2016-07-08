<template>
  <div class="main" transition="animate_routerview">
    <taskinputer :listid="listId"></taskinputer>
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
</template>
<script>
  import TaskItemView from './taskItem.vue';
  import TaskInputer from './taskInputer.vue';
  import * as tasksActions from '../../vuex/actions/tasks';
  import * as getters from '../../vuex/getter';

  export default {
    route: {
      data(transition) {
        this.list_id = this.$route.params.id;
        var query = {
          list_id: this.list_id,
          completed: false,
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
        // return this.tasks.active;
        return this.tasks.active.filter((item) => {
          return item.list_id === this.list_id;
        });
      },
      completedTasklist() {
        // return this.tasks.completed;
        return this.tasks.completed.filter((item) => {
          return item.list_id === this.list_id;
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
      auth: function(val, old) {
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
      taskinputer: TaskInputer,
      taskitem: TaskItemView,
    },
    methods: {
      'loadCompletedTask'() {
        let param = {
          list_id: this.list_id,
          completed: true,
        };
        this.fetchTasks(param, () => {
          this.loaded = true;
        });
      },
      'toggleShowCompletedTask'() {
        if (!this.loaded) {
          this.loadCompletedTask();
        }
        console.log(this.completedTasklist);
        this.$data.completedShow = !this.$data.completedShow;
      },
    },
    events: {
      'edit task'(task) {
        let vm = this;
        vm.$http.put('tasks/' + task.id, task)
          .then(() => {
            console.log('edit task success!');
            if (task.completed) {
              vm.tasklist.$remove(task);
              vm.completedTasklist.unshift(task);
            } else {
              vm.completedTasklist.$remove(task);
              vm.tasklist.unshift(task);
            }
          });
      },
    },
  };
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
