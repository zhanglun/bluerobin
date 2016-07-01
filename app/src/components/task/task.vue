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
    props: ['store'],
    data() {
      return {
        value: '',
        // lists: [],
        category: '',
        taskOpened: null,
        text: '',
      };
    },

    // route: {
    //   data(transition) {
    //     transition.next();
    //   },
    //   activate(transition) {
    //     transition.next();
    //   },
    //   deactivate(transition) {
    //     transition.next();
    //   },
    //   canDeactivate() {
    //     return true;
    //   },
    //   canReuse() {
    //     return true;
    //   },

    // },

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
