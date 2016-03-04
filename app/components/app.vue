<style lang="sass">

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
      <appHeader></appHeader>
<div class="mdl-grid">
  <div class="mdl-cell mdl-cell--6-col">CS 6</div>
  <div class="mdl-cell mdl-cell--4-col">CS 4</div>
  <div class="mdl-cell mdl-cell--2-col">CS 2</div>
</div> 
      <router-view ></router-view>
      <!-- <bar></bar> -->
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
  import BarView from './bar/navbar.vue';



  export default{
    data(){
      return {
        msg: 'Hello from BlueRobin'
      }
    },
    ready(){
      /*Proxy.User.authenticate()
      .then(function(res){
        console.log(res);
        if(res.success){
          router.go('/task');
        }else{
          router.go('/login');
        }
      });*/
      
    },
    components: {
      task: TaskView,
      appheader: AppHeaderView,
      bar: BarView
    }
  }
