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
  <div class="app">
      <appHeader :account="account"></appHeader>
      <router-view ></router-view>
  </div>
</template>


<script>
  import router from './../route/index.js';
  import Proxy from '../services/proxy.babel.js';
  import Common from '../public/javascripts/common.babel.js';
  import Uploader from '../services/upload.babel.js';
  import TaskView from './task/task.vue';
  import HomeView from './home/home.vue';
  import AppHeaderView from './header/header.vue';

  export default{
    data(){
      return {
        msg: 'Hello from BlueRobin',
        account: {}
      }
    },
    ready(){

      var vm = this;
      vm.$http.get('user/authenticate')
        .then(function(res){
          console.log(res);
          vm.$data.account = res.user;
        }, function(err){
          vm.$data.account = false;
          vm.$router.go('/login');
        })
      // Proxy.User.authenticate()
      // .done(function(res){
      //   if(res.success){
      //     _this.$data.account = res.user;
      //     window.account = res.user;
      //     // router.go('/task');
      //   }else{
      //       window.account = false;
      //       _this.$data.account = false;
      //       console.log(res);
      //     router.go('/login');
      //   }
      // })
      // .fail(function(){
      //     _this.$data.account = false;
      //     router.go('/login');
      // });

    },
    components: {
      // task: TaskView,
      appheader: AppHeaderView
    }
  }
