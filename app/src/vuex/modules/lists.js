import {
  FETCH_LISTS,
  FETCH_LISTS_ERROR,

  ADD_LIST,
  ADD_LIST_ERROR,

  EDIT_LIST,
  EDIT_LIST_ERROR,

  DELETE_LIST,
  DELETE_LIST_ERROR,
} from '../mutationType';

// 创建一个对象来保存应用启动时的初始状态
const state = {
  // TODO: 放置初始状态
  all: [],
};

// 创建一个对象存储一系列我们接下来要写的 mutation 函数
const mutations = {
  // TODO: 放置我们的状态变更函数
  FETCH_LISTS(state, lists) {
    console.log('mutations: FETCH_LISTS');
    state.all = lists;
  },
};

export default {
	state,
	mutations
}