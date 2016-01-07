import Vue from 'vue';
import Router from 'vue-router';

import App from './components/app.vue';
import HomeView from './components/home/home.vue';
import TaskView from './components/task/index.vue';
import UserLogin from './components/user/login.vue';

require('./public/stylesheets/base.scss');

Vue.use(Router);

// routing
var router = new Router()

router.map({
  '/task': {
    component: TaskView,
    activeLinkClass: "asdfasdf"
  },
  '/login': {
    component: UserLogin
  },
  '/home': {
    component: HomeView
  }
})

router.redirect({
  '*': '/home'
})

router.start(App, '#app')

// 入口
var BlueRobin = new Vue({
  el: 'body',
  ready(){
  },
  components: {
    app: App
  }
});