<template>
  <div class="">
      {{text}}
      <taskmenu :lists="lists"></taskmenu>
      <router-view></router-view>
  </div>
</template>

<script>
  import TaskMenuView from './taskmenu.vue';
  import CategoryView from './category.vue';

  // import { loadLists } from '../../actions';

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
        this.text = this.store.getState().tasks.text;
      });
      this.$http.get('lists')
        .then(res => {
          this.lists = res.data;
          // this.store.dispatch(fet(res.data));
        });
    },

    methods: {
    },

  };

</script>
<style lang="less">
</style>
