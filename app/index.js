require('./public/stylesheets/base.less');

import Vue from 'vue';
import Router from 'vue-router';
import VuewResource from 'vue-resource';

import App from './../components/app.vue';
import HomeView from './../components/home/home.vue';
import FileView from './../components/file/file.vue';
import TaskView from './../components/task/task.vue';
import UserLogin from './../components/user/login.vue';
import UserSignUp from './../components/user/signup.vue';


Vue.use(Router);
Vue.use(VueResource);
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