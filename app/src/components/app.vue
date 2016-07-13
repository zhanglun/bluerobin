<template>
  <div class="">
    <appheader></appheader>
    <div class="page-content">
      <router-view></router-view>
    </div>
    <script type="x-template" id="modal-template">
      <div class="modal-mask" v-if="show" transition="modal">
        <div class="modal-wrapper">
          <div class="modal-container">

            <div class="modal-header">
              <slot name="header">
                default header
              </slot>
            </div>

            <div class="modal-body">
              <slot name="body">
                default body
              </slot>
            </div>

            <div class="modal-footer">
              <slot name="footer">
                default footer
                <button class="modal-default-button"
                  @click="show = false">
                  OK
                </button>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </script>
  </div>
</template>

<script>
  import Vue from 'vue';
  import SideMenuView from './task/sidemenu.vue';
  import HeaderView from './header/header.vue';
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
          this.$router.go('lists');
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
      appheader: HeaderView,
      sidemenu: SideMenuView,
    },
    store: store,
  };
</script>

<style lang="less">
  .page-content{
    padding-top: 80px;
  }
  .app{
    height: 100%;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
  }
  .animate_routerview-transition{
    transition: all 0.4s ease;
  }
  .animate_routerview-enter, .animate_routerview-leave{
    opacity: 0;
    height:0;
    transform: translate3d(20px, 0, 0);
  }

</style>
