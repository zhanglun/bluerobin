require('./public/stylesheets/style.less');

import Vue from 'vue';
import Router from 'vue-router';
import VueResource from 'vue-resource';

import AppView from './components/App.vue';
import IndexView  from './components/Index.vue';
import TaskListView from './components/TaskList.vue';
import CollectionsView from './components/Collections.vue';
import UserLoginView from './components/user/login.vue';
import UserSignUp from './components/user/signup.vue';

Vue.use(Router);
Vue.use(VueResource);
Vue.config.devtools = true;
Vue.config.debug = true;

// routing
var router = new Router({
  linkActiveClass: 'side-menu__item--active',
});

router.map({
  '/lists': {
    component: AppView,
    subRoutes: {
      '/:id': {
        name: 'list',
        component: TaskListView,
      },
    },
    auth: true,
  },
  '/collections': {
    component: AppView,
    subRoutes: {
      '/archive': {
        name: 'archive',
        component: CollectionsView,
      },
      // '/search': {
      //   name: 'search',
      //   component: TaskListView,
      // },
      '/trash': {
        name: 'trash',
        component: CollectionsView,
      },
    },
  },
  '/login': {
    component: UserLoginView
  },
  '/signup': {
    component: UserSignUp,
  },
});

router.redirect({
  '*': '/lists',
});

router.start(IndexView, '#app');
