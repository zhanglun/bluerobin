<template>

<div class="container">
    <div class="login-panle">
        <div class="login-panle-header">
            <h3>注册</h3>
        </div>
        <div class="login-panle-container">
            <div class="row">

                <div class="input-field col s12">
                    <input class="pure-input-1-2" type="text" id="email" v-model="registerData.email"/>
                    <label for="email">邮箱</label>
                </div>
            </div>
            <div class="row">
                <div class="input-field col s12">
                    <input class="pure-input-1-2" type="password" id="password" v-model="registerData.password"/>
                    <label for="password">密码</label>
                </div>
            </div>
            <div class="row">
                <div class="input-field col s12">
                    <button class="btn waves-effect waves-light" v-on:click="signUp()">注册</button>
                    <a v-link="'login'" class="btn waves-effect waves-light">已有账号？直接登录</a>
                </div>
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
        var data = this.$data.registerData;
        vm.$http.post('user/signup', data)
          .then(function(res){
              localStorage.token = res.token;
              router.go('/task');
          }, function(err){
              console.log(xhr);
          });
			}
		}

	}
</script>
