import * as mutationType from '../mutationType';

const state = {
  data: {},
  auth: false,
};

const mutations = {
  [mutationType.AUTHENTICATE](state, user) {
    console.log('mutations: AUTHENTICATE');
    state.data = user;
    state.auth = true;
    // state.route.path = 'lists';
  },

  [mutationType.AUTHENTICATE_ERROR](state, user) {
    console.log('mutations: AUTHENTICATE_ERROR');
    state.data = null;
    state.auth = false;
    // state.route.path = 'login';
  },
  [mutationType.LOGIN](state, user) {
    console.log('mutations: LOGIN');
    state.data = user;
    state.auth = true;
    // state.route.path = 'lists';
  }
};

export default {
  state,
  mutations
};
