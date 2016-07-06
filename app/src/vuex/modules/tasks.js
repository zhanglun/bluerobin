import * as mutationType from '../mutationType';

const state = {
  all: [],
};

const mutations = {
  [mutationType.FETCH_TASKS](state, tasks) {
    state.all = tasks;
  }
};
console.log(mutations);

export default {
  state,
  mutations,
};
