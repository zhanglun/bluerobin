<style lang="less">
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

<template>
  <div class="">
    <appHeader :account="account"></appHeader>
    <div class="page-content">
      <router-view ></router-view>
    </div>
    <script type="x-template" id="modal-template">
      <div class="modal-mask" v-show="show" transition="modal">
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
  import Uploader from '../services/upload.babel.js';
  import TaskView from './task/task.vue';
  import HomeView from './home/home.vue';
  import AppHeaderView from './header/header.vue';

  // 创建 modal 组件
  Vue.component('modal', {
    template: "#modal-template",
    props: ['show'],
  });


  export default{
    data(){
      return {
        msg: 'Hello from BlueRobin',
        account: {}
      }
    },
    ready(){

      componentHandler.upgradeDom();

      var vm = this;
      vm.$http.get('authenticate')
        .then(function(res){
          console.log(res.data);
          vm.$data.account = res.data.user;
        }, function(err){
          vm.$data.account = false;
          vm.$router.go('/login');
        });


    },
    components: {
      // task: TaskView,
      appheader: AppHeaderView
    }
  }
</script>

<style lang="less">
  .page-content{
    padding-top: 80px;
  }
</style>
