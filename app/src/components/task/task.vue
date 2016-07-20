<template>
    <appheader></appheader>
    <div class="page-content">
      <sidemenu></sidemenu>
      <router-view ></router-view>
      <taskdetail :show="showDetail" :detail="taskDetail"></taskdetail>
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
        showDetail: false,
      };
    },
    vuex: {
      actions: {
        fetchLists: listsActions.fetchLists,
      },
      getters: {
        auth: getters.getUserAuth,
        // showDetail: getters.isShowDetail,
        taskDetail: getters.getTaskDetail,
      }
    },
    components: {
      appheader: HeaderView,
      sidemenu: SidemenuView,
      taskdetail: TaskDetailView,
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
