<template>
  <div class="">
    <appheader :account="account"></appheader>
    <div class="page-content">
      <p>
        {{currentState}}
      </p>
      <button type="button" name="button" @click="changeState">test</button>
      <router-view ></router-view>
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

  import { createStore } from 'redux';
  import reducers from '../reducers';
  import { changeMyState } from '../actions';
  console.log(changeMyState);

  import TaskMenu from './task/taskmenu.vue';
  import HeaderView from './header/header.vue';

  // 创建 modal 组件
  Vue.component('modal', {
    template: "#modal-template",
    props: [
      'show',
    ],
  });

  export default {
    data() {
      return {
        msg: 'Hello from BlueRobin',
        account: {},
        lists: [],
        store: createStore(reducers),
        currentState: '',
      };
    },
    created() {
      this.store.subscribe(() => {
        console.log(this.store.getState().tasks);
        this.currentState = this.store.getState().tasks.currentState;
      });
    },
    ready() {
      console.log(this.store.getState().tasks);
      this.currentState = this.store.getState().tasks.currentState;
      this.$http.get('authenticate')
        .then((res) => {
          this.$data.account = res.data.user;
        }, () => {
          this.$data.account = false;
          this.$router.go('/login');
        });
    },
    methods: {
      changeState() {
        const nextState = '新しい状態';
        this.store.dispatch(changeMyState(nextState));
      }
    },
    components: {
      appheader: HeaderView,
      taskmenu: TaskMenu,
    },
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
  //  modal
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
  }

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  .modal-container {
    width: 300px;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
  }

  .modal-header h3 {
    margin-top: 0;
    color: #42b983;
  }

  .modal-body {
    margin: 20px 0;
  }

  .modal-default-button {
    float: right;
  }
  /*
  * the following styles are auto-applied to elements with
  * v-transition="modal" when their visiblity is toggled
  * by Vue.js.
  *
  * You can easily play with the modal transition by editing
  * these styles.
  */

  .modal-enter, .modal-leave {
  opacity: 0;
  }

  .modal-enter .modal-container,
  .modal-leave .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
    }

</style>
