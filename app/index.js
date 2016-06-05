require('./public/stylesheets/base.less');

import Vue from 'vue';
import Router from 'vue-router';
import VueResource from 'vue-resource';
import {createStore} from 'redux';

import App from './components/app.vue';
import HomeView from './components/home/home.vue';
import FileView from './components/file/file.vue';
import TaskView from './components/task/task.vue';
import CategoryView from './components/task/category.vue';
import UserLogin from './components/user/login.vue';
import UserSignUp from './components/user/signup.vue';


Vue.use(Router);
Vue.use(VueResource);

// Vue.http.options.root = 'http://zhanglun.daoapp.io/api';
Vue.http.options.root = 'http://localhost:1234/api';

Vue.http.interceptors.push({
	request: function(request){
    Vue.http.headers.common['x-access-token'] = localStorage.token;
		return request;
	},
	response: function(response){
		return response;
	}
});

// routing
var router = new Router({ linkActiveClass: 'side-menu__item--active' });


router.map({
  // '/file': {
  //   component: FileView
  // },
  '/lists': {
    component: TaskView,
    subRoutes: {
      '/:id': {
        name: 'list',
        component: CategoryView
      }
    }
  },
  '/login': {
    component: UserLogin
  },
  '/signup': {
    component: UserSignUp
  },
  // '/home': {
  //   component: HomeView
  // }
});

router.redirect({
  '*': '/lists/inbox',
});


router.start(App, '#app');

function counter(state = 0, action) {
  switch (action.type) {
  case 'INCREMENT':
    return state + 1;
  case 'DECREMENT':
    return state - 1;
  default:
    return state;
  }
}

let store = createStore(counter);

store.subscribe(() =>
  console.log(store.getState())
);

// The only way to mutate the internal state is to dispatch an action.
// The actions can be serialized, logged or stored and later replayed.
// store.dispatch({ type: 'INCREMENT' });
// // 1
// store.dispatch({ type: 'INCREMENT' });
// // 2
// store.dispatch({ type: 'DECREMENT' });
// 1
