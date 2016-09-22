<template>
    <div class="page-content">
      <router-view ></router-view>
      <task-detail v-if="show" transition="animation-showtaskdetail"></task-detail>
    </div>
</template>
<script>
  import TaskDetailView from './TaskDetail.vue';

  import * as listsActions from '../vuex/actions/lists';
  import * as getters from '../vuex/getter';

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
        show: getters.isShowDetail,
        auth: getters.getUserAuth,
      }
    },
    components: {
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
