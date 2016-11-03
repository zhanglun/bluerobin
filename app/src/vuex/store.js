import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
Vue.config.debug = true;
const debug = process.env.NODE_ENV !== 'production';

import user from './modules/user';
import lists from './modules/lists';
import tasks from './modules/tasks';



// 整合初始状态和变更函数，我们就得到了我们所需的 store
// 至此，这个 store 就可以连接到我们的应用中
export default new Vuex.Store({
  modules: {
    user,
    lists,
    tasks,
  },
});
