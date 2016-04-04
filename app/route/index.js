
import Vue from 'vue';
import Router from 'vue-router';
import App from './../components/app.vue';
import HomeView from './../components/home/home.vue';
import FileView from './../components/file/file.vue';
import TaskView from './../components/task/task.vue';
import UserLogin from './../components/user/login.vue';
import UserSignUp from './../components/user/signup.vue';


Vue.use(Router);

// routing
var router = new Router({ linkActiveClass: 'active' })

export default router;

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

