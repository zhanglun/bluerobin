<template>
  <div class="">
      <taskmenu></taskmenu>
      <router-view></router-view>
  </div>
</template>

<script>
  import TaskMenuView from './taskmenu.vue';
  import CategoryView from './category.vue';

  import * as getters from '../../vuex/getter';

  export default {
    data() {
      return {
      };
    },
    vuex: {
      actions: {
        // fetchTasks: tasksActions.fetchTasks,
      },
      getters: {
        // tasks: getters.getTasks,
        auth: getters.getUserAuth,
      }
    },
    components: {
      taskmenu: TaskMenuView,
      category: CategoryView,
    },
    created() {
    },
    ready() {
    },

    methods: {
    },

  };

</script>
<style lang="less">
</style>
