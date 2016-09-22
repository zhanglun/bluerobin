<template>
  <div class="app">
    <router-view ></router-view>
  </div>
</template>

<script>
  import Vue from 'vue';
  import store from '../vuex/store';

  import * as userActions from '../vuex/actions/user';
  import * as getters from '../vuex/getter';


  export default {
    vuex: {
      actions: {
        authenticate: userActions.authenticate,
      },
      getters: {
        user: getters.getUserInfo,
        lists: getters.getLists,
      }
    },
    data() {
      return {
        msg: 'Hello from BlueRobin',
        finished: false,
      };
    },
    computed: {
    },
    watch: {
      lists() {
        let firstId = '';
        let toId = '';
        if(this.lists && this.lists.length) {
          firstId = this.lists[0].id;
        }
        toId = this.$route.params.id || firstId;
        this.$router.go({name: 'list', params: {id: toId}});
        this.finished = true;
      }
    },
    created() {
      this.authenticate((user) => {
        if (user) {
           this.$router.go('/lists');
        } else {
          this.$router.go('/login');
        }
      });
    },
    ready() {
    },
    methods: {
    },

    store: store,
  };
</script>

<style lang="less">

</style>
