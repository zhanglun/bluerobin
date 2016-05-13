<template>
  <div class="custom-container" transition="animate_routerview">
    <div class="mdl-grid">
      <div class="mdl-cell mdl-cell-6-col">
        <h3>注册</h3>
      </div>
      <div class="mdl-cell mdl-cell-6-col">
        <div class="mdl-textfield mdl-js-textfield">
            <input class="mdl-textfield__input" type="text" id="email" v-model="registerData.email"/>
            <label class="mdl-textfield__label" for="email">邮箱</label>
          </div>
        <div class="mdl-textfield mdl-js-textfield">
          <input class="mdl-textfield__input" type="password" id="password" v-model="registerData.password"/>
          <label class="mdl-textfield__label" for="password">密码</label>
        </div>
        <div class="input-field col s12">
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" v-on:click="signUp()">注册</button>
            <a v-link="'login'">已有账号？直接登录</a>
        </div>
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
				}
			}
		},

		ready(){
			console.log('sign up --->');
		},

		methods: {
			signUp(){
        let vm = this;
        let data = this.$data.registerData;
        vm.$http.post('user/signup', data)
          .then(function(res){
              localStorage.token = res.token;
              vm.$router.go('/task');
          }, function(err){
              console.log(xhr);
          });
			}
		}

	}
</script>
