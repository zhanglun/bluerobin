import {
  AUTHENTICATE,
  AUTHENTICATE_ERROR,
} from '../mutationType';

const state = {
  data: {},
}

const mutations = {
  AUTHENTICATE(state, account) {
    console.log('mutations: AUTHENTICATE');
    console.log(account);
    state.data = account.user;
  },

  AUTHENTICATE_ERROR(state, account) {
    console.log('mutations: AUTHENTICATE_ERROR');
    state.data = null;
  },
};

export default {
  state,
  mutations
}
