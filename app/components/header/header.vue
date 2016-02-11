<style>
 header{
  width: 100%;
  height:50px;
  background: rgba(255, 255, 255, 0.6);
 }
</style>

<template>

    <header>
      <a v-link="'task'">Task</a>
      <a v-link="'login'">UserLogin</a>
      <span v-on:click="logout">LogOut</span>
    </header>

</template>

<script>
export default {
  data(){
    return {
    };
  },
  ready(){
  },
  methods: {
    logout(){
      
    }
  }

};

</script>