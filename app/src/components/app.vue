<template>
  <div>
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
      }
    },
    data() {
      return {
        msg: 'Hello from BlueRobin',
      };
    },
    computed: {

    },
    created() {
      this.authenticate((user) => {
        if (user) {
          this.$router.go('/lists');
        } else {
          console.log('login first, please!');
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
    height: 100%;
    min-height: 100%;
  }
  .page-content{
    // display: flex;
    padding-top: 80px;
    padding-bottom: 50px;
    min-height: 100%;
    height: 100%;
    box-sizing: border-box;
  }
  // .app{
  //   height: 100%;
  //   position: absolute;
  //   left: 0;
  //   right: 0;
  //   bottom: 0;
  //   top: 0;
  // }
  .animate_routerview-transition{
    transition: all 0.4s ease;
  }
  .animate_routerview-enter, .animate_routerview-leave{
    opacity: 0;
    height:0;
    transform: translate3d(20px, 0, 0);
  }

</style>
