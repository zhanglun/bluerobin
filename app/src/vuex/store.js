import Vue from 'vue';
import Vuex from 'vuex';

Vue.config.devtools = true;

import user from './modules/user';
import lists from './modules/lists';
import tasks from './modules/tasks';

// const logger = Vuex.createLogger({
//   collapsed: false, // 自动展开输出的 mutations
//   transformer(state) {
//     // 输出前对 state 进行转换
//     // 比如说只返回一个 sub-tree
//     return state.subTree;
//   },
//   mutationTransformer(mutation) {
//     // mutations 会格式化为 { type, payload } 输出
//     // 我们可以按照自己的需求格式化成任何我们想要的结构
//     return mutation.type;
//   }
// });

const logger = {
  onInit(state) {
    console.log('----?logger');
    console.log(state);
  },
  onMutation(mutation, state) {
    console.log(mutation);
  }
};

Vue.use(Vuex);

// 整合初始状态和变更函数，我们就得到了我们所需的 store
// 至此，这个 store 就可以连接到我们的应用中
export default new Vuex.Store({
  modules: {
    user,
    lists,
    tasks,
  },
  middlewares: [logger],
});
