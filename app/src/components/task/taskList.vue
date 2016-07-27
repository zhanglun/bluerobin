<template>
  <div class="main-container" transition="animate_routerview">
    <div class="main" v-if="!showCollections">
      <add-item :listid="listId"></add-item>
      <div class="tasklist">
        <task-item v-for="task in tasklist" :task="task" :index="$index" track-by="id"></task-item>
      </div>
      <div class="label-trigger" @click="toggleShowCompletedTask">
        显示已完成的task
      </div>
      <div class="tasklist--finished" transition="animation_showtask" v-show="completedShow">
        <taskitem v-for="task in completedTasklist" :task="task" :index="$index" track-by="id"></taskitem>
      </div>
    </div>
    <div class="main" v-if="showCollections">
      <div class="collection" v-for="item in collection">
        <h5>{{item.name}} count: {{item.count}}</h5>
        <div class="tasklist">
          <task-item v-for="task in item.tasks" :task="task" :index="$index" track-by="id"></task-item>
        </div>
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
        let query = {};
        let name = this.$route.name;
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
          case 'list': {
            this.list_id = this.$route.params.id;
            query = {
              list_id: this.list_id,
              completed: false,
              sort: '-update_time',
            };
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
      collection() {
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
    data() {
      return {
        list_id: '',
        completedShow: false,
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
      console.log('list');
      if(this.$route.name == 'list') {
        this.showCollections = false;
      }else {
        this.showCollections = true;
      }
    },
    components: {
      'add-item': addItemView,
      'task-item': TaskItemView,
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
  };
</script>
<style lang="less">
  @import '../../public/stylesheets/variables';

  @labelTriggerBg: #d8d8d8;

  .main-container {
    padding-left: @sidemenu-width + 20;
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
