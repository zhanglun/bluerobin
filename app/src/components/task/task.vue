<template>

    <appheader></appheader>
    <div class="page-content">
      <sidemenu></sidemenu>
      <router-view ></router-view>
    </div>

</template>

<script>
  import HeaderView from '../header/header.vue';
  import SidemenuView from './sidemenu.vue';

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
      appheader: HeaderView,
      sidemenu: SidemenuView,
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
