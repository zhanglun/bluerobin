import * as mutationType from '../mutationType';

const state = {
  all: [],
};

const mutations = {
  [mutationType.FETCH_TASKS](state, tasks) {
    console.log('mutations: FETCH_TASKS');
    // state.all = state.all.concat(tasks);
    state.all = tasks;
  }
};

export default {
  state,
  mutations,
};
