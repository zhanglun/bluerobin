<style lang="sass">

 .wrapper{
  height: 100%;
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
      <home></home>
      <!-- <appHeader></appHeader> -->
      <router-view ></router-view>
      <bar></bar>
  </div>
</template>


<script>
  import Common from '../public/javascripts/common.babel.js';
  import Uploader from '../services/upload.babel.js';
  import TaskView from './task/index.vue';
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
      var uploader = Uploader();
      // uploader.init();
      uploader.bind('FilesAdded', function() {
        console.log('hello man,a file is uploaded');
      });
    },
    components: {
      home: HomeView,
      task: TaskView,
      appheader: AppHeaderView,
      bar: BarView;
    }
  }
