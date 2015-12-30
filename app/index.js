import Vue from 'vue';
import App from './components/app.vue';

require('./public/stylesheets/base.scss');
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