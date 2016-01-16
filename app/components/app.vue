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
      <!-- <appHeader></appHeader> -->
      <router-view ></router-view>
      <!-- <bar></bar> -->
  </div>
</template>


<script>
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
    },
    components: {
      task: TaskView,
      appheader: AppHeaderView,
      bar: BarView
    }
  }
