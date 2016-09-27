require('./public/stylesheets/style.less');

import Vue from 'vue';
import Router from 'vue-router';
import VueResource from 'vue-resource';

import AppView from './components/App.vue';
import IndexView  from './components/Index.vue';
import MainContainerView from './components/mainContainer.vue';
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
        component: MainContainerView,
      },
    },
    auth: true,
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

router.afterEach(function (transition) {
  console.log('成功浏览到: ' + transition.to.path)
})

router.start(IndexView, '#app');
