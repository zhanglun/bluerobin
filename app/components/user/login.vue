<template>
  <div class="container" transition="animate_routerview">
    <div class="login-form">
      <div class="login-flash">What's your email address?</div>
      <input type="text" placeholder="Email" v-model="user.username"/>
      <div class="login-flash">What's your password</div>
      <input type="password" placeholder="Password" v-model="user.password"/>
      <button type="button" v-on:click="doLogin">Go -></button>
    </div>
  </div>
</template>
<script>
  import route from '../../route/index.js';
  import Proxy from '../../services/proxy.babel.js';
  export default {
    data(){
      return {
        user: {
          username: '',
          password: '',
        }
      }
    },
    ready(){
      console.log('login');
      // doLogin();
    },
    methods: {
      doLogin: function(){
        Proxy.User.login(this.user)
        .then(function(res){
          localStorage.token = res.token;
          route.go('/task');
        });
      }
    }      
  }
</script>
<style lang="sass">
 .login-form {
  width:400px;
  padding:14px;
  box-sizing: box-sizing;
  margin: 0 auto;
  background: rgba(255,255,255,0.8);
 }
</style>