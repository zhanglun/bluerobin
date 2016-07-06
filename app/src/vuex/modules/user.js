import {
  AUTHENTICATE,
  AUTHENTICATE_ERROR,
} from '../mutationType';

const state = {
  data: {},
};

const mutations = {
  AUTHENTICATE(state, user) {
    console.log('mutations: AUTHENTICATE');
    state.data = user;
  },

  AUTHENTICATE_ERROR(state, user) {
    console.log('mutations: AUTHENTICATE_ERROR');
    state.data = null;
  },
  LOGIN(state, user) {
    console.log('mutations: LOGIN');
    state.data = user;
  }
};

export default {
  state,
  mutations
};
