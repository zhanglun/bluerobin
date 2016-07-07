import * as mutationType from '../mutationType';

const state = {
  data: {},
};

const mutations = {
  [mutationType.AUTHENTICATE](state, user) {
    console.log('mutations: AUTHENTICATE');
    state.data = user;
  },

  [mutationType.AUTHENTICATE_ERROR](state, user) {
    console.log('mutations: AUTHENTICATE_ERROR');
    state.data = null;
  },
  [mutationType.LOGIN](state, user) {
    console.log('mutations: LOGIN');
    state.data = user;
  }
};

export default {
  state,
  mutations
};
