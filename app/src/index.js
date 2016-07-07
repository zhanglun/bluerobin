require('./public/stylesheets/base.less');

import Vue from 'vue';
import Router from 'vue-router';
import VueResource from 'vue-resource';

import App from './components/app.vue';
import TaskView from './components/task/task.vue';
import CategoryView from './components/task/category.vue';
import UserLogin from './components/user/login.vue';
import UserSignUp from './components/user/signup.vue';

Vue.use(Router);
Vue.use(VueResource);
Vue.config.devtools = true;
Vue.config.debug = true;

// Vue.http.options.root = 'http://zhanglun.daoapp.io/api';
Vue.http.options.root = 'http://localhost:1234/api';

Vue.http.interceptors.push({
  request: function(request) {
    Vue.http.headers.common['x-access-token'] = window.localStorage.token;
    return request;
  },
  response: function(response) {
    return response;
  },
});

// routing
var router = new Router({
  linkActiveClass: 'side-menu__item--active',
});

router.map({
  '/lists': {
    component: TaskView,
    subRoutes: {
      '/:id': {
        name: 'list',
        component: CategoryView,
      },
    },
    auth: true,
  },
  '/login': {
    component: UserLogin,
  },
  '/signup': {
    component: UserSignUp,
  },
});

router.redirect({
  '*': '/lists',
});

router.beforeEach((transition) => {
  console.log('--->');
  if (transition.to.path === '/forbidden') {
    transition.abort();
  } else {
    transition.next();
  }
})

router.start(App, '#app');
