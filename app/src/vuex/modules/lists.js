import * as mutationType from '../mutationType';

const state = {
  all: [],
};

// 创建一个对象存储一系列我们接下来要写的 mutation 函数
const mutations = {
  [mutationType.FETCH_LISTS](state, lists) {
    state.all = lists;
  },

  [mutationType.ADD_LIST](state, list) {
    console.log('mutations: ADD_LIST');
    console.log(list);
    state.all = state.all.concat(list);
  },

  [mutationType.DELETE_LIST](state, listid) {
    state.all = state.all.filter((item) => {
      return item.id !== listid;
    });
  }

};

export default {
  state,
  mutations
};
