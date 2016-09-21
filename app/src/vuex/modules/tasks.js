import * as mutationType from '../mutationType';
const state = {
  active: [],
  archieved: [],
  all: [],
  taskDetail: null,
  showDetail: false,
  isRequestingTasks: false,
  isRequestingTasksDetail: false,
};

const mutations = {
  [mutationType.REQUST_TASKS](state) {
    state.isRequestingTasks = true;
  },
  [mutationType.REQUST_TASKS_DETAIL](state) {
    state.isRequestingTasksDetail = true;
  },
  [mutationType.RECEIVE_TASKS](state, query, tasks) {
    state.showDetail = false;
    state.isRequestingTasks = false;
    if (query.archived && query.list_id) {
      state.all = state.all.concat(tasks);
    } else {
      state.all = tasks;
    }
  },

  [mutationType.RECEIVE_TASK_DETAIL](state, task) {
    console.log('mutations: RECEIVE_TASK_DETAIL');
    state.showDetail = true;
    state.isRequestingTasksDetail = false;
    state.taskDetail = task;
  },

  [mutationType.HIDE_DETAIL_WINDOW](state) {
    state.showDetail = false;
  },

  [mutationType.ADD_TASK](state, task) {
    state.all = [task].concat(state.all);
  },

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
    console.log('mutations: DELETE_TASK');
    state.all = state.all.filter((item) => {
      return item.id !== task.id;
    });
  },

  [mutationType.RESET_TASKS](state, task) {
    state.all = [];
  },

};

export default {
  state,
  mutations,
};
