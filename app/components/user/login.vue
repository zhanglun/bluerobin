<template>
  <div class="container mdl-layout__content" transition="animate_routerview">
    <div class="login-form">
        <div class="row">
            <div class="mdl-textfield mdl-js-textfield">
              <input class="mdl-textfield__input" type="text" id="email" v-model="user.username">
              <label class="mdl-textfield__label" for="email">Email</label>
            </div>
        </div>
        <div class="row">
            <div class="mdl-textfield mdl-js-textfield">
                <input class="mdl-textfield__input" type="password" id="password" v-model="user.password">
                <label class="mdl-textfield__label" for="password">Password</label>
            </div>
        </div>
        <div class="row">
            <div class="col ">
                <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent"  v-on:click="doLogin">GO!</button>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
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
    },
    methods: {
      doLogin(){
        let vm = this;
        vm.$http.post('user/login', this.user)
        .then(function(res){
          console.log(res);
          localStorage.token = res.data.token;
          vm.$router.go('/task');
        }, function(){

        })
      }
    }
  }
</script>
<style lang="less">
 .login-form {
  width:400px;
  padding:14px;
  box-sizing: box-sizing;
  margin: 0 auto;
  background: rgba(255,255,255,0.8);
 }
</style>
