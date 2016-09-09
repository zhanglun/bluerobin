<template>
  <div>
<!--   <div class="loading" v-if="!finished">
    <h1>loading...</h1>
  </div> -->
    <router-view></router-view>
    <script type="x-template" id="modal-template">
      <div class="modal-mask" v-if="show" transition="modal-animation_default">
        <div class="modal-wrapper">
          <div class="modal-container">
            <slot name="content"></slot>
          </div>
        </div>
      </div>
    </script>
  </div>
</template>

<script>
  import Vue from 'vue';
  import SideMenuView from './task/sidemenu.vue';
  import store from '../vuex/store';

  import * as userActions from '../vuex/actions/user';
  import * as getters from '../vuex/getter';

  // 创建 modal 组件
  Vue.component('modal', {
    template: "#modal-template",
    props: [
      'show',
    ],
  });

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
    components: {
      sidemenu: SideMenuView,
    },
    store: store,
  };
</script>

<style lang="less">
  #app{
    min-height: 100%;
    height: 100%;
  }
  .page-content{
    padding-top: 60px;
    min-height: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    overflow: hidden;
  }
  .animate_routerview-transition{
    transition: all 0.4s ease;
  }
  .animate_routerview-enter, .animate_routerview-leave{
    opacity: 0;
    height:0;
    transform: translate3d(20px, 0, 0);
  }
  .loading{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    background: #f1f1f1;
    z-index: 100;
    height: 100%;
  }

</style>
