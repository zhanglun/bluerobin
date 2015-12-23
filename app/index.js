console.log('welcome to bluerobin!~~');
var Vue = require('vue');
var App = require('./components/app.vue');

// 入口
new Vue({
  el: 'body',
  ready: function(){
    console.log(11);
  },
  components: {
    app: App
  }
});