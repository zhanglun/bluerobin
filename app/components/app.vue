<style lang="sass">

 .wrapper{
  height: 100%;
 }
 .animate_routerview-transition{
  transition: all 0.4s ease;
 }
 .animate_routerview-enter, .animate_routerview-leave{
  height: 0;
  opacity: 0;
 }

</style>

<template>
 <div class="wrapper">
    <appHeader></appHeader>
    <router-view  transition="animate_routerview"></router-view>
    <!-- <task></task> -->
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
    components: {
      task: TaskView,
      appheader: AppHeaderView
    }
  }
