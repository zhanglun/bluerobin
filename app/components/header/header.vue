<style>
</style>

<template>
<header>
<nav>
  <div class="container">
      <div class="nav-wrapper">
        <a href="#" class="brand-logo">BlueRobin</a>
        <ul id="nav-mobile" class="right hide-on-med-and-down">
          <li v-link-active><a class="" href="" v-link="{path: '/task', exact: true}">Task</a></li>
          <li v-if="user" v-link-active><a class="" href="" v-link="{path: '/login', exact: true}">UserLogin</a></li>
          <li v-link-active><a class="" href="" v-link="{path: '/signup', exact: true}">SignUp</a></li>
          <li v-if="!user"><a class="" href="" v-on:click="logout">LogOut</a></li>
        </ul>
      </div>
    </div>
    </nav>
</header>

</template>

<script>
export default {
  prop: ['user'],
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