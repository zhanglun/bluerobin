require('./public/stylesheets/style.less');

import Vue from 'vue';
import Router from 'vue-router';

import App from './components/app.vue';
import TaskView from './components/task/task.vue';
import TaskListView from './components/task/taskList.vue';
import CollectionsView from './components/task/collections.vue';
import UserLogin from './components/user/login.vue';
import UserSignUp from './components/user/signup.vue';

Vue.use(Router);
Vue.config.devtools = true;
Vue.config.debug = true;

// routing
var router = new Router({
  linkActiveClass: 'side-menu__item--active',
});

router.map({
  '/': {
    component: App,
  },
  '/lists': {
    component: TaskView,
    subRoutes: {
      '/completed': {
        name: 'completed',
        component: CollectionsView,
      },
      '/search': {
        name: 'search',
        component: TaskListView,
      },
      '/trash': {
        name: 'trash',
        component: TaskListView,
      },
      '/:id': {
        name: 'list',
        component: TaskListView,
      },
    },
    auth: true,
  },
  '/collections': {
    component: TaskView,
    subRoutes: {
      '/completed': {
        name: 'completed',
        component: CollectionsView,
      },
      '/search': {
        name: 'search',
        component: TaskListView,
      },
      '/trash': {
        name: 'trash',
        component: TaskListView,
      },
    },
  },
  '/login': {
    component: UserLogin,
  },
  '/signup': {
    component: UserSignUp,
  },
});

router.redirect({
  '*': '/',
});

router.start(App, '#app');

// sync(store, router);
