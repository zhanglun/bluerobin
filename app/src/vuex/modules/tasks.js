import * as mutationType from '../mutationType';

const state = {
  active: [],
  archieved: [],
  completed: [],
};

const mutations = {
  [mutationType.FETCH_TASKS](state, tasks) {
    console.log('mutations: FETCH_TASKS');
    tasks.map((task) => {
      if (!task.completed) {
        state.active.push(task);
        return task;
      }
      if (task.completed && task.archieved) {
        state.archieved.push(task);
        return task;
      }
      if (task.completed && !task.archieved) {
        state.completed.push(task);
        return task;
      }
      return task;
    });
  },

  [mutationType.ADD_TASK](state, task) {
    state.all = [task].concat(state.all);
  },

  [mutationType.EDIT_TASK](state, task) {
    state.all.map((item) => {
      if (item.id === task.id) {
        return task;
      }
      return item;
    });
  }

};

export default {
  state,
  mutations,
};
