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
    <div class="container">
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
    components: {
      task: TaskView,
      appheader: AppHeaderView
    }
  }
