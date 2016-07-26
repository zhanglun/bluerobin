<template>
  <div class="custom-container login-form" transition="animate_routerview">
    <div class="mdl-grid">
      <div class="mdl-cell mdl-cell-6-col">
        <h3>登录</h3>
      </div>
    </div>
    <div class="mdl-grid">
      <div class="mdl-cell mdl-cell-6-col">
        <div class="robin-textfield">
          <label class="mdl-textfield__label" for="email">Email</label>
          <input class="robin-textfield--input robin-textfield--input_default" type="text" id="email" v-model="account.username">
        </div>
      </div>
    </div>
    <div class="mdl-cell mdl-cell-6-col">
      <div class="mdl-textfield mdl-js-textfield">
        <label class="mdl-textfield__label" for="password">Password</label>
        <input class="robin-textfield--input robin-textfield--input_default" type="password" id="password" v-model="account.password">
      </div>
    </div>
    <div class="mdl-cell mdl-cell-6-col">
      <div class="robin-textfield">
        <button class="robin-btn robin-btn__default"  v-on:click="doLogin">GO!</button>
        <a v-link="{path: '/signup', exact: true}">还没有账号？立马注册</a>
      </div>
    </div>
  </div>
</div>
</template>
<script>
  import * as userActions from '../../vuex/actions/user';
  import * as getters from '../../vuex/getter';
  export default {
    data() {
      return {
        account: {
          username: '',
          password: '',
        }
      };
    },
    vuex: {
      actions: {
        login: userActions.login,
      },
      getters: {
        user: getters.getUserInfo
      }
    },
    ready() {
    },
    watch: {
      user: function(newVal, old) {
        if (!newVal) {
          this.$router.go('login');
        }
        if (newVal && newVal.username) {
          this.$router.go('lists');
        }
      }
    },
    methods: {
      doLogin() {
        this.login(this.account);
      }
    }
  };
</script>
<style lang="less">
 .login-form {
  width:400px;
  padding:14px;
  box-sizing: border-box;
  margin: 120px auto;
  background: rgba(255,255,255,0.8);
 }
</style>
