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
  <div class="mdl-layout mdl-js-layout">
      <appHeader :account="account"></appHeader>
      <div class="mdl-layout__content">
        <div class="page-content">
          <router-view ></router-view>
        </div>
      </div>
  </div>
</template>


<script>
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

      componentHandler.upgradeDom();

      var vm = this;
      vm.$http.get('user/authenticate')
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
