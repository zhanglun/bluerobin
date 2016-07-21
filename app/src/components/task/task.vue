<template>
    <app-header></app-header>
    <div class="page-content">
      <side-menu></side-menu>
      <router-view ></router-view>
      <task-detail></task-detail>
    </div>
</template>

<script>
  import HeaderView from '../header/header.vue';
  import SidemenuView from './sidemenu.vue';
  import TaskDetailView from './taskDetail.vue';

  import * as listsActions from '../../vuex/actions/lists';
  import * as getters from '../../vuex/getter';

  export default {
    data() {
      return {
      };
    },
    vuex: {
      actions: {
        fetchLists: listsActions.fetchLists,
      },
      getters: {
        auth: getters.getUserAuth,
      }
    },
    components: {
      'app-header': HeaderView,
      'side-menu': SidemenuView,
      'task-detail': TaskDetailView,
    },
    created() {
      this.fetchLists();
    },
    ready() {
    },

    methods: {
    },

  };

</script>
<style lang="less">
</style>
