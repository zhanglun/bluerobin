<template>
  <div class="">
    <appheader :account="account"></appheader>
    <div>
      Clicked: {{ count }} times
      <button v-on:click="increment">+</button>
      <button v-on:click="decrement">-</button>
    </div>
    <div class="page-content">
      <router-view :store="store"></router-view>
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
  import TaskMenu from './task/taskmenu.vue';
  import HeaderView from './header/header.vue';
  import store from '../vuex/store';

  import { incrementCounter } from '../vuex/actions';
  console.log(incrementCounter);
  // import { fetchLists } from '../actions/lists';

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
        incrementCounter: incrementCounter,
      }
    },
    data() {
      return {
        msg: 'Hello from BlueRobin',
        account: {},
        lists: [],
      };
    },
    created() {
      console.log('get auth');
    },
    ready() {
      this.increment();
      this.$http.get('authenticate')
        .then((res) => {
          this.$data.account = res.data.user;
        }, () => {
          this.$data.account = false;
          this.$router.go('/login');
        });
    },
    methods: {
      increment() {
        console.log('increment');
      },
    },
    components: {
      appheader: HeaderView,
      taskmenu: TaskMenu,
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
