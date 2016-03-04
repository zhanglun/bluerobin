<template>
  <div class="container" transition="animate_routerview">
    <div class="login-form">
      <div class="login-flash">What's your email address?</div>
        <div class="mdl-textfield mdl-js-textfield">
          <input class="mdl-textfield__input" type="text" v-model="user.username">
          <label class="mdl-textfield__label" for="sample1">Email</label>
        </div>
      <div class="login-flash">What's your password</div>
      <div class="mdl-textfield mdl-js-textfield">
        <input class="mdl-textfield__input" type="text" v-model="user.password">
        <label class="mdl-textfield__label" for="sample1">Password</label>
      </div>
      <div>
        <!-- Accent-colored raised button with ripple -->
        <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent"  v-on:click="doLogin">
        GO!
        </button>
      </div>
      
      
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