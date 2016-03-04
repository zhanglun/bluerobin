require('./public/stylesheets/base.scss');

import router from './route/index.js';
import App from './components/app.vue';


router.redirect({
  '*': '/login'
})

router.start(App, '#app');


// 入口
// var BlueRobin = new Vue({
//   el: 'body',
//   ready(){
//   },
//   components: {
//     app: App
//   }
// });

