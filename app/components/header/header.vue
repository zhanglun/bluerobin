<style>
</style>

<template>
<header>
<nav>
  <div class="container">
      <div class="nav-wrapper">
        <a href="#" class="brand-logo">BlueRobin</a>
        <ul id="nav-mobile" class="right hide-on-med-and-down">
          <li><a class="" href="" v-link="'task'">Task</a></li>
          <li><a class="" href="" v-link="'login'">UserLogin</a></li>
          <li><a class="" href="" v-link="'signup'">SignUp</a></li>
          <li><a class="" href="" v-on:click="logout">LogOut</a></li>
        </ul>
      </div>
    </div>
    </nav>
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