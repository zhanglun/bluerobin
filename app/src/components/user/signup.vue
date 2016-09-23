<template>
  <div class="custom-container login-form" transition="animate_routerview">
    <div class="mdl-grid">
      <div class="mdl-cell mdl-cell-6-col">
        <h3>注册</h3>
      </div>
      <div class="robin-textfield">
        <label class="mdl-textfield__label" for="email">邮箱</label>
        <input class="robin-textfield--input robin-textfield--input_default" type="text" id="email" v-model="registerData.email"/>
      </div>
      <div class="robin-textfield">
        <label class="mdl-textfield__label" for="password">密码</label>
        <input class="robin-textfield--input robin-textfield--input_default" type="password" id="password" v-model="registerData.password"/>
      </div>
      <div class="robin-textfield">
        <button class="robin-btn robin-btn__default" v-on:click="signUp()">注册</button>
        <a v-link="'login'">已有账号？直接登录</a>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        registerData: {
          email: '',
          password: '',
        },
      };
    },

    ready() {
      console.log('sign up --->');
    },

    methods: {
      signUp() {
        let vm = this;
        let data = this.$data.registerData;
        // vm.$http.post('http://zhanglun.daoapp.io/api/users/signup', data)
        vm.$http.post('http://localhost:1234/api/users/signup', data)
        .then(res => {
          localStorage.token = res.token;
          vm.$router.go('/lists');
        }, err => {
          console.log(err);
        });
      },
    },
  };
</script>
