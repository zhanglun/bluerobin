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
  },

  [mutationType.EDIT_LIST](state, list) {
    state.all.map((item) => {
      if (item.id === list.id) {
        return list;
      }
      return item;
    });
  },

  [mutationType.UPDATE_LIST](state, data) {
    console.log('mutations: UPDATE_LIST');
    console.log(data);
    state.all.map((item) => {
      if (item.id === data.id) {
        switch (data.type) {
          case 'total':
            item.task_count_total += data.update;
            break;
          case 'archived':
            item.task_count_archived += data.update;
          default:
            break;
        }
        return item;
      }
      return item;
    });
  }

};

export default {
  state,
  mutations
};
