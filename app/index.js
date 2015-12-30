import Vue from 'vue';
import Router from 'vue-router';
import App from './components/app.vue';
import TaskView from './components/task/index.vue';
import UserLogin from './components/user/login.vue';

require('./public/stylesheets/base.scss');

Vue.use(Router);

// routing
var router = new Router()

router.map({
  '/task': {
    component: TaskView
  },
  '/login': {
    component: UserLogin
  }
})

router.redirect({
  '*': '/login'
})

router.start(App, '#app')

// 入口
new Vue({
  el: 'body',
  ready(){
    console.log(11);
  },
  components: {
    app: App
  }
});