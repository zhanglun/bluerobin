<template>
  <div class="">
      <taskmenu :lists="lists"></taskmenu>
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
        lists: [],
        category: '',
        taskOpened: null,
        text: '',
      };
    },

    route: {
      data(transition) {
        // console.log('data!!!!!------>', this.$route);
        transition.next();
      },
      activate(transition) {
        // console.log('hook-example activated!')
        transition.next();
      },
      deactivate(transition) {
        // console.log('hook-example deactivated!')
        transition.next();
      },
      canDeactivate() {
        console.log('can deactivated!');
        // transition.next();
        return true;
      },
      canReuse() {
        return true;
      },

    },

    components: {
      taskmenu: TaskMenuView,
      category: CategoryView,
    },

    ready() {
      this.store.subscribe(() => {
        this.lists = this.store.getState().lists.lists;
      });
    },

    methods: {
    },

  };

</script>
<style lang="less">
</style>
