<template>
  <div class="custom-container" transition="animate_routerview">
    <div class="mdl-grid">
      <div class="mdl-cell mdl-cell-6-col">
        <h3>登录</h3>
      </div>
    </div>
    <div class="mdl-grid">
      <div class="mdl-cell mdl-cell-6-col">
          <div class="mdl-textfield mdl-js-textfield">
            <input class="mdl-textfield__input" type="text" id="email" v-model="user.username">
            <label class="mdl-textfield__label" for="email">Email</label>
            </div>
        </div>
      </div>
      <div class="mdl-cell mdl-cell-6-col">
        <div class="mdl-textfield mdl-js-textfield">
          <input class="mdl-textfield__input" type="password" id="password" v-model="user.password">
          <label class="mdl-textfield__label" for="password">Password</label>
        </div>
      </div>
      <div class="mdl-cell mdl-cell-6-col">
        <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent"  v-on:click="doLogin">GO!</button>
        <a v-link="{path: '/signup', exact: true}">还没有账号？立马注册</a>
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
      componentHandler.upgradeDom();
    },
    methods: {
      doLogin(){
        let vm = this;
        vm.$http.post('user/login', this.user)
        .then(function(res){
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
