<template>

<div class="container">
    <div class="login-panle">
        <div class="login-panle-header">
            <h3>注册</h3>
        </div>
        <div class="login-panle-container">
<!--             <div class="row">

                <div class="input-field col s12">
                    <input class="pure-input-1-2" type="text" id="username" ng-model="registerData.username"/>
                    <label for="username">用户名</label>
                </div>
            </div> -->
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
	import Proxy from '../../services/proxy.babel.js';
	import Vue from 'vue';
	import router from './../../route/index.js';

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
				let root = CONFIG.APIPROOT;
				let _this = this;
				console.log('go');
				$.ajax({
					type: 'post',
					url: root + '/user/signup',
					data: _this.$data.registerData,
					dataType: 'json'
				})
				.done(function(res){
					console.log(res);
				})
			}
		}

	}
</script>
