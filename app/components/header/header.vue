<style>
</style>

<template>
<header class="mdl-layout__header">
  <div class="mdl-layout__header-row">
    <!-- Title -->
    <span class="mdl-layout-title">Title</span>
    <!-- Add spacer, to align navigation to the right -->
    <div class="mdl-layout-spacer"></div>
    <!-- Navigation. We hide it in small screens. -->
    <nav class="mdl-navigation mdl-layout--large-screen-only">
      <a class="mdl-navigation__link" href="" v-link="'task'">Task</a>
      <a class="mdl-navigation__link" href="" v-link="'login'">UserLogin</a>
      <a class="mdl-navigation__link" href="" v-on:click="logout">LogOut</a>
    </nav>
  </div>
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