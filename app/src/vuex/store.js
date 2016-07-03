import Vue from 'vue';
import Vuex from 'vuex';
import {
  AUTHENTICATE,
  AUTHENTICATE_ERROR,
  FETCH_LISTS,
  FETCH_LISTS_ERROR,

  ADD_LIST,
  ADD_LIST_ERROR,

  EDIT_LIST,
  EDIT_LIST_ERROR,

  DELETE_LIST,
  DELETE_LIST_ERROR,
} from '../constants/mutationType';

Vue.use(Vuex);

// 创建一个对象来保存应用启动时的初始状态
const state = {
  // TODO: 放置初始状态
  account: {
    username: '',
  },
  lists: [],
};

// 创建一个对象存储一系列我们接下来要写的 mutation 函数
const mutations = {
  // TODO: 放置我们的状态变更函数
  AUTHENTICATE(state, account) {
    console.log('mutations: AUTHENTICATE');
    state.account = account;
  },

  AUTHENTICATE_ERROR(state, account) {
    console.log('mutations: AUTHENTICATE_ERROR');
    state.account = {user: null};
  },

  FETCH_LISTS(state, lists) {
    console.log('mutations: FETCH_LISTS');
    state.lists = lists;
  },
};

// 整合初始状态和变更函数，我们就得到了我们所需的 store
// 至此，这个 store 就可以连接到我们的应用中
export default new Vuex.Store({
  state,
  mutations
});
