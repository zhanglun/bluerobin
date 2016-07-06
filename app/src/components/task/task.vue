<template>
  <div class="">
      <taskmenu></taskmenu>
      <router-view></router-view>
  </div>
</template>

<script>
  import TaskMenuView from './taskmenu.vue';
  import CategoryView from './category.vue';

  export default {
    data() {
      return {
      };
    },

    components: {
      taskmenu: TaskMenuView,
      category: CategoryView,
    },

    ready() {
    },

    methods: {
    },

  };

</script>
<style lang="less">
</style>
