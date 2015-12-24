<style lang="sass">
 .wrapper{
  height: 100%;
 }
</style>

<template>
 <div class="wrapper">
    <header>
    <task></task>
 </div>

</template>


<script>
  import Common from '../public/javascripts/common.babel.js';
  import Task from './task/index.vue'

  export default{
    data(){
      return {
        msg: 'Hello from BlueRobin'
      }
    },
    components: {
      task: Task
    }
  }
