<template>
    <div class="task-textfield">
      <input class="task-textfield__input" type="text" v-model="newTask.title" @keyup.enter="createTask(list_id)">
    </div>
</template>

<script>
import * as taskActions from '../../vuex/actions/tasks';
// import * as getters from '../../vuex/getter';

export default {
  data() {
    return {
      list_id: '',
      newTask: {
        title: '',
        list_id: '',
        create_time: '',
        attachments: []
      },
    };
  },
  vuex: {
    actions: {
      addTask: taskActions.addTask,
    },
  },
  watch: {
    'newTask.title': function() {
      localStorage.newTask = JSON.stringify(this.newTask);
    },
  },
  ready() {
    this.list_id = this.$route.params.id;
    this.newTask = window.localStorage.newTask ? JSON.parse(localStorage.newTask) : {};
  },

  methods: {
    // 创建任务
    createTask(listid) {
      if (!this.newTask.title) {
        return false;
      }

      this.$set('newTask.create_time', new Date());
      this.$set('newTask.list_id', listid);

      this.addTask(this.newTask);

      this.$set('newTask', {
        title: '',
        create_time: '',
        attachments: []
      });
    },
  }

};

</script>

<style lang="less">

@import '../../public/stylesheets/variables';

.modal.bottom-sheet{
  max-height: 60%;
}

.task-textfield{
  width: 100%;
  background: #fff;
  margin-bottom: 20px;
  box-sizing: border-box;
  &__input{
    width: 100%;
    height: 50px;
    font-size: 20px;
    padding: 6px 10px;
    box-sizing: border-box;
    border: none;
    outline: none;
    &:focus{
      box-shadow: 0 0 5px #ABABAB;
    }
  }
}

</style>
