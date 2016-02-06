
import Vue from 'vue';
import Router from 'vue-router';

import App from './../components/app.vue';
import HomeView from './../components/home/home.vue';
import TaskView from './../components/task/task.vue';
import UserLogin from './../components/user/login.vue';


Vue.use(Router);

// routing
var router = new Router()

export default router;

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
  '*': '/task'
})

