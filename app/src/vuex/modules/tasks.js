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
    if (query.completed) {
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

  [mutationType.ADD_TASK](state, task) {
    state.all = [task].concat(state.all);
  },

  // [mutationType.TOGGLE_TASK](state, task) {
  // },

  [mutationType.EDIT_TASK](state, task) {
    state.all.map((item) => {
      if (item.id === task.id) {
        return task;
      }
      return item;
    });
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
