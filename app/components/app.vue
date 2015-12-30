<style lang="sass">
// @import "../public/stylesheets/base.scss";
 .wrapper{
  height: 100%;
 }

</style>

<template>
 <div class="wrapper">
    <appHeader></appHeader>
    <div class="cotainer">

    </div>
    <task></task>
 </div>

</template>


<script>
  import Common from '../public/javascripts/common.babel.js';
  import Task from './task/index.vue'
  import AppHeader from './header/header.vue';

  export default{
    data(){
      return {
        msg: 'Hello from BlueRobin'
      }
    },
    components: {
      task: Task,
      appheader: AppHeader
    }
  }
