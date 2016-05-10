<template>
  <div class="container mdl-layout__content" transition="animate_routerview">
    <div class="login-form">
        <div class="row">
            <div class="input-field col s12">
              <input class="validate" type="text" id="email" v-model="user.username">
              <label for="email">Email</label>
            </div>
        </div>
        <div class="row">
            <div class="input-field col s12">
                <input class="validate" type="password" id="password" v-model="user.password">
                <label for="password">Password</label>
            </div>
        </div>
        <div class="row">
            <div class="col ">
                <button class="waves-effect waves-light btn"  v-on:click="doLogin">GO!</button>
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
