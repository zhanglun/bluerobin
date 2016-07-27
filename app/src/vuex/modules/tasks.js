import * as mutationType from '../mutationType';
const state = {
  active: [],
  archieved: [],
  completed: [],
  all: [],
  taskDetail: null,
  showDetail: false,
};

const mutations = {
  [mutationType.FETCH_TASKS](state, query, tasks) {
    console.log('mutations: FETCH_TASKS');
    // if (query.completed) {
    //   state.completed = tasks;
    // } else {
    //   state.active = tasks;
    // }
    if (query.completed && query.list_id) {
      state.all = state.all.concat(tasks);
    } else {
      state.all = tasks;
    }
  },
  [mutationType.FETCH_TASK_DETAIL](state, task) {
    console.log('mutations: FETCH_TASK_DETAIL');
    state.showDetail = true;
    state.taskDetail = task;
  },

  [mutationType.HIDE_DETAIL_WINDOW](state) {
    state.showDetail = false;
  },

  [mutationType.ADD_TASK](state, task) {
    state.all = [task].concat(state.all);
  },

  // [mutationType.TOGGLE_TASK](state, task) {
  // },

  [mutationType.EDIT_TASK](state, task) {
    console.log('mutations: EDIT_TASK');
    state.all = state.all.map((item) => {
      if (item.id === task.id) {
        return task;
      }
      return item;
    });
    state.taskDetail = task;
  },

  [mutationType.DELETE_TASK](state, task) {
    state.all = state.all.filter((item) => {
      return item.id !== task.id;
    });
  }

};

export default {
  state,
  mutations,
};
