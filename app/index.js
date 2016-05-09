require('./public/stylesheets/base.less');

import Vue from 'vue';
import Router from 'vue-router';
import VueResource from 'vue-resource';

import App from './components/app.vue';
import HomeView from './components/home/home.vue';
import FileView from './components/file/file.vue';
import TaskView from './components/task/task.vue';
import UserLogin from './components/user/login.vue';
import UserSignUp from './components/user/signup.vue';


Vue.use(Router);
Vue.use(VueResource);

Vue.http.options.root = 'http://zhanglun.daoapp.io/api';
Vue.http.headers.common['x-access-token'] = localStorage.token;

// Vue.http.interceptors.push({
// 	request: function(request){
// 		console.log(request);
// 		return request
// 	},
// 	response: function(response){
// 		console.log(response);
// 		return response
// 	}
// });

// routing
var router = new Router({ linkActiveClass: 'active' })


router.map({
  '/file': {
    component: FileView
  },
  '/task': {
    component: TaskView
  },
  '/login': {
    component: UserLogin
  },
  '/signup': {
    component: UserSignUp
  },
  '/home': {
    component: HomeView
  }
})

router.redirect({
  '*': '/task'
})


router.start(App, '#app');