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

    <appHeader></appHeader>

    <div id="container">
        <span id="browse">[Browse...]</span>
        <span id="start-upload">[Start Upload]</spam>

    <router-view ></router-view>
       </div>

</div>
</template>


<script>
  import Common from '../public/javascripts/common.babel.js';
  import TaskView from './task/index.vue'
  import AppHeaderView from './header/header.vue';



  export default{
    data(){
      return {
        msg: 'Hello from BlueRobin'
      }
    },
    ready(){
      var uploader = uploadrInit();
      // uploader.init();
      uploader.bind('FileUploaded', function() {
        console.log('hello man,a file is uploaded');
    });
    },
    components: {
      task: TaskView,
      appheader: AppHeaderView
    }
  }
