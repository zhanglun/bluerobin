require('./public/stylesheets/base.less');

import router from './route/index.js';
import App from './components/app.vue';

router.start(App, '#app');